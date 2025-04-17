// MatrixAnimation.jsx - ASCII Matrix-style digital rain animation
import React, { useState, useEffect, useRef, memo } from 'react';

const MatrixAnimation = ({ onExit, setMatrixCompleted }) => {
    const [running, setRunning] = useState(true);
    const [frame, setFrame] = useState(0);
    const intervalRef = useRef(null);
    const matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$+-=*/()[]{}<>!?';

    // Handle key press for exit
    useEffect(() => {
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

        // Generate frames with a more random, dynamic look
        intervalRef.current = setInterval(() => {
            if (running) {
                setFrame(f => (f + 1) % 1000); // Large number to avoid looping quickly
            }
        }, 100);

        // Auto-complete after 20 seconds
        const autoCompleteTimer = setTimeout(() => {
            if (running) {
                setRunning(false);
                if (setMatrixCompleted) {
                    setMatrixCompleted(true);
                }
                if (onExit) {
                    setTimeout(() => onExit(true), 100);
                }
            }
        }, 20000);

        return () => {
            clearInterval(intervalRef.current);
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(autoCompleteTimer);
        };
    }, [running, onExit, setMatrixCompleted]);

    // Get a random matrix character
    const getMatrixChar = () => {
        return matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
    };

    // Generate a matrix frame dynamically
    const generateMatrixFrame = () => {
        const rows = 15;
        const cols = 60;
        const matrixLines = [];

        for (let i = 0; i < rows; i++) {
            let line = '';
            for (let j = 0; j < cols; j++) {
                // Create raining effect based on frame and position
                const shouldShowChar = (j + i + frame) % 3 === 0;
                const char = shouldShowChar ? getMatrixChar() : ' ';

                // Color based on "depth" - brighter at top of streams
                const isHead = shouldShowChar && (j + i + frame) % 9 === 0;

                if (isHead) {
                    line += `<span style="color: #FFFFFF">${char}</span>`;
                } else if (shouldShowChar) {
                    const brightness = Math.max(0, 255 - ((j + i) % 5) * 30);
                    line += `<span style="color: rgb(0, ${brightness}, 0)">${char}</span>`;
                } else {
                    line += char;
                }
            }
            matrixLines.push(line);
        }

        return matrixLines.join('\n');
    };

    return (
        <div className="matrix-animation">
            <div
                dangerouslySetInnerHTML={{ __html: generateMatrixFrame() }}
                style={{
                    backgroundColor: '#000',
                    color: '#0F0',
                    fontFamily: 'monospace',
                    lineHeight: '1.2',
                    whiteSpace: 'pre',
                    padding: '10px'
                }}
            />
            <div style={{ marginTop: '10px', color: '#0F0', textAlign: 'center' }}>
                THE MATRIX HAS YOU - PRESS CTRL+C TO EXIT
            </div>
        </div>
    );
};

export default memo(MatrixAnimation);