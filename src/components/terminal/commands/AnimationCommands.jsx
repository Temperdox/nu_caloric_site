// AnimationCommands.js - Commands for terminal animations
import React from 'react';
import BurgerAnimation from '../animations/BurgerAnimation';
import MatrixAnimation from '../animations/MatrixAnimation';
import GlitchEffect from '../animations/GlitchEffect';
import CreditsScroll from '../animations/CreditsScroll';
import HackAnimation from '../animations/HackAnimation';
import CountdownTimer from '../animations/CountdownTimer';

/**
 * Commands for terminal animations and visual effects
 */
const AnimationCommands = {
    // Available animation commands - burger is not listed here to keep it hidden
    commands: {
        'matrix': 'Display Matrix-style digital rain animation',
        'glitch': 'Apply visual glitch effects to the terminal',
        'credits': 'Show a scrolling credits screen',
        'hack': 'Show a fake hacking animation',
        'timer': 'Set a countdown timer'
    },

    /**
     * Check if a command is handled by this module - special cases for hidden commands
     * @param {string} command - Command to check
     * @returns {boolean} True if command is handled
     */
    hasCommand(command) {
        // Hidden commands are still valid but not listed in help
        if (command === 'burger') {
            return true;
        }
        return Object.keys(this.commands).includes(command);
    },

    /**
     * Get list of commands and descriptions
     * @returns {object} Command descriptions
     */
    getCommands() {
        // Only return visible commands
        return this.commands;
    },

    /**
     * Execute an animation command
     * @param {string} command - Command to execute
     * @param {Array} args - Command arguments
     * @param {object} terminalState - Current terminal state
     */
    executeCommand(command, args, terminalState) {
        const {
            setBurgerMode,
            setMatrixMode,
            setGlitchMode,
            setCreditsMode,
            setHackMode,
            setHackTarget,
            setTimerActive,
            setTimerSeconds,
            setBurgerCompleted,
            setMatrixCompleted,
            setGlitchCompleted,
            setCreditsCompleted,
            setHackCompleted,
            setTimerCompleted,
            stopBurgerAnimation,
            stopMatrixAnimation,
            stopGlitchEffect,
            stopCredits,
            stopHackAnimation,
            stopTimer,
            addToHistory
        } = terminalState;

        switch (command) {
            // Burger animation is hidden and should only be triggered via "cat on_burger"
            case 'burger':
                // Only to handle direct calls if someone knows the command
                this.startBurgerAnimation(
                    addToHistory,
                    setBurgerMode, setBurgerCompleted,
                    stopBurgerAnimation
                );
                break;
            case 'matrix':
                this.startMatrixAnimation(
                    addToHistory,
                    setMatrixMode, setMatrixCompleted,
                    stopMatrixAnimation
                );
                break;
            case 'glitch':
                this.startGlitchEffect(
                    addToHistory,
                    setGlitchMode, setGlitchCompleted,
                    stopGlitchEffect
                );
                break;
            case 'credits':
                this.startCredits(
                    addToHistory,
                    setCreditsMode, setCreditsCompleted,
                    stopCredits
                );
                break;
            case 'hack':
                this.startHackAnimation(
                    args, addToHistory,
                    setHackMode, setHackTarget, setHackCompleted,
                    stopHackAnimation
                );
                break;
            case 'timer':
                this.startTimer(
                    args, addToHistory,
                    setTimerActive, setTimerSeconds, setTimerCompleted,
                    stopTimer
                );
                break;
            default:
                // This shouldn't happen because of hasCommand check
                addToHistory({ type: 'error', text: `${command}: command not implemented` });
        }
    },

    /**
     * Start burger animation - hidden easter egg command
     */
    startBurgerAnimation(addToHistory, setBurgerMode, setBurgerCompleted, stopBurgerAnimation) {
        setBurgerMode(true);
        setBurgerCompleted(false);

        // Add animation component to history
        addToHistory({
            type: 'component',
            text: <BurgerAnimation
                onExit={stopBurgerAnimation}
                setBurgerCompleted={setBurgerCompleted}
            />
        });
    },

    /**
     * Start Matrix animation
     */
    startMatrixAnimation(addToHistory, setMatrixMode, setMatrixCompleted, stopMatrixAnimation) {
        setMatrixMode(true);
        setMatrixCompleted(false);

        addToHistory({
            type: 'output',
            text: 'Starting Matrix digital rain...\n\nPress Ctrl+C to exit'
        });

        addToHistory({
            type: 'component',
            text: <MatrixAnimation
                onExit={stopMatrixAnimation}
                setMatrixCompleted={setMatrixCompleted}
            />
        });
    },

    /**
     * Start glitch effect
     */
    startGlitchEffect(addToHistory, setGlitchMode, setGlitchCompleted, stopGlitchEffect) {
        setGlitchMode(true);
        setGlitchCompleted(false);

        addToHistory({
            type: 'output',
            text: 'Initiating terminal glitch...\n\nPress Ctrl+C to normalize'
        });

        addToHistory({
            type: 'component',
            text: <GlitchEffect
                onExit={stopGlitchEffect}
                setGlitchCompleted={setGlitchCompleted}
            />
        });
    },

    /**
     * Start credits animation
     */
    startCredits(addToHistory, setCreditsMode, setCreditsCompleted, stopCredits) {
        setCreditsMode(true);
        setCreditsCompleted(false);

        addToHistory({
            type: 'output',
            text: 'NuCaloric System Credits\n\nPress Ctrl+C to exit'
        });

        addToHistory({
            type: 'component',
            text: <CreditsScroll
                onExit={stopCredits}
                setCreditsCompleted={setCreditsCompleted}
            />
        });
    },

    /**
     * Start hacking animation
     */
    startHackAnimation(args, addToHistory, setHackMode, setHackTarget, setHackCompleted, stopHackAnimation) {
        const target = args.length > 0 ? args.join(' ') : 'system';
        setHackTarget(target);
        setHackMode(true);
        setHackCompleted(false);

        addToHistory({
            type: 'output',
            text: `Initiating hack on ${target}...\n\nPress Ctrl+C to abort`
        });

        addToHistory({
            type: 'component',
            text: <HackAnimation
                target={target}
                onExit={stopHackAnimation}
                setHackCompleted={setHackCompleted}
            />
        });
    },

    /**
     * Start countdown timer
     */
    startTimer(args, addToHistory, setTimerActive, setTimerSeconds, setTimerCompleted, stopTimer) {
        if (args.length === 0) {
            addToHistory({
                type: 'error',
                text: 'Usage: timer [seconds]'
            });
            return;
        }

        const seconds = parseInt(args[0]);
        if (isNaN(seconds) || seconds <= 0) {
            addToHistory({
                type: 'error',
                text: 'Invalid time. Please provide a positive number of seconds.'
            });
            return;
        }

        setTimerSeconds(seconds);
        setTimerActive(true);
        setTimerCompleted(false);

        addToHistory({
            type: 'output',
            text: `Timer set for ${seconds} seconds\nPress Ctrl+C to cancel`
        });

        addToHistory({
            type: 'component',
            text: <CountdownTimer
                seconds={seconds}
                onComplete={stopTimer}
                onExit={stopTimer}
                setTimerCompleted={setTimerCompleted}
            />
        });
    }
};

export default AnimationCommands;