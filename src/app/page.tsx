import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { FeaturedProject } from "@/components/sections/FeaturedProject";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { SectionBridge } from "@/components/layout/SectionBridge";
import { STACKED_ORDER } from "@/lib/projects";

/**
 * Story: Hero → Featured → Works → Services → Process → About → Capabilities → Contact
 *
 * Proof first, then what it buys you, then who I am. About sits below the work
 * deliberately: a stranger has no reason to care who I am until they have seen
 * something. Project sections use their own compact headings.
 */
export default function HomePage() {
  return (
    <div className="section-flow">
      <Hero />

      <FeaturedProject />

      {/* Selected Works — only when secondary projects exist (see STACKED_ORDER) */}
      {STACKED_ORDER.length > 0 && (
        <SelectedWorks />
      )}

      <SectionBridge next="services" />
      <Services />

      <Process />

      <About />

      <Skills />

      <SectionBridge next="contact" />
      <Contact />
    </div>
  );
}
