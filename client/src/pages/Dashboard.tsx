import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
    Grid,
    Typography,
    Card,
    CardContent,
    Box,
    Avatar,
    Fade,
    Chip,
    Skeleton,
    Theme,
    useTheme,
    useMediaQuery,
    Button,
    Tooltip
} from "@mui/material";
import { format } from "date-fns";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import { CSS } from '@dnd-kit/utilities';
import VerifiedIcon from "@mui/icons-material/CheckCircle";
import UnverifiedIcon from "@mui/icons-material/Error";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BoltIcon from '@mui/icons-material/Bolt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface CardData {
    id: string;
    label: string;
    value: string | number | React.ReactNode;
    icon: React.ReactNode;
    color: string;
    description: string;
    platform?: string;
    colSpan?: { xs: number, sm?: number, md?: number };
    customRenderer?: (data: any) => React.ReactNode;
}

const dashboardCardStyles = {
    card: (isOverlay: boolean, theme: Theme) => ({
        borderRadius: 5,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(28, 28, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        boxShadow: isOverlay
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : (theme.palette.mode === 'dark' ? '0 4px 24px -1px rgba(0,0,0,0.2)' : '0 4px 20px -5px rgba(0,0,0,0.05)'),
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: isOverlay ? 'grabbing' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
            transform: !isOverlay ? 'translateY(-4px)' : 'none',
            boxShadow: theme.palette.mode === 'dark' ? '0 20px 40px -5px rgba(0,0,0,0.4)' : '0 20px 40px -5px rgba(0,0,0,0.1)',
            borderColor: theme.palette.primary.main,
            '& .drag-handle': { opacity: 1 }
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            opacity: 0,
            transition: 'opacity 0.3s ease'
        },
        '&:hover::before': {
            opacity: 1
        }
    }),
    cardContent: { p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' },
    headerBox: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 },
    mockChart: (color: string) => ({
        width: '100%',
        height: 48,
        flexShrink: 0,
        '& path': {
            stroke: color,
            fill: 'none',
            strokeWidth: 3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
        }
    }),
    percentChip: (color: string) => ({
        bgcolor: `${color}15`,
        color: color,
        fontWeight: 700,
        borderRadius: '6px',
        px: 1,
        py: 0.5,
        fontSize: '0.75rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5
    }),
    platformIcon: {
        fontSize: '1.25rem'
    },
    overlayBox: (_isMobile: boolean) => ({
        width: '100%',
        height: '100%'
    })
};

// Mock Sparkline SVG Path generator
const getSparklinePath = (id: string, width = 100, height = 40) => {
    // Deterministic random-looking path based on ID
    const seed = id.charCodeAt(0);
    return `M0,${height / 2} Q${width / 4},${seed % height} ${width / 2},${height / 2} T${width},${height / 3}`;
};

const DashboardCard = ({ card, loading, isOverlay = false, data, dragProps = {} }: { card: CardData; loading: boolean; isOverlay?: boolean; data?: any; dragProps?: any }) => {
    const theme = useTheme();
    const sparklinePath = getSparklinePath(card.id);
    const areaPath = `${sparklinePath} V 40 H 0 Z`;
    const gradientId = `gradient-${card.id}`;

    return (
        <Card sx={(theme) => dashboardCardStyles.card(isOverlay, theme)} elevation={0}>
            <CardContent sx={dashboardCardStyles.cardContent}>
                {/* Header: Label + Percent Change */}
                <Box sx={dashboardCardStyles.headerBox}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Box sx={{
                            p: 1.2,
                            borderRadius: '12px',
                            bgcolor: theme.palette.mode === 'dark' ? '#2C2C2E' : '#f3f4f6',
                            color: theme.palette.mode === 'dark' ? 'white' : 'black',
                            display: 'flex'
                        }}>
                            {card.icon}
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                {card.label}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={dashboardCardStyles.percentChip(card.color)}>
                        {card.id === 'streak' ? 'Active' : '+5%'}
                    </Box>
                </Box>

                {/* Main Value */}
                {loading ? (
                    <Skeleton variant="text" width="60%" height={60} />
                ) : (
                    <Box sx={{ mt: 2, mb: 1 }}>
                        {card.customRenderer ? (
                            card.customRenderer(data)
                        ) : (
                            <Typography variant="h3" sx={{
                                fontWeight: 800,
                                fontSize: '2.25rem',
                                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                                letterSpacing: '-1px'
                            }}>
                                {card.value}
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Visual Description */}
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.875rem' }}>
                    {card.description}
                </Typography>

                {/* Sparkline decoration */}
                {!card.customRenderer && (
                    <Box sx={{ mt: 'auto', pt: 2, opacity: 0.8 }}>
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: 40, overflow: 'visible' }}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor={card.color} stopOpacity="0.3" />
                                    <stop offset="100%" stopColor={card.color} stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d={areaPath}
                                fill={`url(#${gradientId})`}
                                stroke="none"
                            />
                            <path
                                d={sparklinePath}
                                fill="none"
                                stroke={card.color}
                                strokeWidth="3"
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                    </Box>
                )}
            </CardContent>

            {/* Drag Handle overlaid */}
            {!isOverlay && (
                <Box {...dragProps} className="drag-handle" sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    opacity: 0,
                    cursor: 'grab',
                    transition: 'opacity 0.2s',
                    p: 1,
                }}>
                    <DragIndicatorIcon fontSize="small" />
                </Box>
            )}
        </Card>
    );
};

const SortableCard = ({ card, loading }: { card: CardData; loading: boolean }) => {
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
        zIndex: isDragging ? 0 : 1,
        opacity: isDragging ? 0.3 : 1,
        height: '100%'
    };

    return (
        <Grid item xs={card.colSpan?.xs || 12} sm={card.colSpan?.sm || 6} md={card.colSpan?.md || 4} ref={setNodeRef} style={style}>
            <DashboardCard
                card={card}
                loading={loading}
                dragProps={{ ...attributes, ...listeners }}
            />
        </Grid>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [activityData, setActivityData] = useState<{
        activity: any[];
        stats: {
            totalPosts: number;
            totalLikes: number;
            totalRating: number;
            currentStreak: number;
            longestStreak: number;
            activeDays: number;
        } | null;
    }>({
        activity: [],
        stats: null
    });

    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
        activity: false
    });

    const [cards, setCards] = useState<CardData[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoadingStates(prev => ({ ...prev, activity: true }));
                const { data } = await api.get('/auth/activity');
                setActivityData(data);
            } catch (err) {
                console.error("Failed to fetch activity", err);
            } finally {
                setLoadingStates(prev => ({ ...prev, activity: false }));
            }
        };

        if (user) fetchActivity();
    }, [user]);

    useEffect(() => {
        const statsCards = [
            {
                id: 'posts',
                label: 'Total Posts',
                icon: <PostAddIcon sx={dashboardCardStyles.platformIcon} />,
                color: '#8b5cf6',
                description: 'Your Contributions',
                value: activityData?.stats?.totalPosts || 0,
                colSpan: { xs: 12, sm: 6, md: 3 }
            },
            {
                id: 'likes',
                label: 'Likes Received',
                icon: <FavoriteIcon sx={dashboardCardStyles.platformIcon} />,
                color: '#f43f5e',
                description: 'Community Love',
                value: activityData?.stats?.totalLikes || 0,
                colSpan: { xs: 12, sm: 6, md: 3 }
            },
            {
                id: 'streak',
                label: 'Active Streak',
                icon: <WhatshotIcon sx={dashboardCardStyles.platformIcon} />,
                color: '#f59e0b',
                description: 'Consecutive Days',
                value: activityData?.stats?.currentStreak || 0,
                colSpan: { xs: 12, sm: 6, md: 3 }
            },
            {
                id: 'engagement',
                label: 'Engagement Score',
                icon: <EqualizerIcon sx={dashboardCardStyles.platformIcon} />,
                color: '#10b981',
                description: 'Based on interaction',
                value: activityData?.stats?.totalRating || 0,
                colSpan: { xs: 12, sm: 6, md: 3 }
            },
            {
                id: 'heatmap',
                label: 'Contribution Habits',
                icon: <CalendarMonthIcon sx={dashboardCardStyles.platformIcon} />,
                color: theme.palette.primary.main,
                description: 'Your posting activity over the last year',
                value: 'Heatmap',
                colSpan: { xs: 12, md: 8 },
                customRenderer: () => (
                    <Box sx={{ mt: 2, height: '100%', width: '100%', overflow: 'hidden' }}>
                        <CalendarHeatmap
                            startDate={new Date(new Date().setMonth(new Date().getMonth() - (isTablet ? 3 : 12)))}
                            endDate={new Date()}
                            values={activityData?.activity || []}
                            classForValue={(value) => {
                                if (!value) {
                                    return 'color-empty';
                                }
                                return `color-scale-${Math.min(value.count, 4)}`;
                            }}
                            transformDayElement={(element, value, index) => {
                                const title = value && value.date ? `${format(new Date(value.date), 'MMM d, yyyy')}: ${value.count} posts` : 'No contributions';
                                return (
                                    <Tooltip key={index} title={title} placement="top" arrow>
                                        <rect {...element} />
                                    </Tooltip>
                                );
                            }}
                            showWeekdayLabels={true}
                        />
                        <style>{`
                            .react-calendar-heatmap { width: 100%; height: 100%; }
                            .react-calendar-heatmap text { font-size: 9px; fill: ${theme.palette.text.secondary}; font-family: inherit; font-weight: 500; }
                            .react-calendar-heatmap .react-calendar-heatmap-weekday-labels { display: none; }
                            .react-calendar-heatmap rect { rx: 3px; ry: 3px; stroke: ${theme.palette.background.paper}; stroke-width: 1px; transition: all 0.2s ease; }
                            .react-calendar-heatmap rect:hover { stroke: ${theme.palette.primary.main}; stroke-width: 2px; }
                            .react-calendar-heatmap .color-empty { fill: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}; }
                            .react-calendar-heatmap .color-scale-1 { fill: ${theme.palette.primary.main}; opacity: 0.2; }
                            .react-calendar-heatmap .color-scale-2 { fill: ${theme.palette.primary.main}; opacity: 0.4; }
                            .react-calendar-heatmap .color-scale-3 { fill: ${theme.palette.primary.main}; opacity: 0.6; }
                            .react-calendar-heatmap .color-scale-4 { fill: ${theme.palette.primary.main}; opacity: 0.8; }
                        `}</style>
                    </Box>
                )
            },
            {
                id: 'recent',
                label: 'Quick Actions',
                icon: <BoltIcon sx={dashboardCardStyles.platformIcon} />,
                color: '#3b82f6',
                description: 'Manage your content',
                value: 'Actions',
                colSpan: { xs: 12, md: 4 },
                customRenderer: () => (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<PostAddIcon />}
                            fullWidth
                            component="a"
                            href="/feed"
                            sx={{ borderRadius: 3, py: 1, borderColor: 'divider', color: 'text.primary' }}
                        >
                            Create New Post
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ManageAccountsIcon />}
                            fullWidth
                            component="a"
                            href="/profile"
                            sx={{ borderRadius: 3, py: 1, borderColor: 'divider', color: 'text.primary' }}
                        >
                            Edit Profile
                        </Button>
                    </Box>
                )
            }
        ];

        setCards(statsCards as CardData[]);
    }, [activityData, theme]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            const oldIndex = cards.findIndex(c => c.id === active.id);
            const newIndex = cards.findIndex(c => c.id === over.id);

            const newCards = arrayMove(cards, oldIndex, newIndex);
            setCards(newCards);
        }
    };

    const activeCard = activeId ? cards.find(c => c.id === activeId) : null;

    const styles = {
        container: { pb: 8, px: { xs: 1, sm: 2, md: 0 }, minHeight: "100vh" },
        header: {
            mb: { xs: 4, md: 6 },
            mt: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 2, md: 4 }
        },
        title: { fontWeight: 950, mb: 1, letterSpacing: -1, fontSize: { xs: 'clamp(1.8rem, 10vw, 2.5rem)', sm: '3.5rem', md: '4rem' }, lineHeight: 1 },
        platformBadge: {
            fontSize: { xs: '0.7rem', sm: '0.875rem' },
            verticalAlign: 'middle',
            ml: { xs: 1, sm: 2 },
            bgcolor: 'common.black',
            color: 'white',
            px: { xs: 1, sm: 2 },
            py: 0.75,
            borderRadius: 8,
            fontWeight: 900,
            display: 'inline-flex',
            alignItems: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        },
        profileBox: { display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 }, mt: 2 },
        avatar: { width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, border: '2.5px solid', borderColor: 'primary.main', p: 0.3 },
        username: { fontWeight: 900, lineHeight: 1, mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } },
        tagline: { fontWeight: 700, letterSpacing: 0.5, fontSize: { xs: '0.65rem', sm: '0.75rem' } },
        actionsBox: { display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' }, mt: { xs: 2, md: 0 } },
        verifiedChip: {
            fontWeight: 900,
            borderRadius: 3,
            flex: { xs: 1, md: 'none' },
            height: 44,
            px: 1,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        },
        addfeedChip: {
            fontWeight: 900,
            borderRadius: 3,
            flex: { xs: 1, md: 'none' },
            height: 44,
            px: 1,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            boxSizing: 'border-box'
        }
    };

    return (
        <Fade in timeout={1200}>
            <Box sx={styles.container}>
                <Box sx={styles.header}>
                    <Box>
                        <Typography variant="h2" sx={styles.title}>
                            Overview
                            <Box component="span" sx={styles.platformBadge}>
                                INSIGHTS
                            </Box>
                        </Typography>

                        <Box sx={styles.profileBox}>
                            <Avatar
                                src={user?.avatar}
                                sx={styles.avatar}
                            >
                                {user?.email?.[0]?.toUpperCase() || '?'}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={styles.username}>
                                    {user?.name || user?.email.split('@')[0]}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={styles.tagline}>
                                    Your unified digital presence console
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={styles.actionsBox}>
                        <Chip
                            component="a"
                            href="/feed"
                            variant="outlined"
                            icon={<AddIcon fontSize="large" />}
                            label={"Add Feed"}
                            color="primary"
                            sx={styles.addfeedChip}
                        />

                        <Chip
                            icon={user?.isVerified ? <VerifiedIcon /> : <UnverifiedIcon />}
                            label={user?.isVerified ? "Verified Status" : "Action Required"}
                            color={user?.isVerified ? "success" : "warning"}
                            sx={styles.verifiedChip}
                        />
                    </Box>
                </Box>


                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={cards}
                        strategy={rectSortingStrategy}
                    >
                        <Grid container spacing={3.5}>
                            {cards.map((card) => (
                                <SortableCard key={card.id} card={card} loading={loadingStates.activity || false} />
                            ))}
                        </Grid>
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
                        {activeCard ? (
                            <Box sx={dashboardCardStyles.overlayBox(isMobile)}>
                                <DashboardCard card={activeCard} loading={loadingStates.activity || false} isOverlay />
                            </Box>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </Box >
        </Fade >
    );
};

export default Dashboard;
