import React from 'react';
import { Paper, Typography, Stack, Box, Link } from '@mui/material';
import { CardMembership as CertificateIcon, Launch as LaunchIcon } from '@mui/icons-material';
import { User } from '../../context/AuthContext';

interface CertificationsSectionProps {
    displayUser: User | null;
    styles: any;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({ displayUser, styles }) => {
    return (
        <Paper elevation={0} sx={styles.bentoCard}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                <CertificateIcon color="primary" />
                <Typography sx={{ ...styles.sectionTitle, mb: 0 }}>Certifications</Typography>
            </Box>
            <Stack spacing={3}>
                {displayUser?.certifications && displayUser.certifications.length > 0 ? (
                    displayUser.certifications.map((cert, index) => (
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
                                    bgcolor: 'primary.light',
                                    borderRadius: 1,
                                    opacity: 0.5
                                }
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={850} color="primary.main">
                                {cert.title}
                            </Typography>
                            <Typography variant="body2" fontWeight={800}>
                                {cert.issuer}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={700}
                                sx={{ display: 'block', mt: 0.5, mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}
                            >
                                Issued {new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                {cert.expiryDate && ` • Expires ${new Date(cert.expiryDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`}
                            </Typography>
                            {cert.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, lineHeight: 1.6, mb: 1 }}>
                                    {cert.description}
                                </Typography>
                            )}
                            {cert.credentialId && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700 }}>
                                    Credential ID: {cert.credentialId}
                                </Typography>
                            )}
                            {cert.link && (
                                <Link
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        mt: 1,
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    View Credential <LaunchIcon sx={{ fontSize: 16 }} />
                                </Link>
                            )}
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        No certifications added yet.
                    </Typography>
                )}
            </Stack>
        </Paper>
    );
};

export default CertificationsSection;
