# run_scaffold.py
# Runs Danny Dev to scaffold the base Next.js site.
# Run this once after the initial planning pipeline.
# Requires: outputs/specification.md, outputs/ui_design.md,
#           outputs/architecture.md

from dotenv import load_dotenv
from crewai import Crew, Process
from agents.agent_factory import create_agent_from_file
from tasks.tasks import create_scaffold_task
from utils import load_output

load_dotenv()

if __name__ == "__main__":
    print("\n[ Danny Dev ] Scaffolding the site...\n")
    agent = create_agent_from_file("agents/definitions/danny_dev.md")
    task  = create_scaffold_task(
                agent,
                load_output("specification.md"),
                load_output("ui_design.md"),
                load_output("architecture.md")
            )
    Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True).kickoff()
    print("\n  Done — review outputs/scaffold.md\n")