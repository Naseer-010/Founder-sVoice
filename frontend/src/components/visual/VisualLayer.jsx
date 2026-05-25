/**
 * VisualLayer.jsx — Routes agent visual payloads to sub-components.
 * Uses framer-motion AnimatePresence for smooth transitions between visuals.
 */
import { AnimatePresence } from "framer-motion";
import WelcomeVisual from "./WelcomeVisual";
import ServicesSlide from "./ServicesSlide";
import ServiceDetail from "./ServiceDetail";
import ProcessDiagram from "./ProcessDiagram";
import CaseStudyCard from "./CaseStudyCard";

const COMPONENTS = {
  welcome: WelcomeVisual,
  services_overview: ServicesSlide,
  service_detail: ServiceDetail,
  process_diagram: ProcessDiagram,
  case_study: CaseStudyCard,
};

export default function VisualLayer({ visual }) {
  const type = visual?.type || "welcome";
  const Component = COMPONENTS[type] || WelcomeVisual;
  return (
    <div className="card" style={{ height: "100%", overflow: "hidden" }}>
      <AnimatePresence mode="wait">
        <Component key={type} data={visual?.data} />
      </AnimatePresence>
    </div>
  );
}
