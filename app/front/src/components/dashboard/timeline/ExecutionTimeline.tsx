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
    'bg-blue-100',   // 1-5 sessions
    'bg-blue-300',   // 6-10 sessions
    'bg-blue-500',   // 11-20 sessions
    'bg-blue-700',   // 21+ sessions
];

const getShade = (count: number) => {
    if (count === 0) return shades[0];
    if (count <= 5) return shades[1];
    if (count <= 10) return shades[2];
    if (count <= 20) return shades[3];
    return shades[4];
};

const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ sessions }) => {
    // Calculate the day counts starting from today, going back 12 months.
    const today = dayjs();
    const startDate = today.subtract(12, 'month').startOf('month');  // Start from the beginning of 12 months ago
    const endDate = today.endOf('day');  // End today

    // Create a map to store session count per day
    const sessionCount: { [key: string]: number } = {};

    sessions.forEach(session => {
        const sessionDate = dayjs(session.startdate).format('YYYY-MM-DD');
        if (!sessionCount[sessionDate]) {
            sessionCount[sessionDate] = 0;
        }
        sessionCount[sessionDate] += 1;
    });

    // Create an array with data for each day from startDate to endDate
    const weeks: Array<Array<{ date: dayjs.Dayjs, sessionCount: number }>> = [];
    let currentWeek: Array<{ date: dayjs.Dayjs, sessionCount: number }> = [];

    for (let d = startDate; d.isBefore(endDate); d = d.add(1, 'day')) {
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
        <div className="">
            {/* Displaying the color scale at the bottom */}
            <div className="w-full flex space-x-4">
                {shades.map((shade, idx) => (
                    <div key={idx} className="flex items-center">
                        <div className={`w-3 h-3 ${shade} rounded-sm`} />
                        <span className="ml-1 text-sm">
                            {idx === 0 ? '0' : idx === 1 ? '1-5' : idx === 2 ? '6-10' : idx === 3 ? '11-20' : '21+'}
                        </span>
                    </div>
                ))}
            </div>
            <div className="ml-10">
                <p></p>
            </div>
            <div className="mt-4 flex">
                <div className="mr-2">
                    <p className="mt-2.5">Mon</p>
                    <p className="mt-1.5">Wed</p>
                    <p className="mt-1">Fri</p>
                </div>
                {/* Loop through weeks for creating the heatmap */}
                {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col">
                        {/* Loop through the days of the week */}
                        {week.map((day, dayIdx) => (
                            <div
                                key={dayIdx}
                                className={`w-3 h-3 rounded-sm ${getShade(day.sessionCount)} m-[1px]`}
                                title={`${day.date.format('YYYY-MM-DD')}: ${day.sessionCount} sessions`}
                            >
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContributionHeatmap;