import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { FeaturedProject } from "@/components/sections/FeaturedProject";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { SectionBridge } from "@/components/layout/SectionBridge";

/**
 * Continuous narrative:
 * Hero → About → Featured → Selected Works → Skills → Contact
 * SectionBridge softens each handoff so chapters read as one story.
 */
export default function HomePage() {
  return (
    <div className="section-flow">
      <Hero />

      <SectionBridge next="about" />
      <About />

      <SectionBridge next="featured" />
      <FeaturedProject />

      <SectionBridge next="work" />
      <SelectedWorks />

      <SectionBridge next="skills" />
      <Skills />

      <SectionBridge next="contact" />
      <Contact />
    </div>
  );
}
