import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { FeaturedProject } from "@/components/sections/FeaturedProject";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Experience } from "@/components/sections/Experience";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { SectionBridge } from "@/components/layout/SectionBridge";
import { STACKED_ORDER } from "@/lib/projects";

/**
 * Story: Hero → Work → Experience → Services → Process → About → Skills → Contact
 *
 * Proof, then the record behind it, then what it buys you, then who I am.
 * About sits low deliberately: a stranger has no reason to care who I am until
 * they have seen something. Experience sits directly under the work because
 * "who paid him to do this" is the question that follows "what has he built".
 * Services appears before the tool list so visitors first understand what they
 * can hire me for; implementation details stay as later supporting evidence.
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

      <Experience />

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
