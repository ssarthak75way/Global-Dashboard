import React, { useState, useEffect } from "react";
import { Typography, Box, Tooltip } from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";

interface TokenCountdownProps {
    expiryTime: number | null;
    onExpire?: () => void;
}

const TokenCountdown: React.FC<TokenCountdownProps> = ({ expiryTime, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState<string>("00:00");

    useEffect(() => {
        if (!expiryTime) return;

        const updateTimer = () => {
            const now = Date.now();
            const difference = expiryTime - now;

            if (difference <= 0) {
                setTimeLeft("Expired");
                if (onExpire) onExpire();
                return;
            }

            const minutes = Math.floor(difference / 60000);
            const seconds = Math.floor((difference % 60000) / 1000);

            setTimeLeft(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [expiryTime]);

    if (!expiryTime) return null;

    const isExpiringSoon = expiryTime - Date.now() < 60000;

    const styles = {
        container: {
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            px: { xs: 1, sm: 1.5 },
            py: 0.5,
            borderRadius: 1,
            bgcolor: isExpiringSoon ? "error.light" : "action.hover",
            color: isExpiringSoon ? "error.contrastText" : "text.secondary",
            transition: "all 0.3s ease",
        },
        text: {
            fontWeight: 700,
            fontFamily: "monospace",
            width: { xs: "28px", sm: "45px" },
            textAlign: "center",
            fontSize: { xs: "0.7rem", sm: "0.875rem" }
        }
    };


    return (
        <Tooltip title="Access Token Expiry Countdown">
            <Box
                sx={styles.container}
            >
                <TimerIcon fontSize="small" sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Typography
                    variant="body2"
                    sx={styles.text}
                >
                    {timeLeft}
                </Typography>
            </Box>
        </Tooltip>
    );
};

export default TokenCountdown;

