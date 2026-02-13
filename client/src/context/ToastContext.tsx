import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomToast, { ToastSeverity } from '../components/common/CustomToast';

interface ToastContextType {
    showToast: (message: string, severity?: ToastSeverity) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<ToastSeverity>('success');

    const showToast = useCallback((msg: string, sev: ToastSeverity = 'success') => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    }, []);

    const handleClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <CustomToast
                open={open}
                message={message}
                severity={severity}
                onClose={handleClose}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
