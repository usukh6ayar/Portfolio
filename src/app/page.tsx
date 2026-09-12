import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { FeaturedProject } from "@/components/sections/FeaturedProject";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { SectionBridge } from "@/components/layout/SectionBridge";
import { STACKED_ORDER } from "@/lib/projects";

/**
 * Story: Hero → About → Featured → Works → Capabilities → Contact
 * Project sections use their own compact headings.
 */
export default function HomePage() {
  return (
    <div className="section-flow">
      <Hero />

      <About />

      <FeaturedProject />

      {/* Selected Works — only when secondary projects exist (see STACKED_ORDER) */}
      {STACKED_ORDER.length > 0 && (
        <SelectedWorks />
      )}

      <Skills />

      <SectionBridge next="contact" />
      <Contact />
    </div>
  );
}
