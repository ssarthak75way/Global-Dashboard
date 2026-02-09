import React, { useState, useEffect } from "react";
import { Typography, Box, Tooltip } from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";

interface TokenCountdownProps {
    expiryTime: number | null;
}

const TokenCountdown: React.FC<TokenCountdownProps> = ({ expiryTime }) => {
    const [timeLeft, setTimeLeft] = useState<string>("00:00");

    useEffect(() => {
        if (!expiryTime) return;

        const updateTimer = () => {
            const now = Date.now();
            const difference = expiryTime - now;

            if (difference <= 0) {
                setTimeLeft("Expired");
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

    return (
        <Tooltip title="Access Token Expiry Countdown">
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: isExpiringSoon ? "error.light" : "action.hover",
                    color: isExpiringSoon ? "error.contrastText" : "text.secondary",
                    transition: "all 0.3s ease",
                }}
            >
                <TimerIcon fontSize="small" />
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 700,
                        fontFamily: "monospace",
                        width: "45px",
                        textAlign: "center"
                    }}
                >
                    {timeLeft}
                </Typography>
            </Box>
        </Tooltip>
    );
};

export default TokenCountdown;
