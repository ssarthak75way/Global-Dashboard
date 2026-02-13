import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import { CheckCircleOutline as SuccessIcon, ErrorOutline as ErrorIcon, InfoOutlined as InfoIcon, WarningAmberOutlined as WarningIcon } from '@mui/icons-material';

export type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

interface CustomToastProps {
    open: boolean;
    message: string;
    severity: ToastSeverity;
    onClose: () => void;
    autoHideDuration?: number;
}

const SlideTransition = (props: any) => {
    return <Slide {...props} direction="left" />;
};

const CustomToast: React.FC<CustomToastProps> = ({
    open,
    message,
    severity,
    onClose,
    autoHideDuration = 5000,
}) => {

    const getIcon = () => {
        switch (severity) {
            case 'success': return <SuccessIcon sx={{ color: '#10b981' }} />;
            case 'error': return <ErrorIcon sx={{ color: '#ef4444' }} />;
            case 'warning': return <WarningIcon sx={{ color: '#f59e0b' }} />;
            case 'info': return <InfoIcon sx={{ color: '#3b82f6' }} />;
        }
    };

    const getColors = () => {
        switch (severity) {
            case 'success': return { border: 'rgba(16, 185, 129, 0.2)', bg: 'rgba(16, 185, 129, 0.05)', shadow: 'rgba(16, 185, 129, 0.1)' };
            case 'error': return { border: 'rgba(239, 68, 68, 0.2)', bg: 'rgba(239, 68, 68, 0.05)', shadow: 'rgba(239, 68, 68, 0.1)' };
            case 'warning': return { border: 'rgba(245, 158, 11, 0.2)', bg: 'rgba(245, 158, 11, 0.05)', shadow: 'rgba(245, 158, 11, 0.1)' };
            case 'info': return { border: 'rgba(59, 130, 246, 0.2)', bg: 'rgba(59, 130, 246, 0.05)', shadow: 'rgba(59, 130, 246, 0.1)' };
        }
    };

    const colors = getColors();

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            TransitionComponent={SlideTransition}
            sx={{ top: { xs: 20, sm: 40 }, right: { xs: 20, sm: 40 } }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                icon={getIcon()}
                variant="outlined"
                sx={{
                    width: '100%',
                    minWidth: { sm: '320px' },
                    maxWidth: '450px',
                    borderRadius: '16px',
                    bgcolor: 'background.paper',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${colors.border}`,
                    boxShadow: `0 12px 32px ${colors.shadow}`,
                    '& .MuiAlert-message': {
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'text.primary',
                        pr: 2
                    },
                    '& .MuiAlert-icon': {
                        fontSize: '24px',
                        alignItems: 'center'
                    },
                    '& .MuiAlert-action': {
                        padding: 0,
                        marginRight: -1,
                    }
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomToast;
