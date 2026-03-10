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

from utils import load_output

load_dotenv()

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


def run_agent(agent, task):
    """Run a single agent as its own mini-crew."""
    crew = Crew(
        agents=[agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True
    )
    return crew.kickoff()


def run_pipeline(user_brief):
    print("\n" + "="*60)
    print("  HARNESS ENGINEERING PIPELINE")
    print("="*60 + "\n")

    # ── Step 1: Spec ─────────────────────────────────────────
    print("[ 1 / 6 ] Running Spec Agent...\n")
    run_agent(create_spec_agent(), create_spec_task(create_spec_agent(), user_brief))

    # ── Step 2: UI Design ─────────────────────────────────────
    print("[ 2 / 6 ] Running UI Designer Agent...\n")
    specification = load_output("specification.md")
    run_agent(create_ui_designer_agent(),
              create_ui_design_task(create_ui_designer_agent(), specification))

    # ── Step 3: Architecture ──────────────────────────────────
    print("[ 3 / 6 ] Running Architect Agent...\n")
    ui_design = load_output("ui_design.md")
    run_agent(create_architect_agent(),
              create_architecture_task(create_architect_agent(), specification, ui_design))

    # ── Step 4: TDD ───────────────────────────────────────────
    print("[ 4 / 6 ] Running QA Agent (TDD)...\n")
    architecture = load_output("architecture.md")
    run_agent(create_qa_agent(),
              create_tdd_task(create_qa_agent(), specification, architecture))

    # ── Step 5: Development ───────────────────────────────────
    print("[ 5 / 6 ] Running Developer Agent...\n")
    test_suite = load_output("test_suite.md")
    run_agent(create_developer_agent(),
              create_dev_task(create_developer_agent(), specification,
                              ui_design, architecture, test_suite))

    # ── Step 6: Security ──────────────────────────────────────
    print("[ 6 / 6 ] Running Security Agent...\n")
    codebase = load_output("codebase.md")
    run_agent(create_security_agent(),
              create_security_task(create_security_agent(), codebase))

    print("\n" + "="*60)
    print("  PIPELINE COMPLETE")
    print("  Deliverables in outputs/:")
    print("    specification.md")
    print("    ui_design.md")
    print("    architecture.md")
    print("    test_suite.md")
    print("    codebase.md")
    print("    security_report.md")
    print("="*60 + "\n")


if __name__ == "__main__":
    run_pipeline(USER_BRIEF)