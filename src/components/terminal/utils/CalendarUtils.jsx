// CalendarUtils.js - Generate ASCII calendars

/**
 * Generate an ASCII art calendar for the current month
 * @returns {string} Formatted calendar
 */
export const generateASCIICalendar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    let calendar = `    ${monthNames[month]} ${year}\n`;
    calendar += ` Su Mo Tu We Th Fr Sa\n`;

    // Add leading spaces for the first week
    let day = 1;
    let row = '  '.repeat(firstDay);

    for (let i = 0; i < 7 - firstDay; i++) {
        row += day === today ? `[${day.toString().padStart(2)}]` : ` ${day.toString().padStart(2)} `;
        day++;
    }

    calendar += ` ${row}\n`;

    // Add remaining weeks
    while (day <= daysInMonth) {
        row = '';
        for (let i = 0; i < 7 && day <= daysInMonth; i++) {
            row += day === today ? `[${day.toString().padStart(2)}]` : ` ${day.toString().padStart(2)} `;
            day++;
        }
        calendar += ` ${row}\n`;
    }

    // Add some fake events
    const events = generateFakeEvents(today, daysInMonth, month, year);

    calendar += `\nUpcoming Events:\n`;
    events.forEach(event => {
        calendar += `- ${event}\n`;
    });

    return calendar;
};

/**
 * Generate fake events for the calendar
 * @param {number} today - Current day of month
 * @param {number} daysInMonth - Number of days in month
 * @param {number} month - Current month (0-11)
 * @param {number} year - Current year
 * @returns {string[]} Array of event strings
 */
const generateFakeEvents = (today, daysInMonth, month, year) => {
    const eventTypes = [
        'System maintenance',
        'Security audit',
        'Software update',
        'Team meeting',
        'Backup scheduled',
        'Performance review',
        'Database cleanup',
        'Network upgrade',
        'Project deadline',
        'Training session'
    ];

    const events = [];

    // Generate 3-5 events
    const numEvents = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < numEvents; i++) {
        // Events should be in the future
        const eventDay = Math.min(today + i + 1 + Math.floor(Math.random() * 7), daysInMonth);
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        // Format date
        const date = new Date(year, month, eventDay);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        events.push(`${dateStr}: ${eventType}`);
    }

    return events;
};

/**
 * Generate a calendar for a specific month and year
 * @param {number} month - Month number (0-11)
 * @param {number} year - Year
 * @returns {string} Formatted calendar
 */
export const generateCalendarForMonth = (month, year) => {
    if (month < 0 || month > 11) {
        return "Invalid month. Please use a number from 0 (January) to 11 (December).";
    }

    const now = new Date();
    const today = now.getMonth() === month && now.getFullYear() === year ? now.getDate() : -1;

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    let calendar = `    ${monthNames[month]} ${year}\n`;
    calendar += ` Su Mo Tu We Th Fr Sa\n`;

    // Add leading spaces for the first week
    let day = 1;
    let row = '  '.repeat(firstDay);

    for (let i = 0; i < 7 - firstDay; i++) {
        row += day === today ? `[${day.toString().padStart(2)}]` : ` ${day.toString().padStart(2)} `;
        day++;
    }

    calendar += ` ${row}\n`;

    // Add remaining weeks
    while (day <= daysInMonth) {
        row = '';
        for (let i = 0; i < 7 && day <= daysInMonth; i++) {
            row += day === today ? `[${day.toString().padStart(2)}]` : ` ${day.toString().padStart(2)} `;
            day++;
        }
        calendar += ` ${row}\n`;
    }

    return calendar;
};