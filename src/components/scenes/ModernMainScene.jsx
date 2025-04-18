// ModernMainScene.jsx - Updated to properly handle Propaganda section
import React, { useState, useEffect, useCallback } from 'react';
import SiteDirectory from './sub_scenes/SiteDirectory';
import PropagandaSub from './sub_scenes/PropagandaSub.jsx'; // Import PropagandaSub directly
import '../../assets/css/SiteDirectorySub.css';
import '../../assets/css/PropagandaSub.css';

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

// Sample site data for favorites section
const favoriteSites = [
    { id: 1, title: 'Dashboard', description: 'Main system dashboard', url: '/sites/dashboard/main', priority: 'high' },
    { id: 2, title: 'User Profile', description: 'Account settings', url: '/sites/profile/user', priority: 'medium' },
    { id: 3, title: 'Analytics', description: 'System analytics', url: '/tools/analytics', priority: 'medium' },
];

const ModernMainScene = ({ user, onLogout, isLoggingOut }) => {
    // State for time and animations
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showElements, setShowElements] = useState(false);

    // State for navigation
    const [navigation, setNavigation] = useState({
        activeSection: 'dashboard',
        activeSub: null,
        breadcrumbs: ['Dashboard']
    });

    // State for mobile navigation
    const [isMobileNavExpanded, setIsMobileNavExpanded] = useState(false);

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

    // Handle window resizing for mobile navigation
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMobileNavExpanded) {
                setIsMobileNavExpanded(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileNavExpanded]);

    // Click outside handler to close mobile navigation
    useEffect(() => {
        const handleClickOutside = (event) => {
            const navContainer = document.querySelector('.modern-nav-container');
            const navToggle = document.querySelector('.modern-nav-toggle');

            if (
                isMobileNavExpanded &&
                navContainer &&
                !navContainer.contains(event.target) &&
                navToggle &&
                !navToggle.contains(event.target)
            ) {
                setIsMobileNavExpanded(false);
            }
        };

        if (isMobileNavExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileNavExpanded]);

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

    // Toggle mobile navigation
    const toggleMobileNav = useCallback(() => {
        setIsMobileNavExpanded(prev => !prev);
    }, []);

    // Handle main navigation changes
    const handleMainNavChange = useCallback((section) => {
        let newBreadcrumbs = ['Dashboard'];
        let newSubSection = null;

        switch (section) {
            case 'dashboard':
                newBreadcrumbs = ['Dashboard'];
                break;
            case 'sites':
                newBreadcrumbs = ['Sites'];
                newSubSection = 'directory'; // Default sub-section
                break;
            case 'propaganda':
                // Add propaganda section
                newBreadcrumbs = ['Information Distribution Center'];
                break;
            case 'tools':
                newBreadcrumbs = ['Tools'];
                newSubSection = 'analytics'; // Default sub-section
                break;
            case 'system':
                newBreadcrumbs = ['System'];
                newSubSection = 'config'; // Default sub-section
                break;
            default:
                break;
        }

        setNavigation({
            activeSection: section,
            activeSub: newSubSection,
            breadcrumbs: newBreadcrumbs
        });

        // Close mobile navigation if it's open
        if (isMobileNavExpanded) {
            setIsMobileNavExpanded(false);
        }
    }, [isMobileNavExpanded]);

    // Handle sub-navigation changes
    const handleSubNavChange = useCallback((subSection) => {
        setNavigation(prev => {
            // Create new breadcrumbs based on section and subsection
            let newBreadcrumbs = [capitalize(prev.activeSection)];

            // Add subsection to breadcrumbs with proper formatting
            switch (subSection) {
                case 'directory':
                    newBreadcrumbs = ['Sites', 'Directory'];
                    break;
                case 'favorites':
                    newBreadcrumbs = ['Sites', 'Favorites'];
                    break;
                case 'recent':
                    newBreadcrumbs = ['Sites', 'Recently Viewed'];
                    break;
                case 'analytics':
                    newBreadcrumbs = ['Tools', 'Analytics'];
                    break;
                case 'monitor':
                    newBreadcrumbs = ['Tools', 'Resource Monitor'];
                    break;
                case 'reports':
                    newBreadcrumbs = ['Tools', 'Reports'];
                    break;
                case 'config':
                    newBreadcrumbs = ['System', 'Configuration'];
                    break;
                case 'users':
                    newBreadcrumbs = ['System', 'User Management'];
                    break;
                case 'security':
                    newBreadcrumbs = ['System', 'Security Settings'];
                    break;
                default:
                    newBreadcrumbs = [capitalize(prev.activeSection), capitalize(subSection)];
                    break;
            }

            return {
                ...prev,
                activeSub: subSection,
                breadcrumbs: newBreadcrumbs
            };
        });

        // Close mobile navigation if it's open
        if (isMobileNavExpanded) {
            setIsMobileNavExpanded(false);
        }
    }, [isMobileNavExpanded]);

    // Capitalize first letter of a string (helper function)
    const capitalize = (string) => {
        return string?.charAt(0).toUpperCase() + string?.slice(1);
    };

    // Handle site navigation from SiteDirectory component
    const handleSiteNavigation = useCallback((url) => {
        // Parse the URL to determine what to do
        if (url.startsWith('/sites/')) {
            // It's a site navigation
            const parts = url.split('/');
            if (parts.length >= 3) {
                const scene = parts[2];
                const tab = parts[3] || null;

                console.log(`Navigate to: scene=${scene}, tab=${tab}`);
                // You can implement actual navigation if needed
            }
        } else if (url.startsWith('/tools/')) {
            // Handle tools navigation
            const tool = url.split('/')[2];
            handleMainNavChange('tools');
            if (tool) {
                handleSubNavChange(tool);
            }
        } else if (url.startsWith('/system/')) {
            // Handle system navigation
            const section = url.split('/')[2];
            handleMainNavChange('system');
            if (section) {
                handleSubNavChange(section);
            }
        } else {
            console.log(`Navigate to: ${url}`);
            // Handle other navigation as needed
        }
    }, [handleMainNavChange, handleSubNavChange]);

    // Render dashboard metrics
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

    // Render favorites list
    const renderFavorite = useCallback((site, index) => (
        <div
            className="modern-card modern-fade-in special-hover"
            style={{ animationDelay: `${index * 0.1}s` }}
            key={site.id}
            onClick={() => handleSiteNavigation(site.url)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: site.priority === 'high' ? 'var(--cyber-cyan)' : 'var(--cyber-text)'
                }}>{site.title}</span>
                <div className={`modern-badge ${site.priority === 'high' ? '' : 'secondary'}`}>
                    {site.priority === 'high' ? 'Pinned' : 'Favorite'}
                </div>
            </div>
            <p style={{ color: 'var(--cyber-text-dim)' }}>{site.description}</p>
        </div>
    ), [handleSiteNavigation]);

    // Render the dashboard content
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

    // Render user profile content
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

    // Render sites directory content
    const renderSiteDirectory = useCallback(() => (
        <div className="modern-fade-in" style={{ width: '100%' }}>
            <div className="modern-panel">
                <div className="modern-panel-header">
                    <div className="modern-panel-title">
                        <span>🔗</span>Site Directory
                    </div>
                </div>
                <SiteDirectory isModern={true} onNavigate={handleSiteNavigation} />
            </div>
        </div>
    ), [handleSiteNavigation]);

    // Render propaganda content
    const renderPropaganda = useCallback(() => (
        <div className="modern-fade-in" style={{ width: '100%' }}>
            <div className="modern-panel">
                <div className="modern-panel-header">
                    <div className="modern-panel-title">
                        <span>📰</span>Information Distribution Center
                    </div>
                </div>
                <PropagandaSub isModern={true} onNavigate={handleSiteNavigation} />
            </div>
        </div>
    ), [handleSiteNavigation]);

    // Render favorites content
    const renderFavorites = useCallback(() => (
        <div className="modern-fade-in" style={{ width: '100%' }}>
            <div className="modern-panel glow-cyan">
                <div className="modern-panel-header">
                    <div className="modern-panel-title">
                        <span>⭐</span>Favorite Sites
                    </div>
                    <button className="modern-button">Manage Favorites</button>
                </div>
                <div className="modern-grid">
                    {favoriteSites.map((site, index) => renderFavorite(site, index))}
                </div>
            </div>
        </div>
    ), [renderFavorite]);

    // Render the placeholder for upcoming features
    const renderPlaceholder = useCallback((title, message = "This feature is coming soon") => (
        <div className="modern-fade-in" style={{ width: '100%' }}>
            <div className="modern-placeholder">
                <h3>{title}</h3>
                <p>{message}</p>
            </div>
        </div>
    ), []);

    // Render content based on navigation state
    const renderContent = useCallback(() => {
        // Primary section routing
        switch (navigation.activeSection) {
            case 'dashboard':
                return renderDashboard();

            case 'propaganda':
                // Add propaganda section rendering
                return renderPropaganda();

            case 'sites':
                // Sub-routing for Sites section
                switch (navigation.activeSub) {
                    case 'directory':
                        return renderSiteDirectory();
                    case 'favorites':
                        return renderFavorites();
                    case 'recent':
                        return renderPlaceholder('Recently Viewed Sites', 'Your recently viewed sites will appear here');
                    default:
                        return renderSiteDirectory();
                }

            case 'tools':
                // Sub-routing for Tools section
                switch (navigation.activeSub) {
                    case 'analytics':
                        return renderPlaceholder('Analytics Tools');
                    case 'monitor':
                        return renderPlaceholder('Resource Monitor');
                    case 'reports':
                        return renderPlaceholder('Reports');
                    default:
                        return renderPlaceholder('Tools Section');
                }

            case 'system':
                // Sub-routing for System section
                switch (navigation.activeSub) {
                    case 'config':
                        return renderPlaceholder('System Configuration');
                    case 'users':
                        return renderPlaceholder('User Management');
                    case 'security':
                        return renderPlaceholder('Security Settings');
                    default:
                        return renderPlaceholder('System Section');
                }

            default:
                return renderDashboard();
        }
    }, [
        navigation.activeSection,
        navigation.activeSub,
        renderDashboard,
        renderSiteDirectory,
        renderFavorites,
        renderPlaceholder,
        renderPropaganda
    ]);

    return (
        <div className={`modern-container ${isLoggingOut ? 'logging-out' : ''}`}>
            {/* Modern header with navigation */}
            <header className={`modern-header ${showElements ? 'modern-fade-in' : ''}`}>
                <div className="modern-header-top">
                    <div className="modern-logo">NuCaloric System</div>

                    {/* Mobile toggle button - only visible on small screens */}
                    <button
                        className="modern-nav-toggle"
                        onClick={toggleMobileNav}
                        aria-label="Toggle navigation"
                    >
                        {isMobileNavExpanded ? '✕' : '☰'}
                    </button>
                </div>

                {/* Navigation with expanded class for mobile */}
                <nav className={`modern-nav-container ${isMobileNavExpanded ? 'expanded' : ''}`}>
                    <div className="modern-main-nav">
                        <button
                            className={`modern-nav-item ${navigation.activeSection === 'dashboard' ? 'active' : ''}`}
                            onClick={() => handleMainNavChange('dashboard')}
                        >
                            Dashboard
                        </button>
                        <button
                            className={`modern-nav-item ${navigation.activeSection === 'sites' ? 'active' : ''}`}
                            onClick={() => handleMainNavChange('sites')}
                        >
                            Sites
                        </button>
                        {/* Add Propaganda navigation button */}
                        <button
                            className={`modern-nav-item ${navigation.activeSection === 'propaganda' ? 'active' : ''}`}
                            onClick={() => handleMainNavChange('propaganda')}
                        >
                            Propaganda
                        </button>
                        <button
                            className={`modern-nav-item ${navigation.activeSection === 'tools' ? 'active' : ''}`}
                            onClick={() => handleMainNavChange('tools')}
                        >
                            Tools
                        </button>
                        <button
                            className={`modern-nav-item ${navigation.activeSection === 'system' ? 'active' : ''}`}
                            onClick={() => handleMainNavChange('system')}
                        >
                            System
                        </button>
                        <button
                            className="modern-nav-item logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>

                    {/* Sub navigation for Sites section */}
                    {navigation.activeSection === 'sites' && (
                        <div className="modern-sub-nav">
                            <button
                                className={`modern-subnav-item ${navigation.activeSub === 'directory' ? 'active' : ''}`}
                                onClick={() => handleSubNavChange('directory')}
                            >
                                Directory
                            </button>
                            <button
                                className={`modern-subnav-item ${navigation.activeSub === 'favorites' ? 'active' : ''}`}
                                onClick={() => handleSubNavChange('favorites')}
                            >
                                Favorites
                            </button>
                            <button
                                className={`modern-subnav-item ${navigation.activeSub === 'recent' ? 'active' : ''}`}
                                onClick={() => handleSubNavChange('recent')}
                            >
                                Recent
                            </button>
                        </div>
                    )}

                    {/* Sub navigation for Tools section */}
                    {navigation.activeSection === 'tools' && (
                        <div className="modern-sub-nav">
                            <button
                                className={`modern-subnav-item ${navigation.activeSub === 'analytics' ? 'active' : ''}`}
                                onClick={() => handleSubNavChange('analytics')}
                            >
                                Analytics
                            </button>
                            <button
                                className={`modern-subnav-item ${navigation.activeSub === 'monitor' ? 'active' : ''}`}
                                onClick={() => handleSubNavChange('monitor')}
                            >
                                Monitor
                            </button>
                            <button
                                className={`modern-subnav-item ${navigation.activeSub === 'reports' ? 'active' : ''}`}
                                onClick={() => handleSubNavChange('reports')}
                            >
                                Reports
                            </button>
                        </div>
                    )}

                    {/* Sub navigation for System section */}
                    {navigation.activeSection === 'system' && (
                        <div className="modern-sub-nav">
                            <button
                                className={`modern-subnav-item ${navigation.activeSub === 'config' ? 'active' : ''}`}
                                onClick={() => handleSubNavChange('config')}
                            >
                                Configuration
                            </button>
                            <button
                                className={`modern-subnav-item ${navigation.activeSub === 'users' ? 'active' : ''}`}
                                onClick={() => handleSubNavChange('users')}
                            >
                                Users
                            </button>
                            <button
                                className={`modern-subnav-item ${navigation.activeSub === 'security' ? 'active' : ''}`}
                                onClick={() => handleSubNavChange('security')}
                            >
                                Security
                            </button>
                        </div>
                    )}
                </nav>

                {/* Breadcrumb navigation */}
                <div className="modern-breadcrumbs">
                    {navigation.breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <span className="breadcrumb-separator">/</span>}
                            <span className="breadcrumb-item">{crumb}</span>
                        </React.Fragment>
                    ))}
                </div>
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