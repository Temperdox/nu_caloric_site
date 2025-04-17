// TetrisGame.jsx - Simple Tetris implementation for terminal
import React, { useState, useEffect, useRef, memo } from 'react';

// Tetris piece definitions
const PIECES = [
    // I piece
    {
        shapes: [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ]
        ],
        symbol: 'I'
    },
    // J piece
    {
        shapes: [
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]
            ]
        ],
        symbol: 'J'
    },
    // L piece
    {
        shapes: [
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ]
        ],
        symbol: 'L'
    },
    // O piece
    {
        shapes: [
            [
                [1, 1],
                [1, 1]
            ]
        ],
        symbol: 'O'
    },
    // T piece
    {
        shapes: [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ],
        symbol: 'T'
    }
];

// Game board dimensions
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 16;

const TetrisGame = ({ onExit, setTetrisCompleted }) => {
    // Game state
    const [board, setBoard] = useState(
        Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0))
    );
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [running, setRunning] = useState(true);
    const [exitingGame, setExitingGame] = useState(false);

    // Piece state
    const [currentPiece, setCurrentPiece] = useState(null);
    const [nextPiece, setNextPiece] = useState(null);
    const [piecePosition, setPiecePosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);

    // Game timer refs
    const gameLoopRef = useRef(null);
    const lastDropTimeRef = useRef(0);
    const dropIntervalRef = useRef(1000); // Initial drop interval in ms

    // Initialize game
    useEffect(() => {
        // Initialize the first piece
        if (!currentPiece && !nextPiece) {
            const firstPiece = getRandomPiece();
            const previewPiece = getRandomPiece();
            setCurrentPiece(firstPiece);
            setNextPiece(previewPiece);
            setPiecePosition({
                x: Math.floor(BOARD_WIDTH / 2) - Math.floor(firstPiece.shapes[0][0].length / 2),
                y: 0
            });
        }

        // Check if the game should be running
        if (gameStarted && !gameOver && running && !exitingGame) {
            startGameLoop();
        } else if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
        }

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [gameStarted, gameOver, running, exitingGame]);

    // Key press handlers
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Exit on Ctrl+C or Cmd+C
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

            if (!gameStarted || gameOver || !running || exitingGame) return;

            // Game controls
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    rotatePiece();
                    break;
                case ' ': // Space bar - hard drop
                    e.preventDefault();
                    hardDrop();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Auto-exit after 2 minutes
        const autoEndTimer = setTimeout(() => {
            if (running && !exitingGame) {
                setExitingGame(true);
                setRunning(false);
                if (setTetrisCompleted) {
                    setTetrisCompleted(true);
                }
                if (onExit) {
                    setTimeout(() => onExit(true), 100);
                }
            }
        }, 120000);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(autoEndTimer);
        };
    }, [gameStarted, gameOver, running, exitingGame]);

    // Start game loop
    const startGameLoop = () => {
        // Clear any existing interval
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
        }

        // Calculate drop interval based on level (gets faster as level increases)
        dropIntervalRef.current = Math.max(100, 1000 - ((level - 1) * 100));

        // Set up drop interval
        gameLoopRef.current = setInterval(() => {
            if (running && !gameOver && !exitingGame) {
                // Move piece down
                movePiece(0, 1);
            }
        }, dropIntervalRef.current);
    };

    // Get random piece
    const getRandomPiece = () => {
        const randomIndex = Math.floor(Math.random() * PIECES.length);
        return PIECES[randomIndex];
    };

    // Check collision
    const checkCollision = (shape, x, y) => {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardX = x + col;
                    const boardY = y + row;

                    // Check boundaries
                    if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
                        return true;
                    }

                    // Check collision with existing pieces on the board
                    if (boardY >= 0 && board[boardY] && board[boardY][boardX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    // Move piece
    const movePiece = (deltaX, deltaY) => {
        if (!currentPiece || gameOver || !running || exitingGame) return false;

        const newX = piecePosition.x + deltaX;
        const newY = piecePosition.y + deltaY;
        const shape = currentPiece.shapes[rotation];

        // Check if move is valid
        if (!checkCollision(shape, newX, newY)) {
            setPiecePosition({ x: newX, y: newY });
            return true;
        }

        // If moving down causes collision, lock the piece
        if (deltaY > 0) {
            lockPiece();
        }

        return false;
    };

    // Rotate piece
    const rotatePiece = () => {
        if (!currentPiece || gameOver || !running || exitingGame) return;

        const newRotation = (rotation + 1) % currentPiece.shapes.length;
        const newShape = currentPiece.shapes[newRotation];

        // Check if rotation is valid
        if (!checkCollision(newShape, piecePosition.x, piecePosition.y)) {
            setRotation(newRotation);
        } else {
            // Try wall kicks (simple version - try moving left or right to rotate)
            if (!checkCollision(newShape, piecePosition.x - 1, piecePosition.y)) {
                setPiecePosition({ ...piecePosition, x: piecePosition.x - 1 });
                setRotation(newRotation);
            } else if (!checkCollision(newShape, piecePosition.x + 1, piecePosition.y)) {
                setPiecePosition({ ...piecePosition, x: piecePosition.x + 1 });
                setRotation(newRotation);
            }
        }
    };

    // Hard drop
    const hardDrop = () => {
        if (!currentPiece || gameOver || !running || exitingGame) return;

        let dropY = piecePosition.y;
        const shape = currentPiece.shapes[rotation];

        // Find the lowest position
        while (!checkCollision(shape, piecePosition.x, dropY + 1)) {
            dropY++;
        }

        // Move to that position and lock
        if (dropY > piecePosition.y) {
            setPiecePosition({ ...piecePosition, y: dropY });
            lockPiece();
        }
    };

    // Lock piece and spawn a new one
    const lockPiece = () => {
        if (!currentPiece || !running || exitingGame) return;

        // Get current piece shape
        const shape = currentPiece.shapes[rotation];

        // Create a new board with the piece locked in place
        const newBoard = board.map(row => [...row]);

        // Add piece to board
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardY = piecePosition.y + row;
                    const boardX = piecePosition.x + col;

                    if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                        newBoard[boardY][boardX] = currentPiece.symbol;
                    }
                }
            }
        }

        // Update the board
        setBoard(newBoard);

        // Clear completed lines
        clearLines(newBoard);

        // Spawn a new piece
        spawnNewPiece();
    };

    // Spawn a new piece at the top
    const spawnNewPiece = () => {
        const newPiece = nextPiece || getRandomPiece();
        const nextPreviewPiece = getRandomPiece();

        setNextPiece(nextPreviewPiece);
        setCurrentPiece(newPiece);
        setRotation(0);

        // Position the piece at the top center
        const newX = Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece.shapes[0][0].length / 2);
        setPiecePosition({ x: newX, y: 0 });

        // Check for game over
        if (checkCollision(newPiece.shapes[0], newX, 0)) {
            setGameOver(true);
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        }
    };

    // Clear completed lines
    const clearLines = (gameBoard) => {
        let linesCleared = 0;
        const newBoard = [...gameBoard];

        for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
            if (newBoard[row].every(cell => cell !== 0)) {
                // Line complete, remove it
                linesCleared++;

                // Move all lines above down
                for (let y = row; y > 0; y--) {
                    newBoard[y] = [...newBoard[y - 1]];
                }

                // Add empty line at top
                newBoard[0] = Array(BOARD_WIDTH).fill(0);

                // Check the same row again
                row++;
            }
        }

        if (linesCleared > 0) {
            // Update score - more points for more lines cleared at once
            const points = [0, 40, 100, 300, 1200][linesCleared] * level;
            setScore(prevScore => prevScore + points);

            // Every 10 lines, increase level
            const totalScore = score + points;
            const newLevel = Math.floor(totalScore / 1000) + 1;

            if (newLevel > level) {
                setLevel(newLevel);
                // Update drop speed with new level
                dropIntervalRef.current = Math.max(100, 1000 - ((newLevel - 1) * 100));

                // Restart the game loop with new speed
                startGameLoop();
            }

            // Update the board
            setBoard(newBoard);
        }
    };

    // Render the next piece preview
    const renderNextPiecePreview = () => {
        if (!nextPiece) return "Coming Soon";

        const shape = nextPiece.shapes[0];
        let preview = '';

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    preview += nextPiece.symbol + ' ';
                } else {
                    preview += '  ';
                }
            }
            preview += '\n';
        }

        return preview;
    };

    // Render the game board
    const renderGame = () => {
        // Create a display board with current piece
        const displayBoard = board.map(row => [...row]);

        // Add current piece to display
        if (currentPiece) {
            const shape = currentPiece.shapes[rotation];
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        const boardY = piecePosition.y + row;
                        const boardX = piecePosition.x + col;

                        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                            displayBoard[boardY][boardX] = currentPiece.symbol;
                        }
                    }
                }
            }
        }

        // Render board
        let result = '+' + '-'.repeat(BOARD_WIDTH * 2) + '+\n';

        for (let y = 0; y < BOARD_HEIGHT; y++) {
            result += '|';
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (displayBoard[y][x]) {
                    result += displayBoard[y][x] + ' ';
                } else {
                    result += '  ';
                }
            }
            result += '|\n';
        }

        result += '+' + '-'.repeat(BOARD_WIDTH * 2) + '+';

        return result;
    };

    // Render game info
    const renderGameInfo = () => {
        return `
Score: ${score}
Level: ${level}
Speed: ${Math.floor(1000 / dropIntervalRef.current * 10) / 10}x

Next piece:
${renderNextPiecePreview()}
Controls:
←/→: Move
↑: Rotate
↓: Soft Drop
Space: Hard Drop
    `;
    };

    // Start screen
    const renderStartScreen = () => {
        if (gameOver) {
            return `
╔════════════════════════════════╗
║          GAME OVER!            ║
║                                ║
║         Your Score: ${score.toString().padStart(6, ' ')}      ║
║         Level: ${level.toString().padStart(2, ' ')}             ║
║                                ║
║     Press Ctrl+C to exit       ║
╚════════════════════════════════╝
      `;
        }

        return `
╔════════════════════════════════╗
║           TETRIS               ║
║                                ║
║       Press any key to start   ║
║                                ║
║  ←/→     : Move left/right     ║
║  ↑       : Rotate              ║
║  ↓       : Soft drop           ║
║  Space   : Hard drop           ║
║  Ctrl+C  : Exit game           ║
╚════════════════════════════════╝
    `;
    };

    // Combine game board and info
    const renderGameLayout = () => {
        const boardLines = renderGame().split('\n');
        const infoLines = renderGameInfo().split('\n');

        let result = '';
        const maxLines = Math.max(boardLines.length, infoLines.length);

        for (let i = 0; i < maxLines; i++) {
            const boardLine = boardLines[i] || '';
            const infoLine = infoLines[i] || '';
            result += `${boardLine.padEnd(BOARD_WIDTH * 2 + 3)}  ${infoLine}\n`;
        }

        return result;
    };

    return (
        <div className="tetris-game" style={{
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            color: gameOver ? '#FF0000' : '#33FF33'
        }}>
            {!gameStarted || gameOver ? (
                renderStartScreen()
            ) : (
                renderGameLayout()
            )}
        </div>
    );
};

export default memo(TetrisGame);