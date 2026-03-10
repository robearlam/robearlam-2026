# run_ui_design.py
# Runs the UI Designer Agent in isolation.
# Requires: outputs/specification.md (run run_spec.py first)

from dotenv import load_dotenv
from crewai import Crew, Process, Task
from agents.ui_designer_agent import create_ui_designer_agent
from utils import load_output

load_dotenv()

def run_ui_design():
    print("\n" + "="*60)
    print("  UI DESIGNER AGENT — Running in isolation")
    print("="*60 + "\n")

    specification = load_output("specification.md")

    ui_designer_agent = create_ui_designer_agent()

    task = Task(
        description=f"""
        Using the product specification below, create a complete visual design 
        specification for the personal website.

        PRODUCT SPECIFICATION:
        ---
        {specification}
        ---

        Your design specification must include:
        1. Aesthetic direction — the overall visual personality and feeling
        2. Colour palette — the primary accent colour MUST be dark red 
           (this is a firm client requirement, not a suggestion). Build the 
           full palette around dark red as the hero colour — supporting 
           colours should complement it without competing. Provide all colours 
           as exact hex codes with a usage rule for each.
        3. Typography — heading font, body font, code font as exact Google Fonts 
           names, with size scale, weights and line heights for each text style
        4. Spacing system — base unit and full scale as pixel values
        5. Layout structure — describe the layout of each page with enough detail 
           to understand visual hierarchy and content placement
        6. Component styling — navigation, buttons, cards, hero section, 
           blog post list, speaking engagement cards, contact section, footer
        7. Responsive behaviour — how the layout adapts at mobile, tablet, desktop
        8. Imagery and iconography direction
        9. Micro-interactions — hover states, transitions and animations

        Every value must be specific and implementable as code.
        No vague directions — back every decision with a concrete value.
        """,
        expected_output="""
        A structured markdown design specification document.
        All colours as hex codes. All fonts as exact Google Fonts names.
        All sizes as px or rem values. Layout descriptions precise enough 
        that no visual decisions are left to the developer.
        """,
        agent=ui_designer_agent,
        output_file="outputs/ui_design.md"
    )

    crew = Crew(
        agents=[ui_designer_agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True
    )

    result = crew.kickoff()

    print("\n" + "="*60)
    print("  UI DESIGN COMPLETE")
    print("  Review your design at: outputs/ui_design.md")
    print("="*60 + "\n")

    return result


if __name__ == "__main__":
    run_ui_design()