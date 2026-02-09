import { useAuth } from "../context/AuthContext";
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
    TextField,
    CircularProgress,
    Link as MuiLink,
    Fade,
    Zoom,
    Grow
} from "@mui/material";
import {
    Email as EmailIcon,
    Badge as IdIcon,
    Edit as EditIcon,
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    Code as CodeforcesIcon,
    Terminal as LeetCodeIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    CalendarToday as AgeIcon
} from "@mui/icons-material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../api/axios";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.union([z.number().min(8, "Minimum age is 8").max(120, "Maximum age is 120"), z.null(), z.literal("")]).optional(),
    socialHandles: z.object({
        github: z.string().optional().or(z.literal('')),
        codeforces: z.string().optional().or(z.literal('')),
        leetcode: z.string().optional().or(z.literal('')),
        linkedin: z.string().optional().or(z.literal('')),
    })
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            age: user?.age || null,
            socialHandles: {
                github: user?.socialHandles?.github || "",
                codeforces: user?.socialHandles?.codeforces || "",
                leetcode: user?.socialHandles?.leetcode || "",
                linkedin: user?.socialHandles?.linkedin || "",
            }
        }
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setLoading(true);
        // Clean up data: handle empty string or NaN from valueAsNumber
        const payload = {
            ...data,
            age: (data.age === "" || (typeof data.age === 'number' && isNaN(data.age))) ? null : data.age
        };

        try {
            const response = await api.put("/auth/profile", payload);
            updateUser(response.data.user);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (!isEditing) {
            reset({
                name: user?.name || "",
                age: user?.age || null,
                socialHandles: {
                    github: user?.socialHandles?.github || "",
                    codeforces: user?.socialHandles?.codeforces || "",
                    leetcode: user?.socialHandles?.leetcode || "",
                    linkedin: user?.socialHandles?.linkedin || "",
                }
            });
        } else {
            reset();
        }
        setIsEditing(!isEditing);
    };

    const socialIcons = {
        github: <GitHubIcon />,
        linkedin: <LinkedInIcon />,
        leetcode: <LeetCodeIcon />,
        codeforces: <CodeforcesIcon />
    };

    return (
        <Fade in timeout={800}>
            <Box sx={{ maxWidth: 900, mx: 'auto', pb: 8 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, letterSpacing: -1 }}>
                    My Profile
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        p: 0,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        position: 'relative',
                        overflow: 'hidden',
                        background: (theme) => theme.palette.mode === 'light'
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <Box sx={{
                        height: 140,
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
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
                    }} />

                    <Box sx={{ p: 4, pt: 0, position: 'relative', zIndex: 1, mt: -6 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems={{ xs: 'center', sm: 'flex-end' }} sx={{ mb: 6 }}>
                            <Zoom in timeout={1000}>
                                <Avatar
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        border: '6px solid white',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                                        fontSize: '3.5rem',
                                        fontWeight: 800,
                                        transform: 'translateY(0)',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px) scale(1.05)',
                                        }
                                    }}
                                >
                                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0].toUpperCase()}
                                </Avatar>
                            </Zoom>
                            <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                                {isEditing ? (
                                    <Grow in>
                                        <TextField
                                            label="Display Name"
                                            fullWidth
                                            variant="standard"
                                            {...register("name")}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            sx={{
                                                mb: 2,
                                                '& .MuiInput-root': {
                                                    fontSize: '2rem',
                                                    fontWeight: 800,
                                                }
                                            }}
                                        />
                                    </Grow>
                                ) : (
                                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                                        {user?.name || user?.email.split('@')[0]}
                                    </Typography>
                                )}

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
                                >
                                    <Chip
                                        label={user?.isVerified ? "Verified User" : "Pending Verification"}
                                        color={user?.isVerified ? "success" : "warning"}
                                        sx={{ fontWeight: 700, borderRadius: '8px' }}
                                    />
                                    <Chip
                                        label="Diamond Developer"
                                        variant="outlined"
                                        sx={{ fontWeight: 700, borderRadius: '8px', borderStyle: 'dashed' }}
                                    />
                                </Stack>
                            </Box>
                            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                                {isEditing ? (
                                    <>
                                        <Button
                                            type="button"
                                            variant="contained"
                                            disabled={loading}
                                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                            onClick={handleSubmit(onSubmit)}
                                            sx={{ px: 4, borderRadius: '12px' }}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            startIcon={<CancelIcon />}
                                            onClick={handleEditToggle}
                                            sx={{
                                                borderRadius: '12px',
                                                color: 'error.main',
                                                borderColor: 'rgba(239, 68, 68, 0.5)',
                                                '&:hover': {
                                                    borderColor: 'error.main',
                                                    bgcolor: 'rgba(239, 68, 68, 0.05)'
                                                }
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="contained"
                                        startIcon={<EditIcon />}
                                        onClick={handleEditToggle}
                                        sx={{
                                            px: 4,
                                            borderRadius: '12px',
                                            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.3)'
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </Stack>
                        </Stack>

                        <Divider sx={{ my: 4, opacity: 0.6 }} />

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={7}>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 4, height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
                                    Core Information
                                </Typography>
                                <Stack spacing={2.5}>
                                    <InfoCard
                                        icon={<EmailIcon />}
                                        label="Email Address"
                                        value={user?.email}
                                        bgcolor="rgba(99, 102, 241, 0.1)"
                                        color="primary.main"
                                    />

                                    {isEditing ? (
                                        <Grow in>
                                            <TextField
                                                label="Age"
                                                type="number"
                                                fullWidth
                                                variant="filled"
                                                {...register("age", { valueAsNumber: true })}
                                                error={!!errors.age}
                                                helperText={errors.age?.message as string}
                                                sx={{ '& .MuiFilledInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grow>
                                    ) : (
                                        <InfoCard
                                            icon={<AgeIcon />}
                                            label="Age"
                                            value={user?.age || "Not specified"}
                                            bgcolor="rgba(236, 72, 153, 0.1)"
                                            color="secondary.main"
                                        />
                                    )}

                                    <InfoCard
                                        icon={<IdIcon />}
                                        label="System ID"
                                        value={user?._id}
                                        bgcolor="rgba(14, 165, 233, 0.1)"
                                        color="info.main"
                                    />
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={5}>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 4, height: 24, bgcolor: 'secondary.main', borderRadius: 1 }} />
                                    Social Presence
                                </Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        borderRadius: 4,
                                        bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                                        border: '1px dashed',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Stack spacing={2}>
                                        {(['github', 'linkedin', 'leetcode', 'codeforces'] as const).map((platform, index) => (
                                            <Grow in timeout={1200 + (index * 100)} key={platform}>
                                                <Box>
                                                    {isEditing ? (
                                                        <TextField
                                                            label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                            fullWidth
                                                            variant="standard"
                                                            placeholder={`Your ${platform} username`}
                                                            {...register(`socialHandles.${platform}`)}
                                                            error={!!errors.socialHandles?.[platform]}
                                                            helperText={errors.socialHandles?.[platform]?.message}
                                                            sx={{ mb: 1 }}
                                                        />
                                                    ) : (
                                                        <SocialLink
                                                            icon={socialIcons[platform]}
                                                            label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                            value={user?.socialHandles?.[platform]}
                                                        />
                                                    )}
                                                </Box>
                                            </Grow>
                                        ))}
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
};

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value?: string | number;
    bgcolor: string;
    color: string;
}

const InfoCard = ({ icon, label, value, bgcolor, color }: InfoCardProps) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2.5,
            borderRadius: 4,
            bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.03)',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.2s ease',
            '&:hover': {
                borderColor: 'primary.light',
                transform: 'translateX(8px)',
                bgcolor: (theme) => theme.palette.mode === 'light' ? 'white' : 'rgba(255,255,255,0.05)',
            }
        }}
    >
        <Avatar sx={{ bgcolor, color, boxShadow: `0 4px 12px ${bgcolor}` }}>{icon}</Avatar>
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>{value || "---"}</Typography>
        </Box>
    </Box>
);

interface SocialLinkProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
}

const SocialLink = ({ icon, label, value }: SocialLinkProps) => {
    const getFullUrl = (platform: string, handle: string) => {
        switch (platform.toLowerCase()) {
            case 'github': return `https://github.com/${handle}`;
            case 'linkedin': return `https://linkedin.com/in/${handle}`;
            case 'leetcode': return `https://leetcode.com/${handle}`;
            case 'codeforces': return `https://codeforces.com/profile/${handle}`;
            default: return handle;
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1,
                borderRadius: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                    bgcolor: 'action.hover',
                }
            }}
        >
            <Avatar
                sx={{
                    bgcolor: value ? 'primary.main' : 'action.disabledBackground',
                    color: value ? 'white' : 'text.disabled',
                    width: 48,
                    height: 48,
                    boxShadow: value ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
                }}
            >
                {icon}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{label}</Typography>
                {value ? (
                    <MuiLink
                        href={getFullUrl(label, value)}
                        target="_blank"
                        rel="noopener"
                        sx={{
                            display: 'block',
                            fontWeight: 700,
                            textDecoration: 'none',
                            color: 'text.primary',
                            fontSize: '0.9rem',
                            '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                        }}
                    >
                        {value}
                    </MuiLink>
                ) : (
                    <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.85rem' }}>Not linked</Typography>
                )}
            </Box>
        </Box>
    );
};

export default Profile;
