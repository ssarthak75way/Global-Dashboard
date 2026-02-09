import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Link as MuiLink,
    Divider,
    Alert,
    CircularProgress,
    Stack,
    Fade,
    Grow
} from "@mui/material";
import { Google as GoogleIcon, Login as LoginIcon } from "@mui/icons-material";
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
            p: { xs: 4, md: 6 },
            borderRadius: 6,
            border: '1px solid',
            borderColor: 'divider',
            background: (theme: any) => theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            boxShadow: (theme: any) => theme.palette.mode === 'light'
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.05)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden'
        },
        headerBox: {
            mb: 5,
            textAlign: 'center'
        },
        title: {
            fontWeight: 800,
            mb: 1.5,
            letterSpacing: -1.5,
            background: (theme: any) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 8px rgba(99, 102, 241, 0.2))'
        },
        subtitle: {
            fontWeight: 500
        },
        alert: {
            mb: 4,
            borderRadius: 3,
            borderStyle: 'dashed',
            fontWeight: 600
        },
        input: {
            borderRadius: 3
        },
        submitButton: {
            py: 2,
            borderRadius: 3,
            fontSize: '1rem',
            fontWeight: 800,
            textTransform: 'none',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': {
                transform: 'scale(1.02) translateY(-2px)',
                boxShadow: '0 12px 20px -5px rgba(99, 102, 241, 0.4)'
            }
        },
        divider: {
            my: 5
        },
        dividerText: {
            color: 'text.disabled',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 2
        },
        googleButton: {
            py: 1.5,
            borderRadius: 3,
            borderColor: 'divider',
            color: 'text.primary',
            fontWeight: 700,
            '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main',
                transform: 'translateY(-1px)'
            }
        },
        footerBox: {
            mt: 5,
            textAlign: 'center'
        },
        footerText: {
            fontWeight: 500
        },
        link: {
            fontWeight: 800,
            textDecoration: 'none',
            color: 'primary.main',
            transition: 'all 0.2s',
            '&:hover': { color: 'primary.dark', textDecoration: 'underline' }
        }
    };

    return (
        <Fade in timeout={800}>
            <Paper elevation={0} sx={styles.paper}>
                <Box sx={styles.headerBox}>
                    <Typography variant="h3" sx={styles.title}>
                        Sign In
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={styles.subtitle}>
                        Welcome back to the professional network
                    </Typography>
                </Box>

                {serverError && (
                    <Grow in>
                        <Alert severity="error" variant="outlined" sx={styles.alert}>
                            {serverError}
                        </Alert>
                    </Grow>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            placeholder="engineering@Global Dashboard.com"
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            InputProps={{ sx: styles.input }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{ sx: styles.input }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                            sx={styles.submitButton}
                        >
                            {loading ? "Authorizing..." : "Continue to Workspace"}
                        </Button>
                    </Stack>
                </Box>

                <Divider sx={styles.divider}>
                    <Typography variant="caption" sx={styles.dividerText}>
                        Secure Access
                    </Typography>
                </Divider>

                <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<GoogleIcon />}
                    onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
                    sx={styles.googleButton}
                >
                    Sign in with Google
                </Button>

                <Box sx={styles.footerBox}>
                    <Typography variant="body2" color="text.secondary" sx={styles.footerText}>
                        Account missing?{" "}
                        <MuiLink component={Link} to="/signup" sx={styles.link}>
                            Create yours now
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>
        </Fade>
    );
};

export default Login;
