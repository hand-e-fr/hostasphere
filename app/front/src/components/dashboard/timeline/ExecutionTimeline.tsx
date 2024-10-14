import React from 'react';
import { SessionData } from "@/types/SessionData";
import dayjs from "dayjs";  // Importing day.js for date manipulation
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek); // Extending dayjs to work with ISO weeks

interface ContributionHeatmapProps {
    sessions: SessionData[];
}

const shades = [
    'bg-gray-100',      // 0 sessions
    'bg-green-100',   // 1-5 sessions
    'bg-green-300',   // 6-10 sessions
    'bg-green-500',   // 11-20 sessions
    'bg-green-700',   // 21+ sessions
];

const getShade = (count: number) => {
    if (count === 0) return shades[0];
    if (count <= 5) return shades[1];
    if (count <= 10) return shades[2];
    if (count <= 20) return shades[3];
    return shades[4];
};

const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ sessions }) => {
    // Calculate today's date and the last 12 months range
    const today = dayjs();
    const startDate = today.subtract(12, 'month').startOf('month');  // Start from the beginning of 12 months ago.
    const endDate = today.endOf('day');  // Till now.

    // Create a session count map indexed by date (YYYY-MM-DD)
    const sessionCount: { [key: string]: number } = {};

    sessions.forEach(session => {
        const sessionDate = dayjs(session.startdate).format('YYYY-MM-DD');
        if (!sessionCount[sessionDate]) {
            sessionCount[sessionDate] = 0;
        }
        sessionCount[sessionDate] += 1;
    });

    // Group days into weeks
    const weeks: Array<Array<{ date: dayjs.Dayjs, sessionCount: number }>> = [];
    let currentWeek: Array<{ date: dayjs.Dayjs, sessionCount: number }> = [];

    for (let d = startDate; d.isBefore(endDate); d = d.add(1, 'day')) {
        // Start a new week (Sunday starts a new one)
        if (d.day() === 0 && currentWeek.length > 0) {
            weeks.push(currentWeek);
            currentWeek = [];
        }

        currentWeek.push({
            date: d,
            sessionCount: sessionCount[d.format('YYYY-MM-DD')] || 0
        });
    }

    // Push the last week
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    return (
        <div className="flex flex-col p-4 space-y-4">
            {/* Color Legend */}
            <div className="w-full flex mt-4 space-x-4">
                {shades.map((shade, idx) => (
                    <div key={idx} className="flex items-center space-x-1">
                        <div className={`w-3 h-3 ${shade} rounded-sm`} />
                        <span className="text-sm">
                            {idx === 0 ? '0' : idx === 1 ? '1-5' : idx === 2 ? '6-10' : idx === 3 ? '11-20' : '21+'}
                        </span>
                    </div>
                ))}
            </div>
            {/* Grid of heatmap with Weekdays and Months */}
            <div className="flex space-x-1 items-start">
                {/* Days of Week Labels */}
                <div className="flex flex-col items-center">
                    <span className="text-xs">Sun</span>
                    <span className="text-xs">Mon</span>
                    <span className="text-xs">Tue</span>
                    <span className="text-xs">Wed</span>
                    <span className="text-xs">Thu</span>
                    <span className="text-xs">Fri</span>
                    <span className="text-xs">Sat</span>
                </div>

                {/* Weeks/Months section */}
                <div className="overflow-x-auto">
                    <div className="flex space-x-0.5">
                        {/* Creating each column (week) */}
                        {weeks.map((week, weekIdx) => {
                            return (
                                <div key={weekIdx} className="flex flex-col space-y-0.5">
                                    {week.map((day, dayIdx) => (
                                        <div
                                            key={dayIdx}
                                            className={`w-3 h-3 rounded-sm ${getShade(day.sessionCount)}`}
                                            title={`${day.date.format('YYYY-MM-DD')}: ${day.sessionCount} sessions`}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                    {/* Month Labels under the grid */}
                    <div className="flex space-x-2.5 mt-2 text-xs text-center justify-start">
                        {/* Get the first day of each month to label months */}
                        {weeks.map((week, index) => (
                            (week[0].date.date() <= 7 && (
                                <span key={week[0].date.format('MMM')} className="w-12 text-center mr-1">
                                    {week[0].date.format('MMM')}
                                </span>
                            ))
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContributionHeatmap;