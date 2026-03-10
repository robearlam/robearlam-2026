# main.py
# Runs the full initial pipeline in sequence:
# Sam Spec → Donna Design → Amy Architect → Danny Dev (scaffold)
#
# Run this once at project start. After this, use run_feature.py
# for all subsequent development.

import os
from dotenv import load_dotenv
from crewai import Crew, Process

from agents.agent_factory import create_agent_from_file
from tasks.tasks import (
    create_spec_task,
    create_ui_design_task,
    create_architecture_task,
    create_scaffold_task
)
from utils import load_output

load_dotenv()

def load_brief():
    """Load the project brief from brief.md."""
    try:
        with open("brief.md", "r") as f:
            return f.read()
    except FileNotFoundError:
        raise FileNotFoundError(
            "\nCould not find 'brief.md'.\n"
            "Create it in the project root before running the pipeline.\n"
        )

def run_agent(agent, task):
    """Run a single agent as its own mini-crew."""
    return Crew(
        agents=[agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True
    ).kickoff()


def run_initial_pipeline():
    print("\n" + "="*60)
    print("  HARNESS ENGINEERING — Initial Pipeline")
    print("="*60)
    print("""
  This runs once to establish the project foundation:
    1. Sam Spec       → outputs/specification.md
    2. Donna Design   → outputs/ui_design.md
    3. Amy Architect  → outputs/architecture.md
    4. Danny Dev      → outputs/scaffold.md

  After this, use run_feature.py for all development.
""")

    # ── 1. Sam Spec ──────────────────────────────────────────
    print("[ 1 / 4 ] Sam Spec — Generating specification...\n")
    sam  = create_agent_from_file("agents/definitions/sam_spec.md")
    run_agent(sam, create_spec_task(sam, load_brief()))

    # ── 2. Donna Design ──────────────────────────────────────
    print("[ 2 / 4 ] Donna Design — Generating UI design...\n")
    donna = create_agent_from_file("agents/definitions/donna_design.md")
    run_agent(donna, create_ui_design_task(donna, load_output("specification.md")))

    # ── 3. Amy Architect ─────────────────────────────────────
    print("[ 3 / 4 ] Amy Architect — Generating architecture...\n")
    amy = create_agent_from_file("agents/definitions/amy_architect.md")
    run_agent(amy, create_architecture_task(
        amy,
        load_output("specification.md"),
        load_output("ui_design.md")
    ))

    # ── 4. Danny Dev — Scaffold ───────────────────────────────
    print("[ 4 / 4 ] Danny Dev — Scaffolding the site...\n")
    danny = create_agent_from_file("agents/definitions/danny_dev.md")
    run_agent(danny, create_scaffold_task(
        danny,
        load_output("specification.md"),
        load_output("ui_design.md"),
        load_output("architecture.md")
    ))

    print("\n" + "="*60)
    print("  INITIAL PIPELINE COMPLETE")
    print("  Deliverables:")
    print("    outputs/specification.md")
    print("    outputs/ui_design.md")
    print("    outputs/architecture.md")
    print("    outputs/scaffold.md")
    print("\n  Next step: review outputs, then run features with:")
    print("    python run_feature.py features/YYYY-MM-DD_feature-name.md")
    print("="*60 + "\n")


if __name__ == "__main__":
    run_initial_pipeline()