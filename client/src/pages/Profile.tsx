import { useAuth, User } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Fade,
    useTheme
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { getNetwork, getUserById } from "../services/socialService";
import NetworkModal from "../components/NetworkModal";
import EditProfileDialog, { ProfileUpdateData } from "../components/EditProfileDialog";
import Loader from "../components/Loader";

// Import profile section components
import ProfileHeader from "../components/profile/ProfileHeader";
import NetworkStats from "../components/profile/NetworkStats";
import ActivitySection from "../components/profile/ActivitySection";
import AboutSkillsSection from "../components/profile/AboutSkillsSection";
import ExperienceSection from "../components/profile/ExperienceSection";
import ProjectsSection from "../components/profile/ProjectsSection";
import CertificationsSection from "../components/profile/CertificationsSection";
import ProfileCompletion from "../components/profile/ProfileCompletion";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { userId } = useParams();
    const theme = useTheme();

    const [activityData, setActivityData] = useState<Array<{ date: string; count: number; posts?: number; comments?: number; likes?: number }>>([]);
    const [activityStats, setActivityStats] = useState({ totalPosts: 0, currentStreak: 0, longestStreak: 0, activeDays: 0 });
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [networkStats, setNetworkStats] = useState({ followers: 0, following: 0 });
    const [networkModalOpen, setNetworkModalOpen] = useState(false);
    const [networkModalTab, setNetworkModalTab] = useState(0);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const isOwnProfile = !userId || userId === user?._id;

    const [profileLoading, setProfileLoading] = useState(!isOwnProfile);

    const displayUser = isOwnProfile ? user : otherUser;

    const handleSaveProfile = async (data: ProfileUpdateData) => {
        try {
            const response = await api.put("/auth/profile", data);
            updateUser(response.data.user);
        } catch (error) {
            console.error("Failed to update profile", error);
            throw error;
        }
    };

    const loadNetworkStats = useCallback(async () => {
        const targetId = userId || user?._id;
        if (targetId) {
            try {
                const { data } = await getNetwork(targetId);
                setNetworkStats({ followers: data.followersCount, following: data.followingCount });
            } catch (error) {
                console.error("Failed to load network stats", error);
            }
        }
    }, [userId, user?._id]);

    useEffect(() => {
        const fetchActivity = async () => {
            if (isOwnProfile) {
                try {
                    const { data } = await api.get('/auth/activity');
                    setActivityData(data.activity);
                    setActivityStats(data.stats);
                } catch (error) {
                    console.error('Failed to fetch activity', error);
                }
            }
        };

        const loadProfileData = async () => {
            if (!isOwnProfile && userId) {
                setProfileLoading(true);
                try {
                    const { data } = await getUserById(userId);
                    setOtherUser(data);
                    // Extract activity and stats from public profile response
                    if (data.activity) setActivityData(data.activity);
                    if (data.activityStats) setActivityStats(data.activityStats);
                } catch (error) {
                    console.error("Failed to load user profile", error);
                } finally {
                    setProfileLoading(false);
                }
            }
        };

        fetchActivity();
        loadProfileData();
        loadNetworkStats();
    }, [userId, isOwnProfile, loadNetworkStats]);

    const handleOpenNetworkModal = (tab: number) => {
        setNetworkModalTab(tab);
        setNetworkModalOpen(true);
    };

    const calculateDuration = (startDate: string | Date, endDate?: string | Date, current?: boolean) => {
        const start = new Date(startDate);
        const end = current ? new Date() : endDate ? new Date(endDate) : new Date();
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (years === 0) return `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
        if (remainingMonths === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
        return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    };

    const calculateProfileCompletion = () => {
        if (!displayUser) return 0;
        let score = 0;
        const fields = [
            displayUser.name,
            displayUser.about,
            displayUser.avatar,
            displayUser.skills?.length,
            displayUser.experience?.length,
            displayUser.projects?.length,
            displayUser.certifications?.length,
            displayUser.socialHandles?.github || displayUser.socialHandles?.linkedin
        ];
        fields.forEach(field => { if (field) score += 12.5; });
        return Math.round(score);
    };

    const profileCompletion = calculateProfileCompletion();

    const styles = {
        container: {
            maxWidth: 1400,
            mx: 'auto',
            px: { xs: 1, sm: 2, md: 3 }, minHeight: "100vh"
        },
        headerTitle: {
            fontWeight: 900,
            fontSize: 'clamp(1.3rem, 10vw, 2.5rem)',
            mb: { xs: 3, md: 4 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        },
        bentoCard: {
            p: { xs: 2.5, sm: 4, md: 4 },
            my: 1.3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: `0 8px 32px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.4)'}`,
                borderColor: 'primary.main'
            }
        },
        identityWrapper: {
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: { xs: 'center', md: 'flex-start' }
        },
        avatar: {
            width: { xs: 120, md: 150 },
            height: { xs: 120, md: 150 },
            border: '4px solid',
            borderColor: 'primary.main',
            boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 900
        },
        name: {
            fontWeight: 900,
            fontSize: { xs: '1.5rem', md: '2rem', sm: '2rem' }
        },
        sectionTitle: {
            fontWeight: 900,
            fontSize: { xs: '1.3rem', md: '1.3rem' },
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            '&::before': {
                content: '""',
                width: 6,
                height: 24,
                bgcolor: 'primary.main',
                borderRadius: 1
            }
        },
        statBox: {
            textAlign: 'center',
            p: { xs: 1, sm: 2.5, md: 1 },
            my: 1,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.2s',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 16px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)'}`
            }
        },
        statValue: {
            fontWeight: 900,
            fontSize: 'clamp(1.2rem, 4vw, 2.2rem)',
            mb: 0.5
        },
        statLabel: {
            fontSize: { xs: '0.55rem', sm: '0.55em' },
            fontWeight: 500,
            letterSpacing: 1,
            opacity: 0.6,
            textTransform: 'uppercase'
        },
        progressContainer: {
            mt: 4,
            width: '100%'
        },
        progressBar: {
            height: 10,
            borderRadius: 5,
            bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
            '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }
        },
        editbutton: {
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 10,
            cursor: 'pointer',
            borderRadius: 1.5,
            fontWeight: 900,
            textTransform: 'none',
            color: theme.palette.primary.main,
            px: 3,
            '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 16px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.53)' : 'rgba(0,0,0,0.3)'}`
            }
        }
    };

    return (
        <Fade in timeout={800}>
            <Box sx={styles.container}>
                <Typography variant="h2" sx={styles.headerTitle}>
                    Profile Dashboard
                </Typography>

                {profileLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <Loader size={60} fullPage />
                    </Box>
                ) : (
                    <Grid container spacing={3.5}>
                        {/* Profile Header */}
                        <Grid item xs={12} lg={8}>
                            <Grid container spacing={3.5}>
                                <Grid item xs={12}>
                                    <ProfileHeader
                                        displayUser={displayUser}
                                        isOwnProfile={isOwnProfile}
                                        onEditClick={() => setEditDialogOpen(true)}
                                        styles={styles}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ProfileCompletion
                                        profileCompletion={profileCompletion}
                                        styles={styles}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Profile Info & Stats */}
                        <Grid item xs={12} lg={4}>
                            <NetworkStats
                                networkStats={networkStats}
                                activityStats={activityStats}
                                certificationsCount={displayUser?.certifications?.length || 0}
                                onOpenNetworkModal={handleOpenNetworkModal}
                                styles={styles}
                            />
                        </Grid>

                        {/* Activity Heatmap */}
                        <Grid item xs={12}>
                            <ActivitySection activityData={activityData} styles={styles} />
                        </Grid>

                        {/* About & Skills */}
                        <Grid item xs={12}>
                            <AboutSkillsSection displayUser={displayUser} styles={styles} />
                        </Grid>

                        {/* Experience & Connect */}
                        <Grid item xs={12}>
                            <ExperienceSection
                                displayUser={displayUser}
                                calculateDuration={calculateDuration}
                                styles={styles}
                            />
                        </Grid>

                        {/* Certifications */}
                        <Grid item xs={12}>
                            <CertificationsSection
                                displayUser={displayUser}
                                styles={styles}
                            />
                        </Grid>

                        {/* Projects */}
                        <Grid item xs={12}>
                            <ProjectsSection
                                displayUser={displayUser}
                                calculateDuration={calculateDuration}
                                styles={styles}
                            />
                        </Grid>
                    </Grid>
                )}

                {/* Modals */}
                <NetworkModal
                    open={networkModalOpen}
                    onClose={() => setNetworkModalOpen(false)}
                    userId={userId || user?._id || ''}
                    initialTab={networkModalTab}
                />

                {isOwnProfile && (
                    <EditProfileDialog
                        open={editDialogOpen}
                        onClose={() => setEditDialogOpen(false)}
                        onSave={handleSaveProfile}
                        user={user}
                    />
                )}
            </Box>
        </Fade>
    );
};

export default Profile;
