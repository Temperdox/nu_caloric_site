// GameCommands.js - Terminal games
import React from 'react';
import SnakeGame from '../games/SnakeGame';
import TetrisGame from '../games/TetrisGame';

/**
 * Terminal games commands
 */
const GameCommands = {
    // Available game commands
    commands: {
        'snake': 'Play Snake game',
        'tetris': 'Play Tetris game'
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
     * Execute a game command
     * @param {string} command - Command to execute
     * @param {Array} args - Command arguments
     * @param {object} terminalState - Current terminal state
     */
    executeCommand(command, args, terminalState) {
        const {
            history,
            setHistory,
            setSnakeMode,
            setTetrisMode,
            setSnakeCompleted,
            setTetrisCompleted,
            stopSnakeGame,
            stopTetrisGame
        } = terminalState;

        switch (command) {
            case 'snake':
                this.startSnakeGame(
                    history, setHistory,
                    setSnakeMode, setSnakeCompleted,
                    stopSnakeGame
                );
                break;
            case 'tetris':
                this.startTetrisGame(
                    history, setHistory,
                    setTetrisMode, setTetrisCompleted,
                    stopTetrisGame
                );
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
     * Start Snake game
     */
    startSnakeGame(history, setHistory, setSnakeMode, setSnakeCompleted, stopSnakeGame) {
        setSnakeMode(true);
        setSnakeCompleted(false);

        setHistory([
            ...history,
            {
                type: 'output',
                text: 'Starting Snake game...\nUse arrow keys to control\nPress Ctrl+C to exit'
            },
            {
                type: 'component',
                text: <SnakeGame
                    onExit={stopSnakeGame}
                    setSnakeCompleted={setSnakeCompleted}
                />
            }
        ]);
    },

    /**
     * Start Tetris game
     */
    startTetrisGame(history, setHistory, setTetrisMode, setTetrisCompleted, stopTetrisGame) {
        setTetrisMode(true);
        setTetrisCompleted(false);

        setHistory([
            ...history,
            {
                type: 'output',
                text: 'Starting Tetris game...\nUse arrow keys to control\nPress Ctrl+C to exit'
            },
            {
                type: 'component',
                text: <TetrisGame
                    onExit={stopTetrisGame}
                    setTetrisCompleted={setTetrisCompleted}
                />
            }
        ]);
    }
};

export default GameCommands;