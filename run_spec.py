# run_spec.py
from dotenv import load_dotenv
from crewai import Crew, Process
from agents.spec_agent import create_spec_agent
from tasks.tasks import create_spec_task
from main import USER_BRIEF

load_dotenv()

def run_spec_only():
    print("\n" + "="*60)
    print("  SPEC AGENT — Running in isolation")
    print("="*60 + "\n")

    agent = create_spec_agent()
    task  = create_spec_task(agent, USER_BRIEF)

    Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True).kickoff()

    print("\n  Done — review outputs/specification.md\n")

if __name__ == "__main__":
    run_spec_only()