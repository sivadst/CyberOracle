import { useState, useEffect } from "react";

export function useTypewriter(text: string, speed = 15) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayedText("");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    
    // Slight initial delay to simulate "thinking"
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        
        if (i >= text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(startDelay);
  }, [text, speed]);

  return { displayedText, isTyping };
}
