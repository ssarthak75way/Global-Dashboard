import { useState, useEffect } from "react";
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import api from "../api/axios";
import { useForm } from "react-hook-form";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    Card,
    CardContent,
    Chip,
    Fade,
    Tabs,
    Tab,
    useMediaQuery,
    useTheme as useMuiTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DragIcon from "@mui/icons-material/DragIndicator";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CustomAlert from "../components/common/CustomAlert";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";
import KanbanColumn from "../components/board/KanbanColumn";
import { Task } from "../components/board/TaskCard";

const COLUMNS = [
    { id: 'ToDo', title: 'To Do' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'Done', title: 'Done' }
];

const Board = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [mobileTab, setMobileTab] = useState(0);

    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    const { showToast } = useToast();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const { register, handleSubmit, reset, formState: { errors } } = useForm<{ title: string }>();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get("/tasks");
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const onAddTask = async (data: { title: string }) => {
        try {
            const { data: newTask } = await api.post("/tasks", { title: data.title, status: "ToDo" });
            setTasks([...tasks, newTask]);
            reset();
            showToast("Task added successfully", "info");
            if (isMobile) setMobileTab(0);
        } catch (error) {
            console.error("Error adding task", error);
            showToast("Failed to add task", "error");
        }
    };

    const handleDeleteClick = (id: string) => {
        setTaskToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!taskToDelete) return;
        try {
            await api.delete(`/tasks/${taskToDelete}`);
            setTasks(tasks.filter(t => t._id !== taskToDelete));
            showToast("Task deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting task", error);
            showToast("Failed to delete task", "error");
        } finally {
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    };

    const findContainer = (id: string) => {
        if (COLUMNS.find(c => c.id === id)) return id;
        return tasks.find(t => t._id === id)?.status;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        setTasks(prev => {
            const activeIndex = prev.findIndex(t => t._id === activeId);
            const overIndex = prev.findIndex(t => t._id === overId);

            let newIndex;
            if (COLUMNS.find(c => c.id === overId)) {
                newIndex = prev.length;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : prev.length;
            }

            const updatedTasks = [...prev];
            const [movedTask] = updatedTasks.splice(activeIndex, 1);
            movedTask.status = overContainer;
            updatedTasks.splice(newIndex, 0, movedTask);

            return updatedTasks;
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (activeContainer && overContainer) {
            const activeIndex = tasks.findIndex(t => t._id === activeId);
            const overIndex = tasks.findIndex(t => t._id === overId);

            if (activeIndex !== overIndex) {
                setTasks(items => arrayMove(items, activeIndex, overIndex));
            }

            // Sync with backend
            const updatedTasks = tasks.map((t, idx) => ({
                _id: t._id,
                status: t.status,
                order: idx
            }));

            try {
                await api.put("/tasks/reorder", { tasks: updatedTasks });
            } catch (error) {
                console.error("Error syncing tasks", error);
                showToast("Failed to sync task order", "warning");
                fetchTasks(); // Rollback
            }
        }
    };

    const boardStyles = {
        container: {
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: "100vh",
            bgcolor: 'background.default',
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.05) 1px, transparent 0)',
            backgroundSize: '32px 32px',
            display: 'flex',
            flexDirection: 'column'
        },
        header: {
            mb: { xs: 3, md: 6 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 4 }
        },
        headerTitle: {
            fontWeight: 950,
            fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
            letterSpacing: -2,
            lineHeight: 1,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2
        },
        headerSubtitle: {
            fontWeight: 600,
            opacity: 0.7,
            maxWidth: 600,
            lineHeight: 1.6,
            fontSize: { xs: '0.9rem', md: '1rem' }
        },
        addTaskPaper: {
            p: { xs: 0.5, sm: 1.5 },
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', md: 450 },
            borderRadius: { xs: 2, sm: 4 },
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
            bgcolor: (theme: any) => theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)'
        },
        addTaskInput: {
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& input': { fontWeight: 600, fontSize: { xs: '0.85rem', sm: '1rem' } }
        },
        mobileTabsWrapper: {
            mb: 3,
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 0.5,
            display: { xs: 'block', md: 'none' },
            border: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backdropFilter: 'blur(10px)'
        },
        columnsContainer: {
            display: 'flex',
            gap: { xs: 2, md: 4 },
            overflowX: isMobile ? 'hidden' : 'auto',
            pb: 6,
            flexGrow: 1,
            alignItems: 'flex-start',
            px: { xs: 0, md: 2 },
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 10 }
        },
        dragOverlayCard: {
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.25), 0 18px 36px -18px rgba(0,0,0,0.3)',
            border: '2px solid',
            borderColor: 'primary.main',
            transform: 'rotate(2deg) scale(1.05)',
            bgcolor: 'background.paper',
            borderRadius: 3,
            width: { xs: 280, sm: 320, md: 350 },
            pointerEvents: 'none'
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><Loader fullPage /></Box>;

    const activeTask = activeId ? tasks.find(t => t._id === activeId) : null;

    return (
        <Fade in timeout={1000}>
            <Box sx={boardStyles.container}>
                <Box sx={boardStyles.header}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <DashboardIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                            <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 1.5, color: 'primary.main', fontSize: '0.65rem' }}>
                                AGILE WORKFLOW
                            </Typography>
                        </Box>
                        <Typography variant="h1" sx={boardStyles.headerTitle}>
                            Board
                        </Typography>
                        <Typography sx={boardStyles.headerSubtitle}>
                            Engineering workflow Orchestration.
                        </Typography>
                    </Box>
                    <Paper component="form" onSubmit={handleSubmit(onAddTask)} sx={boardStyles.addTaskPaper} elevation={0}>
                        <TextField
                            size="small"
                            placeholder="Draft a new task..."
                            fullWidth
                            {...register("title", { required: true })}
                            error={!!errors.title}
                            sx={boardStyles.addTaskInput}
                        />
                        <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{ borderRadius: 2, px: { xs: 2, sm: 4 }, height: 40, fontWeight: 800, whiteSpace: 'nowrap', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                        >
                            Add
                        </Button>
                    </Paper>
                </Box>

                {isMobile && (
                    <Box sx={boardStyles.mobileTabsWrapper}>
                        <Tabs
                            value={mobileTab}
                            onChange={(_, v) => setMobileTab(v)}
                            variant="fullWidth"
                            indicatorColor="primary"
                            textColor="primary"
                            sx={{
                                minHeight: 44,
                                '& .MuiTab-root': {
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    minHeight: 44,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1
                                }
                            }}
                        >
                            {COLUMNS.map(col => <Tab key={col.id} label={col.title} />)}
                        </Tabs>
                    </Box>
                )}

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <Box sx={boardStyles.columnsContainer}>
                        {COLUMNS.map((column, index) => {
                            if (isMobile && mobileTab !== index) return null;
                            return (
                                <KanbanColumn
                                    key={column.id}
                                    id={column.id}
                                    title={column.title}
                                    tasks={tasks.filter(t => t.status === column.id)}
                                    onDeleteClick={handleDeleteClick}
                                />
                            );
                        })}
                    </Box>

                    <DragOverlay dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: { active: { opacity: '0.4' } },
                        }),
                    }}>
                        {activeId && activeTask ? (
                            <Card sx={boardStyles.dragOverlayCard}>
                                <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Box sx={{ mt: 0.5, color: 'primary.main' }}><DragIcon fontSize="small" /></Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5, fontSize: '0.95rem' }}>{activeTask.title}</Typography>
                                        <Chip
                                            label={activeTask.status}
                                            size="small"
                                            color="primary"
                                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 900, borderRadius: 1.5 }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                <CustomAlert
                    open={deleteDialogOpen}
                    title="Remove Task"
                    message="You are about to permanently delete this task. This action cannot be undone."
                    confirmText="Delete Permanently"
                    cancelText="Keep Task"
                    severity="error"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteDialogOpen(false)}
                />
            </Box>
        </Fade>
    );
};

export default Board;