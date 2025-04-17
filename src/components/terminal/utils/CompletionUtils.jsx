// CompletionUtils.js - Utilities for terminal tab completion
import { getAvailableCommands } from '../commands/CommandHandler.jsx';
import { resolvePath, getObjectAtPath } from './FileSystemUtils.jsx';

/**
 * Generate tab completions for current input
 * @param {string} input - Current input string
 * @param {string} currentDirectory - Current working directory
 * @returns {string[]} Array of possible completions
 */
export const generateCompletions = (input, currentDirectory) => {
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
};

/**
 * Sort completions by relevance (directories first, then files)
 * @param {string[]} completions - Array of possible completions
 * @returns {string[]} Sorted completions
 */
export const sortCompletionsByRelevance = (completions) => {
    const directories = completions.filter(c => c.endsWith('/'));
    const files = completions.filter(c => !c.endsWith('/'));
    return [...directories.sort(), ...files.sort()];
};