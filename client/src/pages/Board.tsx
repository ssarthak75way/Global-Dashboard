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
    Divider,
    CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DragIcon from "@mui/icons-material/DragIndicator";
import TaskIcon from "@mui/icons-material/Assignment";

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: string;
    order: number;
}

const SortableTask = ({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) => {
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
            sx={{
                mb: 2,
                cursor: 'grab',
                '&:hover': { boxShadow: 3 },
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative'
            }}
        >
            <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box {...listeners} sx={{ mt: 0.5, color: 'text.disabled', cursor: 'grab' }}>
                    <DragIcon fontSize="small" />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {task.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            label={task.status}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            Task ID: {task._id.slice(-4)}
                        </Typography>
                    </Stack>
                </Box>
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                    color="error"
                    sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
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

    const onDeleteTask = async (id: string) => {
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error("Error deleting task", error);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex(item => item._id === active.id);
                const newIndex = items.findIndex(item => item._id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        setActiveId(null);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
        </Box>
    );

    const activeTask = activeId ? tasks.find(t => t._id === activeId) : null;

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        Project Board
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage and track your engineering tasks
                    </Typography>
                </Box>
                <Paper
                    component="form"
                    onSubmit={handleSubmit(onAddTask)}
                    sx={{
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        width: { xs: '100%', sm: 400 },
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                    elevation={0}
                >
                    <TextField
                        size="small"
                        placeholder="Add a new task..."
                        fullWidth
                        {...register("title", { required: true })}
                        error={!!errors.title}
                        sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                    />
                    <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        sx={{ px: 2 }}
                    >
                        Add
                    </Button>
                </Paper>
            </Box>

            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
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
                                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', border: '2px dashed', borderColor: 'divider' }} elevation={0}>
                                    <TaskIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                    <Typography color="text.secondary">No tasks found. Create one to get started!</Typography>
                                </Paper>
                            ) : (
                                tasks.map((task) => (
                                    <SortableTask key={task._id} task={task} onDelete={onDeleteTask} />
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
                            <Card sx={{ boxShadow: 6, border: '1px solid', borderColor: 'primary.main' }}>
                                <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Box sx={{ mt: 0.5, color: 'primary.main' }}>
                                        <DragIcon fontSize="small" />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {activeTask.title}
                                        </Typography>
                                        <Chip
                                            label={activeTask.status}
                                            size="small"
                                            color="primary"
                                            variant="filled"
                                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </Box>
        </Box>
    );
};

export default Board;
