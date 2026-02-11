import React from 'react';
import { Card, CardContent, Box, Avatar, Typography, Chip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
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

interface DashboardCardProps {
    card: CardData;
    isOverlay?: boolean;
    styles: any;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ card, isOverlay = false, styles }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card sx={(theme: Theme) => styles.card(isOverlay, theme)}>
                <CardContent sx={styles.cardContent}>
                    <Box sx={styles.headerBox}>
                        <Avatar sx={styles.avatar(card.color)}>
                            {card.icon}
                        </Avatar>
                        <Box
                            {...attributes}
                            {...listeners}
                            sx={styles.dragHandle}
                        >
                            <DragIndicatorIcon />
                        </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" sx={styles.label}>
                            {card.label}
                        </Typography>
                        <Typography variant="h4" sx={styles.value}>
                            {card.value}
                        </Typography>
                        <Typography variant="body2" sx={styles.description}>
                            {card.description}
                        </Typography>
                    </Box>

                    <Chip
                        label={card.platform}
                        size="small"
                        sx={styles.platformChip}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardCard;
