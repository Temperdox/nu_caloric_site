// FileSystemCommands.js - Contains all file system related commands
import React from 'react';
import { resolvePath, getObjectAtPath, isDirectory, pathExists } from '../utils/FileSystemUtils';
import BurgerAnimation from '../animations/BurgerAnimation';

/**
 * Commands for interacting with the virtual file system
 */
const FileSystemCommands = {
    // Available file system commands
    commands: {
        'ls': 'List directory contents',
        'cd': 'Change directory',
        'pwd': 'Print working directory',
        'cat': 'Display file contents',
        'nano': 'Open file or app in editor'
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
     * Execute a file system command
     * @param {string} command - Command to execute
     * @param {Array} args - Command arguments
     * @param {object} terminalState - Current terminal state
     */
    executeCommand(command, args, terminalState) {
        const {
            currentDirectory,
            setCurrentDirectory,
            history,
            setHistory,
            onNavigate,
            addToHistory,
            setBurgerMode,
            setBurgerCompleted,
            stopBurgerAnimation
        } = terminalState;

        switch (command) {
            case 'ls':
                this.listDirectory(args, currentDirectory, history, setHistory);
                break;
            case 'cd':
                this.changeDirectory(args, currentDirectory, setCurrentDirectory, history, setHistory);
                break;
            case 'pwd':
                this.printWorkingDirectory(currentDirectory, history, setHistory);
                break;
            case 'cat':
                this.displayFile(
                    args,
                    currentDirectory,
                    history,
                    setHistory,
                    onNavigate,
                    addToHistory,
                    setBurgerMode,
                    setBurgerCompleted,
                    stopBurgerAnimation
                );
                break;
            case 'nano':
                this.editFile(args, currentDirectory, history, setHistory, onNavigate);
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
     * List directory contents
     */
    listDirectory(args, currentDirectory, history, setHistory) {
        const targetDir = args.length > 0 ? resolvePath(args[0], currentDirectory) : currentDirectory;
        const dirObject = getObjectAtPath(targetDir);

        if (!dirObject || dirObject.type !== 'directory') {
            setHistory([
                ...history,
                { type: 'error', text: `ls: cannot access '${args[0]}': No such directory` }
            ]);
            return;
        }

        const fileList = Object.entries(dirObject.children)
            .map(([name, obj]) => {
                if (obj.type === 'directory') {
                    return `<span class="terminal-directory">${name}/</span>`;
                } else if (obj.type === 'file') {
                    return `<span class="terminal-file">${name}</span>`;
                } else if (obj.type === 'app') {
                    return `<span class="terminal-app">${name}*</span>`;
                } else {
                    return name;
                }
            })
            .join('  ');

        setHistory([
            ...history,
            { type: 'output', text: fileList.length > 0 ? fileList : '(empty directory)' }
        ]);
    },

    /**
     * Change current directory
     */
    changeDirectory(args, currentDirectory, setCurrentDirectory, history, setHistory) {
        const newPath = resolvePath(args[0] || '/home/user', currentDirectory);

        if (!pathExists(newPath)) {
            setHistory([
                ...history,
                { type: 'error', text: `cd: no such directory: ${args[0]}` }
            ]);
            return;
        }

        if (!isDirectory(newPath)) {
            setHistory([
                ...history,
                { type: 'error', text: `cd: not a directory: ${args[0]}` }
            ]);
            return;
        }

        setCurrentDirectory(newPath);
    },

    /**
     * Print current working directory
     */
    printWorkingDirectory(currentDirectory, history, setHistory) {
        setHistory([
            ...history,
            { type: 'output', text: currentDirectory }
        ]);
    },

    /**
     * Display file contents
     */
    displayFile(
        args,
        currentDirectory,
        history,
        setHistory,
        onNavigate,
        addToHistory,
        setBurgerMode,
        setBurgerCompleted,
        stopBurgerAnimation
    ) {
        if (args.length === 0) {
            setHistory([
                ...history,
                { type: 'error', text: 'cat: missing file operand' }
            ]);
            return;
        }

        // Handle special Easter egg for burger animation
        if (args[0] === 'on_burger') {
            // Trigger burger animation instead of treating as a file
            setBurgerMode(true);
            setBurgerCompleted(false);

            // Only add descriptive text, the animation will be rendered elsewhere
            addToHistory({
                type: 'component',
                text: <BurgerAnimation
                    onExit={stopBurgerAnimation}
                    setBurgerCompleted={setBurgerCompleted}
                />
            });
            return;
        }

        // Handle special case for cat mida (easter egg)
        if (args[0] === 'mida') {
            setHistory([
                ...history,
                { type: 'output', text: '🫃 Male Pregnancy Emoji Activated!' }
            ]);
            return;
        }

        if (args[0] === 'burger_is_cool') {
            console.log("BURGER MODE ACTIVATED");

            // Set a flag in localStorage
            localStorage.setItem('burger_mode_active', 'true');

            // Clear the terminal
            setHistory([]);

            // Add a message indicating reload
            setHistory([
                ...history,
                { type: 'output', text: 'Activating burger mode... Please wait...' }
            ]);

            // Reload the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1000);

            return;
        }

        const filePath = resolvePath(args[0], currentDirectory);
        const fileObject = getObjectAtPath(filePath);

        if (!fileObject) {
            setHistory([
                ...history,
                { type: 'error', text: `cat: ${args[0]}: No such file or directory` }
            ]);
            return;
        }

        if (fileObject.type === 'directory') {
            setHistory([
                ...history,
                { type: 'error', text: `cat: ${args[0]}: Is a directory` }
            ]);
            return;
        }

        if (fileObject.type === 'app') {
            if (fileObject.component) {
                if (onNavigate) {
                    onNavigate(fileObject.scene, fileObject.tab, fileObject.component);
                    setHistory([
                        ...history,
                        { type: 'output', text: `Opening component: ${args[0]}` }
                    ]);
                } else {
                    setHistory([
                        ...history,
                        { type: 'error', text: `cat: ${args[0]}: Cannot display component` }
                    ]);
                }
            } else if (onNavigate) {
                onNavigate(fileObject.scene, fileObject.tab);
                setHistory([
                    ...history,
                    { type: 'output', text: `Opening application: ${args[0]}` }
                ]);
            } else {
                setHistory([
                    ...history,
                    { type: 'error', text: `cat: ${args[0]}: Cannot display application` }
                ]);
            }
            return;
        }

        if (fileObject.type === 'file') {
            setHistory([
                ...history,
                { type: 'output', text: fileObject.content }
            ]);
            return;
        }

        setHistory([
            ...history,
            { type: 'error', text: `cat: ${args[0]}: Unknown file type` }
        ]);
    },

    /**
     * Edit a file (simulated)
     */
    editFile(args, currentDirectory, history, setHistory, onNavigate) {
        if (args.length === 0) {
            setHistory([
                ...history,
                { type: 'error', text: 'nano: missing file operand' }
            ]);
            return;
        }

        const nanoPath = resolvePath(args[0], currentDirectory);
        const nanoObject = getObjectAtPath(nanoPath);

        if (!nanoObject) {
            setHistory([
                ...history,
                { type: 'output', text: `Creating new file: ${args[0]}` }
            ]);
            return;
        }

        if (nanoObject.type === 'directory') {
            setHistory([
                ...history,
                { type: 'error', text: `nano: ${args[0]}: Is a directory` }
            ]);
            return;
        }

        if (nanoObject.type === 'app') {
            if (nanoObject.component) {
                if (onNavigate) {
                    onNavigate(nanoObject.scene, nanoObject.tab, nanoObject.component);
                    setHistory([
                        ...history,
                        { type: 'output', text: `Opening component: ${args[0]}` }
                    ]);
                } else {
                    setHistory([
                        ...history,
                        { type: 'error', text: `nano: ${args[0]}: Cannot edit component` }
                    ]);
                }
            } else if (onNavigate) {
                onNavigate(nanoObject.scene, nanoObject.tab);
                setHistory([
                    ...history,
                    { type: 'output', text: `Opening application: ${args[0]}` }
                ]);
            } else {
                setHistory([
                    ...history,
                    { type: 'error', text: `nano: ${args[0]}: Cannot edit application` }
                ]);
            }
            return;
        }

        if (nanoObject.type === 'file') {
            setHistory([
                ...history,
                { type: 'output', text: `Opening file in editor: ${args[0]}` },
                { type: 'output', text: nanoObject.content },
                { type: 'output', text: '[Nano editor simulation - read only mode]' }
            ]);
            return;
        }

        setHistory([
            ...history,
            { type: 'error', text: `nano: ${args[0]}: Unknown file type` }
        ]);
    }
};

export default FileSystemCommands;