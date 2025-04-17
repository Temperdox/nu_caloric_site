// SnakeGame.jsx - Terminal Snake game implementation
import React, { useState, useEffect, useRef, memo } from 'react';

const SnakeGame = ({ onExit, setSnakeCompleted }) => {
    // Game state
    const [running, setRunning] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [exitingGame, setExitingGame] = useState(false);

    // Animation frame ref
    const gameLoopRef = useRef(null);
    const lastUpdateTimeRef = useRef(0);
    const updateIntervalRef = useRef(200); // ms between updates

    // Game board dimensions
    const WIDTH = 20;
    const HEIGHT = 10;

    // Direction and snake position
    const [direction, setDirection] = useState('right');
    const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
    const [food, setFood] = useState({ x: 10, y: 5 });

    // Keyboard events
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Exit on Ctrl+C
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !exitingGame) {
                e.preventDefault();
                setExitingGame(true);
                setRunning(false);
                if (onExit) {
                    setTimeout(() => onExit(false), 100);
                }
                return;
            }

            // Start game on any key press
            if (!gameStarted && !gameOver && !exitingGame) {
                e.preventDefault();
                setGameStarted(true);
                return;
            }

            // Game controls - only when game is active
            if (gameStarted && !gameOver && running && !exitingGame) {
                switch (e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        if (direction !== 'down') {
                            setDirection('up');
                        }
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        if (direction !== 'up') {
                            setDirection('down');
                        }
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        if (direction !== 'right') {
                            setDirection('left');
                        }
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        if (direction !== 'left') {
                            setDirection('right');
                        }
                        break;
                    default:
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Auto-end after 2 minutes
        const autoEndTimer = setTimeout(() => {
            if (running && !exitingGame) {
                setExitingGame(true);
                setRunning(false);
                if (setSnakeCompleted) {
                    setSnakeCompleted(true);
                }
                if (onExit) {
                    setTimeout(() => onExit(true), 100);
                }
            }
        }, 120000);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(autoEndTimer);
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [
        direction,
        running,
        gameStarted,
        gameOver,
        onExit,
        setSnakeCompleted,
        exitingGame
    ]);

    // Game loop
    useEffect(() => {
        if (!gameStarted || gameOver || !running || exitingGame) {
            return;
        }

        const gameLoop = (timestamp) => {
            if (!lastUpdateTimeRef.current) {
                lastUpdateTimeRef.current = timestamp;
            }

            const elapsed = timestamp - lastUpdateTimeRef.current;

            // Only update at the specified interval
            if (elapsed > updateIntervalRef.current) {
                updateGame();
                lastUpdateTimeRef.current = timestamp;
            }

            // Continue the loop if game is still running
            if (running && !gameOver && !exitingGame) {
                gameLoopRef.current = requestAnimationFrame(gameLoop);
            }
        };

        // Start the game loop
        gameLoopRef.current = requestAnimationFrame(gameLoop);

        // Clean up
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameStarted, gameOver, running, exitingGame, direction, snake, food]);

    // Create food at random position
    const createFood = () => {
        let newFood;
        let isOnSnake;

        do {
            newFood = {
                x: Math.floor(Math.random() * WIDTH),
                y: Math.floor(Math.random() * HEIGHT)
            };

            // Check if food spawned on snake
            isOnSnake = snake.some(segment =>
                segment.x === newFood.x && segment.y === newFood.y
            );
        } while (isOnSnake);

        setFood(newFood);
    };

    // Main game update function
    const updateGame = () => {
        if (!running || gameOver || exitingGame) return;

        // Get the current head position
        const head = { ...snake[0] };

        // Move head based on direction
        switch (direction) {
            case 'up':
                head.y = (head.y - 1 + HEIGHT) % HEIGHT;
                break;
            case 'down':
                head.y = (head.y + 1) % HEIGHT;
                break;
            case 'left':
                head.x = (head.x - 1 + WIDTH) % WIDTH;
                break;
            case 'right':
                head.x = (head.x + 1) % WIDTH;
                break;
            default:
                break;
        }

        // Check if snake hit itself
        const selfCollision = snake.some((segment, index) => {
            // Skip the tail if we're moving since it will move out of the way
            if (index === snake.length - 1) return false;
            return segment.x === head.x && segment.y === head.y;
        });

        if (selfCollision) {
            setGameOver(true);
            return;
        }

        // Create new snake with updated head
        const newSnake = [head, ...snake];

        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            setScore(prevScore => prevScore + 1);

            // Create new food
            createFood();

            // Increase game speed slightly after every 5 points
            if (score > 0 && score % 5 === 0) {
                updateIntervalRef.current = Math.max(50, updateIntervalRef.current - 10);
            }
        } else {
            // Remove tail if no food was eaten
            newSnake.pop();
        }

        // Update snake
        setSnake(newSnake);
    };

    // Render game board
    const renderBoard = () => {
        // Create empty board
        const board = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(' '));

        // Add snake to board
        snake.forEach((segment, index) => {
            if (segment.y >= 0 && segment.y < HEIGHT && segment.x >= 0 && segment.x < WIDTH) {
                board[segment.y][segment.x] = index === 0 ? 'X' : 'o';
            }
        });

        // Add food to board
        if (food.y >= 0 && food.y < HEIGHT && food.x >= 0 && food.x < WIDTH) {
            board[food.y][food.x] = '*';
        }

        // Convert board to string with border
        let result = '+' + '-'.repeat(WIDTH * 2) + '+\n';

        for (let y = 0; y < HEIGHT; y++) {
            result += '|';
            for (let x = 0; x < WIDTH; x++) {
                result += board[y][x] + ' ';
            }
            result += '|\n';
        }

        result += '+' + '-'.repeat(WIDTH * 2) + '+';

        return result;
    };

    // Render start or game over screen
    const renderStartScreen = () => {
        if (gameOver) {
            return `
╔════════════════════════════════╗
║          GAME OVER!            ║
║                                ║
║         Your Score: ${score.toString().padStart(2, ' ')}         ║
║                                ║
║     Press Ctrl+C to exit       ║
╚════════════════════════════════╝
            `;
        }

        return `
╔════════════════════════════════╗
║           SNAKE GAME           ║
║                                ║
║       Press any key to start   ║
║                                ║
║      Arrow keys to move        ║
║      Ctrl+C to exit            ║
╚════════════════════════════════╝
        `;
    };

    // Game info and controls
    const renderControls = () => {
        return `
Controls:
↑/↓/←/→ : Move snake
Ctrl+C  : Exit game

Goal: Eat * to grow
Score: ${score}
`;
    };

    return (
        <div className="snake-game" style={{
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            color: gameOver ? '#FF0000' : '#33FF33'
        }}>
            {!gameStarted || gameOver ? (
                renderStartScreen()
            ) : (
                <>
                    {renderBoard()}
                    {renderControls()}
                </>
            )}
        </div>
    );
};

export default memo(SnakeGame);