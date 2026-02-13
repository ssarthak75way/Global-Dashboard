import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
    Box,
    Typography,
    Stack,
    Theme
} from '@mui/material';
import TaskCard, { Task } from './TaskCard';

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: Task[];
    onDeleteClick: (id: string) => void;
}

const columnStyles = {
    container: (theme: Theme) => ({
        width: { xs: '100%', md: '350px' },
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.mode === 'light'
            ? 'rgba(241, 245, 249, 0.3)'
            : 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        border: '1px solid',
        borderColor: theme.palette.mode === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(51, 65, 85, 0.5)',
        p: 2.5,
        minHeight: 600,
        transition: 'all 0.3s ease'
    }),
    header: {
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 1
    },
    title: {
        fontWeight: 900,
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: 'text.primary',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        '&::before': {
            content: '""',
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'primary.main'
        }
    },
    count: {
        bgcolor: 'action.hover',
        px: 1.5,
        py: 0.5,
        borderRadius: 2,
        fontSize: '0.75rem',
        fontWeight: 800,
        color: 'primary.main',
        border: '1px solid',
        borderColor: 'primary.light',
        opacity: 0.8
    },
    taskList: {
        flexGrow: 1,
        minHeight: 150,
        '&::-webkit-scrollbar': { width: 6 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 10 }
    }
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks, onDeleteClick }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <Box sx={(theme) => columnStyles.container(theme)}>
            <Box sx={columnStyles.header}>
                <Typography variant="subtitle2" sx={columnStyles.title}>
                    {title}
                </Typography>
                <Typography variant="caption" sx={columnStyles.count}>
                    {tasks.length}
                </Typography>
            </Box>

            <Box ref={setNodeRef} sx={columnStyles.taskList}>
                <SortableContext
                    id={id}
                    items={tasks.map(t => t._id)}
                    strategy={verticalListSortingStrategy}
                >
                    <Stack spacing={1}>
                        {tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onDeleteClick={onDeleteClick}
                            />
                        ))}
                    </Stack>
                </SortableContext>
            </Box>
        </Box>
    );
};

export default KanbanColumn;
