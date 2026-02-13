import React from 'react';
import { Box, Typography, Avatar, Stack, Grid } from '@mui/material';
import {
    Email as EmailIcon,
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    Terminal as TerminalIcon,
    Language as LanguageIcon,
    Code as CodeIcon,
    Psychology as PsychologyIcon,
    RocketLaunch as RocketIcon,
    EmojiEvents as TrophyIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';
import { User } from '../../context/AuthContext';
import { GoVerified } from "react-icons/go";
import { SiCodeforces, SiLeetcode } from "react-icons/si";

interface DevCardProps {
    user: User | null;
    totalRating: number;
}

const DevCard: React.FC<DevCardProps> = ({ user, totalRating }) => {
    if (!user) return null;

    const socialItems = [
        { icon: <GitHubIcon sx={{ fontSize: 18 }} />, value: user.socialHandles?.github, label: 'GITHUB', prefix: 'github.com/' },
        { icon: <LinkedInIcon sx={{ fontSize: 18 }} />, value: user.socialHandles?.linkedin, label: 'LINKEDIN', prefix: 'linkedin.com/in/' },
        { icon: <SiCodeforces style={{ fontSize: 16 }} />, value: user.socialHandles?.codeforces, label: 'CODEFORCES', prefix: '' },
        { icon: <SiLeetcode style={{ fontSize: 16 }} />, value: user.socialHandles?.leetcode, label: 'LEETCODE', prefix: '' }
    ].filter(item => item.value);

    return (
        <Box
            id="dev-card-element"
            sx={{
                width: 900,
                height: 720,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '40px',
                background: '#050505',
                color: 'white',
                display: 'flex',
                boxShadow: '0 50px 100px rgba(0,0,0,0.9)',
                fontFamily: "'Outfit', sans-serif",
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
                    opacity: 0.1,
                    zIndex: 0
                }
            }}
        >
            {/* Ambient Background Glows */}
            <Box sx={{ position: 'absolute', top: '-15%', left: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', filter: 'blur(70px)', zIndex: 0 }} />
            <Box sx={{ position: 'absolute', bottom: '-15%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)', filter: 'blur(70px)', zIndex: 0 }} />

            {/* Left Column (Hero Section) */}
            <Box sx={{ width: 360, p: 4, zIndex: 2, borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(255,255,255,0.01)' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}>
                        <CodeIcon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 2.5, textTransform: 'uppercase', fontSize: '0.8rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        DEVCONNECT
                    </Typography>
                </Stack>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', mb: 3 }}>
                        <Box sx={{
                            width: 180,
                            height: 180,
                            borderRadius: '50%',
                            p: '5px',
                            background: 'linear-gradient(45deg, #6366f1, #a855f7, #6366f1)',
                            backgroundSize: '200% 200%',
                            animation: 'rotate 6s infinite linear',
                            '@keyframes rotate': { '0%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' }, '100%': { backgroundPosition: '0% 50%' } }
                        }}>
                            <Avatar src={user.avatar} sx={{ width: '100%', height: '100%', border: '6px solid #050505', bgcolor: '#111', fontSize: '5rem', fontWeight: 900 }}>
                                {!user.avatar && (user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase())}
                            </Avatar>
                        </Box>
                        {user.isVerified && (
                            <Box sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: '#6366f1', borderRadius: '50%', p: 1, border: '5px solid #050505', display: 'flex' }}>
                                <GoVerified size={20} color="white" />
                            </Box>
                        )}
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 900, fontSize: '2.4rem', mb: 0.5, letterSpacing: -1.5 }}>
                        {user.name || user.email.split('@')[0]}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" mb={3} sx={{ opacity: 0.7 }}>
                        <RocketIcon sx={{ fontSize: 18, color: '#818cf8' }} />
                        <Typography sx={{ fontWeight: 800, color: '#94a3b8', fontSize: '1rem' }}>{user.status || 'Architect'}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={4}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 900 }}>{user.followers?.length || 0}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '0.65rem' }}>FOLLOWERS</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 900 }}>{user.following?.length || 0}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '0.65rem' }}>FOLLOWING</Typography>
                        </Box>
                    </Stack>
                </Box>

                <Box sx={{ mt: 'auto', p: 2, borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LocationIcon sx={{ color: '#475569', fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 900, fontSize: '0.7rem', color: '#475569', letterSpacing: 1.5 }}>GLOBAL NETWORK ACCESS</Typography>
                </Box>
            </Box>

            {/* Right Column (Data Section) */}
            <Box sx={{ flex: 1, p: 4, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" justifyContent="flex-end" sx={{ mb: 3 }}>
                    <Box sx={{ px: 2, py: 0.5, borderRadius: '20px', border: '1px solid rgba(129, 140, 248, 0.3)', background: 'rgba(99, 102, 241, 0.05)' }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '0.65rem', color: '#818cf8', letterSpacing: 2 }}>ELITE DEPLOYMENT TIER</Typography>
                    </Box>
                </Stack>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                        { label: 'DEV RATING', value: totalRating, color: '#fbbf24', icon: <PsychologyIcon sx={{ fontSize: 20 }} /> },
                        { label: 'PROJECTS', value: user.projects?.length || 0, color: '#a855f7', icon: <TerminalIcon sx={{ fontSize: 20 }} /> },
                        { label: 'SKILLS', value: user.skills?.length || 0, color: '#ec4899', icon: <LanguageIcon sx={{ fontSize: 20 }} /> }
                    ].map((stat, i) => (
                        <Grid item xs={4} key={i}>
                            <Box sx={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', p: 2, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Box sx={{ color: stat.color, mb: 0.5, display: 'flex', justifyContent: 'center' }}>{stat.icon}</Box>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: stat.color, mb: 0.1 }}>{stat.value}</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 900, color: '#64748b', fontSize: '0.6rem', letterSpacing: 1 }}>{stat.label}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mb: 3, p: 2.5, borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <Typography sx={{ color: '#6366f1', fontWeight: 900, fontSize: '0.7rem', letterSpacing: 1.5, mb: 0.5, textTransform: 'uppercase' }}>MISSION STATEMENT</Typography>
                    <Typography variant="body1" sx={{ color: '#f1f5f9', lineHeight: 1.4, fontWeight: 600, fontStyle: 'italic', opacity: 0.9, fontSize: '0.95rem' }}>
                        "{user.bio || 'Architecting scalable solutions and contributing to the open-source revolution.'}"
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ color: '#6366f1', fontWeight: 900, fontSize: '0.7rem', letterSpacing: 1.5, mb: 1.5, textTransform: 'uppercase' }}>DIGITAL IDENTITY PROFILE</Typography>
                    <Grid container spacing={1.5}>
                        {socialItems.map((id, i) => (
                            <Grid item xs={6} key={i}>
                                <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderRadius: '16px', bgcolor: '#0d0d12', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                                    <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5 }}>
                                        <Box sx={{ color: '#818cf8', display: 'flex' }}>{id.icon}</Box>
                                    </Box>
                                    <Box sx={{ overflow: 'hidden' }}>
                                        <Typography noWrap sx={{ fontWeight: 900, fontSize: '0.8rem', color: '#f8fafc' }}>{id.value}</Typography>
                                        <Typography sx={{ fontWeight: 800, fontSize: '0.55rem', color: '#475569', letterSpacing: 1 }}>{id.label}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderRadius: '16px', bgcolor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5 }}>
                                    <EmailIcon sx={{ color: '#818cf8', fontSize: 16 }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 900, fontSize: '0.8rem', color: '#f8fafc' }}>{user.email}</Typography>
                                    <Typography sx={{ fontWeight: 800, fontSize: '0.55rem', color: '#475569', letterSpacing: 1 }}>OFFICIAL CHANNEL</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Typography sx={{ color: '#334155', fontWeight: 900, fontSize: '0.65rem', letterSpacing: 1.5 }}>GEN-ID: {user._id.slice(-10).toUpperCase()}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ opacity: 0.5 }}>
                        <TrophyIcon sx={{ fontSize: 12 }} />
                        <Typography sx={{ fontWeight: 900, fontSize: '0.65rem', letterSpacing: 1.5 }}>PRO CARD V4.2 (OPTIMIZED)</Typography>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default DevCard;
