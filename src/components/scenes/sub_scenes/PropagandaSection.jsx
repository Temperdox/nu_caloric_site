// PropagandaSection.jsx - Integration of PropagandaSub into the main application
import React from 'react';
import PropagandaSub from './PropagandaSub.jsx';

// Main section wrapper that can be imported by both MainScene and ModernMainScene
const PropagandaSection = ({ isModern = false, onNavigate }) => {
    return (
        <div className={`sub-scene ${isModern ? 'modern-sub-scene' : 'retro-sub-scene'}`}>
            <div className={`sub-scene-header ${isModern ? 'modern-header' : 'retro-header'}`}>
                <h1>{isModern ? 'Information Distribution Center' : 'PROPAGANDA DATABASE'}</h1>

                {/* Optional: Sub-navigation or section-specific controls can be added here */}
                <div className={`sub-scene-controls ${isModern ? 'modern-controls' : 'retro-controls'}`}>
                    {/* If needed, add section controls here */}
                </div>
            </div>

            <div className="sub-scene-content">
                <PropagandaSub isModern={isModern} onNavigate={onNavigate} />
            </div>
        </div>
    );
};

export default PropagandaSection;