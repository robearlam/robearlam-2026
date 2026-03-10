# run_architecture.py
# Runs Amy Architect in isolation.
# Requires: outputs/specification.md and outputs/ui_design.md

from dotenv import load_dotenv
from crewai import Crew, Process
from agents.agent_factory import create_agent_from_file
from tasks.tasks import create_architecture_task
from utils import load_output

load_dotenv()

if __name__ == "__main__":
    print("\n[ Amy Architect ] Generating architecture...\n")
    agent = create_agent_from_file("agents/definitions/amy_architect.md")
    task  = create_architecture_task(
                agent,
                load_output("specification.md"),
                load_output("ui_design.md")
            )
    Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True).kickoff()
    print("\n  Done — review outputs/architecture.md\n")