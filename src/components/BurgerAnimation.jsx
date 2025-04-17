// BurgerAnimation.jsx - ASCII animation for the terminal with improved cat art
import React, { useState, useEffect, useCallback } from 'react';

// Detect OS for the exit message
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const exitMessage = isMac
    ? "Hold Cmd + C to quit"
    : "Hold Ctrl + C to quit";

// ASCII frames for the animation using the provided cat art style
// Using template literals with backticks consistently for multiline strings
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
    // Frame 5
    `    
        ∧＿∧      ♪      🍔
      （´・∀・｀∩
       o    ,ﾉ
      Ｏ＿  .ﾉ
♪      (ノ
  ${exitMessage}
  `,
    // Frame 6
    `
        ∧＿∧  ♪          🍔
      ∩ ≧▽≦）☆
      |    ⊂ﾉ
      ｜    _⊃   ♪
      し ⌒ 
  ${exitMessage}
  `,
    // Frame 7
    `       
        ∧＿∧      ♪       🍔
      （｡♥‿♥｡∩
       o    ,ﾉ
      Ｏ＿  .ﾉ
♪      (ノ
  ${exitMessage}
  `,
    // Frame 8
    `
       ∧＿∧  ♪             🍔
      ∩￣ー￣）☆
      |    ⊂ﾉ
      ｜    _⊃   ♪
      し ⌒ 
  ${exitMessage}
  `,
    // Frame 9
    `        
        ∧＿∧      ♪        🍔
      （・ω・｀∩
       o    ,ﾉ
      Ｏ＿  .ﾉ
♪      (ノ
  ${exitMessage}
  `,
    // Frame 10
    `
       ∧＿∧  ♪          🍔
      ∩＾o＾）☆
      |    ⊂ﾉ
      ｜    _⊃   ♪
      し ⌒ 
  ${exitMessage}
  `,
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

// CSS for terminal styling - Directly inject instead of relying on external file
const burgerAnimationCss = `
.burger-animation {
  margin: 10px 0;
  font-family: monospace;
  line-height: 1.2;
  white-space: pre;
}

.pink-cat {
  color: #FF69B4 !important;
}

.cyan-eyes {
  color: #00FFFF !important;
}

.pink-burger {
  color: #FF69B4 !important;
}
`;

// The animation component
const BurgerAnimation = ({ onExit }) => {
    const [frameIndex, setFrameIndex] = useState(0);
    const [running, setRunning] = useState(true);

    // Inject CSS styles directly
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = burgerAnimationCss;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

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
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                setRunning(false);
                if (onExit) {
                    setTimeout(onExit, 100);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onExit]);

    // For terminal display, convert to HTML with CSS classes
    const processFrame = useCallback((frame) => {
        return frame
            // Pink cat parts with cyan eyes
            .replace(/∧＿∧/g, '<span class="pink-cat">∧＿∧</span>')
            .replace(/（´・ω・｀∩/g, '<span class="pink-cat">（´<span class="cyan-eyes">・ω・</span>｀∩</span>')
            .replace(/∩・ω・｀）/g, '<span class="pink-cat">∩<span class="cyan-eyes">・ω・</span>｀）</span>')
            .replace(/（・∀・∩）/g, '<span class="pink-cat">（<span class="cyan-eyes">・∀・</span>∩）</span>')
            .replace(/∩＾ω＾）☆/g, '<span class="pink-cat">∩<span class="cyan-eyes">＾ω＾</span>）☆</span>')
            .replace(/（´・∀・｀∩/g, '<span class="pink-cat">（´<span class="cyan-eyes">・∀・</span>｀∩</span>')
            .replace(/∩≧▽≦）☆/g, '<span class="pink-cat">∩<span class="cyan-eyes">≧▽≦</span>）☆</span>')
            .replace(/（｡♥‿♥｡∩/g, '<span class="pink-cat">（｡<span class="cyan-eyes">♥‿♥</span>｡∩</span>')
            .replace(/∩￣ー￣）☆/g, '<span class="pink-cat">∩<span class="cyan-eyes">￣ー￣</span>）☆</span>')
            .replace(/（・ω・｀∩/g, '<span class="pink-cat">（<span class="cyan-eyes">・ω・</span>｀∩</span>')
            .replace(/∩＾o＾）☆/g, '<span class="pink-cat">∩<span class="cyan-eyes">＾o＾</span>）☆</span>')
            .replace(/（・ω・｀）/g, '<span class="pink-cat">（<span class="cyan-eyes">・ω・</span>｀）</span>')
            // Cat body parts
            .replace(/o\s+,ﾉ/g, '<span class="pink-cat">o    ,ﾉ</span>')
            .replace(/Ｏ＿\s+\.ﾉ/g, '<span class="pink-cat">Ｏ＿  .ﾉ</span>')
            .replace(/\(ノ/g, '<span class="pink-cat">(ノ</span>')
            .replace(/\|\s+⊂ﾉ/g, '<span class="pink-cat">|    ⊂ﾉ</span>')
            .replace(/｜\s+_⊃/g, '<span class="pink-cat">｜    _⊃</span>')
            .replace(/し ⌒/g, '<span class="pink-cat">し ⌒</span>')
            .replace(/\(つ\s+と\)/g, '<span class="pink-cat">(つ  と)</span>')
            // Pink burger
            .replace(/🍔/g, '<span class="pink-burger">🍔</span>');
    }, []);

    const displayFrame = processFrame(frames[frameIndex]);

    return (
        <div className="burger-animation">
            <pre dangerouslySetInnerHTML={{ __html: displayFrame }} style={{ margin: 0 }}/>
        </div>
    );
};

export default BurgerAnimation;