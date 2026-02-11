import React from 'react';
import { Paper, Typography, Stack, Box, Avatar, Divider, Chip, Button } from '@mui/material';
import {
    Email as EmailIcon,
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    Code as CodeforcesIcon,
    Terminal as LeetCodeIcon,
    CalendarToday as AgeIcon
} from '@mui/icons-material';
import { User } from '../../context/AuthContext';

interface ExperienceSectionProps {
    displayUser: User | null;
    calculateDuration: (startDate: string | Date, endDate?: string | Date, current?: boolean) => string;
    styles: any;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ displayUser, calculateDuration, styles }) => {
    const socialIcons: Record<string, React.ReactNode> = {
        github: <GitHubIcon />,
        linkedin: <LinkedInIcon />,
        leetcode: <LeetCodeIcon />,
        codeforces: <CodeforcesIcon />
    };

    return (
        <Paper elevation={0} sx={styles.bentoCard}>
            <Typography sx={styles.sectionTitle}>Connect</Typography>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1 }}>EMAIL ADDRESS</Typography>
                    <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}><EmailIcon /></Avatar>
                        <Typography fontWeight={700}>{displayUser?.email}</Typography>
                    </Stack>
                </Box>
                <Divider />
                <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1 }}>WORK EXPERIENCE</Typography>
                    <Stack spacing={3} mt={2}>
                        {displayUser?.experience && displayUser.experience.length > 0 ? (
                            displayUser.experience.map((exp, index) => (
                                <Box key={index} sx={{ position: 'relative', pl: 3, '&::before': { content: '""', position: 'absolute', left: 0, top: 4, bottom: 4, width: 2, bgcolor: 'primary.light', borderRadius: 1, opacity: 0.5 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={850} color="primary.main">{exp.role}</Typography>
                                            <Typography variant="body2" fontWeight={800}>{exp.company}</Typography>
                                        </Box>
                                        {exp.jobType && (
                                            <Chip
                                                label={exp.jobType.toUpperCase()}
                                                size="small"
                                                variant="outlined"
                                                color={exp.jobType === 'Remote' ? 'success' : exp.jobType === 'Hybrid' ? 'warning' : 'info'}
                                                sx={{ fontWeight: 900, borderRadius: 1, height: 20, fontSize: '0.6rem' }}
                                            />
                                        )}
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
                                        {' • '}
                                        <Typography component="span" variant="caption" fontWeight={900} color="primary.main">
                                            {calculateDuration(
                                                exp.startDate,
                                                exp.endDate,
                                                exp.current
                                            )}
                                        </Typography>
                                    </Typography>
                                    {exp.description && (
                                        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, lineHeight: 1.6, mb: 1.5 }}>
                                            {exp.description}
                                        </Typography>
                                    )}
                                    {exp.technologies && exp.technologies.length > 0 && (
                                        <Stack direction="row" flexWrap="wrap" gap={0.8}>
                                            {exp.technologies.map(tech => (
                                                <Chip
                                                    key={tech}
                                                    label={tech}
                                                    size="small"
                                                    sx={{ fontWeight: 700, fontSize: '0.65rem', height: 22, borderRadius: 0.5, bgcolor: 'action.hover' }}
                                                />
                                            ))}
                                        </Stack>
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">No work experience added yet.</Typography>
                        )}
                    </Stack>
                </Box>
                <Divider />
                <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1 }}>SOCIAL PROFILES</Typography>
                    <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
                        {(['github', 'linkedin', 'leetcode', 'codeforces'] as const).map(platform => {
                            const handle = displayUser?.socialHandles?.[platform];
                            if (!handle) return null;
                            return (
                                <Button
                                    key={platform}
                                    variant="outlined"
                                    startIcon={socialIcons[platform]}
                                    href={`https://${platform}.com/${handle}`}
                                    target="_blank"
                                    sx={{ borderRadius: 1, fontWeight: 900, textTransform: 'capitalize' }}
                                >
                                    {platform}
                                </Button>
                            );
                        })}
                    </Stack>
                </Box>
                <Divider />
                <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1 }}>AGE / ORIGIN</Typography>
                    <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}><AgeIcon /></Avatar>
                        <Typography fontWeight={700}>{displayUser?.age || 'Not shared'} years old</Typography>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );
};

export default ExperienceSection;
