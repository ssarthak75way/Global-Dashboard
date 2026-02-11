import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    severity?: 'warning' | 'error' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
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
            case 'info':
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
        icon: {
            fontSize: 48,
            color: config.color,
        },
        iconBox: {
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: config.bgColor,
            width: 'fit-content',
            mx: 'auto',
        },
        title: {
            fontWeight: 700,
            textAlign: 'center',
            fontSize: '1.5rem',
        },
        content: {
            pt: 2,
        },
        message: {
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        actions: {
            px: 3,
            pb: 3,
            gap: 2,
        },
        cancelButton: {
            borderRadius: 1,
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
        },
        confirmButton: {
            borderRadius: 1,
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            bgcolor: config.color,
            '&:hover': {
                bgcolor: config.color,
                filter: 'brightness(0.9)',
            },
        },
        dialog: {
            '& .MuiDialog-paper': {
                borderRadius: 1,
                minWidth: { xs: '90%', sm: 400 },
                maxWidth: 500,
            },
        },
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onCancel}
            sx={styles.dialog}
        >
            <DialogTitle sx={styles.title}>
                <Box sx={styles.iconBox}>
                    <IconComponent sx={styles.icon} />
                </Box>
                {title}
            </DialogTitle>
            <DialogContent sx={styles.content}>
                <Typography sx={styles.message}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={styles.actions}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    color="inherit"
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

export default ConfirmDialog;
