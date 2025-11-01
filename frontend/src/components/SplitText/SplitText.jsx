import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./SplitText.css";

const SplitText = ({ text, className = "" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll(".split-char");

    // Animate in once (entrance)
    gsap.fromTo(
      chars,
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
        onComplete: () => {
          // After entrance, add infinite looping shimmer
          gsap.to(chars, {
            y: -4, // small up movement
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            stagger: 0.05,
          });
        },
      }
    );
  }, [text]);

  return (
    <h1 ref={containerRef} className={`split-text ${className}`}>
      {text.split("").map((char, i) => (
        <span key={i} className="split-char">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
};

export default SplitText;
