import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import axios from "axios";
import { useState, useMemo } from "react";
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
    IconButton,
    LinearProgress
} from "@mui/material";
import {
    Google as GoogleIcon,
    PersonAdd as SignupIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    CheckCircle,
    Cancel
} from "@mui/icons-material";
import Loader from "../components/Loader";

const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    requirements: {
        length: boolean;
        uppercase: boolean;
        lowercase: boolean;
        number: boolean;
        special: boolean;
    };
}

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<SignupFormInputs>({
        resolver: zodResolver(signupSchema),
    });

    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const password = watch("password", "");

    const passwordStrength = useMemo((): PasswordStrength => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const score = Object.values(requirements).filter(Boolean).length;

        let label = "Very Weak";
        let color = "#ef4444";

        if (score === 0) {
            label = "";
            color = "#94a3b8";
        } else if (score <= 2) {
            label = "Weak";
            color = "#ef4444";
        } else if (score === 3) {
            label = "Fair";
            color = "#f59e0b";
        } else if (score === 4) {
            label = "Good";
            color = "#10b981";
        } else {
            label = "Strong";
            color = "#059669";
        }

        return { score, label, color, requirements };
    }, [password]);

    const onSubmit = async (data: SignupFormInputs) => {
        setLoading(true);
        setServerError(null);
        try {
            await api.post("/auth/signup", data);
            navigate("/verify-otp", { state: { email: data.email } });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setServerError(error.response?.data?.message || "Signup failed");
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
                background: (theme: Theme) => `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
            background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 50%, ${theme.palette.primary.main} 100%)`,
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
                        borderColor: 'secondary.main',
                        borderWidth: '2px'
                    }
                },
                '&.Mui-focused': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme: Theme) => theme.palette.mode === 'light'
                        ? '0 8px 16px -4px rgba(236, 72, 153, 0.2)'
                        : '0 8px 16px -4px rgba(236, 72, 153, 0.4)',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px'
                    }
                }
            },
            '& .MuiInputLabel-root': {
                fontWeight: 600
            }
        },
        passwordStrengthBox: {
            mt: -1.5,
            mb: 1
        },
        strengthBar: {
            height: 6,
            borderRadius: 3,
            bgcolor: 'action.hover',
            overflow: 'hidden',
            mb: 1
        },
        strengthProgress: {
            height: '100%',
            borderRadius: 3,
            transition: 'all 0.3s ease'
        },
        strengthLabel: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1
        },
        requirementsList: {
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 0.5
        },
        requirement: {
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.75rem',
            transition: 'all 0.2s'
        },
        submitButton: {
            py: 1.8,
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 800,
            textTransform: 'none',
            background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            boxShadow: '0 4px 12px -2px rgba(236, 72, 153, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': {
                transform: 'translateY(-3px) scale(1.01)',
                boxShadow: '0 12px 24px -4px rgba(236, 72, 153, 0.5)',
                background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
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
                borderColor: 'secondary.main',
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
            color: 'secondary.main',
            transition: 'all 0.2s',
            '&:hover': {
                color: 'secondary.dark',
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
                            Join Us Today
                        </Typography>
                        <Typography variant="body1" sx={styles.subtitle}>
                            Create your account and start connecting
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
                            <Box>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
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

                                {password && (
                                    <Fade in>
                                        <Box sx={styles.passwordStrengthBox}>
                                            <Box sx={styles.strengthBar}>
                                                <Box
                                                    sx={{
                                                        ...styles.strengthProgress,
                                                        width: `${(passwordStrength.score / 5) * 100}%`,
                                                        bgcolor: passwordStrength.color
                                                    }}
                                                />
                                            </Box>

                                            <Box sx={styles.strengthLabel}>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: passwordStrength.color
                                                    }}
                                                >
                                                    {passwordStrength.label}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Password Strength
                                                </Typography>
                                            </Box>

                                            <Box sx={styles.requirementsList}>
                                                <Box sx={styles.requirement}>
                                                    {passwordStrength.requirements.length ?
                                                        <CheckCircle sx={{ fontSize: 14, color: '#10b981' }} /> :
                                                        <Cancel sx={{ fontSize: 14, color: '#94a3b8' }} />
                                                    }
                                                    <Typography variant="caption" color={passwordStrength.requirements.length ? 'success.main' : 'text.disabled'}>
                                                        8+ characters
                                                    </Typography>
                                                </Box>
                                                <Box sx={styles.requirement}>
                                                    {passwordStrength.requirements.uppercase ?
                                                        <CheckCircle sx={{ fontSize: 14, color: '#10b981' }} /> :
                                                        <Cancel sx={{ fontSize: 14, color: '#94a3b8' }} />
                                                    }
                                                    <Typography variant="caption" color={passwordStrength.requirements.uppercase ? 'success.main' : 'text.disabled'}>
                                                        Uppercase letter
                                                    </Typography>
                                                </Box>
                                                <Box sx={styles.requirement}>
                                                    {passwordStrength.requirements.lowercase ?
                                                        <CheckCircle sx={{ fontSize: 14, color: '#10b981' }} /> :
                                                        <Cancel sx={{ fontSize: 14, color: '#94a3b8' }} />
                                                    }
                                                    <Typography variant="caption" color={passwordStrength.requirements.lowercase ? 'success.main' : 'text.disabled'}>
                                                        Lowercase letter
                                                    </Typography>
                                                </Box>
                                                <Box sx={styles.requirement}>
                                                    {passwordStrength.requirements.number ?
                                                        <CheckCircle sx={{ fontSize: 14, color: '#10b981' }} /> :
                                                        <Cancel sx={{ fontSize: 14, color: '#94a3b8' }} />
                                                    }
                                                    <Typography variant="caption" color={passwordStrength.requirements.number ? 'success.main' : 'text.disabled'}>
                                                        Number
                                                    </Typography>
                                                </Box>
                                                <Box sx={styles.requirement}>
                                                    {passwordStrength.requirements.special ?
                                                        <CheckCircle sx={{ fontSize: 14, color: '#10b981' }} /> :
                                                        <Cancel sx={{ fontSize: 14, color: '#94a3b8' }} />
                                                    }
                                                    <Typography variant="caption" color={passwordStrength.requirements.special ? 'success.main' : 'text.disabled'}>
                                                        Special character
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Fade>
                                )}
                            </Box>
                        </Grow>

                        <Grow in timeout={1200}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={loading ? <Loader size={20} color="inherit" /> : <SignupIcon />}
                                sx={styles.submitButton}
                            >
                                {loading ? "Creating account..." : "Create Account"}
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
                        Sign up with Google
                    </Button>
                </Grow>

                <Grow in timeout={1400}>
                    <Box sx={styles.footerBox}>
                        <Typography variant="body2" sx={styles.footerText}>
                            Already have an account?{" "}
                            <MuiLink component={Link} to="/login" sx={styles.link}>
                                Sign in
                            </MuiLink>
                        </Typography>
                    </Box>
                </Grow>
            </Paper>
        </Fade>
    );
};

export default Signup;
