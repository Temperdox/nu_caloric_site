// CommandHandler.js - Central command processor for terminal
import React from 'react';

// Import command modules
import FileSystemCommands from './FileSystemCommands';
import SystemCommands from './SystemCommands';
import AnimationCommands from './AnimationCommands';
import UtilityCommands from './UtilityCommands';
import GameCommands from './GameCommands';

/**
 * Master command handler that routes commands to appropriate modules
 * @param {string} commandLine - The full command line input
 * @param {object} terminalState - Current terminal state object
 */
export const executeCommand = (commandLine, terminalState) => {
    // Extract the base command and arguments
    const args = commandLine.split(' ');
    const baseCommand = args[0].toLowerCase();
    args.shift(); // Remove command from args

    // Handle empty command
    if (baseCommand === '') {
        return;
    }

    // Check for aliases first (except for the alias command itself)
    const aliasedCommand = terminalState.aliases[baseCommand];
    if (aliasedCommand && baseCommand !== 'alias') {
        // Execute the aliased command instead
        return executeCommand(
            aliasedCommand + (args.length > 0 ? ' ' + args.join(' ') : ''),
            terminalState
        );
    }

    // First, check for built-in shell commands
    if (SystemCommands.hasCommand(baseCommand)) {
        return SystemCommands.executeCommand(baseCommand, args, terminalState);
    }

    // File system commands
    if (FileSystemCommands.hasCommand(baseCommand)) {
        return FileSystemCommands.executeCommand(baseCommand, args, terminalState);
    }

    // Animation commands
    if (AnimationCommands.hasCommand(baseCommand)) {
        return AnimationCommands.executeCommand(baseCommand, args, terminalState);
    }

    // Game commands
    if (GameCommands.hasCommand(baseCommand)) {
        return GameCommands.executeCommand(baseCommand, args, terminalState);
    }

    // Utility commands
    if (UtilityCommands.hasCommand(baseCommand)) {
        return UtilityCommands.executeCommand(baseCommand, args, terminalState);
    }

    // If we get here, command is not recognized
    terminalState.setHistory([
        ...terminalState.history,
        { type: 'error', text: `${baseCommand}: command not found` }
    ]);
};

// Export available commands for help display and tab completion
export const getAvailableCommands = () => {
    return {
        ...SystemCommands.getCommands(),
        ...FileSystemCommands.getCommands(),
        ...AnimationCommands.getCommands(),
        ...UtilityCommands.getCommands(),
        ...GameCommands.getCommands()
    };
};