# agents/agent_factory.py
# Generic agent creator — reads any agent markdown definition file
# and returns a configured CrewAI Agent instance.

import re
import yaml
from crewai import Agent


def create_agent_from_file(filepath):
    """
    Create a CrewAI Agent from a markdown definition file.

    Expected file format:
    ---
    name: Amy Architect
    role: Senior Software Architect
    model: claude-opus-4-5-20251101
    verbose: true
    allow_delegation: false
    ---

    ## Goal
    [agent goal text]

    ## Backstory
    [agent backstory text]
    """
    with open(filepath, "r") as f:
        content = f.read()

    # Split YAML frontmatter from markdown body
    match = re.match(r"^---\n(.*?)\n---\n(.*)", content, re.DOTALL)
    if not match:
        raise ValueError(
            f"\nAgent file '{filepath}' is missing YAML frontmatter.\n"
            f"File must start with --- and contain name, role and model fields.\n"
        )

    config = yaml.safe_load(match.group(1))
    body   = match.group(2)

    # Validate required fields
    for field in ["name", "role", "model"]:
        if field not in config:
            raise ValueError(f"Agent file '{filepath}' is missing required field: '{field}'")

    # Extract ## Goal and ## Backstory sections
    goal_match      = re.search(r"## Goal\n(.*?)(?=\n## |\Z)", body, re.DOTALL)
    backstory_match = re.search(r"## Backstory\n(.*?)(?=\n## |\Z)", body, re.DOTALL)

    if not goal_match:
        raise ValueError(f"Agent file '{filepath}' is missing a ## Goal section.")
    if not backstory_match:
        raise ValueError(f"Agent file '{filepath}' is missing a ## Backstory section.")

    return Agent(
        name             = config["name"],
        role             = config["role"],
        goal             = goal_match.group(1).strip(),
        backstory        = backstory_match.group(1).strip(),
        llm              = config["model"],
        verbose          = config.get("verbose", True),
        allow_delegation = config.get("allow_delegation", False)
    )