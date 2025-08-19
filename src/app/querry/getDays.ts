import { Step } from "@/components/dashboard/modals/components/newjourney/types";

type JourneyDay = {
    id: number;
    dayNumber: number;
    date: string;   // YYYY-MM-DD
    steps: Step[];
    isOpen: boolean;
};

// Parse "YYYY-MM-DD" as UTC midnight to avoid off-by-one issues
const parseYMDtoUTC = (ymd: string): Date => {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
};

const formatUTCtoYMD = (date: Date): string => {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

/**
 * ✅ Call this when you need to generate the days array.
 * Inclusive of both start and end dates.
 */
export const generateDaysFromRange = (
    startDate: string,
    endDate: string
): JourneyDay[] => {
    if (!startDate || !endDate) return [];

    let start = parseYMDtoUTC(startDate);
    let end = parseYMDtoUTC(endDate);
    if (end.getTime() < start.getTime()) [start, end] = [end, start];

    const result: JourneyDay[] = [];
    let cursor = new Date(start);
    let i = 0;

    while (cursor.getTime() <= end.getTime()) {
        result.push({
            id: i + 1,
            dayNumber: i + 1,
            date: formatUTCtoYMD(cursor),
            steps: [],
            isOpen: false,
        });
        const next = new Date(cursor);
        next.setUTCDate(next.getUTCDate() + 1);
        cursor = next;
        i++;
    }

    return result;
};
