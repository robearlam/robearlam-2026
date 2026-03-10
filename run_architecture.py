# run_architecture.py
from dotenv import load_dotenv
from crewai import Crew, Process
from agents.architect_agent import create_architect_agent
from tasks.tasks import create_architecture_task
from utils import load_output

load_dotenv()

def run_architecture():
    print("\n" + "="*60)
    print("  ARCHITECT AGENT — Running in isolation")
    print("="*60 + "\n")

    agent = create_architect_agent()
    task  = create_architecture_task(
                agent,
                load_output("specification.md"),
                load_output("ui_design.md")
            )

    Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True).kickoff()

    print("\n  Done — review outputs/architecture.md\n")

if __name__ == "__main__":
    run_architecture()