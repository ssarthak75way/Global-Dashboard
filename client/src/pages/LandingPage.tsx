import React from 'react';
import { Box } from '@mui/material';
import PublicNavbar from '../components/PublicNavbar';
import QuoteBanner from '../components/landing/QuoteBanner';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AboutSection from '../components/landing/AboutSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TerminalShowcaseSection from '../components/landing/TerminalShowcaseSection';
import SupportSection from '../components/landing/SupportSection';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';

const LandingPage: React.FC = () => {
    return (
        <Box>
            <PublicNavbar />
            <QuoteBanner />
            <HeroSection />
            <TerminalShowcaseSection />
            <FeaturesSection />
            <AboutSection />
            <HowItWorksSection />
            <SupportSection />
            <CTASection />
            <LandingFooter />
        </Box>
    );
};

export default LandingPage;
