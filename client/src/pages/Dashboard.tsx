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
    useMediaQuery
} from "@mui/material";
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
import TaskIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TerminalIcon from "@mui/icons-material/Terminal";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface CardData {
    id: string;
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    description: string;
    platform: string;
}

interface DragProps {
    role?: string;
    tabIndex?: number;
    'aria-pressed'?: boolean | undefined;
    'aria-roledescription'?: string;
    'aria-describedby'?: string;
}

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
        borderRadius: 3,
        border: '1.5px solid',
        borderColor: `${color}30`
    }),
    dragHandle: {
        cursor: 'grab',
        color: 'text.disabled',
        '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
        p: 0.5,
        borderRadius: 1.5,
        transition: 'all 0.2s'
    },
    platformText: { color: 'text.secondary', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', mb: 0.5, display: 'block' },
    labelText: { fontWeight: 800, lineHeight: 1.3, mb: 1, color: 'text.primary' },
    valueText: (color: string) => ({
        fontWeight: 950,
        letterSpacing: -2,
        fontSize: '2.5rem',
        background: `linear-gradient(45deg, ${color}, ${color}AA)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    }),
    footerBox: (theme: Theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
        px: 1.5,
        py: 1,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider'
    }),
    trendingIcon: { color: 'success.main', fontSize: '1rem' },
    descriptionText: { color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem' },
    progressBar: (color: string) => ({
        height: 4,
        width: '100%',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.5
    }),
    dragIndicatorIcon: { fontSize: '1.25rem' },
    platformIcon: { fontSize: '1.75rem' },
    cardHeaderContentBox: { flexGrow: 1, mb: 2 },
    overlayBox: (isMobile: boolean) => ({ width: isMobile ? '100%' : '100%' })
};

const DashboardCard = ({ card, loading, isOverlay = false, dragProps = {} }: { card: CardData; loading: boolean; isOverlay?: boolean; dragProps?: DragProps | Record<string, unknown> }) => {
    return (
        <Card
            sx={(theme) => dashboardCardStyles.card(isOverlay, theme)}
        >
            <CardContent sx={dashboardCardStyles.cardContent}>
                <Box sx={dashboardCardStyles.headerBox}>
                    <Avatar
                        sx={dashboardCardStyles.avatar(card.color)}
                    >
                        {card.icon}
                    </Avatar>
                    {!isOverlay && (
                        <Box {...dragProps} sx={dashboardCardStyles.dragHandle}>
                            <DragIndicatorIcon sx={dashboardCardStyles.dragIndicatorIcon} />
                        </Box>
                    )}
                </Box>

                <Box sx={dashboardCardStyles.cardHeaderContentBox}>
                    <Typography variant="caption" sx={dashboardCardStyles.platformText}>
                        {card.platform}
                    </Typography>
                    <Typography variant="h6" sx={dashboardCardStyles.labelText}>
                        {card.label}
                    </Typography>

                    {loading ? (
                        <Skeleton variant="text" width="60%" height={60} />
                    ) : (
                        <Typography variant="h3" sx={dashboardCardStyles.valueText(card.color)}>
                            {card.value}
                        </Typography>
                    )}
                </Box>

                <Box sx={dashboardCardStyles.footerBox}>
                    <TrendingUpIcon sx={dashboardCardStyles.trendingIcon} />
                    <Typography variant="body2" sx={dashboardCardStyles.descriptionText}>
                        {card.description}
                    </Typography>
                </Box>
            </CardContent>

            <Box sx={dashboardCardStyles.progressBar(card.color)} />
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
        <Grid item xs={12} sm={6} md={4} ref={setNodeRef} style={style}>
            <DashboardCard
                card={card}
                loading={loading}
                dragProps={{ ...attributes, ...listeners }}
            />
        </Grid>
    );
};

// Define explicit types for stats
interface GithubStats {
    profile: {
        repos: number;
        followers: number;
        avatar: string;
        username: string;
    };
}

interface LeetcodeStats {
    totalSolved: number;
    ranking: number;
    username: string;
}

interface CodeforcesStats {
    rating: number;
    rank: string;
    avatar: string;
}

const Dashboard = () => {
    const { user, fetchMe } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [stats, setStats] = useState<{
        github: GithubStats | null;
        leetcode: LeetcodeStats | null;
        codeforces: CodeforcesStats | null;
        tasks: any[] | null;
    }>({
        github: null,
        leetcode: null,
        codeforces: null,
        tasks: null
    });

    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
        github: false,
        leetcode: false,
        codeforces: false,
        tasks: false
    });

    const [cards, setCards] = useState<CardData[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const fetchAllStats = async () => {
            const handles = user?.socialHandles;

            const platforms = [
                { key: 'github', handle: handles?.github, url: '/social/github' },
                { key: 'leetcode', handle: handles?.leetcode, url: '/social/leetcode' },
                { key: 'codeforces', handle: handles?.codeforces, url: '/social/codeforces' },
                { key: 'tasks', handle: true, url: '/tasks' }
            ];

            platforms.forEach(p => {
                if (p.handle) {
                    setLoadingStates(prev => ({ ...prev, [p.key]: true }));
                }
            });

            await Promise.allSettled(
                platforms.map(async (p) => {
                    if (!p.handle) return;
                    try {
                        const { data } = await api.get(p.url);
                        setStats(prev => ({ ...prev, [p.key]: data }));
                    } catch (err) {
                        console.error(`Failed to fetch ${p.key} stats`, err);
                    } finally {
                        setLoadingStates(prev => ({ ...prev, [p.key]: false }));
                    }
                })
            );
        };

        if (user) fetchAllStats();
    }, [user]);

    useEffect(() => {
        const platforms = [
            { id: 'github', label: 'Public Repositories', platform: 'GitHub', icon: <GitHubIcon sx={dashboardCardStyles.platformIcon} />, color: '#10b981', description: 'Real-time repository sync' },
            { id: 'leetcode', label: 'Solved Problems', platform: 'LeetCode', icon: <TerminalIcon sx={dashboardCardStyles.platformIcon} />, color: '#f59e0b', description: 'Real-time sync' },
            { id: 'linkedin', label: 'Professional Index', platform: 'LinkedIn', icon: <LinkedInIcon sx={dashboardCardStyles.platformIcon} />, color: '#0a66c2', description: 'Weekly Profile Views' },
            { id: 'codeforces', label: 'Global Rating', platform: 'Codeforces', icon: <EmojiEventsIcon sx={dashboardCardStyles.platformIcon} />, color: '#ef4444', description: 'Competitive Rank' },
            { id: 'tasks', label: 'Active Progress', platform: 'Internal Tasks', icon: <TaskIcon sx={dashboardCardStyles.platformIcon} />, color: '#6366f1', description: 'Total tasks' }
        ];

        let initialOrder = user?.dashboardOrder?.length ? user.dashboardOrder : platforms.map(p => p.id);

        initialOrder = initialOrder.filter(id => platforms.some(p => p.id === id));

        platforms.forEach(p => {
            if (!initialOrder.includes(p.id)) initialOrder.push(p.id);
        });

        const orderedCards = initialOrder.map(id => {
            const p = platforms.find(x => x.id === id)!;
            let value: string | number = '---';
            let description = p.description;

            if (id === 'github' && stats?.github) {
                value = stats.github?.profile?.repos || 0;
                description = `${stats.github.profile.followers} Followers`;
            } else if (id === 'tasks' && stats.tasks) {
                value = stats.tasks.length;
                description = `${stats.tasks.filter((t: any) => t.status === 'Completed').length} completed`;
            } else if (id === 'leetcode' && stats.leetcode) {
                value = stats.leetcode.totalSolved || '---';
                description = `Rank: ${stats.leetcode.ranking || 'N/A'}`;
            } else if (id === 'linkedin') {
                value = user?.socialHandles?.linkedin ? 'Active' : 'N/A';
            } else if (id === 'codeforces' && stats.codeforces) {
                value = stats.codeforces.rating || '---';
                description = stats.codeforces.rank || 'N/A';
            }

            return { ...p, value, description };
        });

        setCards(orderedCards);
    }, [stats, user]);

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

            try {
                const newOrder = newCards.map(c => c.id);
                await api.put("/auth/dashboard-order", { order: newOrder });
                if (fetchMe) await fetchMe();
            } catch (err) {
                console.error("Failed to save dashboard order", err);
            }
        }
    };

    const activeCard = activeId ? cards.find(c => c.id === activeId) : null;

    const styles = {
        container: { pb: 8, px: { xs: 1, sm: 2, md: 0 }, minHeight: "100vh" },
        header: {
            mb: { xs: 4, md: 8 },
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
            bgcolor: 'primary.main',
            color: 'white',
            px: { xs: 1, sm: 2 },
            py: 0.75,
            borderRadius: 2,
            fontWeight: 900,
            display: 'inline-flex',
            alignItems: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            border: '1px solid rgba(255,255,255,0.2)'
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
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
            },
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
                                PLATFORMS
                            </Box>
                        </Typography>

                        <Box sx={styles.profileBox}>
                            <Avatar
                                src={stats.github?.profile?.avatar || stats.codeforces?.avatar || undefined}
                                sx={styles.avatar}
                            >
                                {user?.email?.[0]?.toUpperCase() || '?'}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={styles.username}>
                                    {stats.github?.profile?.username || stats.leetcode?.username || user?.email.split('@')[0]}
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
                                <SortableCard key={card.id} card={card} loading={loadingStates[card.id] || false} />
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
                                <DashboardCard card={activeCard} loading={loadingStates[activeCard.id] || false} isOverlay />
                            </Box>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </Box >
        </Fade >
    );
};

export default Dashboard;
