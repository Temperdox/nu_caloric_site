// HackAnimation.jsx - Fake hacking animation
import React, { useState, useEffect, useRef, memo } from 'react';

// Define stages for the hack sequence
const HACK_STAGES = [
    {
        name: 'Initializing exploit vectors',
        duration: 10
    },
    {
        name: 'Bypassing firewall',
        duration: 15
    },
    {
        name: 'Injecting payload',
        duration: 20
    },
    {
        name: 'Elevating privileges',
        duration: 15
    },
    {
        name: 'Accessing mainframe',
        duration: 10
    },
    {
        name: 'Extracting data',
        duration: 20
    },
    {
        name: 'Covering tracks',
        duration: 10
    }
];

const HackAnimation = ({ target, onExit, setHackCompleted }) => {
    const [running, setRunning] = useState(true);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState(0);
    const [statusText, setStatusText] = useState('Initializing exploit vectors...');
    const [isComplete, setIsComplete] = useState(false);
    const intervalRef = useRef(null);

    // Handle key press for exit
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Exit on Ctrl+C or Cmd+C, but only if still running and not complete
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && running && !isComplete) {
                setRunning(false);
                if (onExit) {
                    setTimeout(() => onExit(false), 100);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Progress animation
        intervalRef.current = setInterval(() => {
            if (running && !isComplete) {
                setProgress(p => {
                    // Safely check if stage exists in the array
                    if (stage >= 0 && stage < HACK_STAGES.length) {
                        const currentStage = HACK_STAGES[stage];
                        const newProgress = p + 1;

                        // Check if current stage is complete
                        if (newProgress >= currentStage.duration) {
                            // Move to next stage
                            if (stage < HACK_STAGES.length - 1) {
                                setStage(s => s + 1);
                                setStatusText(HACK_STAGES[stage + 1].name + '...');
                                return 0;
                            } else {
                                // Hack complete
                                clearInterval(intervalRef.current);
                                setStatusText(`Hack complete! Access to ${target} granted.`);
                                setIsComplete(true);

                                // Mark as completed in the parent component
                                if (setHackCompleted) {
                                    setHackCompleted(true);
                                }

                                // Auto-exit after showing completion for 2 seconds
                                setTimeout(() => {
                                    if (onExit) {
                                        onExit(true); // true indicates normal completion
                                    }
                                }, 2000);

                                return currentStage.duration;
                            }
                        }
                        return newProgress;
                    }
                    // Safety fallback if stage is invalid
                    return p;
                });
            }
        }, 300);

        return () => {
            clearInterval(intervalRef.current);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [running, stage, target, onExit, setHackCompleted, isComplete]);

    // Get progress percentage safely
    const getProgressPercentage = () => {
        // Calculate overall progress across all stages
        const totalSteps = HACK_STAGES.reduce((sum, s) => sum + s.duration, 0);
        const stepsCompleted = HACK_STAGES.slice(0, stage).reduce((sum, s) => sum + s.duration, 0) + progress;

        return Math.floor((stepsCompleted / totalSteps) * 100);
    };

    // Render progress bar
    const renderProgressBar = () => {
        const percent = getProgressPercentage();
        const width = 50; // Bar width in characters
        const filled = Math.floor((percent / 100) * width);

        return `[${filled > 0 ? '='.repeat(filled) : ''}${filled < width ? ' '.repeat(width - filled) : ''}] ${percent}%`;
    };

    // Generate random hacking gibberish
    const getRandomHexBytes = () => {
        let result = '';
        const hexChars = '0123456789ABCDEF';

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 4; j++) {
                result += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
            }
            result += ' ';
        }

        return result;
    };

    return (
        <div className="hack-animation" style={{
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            lineHeight: '1.2'
        }}>
            <div style={{ color: '#0F0', marginBottom: '10px' }}>
                {`Target: ${target}\nStatus: ${statusText}\n${renderProgressBar()}\n`}
            </div>

            <div style={{ color: '#0F0', opacity: 0.8 }}>
                {Array(5).fill(0).map((_, i) =>
                    <div key={i}>{getRandomHexBytes()}</div>
                )}
            </div>

            <div style={{
                marginTop: '10px',
                color: getProgressPercentage() === 100 ? '#00FF00' : '#FF0000',
                textAlign: 'center',
                fontWeight: 'bold'
            }}>
                {getProgressPercentage() === 100
                    ? 'HACK COMPLETE - SYSTEM COMPROMISED'
                    : 'HACKING IN PROGRESS - PRESS CTRL+C TO ABORT'}
            </div>
        </div>
    );
};

export default memo(HackAnimation);