import React from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    Box,
    IconButton,
    Typography,
    Stack
} from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';
import { toJpeg } from 'html-to-image';
import DevCard from './DevCard';
import { User } from '../../context/AuthContext';

interface DevCardModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
    totalRating: number;
}

const DevCardModal: React.FC<DevCardModalProps> = ({ open, onClose, user, totalRating }) => {

    const handleDownload = async () => {
        const element = document.getElementById('dev-card-element');
        if (!element) return;

        try {
            const dataUrl = await toJpeg(element, {
                quality: 1,
                backgroundColor: '#050505',
                pixelRatio: 2 // High quality for retina
            });
            const link = document.createElement('a');
            link.download = `dev-card-${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'profile'}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to download image', err);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg" // Use lg for landscape
            fullWidth={false}
            PaperProps={{
                sx: {
                    borderRadius: 6,
                    overflow: 'visible',
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    margin: 2
                }
            }}
        >
            <Box sx={{ position: 'relative' }}>
                {/* Header Actions */}
                <Box sx={{
                    position: 'absolute',
                    top: -60,
                    right: 0,
                    left: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 1
                }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>
                        Preview Dev Card
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                            sx={{
                                borderRadius: 4,
                                px: 4,
                                py: 1.2,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                fontSize: '0.9rem',
                                background: 'linear-gradient(45deg, #6366f1 30%, #a855f7 90%)',
                                boxShadow: '0 8px 20px rgba(99,102,241,0.4)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 28px rgba(99,102,241,0.6)',
                                }
                            }}
                        >
                            Download Card
                        </Button>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                '&:hover': { bgcolor: 'error.light' }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </Box>

                <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <DevCard user={user} totalRating={totalRating} />
                    </Box>
                </DialogContent>
            </Box>
        </Dialog>
    );
};

export default DevCardModal;
