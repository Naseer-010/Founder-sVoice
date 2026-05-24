/**
 * VisualLayer.jsx — Dynamic content router for agent visuals.
 */
import { AnimatePresence } from "framer-motion";
import { VISUAL_TYPES } from "../../utils/constants";

import WelcomeVisual from "./WelcomeVisual";
import ServicesSlide from "./ServicesSlide";
import ServiceDetail from "./ServiceDetail";
import ProcessDiagram from "./ProcessDiagram";
import CaseStudyCard from "./CaseStudyCard";

const COMPONENTS = {
  [VISUAL_TYPES.WELCOME]: WelcomeVisual,
  [VISUAL_TYPES.SERVICES_OVERVIEW]: ServicesSlide,
  [VISUAL_TYPES.SERVICE_DETAIL]: ServiceDetail,
  [VISUAL_TYPES.PROCESS_DIAGRAM]: ProcessDiagram,
  [VISUAL_TYPES.CASE_STUDY]: CaseStudyCard,
};

export default function VisualLayer({ currentVisual }) {
  const type = currentVisual?.type || VISUAL_TYPES.WELCOME;
  const Component = COMPONENTS[type] || WelcomeVisual;

  return (
    <div className="h-full w-full surface-1 overflow-hidden">
      <AnimatePresence mode="wait">
        <Component key={type} data={currentVisual?.data} />
      </AnimatePresence>
    </div>
  );
}
