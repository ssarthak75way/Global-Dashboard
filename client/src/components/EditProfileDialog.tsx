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
    Divider,
    Autocomplete,
    Chip,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import Loader from './Loader';
import { useForm, useFieldArray, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '../context/AuthContext';
import api from '../api/axios';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
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
import { Checkbox, FormControlLabel } from '@mui/material';

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.union([z.number().min(8, "Minimum age is 8").max(120, "Maximum age is 120"), z.null(), z.literal("")]).optional(),
    avatar: z.string().optional(),
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
    experience: z.array(z.object({
        role: z.string().min(1, "Role is required"),
        company: z.string().min(1, "Company is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().optional().or(z.literal('')),
        description: z.string().optional(),
        current: z.boolean(),
        jobType: z.enum(['Remote', 'Onsite', 'Hybrid']).optional(),
        technologies: z.array(z.string()).optional()
    })).optional(),
    status: z.string().optional().or(z.literal('')),
    projects: z.array(z.object({
        title: z.string().min(1, "Title is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().optional().or(z.literal('')),
        description: z.string().optional().or(z.literal('')),
        techStack: z.array(z.string()),
        link: z.string().optional().or(z.literal(''))
    })).optional(),
    certifications: z.array(z.object({
        title: z.string().min(1, "Title is required"),
        issuer: z.string().min(1, "Issuer is required"),
        issueDate: z.string().min(1, "Issue date is required"),
        expiryDate: z.string().optional().or(z.literal('')),
        description: z.string().optional().or(z.literal('')),
        credentialId: z.string().optional().or(z.literal('')),
        link: z.string().optional().or(z.literal(''))
    })).optional()
});

export type ProfileUpdateData = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
    onSave: (data: ProfileUpdateData) => Promise<void>;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ open, onClose, user, onSave }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [activeTab, setActiveTab] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors }
    } = useForm<ProfileUpdateData>({
        resolver: zodResolver(profileSchema) as any,
        defaultValues: {
            name: "",
            age: null,
            avatar: "",
            socialHandles: { github: "", codeforces: "", leetcode: "", linkedin: "" },
            bio: "",
            about: "",
            skills: [],
            hobbies: [],
            experience: [],
            projects: [],
            certifications: [],
            status: ""
        }
    });

    const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
        control,
        name: "experience"
    });

    const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
        control,
        name: "projects"
    });

    const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
        control,
        name: "certifications"
    });

    const watchedExperiences = watch("experience");

    const [skillsString, setSkillsString] = useState("");
    const [hobbiesString, setHobbiesString] = useState("");

    useEffect(() => {
        if (user && open) {
            reset({
                name: user.name || "",
                age: user.age || null,
                avatar: user.avatar || "",
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
                experience: user.experience?.map(exp => ({
                    role: exp.role || "",
                    company: exp.company || "",
                    startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : "",
                    endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : "",
                    description: exp.description || "",
                    current: !!exp.current
                })) || [],
                projects: user.projects?.map(p => ({
                    ...p,
                    startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : "",
                    endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : ""
                })) || [],
                certifications: user.certifications?.map(c => ({
                    ...c,
                    issueDate: c.issueDate ? new Date(c.issueDate).toISOString().split('T')[0] : "",
                    expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : ""
                })) || [],
                status: typeof user.status === 'string' ? user.status : ""
            });
            setSkillsString(user.skills?.join(", ") || "");
            setHobbiesString(user.hobbies?.join(", ") || "");
            setPreviewUrl(user.avatar || null);
            setSelectedFile(null);
        }
    }, [user, open, reset]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit: SubmitHandler<ProfileUpdateData> = async (data) => {
        setIsSaving(true);
        let avatarUrl = data.avatar;

        try {
            // Upload avatar if selected
            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);
                const { data: uploadRes } = await api.post('/posts/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                avatarUrl = uploadRes.imageUrl;
            }

            // Process strings to arrays
            const processedSkills = skillsString.split(',').map(s => s.trim()).filter(s => s);
            const processedHobbies = hobbiesString.split(',').map(s => s.trim()).filter(s => s);

            const payload = {
                ...data,
                avatar: avatarUrl,
                skills: processedSkills,
                hobbies: processedHobbies
            };

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
                    borderRadius: fullScreen ? 0 : 2,
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

            <DialogContent sx={{ p: 0, height: fullScreen ? '100%' : 'auto', minHeight: fullScreen ? 'auto' : 500, display: 'flex', flexDirection: fullScreen ? 'column' : 'row' }}>
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
                <Box sx={{ flex: 1, p: { xs: 2, sm: 4 }, overflowY: 'auto' }}>
                    <form id="edit-profile-form" onSubmit={handleSubmit(handleFormSubmit)}>
                        {/* Tab 0: Personal Info */}
                        <div role="tabpanel" hidden={activeTab !== 0}>
                            {activeTab === 0 && (
                                <Stack spacing={4}>
                                    <Typography variant="h6" fontWeight="700" color="text.secondary">Basic Information</Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <Box
                                                component="img"
                                                src={previewUrl || ""}
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    border: '4px solid',
                                                    borderColor: 'primary.main',
                                                    bgcolor: 'action.hover',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '3rem',
                                                    color: 'primary.main',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                            {!previewUrl && (
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'text.disabled'
                                                }}>
                                                    <PersonIcon sx={{ fontSize: '4rem' }} />
                                                </Box>
                                            )}
                                        </Box>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="avatar-upload-input"
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="avatar-upload-input">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                size="small"
                                                sx={{ borderRadius: 1, fontWeight: 700 }}
                                            >
                                                {previewUrl ? 'Change Photo' : 'Upload Photo'}
                                            </Button>
                                        </label>
                                    </Box>

                                    <Grid container spacing={{ xs: 2, sm: 3 }}>
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
                                        <Grid item xs={12}>
                                            <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1, mb: 1, display: 'block' }}>YOUR STATUS</Typography>
                                            <Controller
                                                name="status"
                                                control={control}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        freeSolo
                                                        options={[
                                                            "🏠 Working from home",
                                                            "✈️ Out of station",
                                                            "🤝 In a meeting",
                                                            "🎯 Focusing",
                                                            "🌴 On vacation",
                                                            "🩹 Sick leave"
                                                        ]}
                                                        value={field.value || ""}
                                                        onChange={(_, newValue) => field.onChange(newValue)}
                                                        onInputChange={(_, newInputValue) => field.onChange(newInputValue)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                variant="outlined"
                                                                placeholder="What's happening?"
                                                                helperText="Select a preset or type your own status"
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>
                            )}
                        </div>

                        {/* Tab 1: Professional */}
                        <div role="tabpanel" hidden={activeTab !== 1}>
                            {activeTab === 1 && (
                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="700" color="text.secondary" gutterBottom>Professional Identity</Typography>
                                        <Grid container spacing={{ xs: 2, sm: 3 }}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Professional Bio"
                                                    fullWidth
                                                    minRows={2}
                                                    maxRows={2}
                                                    variant="outlined"
                                                    multiline
                                                    rows={2}
                                                    {...register("bio")}
                                                    placeholder="Brief description (e.g., Full Stack Developer)"
                                                    helperText="Appears under your name"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="About Me"
                                                    fullWidth
                                                    variant="outlined"
                                                    multiline
                                                    rows={5}
                                                    {...register("about")}
                                                    placeholder="Tell your story, experience, and goals..."
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Divider />

                                    {/* Skills Section */}
                                    <Box>
                                        <Typography variant="h6" fontWeight="700" color="text.secondary" sx={{ mb: 2 }}>Skills & Interests</Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Skills"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={skillsString}
                                                    onChange={(e) => setSkillsString(e.target.value)}
                                                    placeholder="React, Node.js, Python..."
                                                    helperText="Comma separated values"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Hobbies"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={hobbiesString}
                                                    onChange={(e) => setHobbiesString(e.target.value)}
                                                    placeholder="Reading, Gaming, Hiking..."
                                                    helperText="Comma separated values"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Divider />

                                    {/* Experience Section */}
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" fontWeight="700" color="text.secondary">Work Experience</Typography>
                                            <Button
                                                startIcon={<AddIcon />}
                                                onClick={() => appendExp({ role: "", company: "", startDate: "", endDate: "", description: "", current: false, jobType: "Onsite", technologies: [] })}
                                                variant="contained"
                                                size="small"
                                                sx={{ borderRadius: 1, fontWeight: 700 }}
                                            >
                                                Add Experience
                                            </Button>
                                        </Box>

                                        <Stack spacing={3}>
                                            {expFields.map((field, index) => (
                                                <Box key={field.id} sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                        <Typography variant="subtitle2" fontWeight="800" color="primary.main">Experience #{index + 1}</Typography>
                                                        <IconButton
                                                            onClick={() => removeExp(index)}
                                                            sx={{ color: 'error.main' }}
                                                            size="small"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>

                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Job Title"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                {...register(`experience.${index}.role` as const)}
                                                                error={!!errors.experience?.[index]?.role}
                                                                helperText={errors.experience?.[index]?.role?.message}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Company"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                {...register(`experience.${index}.company` as const)}
                                                                error={!!errors.experience?.[index]?.company}
                                                                helperText={errors.experience?.[index]?.company?.message}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="From"
                                                                type="date"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                InputLabelProps={{ shrink: true }}
                                                                {...register(`experience.${index}.startDate` as const)}
                                                                error={!!errors.experience?.[index]?.startDate}
                                                                helperText={errors.experience?.[index]?.startDate?.message}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="To"
                                                                type="date"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                InputLabelProps={{ shrink: true }}
                                                                disabled={watchedExperiences?.[index]?.current}
                                                                {...register(`experience.${index}.endDate` as const)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                                                                <FormControlLabel
                                                                    control={<Checkbox size="small" {...register(`experience.${index}.current` as const)} />}
                                                                    label={<Typography variant="body2">I am currently working in this role</Typography>}
                                                                    sx={{ flexShrink: 0 }}
                                                                />
                                                                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                    <Typography variant="caption" fontWeight={800} color="text.secondary">JOB TYPE</Typography>
                                                                    <Controller
                                                                        name={`experience.${index}.jobType`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <ToggleButtonGroup
                                                                                {...field}
                                                                                exclusive
                                                                                size="small"
                                                                                onChange={(_, value) => value && field.onChange(value)}
                                                                                sx={{ height: 32 }}
                                                                            >
                                                                                <ToggleButton value="Onsite" sx={{ px: 1.5, fontSize: '0.65rem', fontWeight: 900 }}>Onsite</ToggleButton>
                                                                                <ToggleButton value="Remote" sx={{ px: 1.5, fontSize: '0.65rem', fontWeight: 900 }}>Remote</ToggleButton>
                                                                                <ToggleButton value="Hybrid" sx={{ px: 1.5, fontSize: '0.65rem', fontWeight: 900 }}>Hybrid</ToggleButton>
                                                                            </ToggleButtonGroup>
                                                                        )}
                                                                    />
                                                                </Box>
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                label="Description (Optional)"
                                                                fullWidth
                                                                variant="outlined"
                                                                multiline
                                                                rows={2}
                                                                size="small"
                                                                {...register(`experience.${index}.description` as const)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Controller
                                                                name={`experience.${index}.technologies`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Autocomplete
                                                                        multiple
                                                                        freeSolo
                                                                        options={[]}
                                                                        value={field.value || []}
                                                                        onChange={(_, newValue) => field.onChange(newValue)}
                                                                        renderTags={(value, getTagProps) =>
                                                                            value.map((option, index) => (
                                                                                <Chip
                                                                                    label={option}
                                                                                    {...getTagProps({ index })}
                                                                                    size="small"
                                                                                    sx={{ fontWeight: 700, borderRadius: 1 }}
                                                                                />
                                                                            ))
                                                                        }
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="Technologies Used"
                                                                                placeholder="Add tech..."
                                                                                size="small"
                                                                                helperText="Press Enter to add custom technologies"
                                                                            />
                                                                        )}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>

                                    <Divider />

                                    {/* Projects Section */}
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" fontWeight="700" color="text.secondary">Projects</Typography>
                                            <Button
                                                startIcon={<AddIcon />}
                                                onClick={() => appendProject({ title: "", startDate: "", endDate: "", description: "", techStack: [], link: "" })}
                                                variant="contained"
                                                size="small"
                                                sx={{ borderRadius: 1, fontWeight: 700 }}
                                            >
                                                Add Project
                                            </Button>
                                        </Box>

                                        <Stack spacing={3}>
                                            {projectFields.map((field, index) => (
                                                <Box key={field.id} sx={{ p: 3, borderRadius: 1, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                        <Typography variant="subtitle2" fontWeight="800" color="primary.main">Project #{index + 1}</Typography>
                                                        <IconButton
                                                            onClick={() => removeProject(index)}
                                                            sx={{ color: 'error.main' }}
                                                            size="small"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>

                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                label="Project Title"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                {...register(`projects.${index}.title` as const)}
                                                                error={!!errors.projects?.[index]?.title}
                                                                helperText={errors.projects?.[index]?.title?.message}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Start Date"
                                                                type="date"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                InputLabelProps={{ shrink: true }}
                                                                {...register(`projects.${index}.startDate` as const)}
                                                                error={!!errors.projects?.[index]?.startDate}
                                                                helperText={errors.projects?.[index]?.startDate?.message}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="End Date"
                                                                type="date"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                InputLabelProps={{ shrink: true }}
                                                                {...register(`projects.${index}.endDate` as const)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Autocomplete
                                                                multiple
                                                                freeSolo
                                                                options={[]}
                                                                value={watch(`projects.${index}.techStack`) || []}
                                                                onChange={(_e, newValue) => setValue(`projects.${index}.techStack`, newValue as string[])}
                                                                renderTags={(value: string[], getTagProps) =>
                                                                    value.map((option: string, index: number) => (
                                                                        <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />
                                                                    ))
                                                                }
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        variant="outlined"
                                                                        label="Tech Stack / Tags"
                                                                        placeholder="Add tags..."
                                                                        size="small"
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                label="Project Link (Optional)"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                {...register(`projects.${index}.link` as const)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                label="Description (Optional)"
                                                                fullWidth
                                                                variant="outlined"
                                                                multiline
                                                                rows={2}
                                                                size="small"
                                                                {...register(`projects.${index}.description` as const)}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>

                                    <Divider />

                                    {/* Certifications Section */}
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" fontWeight="700" color="text.secondary">Certifications</Typography>
                                            <Button
                                                startIcon={<AddIcon />}
                                                onClick={() => appendCert({ title: "", issuer: "", issueDate: "", expiryDate: "", description: "", credentialId: "", link: "" })}
                                                variant="contained"
                                                size="small"
                                                sx={{ borderRadius: 1, fontWeight: 700 }}
                                            >
                                                Add Certification
                                            </Button>
                                        </Box>

                                        <Stack spacing={3}>
                                            {certFields.map((field, index) => (
                                                <Box key={field.id} sx={{ p: 3, borderRadius: 1, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                        <Typography variant="subtitle2" fontWeight="800" color="primary.main">Certification #{index + 1}</Typography>
                                                        <IconButton
                                                            onClick={() => removeCert(index)}
                                                            sx={{ color: 'error.main' }}
                                                            size="small"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>

                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Title"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                {...register(`certifications.${index}.title` as const)}
                                                                error={!!errors.certifications?.[index]?.title}
                                                                helperText={errors.certifications?.[index]?.title?.message}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Issuer"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                {...register(`certifications.${index}.issuer` as const)}
                                                                error={!!errors.certifications?.[index]?.issuer}
                                                                helperText={errors.certifications?.[index]?.issuer?.message}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Issue Date"
                                                                type="date"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                InputLabelProps={{ shrink: true }}
                                                                {...register(`certifications.${index}.issueDate` as const)}
                                                                error={!!errors.certifications?.[index]?.issueDate}
                                                                helperText={errors.certifications?.[index]?.issueDate?.message}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Expiry Date"
                                                                type="date"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                InputLabelProps={{ shrink: true }}
                                                                {...register(`certifications.${index}.expiryDate` as const)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Credential ID"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                {...register(`certifications.${index}.credentialId` as const)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Link"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                {...register(`certifications.${index}.link` as const)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                label="Description"
                                                                fullWidth
                                                                variant="outlined"
                                                                multiline
                                                                rows={2}
                                                                size="small"
                                                                {...register(`certifications.${index}.description` as const)}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>
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
                                            label={platform.charAt(0)?.toUpperCase() + platform.slice(1)}
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
                <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: 1 }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(handleFormSubmit)}
                    variant="contained"
                    disabled={isSaving}
                    startIcon={isSaving ? <Loader size={20} color="inherit" /> : <SaveIcon />}
                    sx={{ borderRadius: 1, px: 4 }}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileDialog;
