// FortuneUtils.js - Generate random fortunes

/**
 * Collection of fortune quotes
 */
const FORTUNES = [
    "You will encounter a mysterious stranger who knows RegEx.",
    "A fresh perspective will resolve your coding challenge.",
    "Error 404: Fortune not found. Retry $ cat /dev/optimism",
    "Today is a good day to back up your data.",
    "The bug you've been looking for is in the function you least suspect.",
    "A new hardware upgrade is in your future.",
    "Don't worry about the blue screen. Worry about the ones turning red.",
    "A clean desk is a sign of a clean codebase. Take time to refactor.",
    "You will soon receive an unexpected notification.",
    "The path to debugging enlightenment begins with console.log().",
    "Two bytes meet. The first byte asks, 'Are you ill?' The second byte replies, 'No, just feeling a bit off.'",
    "Before you criticize someone, walk a mile in their shoes. That way, you'll be a mile away and have their shoes.",
    "The greatest risk is not taking one.",
    "The best way to predict the future is to create it.",
    "Fortune favors the brave, and occasionally those who make regular backups.",
    "Always save your work before refreshing the browser.",
    "A journey of a thousand functions begins with a single line of code.",
    "Your code will compile on the first try... eventually.",
    "A watched progress bar never completes.",
    "Help! I'm trapped in a fortune cookie factory!",
    "A git pull a day keeps the merge conflicts away.",
    "You will find a solution to your problem on Stack Overflow. Maybe.",
    "Never trust a computer you can't throw out a window.",
    "The cloud is just someone else's computer.",
    "There's no place like 127.0.0.1",
    "Have you tried turning it off and on again?",
    "It's not a bug, it's an undocumented feature.",
    "The wisest programmers know when to ask ChatGPT for help."
];

/**
 * Get a random fortune
 * @returns {string} Formatted fortune with ASCII art box
 */
export const getRandomFortune = () => {
    const randomIndex = Math.floor(Math.random() * FORTUNES.length);
    const fortuneText = FORTUNES[randomIndex];

    // Calculate the length needed for the box
    const boxWidth = Math.max(fortuneText.length + 4, 20); // Minimum width of 20 characters

    // Create the top and bottom borders with the proper width
    const topBorder = '_'.repeat(boxWidth-2);
    const bottomBorder = '_'.repeat(boxWidth-3);

    // Create the fortune with proper padding
    const paddedFortune = fortuneText.padEnd(boxWidth - 4); // -4 for the "/ " and " \"

    // Create the ASCII art with dynamic width
    return `
 ${topBorder}
/ ${paddedFortune} \\
\\_${bottomBorder}_/
        \\   ∧＿∧  ♪          
         \\ ∩＾o＾）☆
           |    ⊂ﾉ
           ｜    _⊃   ♪
            し ⌒ 
    `;
};

/**
 * Get a specific fortune by index
 * @param {number} index - Index of fortune to retrieve
 * @returns {string} Plain fortune text (no formatting)
 */
export const getFortuneByIndex = (index) => {
    if (index < 0 || index >= FORTUNES.length) {
        return "No fortune found at that index.";
    }
    return FORTUNES[index];
};

/**
 * Get all available fortunes
 * @returns {string[]} Array of all fortune texts
 */
export const getAllFortunes = () => {
    return [...FORTUNES];
};

/**
 * Add a new fortune to the collection (not persistent)
 * @param {string} fortune - New fortune text
 * @returns {number} New fortune count
 */
export const addFortune = (fortune) => {
    if (typeof fortune === 'string' && fortune.trim().length > 0) {
        FORTUNES.push(fortune.trim());
    }
    return FORTUNES.length;
};