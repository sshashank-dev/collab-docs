import React, { useRef, useState } from "react";

export default function DirectionHover({
    title = "COLLABDOCS",
    font = {},
    gap = 0,
    textColor = "#f3f5f8",
    hoverColor = "#6E92FF",
    transition = {},
    style = {},
}) {
    const containerRef = useRef(null);
    const [direction, setDirection] = useState("none");

    const duration = transition.duration || 0.4;

    const ease =
        transition.ease === "easeIn"
            ? "ease-in"
            : transition.ease === "easeOut"
                ? "ease-out"
                : transition.ease === "linear"
                    ? "linear"
                    : "cubic-bezier(0.22, 1, 0.36, 1)";

    const handleMouseEnter = (event) => {
        const element = containerRef.current;

        if (!element) return;

        const rect = element.getBoundingClientRect();
        const mouseY = event.clientY - rect.top;

        if (mouseY < rect.height / 2) {
            setDirection("top");
        } else {
            setDirection("bottom");
        }
    };

    const handleMouseLeave = () => {
        setDirection("none");
    };

    /*
      IMPORTANT:
      We use 1em instead of percentages.
  
      The stack contains:
  
      BLUE
      WHITE
      BLUE
  
      Each line is exactly 1em high.
    */
    let transform = "translateY(calc(-1em - 0px))";

    if (direction === "top") {
        transform = "translateY(0)";
    }

    if (direction === "bottom") {
        transform = `translateY(calc(-2em - ${gap * 2}px))`;
    }

    const textStyle = {
        ...font,

        display: "block",

        width: "100%",
        height: "1em",

        margin: 0,
        padding: 0,

        lineHeight: 1,

        whiteSpace: "nowrap",

        textAlign: "center",

        flexShrink: 0,
    };

    return (
        <span
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                ...style,

                /*
                  This establishes the actual font size
                  for the 1em measurements below.
                */
                fontSize: font.fontSize,

                position: "relative",

                display: "inline-block",

                height: "1em",

                overflow: "hidden",

                cursor: "pointer",

                userSelect: "none",

                verticalAlign: "top",
            }}
        >
            <span
                style={{
                    display: "flex",
                    flexDirection: "column",

                    gap: `${gap}px`,

                    transform,

                    transition: `transform ${duration}s ${ease}`,

                    willChange: "transform",
                }}
            >
                {/* BLUE - TOP */}
                <span
                    style={{
                        ...textStyle,
                        color: hoverColor,
                    }}
                >
                    {title}
                </span>

                {/* WHITE - NORMAL */}
                <span
                    style={{
                        ...textStyle,
                        color: textColor,
                    }}
                >
                    {title}
                </span>

                {/* BLUE - BOTTOM */}
                <span
                    style={{
                        ...textStyle,
                        color: hoverColor,
                    }}
                >
                    {title}
                </span>
            </span>
        </span>
    );
}