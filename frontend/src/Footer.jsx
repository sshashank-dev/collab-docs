import React from "react";
import DirectionHover from "./DirectionHover";

export default function Footer({ onHome }) {
  return (
    <>
      <footer className="collabdocs-dashboard-footer">
        <div className="collabdocs-footer-divider" />

        <div className="collabdocs-footer-inner">

          {/* Large Direction Hover wordmark */}
          <div className="collabdocs-footer-wordmark">
            <DirectionHover
              title="COLLABDOCS"
              font={{
                fontSize: "clamp(64px, 11vw, 150px)",
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.07em",
              }}
              gap={0}
              textColor="#f3f5f8"
              hoverColor="#6E92FF"
              transition={{
                type: "tween",
                duration: 0.4,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="collabdocs-footer-content">

            <div className="collabdocs-footer-brand">
              <div className="collabdocs-footer-title">
                CollabDocs
              </div>

              <div className="collabdocs-footer-tagline">
                Write. Collaborate. Create together.
              </div>
            </div>

            <div className="collabdocs-footer-links">
              <button
                type="button"
                onClick={onHome}
                className="collabdocs-footer-link"
              >
                Home
              </button>

              <span className="collabdocs-footer-dot">
                •
              </span>

              <span className="collabdocs-footer-info">
                Real-time collaborative workspace
              </span>
            </div>

          </div>
        </div>

        <div className="collabdocs-footer-copyright">
          © {new Date().getFullYear()} CollabDocs
          <span> · </span>
          All rights reserved
        </div>
      </footer>

      <style>{`
        .collabdocs-dashboard-footer {
          width: 100%;
          position: relative;
          overflow: hidden;

          /* Match the existing dashboard background */
          background: transparent;

          color: #f3f5f8;
          padding: 0 42px 30px;
          box-sizing: border-box;
        }

        .collabdocs-footer-divider {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 70px;
        }

        .collabdocs-footer-inner {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        .collabdocs-footer-wordmark {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin-bottom: 65px;
          overflow: visible;
        }

        .collabdocs-footer-content {
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          padding-bottom: 35px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .collabdocs-footer-brand {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .collabdocs-footer-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #f3f5f8;
        }

        .collabdocs-footer-tagline {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(243, 245, 248, 0.48);
          letter-spacing: 0.01em;
        }

        .collabdocs-footer-links {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 13px;
        }

        .collabdocs-footer-link {
          appearance: none;
          border: 0;
          outline: none;
          background: transparent;
          padding: 0;
          color: #f3f5f8;
          font: inherit;
          cursor: pointer;
          transition: color 0.25s ease;
        }

        .collabdocs-footer-link:hover {
          color: #6E92FF;
        }

        .collabdocs-footer-dot {
          color: rgba(255, 255, 255, 0.25);
        }

        .collabdocs-footer-info {
          color: rgba(243, 245, 248, 0.42);
        }

        .collabdocs-footer-copyright {
          width: 100%;
          max-width: 1500px;
          margin: 22px auto 0;
          font-size: 11px;
          line-height: 1.5;
          color: rgba(243, 245, 248, 0.28);
          letter-spacing: 0.01em;
        }

        @media (max-width: 800px) {
          .collabdocs-dashboard-footer {
            padding: 0 22px 25px;
          }

          .collabdocs-footer-divider {
            margin-bottom: 45px;
          }

          .collabdocs-footer-wordmark {
            justify-content: flex-start;
            margin-bottom: 45px;
          }

          .collabdocs-footer-content {
            align-items: flex-start;
            flex-direction: column;
            gap: 28px;
          }

          .collabdocs-footer-links {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .collabdocs-dashboard-footer {
            padding-left: 16px;
            padding-right: 16px;
          }

          .collabdocs-footer-divider {
            margin-bottom: 35px;
          }

          .collabdocs-footer-wordmark {
            margin-bottom: 35px;
          }

          .collabdocs-footer-title {
            font-size: 18px;
          }

          .collabdocs-footer-tagline {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}