import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import BurgerAnimation from './BurgerAnimation';

// Terminal history item component
const HistoryItem = memo(({ type, text }) => {
    // Use a lookup object for different history item types
    const contentMap = {
        'command': <div className="terminal-history-command">{text}</div>,
        'output': <div className="terminal-history-output">
            {typeof text === 'string' && text.includes('<span')
                ? <div dangerouslySetInnerHTML={{ __html: text }} />
                : text}
        </div>,
        'error': <div className="terminal-history-error">{text}</div>,
        'component': <div className="terminal-component">{text}</div>
    };

    return contentMap[type] || null;
});

HistoryItem.displayName = 'HistoryItem';

// Main Terminal Component
const TerminalConsole = ({ onNavigate }) => {
    // Grouped related state together
    const [terminalState, setTerminalState] = useState({
        input: '',
        currentDirectory: '/home/user',
        historyIndex: -1,
        showCompletion: false,
        completionIndex: 0,
        burgerMode: false
    });

    // Keep history and command history separate as they change often
    const [history, setHistory] = useState([
        { type: 'output', text: 'NuCaloric Terminal v3.2.1 - Type "help" for available commands' },
        { type: 'output', text: 'Welcome, admin@nucaloric!' }
    ]);
    const [commandHistory, setCommandHistory] = useState([]);
    const [completions, setCompletions] = useState([]);

    const inputRef = useRef(null);
    const terminalRef = useRef(null);

    // Constants for terminal
    const USERNAME = 'admin';
    const HOSTNAME = 'nucaloric';
    const INITIAL_DIRECTORY = '/home/user';

    // Update terminal state with less re-renders
    const updateTerminalState = useCallback((updates) => {
        setTerminalState(prev => ({
            ...prev,
            ...updates
        }));
    }, []);

    // Keep terminal scrolled to bottom
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    // Focus on input when terminal is clicked
    const focusInput = useCallback(() => {
        if (inputRef.current && !terminalState.burgerMode) {
            inputRef.current.focus();
        }
    }, [terminalState.burgerMode]);

    // Path utilities
    const resolvePath = useCallback((path) => {
        // If absolute path, return it directly
        if (path.startsWith('/')) {
            return path;
        }

        // Handle special cases
        if (path === '.') {
            return terminalState.currentDirectory;
        }

        // Handle empty input (cd with no args)
        if (!path) {
            return INITIAL_DIRECTORY;
        }

        const currentParts = terminalState.currentDirectory.split('/').filter(Boolean);
        const pathParts = path.split('/').filter(Boolean);

        let resultParts = [...currentParts];

        for (const part of pathParts) {
            if (part === '..') {
                if (resultParts.length > 0) {
                    resultParts.pop();
                }
            } else if (part !== '.') {
                resultParts.push(part);
            }
        }

        return '/' + resultParts.join('/');
    }, [terminalState.currentDirectory]);

    // Memoize fileSystem data structure to prevent recreation
    const fileSystem = useMemo(() => ({
        '/': {
            type: 'directory',
            children: {
                'home': {
                    type: 'directory',
                    children: {
                        'user': {
                            type: 'directory',
                            children: {
                                'documents': {
                                    type: 'directory',
                                    children: {
                                        'report.txt': {
                                            type: 'file',
                                            content: 'NuCaloric System Report - Version 3.2.1\n\nSystem Status: Operational\nLast Maintenance: 2025-03-15\nNext Scheduled Check: 2025-04-30\n\nAlert Level: Normal\nSecurity Protocols: Active'
                                        },
                                        'notes.txt': {
                                            type: 'file',
                                            content: 'Remember to check the security logs weekly.\nBackup schedule changed to Tuesdays at 2am.'
                                        }
                                    }
                                },
                                'sites': {
                                    type: 'directory',
                                    children: {
                                        'dashboard': {
                                            type: 'directory',
                                            children: {
                                                'main': { type: 'app', scene: 'main' },
                                                'modern': { type: 'app', scene: 'modernMain' }
                                            }
                                        },
                                        'profile': {
                                            type: 'directory',
                                            children: {
                                                'user': { type: 'app', scene: 'main', tab: 'profile' }
                                            }
                                        },
                                        'login': { type: 'app', scene: 'login' },
                                        'boot': { type: 'app', scene: 'bootup' }
                                    }
                                },
                                'system': {
                                    type: 'directory',
                                    children: {
                                        'logs': {
                                            type: 'directory',
                                            children: {
                                                'system.log': {
                                                    type: 'file',
                                                    content: '2025-04-16 08:32:14 INFO: System startup completed\n2025-04-16 08:35:22 INFO: User login: admin\n2025-04-16 09:12:45 WARNING: High CPU usage detected\n2025-04-16 09:15:33 INFO: CPU usage returned to normal\n2025-04-16 10:22:18 INFO: Backup started\n2025-04-16 10:45:02 INFO: Backup completed successfully'
                                                },
                                                'security.log': {
                                                    type: 'file',
                                                    content: '2025-04-15 23:42:18 WARNING: Failed login attempt: username "root"\n2025-04-16 02:15:33 WARNING: Unusual access pattern detected\n2025-04-16 02:16:45 INFO: Security countermeasures activated\n2025-04-16 02:17:12 INFO: Threat contained\n2025-04-16 08:35:22 INFO: Admin login successful'
                                                }
                                            }
                                        },
                                        'config': {
                                            type: 'directory',
                                            children: {
                                                'network.conf': {
                                                    type: 'file',
                                                    content: '# Network Configuration\nDNS=192.168.1.1\nGATEWAY=192.168.1.1\nIP_MODE=DHCP\n\n# Security Settings\nFIREWALL=ENABLED\nINTRUSION_DETECTION=ACTIVE\nPORT_SCANNING_PROTECTION=TRUE'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                'bin': {
                    type: 'directory',
                    children: {
                        'ls': { type: 'system' },
                        'cd': { type: 'system' },
                        'pwd': { type: 'system' },
                        'cat': { type: 'system' },
                        'nano': { type: 'system' },
                        'help': { type: 'system' },
                        'clear': { type: 'system' },
                        'echo': { type: 'system' },
                        'date': { type: 'system' },
                        'whoami': { type: 'system' }
                    }
                }
            }
        }
    }), []);

    // Memoize command help object
    const commandHelp = useMemo(() => ({
        'ls': 'List directory contents',
        'cd': 'Change directory',
        'pwd': 'Print working directory',
        'cat': 'Display file contents',
        'nano': 'Open file or app in editor',
        'help': 'Display available commands',
        'clear': 'Clear terminal screen',
        'echo': 'Display a message',
        'date': 'Display current date and time',
        'whoami': 'Display current user',
        'exit': 'Close the terminal'
    }), []);

    // Check if path exists
    const pathExists = useCallback((path) => {
        const resolvedPath = resolvePath(path);
        const pathParts = resolvedPath.split('/').filter(Boolean);
        let current = fileSystem['/'];

        for (const part of pathParts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return false;
            }
        }

        return true;
    }, [resolvePath, fileSystem]);

    // Check if path is a directory
    const isDirectory = useCallback((path) => {
        const resolvedPath = resolvePath(path);
        const pathParts = resolvedPath.split('/').filter(Boolean);
        let current = fileSystem['/'];

        for (const part of pathParts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return false;
            }
        }

        return current.type === 'directory';
    }, [resolvePath, fileSystem]);

    // Get object at path
    const getObjectAtPath = useCallback((path) => {
        const resolvedPath = resolvePath(path);
        const pathParts = resolvedPath.split('/').filter(Boolean);
        let current = fileSystem['/'];

        for (const part of pathParts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }

        return current;
    }, [resolvePath, fileSystem]);

    // Generate tab completions for current input
    const generateCompletions = useCallback(() => {
        const { input, currentDirectory } = terminalState;
        const words = input.split(' ');
        const lastWord = words[words.length - 1];

        // Command completion (first word)
        if (words.length === 1) {
            return Object.keys(commandHelp).filter(cmd =>
                cmd.startsWith(lastWord)
            );
        }

        // Path completion (for commands that take paths)
        const command = words[0];
        if (['cd', 'ls', 'cat', 'nano'].includes(command)) {
            const dirPath = lastWord.includes('/')
                ? lastWord.substring(0, lastWord.lastIndexOf('/') + 1)
                : '';

            const dirToCheck = dirPath
                ? resolvePath(dirPath)
                : currentDirectory;

            const filePrefix = lastWord.includes('/')
                ? lastWord.substring(lastWord.lastIndexOf('/') + 1)
                : lastWord;

            // Get directory contents for completion
            const dir = getObjectAtPath(dirToCheck);
            if (dir && dir.type === 'directory' && dir.children) {
                const possiblePaths = Object.keys(dir.children).filter(name =>
                    name.startsWith(filePrefix)
                );

                // Add trailing slash to directories
                return possiblePaths.map(name => {
                    const path = dirPath + name;
                    const fullPath = resolvePath(dirPath + name);
                    const obj = getObjectAtPath(fullPath);
                    return path + (obj && obj.type === 'directory' ? '/' : '');
                });
            }
        }

        return [];
    }, [terminalState, commandHelp, resolvePath, getObjectAtPath]);

    // Handle tab completion
    const handleTabCompletion = useCallback(() => {
        if (terminalState.burgerMode) return; // Disable in burger mode

        const completionOptions = generateCompletions();

        if (completionOptions.length === 1) {
            // Only one option, complete directly
            const words = terminalState.input.split(' ');
            words[words.length - 1] = completionOptions[0];
            updateTerminalState({
                input: words.join(' '),
                showCompletion: false
            });
        } else if (completionOptions.length > 1) {
            // Multiple options, show completion list
            setCompletions(completionOptions);
            updateTerminalState({
                completionIndex: 0,
                showCompletion: true
            });
        }
    }, [terminalState, generateCompletions, updateTerminalState]);

    // Select a completion option
    const selectCompletion = useCallback((index) => {
        if (completions.length === 0) return;

        const words = terminalState.input.split(' ');
        words[words.length - 1] = completions[index];
        updateTerminalState({
            input: words.join(' '),
            showCompletion: false
        });
    }, [terminalState.input, completions, updateTerminalState]);

    // Handle burger animation stop
    const stopBurgerAnimation = useCallback(() => {
        updateTerminalState({ burgerMode: false });
        setHistory(prev => [...prev, { type: 'output', text: 'Animation stopped.' }]);
    }, [updateTerminalState]);

    // Handle command execution - this is a critical performance function
    const executeCommand = useCallback((commandLine) => {
        const { burgerMode, currentDirectory } = terminalState;

        // Skip if in burger mode
        if (burgerMode && commandLine !== 'clear') {
            return;
        }

        // Add command to history
        const newCommand = {
            type: 'command',
            text: `${USERNAME}@${HOSTNAME}:${currentDirectory}$ ${commandLine}`
        };
        const historyWithCommand = [...history, newCommand];
        setHistory(historyWithCommand);

        // Add to command history for up/down navigation
        setCommandHistory(prev => [...prev, commandLine]);
        updateTerminalState({ historyIndex: -1 });

        // Parse command and arguments
        const args = commandLine.split(' ');
        const command = args[0].toLowerCase();
        args.shift(); // Remove command from args

        // Execute command
        let outputItems = [];

        // Check for hidden commands first
        if (command === 'nano' && args[0] === 'on_burger') {
            // Execute burger animation
            updateTerminalState({ burgerMode: true });
            outputItems.push({
                type: 'component',
                text: <BurgerAnimation onExit={stopBurgerAnimation} />
            });

            setHistory([...historyWithCommand, ...outputItems]);
            updateTerminalState({ input: '' });
            return;
        }

        // Command execution logic
        switch (command) {
            case 'help': {
                outputItems.push({
                    type: 'output',
                    text: 'Available commands:\n' +
                        Object.entries(commandHelp)
                            .map(([cmd, desc]) => `  ${cmd.padEnd(10)} - ${desc}`)
                            .join('\n')
                });
                break;
            }

            case 'ls': {
                const targetDir = args.length > 0 ? resolvePath(args[0]) : currentDirectory;
                const dirObject = getObjectAtPath(targetDir);

                if (!dirObject || dirObject.type !== 'directory') {
                    outputItems.push({ type: 'error', text: `ls: cannot access '${args[0]}': No such directory` });
                } else {
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

                    outputItems.push({
                        type: 'output',
                        text: fileList.length > 0 ? fileList : '(empty directory)'
                    });
                }
                break;
            }

            case 'cd': {
                const newPath = resolvePath(args[0] || '');

                if (!pathExists(newPath)) {
                    outputItems.push({ type: 'error', text: `cd: no such directory: ${args[0]}` });
                } else if (!isDirectory(newPath)) {
                    outputItems.push({ type: 'error', text: `cd: not a directory: ${args[0]}` });
                } else {
                    updateTerminalState({ currentDirectory: newPath });
                }
                break;
            }

            case 'pwd': {
                outputItems.push({ type: 'output', text: currentDirectory });
                break;
            }

            case 'cat': {
                if (args.length === 0) {
                    outputItems.push({ type: 'error', text: 'cat: missing file operand' });
                    break;
                }

                const filePath = resolvePath(args[0]);
                const fileObject = getObjectAtPath(filePath);

                if (!fileObject) {
                    outputItems.push({ type: 'error', text: `cat: ${args[0]}: No such file or directory` });
                } else if (fileObject.type === 'directory') {
                    outputItems.push({ type: 'error', text: `cat: ${args[0]}: Is a directory` });
                } else if (fileObject.type === 'app') {
                    if (onNavigate) {
                        onNavigate(fileObject.scene, fileObject.tab);
                        outputItems.push({ type: 'output', text: `Opening application: ${args[0]}` });
                    } else {
                        outputItems.push({ type: 'error', text: `cat: ${args[0]}: Cannot display application` });
                    }
                } else if (fileObject.type === 'file') {
                    outputItems.push({ type: 'output', text: fileObject.content });
                } else {
                    outputItems.push({ type: 'error', text: `cat: ${args[0]}: Unknown file type` });
                }
                break;
            }

            case 'nano': {
                if (args.length === 0) {
                    outputItems.push({ type: 'error', text: 'nano: missing file operand' });
                    break;
                }

                const nanoPath = resolvePath(args[0]);
                const nanoObject = getObjectAtPath(nanoPath);

                if (!nanoObject) {
                    outputItems.push({ type: 'output', text: `Creating new file: ${args[0]}` });
                } else if (nanoObject.type === 'directory') {
                    outputItems.push({ type: 'error', text: `nano: ${args[0]}: Is a directory` });
                } else if (nanoObject.type === 'app') {
                    if (onNavigate) {
                        onNavigate(nanoObject.scene, nanoObject.tab);
                        outputItems.push({ type: 'output', text: `Opening application: ${args[0]}` });
                    } else {
                        outputItems.push({ type: 'error', text: `nano: ${args[0]}: Cannot edit application` });
                    }
                } else if (nanoObject.type === 'file') {
                    outputItems.push({ type: 'output', text: `Opening file in editor: ${args[0]}` });
                    outputItems.push({ type: 'output', text: nanoObject.content });
                    outputItems.push({ type: 'output', text: '[Nano editor simulation - read only mode]' });
                }
                break;
            }

            case 'clear':
                setHistory([]);
                if (terminalState.burgerMode) {
                    updateTerminalState({ burgerMode: false });
                }
                break;

            case 'echo': {
                outputItems.push({ type: 'output', text: args.join(' ') });
                break;
            }

            case 'date': {
                outputItems.push({ type: 'output', text: new Date().toString() });
                break;
            }

            case 'whoami': {
                outputItems.push({ type: 'output', text: USERNAME });
                break;
            }

            case 'exit': {
                outputItems.push({ type: 'output', text: 'Terminal session closed' });
                break;
            }

            case '':
                // Empty command, just add a new line
                break;

            default:
                outputItems.push({ type: 'error', text: `${command}: command not found` });
        }

        // Update history with command output
        setHistory([...historyWithCommand, ...outputItems]);
        updateTerminalState({ input: '' });

        // Execute special commands
        if (command === 'exit') {
            // Handle exit command - could minimize the terminal
        }
    }, [
        terminalState,
        history,
        resolvePath,
        pathExists,
        isDirectory,
        getObjectAtPath,
        onNavigate,
        stopBurgerAnimation,
        updateTerminalState,
        commandHelp
    ]);

    // Handle input changes
    const handleInputChange = useCallback((e) => {
        if (terminalState.burgerMode) return; // Disable in burger mode

        updateTerminalState({
            input: e.target.value,
            showCompletion: false
        });
    }, [terminalState.burgerMode, updateTerminalState]);

    // Handle key presses in input field
    const handleKeyDown = useCallback((e) => {
        const {
            burgerMode,
            showCompletion,
            completionIndex,
            historyIndex,
            input
        } = terminalState;

        // In burger mode, only handle Ctrl+C/Cmd+C
        if (burgerMode) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                stopBurgerAnimation();
            }
            return;
        }

        // Handle Tab key for completion
        if (e.key === 'Tab') {
            e.preventDefault();
            if (showCompletion && completions.length > 0) {
                // Cycle through completion options
                const newIndex = (completionIndex + 1) % completions.length;
                updateTerminalState({ completionIndex: newIndex });
            } else {
                // Generate new completions
                handleTabCompletion();
            }
            return;
        }

        // Handle Enter key to execute command
        if (e.key === 'Enter') {
            if (showCompletion && completions.length > 0) {
                // Apply current completion
                selectCompletion(completionIndex);
            } else {
                // Execute command
                executeCommand(input);
            }
            return;
        }

        // Handle Escape key to cancel completion
        if (e.key === 'Escape') {
            updateTerminalState({ showCompletion: false });
            return;
        }

        // Handle Up/Down arrows for command history
        if (e.key === 'ArrowUp') {
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                updateTerminalState({
                    historyIndex: newIndex,
                    input: commandHistory[commandHistory.length - 1 - newIndex],
                    showCompletion: false
                });
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                updateTerminalState({
                    historyIndex: newIndex,
                    input: commandHistory[commandHistory.length - 1 - newIndex],
                    showCompletion: false
                });
            } else if (historyIndex === 0) {
                updateTerminalState({
                    historyIndex: -1,
                    input: '',
                    showCompletion: false
                });
            } else {
                updateTerminalState({ showCompletion: false });
            }
            return;
        }

        // Close completion on any other key
        if (showCompletion) {
            updateTerminalState({ showCompletion: false });
        }
    }, [
        terminalState,
        commandHistory,
        completions,
        executeCommand,
        handleTabCompletion,
        selectCompletion,
        stopBurgerAnimation,
        updateTerminalState
    ]);

    // Render only what's needed based on current state
    return (
        <div className="terminal-content-area" ref={terminalRef} onClick={focusInput}>
            {history.map((item, index) => (
                <HistoryItem
                    key={index}
                    type={item.type}
                    text={item.text}
                />
            ))}

            {!terminalState.burgerMode && (
                <div className="terminal-input-line">
                    <span className="terminal-prompt">
                        {`${USERNAME}@${HOSTNAME}:${terminalState.currentDirectory}$ `}
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="terminal-input"
                        value={terminalState.input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                </div>
            )}

            {terminalState.showCompletion && completions.length > 0 && !terminalState.burgerMode && (
                <div className="terminal-completion">
                    {completions.map((completion, index) => (
                        <div
                            key={completion}
                            className={`terminal-completion-item ${index === terminalState.completionIndex ? 'active' : ''}`}
                            onClick={() => selectCompletion(index)}
                        >
                            {completion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default memo(TerminalConsole);