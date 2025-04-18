import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import nuLogo from '/public/images/logos/nu.png';

// Memoized GlitchBands component for better performance
const GlitchBands = memo(() => {
    const bandsRef = useRef(null);

    // Create glitch bands with a more efficient implementation
    const createGlitchBands = useCallback(() => {
        if (!bandsRef.current) return;

        // Clear existing bands using more efficient method
        while (bandsRef.current.firstChild) {
            bandsRef.current.removeChild(bandsRef.current.lastChild);
        }

        // Use requestAnimationFrame for better rendering performance
        requestAnimationFrame(() => {
            // Create bands with a document fragment for better performance
            const numBands = Math.floor(Math.random() * 3) + 6;
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < numBands; i++) {
                const band = document.createElement('div');
                const height = Math.floor(Math.random() * 10) + 5; // 5-15px
                const top = Math.floor(Math.random() * 100); // 0-100%
                const offset = Math.floor(Math.random() * 10) - 5; // -5px to 5px
                const rgb = Math.random() > 0.5 ? 'rgba(255,0,255,0.3)' : 'rgba(0,255,255,0.3)';

                // Set styles directly instead of using cssText for better performance
                Object.assign(band.style, {
                    position: 'absolute',
                    top: `${top}%`,
                    left: '0',
                    width: '100%',
                    height: `${height}px`,
                    backgroundColor: rgb,
                    transform: `translateX(${offset}px)`,
                    opacity: `${Math.random() * 0.5 + 0.3}`,
                    mixBlendMode: Math.random() > 0.5 ? 'screen' : 'overlay'
                });

                fragment.appendChild(band);
            }

            bandsRef.current.appendChild(fragment);
        });
    }, []);

    useEffect(() => {
        // Create initial bands
        createGlitchBands();

        // Use less frequent updates for better performance
        const intervalId = setInterval(createGlitchBands, 3000);

        return () => clearInterval(intervalId);
    }, [createGlitchBands]);

    return <div ref={bandsRef} className="glitch-bands"></div>;
});

GlitchBands.displayName = 'GlitchBands';

// Main LoginScene component
const LoginScene = ({ onLoginSuccess }) => {
    // Combine related state to reduce re-renders
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        error: '',
        isLoggingIn: false
    });

    // Animation state
    const [animation, setAnimation] = useState({
        isLogoSpinning: false,
        isLogoExtended: false,
        showWelcome: false
    });

    const logoRef = useRef(null);

    // Update credentials with less state updates
    const updateCredentials = useCallback((updates) => {
        setCredentials(prev => ({
            ...prev,
            ...updates
        }));
    }, []);

    // Update animation state
    const updateAnimation = useCallback((updates) => {
        setAnimation(prev => ({
            ...prev,
            ...updates
        }));
    }, []);

    // Validate login (mock implementation)
    const validateLogin = useCallback((username, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (username === 'admin' && password === 'password') {
                    resolve({
                        success: true,
                        token: 'mock-token-12345',
                        userData: {
                            name: 'Administrator',
                            role: 'System Admin',
                            lastLogin: new Date().toISOString()
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }
            }, 500);
        });
    }, []);

    // Animation sequence for successful login - optimized with useCallback
    const handleSuccessfulLogin = useCallback((userData) => {
        // Spin logo
        updateAnimation({ isLogoSpinning: true });

        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
            setTimeout(() => {
                // Extend logo container
                updateAnimation({ isLogoExtended: true });

                // Show welcome text after logo extension
                setTimeout(() => {
                    updateAnimation({ showWelcome: true });

                    // Start glitch transition
                    setTimeout(() => {
                        // Trigger intense glitch effect
                        document.body.classList.add('login-transition-glitch');

                        // Transition to main scene
                        setTimeout(() => {
                            document.body.classList.remove('login-transition-glitch');
                            if (onLoginSuccess) {
                                onLoginSuccess(userData);
                            }
                        }, 1500);
                    }, 1000);
                }, 500);
            }, 800);
        });
    }, [onLoginSuccess, updateAnimation]);

    // Handle login attempt with debounce to prevent multiple clicks
    const handleLogin = useCallback(async () => {
        const { username, password, isLoggingIn } = credentials;

        if (isLoggingIn) return; // Prevent multiple submissions

        if (!username || !password) {
            updateCredentials({ error: 'Please enter both username and password' });
            return;
        }

        // Set login in progress
        updateCredentials({ isLoggingIn: true, error: '' });

        try {
            // Validate credentials
            const result = await validateLogin(username, password);

            if (result.success) {
                // Trigger success animation sequence
                handleSuccessfulLogin(result.userData);
            } else {
                updateCredentials({
                    isLoggingIn: false,
                    error: result.message || 'Login failed'
                });
            }
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            updateCredentials({
                isLoggingIn: false,
                error: 'An error occurred. Please try again.'
            });
        }
    }, [credentials, updateCredentials, validateLogin, handleSuccessfulLogin]);

    // Handle Enter key press in password field
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }, [handleLogin]);

    // Handle input changes
    const handleUsernameChange = useCallback((e) => {
        updateCredentials({ username: e.target.value });
    }, [updateCredentials]);

    const handlePasswordChange = useCallback((e) => {
        updateCredentials({ password: e.target.value });
    }, [updateCredentials]);

    return (
        <div className="login-scene">
            <GlitchBands />

            <div className="logo-container" ref={logoRef}>
                <div className={`logo ${animation.isLogoSpinning ? 'spin' : ''} ${animation.isLogoExtended ? 'extend' : ''}`}>
                    <div className="logo-text"></div>
                    <div className="welcome-text" style={{ display: animation.showWelcome ? 'block' : 'none' }}>
                        Welcome
                        style={{
                        backgroundImage: `url(${nuLogo})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                    </div>
                </div>
            </div>

            <div className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={credentials.username}
                        onChange={handleUsernameChange}
                        disabled={credentials.isLoggingIn}
                        autoComplete="username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={credentials.password}
                        onChange={handlePasswordChange}
                        onKeyPress={handleKeyPress}
                        disabled={credentials.isLoggingIn}
                        autoComplete="current-password"
                    />
                </div>

                <button
                    type="button"
                    className={`form-button ${credentials.isLoggingIn ? 'disabled' : ''}`}
                    onClick={handleLogin}
                    disabled={credentials.isLoggingIn}
                >
                    {credentials.isLoggingIn ? 'LOGGING IN...' : 'LOGIN'}
                </button>

                {credentials.error && (
                    <div className="login-error show">
                        {credentials.error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(LoginScene);