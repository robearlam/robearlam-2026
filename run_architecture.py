# run_architecture.py
# Runs the Architect Agent in isolation.
# Requires: outputs/specification.md and outputs/ui_design.md

from dotenv import load_dotenv
from crewai import Crew, Process, Task
from agents.architect_agent import create_architect_agent
from utils import load_output

load_dotenv()

def run_architecture():
    print("\n" + "="*60)
    print("  ARCHITECT AGENT — Running in isolation")
    print("="*60 + "\n")

    specification = load_output("specification.md")
    ui_design     = load_output("ui_design.md")

    architect_agent = create_architect_agent()

    task = Task(
        description=f"""
        Using the product specification and visual design specification below,
        create the complete technical architecture for a Next.js 16 personal website.

        PRODUCT SPECIFICATION:
        ---
        {specification}
        ---

        VISUAL DESIGN SPECIFICATION:
        ---
        {ui_design}
        ---

        Your architecture must include:
        1. Project folder structure — every directory and key file as an ASCII tree
        2. Component breakdown — every React component, its purpose, its props, 
           and which visual design elements from the UI spec it implements
        3. Page breakdown — which components each page composes and how
        4. TypeScript interfaces and types needed
        5. Routing plan — all Next.js 16 routes, static vs dynamic.
           Blog posts must follow the pattern /blog/[year]/[month]/[slug].
           Speaking engagements must follow /speaking/[year]/[month]/[slug].
           Content files must be organised in the file system to mirror 
           this structure — e.g. content/blog/2024/03/post-title.md
           This must support a large archive of historical content.
        6. Tailwind configuration — map every colour, font and spacing value 
           from the UI design spec into tailwind.config.ts values
        7. Third-party packages required (exact npm package names and versions)
        8. Environment variables needed and where they are used
        9. Build and run instructions

        For every significant architectural decision, briefly state why you 
        chose it over the alternative. Your architecture must make the UI 
        design fully implementable — if anything in the design is technically 
        complex, call it out and explain how to handle it.
        """,
        expected_output="""
        A structured markdown document with the full technical architecture.
        Folder structure as an ASCII tree. Component breakdown with props 
        clearly defined. Tailwind config values mapped directly from the 
        UI design spec. All package names and versions explicit.
        """,
        agent=architect_agent,
        context=[],
        output_file="outputs/architecture.md"
    )

    crew = Crew(
        agents=[architect_agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True
    )

    result = crew.kickoff()

    print("\n" + "="*60)
    print("  ARCHITECTURE COMPLETE")
    print("  Review your architecture at: outputs/architecture.md")
    print("="*60 + "\n")

    return result


if __name__ == "__main__":
    run_architecture()