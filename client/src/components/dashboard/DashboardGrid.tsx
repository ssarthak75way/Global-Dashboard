import React, { useState } from 'react';
import { Grid, Typography, Box, useTheme } from '@mui/material';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import DashboardCard from './DashboardCard';
import { Theme } from '@mui/material';

interface CardData {
    id: string;
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    description: string;
    platform: string;
}

interface DashboardGridProps {
    initialCards: CardData[];
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ initialCards }) => {
    const theme = useTheme();
    const [cards, setCards] = useState<CardData[]>(initialCards);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setCards((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    };

    const activeCard = activeId ? cards.find(card => card.id === activeId) : null;

    const dashboardCardStyles = {
        card: (isOverlay: boolean, theme: Theme) => ({
            borderRadius: 1,
            position: 'relative',
            overflow: 'hidden',
            background: theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.8)'
                : 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: isOverlay ? 'primary.main' : 'divider',
            boxShadow: isOverlay
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                : (theme.palette.mode === 'light' ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)' : 'none'),
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: isOverlay ? 'grabbing' : 'default',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
                borderColor: !isOverlay ? 'primary.main' : 'inherit',
                transform: !isOverlay ? 'translateY(-6px)' : 'none',
                boxShadow: !isOverlay ? (theme.palette.mode === 'light'
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.3)') : 'none',
            }
        }),
        cardContent: { p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' },
        headerBox: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 },
        avatar: (color: string) => ({
            bgcolor: `${color}15`,
            color: color,
            width: 52,
            height: 52,
            fontSize: '1.5rem'
        }),
        dragHandle: {
            cursor: 'grab',
            color: 'text.secondary',
            opacity: 0.5,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 1 },
            '&:active': { cursor: 'grabbing' }
        },
        label: {
            fontWeight: 900,
            letterSpacing: 1,
            color: 'text.secondary',
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            mb: 1
        },
        value: {
            fontWeight: 900,
            mb: 1.5,
            color: 'text.primary'
        },
        description: {
            color: 'text.secondary',
            fontWeight: 600,
            lineHeight: 1.6,
            mb: 2
        },
        platformChip: {
            alignSelf: 'flex-start',
            fontWeight: 800,
            fontSize: '0.65rem',
            height: 24
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
                Your Stats Dashboard
            </Typography>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={cards.map(c => c.id)} strategy={rectSortingStrategy}>
                    <Grid container spacing={3}>
                        {cards.map((card) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                                <DashboardCard card={card} styles={dashboardCardStyles} />
                            </Grid>
                        ))}
                    </Grid>
                </SortableContext>

                <DragOverlay>
                    {activeCard ? (
                        <DashboardCard card={activeCard} isOverlay styles={dashboardCardStyles} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </Box>
    );
};

export default DashboardGrid;
