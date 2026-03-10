# run_dev.py
# Runs the Developer Agent in isolation.
# Requires: outputs/specification.md, outputs/ui_design.md,
#           outputs/architecture.md, outputs/test_suite.md

from dotenv import load_dotenv
from crewai import Crew, Process
from agents.developer_agent import create_developer_agent
from tasks.tasks import create_dev_task
from utils import load_output

load_dotenv()

def run_dev():
    print("\n" + "="*60)
    print("  DEVELOPER AGENT — Running in isolation")
    print("="*60 + "\n")

    agent = create_developer_agent()
    task  = create_dev_task(
                agent,
                load_output("specification.md"),
                load_output("ui_design.md"),
                load_output("architecture.md"),
                load_output("test_suite.md")
            )

    Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True).kickoff()

    print("\n  Done — review outputs/codebase.md\n")

if __name__ == "__main__":
    run_dev()