# run_spec.py
# Runs only the Spec Agent — use this to review and refine 
# the specification before running the full pipeline.

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

    spec_agent = create_spec_agent()
    spec_task  = create_spec_task(spec_agent, USER_BRIEF)

    crew = Crew(
        agents=[spec_agent],
        tasks=[spec_task],
        process=Process.sequential,
        verbose=True
    )

    result = crew.kickoff()

    print("\n" + "="*60)
    print("  SPEC COMPLETE")
    print("  Review your specification at: outputs/specification.md")
    print("="*60 + "\n")

    return result

if __name__ == "__main__":
    run_spec_only()