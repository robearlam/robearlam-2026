# run_qa.py
# Runs the QA Agent in isolation.
# Requires: outputs/specification.md and outputs/architecture.md

from dotenv import load_dotenv
from crewai import Crew, Process
from agents.qa_agent import create_qa_agent
from tasks.tasks import create_tdd_task
from utils import load_output

load_dotenv()

def run_qa():
    print("\n" + "="*60)
    print("  QA AGENT — Running in isolation (TDD)")
    print("="*60 + "\n")

    agent = create_qa_agent()
    task  = create_tdd_task(
                agent,
                load_output("specification.md"),
                load_output("architecture.md")
            )

    Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True).kickoff()

    print("\n  Done — review outputs/test_suite.md\n")

if __name__ == "__main__":
    run_qa()