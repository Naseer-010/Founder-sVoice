/**
 * VisualLayer.jsx — Routes agent visual payloads to sub-components.
 */
import WelcomeVisual from "./visuals/WelcomeVisual";
import ServicesVisual from "./visuals/ServicesVisual";
import ServiceDetailVisual from "./visuals/ServiceDetailVisual";
import ProcessVisual from "./visuals/ProcessVisual";
import CaseStudyVisual from "./visuals/CaseStudyVisual";

const COMPONENTS = {
  welcome: WelcomeVisual,
  services_overview: ServicesVisual,
  service_detail: ServiceDetailVisual,
  process_diagram: ProcessVisual,
  case_study: CaseStudyVisual,
};

export default function VisualLayer({ visual }) {
  const type = visual?.type || "welcome";
  const Component = COMPONENTS[type] || WelcomeVisual;
  return (
    <div className="card" style={{ height: "100%", overflow: "hidden" }}>
      <Component data={visual?.data} />
    </div>
  );
}
