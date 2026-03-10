# run_feature.py
# Single entry point for all feature work.
#
# Usage:
#   python run_feature.py features/YYYY-MM-DD_feature-name.md
#
# The feature file drives everything — Felix analyses it,
# the pipeline routes accordingly, and a PR is raised at the end.

import os
import re
import sys
from dotenv import load_dotenv
from crewai import Crew, Process

from agents.agent_factory import create_agent_from_file
from tasks.tasks import (
    create_feature_analysis_task,
    create_feature_dev_task,
    create_feature_qa_task,
    create_mini_spec_task,
    create_mini_ui_task,
    create_mini_architecture_task,
    create_security_task
)
from utils import (
    load_output,
    load_feature_file,
    update_feature_file,
    load_all_feature_logs,
    create_feature_branch,
    commit_feature_changes,
    push_feature_branch,
    create_pull_request
)

load_dotenv()

MAX_FIX_CYCLES = 3  # Maximum times Danny Dev gets to fix failing tests


def run_agent(agent, task):
    """Run a single agent as its own mini-crew and return the result."""
    crew = Crew(
        agents=[agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True
    )
    return crew.kickoff()


def extract_tier(analysis_output):
    """
    Parse TIER 1 or TIER 2 from Felix's assessment output.
    Defaults to TIER 2 if ambiguous — better to over-plan than under-plan.
    """
    text = str(analysis_output).upper()
    if re.search(r'TIER\s*1', text):
        return 1
    elif re.search(r'TIER\s*2', text):
        return 2
    else:
        print("  Could not determine tier — defaulting to TIER 2 (safer option).")
        return 2


def load_codebase_index():
    """Load the running index of built files, if it exists."""
    path = "outputs/codebase_index.md"
    if os.path.exists(path):
        return load_output("codebase_index.md")
    return "No files have been built yet — this is the first feature run."


def header(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")


def step(agent_name, action):
    print(f"\n[ {agent_name} ] {action}...\n")


# ══════════════════════════════════════════════════════════════
#  MAIN FEATURE RUNNER
# ══════════════════════════════════════════════════════════════

def run_feature(feature_filepath):
    header("HARNESS ENGINEERING — Feature Runner")

    # ── Load feature file ────────────────────────────────────
    feature        = load_feature_file(feature_filepath)
    feature_name   = feature["config"]["feature"]
    feature_request = feature["sections"].get("Feature Request", "")

    if not feature_request:
        print("ERROR: Feature file has no ## Feature Request section.")
        sys.exit(1)

    print(f"Feature:  {feature_name}")
    print(f"File:     {feature_filepath}\n")

    # ── Create feature branch ────────────────────────────────
    branch_name = create_feature_branch(feature_name)

    # ── Load existing docs ───────────────────────────────────
    specification   = load_output("specification.md")
    ui_design       = load_output("ui_design.md")
    architecture    = load_output("architecture.md")
    feature_history = load_all_feature_logs()

    # ══ Step 1: Felix Feature — Analysis ════════════════════
    step("Felix Feature", "Analysing feature request")
    felix = create_agent_from_file("agents/definitions/felix_feature.md")
    analysis_result = run_agent(felix, create_feature_analysis_task(
        felix, feature_request,
        specification, ui_design, architecture, feature_history
    ))

    tier = extract_tier(analysis_result)
    print(f"\n  Verdict: TIER {tier}\n")

    update_feature_file(feature_filepath,
        config_updates  = {"tier": tier},
        section_updates = {"Analyst Assessment": str(analysis_result)}
    )

    # ══ Step 2: Tier 2 — Mini Planning Cycle ════════════════
    if tier == 2:
        header("TIER 2 — Running mini planning cycle")

        step("Sam Spec", "Extending specification")
        sam = create_agent_from_file("agents/definitions/sam_spec.md")
        run_agent(sam, create_mini_spec_task(
            sam, feature_request, specification
        ))
        specification = load_output("specification.md")

        step("Donna Design", "Extending UI design")
        donna = create_agent_from_file("agents/definitions/donna_design.md")
        run_agent(donna, create_mini_ui_task(
            donna, feature_request, ui_design, specification
        ))
        ui_design = load_output("ui_design.md")

        step("Amy Architect", "Extending architecture")
        amy = create_agent_from_file("agents/definitions/amy_architect.md")
        run_agent(amy, create_mini_architecture_task(
            amy, feature_request, architecture, specification, ui_design
        ))
        architecture = load_output("architecture.md")

    # ══ Step 3: Danny Dev — Implement Feature ══════════════
    step("Danny Dev", "Implementing feature")
    codebase_index = load_codebase_index()

    danny = create_agent_from_file("agents/definitions/danny_dev.md")
    run_agent(danny, create_feature_dev_task(
        danny, feature_request,
        specification, ui_design, architecture, codebase_index
    ))

    # ══ Step 4: Quinn Quality — Test & Fix Loop ═════════════
    fix_cycle    = 0
    tests_passed = False

    while not tests_passed and fix_cycle < MAX_FIX_CYCLES:
        feature_output = load_output("feature_output.md")

        if fix_cycle == 0:
            step("Quinn Quality", "Writing and running tests")
        else:
            step("Quinn Quality", f"Re-testing after fix cycle {fix_cycle}")

        quinn = create_agent_from_file("agents/definitions/quinn_quality.md")
        qa_result = run_agent(quinn, create_feature_qa_task(
            quinn, feature_request, specification, feature_output
        ))

        if "FAIL" in str(qa_result).upper():
            fix_cycle += 1
            if fix_cycle >= MAX_FIX_CYCLES:
                print(f"\n  Tests still failing after {MAX_FIX_CYCLES} fix cycles.")
                print("  Raising PR anyway — review failures in outputs/feature_qa.md\n")
                break

            step("Danny Dev", f"Fixing test failures (cycle {fix_cycle})")
            qa_output = load_output("feature_qa.md")
            danny     = create_agent_from_file("agents/definitions/danny_dev.md")
            run_agent(danny, create_feature_dev_task(
                danny,
                f"Fix the following test failures:\n\n{qa_output}",
                specification, ui_design, architecture, codebase_index
            ))
        else:
            tests_passed = True
            print("\n  All tests passed.\n")

    # ══ Step 5: Scott Security — Scan ══════════════════════
    step("Scott Security", "Scanning for vulnerabilities")
    feature_output = load_output("feature_output.md")
    scott = create_agent_from_file("agents/definitions/scott_security.md")
    run_agent(scott, create_security_task(scott, feature_output))

    # ══ Step 6: Update Feature File ════════════════════════
    qa_output       = load_output("feature_qa.md")
    security_output = load_output("security_report.md")

    update_feature_file(feature_filepath,
        config_updates  = {"status": "complete"},
        section_updates = {
            "Outcome": (
                f"- Branch: `{branch_name}`\n"
                f"- Tests passed: {'Yes' if tests_passed else 'No — see feature_qa.md'}\n"
                f"- Fix cycles: {fix_cycle}\n"
                f"- Security: see `outputs/security_report.md`\n"
            )
        }
    )

    # ══ Step 7: Commit, Push, Raise PR ═════════════════════
    commit_feature_changes(feature_name)
    push_feature_branch(branch_name)
    create_pull_request(feature_name, feature_filepath, base_branch="main")

    # ══ Summary ════════════════════════════════════════════
    header("FEATURE COMPLETE")
    print(f"  Feature:   {feature_name}")
    print(f"  Branch:    {branch_name}")
    print(f"  Tests:     {'Passed' if tests_passed else 'Review required'}")
    print(f"  Fix cycles: {fix_cycle}")
    print(f"\n  Review outputs before merging:")
    print(f"    outputs/feature_output.md")
    print(f"    outputs/feature_qa.md")
    print(f"    outputs/security_report.md")
    print(f"\n  PR raised — review and merge when happy.\n")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(
            "\nUsage: python run_feature.py features/YYYY-MM-DD_feature-name.md\n"
        )
        sys.exit(1)

    run_feature(sys.argv[1])