# run_ui_design.py
from dotenv import load_dotenv
from crewai import Crew, Process
from agents.ui_designer_agent import create_ui_designer_agent
from tasks.tasks import create_ui_design_task
from utils import load_output

load_dotenv()

def run_ui_design():
    print("\n" + "="*60)
    print("  UI DESIGNER AGENT — Running in isolation")
    print("="*60 + "\n")

    agent = create_ui_designer_agent()
    task  = create_ui_design_task(agent, load_output("specification.md"))

    Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True).kickoff()

    print("\n  Done — review outputs/ui_design.md\n")

if __name__ == "__main__":
    run_ui_design()