import React from 'react';
import { Paper, Typography, Stack, Box, Chip, Link } from '@mui/material';
import { Launch as LaunchIcon } from '@mui/icons-material';
import { User } from '../../context/AuthContext';

interface ProjectsSectionProps {
    displayUser: User | null;
    calculateDuration: (startDate: string, endDate?: string, current?: boolean) => string;
    styles: any;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ displayUser, calculateDuration, styles }) => {
    return (
        <Paper elevation={0} sx={styles.bentoCard}>
            <Typography sx={styles.sectionTitle}>Projects</Typography>
            <Stack spacing={3}>
                {displayUser?.projects && displayUser.projects.length > 0 ? (
                    displayUser.projects.map((project, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: 'relative',
                                pl: 3,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    bottom: 4,
                                    width: 2,
                                    bgcolor: 'secondary.light',
                                    borderRadius: 1,
                                    opacity: 0.5
                                }
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={850} color="secondary.main">
                                        {project.title}
                                    </Typography>
                                    {project.organization && (
                                        <Typography variant="body2" fontWeight={800}>
                                            {project.organization}
                                        </Typography>
                                    )}
                                </Box>
                                {project.current && (
                                    <Chip
                                        label="ONGOING"
                                        size="small"
                                        variant="outlined"
                                        color="success"
                                        sx={{ fontWeight: 900, borderRadius: 1, height: 20, fontSize: '0.6rem' }}
                                    />
                                )}
                            </Stack>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={700}
                                sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}
                            >
                                {new Date(project.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - {project.current ? 'Present' : project.endDate ? new Date(project.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
                                {' • '}
                                <Typography component="span" variant="caption" fontWeight={900} color="secondary.main">
                                    {calculateDuration(project.startDate, project.endDate, project.current)}
                                </Typography>
                            </Typography>
                            {project.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, lineHeight: 1.6, mb: 1.5 }}>
                                    {project.description}
                                </Typography>
                            )}
                            {project.technologies && project.technologies.length > 0 && (
                                <Stack direction="row" flexWrap="wrap" gap={0.8} mb={1.5}>
                                    {project.technologies.map(tech => (
                                        <Chip
                                            key={tech}
                                            label={tech}
                                            size="small"
                                            sx={{ fontWeight: 700, fontSize: '0.65rem', height: 22, borderRadius: 0.5, bgcolor: 'action.hover' }}
                                        />
                                    ))}
                                </Stack>
                            )}
                            {project.link && (
                                <Link
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    View Project <LaunchIcon sx={{ fontSize: 16 }} />
                                </Link>
                            )}
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        No projects added yet.
                    </Typography>
                )}
            </Stack>
        </Paper>
    );
};

export default ProjectsSection;
