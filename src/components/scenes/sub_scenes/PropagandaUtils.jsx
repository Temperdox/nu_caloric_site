// PropagandaUtils.js - Utility functions for handling propaganda media files

/**
 * Extracts metadata from a filename
 * @param {string} filename - The filename to parse
 * @returns {object} - Extracted metadata
 */
export const extractMetadataFromFilename = (filename) => {
    // Remove file extension
    const fileExtension = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
    const nameWithoutExtension = filename.slice(0, filename.lastIndexOf('.'));

    // Determine if it's a GIF
    const isGif = fileExtension === 'gif';

    // Convert underscores and hyphens to spaces for title
    let title = nameWithoutExtension
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word

    // Extract potential tags - words separated by underscore or hyphen
    const potentialTags = nameWithoutExtension
        .toLowerCase()
        .split(/[_-]/)
        .filter(tag => tag.length > 2); // Only use tags with more than 2 characters

    // Generate a random description based on if it's a gif or static image
    const descriptionTemplates = [
        `Authorized ${isGif ? 'animated' : 'static'} information material - ${title}`,
        `NuCaloric ${isGif ? 'motion' : 'visual'} propaganda - ${title}`,
        `Official ${isGif ? 'dynamic' : 'static'} public message - ${title}`,
        `Citizen information ${isGif ? 'sequence' : 'poster'} - ${title}`,
        `Approved ${isGif ? 'animation' : 'image'} for distribution - ${title}`
    ];

    const description = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)];

    return {
        title,
        description,
        tags: potentialTags,
        isGif
    };
};

/**
 * Generate a random date within a specified range
 * @param {number} months - Number of months to go back from current date
 * @returns {string} - ISO date string (YYYY-MM-DD)
 */
export const generateRandomDate = (months = 6) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setMonth(today.getMonth() - months);

    // Generate random date between pastDate and today
    const randomTimestamp = pastDate.getTime() + Math.random() * (today.getTime() - pastDate.getTime());
    const randomDate = new Date(randomTimestamp);

    return randomDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

/**
 * Extract unique tags from a collection of propaganda items
 * @param {Array} items - Array of propaganda items
 * @returns {Array} - Sorted array of unique tags
 */
export const extractUniqueTags = (items) => {
    const tags = new Set();

    items.forEach(item => {
        if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach(tag => tags.add(tag));
        }
    });

    return Array.from(tags).sort();
};

/**
 * Filter propaganda items based on search term and tag
 * @param {Array} items - Array of propaganda items
 * @param {string} searchTerm - Search term to filter by
 * @param {string} activeTag - Tag to filter by
 * @returns {Array} - Filtered array of propaganda items
 */
export const filterPropagandaItems = (items, searchTerm = '', activeTag = '') => {
    return items.filter(item => {
        // Filter by search term
        const searchMatch = searchTerm === '' ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

        // Filter by active tag
        const tagMatch = activeTag === '' || (item.tags && item.tags.includes(activeTag));

        return searchMatch && tagMatch;
    });
};

/**
 * Sort propaganda items by date
 * @param {Array} items - Array of propaganda items
 * @param {string} sortOrder - Sort order ('newest' or 'oldest')
 * @returns {Array} - Sorted array of propaganda items
 */
export const sortPropagandaItems = (items, sortOrder = 'newest') => {
    return [...items].sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.date) - new Date(a.date);
        } else {
            return new Date(a.date) - new Date(b.date);
        }
    });
};