import React, { useEffect, useRef, useState, memo } from 'react';

// A highly optimized CRTEffects component that maintains the same visual appearance
// but significantly reduces unnecessary renders and improves performance

// Memoized CRTOverlay component for better performance
const CRTOverlay = memo(({ className }) => (
    <div className={`crt-overlay ${className}`} />
));

CRTOverlay.displayName = 'CRTOverlay';

// Main CRTEffects component
const CRTEffects = () => {
    // Use a reference for tracking flashing state to avoid re-renders
    const flashingRef = useRef(true);
    // Use state only for the initial render
    const [isInitialRender, setIsInitialRender] = useState(true);
    // Use refs for animation timers and state that doesn't need to trigger renders
    const animationFrameRef = useRef(null);
    const jitterTimeoutRef = useRef(null);
    // Add a visibility tracking ref
    const isVisibleRef = useRef(true);

    // Add visibility tracking with Page Visibility API
    useEffect(() => {
        // Function to handle visibility changes
        const handleVisibilityChange = () => {
            const isVisible = document.visibilityState === 'visible';
            isVisibleRef.current = isVisible;

            // If the page becomes visible again, restart animations if needed
            if (isVisible && !isInitialRender) {
                // Cancel any existing animation frame to avoid duplicates
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }

                // Restart the scanning jitter effect
                startScanlineJitter();
            } else if (!isVisible) {
                // If page becomes hidden, stop animations to save resources
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                    animationFrameRef.current = null;
                }

                if (jitterTimeoutRef.current) {
                    clearTimeout(jitterTimeoutRef.current);
                    jitterTimeoutRef.current = null;
                }

                // Reset scanline jitter
                document.documentElement.style.setProperty('--scanline-jitter', '0px');
            }
        };

        // Listen for visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isInitialRender]);

    // Separate useEffect for the initialization to run only once
    useEffect(() => {
        // Only run this effect on initial render
        if (isInitialRender) {
            // Set initial CSS property right away
            document.documentElement.style.setProperty('--scanline-jitter', '0px');

            // Schedule the flash to disappear after 800ms
            const flashTimer = setTimeout(() => {
                flashingRef.current = false;
                // Force a single re-render after flash disappears
                setIsInitialRender(false);
                // Start the jitter effect only after initial flash is gone
                startScanlineJitter();
            }, 800);

            // Clean up on unmount
            return () => {
                clearTimeout(flashTimer);
            };
        }
    }, [isInitialRender]);

    // Start the scanline jitter effect - optimized to use requestAnimationFrame efficiently
    const startScanlineJitter = () => {
        let lastJitterTime = 0;
        const jitterInterval = 250; // Slightly increased to reduce CPU usage

        // Self-contained jitter function that doesn't need component state
        const createJitter = (time) => {
            // Skip animation frame if page is not visible
            if (!isVisibleRef.current) {
                return;
            }

            // Only create jitter occasionally based on time and probability
            if (time - lastJitterTime > jitterInterval && Math.random() > 0.85) {
                lastJitterTime = time;
                const jitter = Math.floor(Math.random() * 6) - 3; // Reduced range -3px to 3px

                // Set jitter directly on the CSS variable
                document.documentElement.style.setProperty('--scanline-jitter', `${jitter}px`);

                // Reset jitter after a short delay
                jitterTimeoutRef.current = setTimeout(() => {
                    // Only reset if page is still visible
                    if (isVisibleRef.current) {
                        document.documentElement.style.setProperty('--scanline-jitter', '0px');
                    }
                }, 100);
            }

            // Continue the animation loop with reference for cleanup
            // Only if page is visible
            if (isVisibleRef.current) {
                animationFrameRef.current = requestAnimationFrame(createJitter);
            }
        };

        // Initial call to start the loop
        animationFrameRef.current = requestAnimationFrame(createJitter);
    };

    // Single cleanup effect that handles all animations
    useEffect(() => {
        // Cleanup function runs on unmount
        return () => {
            // Cancel any pending animation frames
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            // Clear any timeouts
            if (jitterTimeoutRef.current) {
                clearTimeout(jitterTimeoutRef.current);
            }
            // Reset CSS variable
            document.documentElement.style.setProperty('--scanline-jitter', '0px');
        };
    }, []);

    // Pre-defined overlays to avoid recreating them on every render
    // The flash class conditionally includes 'active' based on the ref
    return (
        <div className="crt-container">
            <CRTOverlay className={`crt-flash ${flashingRef.current ? 'active' : ''}`} />
            <CRTOverlay className="crt-scanlines pausable-animation" />
            <CRTOverlay className="crt-vignette pausable-animation" />
            <CRTOverlay className="crt-flicker pausable-animation" />
            <CRTOverlay className="crt-static pausable-animation" />
            <CRTOverlay className="crt-distortion pausable-animation" />
        </div>
    );
};

export default memo(CRTEffects);