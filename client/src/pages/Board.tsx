import { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragEndEvent,
    DragStartEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../api/axios";
import { useForm } from "react-hook-form";
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    TextField,
    Button,
    Stack,
    Paper,
    Chip,
    Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DragIcon from "@mui/icons-material/DragIndicator";
import TaskIcon from "@mui/icons-material/Assignment";
import ConfirmDialog from "../components/ConfirmDialog";
import Loader from "../components/Loader";

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: string;
    order: number;
}

const taskStyles = {
    card: {
        mb: 2,
        cursor: 'grab',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' },
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative'
    },
    cardContent: { p: '16px !important', display: 'flex', alignItems: 'flex-start', gap: 2 },
    dragHandle: { mt: 0.5, color: 'text.disabled', cursor: 'grab' },
    title: { fontWeight: 600, mb: 0.5 },
    chip: { height: 20, fontSize: '0.65rem', fontWeight: 700 },
    deleteButton: { opacity: 0.6, '&:hover': { opacity: 1 } },
    flexGrow: { flexGrow: 1 }
};

const SortableTask = ({ task, onDeleteClick }: { task: Task; onDeleteClick: (id: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            sx={taskStyles.card}
        >
            <CardContent sx={taskStyles.cardContent}>
                <Box {...listeners} sx={taskStyles.dragHandle}>
                    <DragIcon fontSize="small" />
                </Box>
                <Box sx={taskStyles.flexGrow}>
                    <Typography variant="subtitle1" sx={taskStyles.title}>
                        {task.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            label={task.status}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={taskStyles.chip}
                        />
                        <Typography variant="caption" color="text.secondary">
                            Task ID: {task._id.slice(-4)}
                        </Typography>
                    </Stack>
                </Box>
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); onDeleteClick(task._id); }}
                    color="error"
                    sx={taskStyles.deleteButton}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </CardContent>
        </Card>
    );
};

const Board = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
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
        console.log(data);

        try {
            const { data: newTask } = await api.post("/tasks", { title: data.title, status: "ToDo" });
            setTasks([...tasks, newTask]);
            reset();
        } catch (error) {
            console.error("Error adding task", error);
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
        } catch (error) {
            console.error("Error deleting task", error);
        } finally {
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // Store previous state for rollback on error
            const previousTasks = [...tasks];

            // Optimistically update local state
            const reorderedTasks = (() => {
                const oldIndex = tasks.findIndex(item => item._id === active.id);
                const newIndex = tasks.findIndex(item => item._id === over.id);
                return arrayMove(tasks, oldIndex, newIndex);
            })();

            setTasks(reorderedTasks);

            // Prepare payload with updated order values
            const tasksWithOrder = reorderedTasks.map((task, index) => ({
                _id: task._id,
                status: task.status,
                order: index,
            }));

            // Persist to backend
            try {
                await api.put("/tasks/reorder", { tasks: tasksWithOrder });
            } catch (error) {
                console.error("Error updating task order", error);
                // Revert to previous state on error
                setTasks(previousTasks);
            }
        }
        setActiveId(null);
    };

    const boardStyles = {
        loadingContainer: { display: 'flex', justifyContent: 'center', py: 8 },
        container: { p: { xs: 1.5, sm: 2, md: 4 } , minHeight:"100vh"},
        header: { mb: { xs: 3, md: 4 }, display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 },
        headerTitle: { fontWeight: 800, mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } },
        addTaskPaper: {
            p: 1,
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', sm: 400 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
        },
        addTaskInput: { '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } } },
        divider: { height: 28, mx: 1 },
        addButton: { px: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } },
        boardContainer: { maxWidth: 800, mx: 'auto' },
        emptyStatePaper: { p: { xs: 2, sm: 4 }, textAlign: 'center', bgcolor: 'transparent', border: '2px dashed', borderColor: 'divider' },
        emptyStateIcon: { fontSize: { xs: 32, sm: 48 }, color: 'text.disabled', mb: 2 },
        dragOverlayCard: { boxShadow: 6, border: '1px solid', borderColor: 'primary.main' },
        dragOverlayContent: { p: '16px !important', display: 'flex', alignItems: 'flex-start', gap: 2 },
        dragOverlayIconBox: { mt: 0.5, color: 'primary.main' },
        dragOverlayTitle: { fontWeight: 600, mb: 0.5 },
        dragOverlayChip: { height: 20, fontSize: '0.65rem', fontWeight: 700 }
    };

    if (loading) return (
        <Box sx={boardStyles.loadingContainer}>
            <Loader fullPage />
        </Box>
    );

    const activeTask = activeId ? tasks.find(t => t._id === activeId) : null;

    return (
        <Box sx={boardStyles.container}>
            <Box sx={boardStyles.header}>
                <Box>
                    <Typography variant="h4" sx={boardStyles.headerTitle}>
                        Project Board
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage and track your engineering tasks
                    </Typography>
                </Box>
                <Paper
                    component="form"
                    onSubmit={handleSubmit(onAddTask)}
                    sx={boardStyles.addTaskPaper}
                    elevation={0}
                >
                    <TextField
                        size="small"
                        placeholder="Add a new task..."
                        fullWidth
                        {...register("title", { required: true })}
                        error={!!errors.title}
                        sx={boardStyles.addTaskInput}
                    />
                    <Divider sx={boardStyles.divider} orientation="vertical" />
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        sx={boardStyles.addButton}
                    >
                        Add
                    </Button>
                </Paper>
            </Box>

            <Box sx={boardStyles.boardContainer}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={tasks.map(t => t._id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Stack spacing={0}>
                            {tasks.length === 0 ? (
                                <Paper sx={boardStyles.emptyStatePaper} elevation={0}>
                                    <TaskIcon sx={boardStyles.emptyStateIcon} />
                                    <Typography color="text.secondary">No tasks found. Create one to get started!</Typography>
                                </Paper>
                            ) : (
                                tasks.map((task) => (
                                    <SortableTask key={task._id} task={task} onDeleteClick={handleDeleteClick} />
                                ))
                            )}
                        </Stack>
                    </SortableContext>

                    <DragOverlay dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                                active: {
                                    opacity: '0.5',
                                },
                            },
                        }),
                    }}>
                        {activeId && activeTask ? (
                            <Card sx={boardStyles.dragOverlayCard}>
                                <CardContent sx={boardStyles.dragOverlayContent}>
                                    <Box sx={boardStyles.dragOverlayIconBox}>
                                        <DragIcon fontSize="small" />
                                    </Box>
                                    <Box sx={taskStyles.flexGrow}>
                                        <Typography variant="subtitle1" sx={boardStyles.dragOverlayTitle}>
                                            {activeTask.title}
                                        </Typography>
                                        <Chip
                                            label={activeTask.status}
                                            size="small"
                                            color="primary"
                                            variant="filled"
                                            sx={boardStyles.dragOverlayChip}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </Box>

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete Task?"
                message="Are you sure you want to delete this task? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                severity="error"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </Box>
    );
};

export default Board;