# run_ui_design.py
# Runs Donna Design in isolation.
# Requires: outputs/specification.md

from dotenv import load_dotenv
from crewai import Crew, Process
from agents.agent_factory import create_agent_from_file
from tasks.tasks import create_ui_design_task
from utils import load_output

load_dotenv()

if __name__ == "__main__":
    print("\n[ Donna Design ] Generating UI design...\n")
    agent = create_agent_from_file("agents/definitions/donna_design.md")
    task  = create_ui_design_task(agent, load_output("specification.md"))
    Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True).kickoff()
    print("\n  Done — review outputs/ui_design.md\n")