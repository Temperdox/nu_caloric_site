// FileSystemUtils.js - Utilities for working with the virtual file system
import { fileSystem } from '../data/FileSystemData.jsx';

/**
 * Resolve a path (handle relative paths)
 * @param {string} path - Path to resolve
 * @param {string} currentDirectory - Current directory
 * @returns {string} Resolved absolute path
 */
export const resolvePath = (path, currentDirectory) => {
    // If absolute path, return it directly
    if (path?.startsWith('/')) {
        return path;
    }

    // Handle special cases
    if (path === '.') {
        return currentDirectory;
    }

    // Handle empty input (cd with no args)
    if (!path) {
        return '/home/user';
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
};

/**
 * Check if path exists in the file system
 * @param {string} path - Path to check
 * @returns {boolean} True if path exists
 */
export const pathExists = (path) => {
    const pathParts = path.split('/').filter(Boolean);
    let current = fileSystem['/'];

    for (const part of pathParts) {
        if (current.children && current.children[part]) {
            current = current.children[part];
        } else {
            return false;
        }
    }

    return true;
};

/**
 * Check if path is a directory
 * @param {string} path - Path to check
 * @returns {boolean} True if path is a directory
 */
export const isDirectory = (path) => {
    const pathParts = path.split('/').filter(Boolean);
    let current = fileSystem['/'];

    for (const part of pathParts) {
        if (current.children && current.children[part]) {
            current = current.children[part];
        } else {
            return false;
        }
    }

    return current.type === 'directory';
};

/**
 * Get object at path
 * @param {string} path - Path to get object from
 * @returns {object|null} Object at path or null if not found
 */
export const getObjectAtPath = (path) => {
    const pathParts = path.split('/').filter(Boolean);
    let current = fileSystem['/'];

    for (const part of pathParts) {
        if (current.children && current.children[part]) {
            current = current.children[part];
        } else {
            return null;
        }
    }

    return current;
};

/**
 * Get directory contents
 * @param {string} path - Path to directory
 * @returns {object|null} Directory contents or null if not a directory
 */
export const getDirectoryContents = (path) => {
    const dir = getObjectAtPath(path);

    if (!dir || dir.type !== 'directory') {
        return null;
    }

    return dir.children;
};