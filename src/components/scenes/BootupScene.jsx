// BootupScene.js - Updated with animated borders, header and footer
import React, { useEffect, useRef, useState } from 'react';

// Terminal text data with color parsing
const terminalData = [
    "[c2]NuCaloric BioTech Industries[/c2]",
    "[cf]────────────────────────────────[/cf]",
    "",
    "Color Test: [c0]█[/c0][c1]█[/c1][c2]█[/c2][c3]█[/c3][c4]█[/c4][c5]█[/c5][c6]█[/c6][c7]█[/c7][c8]█[/c8][c9]█[/c9][ca]█[/ca][cb]█[/cb][cc]█[/cc][cd]█[/cd][ce]█[/ce][cf]█[/cf]",
    "",
    "[c3]Quantified Health Monitoring System[/c3]",
    "[c7]v3.2.1 (Build 7720-RC2)[/c7]",
    "[p1][/p1]",
    "[cd]█████████     ███      ███[/cd]",
    "[cd]███      ███  ███      ███[/cd]",
    "[cd]███      ███  ███      ███[/cd]",
    "[cd]███      ███  █████████   [/cd]",
    "",
    "[p1]NuCaloric Systems v3.2.1 - Initializing...[/p1]",
    "[c8]* Initializing system hardware...[/c8]",
    "[c8]* Performing memory checks...[/c8]",
    "  - Primary memory bank.............. [c2]OK[/c2]",
    "  - Extended memory.................. [c2]OK[/c2]",
    "  - Cache coherency.................. [c2]OK[/c2]",
    "  - NVRAM integrity.................. [c2]OK[/c2]",
    "",
    "Loading kernel modules.......... [c2]OK[/c2]",
    "Loading microcode patches....... [c2]OK[/c2]",
    "Checking system integrity...... [c2]OK[/c2]",
    "Initializing memory............. [c2]OK[/c2]",
    "Starting memory manager......... [c2]OK[/c2]",
    "Initializing device tree........ [c2]OK[/c2]",
    "Loading device drivers.......... [c2]OK[/c2]",
    "Initializing PCI bus............ [c2]OK[/c2]",
    "Probing USB controllers......... [c2]OK[/c2]",
    "Starting I/O subsystem.......... [c2]OK[/c2]",
    "Mounting file systems........... [c2]OK[/c2]",
    "Starting system logger.......... [c2]OK[/c2]",
    "Starting network services....... [c2]OK[/c2]",
    "Establishing secure connection... [c2]OK[/c2]",
    "Starting firewall............... [c2]OK[/c2]",
    "Starting authentication service.. [c2]OK[/c2]",
    "Checking database integrity..... [c2]OK[/c2]",
    "Starting database service....... [c2]OK[/c2]",
    "Connecting to central node...... [c2]OK[/c2]",
    "Loading user profiles........... [c2]OK[/c2]",
    "Initializing metrics subsystem.. [c2]OK[/c2]",
    "",
    "[c4]WARNING: Security protocol override detected[/c4]",
    "[c4]WARNING: Unauthorized access attempt - Sector 7G[/c4]",
    "[c4]WARNING: Memory corruption detected in security module[/c4]",
    "[c2]NOTICE: Applying countermeasures...[/c2]",
    "[c2]NOTICE: Rerouting security protocols...[/c2]",
    "[c2]NOTICE: Enabling quantum encryption layer...[/c2]",
    "[c3]SYSTEM: Diagnostics complete[/c3]",
    "[c3]SYSTEM: All core systems functional[/c3]",
    "[c4]ALERT: System glitch detected...[/c4]",
    "[c4]ALERT: Memory address fault at 0xF7A23D1C[/c4]",
    "[c4]ALERT: Stack corruption in visualization module[/c4]",
    "[cd]CRITICAL: Interface corruption imminent...[/cd]",
    "[cd]CRITICAL: Graphics subsystem unstable[/cd]",
    "[cd]CRITICAL: Neural interface desynchronized[/cd]",
    "[ce]SYSTEM: Transitioning to backup interface...[/ce]",
    "[ce]SYSTEM: Rerouting visual protocols...[/ce]",
    "[ce]SYSTEM: Enabling failsafe mode...[/ce]",
    "",
    "[c2]Initializing NuCaloric emergency interface...[/c2]",
    "[c3]Loading baseline protocols...[/c3]",
    "[c3]Establishing secure session...[/c3]",
    "[c7]NuCaloric interface loading...[/c7]"
];

const BootupScene = ({ onComplete }) => {
    const terminalContentRef = useRef(null);
    const [currentLine, setCurrentLine] = useState(0);
    const [bootupComplete, setBootupComplete] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);
    const [visibleLines, setVisibleLines] = useState([]);
    const [showHeaderFooter, setShowHeaderFooter] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Start time display
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    useEffect(() => {
        // Start adding terminal lines with a slight delay
        const timeout = setTimeout(() => {
            processNextLine();
        }, 500);

        // Apply CRT turn-on animation to the terminal
        const terminal = document.querySelector('.bootup-scene');
        if (terminal) {
            terminal.classList.add('crt-startup');
        }

        // Show header and footer after a brief delay
        setTimeout(() => {
            setShowHeaderFooter(true);
        }, 1500);

        return () => clearTimeout(timeout);
    }, []);

    // Process terminal lines recursively
    useEffect(() => {
        if (currentLine < terminalData.length) {
            const lineData = terminalData[currentLine];

            // Check for pause tag [pX] where X is seconds
            const pauseMatch = lineData.match(/\[p(\d+)\]/);
            let delay = 70; // Default delay between lines

            if (pauseMatch) {
                // Extract pause duration and handle it
                const pauseDuration = parseInt(pauseMatch[1]) * 1000;
                delay += pauseDuration;
            }

            const timeout = setTimeout(() => {
                // Add new line to visible lines
                setVisibleLines(prev => [...prev, terminalData[currentLine]]);
                processNextLine();
            }, delay);

            return () => clearTimeout(timeout);
        } else if (!bootupComplete) {
            // All lines processed, wait a moment and trigger glitch effect
            const timeout = setTimeout(() => {
                setIsGlitching(true);

                // Wait for glitch animation then trigger scene change
                setTimeout(() => {
                    setBootupComplete(true);
                    if (onComplete) onComplete();
                }, 2000);
            }, 1500);

            return () => clearTimeout(timeout);
        }
    }, [currentLine, bootupComplete, onComplete]);

    // Effect to scroll to bottom whenever lines are added
    useEffect(() => {
        if (terminalContentRef.current) {
            terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
        }
    }, [visibleLines]);

    // Process the next line of terminal output
    const processNextLine = () => {
        setCurrentLine(prevLine => prevLine + 1);
    };

    // Parse color tags in terminal text
    const parseColorTags = (text) => {
        // Replace color tags with spans
        let parsedText = text;

        // Match [cX]text[/cX] pattern where X is a hex digit
        const colorRegex = /\[c([0-9a-f])\](.*?)\[\/c\1\]/g;
        parsedText = parsedText.replace(colorRegex, (match, color, content) => {
            return `<span class="c${color}">${content}</span>`;
        });

        // Remove pause tags
        parsedText = parsedText.replace(/\[p\d+\]/g, '');

        return parsedText;
    };

    return (
        <div className={`bootup-scene ${isGlitching ? 'glitching' : ''}`}>
            {showHeaderFooter && (
                <div className="terminal-header">
                    <span className="glow-text">NuCaloric Operating System</span>
                    <span>{formatTime(currentTime)}</span>
                </div>
            )}

            <div ref={terminalContentRef} className="terminal-content">
                {visibleLines.map((line, index) => (
                    <div
                        key={index}
                        className="terminal-line"
                        dangerouslySetInnerHTML={{ __html: parseColorTags(line) }}
                    />
                ))}
            </div>

            {showHeaderFooter && (
                <div className="terminal-footer">
                    <span className="glow-text">Sponsored by CyAc</span>
                    <span>v3.2.1</span>
                </div>
            )}
        </div>
    );
};

export default BootupScene;