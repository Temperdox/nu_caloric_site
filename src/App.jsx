import React, {useState, useEffect, useCallback, lazy, Suspense, useRef} from 'react';
import './assets/css/App.css';
import './assets/css/ModernTheme.css';

// Use more granular chunks for better code splitting
const BootupScene = lazy(() => import('./components/scenes/BootupScene.jsx'));
const LoginScene = lazy(() => import('./components/scenes/LoginScene.jsx'));
const CRTEffects = lazy(() => import('./components/CRTEffects'));
const MainScene = lazy(() => import('./components/scenes/MainScene.jsx'));
const ModernMainScene = lazy(() => import('./components/scenes/ModernMainScene.jsx'));
const ReInitDialog = lazy(() => import('./components/ReInitDialog'));

// Better loading fallback with pure CSS instead of a component that might need to re-render
const LoadingFallback = () => (
    <div className="loading-fallback">
        <div className="loading-spinner"></div>
    </div>
);

function App() {
    // Group related state for easier management
    const [scene, setScene] = useState({
        current: 'bootup',
        userData: null,
        isLoggingOut: false
    });
    const [crtEffects, setCrtEffects] = useState({
        started: false,
        containerVisible: false,
        showLine: false,
        showFlash: false
    });
    const [theme, setTheme] = useState({
        useModern: false,
        showReInitDialog: false
    });

    const isVisibleRef = useRef(true);
    const [isPageVisible, setIsPageVisible] = useState(true);

    // Memoized scene change function
    const changeScene = useCallback((sceneName, userData = null) => {
        const overlay = document.getElementById('scene-transition-overlay');

        if (overlay) {
            overlay.classList.add('active');

            requestAnimationFrame(() => {
                // Use functional updates for state that depends on previous state
                setTimeout(() => {
                    setScene(prev => ({
                        ...prev,
                        current: sceneName,
                        userData: userData || prev.userData
                    }));

                    // Conditionally show dialog, only after going to main scene
                    if (sceneName === 'main' && userData) {
                        setTimeout(() => {
                            setTheme(prev => ({
                                ...prev,
                                showReInitDialog: true
                            }));
                        }, 2000);
                    }

                    setTimeout(() => {
                        overlay.classList.remove('active');
                    }, 500);
                }, 500);
            });
        } else {
            setScene(prev => ({
                ...prev,
                current: sceneName,
                userData: userData || prev.userData
            }));

            if (sceneName === 'main' && userData) {
                setTimeout(() => {
                    setTheme(prev => ({
                        ...prev,
                        showReInitDialog: true
                    }));
                }, 2000);
            }
        }
    }, []);

    // Optimized logout handler
    const handleLogout = useCallback(() => {
        // Mark that we're logging out - this helps with animations
        setScene(prev => ({
            ...prev,
            isLoggingOut: true
        }));

        // Apply special transition effect when coming from modern theme
        if (theme.useModern) {
            const overlay = document.getElementById('scene-transition-overlay');
            if (overlay) {
                overlay.classList.add('active');
                overlay.classList.add('theme-switching');

                // Use requestAnimationFrame for smoother animations
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        // Batch state updates
                        setTheme(prev => ({
                            ...prev,
                            useModern: false
                        }));

                        setScene(() => ({
                            current: 'login',
                            userData: null,
                            isLoggingOut: false
                        }));

                        setTimeout(() => {
                            overlay.classList.remove('active');
                            overlay.classList.remove('theme-switching');
                        }, 500);
                    }, 1000);
                });
            } else {
                // No overlay available, still handle the logout
                setTheme(prev => ({
                    ...prev,
                    useModern: false
                }));

                setScene({
                    current: 'login',
                    userData: null,
                    isLoggingOut: false
                });
            }
        } else {
            // Standard logout from retro theme
            setScene(prev => ({
                ...prev,
                isLoggingOut: false
            }));

            // Use the changeScene function we already defined
            changeScene('login');
        }
    }, [changeScene, theme.useModern]);

    // Optimized reinitialization handlers
    const handleReInitConfirm = useCallback(() => {
        // Set modern theme flag
        setTheme(prev => ({
            ...prev,
            useModern: true,
            showReInitDialog: false
        }));

        // Apply transition effect
        const overlay = document.getElementById('scene-transition-overlay');
        if (overlay) {
            overlay.classList.add('active');
            overlay.classList.add('theme-switching');

            // Use requestAnimationFrame for smoother animations
            requestAnimationFrame(() => {
                setTimeout(() => {
                    setScene(prev => ({
                        ...prev,
                        current: 'modernMain'
                    }));

                    setTimeout(() => {
                        overlay.classList.remove('active');
                        overlay.classList.remove('theme-switching');
                    }, 500);
                }, 800);
            });
        } else {
            setScene(prev => ({
                ...prev,
                current: 'modernMain'
            }));
        }
    }, []);

    const handleReInitCancel = useCallback(() => {
        setTheme(prev => ({
            ...prev,
            showReInitDialog: false
        }));
    }, []);

    // CRT startup effect - runs only once
    useEffect(() => {
        // Simulate CRT startup with white line effect
        const startCRT = () => {
            // Initial white flash
            setCrtEffects(prev => ({
                ...prev,
                showFlash: true
            }));

            // Schedule effects with requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                // Show white line after a delay
                setTimeout(() => {
                    setCrtEffects(prev => ({
                        ...prev,
                        showFlash: false,
                        showLine: true
                    }));

                    // Hide line after animation completes
                    setTimeout(() => {
                        setCrtEffects(prev => ({
                            ...prev,
                            showLine: false
                        }));
                    }, 2000);

                    // Start showing content after initial effects
                    setTimeout(() => {
                        setCrtEffects(prev => ({
                            ...prev,
                            started: true
                        }));

                        // Show container with animation after a brief delay
                        setTimeout(() => {
                            setCrtEffects(prev => ({
                                ...prev,
                                containerVisible: true
                            }));
                        }, 800);
                    }, 1500);
                }, 500);
            });
        };

        startCRT();
    }, []);

    useEffect(() => {
        // Function to handle visibility changes
        const handleVisibilityChange = () => {
            const isVisible = document.visibilityState === 'visible';
            isVisibleRef.current = isVisible;
            setIsPageVisible(isVisible);

            // Apply or remove a CSS class to the root element when visibility changes
            if (isVisible) {
                document.documentElement.classList.remove('page-hidden');
                // Resume any global animations here
            } else {
                document.documentElement.classList.add('page-hidden');
                // Pause any global animations here
            }
        };

        // Set initial state
        handleVisibilityChange();

        // Listen for visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Memoized scene renderer
    const renderScene = useCallback(() => {
        if (!crtEffects.started) {
            return null; // Show nothing until CRT effect starts
        }

        // Use object lookup instead of switch for better performance
        const sceneMap = {
            'bootup': (
                <Suspense fallback={<LoadingFallback />}>
                    <BootupScene onComplete={() => changeScene('login')} isPageVisible={isPageVisible} />
                </Suspense>
            ),
            'login': (
                <Suspense fallback={<LoadingFallback />}>
                    <LoginScene onLoginSuccess={(userData) => changeScene('main', userData)} isPageVisible={isPageVisible} />
                </Suspense>
            ),
            'main': (
                <Suspense fallback={<LoadingFallback />}>
                    <MainScene user={scene.userData} onLogout={handleLogout} isPageVisible={isPageVisible} />
                </Suspense>
            ),
            'modernMain': (
                <Suspense fallback={<LoadingFallback />}>
                    <ModernMainScene
                        user={scene.userData}
                        onLogout={handleLogout}
                        isLoggingOut={scene.isLoggingOut}
                        isPageVisible={isPageVisible}
                    />
                </Suspense>
            )
        };

        return sceneMap[scene.current] || <div>Unknown Scene</div>;
    }, [scene, crtEffects.started, changeScene, handleLogout, isPageVisible]);

    // Use a container class based on theme
    const containerClassName = theme.useModern ? 'modern-container' : 'App';

    return (
        <div className={containerClassName}>
            {/* Only show CRT effects for retro theme */}
            {!theme.useModern && crtEffects.started && (
                <Suspense fallback={null}>
                    <CRTEffects />
                </Suspense>
            )}

            {/* CRT white line animation */}
            {crtEffects.showLine && <div className="crt-line"></div>}

            {/* CRT white flash */}
            {crtEffects.showFlash && <div className="crt-flash"></div>}

            {/* Reinitialization dialog - only shown after login when in main scene */}
            {theme.showReInitDialog && !theme.useModern && (
                <Suspense fallback={<LoadingFallback />}>
                    <ReInitDialog
                        onConfirm={handleReInitConfirm}
                        onCancel={handleReInitCancel}
                    />
                </Suspense>
            )}

            {/* Scene transition overlay */}
            <div id="scene-transition-overlay" className="scene-transition-overlay"></div>

            {/* Render content based on theme */}
            {theme.useModern ? (
                // Modern theme content is directly rendered without container
                renderScene()
            ) : (
                // Retro theme content in container
                crtEffects.containerVisible && (
                    <div className="scene-container">
                        {renderScene()}
                    </div>
                )
            )}

            {/* Background elements for modern theme - only render when needed */}
            {theme.useModern && (
                <>
                    <div className="modern-bg-element modern-bg-element-1"></div>
                    <div className="modern-bg-element modern-bg-element-2"></div>
                </>
            )}
        </div>
    );
}

export default App;