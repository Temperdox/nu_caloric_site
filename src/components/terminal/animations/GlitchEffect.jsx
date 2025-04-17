// GlitchEffect.jsx - Visual glitch effect for terminal
import React, { useState, useEffect, useRef, memo } from 'react';

const GlitchEffect = ({ onExit, setGlitchCompleted }) => {
    const [running, setRunning] = useState(true);
    const [glitchIntensity, setGlitchIntensity] = useState(0);
    const glitchRef = useRef(null);
    const terminalRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Get reference to terminal content area
        const terminal = document.querySelector('.terminal-content-area');
        if (terminal) {
            terminalRef.current = terminal;

            // Apply initial glitch styles
            terminal.style.position = 'relative';
            terminal.style.overflow = 'hidden';
        }

        // Create glitch overlay element
        const glitchElement = document.createElement('div');
        glitchElement.className = 'terminal-glitch-overlay';
        glitchElement.style.position = 'absolute';
        glitchElement.style.top = '0';
        glitchElement.style.left = '0';
        glitchElement.style.width = '100%';
        glitchElement.style.height = '100%';
        glitchElement.style.pointerEvents = 'none';
        glitchElement.style.zIndex = '1000';

        if (terminal) {
            terminal.appendChild(glitchElement);
            glitchRef.current = glitchElement;
        }

        // Random glitch effect function
        const applyRandomGlitch = () => {
            if (!running || !glitchRef.current || !terminalRef.current) return;

            // Generate random glitch intensity (0-10)
            const intensity = Math.random() * 10;
            setGlitchIntensity(intensity);

            // Apply random glitch effects based on intensity
            // Apply to the terminal text
            if (intensity > 7) {
                terminalRef.current.style.filter = `
                    hue-rotate(${Math.random() * 360}deg) 
                    contrast(${1 + Math.random()})`;
            } else if (intensity > 5) {
                terminalRef.current.style.filter = `
                    brightness(${1 + Math.random() * 0.5}) 
                    contrast(${1 + Math.random() * 0.3})`;
            } else {
                terminalRef.current.style.filter = 'none';
            }

            // Text distortion
            if (intensity > 6) {
                terminalRef.current.style.textShadow = `
                    ${Math.random() * 4 - 2}px 0 rgba(255,0,0,0.5), 
                    ${Math.random() * 4 - 2}px 0 rgba(0,255,255,0.5)`;
            } else {
                terminalRef.current.style.textShadow = 'none';
            }

            // Scanlines or other overlays
            if (glitchRef.current) {
                if (intensity > 8) {
                    // Heavy visual corruption
                    glitchRef.current.style.backgroundImage = `
                        repeating-linear-gradient(
                            0deg,
                            rgba(0, 0, 0, 0.2),
                            rgba(0, 0, 0, 0.2) ${Math.random() * 2 + 1}px,
                            transparent ${Math.random() * 2 + 1}px,
                            transparent ${Math.random() * 5 + 2}px
                        )`;

                    // Random blocks of "corrupt data"
                    const blockCount = Math.floor(Math.random() * 5) + 1;
                    glitchRef.current.innerHTML = '';

                    for (let i = 0; i < blockCount; i++) {
                        const block = document.createElement('div');
                        const size = Math.random() * 50 + 10;
                        const color = Math.random() > 0.5 ?
                            'rgba(255,0,0,0.2)' : 'rgba(0,255,255,0.2)';

                        Object.assign(block.style, {
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            backgroundColor: color,
                            transform: `rotate(${Math.random() * 30 - 15}deg)`,
                            opacity: Math.random() * 0.7 + 0.3
                        });

                        glitchRef.current.appendChild(block);
                    }

                } else if (intensity > 5) {
                    // Medium glitch - scanlines
                    glitchRef.current.style.backgroundImage = `
                        repeating-linear-gradient(
                            0deg,
                            rgba(0, 0, 0, 0.1),
                            rgba(0, 0, 0, 0.1) 1px,
                            transparent 1px,
                            transparent 2px
                        )`;
                    glitchRef.current.innerHTML = '';

                } else {
                    // Light or no glitch
                    glitchRef.current.style.backgroundImage = 'none';
                    glitchRef.current.innerHTML = '';
                }
            }

            // Simulate screen tearing
            if (intensity > 7 && Math.random() > 0.7) {
                const tearCount = Math.floor(Math.random() * 3) + 1;

                for (let i = 0; i < tearCount; i++) {
                    const tearLine = document.createElement('div');
                    const yPosition = Math.random() * 100;
                    const xOffset = Math.random() * 10 - 5;

                    Object.assign(tearLine.style, {
                        position: 'absolute',
                        left: '0',
                        top: `${yPosition}%`,
                        width: '100%',
                        height: `${Math.random() * 20 + 5}px`,
                        overflow: 'hidden',
                        transform: `translateX(${xOffset}px)`,
                        zIndex: '100'
                    });

                    // Clone a portion of the terminal and show it shifted
                    if (terminalRef.current) {
                        const cloneSource = terminalRef.current.cloneNode(true);
                        Object.assign(cloneSource.style, {
                            position: 'absolute',
                            top: `-${yPosition}%`,
                            left: `${-xOffset}px`,
                            width: '100%',
                            height: '100%'
                        });

                        tearLine.appendChild(cloneSource);
                    }

                    if (glitchRef.current) {
                        glitchRef.current.appendChild(tearLine);
                    }
                }
            }

            // Schedule next glitch effect
            const glitchDuration = Math.random() * 300 + 50;
            setTimeout(() => {
                if (running) {
                    // Reset some effects
                    if (Math.random() > 0.3) {
                        if (terminalRef.current) {
                            terminalRef.current.style.filter = 'none';
                            terminalRef.current.style.textShadow = 'none';
                        }

                        if (glitchRef.current) {
                            glitchRef.current.innerHTML = '';
                            glitchRef.current.style.backgroundImage = 'none';
                        }
                    }
                }
            }, glitchDuration);
        };

        // Start glitch loop
        intervalRef.current = setInterval(() => {
            if (Math.random() > 0.6) {
                applyRandomGlitch();
            }
        }, 500);

        // Handle key press for exit
        const handleKeyDown = (e) => {
            // Exit on Ctrl+C or Cmd+C
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && running) {
                setRunning(false);
                if (onExit) {
                    setTimeout(() => onExit(false), 100);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Auto-complete after 15 seconds
        const autoCompleteTimer = setTimeout(() => {
            if (running) {
                setRunning(false);
                if (setGlitchCompleted) {
                    setGlitchCompleted(true);
                }
                if (onExit) {
                    setTimeout(() => onExit(true), 100);
                }
            }
        }, 15000);

        // Cleanup function
        return () => {
            setRunning(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            if (glitchRef.current && glitchRef.current.parentNode) {
                glitchRef.current.parentNode.removeChild(glitchRef.current);
            }

            if (terminalRef.current) {
                terminalRef.current.style.filter = 'none';
                terminalRef.current.style.textShadow = 'none';
            }

            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(autoCompleteTimer);
        };
    }, [running, onExit, setGlitchCompleted]);

    // Simple indicator that glitch mode is active
    return (
        <div className="glitch-effect-indicator" style={{
            marginTop: '10px',
            color: glitchIntensity > 5 ? '#FF00FF' : '#33FF33',
            textAlign: 'center',
            fontWeight: 'bold'
        }}>
            GLITCH MODE ACTIVE - PRESS CTRL+C TO NORMALIZE
        </div>
    );
};

export default memo(GlitchEffect);