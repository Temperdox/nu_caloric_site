// MatrixAnimation.jsx - Full terminal Matrix-style digital rain animation
import React, { useState, useEffect, useRef, memo } from 'react';

const MatrixAnimation = ({ onExit, setMatrixCompleted }) => {
    // Animation state
    const [running, setRunning] = useState(true);
    const [exitingAnimation, setExitingAnimation] = useState(false);

    // Animation refs
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const resizeObserverRef = useRef(null);

    // Matrix rain character set - mix of Latin, katakana, and special characters
    const matrixChars =
        'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲンヴガギグゲゴザジズゼゾダヂヅデド' +
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*-+=/\\|[]{}()<>!?,.;:~゛゜ー_・「」';

    // Drops reference for animation
    const dropsRef = useRef([]);

    // Stop the animation and clean up
    const stopAnimation = () => {
        if (exitingAnimation) return; // Prevent multiple exits

        setExitingAnimation(true);
        setRunning(false);

        // Cancel animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        // Disconnect resize observer
        if (resizeObserverRef.current) {
            resizeObserverRef.current.disconnect();
            resizeObserverRef.current = null;
        }

        // Remove canvas with fade out effect
        const fadeOut = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                // Apply fade effect
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Check if canvas is dark enough
                const imageData = ctx.getImageData(0, 0, 10, 10); // Small sample
                const data = imageData.data;
                let totalBrightness = 0;

                for (let i = 0; i < data.length; i += 4) {
                    totalBrightness += data[i] + data[i+1] + data[i+2];
                }

                // If canvas is dark enough or we've been fading too long, exit
                if (totalBrightness < 100 || fadeCounter > 20) {
                    removeMatrixCanvas();
                    if (setMatrixCompleted) {
                        setMatrixCompleted(true);
                    }
                    if (onExit) {
                        setTimeout(() => onExit(true), 50);
                    }
                    return;
                }

                fadeCounter++;
                requestAnimationFrame(fadeOut);
            } else {
                if (setMatrixCompleted) {
                    setMatrixCompleted(true);
                }
                if (onExit) {
                    setTimeout(() => onExit(true), 50);
                }
            }
        };

        let fadeCounter = 0;
        requestAnimationFrame(fadeOut);
    };

    // Remove canvas from DOM
    const removeMatrixCanvas = () => {
        if (canvasRef.current && canvasRef.current.parentNode) {
            canvasRef.current.parentNode.removeChild(canvasRef.current);
            canvasRef.current = null;
        }
    };

    // Setup the canvas and animation
    const setupMatrixAnimation = () => {
        // Get terminal container
        const terminalContainer = document.querySelector('.terminal-content-area');
        if (!terminalContainer) return;

        // Create canvas if it doesn't exist
        let canvas = document.getElementById('matrix-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'matrix-canvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '0'; // Behind content
            canvas.style.pointerEvents = 'none'; // Allow clicking through

            terminalContainer.appendChild(canvas);
        }

        // Set canvas size to match container
        const { width, height } = terminalContainer.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        // Get font metrics
        const computedStyle = window.getComputedStyle(terminalContainer);
        const fontSize = parseInt(computedStyle.getPropertyValue('font-size'), 10) || 16;
        const charWidth = fontSize * 0.6; // Approximate monospace width

        // Store canvas reference
        canvasRef.current = canvas;

        // Calculate columns
        const columns = Math.ceil(width / charWidth);

        // Initialize or reset drops
        if (!dropsRef.current.length) {
            dropsRef.current = [];
            for (let i = 0; i < columns; i++) {
                dropsRef.current.push({
                    y: Math.random() * -20, // Start above screen
                    speed: Math.random() * 0.5 + 0.5,
                    length: Math.floor(Math.random() * 15) + 5,
                    chars: Array(20).fill().map(() => matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))),
                    active: Math.random() < 0.3 // Some columns start active
                });
            }
        } else {
            // Adjust for new column count
            if (dropsRef.current.length < columns) {
                // Add more drops if canvas got wider
                for (let i = dropsRef.current.length; i < columns; i++) {
                    dropsRef.current.push({
                        y: Math.random() * -20,
                        speed: Math.random() * 0.5 + 0.5,
                        length: Math.floor(Math.random() * 15) + 5,
                        chars: Array(20).fill().map(() => matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))),
                        active: Math.random() < 0.3
                    });
                }
            } else if (dropsRef.current.length > columns) {
                // Remove excess drops if canvas got narrower
                dropsRef.current = dropsRef.current.slice(0, columns);
            }
        }

        // Start or restart animation
        startAnimation(canvas, charWidth, fontSize);

        return { canvas, terminalContainer, charWidth, fontSize };
    };

    // Start the animation loop
    const startAnimation = (canvas, charWidth, fontSize) => {
        // Cancel any existing animation
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        // Get canvas context
        const ctx = canvas.getContext('2d');

        // Animation loop
        const animate = () => {
            if (!running || exitingAnimation || !canvasRef.current) {
                return;
            }

            // Semi-transparent black for fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw each column
            dropsRef.current.forEach((drop, i) => {
                // Skip inactive drops
                if (!drop.active) {
                    // Randomly activate drops
                    if (Math.random() < 0.002) {
                        drop.active = true;
                        drop.y = Math.random() * -20;
                    }
                    return;
                }

                // Move drop down
                drop.y += drop.speed;

                // Add new character when needed
                if (Math.floor(drop.y) >= drop.chars.length) {
                    drop.chars.push(matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)));
                }

                // Draw the trail
                const maxChars = Math.min(Math.floor(drop.y) + 1, drop.chars.length);
                for (let j = 0; j < maxChars; j++) {
                    // Check if visible
                    const yPos = (drop.y - j) * fontSize;
                    if (yPos < -fontSize || yPos > canvas.height) continue;

                    // Set font size
                    ctx.font = `${fontSize}px monospace`;

                    // Different brightness based on position in trail
                    const distFromHead = j;

                    if (j === 0) {
                        // Leading character (300% brightness - white)
                        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                    } else if (j <= 2) {
                        // First few characters (120% brightness - bright green)
                        ctx.fillStyle = 'rgba(0, 255, 0, 1)';
                    } else {
                        // Rest of trail (fading to darker green)
                        const alpha = Math.max(0, 1 - (j / drop.length));
                        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
                    }

                    // Draw the character
                    const charIndex = drop.chars.length - 1 - j;
                    if (charIndex >= 0) {
                        ctx.fillText(drop.chars[charIndex], i * charWidth, yPos);
                    }
                }

                // Deactivate drop when it goes off screen
                if (drop.y * fontSize > canvas.height + drop.length * fontSize) {
                    drop.active = false; // Deactivate
                    drop.y = Math.random() * -20; // Move back to top
                    drop.chars = []; // Reset chars
                }
            });

            // Continue animation
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Start the animation
        animate();
    };

    // Initialize animation
    useEffect(() => {
        // Initial setup
        const { terminalContainer } = setupMatrixAnimation() || {};

        if (terminalContainer) {
            // Set up resize observer to handle terminal resizing
            const resizeObserver = new ResizeObserver(() => {
                // Debounce resize events
                if (resizeTimeout) {
                    clearTimeout(resizeTimeout);
                }

                const resizeTimeout = setTimeout(() => {
                    if (!exitingAnimation && running) {
                        setupMatrixAnimation();
                    }
                }, 100);
            });

            // Observe the terminal container for size changes
            resizeObserver.observe(terminalContainer);
            resizeObserverRef.current = resizeObserver;
        }

        // Handle key press - ensure this works for Ctrl+C
        const keyDownHandler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !exitingAnimation) {
                stopAnimation();
            }
        };

        // Add event listener directly to document
        document.addEventListener('keydown', keyDownHandler, { capture: true });

        // Auto-complete after 30 seconds
        const autoCompleteTimer = setTimeout(() => {
            if (running && !exitingAnimation) {
                stopAnimation();
            }
        }, 30000);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', keyDownHandler, { capture: true });
            clearTimeout(autoCompleteTimer);

            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
                resizeObserverRef.current = null;
            }

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }

            removeMatrixCanvas();
        };
    }, [running, exitingAnimation]);

    return (
        <div className="matrix-animation" style={{
            position: 'relative',
            minHeight: '100px',
            width: '100%',
            color: '#0F0',
            textAlign: 'center',
            padding: '40px 0'
        }}>
            <div style={{
                fontWeight: 'bold',
                color: '#0F0',
                textShadow: '0 0 5px #0F0',
                fontSize: '1.2em',
                zIndex: '5',
                position: 'relative'
            }}>
                THE MATRIX HAS YOU - PRESS CTRL+C TO EXIT
            </div>
        </div>
    );
};

export default memo(MatrixAnimation);