// SiteDirectory.jsx - Component for displaying website cards
import React, { useState, useRef } from 'react';
import '../../../assets/css/SiteDirectorySub.css';

// Sample site data - can be replaced with real data from an API or props
const siteData = [
    {
        id: 1,
        title: 'NuCaloric',
        description: 'Primary system dashboard for monitoring metrics and system status',
        image: 'src/assets/img/nu.png',
        url: '/sites/dashboard/main'
    },
    {
        id: 2,
        title: 'Traxus',
        description: 'User account management and permissions overview',
        image: '/assets/img/profile.jpg',
        url: '/sites/profile/user'
    },
    {
        id: 3,
        title: 'Midas',
        description: 'View detailed system logs and security events',
        image: '/assets/img/logs.jpg',
        url: '/system/logs'
    },
    {
        id: 4,
        title: 'Sekaguchi Genetics',
        description: 'Comprehensive data analytics and visualization tools',
        image: '/assets/img/analytics.jpg',
        url: '/tools/analytics'
    },
    {
        id: 5,
        title: 'Lorem Ipsum',
        description: 'Lorem Ipsum',
        image: '/assets/img/monitor.jpg',
        url: '/tools/monitor'
    },
    {
        id: 6,
        title: 'Lorem Ipsum',
        description: 'Lorem Ipsum',
        image: '/assets/img/network.jpg',
        url: '/system/config/network'
    }
];

// RetroCard component with glitch effect
const RetroCard = ({ site, onNavigate }) => {
    const [hovered, setHovered] = useState(false);
    const [glitching, setGlitching] = useState(false);
    const cardRef = useRef(null);

    const handleMouseEnter = () => {
        setGlitching(true);
        setTimeout(() => {
            setGlitching(false);
            setHovered(true);
        }, 300); // Duration of glitch effect
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const handleClick = () => {
        if (onNavigate) {
            onNavigate(site.url);
        }
    };

    return (
        <div
            className={`retro-site-card ${hovered ? 'hovered' : ''} ${glitching ? 'glitching' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            ref={cardRef}
        >
            <div className="retro-card-shadow"></div>
            <div className="retro-card-image-container">
                <img src={site.image} alt={site.title} className="retro-card-image" />
            </div>
            <div className="retro-card-overlay">
                <h3 className="retro-card-title">{site.title}</h3>
                <p className="retro-card-description">{site.description}</p>
                <button className="retro-card-button">Visit Site</button>
            </div>
        </div>
    );
};

// ModernCard component with 3D transform and parallax effect
const ModernCard = ({ site, onNavigate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        // Calculate mouse position relative to card center (values from -1 to 1)
        const x = (e.clientX - rect.left) / rect.width * 2 - 1;
        const y = (e.clientY - rect.top) / rect.height * 2 - 1;

        setMousePosition({ x, y });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
    };

    const handleClick = () => {
        if (onNavigate) {
            onNavigate(site.url);
        }
    };

    // Calculate transform based on mouse position
    const transform = isHovered
        ? `perspective(1000px) rotateX(${mousePosition.y * -10}deg) rotateY(${mousePosition.x * 10}deg)`
        : 'perspective(1000px) rotateX(0) rotateY(0)';

    // Calculate parallax for image
    const imageTransform = isHovered
        ? `translateX(${mousePosition.x * -20}px) translateY(${mousePosition.y * -20}px)`
        : 'translateX(0) translateY(0)';

    return (
        <div
            className={`modern-site-card ${isHovered ? 'hovered' : ''}`}
            style={{ transform }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            ref={cardRef}
        >
            <div
                className="modern-card-image-container"
                style={{ transform: imageTransform }}
            >
                <img src={site.image} alt={site.title} className="modern-card-image" />
            </div>
            <div className="modern-card-overlay">
                <h3 className="modern-card-title">{site.title}</h3>
                <p className="modern-card-description">{site.description}</p>
                <button className="modern-card-button">Visit Site</button>
            </div>
        </div>
    );
};

// Main SiteDirectory component
const SiteDirectory = ({ isModern = false, onNavigate }) => {
    return (
        <div className={`site-directory ${isModern ? 'modern' : 'retro'}`}>
            <div className={`site-directory-header ${isModern ? 'modern-header' : 'retro-header'}`}>
                <p>Access system components and tools</p>
            </div>

            <div className="site-directory-grid">
                {siteData.map((site) => (
                    isModern ? (
                        <ModernCard key={site.id} site={site} onNavigate={onNavigate} />
                    ) : (
                        <RetroCard key={site.id} site={site} onNavigate={onNavigate} />
                    )
                ))}
            </div>
        </div>
    );
};

export default SiteDirectory;