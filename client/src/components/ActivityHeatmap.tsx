import React, { useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Box, Tooltip, useTheme, useMediaQuery, Theme, Typography } from '@mui/material';

interface ActivityItem {
    date: string;
    count: number;
}

interface ActivityHeatmapProps {
    values: ActivityItem[];
}

const heatmapStyles = {
    container: {
        '& .react-calendar-heatmap': {
            width: '100%',
            height: 'auto'
        },
        '& .react-calendar-heatmap-month-label': {
            fontSize: '0.8rem',
            fill: 'currentColor',
            opacity: 0.7,
            fontWeight: 700
        },
        '& .react-calendar-heatmap-weekday-label': {
            fontSize: '0.75rem',
            fill: 'currentColor',
            opacity: 0.6,
            fontWeight: 600
        },
        '& .color-empty': (theme: Theme) => ({
            fill: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(187, 12, 12, 0.05)'
        }),
        '& .color-scale-1': (theme: Theme) => ({
            fill: theme.palette.primary.light,
            opacity: 0.4
        }),
        '& .color-scale-2': (theme: Theme) => ({
            fill: theme.palette.primary.light,
            opacity: 0.7
        }),
        '& .color-scale-3': (theme: Theme) => ({
            fill: theme.palette.primary.main,
            opacity: 0.85
        }),
        '& .color-scale-4': (theme: Theme) => ({
            fill: theme.palette.primary.dark,
            opacity: 1
        }),
        '& rect': {
            rx: 1,
            transition: 'all 0.2s'
        },
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        pb: 1
    },
    legendBox: {
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        opacity: 0.8,
        mt: 2,
        justifyContent: 'flex-end'
    },
    legendChip: (opacity: number) => ({
        width: 12,
        height: 12,
        borderRadius: 1,
        bgcolor: 'primary.main',
        opacity
    })
};

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ values }) => {
    const theme = useTheme();
    const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('lg'));

    const { filledData, startDate, today } = useMemo(() => {
        const todayDate = new Date();
        const start = new Date();

        if (isMobileOrTablet) {
            start.setDate(todayDate.getDate() - 100);
        } else {
            start.setFullYear(todayDate.getFullYear() - 1);
        }

        const valueMap = new Map(values.map(v => [v.date, v.count]));

        const allDays: ActivityItem[] = [];
        const current = new Date(start);

        while (current <= todayDate) {
            const dateStr = current.toISOString().split('T')[0];

            allDays.push({
                date: dateStr,
                count: valueMap.get(dateStr) || 0
            });

            current.setDate(current.getDate() + 1);
        }

        return { filledData: allDays, startDate: start, today: todayDate };
    }, [values, isMobileOrTablet]);

    return (
        <Box>
            <Box sx={heatmapStyles.container}>
                <CalendarHeatmap
                    startDate={startDate}
                    endDate={today}
                    values={filledData}
                    classForValue={(value) => {
                        if (!value || value.count === 0) return 'color-empty';
                        return `color-scale-${Math.min(value.count, 4)}`;
                    }}
                    showWeekdayLabels={!isMobileOrTablet}
                    transformDayElement={(element, value, index) => (
                        <Tooltip
                            key={index}
                            title={value?.count ? `${value.count} posts on ${new Date(value.date).toLocaleDateString()}` : "No activity"}
                            arrow
                        >
                            {element as React.ReactElement}
                        </Tooltip>
                    )}
                />
            </Box>

            <Box sx={heatmapStyles.legendBox}>
                <Typography variant="caption" fontWeight={700}>Less</Typography>
                {[0.1, 0.32, 0.54, 0.76, 1].map((opacity, i) => (
                    <Box key={i} sx={heatmapStyles.legendChip(opacity)} />
                ))}
                <Typography variant="caption" fontWeight={700}>More</Typography>
            </Box>
        </Box>
    );
};

export default ActivityHeatmap;