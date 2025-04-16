// ReInitDialog.js - Draggable dialog with Critical Error header
import React, { useState, useRef, useEffect } from 'react';

const ReInitDialog = ({ onConfirm, onCancel }) => {
    // State for dragging functionality
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const dialogRef = useRef(null);

    // Dialog positioning styles with dynamic position
    const dialogStyle = {
        position: 'absolute',
        top: `${position.y}px`,
        right: `${position.x}px`,
        width: '300px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        border: '1px solid #33ff33',
        boxShadow: '0 0 10px rgba(51, 255, 51, 0.5)',
        zIndex: 100,
        color: '#33ff33',
        fontFamily: 'Courier New, monospace',
        borderRadius: '4px',
        animation: 'dialogFadeIn 0.5s forwards',
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none'
    };

    // Header styles
    const headerStyle = {
        padding: '10px 15px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderBottom: '1px solid #33ff33',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        cursor: 'grab'
    };

    // Content container style
    const contentStyle = {
        padding: '15px'
    };

    // Button styles
    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px'
    };

    const buttonStyle = {
        padding: '8px 25px',
        backgroundColor: 'transparent',
        border: '1px solid #33ff33',
        color: '#33ff33',
        cursor: 'pointer',
        fontFamily: 'Courier New, monospace',
        fontSize: '14px',
        transition: 'all 0.2s ease'
    };

    const buttonHoverStyle = {
        backgroundColor: '#33ff33',
        color: '#000',
    };

    // Close button style
    const closeButtonStyle = {
        background: 'transparent',
        border: 'none',
        color: '#33ff33',
        fontSize: '16px',
        cursor: 'pointer',
        padding: '0 5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '20px',
        width: '20px',
        lineHeight: '1'
    };

    // Handle mousedown for dragging
    const handleMouseDown = (e) => {
        if (dialogRef.current && e.target.closest('.dialog-header')) {
            setIsDragging(true);

            // Calculate the offset from the mouse position to the dialog position
            const dialogRect = dialogRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - dialogRect.left,
                y: e.clientY - dialogRect.top
            });

            // Prevent text selection during drag
            e.preventDefault();
        }
    };

    // Handle mousemove for dragging
    const handleMouseMove = (e) => {
        if (isDragging) {
            // Calculate new position based on mouse position and initial offset
            setPosition({
                x: window.innerWidth - (e.clientX + (dialogRef.current.offsetWidth - dragOffset.x)),
                y: e.clientY - dragOffset.y
            });
        }
    };

    // Handle mouseup to end dragging
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Add and remove event listeners
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={dialogRef}
            style={dialogStyle}
            onMouseDown={handleMouseDown}
        >
            <div className="dialog-header" style={headerStyle}>
                <div style={{ fontWeight: 'bold', color: '#FF3333' }}>Critical Error</div>
                <button
                    style={closeButtonStyle}
                    onClick={onCancel}
                >
                    ✕
                </button>
            </div>

            <div style={contentStyle}>
                <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Re-Initialize User Interface?
                </div>
                <div style={buttonContainerStyle}>
                    <button
                        style={buttonStyle}
                        onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                        onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                        onClick={onConfirm}
                    >
                        Y
                    </button>
                    <button
                        style={buttonStyle}
                        onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                        onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                        onClick={onCancel}
                    >
                        N
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReInitDialog;