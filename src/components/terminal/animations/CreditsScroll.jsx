// CreditsScroll.jsx - Scrolling credits animation
import React, { useState, useEffect, useRef, memo } from 'react';

// Credits content
const credits = [
    "NuCaloric System",
    "Version 3.2.1",
    "",
    "DEVELOPED BY",
    "Cotton Le Sergal",
    "",
    "LEAD DEVELOPER",
    "Cotton Le Sergal",
    "",
    "AI ARCHITECTURE",
    "Prof. Alan Turing",
    "",
    "QUANTUM ALGORITHMS",
    "Dr. Richard Feynman",
    "",
    "UI/UX DESIGN",
    "Cotton Le Sergal",
    "",
    "SECURITY PROTOCOLS",
    "Non Existent",
    "",
    "NEURAL NETWORK OPTIMIZATION",
    "Dr. Geoffrey Hinton",
    "",
    "DATA INFRASTRUCTURE",
    "Linus Torvalds",
    "",
    "PROPAGANDA MEDIA",
    "NuCaloric On Burger Society Discord",
    "",
    "SPECIAL THANKS",
    "NuCaloric On Burger Society Discord",
    "camo - for showing me cloudflare pages",
    "And all of those that offered me support",
    "",
    "© 2025 Cotton Le Sergal",
    "ALL RIGHTS RESERVED",
    "",
    "NO ANIMALS WERE HARMED (EXCEPT WORMS)",
    "IN THE MAKING OF THIS TERMINAL",
    "",
    "END TRANSMISSION"
];

const CreditsScroll = ({ onExit, setCreditsCompleted }) => {
    const [running, setRunning] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const intervalRef = useRef(null);

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

        // Scroll animation
        intervalRef.current = setInterval(() => {
            if (running) {
                setScrollPosition(p => {
                    // Reset when we reach the end
                    if (p >= credits.length) {
                        if (setCreditsCompleted) {
                            setCreditsCompleted(true);
                        }
                        if (onExit) {
                            onExit(true);
                        }
                        return 0;
                    }
                    return p + 0.1; // Slow scroll
                });
            }
        }, 100);

        return () => {
            clearInterval(intervalRef.current);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [running, onExit, setCreditsCompleted]);

    // Render visible credits lines
    const renderCredits = () => {
        const visibleLines = [];
        const startLine = Math.floor(scrollPosition);
        const maxLines = 15; // Maximum visible lines

        for (let i = 0; i < maxLines; i++) {
            const lineIndex = startLine + i;
            if (lineIndex < credits.length) {
                const offsetFade = i - (scrollPosition - startLine);
                const opacity = offsetFade < 0 ? 0 :
                    offsetFade > maxLines - 3 ? 0 :
                        offsetFade < 2 ? offsetFade / 2 :
                            offsetFade > maxLines - 5 ? (maxLines - offsetFade) / 3 :
                                1;

                // Style based on content type (headers, etc.)
                const fontSize = offsetFade > 3 && offsetFade < maxLines - 3 &&
                (credits[lineIndex].startsWith('SPECIAL THANKS') ||
                    credits[lineIndex].startsWith('DEVELOPED BY') ||
                    credits[lineIndex].startsWith('LEAD DEVELOPER') ||
                    credits[lineIndex].startsWith('AI ARCHITECTURE') ||
                    credits[lineIndex].startsWith('QUANTUM ALGORITHMS') ||
                    credits[lineIndex].startsWith('UI/UX DESIGN') ||
                    credits[lineIndex].startsWith('SECURITY PROTOCOLS') ||
                    credits[lineIndex].startsWith('NEURAL NETWORK') ||
                    credits[lineIndex].startsWith('DATA INFRASTRUCTURE'))
                    ? '1.2em' : '1em';

                const color = credits[lineIndex].startsWith('DEVELOPED BY') ||
                credits[lineIndex].startsWith('LEAD DEVELOPER') ||
                credits[lineIndex].startsWith('AI ARCHITECTURE') ||
                credits[lineIndex].startsWith('QUANTUM ALGORITHMS') ||
                credits[lineIndex].startsWith('UI/UX DESIGN') ||
                credits[lineIndex].startsWith('SECURITY PROTOCOLS') ||
                credits[lineIndex].startsWith('NEURAL NETWORK') ||
                credits[lineIndex].startsWith('DATA INFRASTRUCTURE') ||
                credits[lineIndex].startsWith('SPECIAL THANKS')
                    ? '#3F3' : '#FFF';

                visibleLines.push(
                    <div key={lineIndex} style={{
                        opacity,
                        fontSize,
                        color,
                        textAlign: 'center',
                        fontWeight: fontSize === '1.2em' ? 'bold' : 'normal',
                        marginBottom: '5px'
                    }}>
                        {credits[lineIndex]}
                    </div>
                );
            }
        }

        return visibleLines;
    };

    return (
        <div className="credits-scroll" style={{ padding: '20px 0' }}>
            {renderCredits()}
            <div style={{ marginTop: '20px', textAlign: 'center', color: '#33FF33' }}>
                PRESS CTRL+C TO EXIT
            </div>
        </div>
    );
};

export default memo(CreditsScroll);