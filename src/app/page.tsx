import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { FeaturedProject } from "@/components/sections/FeaturedProject";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { SectionBridge } from "@/components/layout/SectionBridge";

/**
 * Story: Hero → About → Featured → Works → Capabilities → Contact
 * Bridges only where chapter weight needs a deliberate handoff.
 */
export default function HomePage() {
  return (
    <div className="section-flow">
      <Hero />

      <About />

      <SectionBridge next="featured" />
      <FeaturedProject />

      <SectionBridge next="work" />
      <SelectedWorks />

      <Skills />

      <SectionBridge next="contact" />
      <Contact />
    </div>
  );
}
