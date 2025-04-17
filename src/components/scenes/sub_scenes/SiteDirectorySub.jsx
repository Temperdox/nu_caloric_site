// SiteDirectorySub.jsx - Sub scene component for site directory
import React, { useState, useCallback } from 'react';
import SiteDirectory from '../components/SiteDirectory';

// This sub scene can be used in both the retro and modern main scenes
const SiteDirectorySub = ({ isModern = false, onNavigate }) => {
    const [currentSection, setCurrentSection] = useState('sites');

    // Handle internal navigation within the sub scene
    const handleNavigation = useCallback((url) => {
        // If we have a parent navigation handler, use it
        if (onNavigate) {
            onNavigate(url);
        } else {
            console.log(`Navigation to: ${url}`);
        }
    }, [onNavigate]);

    return (
        <div className={`sub-scene ${isModern ? 'modern-sub-scene' : 'retro-sub-scene'}`}>
            <div className={`sub-scene-header ${isModern ? 'modern-header' : 'retro-header'}`}>
                <h1>NuCaloric System Directory</h1>

                {/* Simple navigation tabs */}
                <div className={`sub-scene-tabs ${isModern ? 'modern-tabs' : 'retro-tabs'}`}>
                    <button
                        className={currentSection === 'sites' ? 'active' : ''}
                        onClick={() => setCurrentSection('sites')}
                    >
                        Sites
                    </button>
                    <button
                        className={currentSection === 'tools' ? 'active' : ''}
                        onClick={() => setCurrentSection('tools')}
                    >
                        Tools
                    </button>
                    <button
                        className={currentSection === 'admin' ? 'active' : ''}
                        onClick={() => setCurrentSection('admin')}
                    >
                        Admin
                    </button>
                </div>
            </div>

            <div className="sub-scene-content">
                {currentSection === 'sites' && (
                    <SiteDirectory isModern={isModern} onNavigate={handleNavigation} />
                )}

                {currentSection === 'tools' && (
                    <div className={`tools-placeholder ${isModern ? 'modern-placeholder' : 'retro-placeholder'}`}>
                        <h3>System Tools</h3>
                        <p>Tools section is under construction.</p>
                    </div>
                )}

                {currentSection === 'admin' && (
                    <div className={`admin-placeholder ${isModern ? 'modern-placeholder' : 'retro-placeholder'}`}>
                        <h3>Admin Panel</h3>
                        <p>Admin section requires elevated privileges.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SiteDirectorySub;