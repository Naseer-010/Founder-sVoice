/**
 * VisualLayer.jsx — Dynamic visual content router.
 *
 * Receives visual payloads from agent RPC calls and renders
 * the appropriate visual component with smooth transitions.
 *
 * Acts as a factory/router pattern — maps visual types to React components.
 */

import { AnimatePresence } from "framer-motion";
import { VISUAL_TYPES } from "../../utils/constants";

import WelcomeVisual from "./WelcomeVisual";
import ServicesSlide from "./ServicesSlide";
import ServiceDetail from "./ServiceDetail";
import ProcessDiagram from "./ProcessDiagram";
import CaseStudyCard from "./CaseStudyCard";

const VISUAL_COMPONENTS = {
  [VISUAL_TYPES.WELCOME]: WelcomeVisual,
  [VISUAL_TYPES.SERVICES_OVERVIEW]: ServicesSlide,
  [VISUAL_TYPES.SERVICE_DETAIL]: ServiceDetail,
  [VISUAL_TYPES.PROCESS_DIAGRAM]: ProcessDiagram,
  [VISUAL_TYPES.CASE_STUDY]: CaseStudyCard,
};

/**
 * @param {{ currentVisual: { type: string, data: any } | null }} props
 */
export default function VisualLayer({ currentVisual }) {
  const visualType = currentVisual?.type || VISUAL_TYPES.WELCOME;
  const visualData = currentVisual?.data || null;

  const Component = VISUAL_COMPONENTS[visualType] || WelcomeVisual;

  return (
    <div className="panel-surface w-full overflow-hidden glass">
      <AnimatePresence mode="wait">
        <Component key={visualType} data={visualData} />
      </AnimatePresence>
    </div>
  );
}
