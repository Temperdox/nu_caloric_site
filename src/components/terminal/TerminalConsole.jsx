// TerminalConsole.jsx - Main terminal component with commands
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

// Import command handler
import { executeCommand, getAvailableCommands } from './commands/CommandHandler';

// Terminal constants
import { USERNAME, HOSTNAME, INITIAL_DIRECTORY } from './constants/TerminalConstants';

// Import file system utilities
import { resolvePath, getObjectAtPath } from './utils/FileSystemUtils';

// Terminal history item component
const HistoryItem = memo(({ type, text, id }) => {
    if (type === 'command') {
        return <div className="terminal-history-command" key={id}>{text}</div>;
    } else if (type === 'output') {
        return <div className="terminal-history-output" key={id}>{text}</div>;
    } else if (type === 'error') {
        return <div className="terminal-history-error" key={id}>{text}</div>;
    } else if (type === 'component') {
        return <div className="terminal-component" key={id}>{text}</div>;
    }
    return null;
});

HistoryItem.displayName = 'HistoryItem';

// Main Terminal Component
const TerminalConsole = ({ onNavigate }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'output', text: 'NuCaloric Terminal v3.2.1 - Type "help" for available commands', id: 'welcome-1' },
        { type: 'output', text: `Welcome, ${USERNAME}@${HOSTNAME}!`, id: 'welcome-2' }
    ]);
    const [currentDirectory, setCurrentDirectory] = useState(INITIAL_DIRECTORY);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [showCompletion, setShowCompletion] = useState(false);
    const [completions, setCompletions] = useState([]);
    const [completionIndex, setCompletionIndex] = useState(0);

    // Special modes for animations - each animation should only be active once
    const [burgerMode, setBurgerMode] = useState(false);
    const [matrixMode, setMatrixMode] = useState(false);
    const [glitchMode, setGlitchMode] = useState(false);
    const [creditsMode, setCreditsMode] = useState(false);
    const [hackMode, setHackMode] = useState(false);
    const [, setHackTarget] = useState('');
    const [snakeMode, setSnakeMode] = useState(false);
    const [tetrisMode, setTetrisMode] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [, setTimerSeconds] = useState(0);
    const [terminalTheme, setTerminalTheme] = useState('green'); // Default theme
    const [aliases, setAliases] = useState({});

    // Track animation completion to prevent multiple completion messages
    const [burgerCompleted, setBurgerCompleted] = useState(false);
    const [matrixCompleted, setMatrixCompleted] = useState(false);
    const [glitchCompleted, setGlitchCompleted] = useState(false);
    const [creditsCompleted, setCreditsCompleted] = useState(false);
    const [hackCompleted, setHackCompleted] = useState(false);
    const [snakeCompleted, setSnakeCompleted] = useState(false);
    const [tetrisCompleted, setTetrisCompleted] = useState(false);
    const [timerCompleted, setTimerCompleted] = useState(false);

    // Use refs to track whether exit handlers have been called
    const exitHandlerCalledRef = useRef({
        burger: false,
        matrix: false,
        glitch: false,
        credits: false,
        hack: false,
        snake: false,
        tetris: false,
        timer: false
    });

    const inputRef = useRef(null);
    const terminalRef = useRef(null);
    const historyIdCounterRef = useRef(0);

    // Generate unique ID for history items
    const generateHistoryId = useCallback(() => {
        historyIdCounterRef.current += 1;
        return `history-${historyIdCounterRef.current}`;
    }, []);

    // Add item to history with a unique ID
    const addToHistory = useCallback((item) => {
        const itemWithId = { ...item, id: generateHistoryId() };
        setHistory(prev => [...prev, itemWithId]);
    }, [generateHistoryId]);

    // Keep terminal scrolled to bottom
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    // Focus on input when terminal is clicked
    const focusInput = useCallback(() => {
        if (inputRef.current && !burgerMode && !matrixMode && !glitchMode && !creditsMode && !hackMode && !snakeMode && !tetrisMode && !timerActive) {
            inputRef.current.focus();
        }
    }, [burgerMode, matrixMode, glitchMode, creditsMode, hackMode, snakeMode, tetrisMode, timerActive]);

    // Reset exit handler flags when starting a new animation
    const resetExitHandlerFlags = useCallback(() => {
        exitHandlerCalledRef.current = {
            burger: false,
            matrix: false,
            glitch: false,
            credits: false,
            hack: false,
            snake: false,
            tetris: false,
            timer: false
        };
    }, []);

    // Stop animation handlers - with protection against multiple calls
    const stopBurgerAnimation = useCallback((isCompleted = false) => {
        if (exitHandlerCalledRef.current.burger) return; // Prevent multiple calls
        exitHandlerCalledRef.current.burger = true;

        setBurgerMode(false);

        if (isCompleted) {
            addToHistory({ type: 'output', text: 'Burger animation complete.' });
        } else if (!burgerCompleted) {
            addToHistory({ type: 'output', text: 'Animation stopped.' });
        }

        setBurgerCompleted(false);
    }, [burgerCompleted, addToHistory]);

    const stopMatrixAnimation = useCallback((isCompleted = false) => {
        if (exitHandlerCalledRef.current.matrix) return; // Prevent multiple calls
        exitHandlerCalledRef.current.matrix = true;

        setMatrixMode(false);

        if (isCompleted) {
            addToHistory({ type: 'output', text: 'Connection to the Matrix closed.' });
        } else if (!matrixCompleted) {
            addToHistory({ type: 'output', text: 'Matrix animation stopped.' });
        }

        setMatrixCompleted(false);
    }, [matrixCompleted, addToHistory]);

    const stopGlitchEffect = useCallback((isCompleted = false) => {
        if (exitHandlerCalledRef.current.glitch) return; // Prevent multiple calls
        exitHandlerCalledRef.current.glitch = true;

        setGlitchMode(false);

        if (isCompleted) {
            addToHistory({ type: 'output', text: 'Terminal glitch sequence complete.' });
        } else if (!glitchCompleted) {
            addToHistory({ type: 'output', text: 'Terminal normalized.' });
        }

        setGlitchCompleted(false);
    }, [glitchCompleted, addToHistory]);

    const stopCredits = useCallback((isCompleted = false) => {
        if (exitHandlerCalledRef.current.credits) return; // Prevent multiple calls
        exitHandlerCalledRef.current.credits = true;

        setCreditsMode(false);

        if (isCompleted) {
            addToHistory({ type: 'output', text: 'Credits complete.' });
        } else if (!creditsCompleted) {
            addToHistory({ type: 'output', text: 'Credits stopped.' });
        }

        setCreditsCompleted(false);
    }, [creditsCompleted, addToHistory]);

    const stopHackAnimation = useCallback((isCompleted = false) => {
        if (exitHandlerCalledRef.current.hack) return; // Prevent multiple calls
        exitHandlerCalledRef.current.hack = true;

        setHackMode(false);

        if (isCompleted) {
            addToHistory({ type: 'output', text: `Target successfully compromised.` });
        } else if (!hackCompleted) {
            addToHistory({ type: 'output', text: `System penetration aborted with exit code 1.` });
        }

        setHackCompleted(false);
    }, [hackCompleted, addToHistory]);

    const stopSnakeGame = useCallback((isCompleted = false) => {
        if (exitHandlerCalledRef.current.snake) return; // Prevent multiple calls
        exitHandlerCalledRef.current.snake = true;

        setSnakeMode(false);

        if (isCompleted) {
            addToHistory({ type: 'output', text: 'Game over! Thanks for playing Snake.' });
        } else if (!snakeCompleted) {
            addToHistory({ type: 'output', text: 'Snake game exited.' });
        }

        setSnakeCompleted(false);
    }, [snakeCompleted, addToHistory]);

    const stopTetrisGame = useCallback((isCompleted = false) => {
        if (exitHandlerCalledRef.current.tetris) return; // Prevent multiple calls
        exitHandlerCalledRef.current.tetris = true;

        setTetrisMode(false);

        if (isCompleted) {
            addToHistory({ type: 'output', text: 'Game over! Thanks for playing Tetris.' });
        } else if (!tetrisCompleted) {
            addToHistory({ type: 'output', text: 'Tetris game exited.' });
        }

        setTetrisCompleted(false);
    }, [tetrisCompleted, addToHistory]);

    const stopTimer = useCallback((isCompleted = false) => {
        if (exitHandlerCalledRef.current.timer) return; // Prevent multiple calls
        exitHandlerCalledRef.current.timer = true;

        setTimerActive(false);

        if (isCompleted) {
            addToHistory({ type: 'output', text: 'Timer completed!' });
        } else if (!timerCompleted) {
            addToHistory({ type: 'output', text: 'Timer canceled.' });
        }

        setTimerCompleted(false);
    }, [timerCompleted, addToHistory]);

    // INTEGRATED TAB COMPLETION FUNCTIONALITY
    // Generate tab completions for current input
    const generateCompletions = useCallback(() => {
        const words = input.split(' ');
        const lastWord = words[words.length - 1];

        // Command completion (first word)
        if (words.length === 1) {
            const commandHelp = getAvailableCommands();
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
                ? resolvePath(dirPath, currentDirectory)
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
                    const fullPath = resolvePath(dirPath + name, currentDirectory);
                    const obj = getObjectAtPath(fullPath);
                    return path + (obj && obj.type === 'directory' ? '/' : '');
                });
            }
        }

        return [];
    }, [input, currentDirectory]);

    // Sort completions by relevance (directories first, then files)
    const sortCompletionsByRelevance = useCallback((completionsList) => {
        const directories = completionsList.filter(c => c.endsWith('/'));
        const files = completionsList.filter(c => !c.endsWith('/'));
        return [...directories.sort(), ...files.sort()];
    }, []);

    // Handle tab completion
    const handleTabCompletion = useCallback(() => {
        if (burgerMode || matrixMode || glitchMode || creditsMode ||
            hackMode || snakeMode || tetrisMode || timerActive) return; // Disable in special modes

        const completionOptions = sortCompletionsByRelevance(generateCompletions());

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
    }, [input, generateCompletions, sortCompletionsByRelevance, burgerMode, matrixMode, glitchMode,
        creditsMode, hackMode, snakeMode, tetrisMode, timerActive]);

    // Select a completion option
    const selectCompletion = useCallback((index) => {
        if (completions.length === 0) return;

        const words = input.split(' ');
        words[words.length - 1] = completions[index];
        setInput(words.join(' '));
        setShowCompletion(false);
    }, [input, completions]);

    // Handle command execution via the external handler
    const handleExecuteCommand = useCallback((commandLine) => {
        // Skip if in special mode (except 'clear')
        if ((burgerMode || matrixMode || glitchMode || creditsMode ||
            hackMode || snakeMode || tetrisMode || timerActive) && commandLine !== 'clear') {
            return;
        }

        // Generate a unique ID for this command
        const commandId = generateHistoryId();

        // Add command to history
        const newCommand = {
            type: 'command',
            text: `${USERNAME}@${HOSTNAME}:${currentDirectory}$ ${commandLine}`,
            id: commandId
        };

        // Add to history
        setHistory(prev => [...prev, newCommand]);

        // Add to command history for up/down navigation
        setCommandHistory([...commandHistory, commandLine]);
        setHistoryIndex(-1);

        // Reset exit handler flags before starting new animations
        resetExitHandlerFlags();

        // Create terminalState object to pass to command handler
        const terminalState = {
            currentDirectory,
            setCurrentDirectory,
            history: [...history, newCommand],
            setHistory,
            addToHistory,
            aliases,
            setAliases,
            terminalTheme,
            setTerminalTheme,
            onNavigate,

            // Animation state setters
            setBurgerMode,
            setMatrixMode,
            setGlitchMode,
            setCreditsMode,
            setHackMode,
            setHackTarget,
            setSnakeMode,
            setTetrisMode,
            setTimerActive,
            setTimerSeconds,

            // Animation completion state setters
            setBurgerCompleted,
            setMatrixCompleted,
            setGlitchCompleted,
            setCreditsCompleted,
            setHackCompleted,
            setSnakeCompleted,
            setTetrisCompleted,
            setTimerCompleted,

            // Animation stop handlers
            stopBurgerAnimation,
            stopMatrixAnimation,
            stopGlitchEffect,
            stopCredits,
            stopHackAnimation,
            stopSnakeGame,
            stopTetrisGame,
            stopTimer
        };

        // Execute the command through the external handler
        executeCommand(commandLine, terminalState);
        setInput('');
    }, [
        currentDirectory, history, commandHistory, aliases, terminalTheme, onNavigate,
        burgerMode, matrixMode, glitchMode, creditsMode, hackMode, snakeMode, tetrisMode, timerActive,
        stopBurgerAnimation, stopMatrixAnimation, stopGlitchEffect, stopCredits,
        stopHackAnimation, stopSnakeGame, stopTetrisGame, stopTimer,
        addToHistory, generateHistoryId, resetExitHandlerFlags
    ]);

    // Handle input changes
    const handleInputChange = useCallback((e) => {
        if (burgerMode || matrixMode || glitchMode || creditsMode ||
            hackMode || snakeMode || tetrisMode || timerActive) return; // Disable in special modes

        setInput(e.target.value);
        setShowCompletion(false);
    }, [burgerMode, matrixMode, glitchMode, creditsMode, hackMode, snakeMode, tetrisMode, timerActive]);

    // Handle key presses in input field
    const handleKeyDown = useCallback((e) => {
        // In special modes, only handle Ctrl+C/Cmd+C for active animations
        if (burgerMode || matrixMode || glitchMode || creditsMode ||
            hackMode || snakeMode || tetrisMode || timerActive) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                // Only stop animations that haven't already completed
                if (hackMode && !hackCompleted) stopHackAnimation(false);
                else if (burgerMode && !burgerCompleted) stopBurgerAnimation(false);
                else if (matrixMode && !matrixCompleted) stopMatrixAnimation(false);
                else if (glitchMode && !glitchCompleted) stopGlitchEffect(false);
                else if (creditsMode && !creditsCompleted) stopCredits(false);
                else if (snakeMode && !snakeCompleted) stopSnakeGame(false);
                else if (tetrisMode && !tetrisCompleted) stopTetrisGame(false);
                else if (timerActive && !timerCompleted) stopTimer(false);
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
                handleExecuteCommand(input);
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
        handleExecuteCommand,
        showCompletion,
        completions,
        completionIndex,
        handleTabCompletion,
        selectCompletion,
        burgerMode,
        matrixMode,
        glitchMode,
        creditsMode,
        hackMode,
        snakeMode,
        tetrisMode,
        timerActive,
        stopBurgerAnimation,
        stopMatrixAnimation,
        stopGlitchEffect,
        stopCredits,
        stopHackAnimation,
        stopSnakeGame,
        stopTetrisGame,
        stopTimer,
        burgerCompleted,
        matrixCompleted,
        glitchCompleted,
        creditsCompleted,
        hackCompleted,
        snakeCompleted,
        tetrisCompleted,
        timerCompleted
    ]);

    return (
        <div className="terminal-content-area" ref={terminalRef} onClick={focusInput}>
            {/* Render history items */}
            {history.map((item) => (
                <HistoryItem
                    key={item.id}
                    id={item.id}
                    type={item.type}
                    text={item.type === 'output' && typeof item.text === 'string' && item.text.includes('<span')
                        ? <div dangerouslySetInnerHTML={{ __html: item.text }} />
                        : item.text}
                />
            ))}

            {/* Input line (hidden during animations) */}
            {!(burgerMode || matrixMode || glitchMode || creditsMode ||
                hackMode || snakeMode || tetrisMode || timerActive) && (
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

            {/* Tab completion dropdown */}
            {showCompletion && completions.length > 0 &&
                !(burgerMode || matrixMode || glitchMode || creditsMode ||
                    hackMode || snakeMode || tetrisMode || timerActive) && (
                    <div className="terminal-completion">
                        {completions.map((completion, index) => (
                            <div
                                key={`completion-${index}`}
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