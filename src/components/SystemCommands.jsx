// SystemCommands.js - Core system commands
import { getAvailableCommands } from './CommandHandler';
import { USERNAME } from '../constants/TerminalConstants';

/**
 * Basic shell commands
 */
const SystemCommands = {
    // Available system commands
    commands: {
        'help': 'Display available commands',
        'clear': 'Clear terminal screen',
        'echo': 'Display a message',
        'date': 'Display current date and time',
        'whoami': 'Display current user',
        'exit': 'Close the terminal',
        'history': 'Show command history',
        'alias': 'Create command aliases',
        'theme': 'Change terminal color theme'
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
     * Execute a system command
     * @param {string} command - Command to execute
     * @param {Array} args - Command arguments
     * @param {object} terminalState - Current terminal state
     */
    executeCommand(command, args, terminalState) {
        const {
            history,
            setHistory,
            commandHistory,
            aliases,
            setAliases,
            terminalTheme,
            setTerminalTheme
        } = terminalState;

        switch (command) {
            case 'help':
                this.displayHelp(history, setHistory);
                break;
            case 'clear':
                this.clearTerminal(setHistory);
                break;
            case 'echo':
                this.echoMessage(args, history, setHistory);
                break;
            case 'date':
                this.displayDate(history, setHistory);
                break;
            case 'whoami':
                this.displayUsername(history, setHistory);
                break;
            case 'exit':
                this.exitTerminal(history, setHistory);
                break;
            case 'history':
                this.showHistory(commandHistory, history, setHistory);
                break;
            case 'alias':
                this.manageAliases(args, aliases, setAliases, history, setHistory);
                break;
            case 'theme':
                this.changeTheme(args, terminalTheme, setTerminalTheme, history, setHistory);
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
     * Display help information
     */
    displayHelp(history, setHistory) {
        // Get all commands from all modules
        const allCommands = getAvailableCommands();

        const helpText = 'Available commands:\n' +
            Object.entries(allCommands)
                .map(([cmd, desc]) => `  ${cmd.padEnd(20)} - ${desc}`)
                .join('\n');

        setHistory([
            ...history,
            { type: 'output', text: helpText }
        ]);
    },

    /**
     * Clear terminal
     */
    clearTerminal(setHistory) {
        // Reset the terminal history
        setTimeout(() => {
            setHistory([
                { type: 'output', text: 'Terminal cleared.' }
            ]);

            // Optional: Remove the welcome message after a brief delay
            setTimeout(() => {
                setHistory([]);
            }, 500);
        }, 10);
    },

    /**
     * Echo a message
     */
    echoMessage(args, history, setHistory) {
        setHistory([
            ...history,
            { type: 'output', text: args.join(' ') }
        ]);
    },

    /**
     * Display current date and time
     */
    displayDate(history, setHistory) {
        setHistory([
            ...history,
            { type: 'output', text: new Date().toString() }
        ]);
    },

    /**
     * Display current username
     */
    displayUsername(history, setHistory) {
        setHistory([
            ...history,
            { type: 'output', text: USERNAME }
        ]);
    },

    /**
     * Exit terminal (simulated)
     */
    exitTerminal(history, setHistory) {
        setHistory([
            ...history,
            { type: 'output', text: 'Terminal session closed' }
        ]);

        // Note: In a real implementation, this might trigger terminal minimization
        // or other UI changes, but that would be handled by the parent component
    },

    /**
     * Show command history
     */
    showHistory(commandHistory, history, setHistory) {
        if (commandHistory.length === 0) {
            setHistory([
                ...history,
                { type: 'output', text: 'No command history' }
            ]);
            return;
        }

        const now = new Date();
        const historyWithTimestamps = commandHistory.map((cmd, index) => {
            // Generate fake timestamps (older commands have older timestamps)
            const cmdTime = new Date(now - (commandHistory.length - index) * 60000);
            const timeStr = cmdTime.toLocaleTimeString();
            return `${index + 1}  ${timeStr}  ${cmd}`;
        }).join('\n');

        setHistory([
            ...history,
            { type: 'output', text: historyWithTimestamps }
        ]);
    },

    /**
     * Manage command aliases
     */
    manageAliases(args, aliases, setAliases, history, setHistory) {
        if (args.length === 0) {
            // Display all aliases
            if (Object.keys(aliases).length === 0) {
                setHistory([
                    ...history,
                    { type: 'output', text: 'No aliases defined\nUsage: alias [name]="[command]"' }
                ]);
                return;
            }

            const aliasList = Object.entries(aliases)
                .map(([name, cmd]) => `${name}="${cmd}"`)
                .join('\n');

            setHistory([
                ...history,
                { type: 'output', text: `Defined aliases:\n${aliasList}` }
            ]);
            return;
        }

        // Parse alias definition
        const aliasString = args.join(' ');
        const aliasMatch = aliasString.match(/^(\w+)="(.+)"$/);

        if (aliasMatch) {
            const [, name, cmd] = aliasMatch;
            setAliases({
                ...aliases,
                [name]: cmd
            });

            setHistory([
                ...history,
                { type: 'output', text: `Alias created: ${name}="${cmd}"` }
            ]);
        } else {
            setHistory([
                ...history,
                { type: 'error', text: 'Invalid alias format\nUsage: alias [name]="[command]"' }
            ]);
        }
    },

    /**
     * Change terminal theme
     */
    changeTheme(args, terminalTheme, setTerminalTheme, history, setHistory) {
        // Helper to get theme color
        const getThemeColor = (theme) => {
            const themeColors = {
                'green': '#33ff33',
                'amber': '#ffb000',
                'blue': '#00aaff',
                'purple': '#aa00ff',
                'white': '#ffffff',
                'red': '#ff3333'
            };
            return themeColors[theme] || themeColors.green;
        };

        if (args.length === 0) {
            setHistory([
                ...history,
                { type: 'output', text: 'Available themes: green, amber, blue, purple, white, red\nUsage: theme [color]' }
            ]);
            return;
        }

        const newTheme = args[0].toLowerCase();
        const validThemes = ['green', 'amber', 'blue', 'purple', 'white', 'red'];

        if (validThemes.includes(newTheme)) {
            setTerminalTheme(newTheme);
            setHistory([
                ...history,
                { type: 'output', text: `Terminal theme changed to ${newTheme}` }
            ]);

            // Apply theme change using CSS variables
            document.documentElement.style.setProperty('--text-color', getThemeColor(newTheme));
        } else {
            setHistory([
                ...history,
                { type: 'error', text: `Unknown theme: ${args[0]}\nAvailable themes: green, amber, blue, purple, white, red` }
            ]);
        }
    }
};

export default SystemCommands;