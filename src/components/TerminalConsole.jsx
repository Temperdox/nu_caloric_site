// TerminalConsole.jsx - Updated with hidden burger command
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import BurgerAnimation from './BurgerAnimation';

// Terminal history and commands data structure
const INITIAL_DIRECTORY = '/home/user';
const USERNAME = 'admin';
const HOSTNAME = 'nucaloric';

// File system structure - used for navigation and autocomplete
const fileSystem = {
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
                                    'directory': {
                                        type: 'app',
                                        scene: 'main',
                                        component: 'siteDirectory'  // This allows direct access to directory
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
};

// Available commands with their descriptions
const commandHelp = {
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
};

// Terminal history item component
const HistoryItem = memo(({ type, text }) => {
    if (type === 'command') {
        return <div className="terminal-history-command">{text}</div>;
    } else if (type === 'output') {
        return <div className="terminal-history-output">{text}</div>;
    } else if (type === 'error') {
        return <div className="terminal-history-error">{text}</div>;
    } else if (type === 'component') {
        return <div className="terminal-component">{text}</div>;
    }
    return null;
});

HistoryItem.displayName = 'HistoryItem';

// Main Terminal Component
const TerminalConsole = ({ onNavigate }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'output', text: 'NuCaloric Terminal v3.2.1 - Type "help" for available commands' },
        { type: 'output', text: `Welcome, ${USERNAME}@${HOSTNAME}!` }
    ]);
    const [currentDirectory, setCurrentDirectory] = useState(INITIAL_DIRECTORY);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [showCompletion, setShowCompletion] = useState(false);
    const [completions, setCompletions] = useState([]);
    const [completionIndex, setCompletionIndex] = useState(0);
    const [burgerMode, setBurgerMode] = useState(false);

    const inputRef = useRef(null);
    const terminalRef = useRef(null);

    // Add burger animation CSS to document
    useEffect(() => {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(`
      .burger-animation {
        margin: 10px 0;
        font-family: monospace;
        line-height: 1.2;
        white-space: pre;
      }
      
      .pink-cat {
        color: #FF69B4;
      }
      
      .cyan-eyes {
        color: #00FFFF;
      }
      
      .pink-burger {
        color: #FF69B4;
      }
    `));
        document.head.appendChild(style);

        return () => document.head.removeChild(style);
    }, []);

    // Keep terminal scrolled to bottom
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    // Focus on input when terminal is clicked
    const focusInput = useCallback(() => {
        if (inputRef.current && !burgerMode) {
            inputRef.current.focus();
        }
    }, [burgerMode]);

    // Resolve path (handle relative paths)
    const resolvePath = useCallback((path) => {
        // If absolute path, return it directly
        if (path.startsWith('/')) {
            return path;
        }

        // Handle special cases
        if (path === '.') {
            return currentDirectory;
        }

        // Handle empty input (cd with no args)
        if (!path) {
            return INITIAL_DIRECTORY;
        }

        const currentParts = currentDirectory.split('/').filter(Boolean);
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
    }, [currentDirectory]);

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
    }, [resolvePath]);

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
    }, [resolvePath]);

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
    }, [resolvePath]);

    // Generate tab completions for current input
    const generateCompletions = useCallback(() => {
        const words = input.split(' ');
        const lastWord = words[words.length - 1];

        // Command completion (first word)
        if (words.length === 1) {
            const possibleCommands = Object.keys(commandHelp).filter(cmd =>
                cmd.startsWith(lastWord)
            );
            return possibleCommands;
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
    }, [input, currentDirectory, resolvePath, getObjectAtPath]);

    // Handle tab completion
    const handleTabCompletion = useCallback(() => {
        if (burgerMode) return; // Disable in burger mode

        const completionOptions = generateCompletions();

        if (completionOptions.length === 1) {
            // Only one option, complete directly
            const words = input.split(' ');
            words[words.length - 1] = completionOptions[0];
            setInput(words.join(' '));
            setShowCompletion(false);
        } else if (completionOptions.length > 1) {
            // Multiple options, show completion list
            setCompletions(completionOptions);
            setCompletionIndex(0);
            setShowCompletion(true);
        }
    }, [input, generateCompletions, burgerMode]);

    // Select a completion option
    const selectCompletion = useCallback((index) => {
        if (completions.length === 0) return;

        const words = input.split(' ');
        words[words.length - 1] = completions[index];
        setInput(words.join(' '));
        setShowCompletion(false);
    }, [input, completions]);

    // Handle burger animation stop
    const stopBurgerAnimation = useCallback(() => {
        setBurgerMode(false);
        setHistory(prev => [...prev, { type: 'output', text: 'Animation stopped.' }]);
    }, []);

    // Handle command execution
    const executeCommand = useCallback((commandLine) => {
        // Skip if in burger mode
        if (burgerMode && commandLine !== 'clear') {
            return;
        }

        // Add command to history
        const newCommand = { type: 'command', text: `${USERNAME}@${HOSTNAME}:${currentDirectory}$ ${commandLine}` };
        const historyWithCommand = [...history, newCommand];
        setHistory(historyWithCommand);

        // Add to command history for up/down navigation
        setCommandHistory([...commandHistory, commandLine]);
        setHistoryIndex(-1);

        // Parse command and arguments
        const args = commandLine.split(' ');
        const command = args[0].toLowerCase();
        args.shift(); // Remove command from args

        // Execute command
        let outputItems = [];

        // Check for hidden commands first
        if (command === 'nano' && args[0] === 'on_burger') {
            // Execute burger animation
            setBurgerMode(true);
            outputItems.push({
                type: 'component',
                text: <BurgerAnimation onExit={stopBurgerAnimation} />
            });

            setHistory([...historyWithCommand, ...outputItems]);
            setInput('');
            return;
        }

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
                    setCurrentDirectory(newPath);
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
                    if (fileObject.component) {
                        if (onNavigate) {
                            onNavigate(fileObject.scene, fileObject.tab, fileObject.component);
                            outputItems.push({ type: 'output', text: `Opening component: ${args[0]}` });
                        } else {
                            outputItems.push({ type: 'error', text: `cat: ${args[0]}: Cannot display component` });
                        }
                    } else if (onNavigate) {
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
                    if (nanoObject.component) {
                        if (onNavigate) {
                            onNavigate(nanoObject.scene, nanoObject.tab, nanoObject.component);
                            outputItems.push({ type: 'output', text: `Opening component: ${args[0]}` });
                        } else {
                            outputItems.push({ type: 'error', text: `nano: ${args[0]}: Cannot edit component` });
                        }
                    } else if (onNavigate) {
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
                if (burgerMode) {
                    setBurgerMode(false);
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
        setInput('');

        // Execute special commands
        if (command === 'exit') {
            // Handle exit command - could minimize the terminal
        }
    }, [
        currentDirectory,
        history,
        commandHistory,
        resolvePath,
        pathExists,
        isDirectory,
        getObjectAtPath,
        onNavigate,
        burgerMode,
        stopBurgerAnimation
    ]);

    // Handle input changes
    const handleInputChange = useCallback((e) => {
        if (burgerMode) return; // Disable in burger mode

        setInput(e.target.value);
        setShowCompletion(false);
    }, [burgerMode]);

    // Handle key presses in input field
    const handleKeyDown = useCallback((e) => {
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
                setCompletionIndex(newIndex);
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
            setShowCompletion(false);
            return;
        }

        // Handle Up/Down arrows for command history
        if (e.key === 'ArrowUp') {
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
                setShowCompletion(false);
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
            setShowCompletion(false);
            return;
        }

        // Close completion on any other key
        if (showCompletion) {
            setShowCompletion(false);
        }
    }, [
        input,
        historyIndex,
        commandHistory,
        executeCommand,
        showCompletion,
        completions,
        completionIndex,
        handleTabCompletion,
        selectCompletion,
        burgerMode,
        stopBurgerAnimation
    ]);

    return (
        <div className="terminal-content-area" ref={terminalRef} onClick={focusInput}>
            {history.map((item, index) => (
                <HistoryItem
                    key={index}
                    type={item.type}
                    text={item.type === 'output' && typeof item.text === 'string' && item.text.includes('<span')
                        ? <div dangerouslySetInnerHTML={{ __html: item.text }} />
                        : item.text}
                />
            ))}

            {!burgerMode && (
                <div className="terminal-input-line">
          <span className="terminal-prompt">
            {`${USERNAME}@${HOSTNAME}:${currentDirectory}$ `}
          </span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="terminal-input"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                </div>
            )}

            {showCompletion && completions.length > 0 && !burgerMode && (
                <div className="terminal-completion">
                    {completions.map((completion, index) => (
                        <div
                            key={completion}
                            className={`terminal-completion-item ${index === completionIndex ? 'active' : ''}`}
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