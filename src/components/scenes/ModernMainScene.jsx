// ModernMainScene.jsx - Updated with improved logout handling
import React, { useState, useEffect, useCallback } from 'react';

// Sample data for metrics and notifications
const dashboardData = [
    { id: 1, metric: 'Active Users', value: 1248, trend: 'up', change: '+8%', icon: '👥' },
    { id: 2, metric: 'Avg. Session Time', value: '14m 32s', trend: 'up', change: '+2m', icon: '⏱️' },
    { id: 3, metric: 'System Resources', value: '42%', trend: 'down', change: '-5%', icon: '🖥️' },
    { id: 4, metric: 'Error Rate', value: '0.12%', trend: 'down', change: '-0.05%', icon: '⚠️' },
    { id: 5, metric: 'Data Synchronization', value: '98.7%', trend: 'up', change: '+0.3%', icon: '🔄' }
];

// Sample system notifications
const systemNotifications = [
    { id: 1, level: 'info', message: 'System update scheduled for 02:00 ET - No downtime expected', time: '13:45:22' },
    { id: 2, level: 'warning', message: 'High CPU utilization detected in Sector 7G - Optimization recommended', time: '14:23:10' },
    { id: 3, level: 'info', message: 'New data pattern identified in user cluster #42A - Analysis complete', time: '14:30:56' },
    { id: 4, level: 'critical', message: 'Remote access attempt blocked - IP 192.168.1.45 - Security countermeasures active', time: '15:12:33' },
    { id: 5, level: 'info', message: 'Automated backup complete - Storage utilization at 37%', time: '15:45:01' },
];

const ModernMainScene = ({ user, onLogout, isLoggingOut }) => {
    const [, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showElements, setShowElements] = useState(false);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Show elements with a staggered animation
        setTimeout(() => {
            setShowElements(true);
        }, 300);

        return () => clearInterval(timer);
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

    // Handle logout with transition effect
    const handleLogout = useCallback(() => {
        // Call the parent logout handler directly - transition is managed in App.jsx
        if (onLogout) {
            onLogout();
        }
    }, [onLogout]);

    // Handle tab changes
    const handleTabChange = useCallback((tab, e) => {
        e.preventDefault();
        setActiveTab(tab);
    }, []);

    // Render metric cards with cyberpunk styling
    const renderMetricCard = useCallback((metric, index) => (
        <div
            className="modern-card modern-fade-in special-hover"
            style={{ animationDelay: `${index * 0.1}s` }}
            key={metric.id}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', marginRight: '10px' }}>{metric.icon}</span>
                    <span>{metric.metric}</span>
                </div>
                <div className={`modern-badge ${metric.trend === 'up' ? '' : 'danger'}`}>
                    {metric.trend === 'up' ? '▲' : '▼'} {metric.change}
                </div>
            </div>
            <div style={{
                fontSize: '28px',
                fontWeight: '600',
                marginTop: '10px',
                color: metric.trend === 'up' ? 'var(--cyber-cyan)' : 'var(--cyber-magenta)'
            }}>
                {metric.value}
            </div>
        </div>
    ), []);

    // Render the dashboard tab
    const renderDashboard = useCallback(() => (
        <div className="modern-fade-in" style={{ width: '100%' }}>
            <div className="modern-panel glow-cyan" style={{ marginBottom: '20px' }}>
                <div className="modern-panel-header">
                    <div className="modern-panel-title">
                        <span>📊</span>System Metrics
                    </div>
                    <button className="modern-button">Refresh</button>
                </div>
                <div className="modern-grid">
                    {dashboardData.map((metric, index) => renderMetricCard(metric, index))}
                </div>
            </div>

            <div className="modern-panel">
                <div className="modern-panel-header">
                    <div className="modern-panel-title">
                        <span>🔔</span>System Notifications
                    </div>
                    <div>
                        <button className="modern-button accent" style={{ marginRight: '10px' }}>
                            Mark All Read
                        </button>
                        <button className="modern-button">
                            Settings
                        </button>
                    </div>
                </div>
                <div>
                    {systemNotifications.map((notification, index) => (
                        <div
                            key={notification.id}
                            className="modern-fade-in"
                            style={{
                                padding: '12px',
                                borderLeft: `3px solid ${notification.level === 'critical' ? 'var(--cyber-magenta)' :
                                    notification.level === 'warning' ? '#ffdf00' : 'var(--cyber-cyan)'}`,
                                marginBottom: '10px',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                borderRadius: '2px',
                                animationDelay: `${0.5 + index * 0.1}s`
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{
                                    color: notification.level === 'critical' ? 'var(--cyber-magenta)' :
                                        notification.level === 'warning' ? '#ffdf00' : 'var(--cyber-cyan)'
                                }}>
                                  {notification.level === 'critical' ? (
                                      <><span className="status-indicator status-error"></span>CRITICAL</>
                                  ) : notification.level === 'warning' ? (
                                      <><span className="status-indicator status-warning"></span>WARNING</>
                                  ) : (
                                      <><span className="status-indicator status-online"></span>INFO</>
                                  )}
                                </span>
                                <span style={{ opacity: 0.7 }}>{notification.time}</span>
                            </div>
                            <div>{notification.message}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ), [renderMetricCard]);

    // Render user profile tab
    const renderProfile = useCallback(() => (
        <div className="modern-fade-in" style={{ width: '100%' }}>
            <div className="modern-panel glow-magenta">
                <div className="modern-panel-header">
                    <div className="modern-panel-title" style={{ color: 'var(--cyber-magenta)' }}>
                        <span>👤</span>User Profile
                    </div>
                    <button className="modern-button accent">Edit Profile</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--cyber-gradient-mix)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        marginRight: '20px',
                        boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)'
                    }}>
                        👤
                    </div>
                    <div>
                        <h2 style={{ margin: '0 0 5px 0', color: 'var(--cyber-magenta)' }}>{user?.name || 'Administrator'}</h2>
                        <div style={{ opacity: 0.7 }}>{user?.role || 'System Administrator'}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="modern-card special-hover">
                        <h3 style={{ marginTop: 0, color: 'var(--cyber-cyan)' }}>Account Information</h3>
                        <div className="terminal-text">
                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ opacity: 0.7, marginBottom: '5px' }}>Username</div>
                                <div>admin</div>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ opacity: 0.7, marginBottom: '5px' }}>Role</div>
                                <div>{user?.role || 'System Administrator'}</div>
                            </div>
                            <div>
                                <div style={{ opacity: 0.7, marginBottom: '5px' }}>Last Login</div>
                                <div>{formatDate(new Date())} {formatTime(new Date())}</div>
                            </div>
                        </div>
                    </div>

                    <div className="modern-card special-hover">
                        <h3 style={{ marginTop: 0, color: 'var(--cyber-magenta)' }}>System Permissions</h3>
                        <table className="cyber-table">
                            <thead>
                            <tr>
                                <th>Permission</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {[
                                { perm: 'Full System Access', status: true },
                                { perm: 'Security Module Control', status: true },
                                { perm: 'User Management', status: true },
                                { perm: 'Data Encryption Keys', status: true },
                                { perm: 'Network Configuration', status: true }
                            ].map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.perm}</td>
                                    <td>
                                        <span className="status-indicator status-online"></span>
                                        Granted
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    ), [user, formatDate, formatTime]);

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

    return (
        <div className={`modern-container ${isLoggingOut ? 'logging-out' : ''}`}>
            {/* Modern header with navigation */}
            <header className={`modern-header ${showElements ? 'modern-fade-in' : ''}`}>
                <div className="modern-logo">NuCaloric System</div>
                <nav className="modern-nav">
                    <button
                        className={`modern-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={(e) => handleTabChange('dashboard', e)}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`modern-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={(e) => handleTabChange('profile', e)}
                    >
                        Profile
                    </button>
                    <button
                        className="modern-nav-item logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </nav>
            </header>

            {/* Main content area */}
            <main className="modern-content">
                {showElements && renderContent()}
            </main>

            {/* Background elements */}
            <div className="modern-bg-element modern-bg-element-1"></div>
            <div className="modern-bg-element modern-bg-element-2"></div>
        </div>
    );
};

export default ModernMainScene;