# run_spec.py
# Runs Sam Spec in isolation.
# Use this to regenerate the specification from your brief.

from dotenv import load_dotenv
from crewai import Crew, Process
from agents.agent_factory import create_agent_from_file
from tasks.tasks import create_spec_task
from main import load_brief

load_dotenv()

if __name__ == "__main__":
    print("\n[ Sam Spec ] Generating specification...\n")
    agent = create_agent_from_file("agents/definitions/sam_spec.md")
    task = create_spec_task(agent, load_brief())
    Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True).kickoff()
    print("\n  Done — review outputs/specification.md\n")