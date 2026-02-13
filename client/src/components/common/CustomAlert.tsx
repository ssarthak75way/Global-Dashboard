import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Slide,
    IconButton
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import {
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Close as CloseIcon,
    NotificationsActive as AlertIcon
} from '@mui/icons-material';
import React from 'react';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface CustomAlertProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    severity?: 'warning' | 'error' | 'info' | 'success';
    onConfirm: () => void;
    onCancel: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    severity = 'warning',
    onConfirm,
    onCancel,
}) => {
    const getSeverityConfig = () => {
        switch (severity) {
            case 'error':
                return {
                    color: '#ef4444',
                    bgColor: 'rgba(239, 68, 68, 0.1)',
                    IconComponent: ErrorIcon,
                };
            case 'warning':
                return {
                    color: '#f59e0b',
                    bgColor: 'rgba(245, 158, 11, 0.1)',
                    IconComponent: WarningIcon,
                };
            case 'success':
                return {
                    color: '#10b981',
                    bgColor: 'rgba(16, 185, 129, 0.1)',
                    IconComponent: AlertIcon,
                };
            case 'info':
            default:
                return {
                    color: '#3b82f6',
                    bgColor: 'rgba(59, 130, 246, 0.1)',
                    IconComponent: InfoIcon,
                };
        }
    };

    const config = getSeverityConfig();
    const { IconComponent } = config;

    const styles = {
        dialog: {
            '& .MuiDialog-paper': {
                borderRadius: '24px',
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minWidth: { xs: '90%', sm: 400 },
                maxWidth: 450,
                overflow: 'visible',
                p: 1
            },
        },
        iconBox: {
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 70,
            height: 70,
            borderRadius: '20px',
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: config.color,
            boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${config.color}20`,
            zIndex: 10
        },
        title: {
            fontWeight: 900,
            textAlign: 'center',
            fontSize: '1.5rem',
            pt: 6,
            pb: 1,
            color: 'text.primary'
        },
        message: {
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '1rem',
            lineHeight: 1.6,
            px: 2
        },
        actions: {
            px: 3,
            pb: 3,
            pt: 2,
            gap: 2,
        },
        cancelButton: {
            borderRadius: '12px',
            px: 3,
            py: 1.2,
            fontWeight: 800,
            textTransform: 'none',
            border: '1px solid rgba(255,255,255,0.05)',
            color: 'text.secondary',
            '&:hover': {
                bgcolor: 'rgba(255,255,255,0.02)',
                borderColor: 'rgba(255,255,255,0.1)'
            }
        },
        confirmButton: {
            borderRadius: '12px',
            px: 3,
            py: 1.2,
            fontWeight: 800,
            textTransform: 'none',
            bgcolor: config.color,
            color: 'white',
            boxShadow: `0 8px 20px ${config.color}40`,
            '&:hover': {
                bgcolor: config.color,
                filter: 'brightness(1.1)',
                boxShadow: `0 12px 25px ${config.color}60`,
            },
        }
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onCancel}
            sx={styles.dialog}
        >
            <Box sx={styles.iconBox}>
                <IconComponent sx={{ fontSize: 35 }} />
            </Box>

            <IconButton
                onClick={onCancel}
                sx={{ position: 'absolute', right: 15, top: 15, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>

            <DialogTitle sx={styles.title}>
                {title}
            </DialogTitle>
            <DialogContent>
                <Typography sx={styles.message}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={styles.actions}>
                <Button
                    onClick={onCancel}
                    variant="text"
                    fullWidth
                    sx={styles.cancelButton}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    fullWidth
                    sx={styles.confirmButton}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomAlert;
