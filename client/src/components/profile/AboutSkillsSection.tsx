import React from 'react';
import { Paper, Typography, Stack, Chip } from '@mui/material';
import { User } from '../../context/AuthContext';

interface AboutSkillsSectionProps {
    displayUser: User | null;
    styles: any;
}

const AboutSkillsSection: React.FC<AboutSkillsSectionProps> = ({ displayUser, styles }) => {
    return (
        <Paper elevation={0} sx={styles.bentoCard}>
            <Typography sx={styles.sectionTitle}>About</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, lineHeight: 1.8, fontSize: '1.1rem', mb: 4 }}>
                {displayUser?.about || "No detailed bio provided yet."}
            </Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: 1.5, mb: 2, opacity: 0.6 }}>SKILLS & TOOLS</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5} mb={4}>
                {displayUser?.skills?.length ? (
                    displayUser.skills.map(skill => (
                        <Chip key={skill} label={skill} sx={{ fontWeight: 700, borderRadius: 1, bgcolor: 'primary.main', color: 'white' }} />
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">No skills listed.</Typography>
                )}
            </Stack>

            <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: 1.5, mb: 2, opacity: 0.6 }}>HOBBIES & INTERESTS</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {displayUser?.hobbies?.length ? (
                    displayUser.hobbies.map(hobby => (
                        <Chip key={hobby} label={hobby} sx={{ fontWeight: 700, borderRadius: 1, bgcolor: 'secondary.main', color: 'white' }} />
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">No hobbies listed.</Typography>
                )}
            </Stack>
        </Paper>
    );
};

export default AboutSkillsSection;
