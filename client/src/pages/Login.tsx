import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Link as MuiLink,
    Divider,
    Alert,
    Stack,
    Fade,
    Grow,
    Theme,
    InputAdornment,
    IconButton
} from "@mui/material";
import {
    Google as GoogleIcon,
    Login as LoginIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import axios from "axios";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();
    const { login } = useAuth();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: LoginFormInputs) => {
        setLoading(true);
        setServerError(null);
        try {
            const response = await api.post("/auth/login", data);
            login(response.data, response.data.accessToken, response.data.expiresAt);
            navigate("/dashboard");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setServerError(error.response?.data?.message || "Login failed");
            } else if (error instanceof Error) {
                setServerError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        paper: {
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: (theme: Theme) => theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.85)'
                : 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(24px)',
            boxShadow: (theme: Theme) => theme.palette.mode === 'light'
                ? '0 20px 60px -15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                : '0 20px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: (theme: Theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                backgroundSize: '200% 100%',
                animation: 'gradientShift 3s ease infinite',
            },
            '@keyframes gradientShift': {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' }
            }
        },
        headerBox: {
            mb: 4,
            textAlign: 'center'
        },
        title: {
            fontWeight: 900,
            mb: 1.5,
            letterSpacing: -1.5,
            background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientAnimation 4s ease infinite',
            '@keyframes gradientAnimation': {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' }
            }
        },
        subtitle: {
            fontWeight: 500,
            color: 'text.secondary'
        },
        alert: {
            mb: 3,
            borderRadius: 2,
            borderStyle: 'solid',
            fontWeight: 600,
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
                from: { opacity: 0, transform: 'translateY(-10px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
            }
        },
        inputField: {
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px'
                    }
                },
                '&.Mui-focused': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme: Theme) => theme.palette.mode === 'light'
                        ? '0 8px 16px -4px rgba(99, 102, 241, 0.2)'
                        : '0 8px 16px -4px rgba(99, 102, 241, 0.4)',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px'
                    }
                }
            },
            '& .MuiInputLabel-root': {
                fontWeight: 600
            }
        },
        submitButton: {
            py: 1.8,
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 800,
            textTransform: 'none',
            background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: '0 4px 12px -2px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': {
                transform: 'translateY(-3px) scale(1.01)',
                boxShadow: '0 12px 24px -4px rgba(99, 102, 241, 0.5)',
                background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            },
            '&:active': {
                transform: 'translateY(-1px) scale(0.99)'
            },
            '&.Mui-disabled': {
                background: 'action.disabledBackground',
                color: 'action.disabled'
            }
        },
        divider: {
            my: 4
        },
        dividerText: {
            color: 'text.disabled',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            fontSize: '0.75rem'
        },
        googleButton: {
            py: 1.5,
            borderRadius: 2,
            borderColor: 'divider',
            borderWidth: '2px',
            color: 'text.primary',
            fontWeight: 700,
            textTransform: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main',
                borderWidth: '2px',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1)'
            }
        },
        footerBox: {
            mt: 4,
            textAlign: 'center'
        },
        footerText: {
            fontWeight: 500,
            color: 'text.secondary'
        },
        link: {
            fontWeight: 800,
            textDecoration: 'none',
            color: 'primary.main',
            transition: 'all 0.2s',
            '&:hover': {
                color: 'primary.dark',
                textDecoration: 'underline',
                textUnderlineOffset: '4px'
            }
        }
    };

    return (
        <Fade in timeout={600}>
            <Paper elevation={0} sx={styles.paper}>
                <Grow in timeout={800}>
                    <Box sx={styles.headerBox}>
                        <Typography variant="h3" sx={{ ...styles.title, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" sx={styles.subtitle}>
                            Sign in to continue your journey
                        </Typography>
                    </Box>
                </Grow>

                {serverError && (
                    <Grow in>
                        <Alert severity="error" variant="filled" sx={styles.alert}>
                            {serverError}
                        </Alert>
                    </Grow>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={3}>
                        <Grow in timeout={1000}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                placeholder="you@example.com"
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                sx={styles.inputField}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grow>

                        <Grow in timeout={1100}>
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={styles.inputField}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grow>

                        <Grow in timeout={1200}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={loading ? <Loader size={20} color="inherit" /> : <LoginIcon />}
                                sx={styles.submitButton}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                        </Grow>
                    </Stack>
                </Box>

                <Divider sx={styles.divider}>
                    <Typography variant="caption" sx={styles.dividerText}>
                        Or continue with
                    </Typography>
                </Divider>

                <Grow in timeout={1300}>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<GoogleIcon />}
                        onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/google`}
                        sx={styles.googleButton}
                    >
                        Sign in with Google
                    </Button>
                </Grow>

                <Grow in timeout={1400}>
                    <Box sx={styles.footerBox}>
                        <Typography variant="body2" sx={styles.footerText}>
                            Don't have an account?{" "}
                            <MuiLink component={Link} to="/signup" sx={styles.link}>
                                Create one now
                            </MuiLink>
                        </Typography>
                    </Box>
                </Grow>
            </Paper>
        </Fade>
    );
};

export default Login;
