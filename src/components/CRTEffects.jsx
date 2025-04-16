import React, { useEffect, useState, useCallback, memo, useMemo } from 'react';

// Memoized CRTOverlay component to prevent unnecessary re-renders
const CRTOverlay = memo(({ className }) => {
    return <div className={`crt-overlay ${className}`}></div>;
});

CRTOverlay.displayName = 'CRTOverlay';

// Main CRTEffects component
const CRTEffects = () => {
    const [effects, setEffects] = useState({
        isFlashing: true,
        scanlineJitter: 0
    });

    // Batch state updates using a single state object
    const updateEffects = useCallback((updates) => {
        setEffects(prev => ({
            ...prev,
            ...updates
        }));
    }, []);

    // Setup CRT effects with useCallback to prevent recreation on renders
    const initCRTEffects = useCallback(() => {
        // Initial white flash effect
        updateEffects({ isFlashing: true });

        // Set document property once
        document.documentElement.style.setProperty('--scanline-jitter', '0px');

        // Use setTimeout only when necessary, with requestAnimationFrame for smoother animations
        setTimeout(() => {
            updateEffects({ isFlashing: false });

            // Start scanline jitter with RAF
            startScanlineJitter();
        }, 800);
    }, [updateEffects]);

    // Use debounced jitter effect for better performance
    const startScanlineJitter = useCallback(() => {
        // Create a throttled jitter to improve performance
        let lastJitterTime = 0;
        const jitterInterval = 200; // ms between possible jitter changes

        // Function to create jitter effect
        const createJitter = (time) => {
            // Only create jitter occasionally and not every frame
            if (time - lastJitterTime > jitterInterval && Math.random() > 0.8) {
                lastJitterTime = time;
                const jitter = Math.floor(Math.random() * 8) - 4; // -4px to 4px

                // Use requestAnimationFrame for smoother updates
                requestAnimationFrame(() => {
                    updateEffects({ scanlineJitter: jitter });

                    // Apply jitter to CSS variable
                    document.documentElement.style.setProperty('--scanline-jitter', `${jitter}px`);

                    // Reset jitter after a short time
                    setTimeout(() => {
                        document.documentElement.style.setProperty('--scanline-jitter', '0px');
                        updateEffects({ scanlineJitter: 0 });
                    }, 100);
                });
            }

            // Continue the animation loop
            requestAnimationFrame(createJitter);
        };

        // Start the animation loop
        requestAnimationFrame(createJitter);

        // No cleanup needed for RAF as we'll let it continue
    }, [updateEffects]);

    // Initialize CRT effects
    useEffect(() => {
        initCRTEffects();

        // Cleanup function
        return () => {
            // Reset any CSS variables
            document.documentElement.style.setProperty('--scanline-jitter', '0px');
        };
    }, [initCRTEffects]);

    // Memoize the component structure to avoid unnecessary re-renders
    const overlays = useMemo(() => {
        return (
            <>
                {/* White flash overlay for power-on effect */}
                <CRTOverlay className={`crt-flash ${effects.isFlashing ? 'active' : ''}`} />

                {/* Scanlines effect */}
                <CRTOverlay className="crt-scanlines" />

                {/* Vignette effect (darker corners) */}
                <CRTOverlay className="crt-vignette" />

                {/* Screen flicker effect */}
                <CRTOverlay className="crt-flicker" />

                {/* Static noise effect */}
                <CRTOverlay className="crt-static" />

                {/* Barrel distortion for curved screen effect */}
                <CRTOverlay className="crt-distortion" />
            </>
        );
    }, [effects.isFlashing]);

    return (
        <div className="crt-container">
            {overlays}
        </div>
    );
};

export default memo(CRTEffects);