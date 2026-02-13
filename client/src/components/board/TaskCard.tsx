import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Stack,
    Chip,
    IconButton,
    Theme
} from '@mui/material';
import DragIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: string;
    order: number;
    createdAt?: string;
}

interface TaskCardProps {
    task: Task;
    onDeleteClick: (id: string) => void;
}

const taskStyles = {
    card: (isDragging: boolean, theme: Theme, status: string) => ({
        mb: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.7)'
            : 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: isDragging
            ? 'primary.main'
            : (theme.palette.mode === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(51, 65, 85, 0.5)'),
        boxShadow: isDragging
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        opacity: isDragging ? 0.6 : 1,
        transform: isDragging ? 'scale(1.02) rotate(1deg)' : 'scale(1)',
        '&:hover': {
            transform: !isDragging ? 'translateY(-4px)' : 'none',
            boxShadow: !isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'inherit',
            borderColor: 'primary.light'
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: status === 'Done' ? 'success.main' : status === 'In Progress' ? 'primary.main' : 'warning.main',
            opacity: 0.8
        }
    }),
    cardContent: { p: '16px !important', display: 'flex', alignItems: 'flex-start', gap: 2 },
    dragHandle: { mt: 0.5, color: 'text.disabled', cursor: 'grab', '&:hover': { color: 'primary.main' } },
    title: { fontWeight: 700, mb: 0.5, letterSpacing: '-0.01em' },
    description: {
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        color: 'text.secondary',
        fontSize: '0.8rem',
        fontWeight: 500,
        mb: 1.5,
        lineHeight: 1.5
    },
    metaBox: { display: 'flex', alignItems: 'center', gap: 1, color: 'text.disabled' },
    chip: (status: string) => ({
        height: 22,
        fontSize: '0.6rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        borderRadius: 1,
        bgcolor: status === 'Done' ? 'success.light' : status === 'In Progress' ? 'primary.light' : 'warning.light',
        color: 'white',
        border: 'none'
    }),
    deleteButton: {
        opacity: 0,
        transition: 'all 0.2s',
        '.MuiCard-root:hover &': { opacity: 0.6 },
        '&:hover': { opacity: 1, bgcolor: 'error.lighter' }
    }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onDeleteClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            sx={(theme) => taskStyles.card(isDragging, theme, task.status)}
        >
            <CardContent sx={taskStyles.cardContent}>
                <Box sx={taskStyles.dragHandle}>
                    <DragIcon fontSize="small" />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={taskStyles.title}>
                        {task.title}
                    </Typography>
                    {task.description && (
                        <Typography sx={taskStyles.description}>
                            {task.description}
                        </Typography>
                    )}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                                label={task.status}
                                size="small"
                                sx={taskStyles.chip(task.status)}
                            />
                            <Box sx={taskStyles.metaBox}>
                                <AccessTimeIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption" fontWeight={700}>
                                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently'}
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(task._id);
                    }}
                    color="error"
                    sx={taskStyles.deleteButton}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
