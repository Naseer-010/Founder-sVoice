/**
 * GlassPanel.jsx — Reusable glassmorphism container component.
 *
 * Provides consistent glass styling with optional header and animations.
 * Used throughout the app for consistent visual language.
 */

import { motion } from "framer-motion";

export default function GlassPanel({
  children,
  title,
  subtitle,
  className = "",
  variant = "default",
  animate = true,
  ...props
}) {
  const variants = {
    default: "glass",
    strong: "glass-strong",
  };

  const Wrapper = animate ? motion.div : "div";
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
      }
    : {};

  return (
    <Wrapper
      className={`${variants[variant] || variants.default} p-5 ${className}`}
      {...animationProps}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-sm font-semibold tracking-wide uppercase text-text-secondary">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-text-muted mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </Wrapper>
  );
}
