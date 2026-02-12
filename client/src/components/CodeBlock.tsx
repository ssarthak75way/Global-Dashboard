import React, { useState } from 'react';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';

interface CodeBlockProps {
    code: string;
    onCopy?: (code: string) => void;
    showCopy?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
    code,
    onCopy,
    showCopy = true
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        if (onCopy) onCopy(code);
        setTimeout(() => setCopied(false), 2000);
    };

    const styles = {
        codeBlock: {
            bgcolor: '#1e1e1e',
            color: '#d4d4d4',
            p: 3,
            borderRadius: 2,
            fontFamily: '"Fira Code", "Courier New", monospace',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            position: 'relative',
            overflow: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            '&:hover .copy-button': {
                opacity: 1
            }
        },
        dots: {
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            gap: 1,
            zIndex: 1
        },
        dot: {
            width: 12,
            height: 12,
            borderRadius: '50%'
        },
        copyButton: {
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: 0,
            transition: 'opacity 0.2s',
            bgcolor: 'rgba(255,255,255,0.1)',
            color: '#d4d4d4',
            zIndex: 1,
            '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)'
            }
        },
        content: {
            mt: 4
        }
    };

    return (
        <Paper elevation={0} sx={styles.codeBlock}>
            {/* macOS-style colored dots */}
            <Box sx={styles.dots}>
                <Box sx={{ ...styles.dot, bgcolor: '#ff5f56' }} />
                <Box sx={{ ...styles.dot, bgcolor: '#ffbd2e' }} />
                <Box sx={{ ...styles.dot, bgcolor: '#27c93f' }} />
            </Box>

            {/* Copy button */}
            {showCopy && (
                <IconButton
                    size="small"
                    className="copy-button"
                    sx={styles.copyButton}
                    onClick={handleCopy}
                >
                    <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
                        <CopyIcon fontSize="small" />
                    </Tooltip>
                </IconButton>
            )}

            {/* Code content */}
            <Box sx={styles.content}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' as const }}>
                    {code}
                </pre>
            </Box>
        </Paper>
    );
};

export default CodeBlock;
