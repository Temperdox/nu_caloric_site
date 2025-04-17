// BurgerAnimation.jsx - ASCII animation for the terminal
import React, { useState, useEffect, useCallback, memo } from 'react';

// Detect OS for the exit message
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const exitMessage = isMac
    ? "Hold Cmd + C to quit"
    : "Hold Ctrl + C to quit";

// ASCII frames for the animation
const frames = [
    // Frame 1
    `
        ∧＿∧      ♪     🍔
      （´・ω・｀∩
       o    ,ﾉ
      Ｏ＿  .ﾉ
♪      (ノ
  ${exitMessage}
  `,
    // Frame 2
    `
       ∧＿∧  ♪          🍔
      ∩・ω・｀）
      |     ⊂ﾉ
      ｜   _⊃   ♪
      し ⌒ 
  ${exitMessage}
  `,
    // Frame 3
    `  
        ∧＿∧      ♪      🍔
      （・∀・∩）
       o    ,ﾉ
      Ｏ＿  .ﾉ
♪      (ノ
  ${exitMessage}
  `,
    // Frame 4
    `
       ∧＿∧  ♪           🍔
      ∩＾ω＾）☆
      |    ⊂ﾉ
      ｜    _⊃   ♪
      し ⌒ 
  ${exitMessage}
  `,
    // Frames 5-10 (continue with more frames)
    // ...more frames as in the original
    // Final burger arc
    // Frame 11
    `
         ∧＿∧  ♪         
      （・ω・｀）       🍔
      (つ   と)
      ｜    _⊃
      し ⌒ 
  ${exitMessage}
  `,
    // Frame 12
    `
         ∧＿∧  ♪         
      （・ω・｀）     🍔     
      (つ   と)
      ｜    _⊃
      し ⌒ 
  ${exitMessage}
  `,
    // Frame 13
    `
         ∧＿∧  ♪   🍔    
      （・ω・｀）         
      (つ   と)
      ｜    _⊃
      し ⌒ 
  ${exitMessage}
  `,
    // Frame 14
    `
         ∧＿∧  ♪🍔        
      （・ω・｀）         
      (つ   と)
      ｜    _⊃
      し ⌒ 
  ${exitMessage}
  `
];

// CSS classes for colored elements
const styles = {
    burger: {
        color: '#FF69B4'
    },
    cat: {
        color: '#FF69B4'
    },
    eyes: {
        color: '#00FFFF'
    }
};

const BurgerAnimation = ({ onExit, setBurgerCompleted }) => {
    const [frameIndex, setFrameIndex] = useState(0);
    const [running, setRunning] = useState(true);

    // Update frame at regular interval
    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setFrameIndex(prev => (prev + 1) % frames.length);
        }, 200); // Animation speed

        return () => clearInterval(interval);
    }, [running]);

    // Handle key press for exit
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Exit on Ctrl+C or Cmd+C
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && running) {
                setRunning(false);
                if (onExit) {
                    setTimeout(() => onExit(false), 100);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Auto-complete after 30 seconds
        const autoCompleteTimer = setTimeout(() => {
            if (running) {
                setRunning(false);
                if (setBurgerCompleted) {
                    setBurgerCompleted(true);
                }
                if (onExit) {
                    setTimeout(() => onExit(true), 100);
                }
            }
        }, 30000);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(autoCompleteTimer);
        };
    }, [running, onExit, setBurgerCompleted]);

    // Process frame with color highlighting
    const processFrame = useCallback((frame) => {
        return frame
            // Pink cat parts with cyan eyes
            .replace(/∧＿∧/g, '<span style="color: #FF69B4">∧＿∧</span>')
            .replace(/（´・ω・｀∩/g, '<span style="color: #FF69B4">（´<span style="color: #00FFFF">・ω・</span>｀∩</span>')
            .replace(/∩・ω・｀）/g, '<span style="color: #FF69B4">∩<span style="color: #00FFFF">・ω・</span>｀）</span>')
            .replace(/（・∀・∩）/g, '<span style="color: #FF69B4">（<span style="color: #00FFFF">・∀・</span>∩）</span>')
            .replace(/∩＾ω＾）☆/g, '<span style="color: #FF69B4">∩<span style="color: #00FFFF">＾ω＾</span>）☆</span>')
            .replace(/（´・∀・｀∩/g, '<span style="color: #FF69B4">（´<span style="color: #00FFFF">・∀・</span>｀∩</span>')
            .replace(/∩≧▽≦）☆/g, '<span style="color: #FF69B4">∩<span style="color: #00FFFF">≧▽≦</span>）☆</span>')
            .replace(/（｡♥‿♥｡∩/g, '<span style="color: #FF69B4">（｡<span style="color: #00FFFF">♥‿♥</span>｡∩</span>')
            .replace(/∩￣ー￣）☆/g, '<span style="color: #FF69B4">∩<span style="color: #00FFFF">￣ー￣</span>）☆</span>')
            .replace(/（・ω・｀∩/g, '<span style="color: #FF69B4">（<span style="color: #00FFFF">・ω・</span>｀∩</span>')
            .replace(/∩＾o＾）☆/g, '<span style="color: #FF69B4">∩<span style="color: #00FFFF">＾o＾</span>）☆</span>')
            .replace(/（・ω・｀）/g, '<span style="color: #FF69B4">（<span style="color: #00FFFF">・ω・</span>｀）</span>')
            // Cat body parts
            .replace(/o\s+,ﾉ/g, '<span style="color: #FF69B4">o    ,ﾉ</span>')
            .replace(/Ｏ＿\s+\.ﾉ/g, '<span style="color: #FF69B4">Ｏ＿  .ﾉ</span>')
            .replace(/\(ノ/g, '<span style="color: #FF69B4">(ノ</span>')
            .replace(/\|\s+⊂ﾉ/g, '<span style="color: #FF69B4">|    ⊂ﾉ</span>')
            .replace(/｜\s+_⊃/g, '<span style="color: #FF69B4">｜    _⊃</span>')
            .replace(/し ⌒/g, '<span style="color: #FF69B4">し ⌒</span>')
            .replace(/\(つ\s+と\)/g, '<span style="color: #FF69B4">(つ   と)</span>')
            // Pink burger
            .replace(/🍔/g, '<span style="color: #FF69B4">🍔</span>');
    }, []);

    const displayFrame = processFrame(frames[frameIndex]);

    return (
        <div className="burger-animation" style={{ fontFamily: 'monospace', whiteSpace: 'pre', lineHeight: '1.2' }}>
            <pre dangerouslySetInnerHTML={{ __html: displayFrame }} style={{ margin: 0 }} />
        </div>
    );
};

export default memo(BurgerAnimation);