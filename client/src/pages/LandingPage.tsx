import React from 'react';
import { Box, useTheme } from '@mui/material';
import PublicNavbar from '../components/PublicNavbar';
import QuoteBanner from '../components/landing/QuoteBanner';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AboutSection from '../components/landing/AboutSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TerminalShowcaseSection from '../components/landing/TerminalShowcaseSection';
import ResumeShowcaseSection from '../components/landing/ResumeShowcaseSection';
import SupportSection from '../components/landing/SupportSection';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';
import PlatformShowcase from '../components/landing/PlatformShowcase';
import ProjectVision from '../components/landing/ProjectVision';
import DevCardHighlight from '../components/landing/DevCardHighlight';

const LandingPage: React.FC = () => {
    const theme = useTheme();

    return (
        <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? '#000' : '#ffffff' }}>
            <PublicNavbar />
            <QuoteBanner />
            <HeroSection />
            <PlatformShowcase />
            <ProjectVision />
            <TerminalShowcaseSection />
            <DevCardHighlight />
            <FeaturesSection />
            <ResumeShowcaseSection />
            <AboutSection />
            <HowItWorksSection />
            <SupportSection />
            <CTASection />
            <LandingFooter />
        </Box>
    );
};

export default LandingPage;
