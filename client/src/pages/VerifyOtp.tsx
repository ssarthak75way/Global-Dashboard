import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
    Stack,
    IconButton,
    Avatar,
    Link as MuiLink,
    Fade,
    Grow,
    Theme
} from "@mui/material";
import {
    MarkEmailRead as EmailIcon,
    CheckCircleOutline as VerifiedIcon,
    ArrowBack as BackIcon
} from "@mui/icons-material";

const verifySchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
});

type VerifyFormInputs = z.infer<typeof verifySchema>;

const VerifyOtp = () => {
    const location = useLocation();
    const email = location.state?.email;
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyFormInputs>({
        resolver: zodResolver(verifySchema),
    });

    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate("/signup");
        }
    }, [email, navigate]);

    const onSubmit = async (data: VerifyFormInputs) => {
        setLoading(true);
        setServerError(null);
        try {
            const response = await api.post("/auth/verify-otp", { email, otp: data.otp });
            login(response.data, response.data.accessToken, response.data.expiresAt);
            navigate("/dashboard");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setServerError(error.response?.data?.message || "Verification failed");
            } else if (error instanceof Error) {
                setServerError(error.message);
            } else {
                setServerError("Verification failed");
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
            background: (theme: Theme) => theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            boxShadow: (theme: Theme) => theme.palette.mode === 'light'
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.05)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            maxWidth: 500,
            mx: 'auto'
        },
        backButton: {
            position: 'absolute',
            top: 24,
            left: 24,
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' }
        },
        avatarBox: {
            mb: 5,
            mt: 2,
            textAlign: 'center'
        },
        avatar: {
            mx: 'auto',
            mb: 3,
            bgcolor: 'primary.main',
            color: 'white',
            width: 80,
            height: 80,
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
        },
        title: {
            fontWeight: 800,
            mb: 1.5,
            letterSpacing: -1
        },
        subtitle: {
            fontWeight: 500
        },
        emailText: {
            fontWeight: 700,
            color: 'text.primary',
            mt: 0.5
        },
        alert: {
            mb: 4,
            borderRadius: 3,
            borderStyle: 'dashed',
            fontWeight: 600
        },
        otpInput: {
            '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                bgcolor: (theme: Theme) => theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'
            }
        },
        verifyButton: {
            py: 2,
            borderRadius: 4,
            fontSize: '1.1rem',
            fontWeight: 800,
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 24px -6px rgba(99, 102, 241, 0.5)'
            }
        },
        footerBox: {
            mt: 5,
            textAlign: 'center'
        },
        resendLink: {
            fontWeight: 800,
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'primary.main',
            '&:hover': { textDecoration: 'underline' }
        }
    };

    return (
        <Fade in timeout={800}>
            <Paper elevation={0} sx={styles.paper}>
                <IconButton
                    onClick={() => navigate("/signup")}
                    sx={styles.backButton}
                    size="small"
                >
                    <BackIcon />
                </IconButton>

                <Box sx={styles.avatarBox}>
                    <Grow in timeout={1000}>
                        <Avatar sx={styles.avatar}>
                            <EmailIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                    </Grow>
                    <Typography variant="h3" sx={styles.title}>
                        Security Check
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={styles.subtitle}>
                        We've sent a secure code to:
                    </Typography>
                    <Typography variant="h6" sx={styles.emailText}>
                        {email}
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
                    <Stack spacing={4}>
                        <TextField
                            fullWidth
                            label="Verification Code"
                            placeholder="000000"
                            autoFocus
                            inputProps={{
                                maxLength: 6,
                                style: {
                                    textAlign: 'center',
                                    letterSpacing: '0.5em',
                                    fontSize: '2rem',
                                    fontWeight: 900,
                                    height: '60px'
                                }
                            }}
                            {...register("otp")}
                            error={!!errors.otp}
                            helperText={errors.otp?.message}
                            variant="outlined"
                            sx={styles.otpInput}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <VerifiedIcon />}
                            sx={styles.verifyButton}
                        >
                            {loading ? "Verifying..." : "Verify & Unlock"}
                        </Button>
                    </Stack>
                </Box>

                <Box sx={styles.footerBox}>
                    <Typography variant="body2" color="text.secondary" sx={styles.subtitle}>
                        Didn't receive the email?{" "}
                        <MuiLink sx={styles.resendLink}>
                            Resend Code
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>
        </Fade>
    );
};

export default VerifyOtp;
