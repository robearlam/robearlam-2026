# main.py
import os
from dotenv import load_dotenv
from crewai import Crew, Process

from agents.spec_agent import create_spec_agent
from agents.ui_designer_agent import create_ui_designer_agent
from agents.architect_agent import create_architect_agent
from agents.qa_agent import create_qa_agent
from agents.developer_agent import create_developer_agent
from agents.security_agent import create_security_agent

from tasks.tasks import (
    create_spec_task,
    create_ui_design_task,
    create_architecture_task,
    create_tdd_task,
    create_dev_task,
    create_security_task
)

# Load API keys from .env
load_dotenv()

# ─────────────────────────────────────────────
# YOUR BRIEF — we'll fill this in properly in
# Phase 3, but a placeholder lives here for now
# ─────────────────────────────────────────────
USER_BRIEF = """
I am an experienced technology professional working in software engineering 
and architecture. I want to build a personal website that serves two purposes: 
showcasing my professional portfolio and publishing written content.

The site must include:

1. About / Bio — who I am, my professional background, areas of expertise, 
   and what makes my perspective distinctive in the technology field.

2. Blog — a section where I regularly publish articles. I have a large 
   archive of historical posts. Blog content must be organised by year 
   and month (e.g. /blog/2024/03/post-title). Posts should be browsable 
   by date as well as individually readable.

3. Speaking Engagements — a dedicated section for conference talks, panels 
   and webinars. Historical engagements must be organised by year and month. 
   Each engagement should show event name, topic, date and a brief description.

4. Contact — clear ways for people to get in touch, including links to 
   relevant professional social profiles (LinkedIn, GitHub etc.) and 
   optionally a contact form.

Visual direction: minimal and clean. Lots of white space, typography-led 
design. Primary accent colour must be dark red — this is a strong personal 
preference. Supporting palette should complement dark red without competing 
with it. Professional but human — not corporate. Must work beautifully 
on mobile and desktop.

The site should position me as a credible, experienced technology 
professional and thought leader in my field.
"""

def build_crew(user_brief):
    """
    Instantiate all agents, wire up all tasks with their
    context dependencies, and assemble the crew.
    """

    # ── Agents ──────────────────────────────
    spec_agent        = create_spec_agent()
    ui_designer_agent = create_ui_designer_agent()
    architect_agent   = create_architect_agent()
    qa_agent          = create_qa_agent()
    developer_agent   = create_developer_agent()
    security_agent    = create_security_agent()

    # ── Tasks (order matters — context flows downstream) ──
    spec_task         = create_spec_task(spec_agent, user_brief)
    ui_design_task    = create_ui_design_task(ui_designer_agent, spec_task)
    architecture_task = create_architecture_task(architect_agent, spec_task, ui_design_task)
    tdd_task          = create_tdd_task(qa_agent, spec_task, architecture_task)
    dev_task          = create_dev_task(developer_agent, spec_task, ui_design_task,
                                        architecture_task, tdd_task)
    security_task     = create_security_task(security_agent, dev_task)

    # ── Crew ────────────────────────────────
    crew = Crew(
        agents=[
            spec_agent,
            ui_designer_agent,
            architect_agent,
            qa_agent,
            developer_agent,
            security_agent
        ],
        tasks=[
            spec_task,
            ui_design_task,
            architecture_task,
            tdd_task,
            dev_task,
            security_task
        ],
        process=Process.sequential,  # tasks run in the order listed above
        verbose=True                 # print agent thinking to terminal
    )

    return crew


def run_pipeline(user_brief):
    """
    Run the full pipeline:
    Spec → UI Design → Architecture → TDD → Development → Security
    The test loop and file extraction are added in Phase 7.
    """
    print("\n" + "="*60)
    print("  HARNESS ENGINEERING PIPELINE")
    print("="*60 + "\n")

    crew = build_crew(user_brief)

    print("Starting pipeline...\n")
    result = crew.kickoff()

    print("\n" + "="*60)
    print("  PIPELINE COMPLETE")
    print("  Check the outputs/ folder for all deliverables:")
    print("    outputs/specification.md")
    print("    outputs/ui_design.md")
    print("    outputs/architecture.md")
    print("    outputs/test_suite.md")
    print("    outputs/codebase.md")
    print("    outputs/security_report.md")
    print("="*60 + "\n")

    return result


if __name__ == "__main__":
    run_pipeline(USER_BRIEF)