// MainScene.jsx - Updated with proper sub-scene handling for Propaganda
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import TerminalConsole from '../terminal/TerminalConsole.jsx';
import SiteDirectory from './sub_scenes/SiteDirectory.jsx';
import PropagandaSection from './sub_scenes/PropagandaSection.jsx'; // Import the Propaganda section
import '../../assets/css/TerminalConsole.css';
import '../../assets/css/SiteDirectory.css';
import '../../assets/css/MainScene.css';
import '../../assets/css/PropagandaSub.css'; // Import Propaganda CSS

// Sample dashboard data
const dashboardData = [
    { id: 1, metric: 'Active Users', value: 1248, trend: 'up', change: '+8%' },
    { id: 2, metric: 'Avg. Session Time', value: '14m 32s', trend: 'up', change: '+2m' },
    { id: 3, metric: 'System Resources', value: '42%', trend: 'down', change: '-5%' },
    { id: 4, metric: 'Error Rate', value: '0.12%', trend: 'down', change: '-0.05%' },
    { id: 5, metric: 'Data Synchronization', value: '98.7%', trend: 'up', change: '+0.3%' }
];

// Sample system notifications
const systemNotifications = [
    { id: 1, level: 'info', message: 'System update scheduled for 02:00 ET - No downtime expected', time: '13:45:22' },
    { id: 2, level: 'warning', message: 'High CPU utilization detected in Sector 7G - Optimization recommended', time: '14:23:10' },
    { id: 3, level: 'info', message: 'New data pattern identified in user cluster #42A - Analysis complete', time: '14:30:56' },
    { id: 4, level: 'critical', message: 'Remote access attempt blocked - IP 192.168.1.45 - Security countermeasures active', time: '15:12:33' },
    { id: 5, level: 'info', message: 'Automated backup complete - Storage utilization at 37%', time: '15:45:01' },
];

// MetricCard component
const MetricCard = memo(({ metric }) => (
    <div className="metric-card">
        <div className="metric-header">
            <span className="metric-name">{metric.metric}</span>
            <span className={`metric-trend ${metric.trend}`}>
                {metric.trend === 'up' ? '▲' : '▼'} {metric.change}
            </span>
        </div>
        <div className="metric-value">{metric.value}</div>
    </div>
));

MetricCard.displayName = 'MetricCard';

// Notification component
const Notification = memo(({ notification }) => (
    <div className={`notification ${notification.level}`}>
        <span className="notification-time">[{notification.time}]</span>
        <span className="notification-message">{notification.message}</span>
    </div>
));

Notification.displayName = 'Notification';

// Main component
const MainScene = ({ user, onLogout }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState('dashboard');
    const [randomGlitches, setRandomGlitches] = useState(false);
    const [terminalHeight, setTerminalHeight] = useState(200); // Initial terminal height
    const [activeSubScene, setActiveSubScene] = useState(null);
    const mainContentRef = useRef(null);
    const toolbarRef = useRef(null);
    const subSceneRef = useRef(null);

    // Update time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Occasional random glitches for effect
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.85) {
                setRandomGlitches(true);
                setTimeout(() => setRandomGlitches(false), 300);
            }
        }, 10000);

        return () => {
            clearInterval(interval);
            clearInterval(glitchInterval);
        };
    }, []);

    // Format date for display
    const formatDate = useCallback((date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }, []);

    // Format time for display
    const formatTime = useCallback((date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }, []);

    // Handle logout with glitch effect
    const handleLogout = useCallback(() => {
        // Apply glitch effect before logout
        document.body.classList.add('logout-glitch');

        // After a brief animation, call the real logout handler
        setTimeout(() => {
            document.body.classList.remove('logout-glitch');
            if (onLogout) onLogout();
        }, 800);
    }, [onLogout]);

    // Start terminal drag resize
    const startTerminalResize = useCallback((e) => {
        e.preventDefault();

        // Add a CSS class to indicate we're resizing
        document.body.classList.add('terminal-resizing');

        // Add a class to the terminal to disable transitions during resize
        const terminal = document.querySelector('.terminal-console-container');
        if (terminal) {
            terminal.classList.add('resizing');
        }

        // Create a resize preview line if it doesn't exist
        let previewLine = document.querySelector('.terminal-resize-preview');
        if (!previewLine) {
            previewLine = document.createElement('div');
            previewLine.className = 'terminal-resize-preview';
            document.body.appendChild(previewLine);
        }

        // Set initial position of preview line
        previewLine.style.top = `${e.clientY}px`;
        previewLine.style.display = 'block';

        const startY = e.clientY;
        const startHeight = terminalHeight;

        // Store the last resize time for throttling
        let lastResizeTime = performance.now();

        const doDrag = (e) => {
            // Update preview line position on every mouse move (lightweight operation)
            previewLine.style.top = `${e.clientY}px`;

            // Throttle the actual resize calculations
            const now = performance.now();
            if (now - lastResizeTime > 16) { // ~60fps
                lastResizeTime = now;

                // Calculate new height based on mouse movement (inverse since we're dragging up)
                const newHeight = Math.max(100, startHeight + (startY - e.clientY));

                // Update the terminal height (this causes reflow)
                setTerminalHeight(newHeight);
            }
        };

        const stopDrag = () => {
            // Clean up on mouse release
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);

            // Remove the resize indicator and preview
            document.body.classList.remove('terminal-resizing');
            if (terminal) {
                terminal.classList.remove('resizing');
            }
            if (previewLine) {
                previewLine.style.display = 'none';
            }
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    }, [terminalHeight]);

    // Handle terminal navigation
    const handleTerminalNavigation = useCallback((scene, tab, component) => {
        if (scene === 'main') {
            if (component === 'siteDirectory') {
                setActiveSubScene('siteDirectory');
            } else if (component === 'propaganda') {
                // Add handler for propaganda component
                setActiveSubScene('propaganda');
            } else if (tab) {
                setActiveTab(tab || 'dashboard');
                // Clear sub-scene when switching main tabs
                setActiveSubScene(null);
            }
        } else if (scene) {
            // This would typically go back to App.jsx to change scenes
            console.log(`Terminal navigation: ${scene} ${tab || ''}`);
        }
    }, []);

    // Handle site navigation from SiteDirectory
    const handleSiteNavigation = useCallback((url) => {
        // Parse the URL to determine what to do
        if (url.startsWith('/sites/')) {
            const parts = url.split('/');
            if (parts.length >= 3) {
                const scene = parts[2];
                const tab = parts[3] || null;

                console.log(`Navigate to: scene=${scene}, tab=${tab}`);
                // You can implement actual navigation here
            }
        } else {
            console.log(`Navigate to: ${url}`);
            // Handle other navigation as needed
        }
    }, []);

    // Toggle sub-scene display
    const toggleSubScene = useCallback((subScene) => {
        setActiveSubScene(prev => prev === subScene ? null : subScene);
    }, []);

    // Render the dashboard tab
    const renderDashboard = useCallback(() => {
        return (
            <div className="dashboard">
                <h2>System Dashboard</h2>

                <div className="metrics-grid">
                    {dashboardData.map(metric => (
                        <MetricCard key={metric.id} metric={metric} />
                    ))}
                </div>

                <div className="notifications-panel">
                    <h3>System Notifications</h3>
                    <div className="notification-list">
                        {systemNotifications.map(notification => (
                            <Notification key={notification.id} notification={notification} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }, []);

    // Render the user profile tab
    const renderProfile = useCallback(() => {
        return (
            <div className="profile">
                <h2>User Profile</h2>

                <div className="profile-info">
                    <div className="profile-section">
                        <h3>Account Information</h3>
                        <div className="profile-field">
                            <span className="field-label">Username:</span>
                            <span className="field-value">admin</span>
                        </div>
                        <div className="profile-field">
                            <span className="field-label">Role:</span>
                            <span className="field-value">{user?.role || 'System Administrator'}</span>
                        </div>
                        <div className="profile-field">
                            <span className="field-label">Last Login:</span>
                            <span className="field-value">
                                {user?.lastLogin
                                    ? new Date(user.lastLogin).toLocaleString()
                                    : formatDate(new Date()) + ' ' + formatTime(new Date(-1800000))}
                            </span>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h3>System Permissions</h3>
                        <ul className="permissions-list">
                            <li className="permission-item">Full System Access</li>
                            <li className="permission-item">Security Module Control</li>
                            <li className="permission-item">User Management</li>
                            <li className="permission-item">Data Encryption Keys</li>
                            <li className="permission-item">Network Configuration</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }, [user, formatDate, formatTime]);

    // Render SiteDirectory tab
    const renderSiteDirectory = useCallback(() => {
        return (
            <div className="site-directory-container">
                <h2>Site Directory</h2>
                <SiteDirectory isModern={false} onNavigate={handleSiteNavigation} />
            </div>
        );
    }, [handleSiteNavigation]);

    // Render content based on active tab
    const renderContent = useCallback(() => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'profile':
                return renderProfile();
            default:
                return renderDashboard();
        }
    }, [activeTab, renderDashboard, renderProfile]);

    // Render active sub-scene
    const renderSubScene = useCallback(() => {
        if (!activeSubScene) return null;

        switch (activeSubScene) {
            case 'siteDirectory':
                return renderSiteDirectory();
            case 'propaganda':
                // Add Propaganda section render
                return <PropagandaSection isModern={false} onNavigate={handleSiteNavigation} />;
            default:
                return null;
        }
    }, [activeSubScene, renderSiteDirectory, handleSiteNavigation]);

    return (
        <div className={`main-scene ${randomGlitches ? 'glitching' : ''}`}>
            <div className="main-header">
                <div className="header-left">
                    <h1>NuCaloric System</h1>
                    <div className="navigation">
                        {/* Main tabs only - no sub-scenes in top nav */}
                        <button
                            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('dashboard');
                                setActiveSubScene(null); // Clear any active sub-scene
                            }}
                        >
                            Dashboard
                        </button>
                        <button
                            className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('profile');
                                setActiveSubScene(null); // Clear any active sub-scene
                            }}
                        >
                            Profile
                        </button>

                        {/* Optional: Add sub-scene launch buttons in a different style or section
                        <div className="sub-scene-launcher">
                            <button
                                className="launch-button"
                                title="View Site Directory"
                                onClick={() => toggleSubScene('siteDirectory')}
                            >
                                Sites
                            </button>
                            <button
                                className="launch-button"
                                title="View Propaganda Section"
                                onClick={() => toggleSubScene('propaganda')}
                            >
                                Archives
                            </button>
                        </div>*/}
                    </div>
                </div>
                <div className="header-right">
                    <div className="current-time">
                        <div className="date">{formatDate(currentTime)}</div>
                        <div className="time">{formatTime(currentTime)}</div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="main-content-layout">
                {/* Main content area */}
                <div className="main-content" style={{ marginBottom: activeSubScene ? '0' : `${terminalHeight}px` }}>
                    {renderContent()}
                </div>

                {/* Sub-scene content area */}
                {activeSubScene && (
                    <div className="sub-scene-content" ref={subSceneRef} style={{ marginBottom: `${terminalHeight}px` }}>
                        {renderSubScene()}
                    </div>
                )}
            </div>

            {/* Always visible terminal */}
            <div
                className="terminal-console-container always-visible"
                style={{ height: `${terminalHeight}px` }}
            >
                <div className="terminal-resize-handle" onMouseDown={startTerminalResize}></div>
                <div className="terminal-header-bar">
                    <div className="terminal-title">NuCaloric Terminal</div>
                    {activeSubScene && (
                        <button
                            className="terminal-close-sub-scene"
                            onClick={() => setActiveSubScene(null)}
                        >
                            Close Sub-Scene
                        </button>
                    )}
                </div>

                <TerminalConsole onNavigate={handleTerminalNavigation} />
            </div>
        </div>
    );
};

export default memo(MainScene);