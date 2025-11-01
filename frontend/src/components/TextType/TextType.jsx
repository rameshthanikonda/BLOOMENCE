'use client';

import { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

const TextType = ({
  text,
  as: Component = 'span',
  typingSpeed = 80,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 40,
  loop = true,
  className = '',
  showCursor = true,
  cursorCharacter = '|',
  cursorBlinkDuration = 0.5,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible] = useState(true);
  const cursorRef = useRef(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return;

    let timeout;
    const currentText = textArray[0];

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev + currentText[currentCharIndex]);
            setCurrentCharIndex(prev => prev + 1);
          }, typingSpeed);
        } else {
          timeout = setTimeout(() => {
            setIsDeleting(true);
            setCurrentCharIndex(0);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
  }, [currentCharIndex, displayedText, isDeleting, typingSpeed, deletingSpeed, pauseDuration, textArray, isVisible, initialDelay]);

  return createElement(
    Component,
    { className: `text-type ${className}` },
    <span className="text-type__content">{displayedText}</span>,
    showCursor && (
      <span ref={cursorRef} className="text-type__cursor">
        {cursorCharacter}
      </span>
    )
  );
};

export default TextType;
