import { useAuth, User } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Divider,
    Grid,
    Button,
    Chip,
    Stack,
    Fade,
    Grow,
    Theme,
    Zoom,
    Tooltip
} from "@mui/material";
import {
    Email as EmailIcon,
    Badge as IdIcon,
    Edit as EditIcon,
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    Code as CodeforcesIcon,
    Terminal as LeetCodeIcon,
    CalendarToday as AgeIcon
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import api from "../api/axios";
import ActivityStatCard from "../components/ActivityStatCard";
import { getNetwork, getUserById } from "../services/socialService";
import FollowButton from "../components/FollowButton";
import NetworkModal from "../components/NetworkModal";
import EditProfileDialog from "../components/EditProfileDialog";
import CalendarHeatmap from 'react-calendar-heatmap';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { userId } = useParams();

    const [activityData, setActivityData] = useState<Array<{ date: string; count: number; posts?: number; comments?: number; likes?: number }>>([]);
    const [activityStats, setActivityStats] = useState({ totalPosts: 0, currentStreak: 0, longestStreak: 0, activeDays: 0 });
    const [loadingActivity, setLoadingActivity] = useState(true);
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [networkStats, setNetworkStats] = useState({ followers: 0, following: 0 });
    const [networkModalOpen, setNetworkModalOpen] = useState(false);
    const [networkModalTab, setNetworkModalTab] = useState(0);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const isOwnProfile = !userId || userId === user?._id;
    const displayUser = isOwnProfile ? user : otherUser;

    // Calculate date range for heatmap
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const handleSaveProfile = async (data: any) => {
        try {
            const response = await api.put("/auth/profile", data);
            updateUser(response.data.user);
        } catch (error) {
            console.error("Failed to update profile", error);
            throw error; // Re-throw to let dialog handle error state if needed
        }
    };

    // Fetch activity data and user data
    useEffect(() => {
        const fetchActivity = async () => {

            if (isOwnProfile) {
                try {
                    const { data } = await api.get('/auth/activity');
                    setActivityData(data.activity);
                    setActivityStats(data.stats);
                } catch (error) {
                    console.error('Failed to fetch activity', error);
                } finally {
                    setLoadingActivity(false);
                }
            } else {
                setLoadingActivity(false); // Disable heatmap for others for now or implement public activity endpoint
            }
        };

        const loadProfileData = async () => {
            if (!isOwnProfile && userId) {
                try {
                    const { data } = await getUserById(userId);
                    setOtherUser(data);
                } catch (error) {
                    console.error("Failed to load user", error);
                }
            }
        };

        const loadNetworkStats = async () => {
            const targetId = userId || user?._id;
            if (targetId) {
                try {
                    const { data } = await getNetwork(targetId);
                    setNetworkStats({ followers: data.followersCount, following: data.followingCount });
                } catch (error) {
                    console.error("Failed to load network stats", error);
                }
            }
        };

        fetchActivity();
        loadProfileData();
        loadNetworkStats();
    }, [userId, isOwnProfile, user?._id]);


    const handleOpenNetworkModal = (tab: number) => {
        setNetworkModalTab(tab);
        setNetworkModalOpen(true);
    };

    const socialIcons = {
        github: <GitHubIcon />,
        linkedin: <LinkedInIcon />,
        leetcode: <LeetCodeIcon />,
        codeforces: <CodeforcesIcon />
    };

    const styles = {
        container: { maxWidth: 900, mx: 'auto', pb: 8 },
        headerTitle: { fontWeight: 800, mb: 4, letterSpacing: -1 },
        profilePaper: {
            p: 0,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            position: 'relative',
            overflow: 'hidden',
        },
        profilePaperDynamic: (theme: Theme) => ({
            background: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
        }),
        banner: (theme: Theme) => ({
            height: 140,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            position: 'relative',
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
            }
        }),
        contentBox: { p: 4, pt: 0, position: 'relative', zIndex: 1, mt: -6 },
        headerStack: { mb: 6 },
        avatar: (theme: Theme) => ({
            width: 140,
            height: 140,
            border: '6px solid white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            fontSize: '3.5rem',
            fontWeight: 800,
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px) scale(1.05)',
            }
        }),
        infoBox: { flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } },
        nameInput: {
            mb: 2,
            '& .MuiInput-root': {
                fontSize: '2rem',
                fontWeight: 800,
            }
        },
        nameTypography: { fontWeight: 800, mb: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' },
        chipStack: { justifyContent: { xs: 'center', sm: 'flex-start' } },
        verifiedChip: { fontWeight: 700, borderRadius: '8px' },
        roleChip: { fontWeight: 700, borderRadius: '8px', borderStyle: 'dashed' },
        actionButtonsStack: { mb: 1 },
        saveButton: { px: 4, borderRadius: '12px' },
        cancelButton: {
            borderRadius: '12px',
            color: 'error.main',
            borderColor: 'rgba(239, 68, 68, 0.5)',
            '&:hover': {
                borderColor: 'error.main',
                bgcolor: 'rgba(239, 68, 68, 0.05)'
            }
        },
        editButton: {
            px: 4,
            borderRadius: '12px',
            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.3)'
        },
        divider: { my: 4, opacity: 0.6 },
        sectionTitle: { fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 },
        sectionIndicatorPrimary: { width: 4, height: 24, bgcolor: 'primary.main', borderRadius: 1 },
        sectionIndicatorSecondary: { width: 4, height: 24, bgcolor: 'secondary.main', borderRadius: 1 },
        ageInput: { '& .MuiFilledInput-root': { borderRadius: '12px' } },
        socialPaper: (theme: Theme) => ({
            p: 2,
            borderRadius: 4,
            bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
            border: '1px dashed',
            borderColor: 'divider'
        }),
        socialInput: { mb: 1 },
        topSection: { display: 'flex', justifyContent: 'space-between', width: '100%', mb: -4, px: { xs: 0, sm: 2 }, pt: 3, position: 'relative', zIndex: 10 },
        networkStatCard: (theme: Theme) => ({
            cursor: 'pointer',
            textAlign: 'center',
            p: 1.5,
            px: 2.5,
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 80
        }),
        networkStatValue: (color: string) => ({
            fontWeight: 800,
            lineHeight: 1,
            color: color
        }),
        networkStatLabel: { mt: 0.5, letterSpacing: 0.5, fontWeight: 700, color: "text.secondary" },
        verifiedTooltip: {
            position: 'absolute',
            bottom: 10,
            right: 10,
            bgcolor: 'background.paper',
            borderRadius: '50%',
            p: 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        },
        verifiedIcon: { fontSize: 24 },
        bio: { fontStyle: 'italic', color: 'text.secondary', mb: 3 },
        aboutText: { whiteSpace: 'pre-line', mb: 5, lineHeight: 1.8 },
        noAboutText: { mb: 5, fontStyle: 'italic', color: "text.secondary" },
        sectionSubtitle: { fontWeight: 800, mb: 2, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.75rem', letterSpacing: 1 },
        skillChip: { borderRadius: 2, bgcolor: 'action.hover', fontWeight: 600, px: 1 },
        hobbyChip: { borderRadius: 2, fontWeight: 500, px: 1 },
        detailsPaper: (theme: Theme) => ({ p: 4, borderRadius: 4, bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'rgba(255,255,255,0.02)', borderStyle: 'dashed' }),
        userIdText: { fontFamily: 'monospace', fontWeight: 500 },
        socialChip: { borderRadius: 2, pl: 1, textTransform: 'capitalize' },
        activityHeaderBox: (theme: Theme) => ({
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            p: 3,
            position: 'relative',
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            }
        }),
        activityHeaderTitle: {
            fontWeight: 900,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            letterSpacing: '-0.5px'
        },
        activityHeaderIndicator: {
            width: 6,
            height: 32,
            bgcolor: 'rgba(255,255,255,0.9)',
            borderRadius: 2,
            boxShadow: '0 0 20px rgba(255,255,255,0.5)'
        },
        activityHeaderSubtitle: {
            color: 'rgba(255,255,255,0.9)',
            mt: 0.5,
            ml: 4,
            fontWeight: 500
        },
        heatmapContainer: (theme: Theme) => ({
            p: 4,
            borderRadius: 1,
            background: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }),
        heatmapTitle: {
            fontWeight: 800,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            color: 'text.primary'
        },
        heatmapIndicator: {
            width: 5,
            height: 28,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)'
        },
        heatmapWrapper: {
            '& .react-calendar-heatmap': { width: '100%' },
            '& .react-calendar-heatmap-month-label': { fontSize: '0.8rem', fill: 'currentColor', opacity: 0.7, fontWeight: 600 },
            '& .react-calendar-heatmap-weekday-label': { fontSize: '0.75rem', fill: 'currentColor', opacity: 0.6, fontWeight: 500, display: 'block !important' },
            '& .color-empty': (theme: Theme) => ({
                fill: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
                stroke: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
                strokeWidth: 0.5
            }),
            '& .color-scale-1': { fill: '#d0f0c0', filter: 'drop-shadow(0 1px 2px rgba(144, 238, 144, 0.3))' },
            '& .color-scale-2': { fill: '#90ee90', filter: 'drop-shadow(0 1px 3px rgba(144, 238, 144, 0.4))' },
            '& .color-scale-3': { fill: '#32cd32', filter: 'drop-shadow(0 2px 4px rgba(50, 205, 50, 0.5))' },
            '& .color-scale-4': { fill: '#228b22', filter: 'drop-shadow(0 2px 6px rgba(34, 139, 34, 0.6))' },
            '& rect': { rx: 3, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
            '& rect:hover': (theme: Theme) => ({
                stroke: theme.palette.primary.main,
                strokeWidth: 2,
                opacity: 0.9,
                transform: 'scale(1.1)',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            })
        },
        heatmapWeekdayLabels: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            pb: 0.5,
            gap: 0.6,
            my: 3,
        },
        heatmapWeekdayLabel: {
            height: '10px',
            my: 0.65,
            lineHeight: '10px',
            fontSize: '0.65rem',
            color: 'text.secondary',
            fontWeight: 600
        },
        legendContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            mt: 4,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider'
        },
        legendLabel: {
            fontWeight: 600,
            color: 'text.secondary',
            fontSize: '0.75rem'
        },
        legendBox: (color: string) => ({
            width: 18,
            height: 18,
            bgcolor: color,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
                transform: 'scale(1.3)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 1
            }
        })
    }
    return (
        <Fade in timeout={800} >
            <Box sx={styles.container}>
                <Typography variant="h4" sx={styles.headerTitle}>
                    My Profile
                </Typography>

                <Paper
                    elevation={0}
                    sx={[styles.profilePaper, styles.profilePaperDynamic] as any}
                >
                    <Box sx={styles.banner} />

                    <Box sx={styles.contentBox}>
                        {/* Top Section: Network Stats (Glass Cards) */}
                        <Box sx={styles.topSection}>
                            <Paper
                                elevation={0}
                                sx={{
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    p: 1.5,
                                    px: 2.5,
                                    borderRadius: 3,
                                    bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(8px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    minWidth: 80
                                }}
                                onClick={() => handleOpenNetworkModal(0)}
                            >
                                <Typography variant="h5" sx={styles.networkStatValue("secondary.main")}>
                                    {networkStats?.followers || 0}
                                </Typography>
                                <Typography variant="caption" sx={styles.networkStatLabel}>
                                    FOLLOWERS
                                </Typography>
                            </Paper>

                            <Paper
                                elevation={0}
                                sx={{
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    p: 1.5,
                                    px: 2.5,
                                    borderRadius: 3,
                                    bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(8px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    minWidth: 80
                                }}
                                onClick={() => handleOpenNetworkModal(1)}
                            >
                                <Typography variant="h5" sx={styles.networkStatValue("info.main")}>
                                    {networkStats?.following || 0}
                                </Typography>
                                <Typography variant="caption" sx={styles.networkStatLabel}>
                                    FOLLOWING
                                </Typography>
                            </Paper>
                        </Box>

                        {/* Middle Section: Avatar & Identity (Centered) */}
                        <Stack alignItems="center" spacing={2} sx={{ mt: -7, mb: 6 }}>
                            <Zoom in timeout={1000}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        sx={styles.avatar}
                                    >
                                        {displayUser?.name?.[0]?.toUpperCase() || displayUser?.email?.[0].toUpperCase()}
                                    </Avatar>
                                    {displayUser?.isVerified && (
                                        <Tooltip title="Verified User">
                                            <Box sx={styles.verifiedTooltip}>
                                                <IdIcon color="primary" sx={styles.verifiedIcon} />
                                            </Box>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Zoom>

                            <Box sx={{ textAlign: 'center', width: '100%', maxWidth: 600 }}>
                                <Typography variant="h3" sx={{ ...styles.nameTypography, textAlign: 'center' }}>
                                    {displayUser?.name || displayUser?.email.split('@')[0]}
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    justifyContent="center"
                                    sx={{ mb: 2 }}
                                >
                                    {displayUser?.isVerified && (
                                        <Chip
                                            label="Verified"
                                            color="success"
                                            size="small"
                                            icon={<IdIcon />}
                                            sx={styles.skillChip}
                                        />
                                    )}
                                    <Chip
                                        label="Diamond Dev"
                                        variant="outlined"
                                        size="small"
                                        sx={styles.roleChip}
                                    />
                                </Stack>

                                {displayUser?.bio && (
                                    <Typography variant="body1" sx={styles.bio}>
                                        "{displayUser.bio}"
                                    </Typography>
                                )}

                                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                                    {!isOwnProfile && displayUser && (
                                        <FollowButton
                                            userId={displayUser._id}
                                            initialIsFollowing={user?.following?.includes(displayUser._id) || false}
                                            onToggle={() => { }}
                                        />
                                    )}
                                    {isOwnProfile && (
                                        <Button
                                            type="button"
                                            variant="contained"
                                            startIcon={<EditIcon />}
                                            onClick={() => setEditDialogOpen(true)}
                                            sx={styles.editButton}
                                        >
                                            Edit Profile
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        </Stack>

                        <Divider sx={styles.divider} />

                        <Grid container spacing={6}>
                            <Grid item xs={12} md={7}>
                                <Box>
                                    <Typography variant="h6" sx={styles.sectionTitle}>
                                        <Box sx={styles.sectionIndicatorPrimary} />
                                        About Me
                                    </Typography>

                                    {displayUser?.about ? (
                                        <Typography variant="body1" color="text.secondary" sx={styles.aboutText}>
                                            {displayUser.about}
                                        </Typography>
                                    ) : (
                                        <Typography variant="body1" sx={styles.noAboutText}>
                                            No detailed description has been added yet.
                                        </Typography>
                                    )}

                                    <Stack spacing={4}>
                                        <Box>
                                            <Typography variant="subtitle2" sx={styles.sectionSubtitle}>Tech Skills</Typography>
                                            {(displayUser?.skills?.length ?? 0) > 0 ? (
                                                <Grid container spacing={1}>
                                                    {displayUser?.skills?.map(skill => (
                                                        <Grid item key={skill}>
                                                            <Chip label={skill} sx={styles.skillChip} />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">No skills listed.</Typography>
                                            )}
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" sx={styles.sectionSubtitle}>Hobbies & Interests</Typography>
                                            {(displayUser?.hobbies?.length ?? 0) > 0 ? (
                                                <Grid container spacing={1}>
                                                    {displayUser?.hobbies?.map(hobby => (
                                                        <Grid item key={hobby}>
                                                            <Chip label={hobby} variant="outlined" sx={styles.hobbyChip} />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">No hobbies listed.</Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={5}>
                                <Paper variant="outlined" sx={styles.detailsPaper}>
                                    <Typography variant="h6" sx={{ ...styles.sectionTitle, mb: 4 }}>
                                        <Box sx={styles.sectionIndicatorSecondary} />
                                        Details
                                    </Typography>

                                    <Stack spacing={3}>
                                        <Box>
                                            <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" gutterBottom>EMAIL</Typography>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <EmailIcon fontSize="small" color="primary" />
                                                <Typography variant="body2" fontWeight="500">{displayUser?.email}</Typography>
                                            </Stack>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" gutterBottom>AGE</Typography>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <AgeIcon fontSize="small" color="secondary" />
                                                <Typography variant="body2" fontWeight="500">{displayUser?.age || "Not specified"}</Typography>
                                            </Stack>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" gutterBottom>USER ID</Typography>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <IdIcon fontSize="small" color="info" />
                                                <Typography variant="body2" fontWeight="500" sx={styles.userIdText}>{displayUser?._id}</Typography>
                                            </Stack>
                                        </Box>

                                        <Box sx={{ pt: 2 }}>
                                            <Typography variant="subtitle2" sx={styles.sectionSubtitle}>Social Presence</Typography>
                                            <Stack direction="row" flexWrap="wrap" gap={1.5}>
                                                {(['github', 'linkedin', 'leetcode', 'codeforces'] as const).map(platform => {
                                                    if (!displayUser?.socialHandles?.[platform]) return null;
                                                    return (
                                                        <Tooltip title={platform} key={platform}>
                                                            <Chip
                                                                icon={socialIcons[platform]}
                                                                label={platform}
                                                                component="a"
                                                                href={`https://${platform}.com/${displayUser.socialHandles[platform]}`}
                                                                target="_blank"
                                                                clickable
                                                                sx={styles.socialChip}
                                                            />
                                                        </Tooltip>
                                                    );
                                                })}
                                                {!Object.values(displayUser?.socialHandles || {}).some(Boolean) && (
                                                    <Typography variant="caption" color="text.secondary">No social profiles connected.</Typography>
                                                )}
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>

                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={[
                        styles.profilePaper,
                        styles.profilePaperDynamic,
                        {
                            mt: 4,
                            p: 0,
                            overflow: 'hidden',
                            background: (theme: Theme) => theme.palette.mode === 'light'
                                ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(249,250,251,0.9) 100%)'
                                : 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,41,59,0.8) 100%)',
                        }
                    ]}
                >
                    {/* Header Section with Gradient */}
                    <Box sx={styles.activityHeaderBox}>
                        <Typography variant="h5" sx={styles.activityHeaderTitle}>
                            <Box sx={styles.activityHeaderIndicator} />
                            Activity Overview
                        </Typography>
                        <Typography variant="body2" sx={styles.activityHeaderSubtitle}>
                            Track your contribution journey over the past year
                        </Typography>
                    </Box>


                    {loadingActivity ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                            <Loader />
                        </Box>
                    ) : (
                        <Box sx={{ p: 4 }}>
                            {/* Stats Grid */}
                            <Grid container spacing={2.5} sx={{ mb: 5 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <ActivityStatCard
                                        label="Total Posts"
                                        value={activityStats.totalPosts}
                                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                        shadowColor="rgba(102, 126, 234, 0.35)"
                                        timeout={600}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <ActivityStatCard
                                        label="Current Streak"
                                        value={activityStats.currentStreak}
                                        gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                                        shadowColor="rgba(56, 239, 125, 0.35)"
                                        timeout={700}
                                        suffix="days"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <ActivityStatCard
                                        label="Longest Streak"
                                        value={activityStats.longestStreak}
                                        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                                        shadowColor="rgba(245, 87, 108, 0.35)"
                                        timeout={800}
                                        suffix="days"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <ActivityStatCard
                                        label="Active Days"
                                        value={activityStats.activeDays}
                                        gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                                        shadowColor="rgba(254, 225, 64, 0.35)"
                                        timeout={900}
                                    />
                                </Grid>
                            </Grid>

                            {/* Heatmap Section */}
                            <Grow in timeout={1000}>
                                <Box sx={styles.heatmapContainer}>
                                    <Typography variant="h6" sx={styles.heatmapTitle}>
                                        <Box sx={styles.heatmapIndicator} />
                                        Contribution Calendar
                                    </Typography>

                                    <Box sx={styles.heatmapWrapper}>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {/* Custom Weekday Labels */}
                                            <Box sx={styles.heatmapWeekdayLabels}>
                                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                    <Typography key={day} variant="caption" sx={styles.heatmapWeekdayLabel}>{day}</Typography>
                                                ))}
                                            </Box>

                                            {/* Heatmap */}
                                            <Box sx={{ flex: 1 }}>
                                                <CalendarHeatmap
                                                    startDate={oneYearAgo}
                                                    endDate={today}
                                                    values={activityData}
                                                    classForValue={(value) => {
                                                        if (!value || value.count === 0) return 'color-empty';
                                                        if (value.count === 1) return 'color-scale-1';
                                                        if (value.count === 2 || value.count === 3) return 'color-scale-2';
                                                        if (value.count === 4 || value.count === 5) return 'color-scale-3';
                                                        return 'color-scale-4';
                                                    }}

                                                    transformDayElement={(element, value, index) => {
                                                        const tooltipTitle = (() => {
                                                            if (!value || !value.date) {
                                                                return 'No activity on this day';
                                                            }
                                                            const date = new Date(value.date);
                                                            const formattedDate = date.toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            });

                                                            // Build detailed activity string
                                                            const activities = [];
                                                            if (value.posts > 0) activities.push(`${value.posts} post${value.posts !== 1 ? 's' : ''}`);
                                                            if (value.comments > 0) activities.push(`${value.comments} comment${value.comments !== 1 ? 's' : ''}`);
                                                            if (value.likes > 0) activities.push(`${value.likes} like${value.likes !== 1 ? 's' : ''}`);

                                                            const activityText = activities.length > 0
                                                                ? activities.join(', ')
                                                                : `${value.count} activity`;

                                                            return (
                                                                <Box sx={{ textAlign: 'center' }}>
                                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{formattedDate}</Typography>
                                                                    <Typography variant="caption">{activityText}</Typography>
                                                                </Box>
                                                            );
                                                        })();

                                                        return (
                                                            <Tooltip title={tooltipTitle} key={index} arrow>
                                                                {element as unknown as React.ReactElement}
                                                            </Tooltip>
                                                        );
                                                    }}
                                                    showWeekdayLabels={false}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Legend */}
                                    <Box sx={styles.legendContainer}>
                                        <Typography variant="caption" sx={{
                                            fontWeight: 600,
                                            color: 'text.secondary',
                                            fontSize: '0.75rem'
                                        }}>
                                            Less
                                        </Typography>
                                        {['rgba(0,0,0,0.04)', '#d0f0c0', '#90ee90', '#32cd32', '#228b22'].map((color, index) => (
                                            <Box
                                                key={index}
                                                sx={styles.legendBox(color)}
                                            />
                                        ))}
                                        <Typography variant="caption" sx={{
                                            fontWeight: 600,
                                            color: 'text.secondary',
                                            fontSize: '0.75rem'
                                        }}>
                                            More
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grow>
                        </Box>
                    )}
                </Paper>
                <NetworkModal
                    open={networkModalOpen}
                    onClose={() => setNetworkModalOpen(false)}
                    initialTab={networkModalTab}
                    userId={isOwnProfile ? user?._id || "" : userId || ""}
                />

                <EditProfileDialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    user={user}
                    onSave={handleSaveProfile}
                />
            </Box >
        </Fade >
    );
};



export default Profile;
