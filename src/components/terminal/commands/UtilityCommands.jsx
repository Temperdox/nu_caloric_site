// UtilityCommands.js - Utility and fun terminal commands
import { generateSystemStatus } from '../utils/SystemUtils';
import { getRandomFortune } from '../utils/FortuneUtils';
import { generateWeatherForecast } from '../utils/WeatherUtils';
import { generateASCIICalendar } from '../utils/CalendarUtils';

/**
 * Utility and fun terminal commands
 */
const UtilityCommands = {
    // Available utility commands
    commands: {
        'status': 'Show system resource usage with ASCII bars',
        'fortune': 'Display random quotes',
        'weather': 'Show ASCII art weather forecast',
        'calendar': 'Display an ASCII calendar',
    },

    /**
     * Check if a command is handled by this module
     * @param {string} command - Command to check
     * @returns {boolean} True if command is handled
     */
    hasCommand(command) {
        return Object.keys(this.commands).includes(command);
    },

    /**
     * Get list of commands and descriptions
     * @returns {object} Command descriptions
     */
    getCommands() {
        return this.commands;
    },

    /**
     * Execute a utility command
     * @param {string} command - Command to execute
     * @param {Array} args - Command arguments
     * @param {object} terminalState - Current terminal state
     */
    executeCommand(command, args, terminalState) {
        const { history, setHistory } = terminalState;

        switch (command) {
            case 'status':
                this.showSystemStatus(history, setHistory);
                break;
            case 'fortune':
                this.showFortune(history, setHistory);
                break;
            case 'weather':
                this.showWeather(args, history, setHistory);
                break;
            case 'calendar':
                this.showCalendar(history, setHistory);
                break;
            default:
                // This shouldn't happen because of hasCommand check
                setHistory([
                    ...history,
                    { type: 'error', text: `${command}: command not implemented` }
                ]);
        }
    },

    /**
     * Display system status with ASCII bars
     */
    showSystemStatus(history, setHistory) {
        setHistory([
            ...history,
            { type: 'output', text: generateSystemStatus() }
        ]);
    },

    /**
     * Display a random fortune
     */
    showFortune(history, setHistory) {
        setHistory([
            ...history,
            { type: 'output', text: getRandomFortune() }
        ]);
    },

    /**
     * Show ASCII art weather forecast
     */
    showWeather(args, history, setHistory) {
        const location = args.length > 0 ? args.join(' ') : 'current location';

        setHistory([
            ...history,
            { type: 'output', text: generateWeatherForecast(location) }
        ]);
    },

    /**
     * Show ASCII calendar
     */
    showCalendar(history, setHistory) {
        setHistory([
            ...history,
            { type: 'output', text: generateASCIICalendar() }
        ]);
    }
};

export default UtilityCommands;