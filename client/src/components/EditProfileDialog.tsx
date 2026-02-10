import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    IconButton,
    InputAdornment,
    Tabs,
    Tab,
    useTheme,
    useMediaQuery,
    Stack,
    Fade,
    Divider
} from '@mui/material';
import Loader from './Loader';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    Work as WorkIcon,
    Share as ShareIcon,
    Save as SaveIcon,
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    Code as CodeforcesIcon,
    Terminal as LeetCodeIcon
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '../context/AuthContext';

// Define the schema here (moved from Profile.tsx)
const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.union([z.number().min(8, "Minimum age is 8").max(120, "Maximum age is 120"), z.null(), z.literal("")]).optional(),
    socialHandles: z.object({
        github: z.string().optional().or(z.literal('')),
        codeforces: z.string().optional().or(z.literal('')),
        leetcode: z.string().optional().or(z.literal('')),
        linkedin: z.string().optional().or(z.literal('')),
    }),
    bio: z.string().optional(),
    about: z.string().optional(),
    skills: z.array(z.string()).optional(),
    hobbies: z.array(z.string()).optional(),
    experience: z.array(z.any()).optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
    onSave: (data: ProfileFormValues) => Promise<void>;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ open, onClose, user, onSave }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [activeTab, setActiveTab] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Form setup
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            age: null,
            socialHandles: { github: "", codeforces: "", leetcode: "", linkedin: "" },
            bio: "",
            about: "",
            skills: [],
            hobbies: [],
            experience: []
        }
    });

    // Handle Skills/Hobbies as comma separated strings for editing
    const [skillsString, setSkillsString] = useState("");
    const [hobbiesString, setHobbiesString] = useState("");

    // Initialize form when user data is available
    useEffect(() => {
        if (user && open) {
            reset({
                name: user.name || "",
                age: user.age || null,
                socialHandles: {
                    github: user.socialHandles?.github || "",
                    codeforces: user.socialHandles?.codeforces || "",
                    leetcode: user.socialHandles?.leetcode || "",
                    linkedin: user.socialHandles?.linkedin || "",
                },
                bio: user.bio || "",
                about: user.about || "",
                skills: user.skills || [],
                hobbies: user.hobbies || [],
                experience: user.experience || []
            });
            setSkillsString(user.skills?.join(", ") || "");
            setHobbiesString(user.hobbies?.join(", ") || "");
        }
    }, [user, open, reset]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleFormSubmit = async (data: ProfileFormValues) => {
        setIsSaving(true);
        // Process strings to arrays
        const processedSkills = skillsString.split(',').map(s => s.trim()).filter(s => s);
        const processedHobbies = hobbiesString.split(',').map(s => s.trim()).filter(s => s);

        const payload = {
            ...data,
            skills: processedSkills,
            hobbies: processedHobbies
        };

        try {
            await onSave(payload);
            onClose();
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    const socialIcons = {
        github: <GitHubIcon />,
        linkedin: <LinkedInIcon />,
        leetcode: <LeetCodeIcon />,
        codeforces: <CodeforcesIcon />
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: fullScreen ? 0 : 3,
                    bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(15,23,42,0.95)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                    backgroundImage: 'none'
                }
            }}
            TransitionComponent={Fade}
            transitionDuration={400}
        >
            <DialogTitle sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Typography variant="h5" fontWeight="800">Edit Profile</Typography>
                <IconButton onClick={onClose} size="small" sx={{ bgcolor: 'action.hover' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, height: fullScreen ? '100%' : 500, display: 'flex', flexDirection: fullScreen ? 'column' : 'row' }}>
                {/* Sidebar Tabs for Desktop / Top Tabs for Mobile */}
                <Box sx={{
                    width: fullScreen ? '100%' : 220,
                    borderRight: fullScreen ? 0 : '1px solid',
                    borderBottom: fullScreen ? '1px solid' : 0,
                    borderColor: 'divider',
                    bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.50' : 'rgba(0,0,0,0.2)'
                }}>
                    <Tabs
                        orientation={fullScreen ? "horizontal" : "vertical"}
                        variant={fullScreen ? "fullWidth" : "scrollable"}
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                alignItems: fullScreen ? 'center' : 'flex-start',
                                textAlign: 'left',
                                pl: fullScreen ? 2 : 3,
                                py: 2,
                                minHeight: 60,
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                textTransform: 'none'
                            }
                        }}
                    >
                        <Tab icon={<PersonIcon sx={{ mb: 0, mr: 1.5 }} />} iconPosition="start" label="Personal" />
                        <Tab icon={<WorkIcon sx={{ mb: 0, mr: 1.5 }} />} iconPosition="start" label="Professional" />
                        <Tab icon={<ShareIcon sx={{ mb: 0, mr: 1.5 }} />} iconPosition="start" label="Socials" />
                    </Tabs>
                </Box>

                {/* Content Area */}
                <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
                    <form id="edit-profile-form" onSubmit={handleSubmit(handleFormSubmit)}>
                        {/* Tab 0: Personal Info */}
                        <div role="tabpanel" hidden={activeTab !== 0}>
                            {activeTab === 0 && (
                                <Stack spacing={3}>
                                    <Typography variant="h6" fontWeight="700" color="text.secondary" gutterBottom>Basic Information</Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Display Name"
                                                fullWidth
                                                variant="outlined"
                                                {...register("name")}
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Age"
                                                type="number"
                                                fullWidth
                                                variant="outlined"
                                                {...register("age", { valueAsNumber: true })}
                                                error={!!errors.age}
                                                helperText={errors.age?.message as string}
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>
                            )}
                        </div>

                        {/* Tab 1: Professional */}
                        <div role="tabpanel" hidden={activeTab !== 1}>
                            {activeTab === 1 && (
                                <Stack spacing={3}>
                                    <Typography variant="h6" fontWeight="700" color="text.secondary" gutterBottom>Professional Details</Typography>

                                    <TextField
                                        label="Professional Bio"
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={2}
                                        {...register("bio")}
                                        placeholder="Brief description (e.g., Full Stack Developer)"
                                        helperText="Appears under your name"
                                    />

                                    <TextField
                                        label="About Me"
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={5}
                                        {...register("about")}
                                        placeholder="Tell your story, experience, and goals..."
                                    />

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="subtitle2" fontWeight="700">Skills & Interests</Typography>
                                    <TextField
                                        label="Skills"
                                        fullWidth
                                        variant="outlined"
                                        value={skillsString}
                                        onChange={(e) => setSkillsString(e.target.value)}
                                        placeholder="React, Node.js, Python..."
                                        helperText="Comma separated values"
                                    />

                                    <TextField
                                        label="Hobbies"
                                        fullWidth
                                        variant="outlined"
                                        value={hobbiesString}
                                        onChange={(e) => setHobbiesString(e.target.value)}
                                        placeholder="Reading, Gaming, Hiking..."
                                        helperText="Comma separated values"
                                    />
                                </Stack>
                            )}
                        </div>

                        {/* Tab 2: Socials */}
                        <div role="tabpanel" hidden={activeTab !== 2}>
                            {activeTab === 2 && (
                                <Stack spacing={3}>
                                    <Typography variant="h6" fontWeight="700" color="text.secondary" gutterBottom>Social Presence</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Link your accounts to display them on your profile.
                                    </Typography>

                                    {(['github', 'linkedin', 'leetcode', 'codeforces'] as const).map((platform) => (
                                        <TextField
                                            key={platform}
                                            label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                            fullWidth
                                            {...register(`socialHandles.${platform}`)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                                                            {socialIcons[platform]}
                                                        </Box>
                                                    </InputAdornment>
                                                )
                                            }}
                                            placeholder="Username"
                                        />
                                    ))}
                                </Stack>
                            )}
                        </div>
                    </form>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.50' : 'rgba(0,0,0,0.2)' }}>
                <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(handleFormSubmit)}
                    variant="contained"
                    disabled={isSaving}
                    startIcon={isSaving ? <Loader size={20} color="inherit" /> : <SaveIcon />}
                    sx={{ borderRadius: 2, px: 4 }}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileDialog;
