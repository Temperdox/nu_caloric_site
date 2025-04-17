// SystemUtils.js - Utility functions for system operations

/**
 * Generate a system status report with ASCII bars
 * @returns {string} Formatted system status report
 */
export const generateSystemStatus = () => {
    // Generate fake system metrics
    const cpu = Math.floor(Math.random() * 80) + 10;
    const memory = Math.floor(Math.random() * 70) + 20;
    const disk = Math.floor(Math.random() * 60) + 30;
    const network = Math.floor(Math.random() * 90) + 5;

    // Generate ASCII bars
    const generateBar = (value, width = 20) => {
        const filled = Math.round((value / 100) * width);
        const empty = width - filled;
        return `[${'='.repeat(filled)}${' '.repeat(empty)}] ${value}%`;
    };

    // Format date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();

    return `=== SYSTEM STATUS ===\n` +
        `Date: ${dateStr}\n` +
        `Time: ${timeStr}\n` +
        `\n` +
        `CPU Usage:     ${generateBar(cpu)}\n` +
        `Memory Usage:  ${generateBar(memory)}\n` +
        `Disk Usage:    ${generateBar(disk)}\n` +
        `Network Load:  ${generateBar(network)}\n` +
        `\n` +
        `System Status: ${cpu > 90 ? 'CRITICAL' : cpu > 70 ? 'WARNING' : 'NORMAL'}\n` +
        `Processes Running: ${Math.floor(Math.random() * 100) + 50}\n` +
        `Last Boot: ${Math.floor(Math.random() * 48) + 1} hours ago`;
};

/**
 * Format current date and time in various formats
 * @param {string} format - Output format (default: 'default')
 * @returns {string} Formatted date/time
 */
export const getFormattedDateTime = (format = 'default') => {
    const now = new Date();

    switch(format) {
        case 'date':
            return now.toLocaleDateString();
        case 'time':
            return now.toLocaleTimeString();
        case 'iso':
            return now.toISOString();
        case 'unix':
            return Math.floor(now.getTime() / 1000).toString();
        case 'verbose':
            return now.toLocaleString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        default:
            return now.toString();
    }
};

/**
 * Get random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};