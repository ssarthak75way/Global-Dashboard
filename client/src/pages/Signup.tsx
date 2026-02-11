import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import axios from "axios";
import { useState } from "react";
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
} from "@mui/material";
import { Google as GoogleIcon, PersonAdd as SignupIcon } from "@mui/icons-material";
import Loader from "../components/Loader";

const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormInputs>({
        resolver: zodResolver(signupSchema),
    });

    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
            p: { xs: 3, sm: 4, md: 6 },
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            background: (theme: Theme) => theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            boxShadow: (theme: Theme) => theme.palette.mode === 'light'
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
            background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 8px rgba(236, 72, 153, 0.2))'
        },
        subtitle: {
            fontWeight: 500
        },
        alert: {
            mb: 4,
            borderRadius: 1,
            borderStyle: 'dashed',
            fontWeight: 600
        },
        input: {
            borderRadius: 1
        },
        submitButton: {
            py: 2,
            borderRadius: 1,
            fontSize: '1rem',
            fontWeight: 800,
            textTransform: 'none',
            background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            '&:hover': {
                transform: 'scale(1.02) translateY(-2px)',
                boxShadow: '0 12px 20px -5px rgba(236, 72, 153, 0.4)',
                background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
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
            borderRadius: 1,
            borderColor: 'divider',
            color: 'text.primary',
            fontWeight: 700,
            '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'secondary.main',
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
            color: 'secondary.main',
            transition: 'all 0.2s',
            '&:hover': { color: 'secondary.dark', textDecoration: 'underline' }
        }
    };

    return (
        <Fade in timeout={800}>
            <Paper elevation={0} sx={styles.paper}>
                <Box sx={styles.headerBox}>
                    <Typography variant="h3" sx={{ ...styles.title, fontSize: { xs: '2.5rem', md: '3rem' } }}>
                        Join Us
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={styles.subtitle}>
                        Create your professional workspace in seconds
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
                            placeholder="you@example.com"
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            InputProps={{ sx: styles.input }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            placeholder="At least 6 characters"
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
                            startIcon={loading ? <Loader size={20} color="inherit" /> : <SignupIcon />}
                            sx={styles.submitButton}
                        >
                            {loading ? "Creating Profile..." : "Get Started Now"}
                        </Button>
                    </Stack>
                </Box>

                <Divider sx={styles.divider}>
                    <Typography variant="caption" sx={styles.dividerText}>
                        One-Click Signup
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
                    Sign up with Google
                </Button>

                <Box sx={styles.footerBox}>
                    <Typography variant="body2" color="text.secondary" sx={styles.footerText}>
                        Already a member?{" "}
                        <MuiLink component={Link} to="/login" sx={styles.link}>
                            Sign In
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>
        </Fade>
    );
};

export default Signup;
