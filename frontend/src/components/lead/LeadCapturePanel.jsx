/**
 * LeadCapturePanel.jsx — Displays captured discovery info in real-time.
 *
 * Receives state updates from the RPC handler and animates new fields
 * as they are captured by the agent.
 */

import { motion, AnimatePresence } from "framer-motion";
import { LEAD_FIELDS } from "../../utils/constants";

export default function LeadCapturePanel({ capturedFields }) {
  const fields = Object.entries(capturedFields || {});
  
  return (
    <div className="panel-surface flex flex-col bg-bg-glass backdrop-blur-xl border border-border-glass overflow-hidden relative">
      {/* Decorative gradient header */}
      <div className="h-1 w-full bg-gradient-to-r from-accent-purple to-accent-emerald" />
      
      <div className="px-5 py-4 border-b border-border-glass">
        <h3 className="text-sm font-semibold text-text-primary tracking-wide flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-purple">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Discovery Capture
        </h3>
        <p className="text-xs text-text-muted mt-1">
          Alex is updating this as you speak
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {fields.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full border border-dashed border-border-glass-active flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <p className="text-sm text-text-muted">Waiting for details...</p>
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {fields.map(([key, value]) => {
                const fieldConfig = LEAD_FIELDS[key] || { label: key, icon: "📌" };
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="p-3 rounded-xl bg-bg-secondary/40 border border-border-glass hover:bg-bg-glass transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm">{fieldConfig.icon}</span>
                      <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        {fieldConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-text-primary ml-6 break-words leading-relaxed">
                      {value}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
