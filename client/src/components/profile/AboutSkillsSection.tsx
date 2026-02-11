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
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {displayUser?.skills?.map(skill => (
                    <Chip key={skill} label={skill} sx={{ fontWeight: 700, borderRadius: 1, bgcolor: 'primary.main', color: 'white' }} />
                ))}
            </Stack>
        </Paper>
    );
};

export default AboutSkillsSection;
