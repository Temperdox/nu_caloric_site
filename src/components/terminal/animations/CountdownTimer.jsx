// CountdownTimer.jsx - Terminal countdown timer
import React, { useState, useEffect, useRef, memo } from 'react';

const CountdownTimer = ({ seconds, onComplete, onExit, setTimerCompleted }) => {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [running, setRunning] = useState(true);
    const intervalRef = useRef(null);

    // Format time as mm:ss
    const formatTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const remainingSeconds = secs % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

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

        // Timer countdown
        intervalRef.current = setInterval(() => {
            if (running) {
                setTimeLeft(time => {
                    if (time <= 1) {
                        // Timer complete
                        clearInterval(intervalRef.current);
                        if (setTimerCompleted) {
                            setTimerCompleted(true);
                        }
                        if (onComplete) {
                            setTimeout(() => onComplete(true), 100);
                        }
                        return 0;
                    }
                    return time - 1;
                });
            }
        }, 1000);

        return () => {
            clearInterval(intervalRef.current);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [running, onComplete, onExit, setTimerCompleted]);

    // Calculate progress percentage
    const progressPercent = ((seconds - timeLeft) / seconds) * 100;

    // Render progress bar
    const renderProgressBar = () => {
        const width = 40; // Bar width in characters
        const filled = Math.floor((progressPercent / 100) * width);

        return `[${filled > 0 ? '='.repeat(filled) : ''}${filled < width ? ' '.repeat(width - filled) : ''}] ${Math.floor(progressPercent)}%`;
    };

    // Get color based on time left (green → yellow → red)
    const getTimeColor = () => {
        const percentLeft = (timeLeft / seconds) * 100;

        if (percentLeft > 66) return '#33FF33'; // Green
        if (percentLeft > 33) return '#FFFF33'; // Yellow
        return '#FF3333'; // Red
    };

    return (
        <div className="countdown-timer" style={{
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            lineHeight: '1.5',
            textAlign: 'center',
            padding: '10px'
        }}>
            <div style={{
                fontSize: '2em',
                margin: '10px 0',
                color: getTimeColor(),
                fontWeight: 'bold'
            }}>
                {formatTime(timeLeft)}
            </div>

            <div style={{ marginBottom: '15px' }}>
                {renderProgressBar()}
            </div>

            <div style={{
                marginTop: '10px',
                fontSize: '0.9em',
                color: timeLeft > 0 ? '#AAA' : '#33FF33'
            }}>
                {timeLeft > 0 ? 'Press Ctrl+C to cancel' : 'Timer complete!'}
            </div>
        </div>
    );
};

export default memo(CountdownTimer);