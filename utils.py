# utils.py
# Shared utilities used across all runners and agents.

import os
import re
import yaml
from datetime import datetime


# ─── Output Files ────────────────────────────────────────────

def load_output(filename):
    """Read a previous agent's output from the outputs/ folder."""
    filepath = f"outputs/{filename}"
    try:
        with open(filepath, "r") as f:
            return f.read()
    except FileNotFoundError:
        raise FileNotFoundError(
            f"\nCould not find '{filepath}'.\n"
            f"Make sure the previous agent has run successfully.\n"
        )


# ─── Feature Files ────────────────────────────────────────────

def load_feature_file(filepath):
    """
    Read and parse a feature markdown file.
    Returns dict with 'config' (frontmatter) and 'sections' (markdown sections).
    """
    with open(filepath, "r") as f:
        content = f.read()

    match = re.match(r"^---\n(.*?)\n---\n(.*)", content, re.DOTALL)
    if not match:
        raise ValueError(
            f"Feature file '{filepath}' is missing YAML frontmatter.\n"
            f"File must start with --- and contain date and feature fields."
        )

    config   = yaml.safe_load(match.group(1))
    body     = match.group(2)
    sections = {}

    for m in re.finditer(r"## ([^\n]+)\n(.*?)(?=\n## |\Z)", body, re.DOTALL):
        sections[m.group(1).strip()] = m.group(2).strip()

    return {"config": config, "sections": sections, "filepath": filepath}


def update_feature_file(filepath, config_updates=None, section_updates=None):
    """
    Update a feature file's frontmatter and/or section content.

    config_updates:  dict of frontmatter key/value pairs to set
    section_updates: dict of section name -> new content string
    """
    with open(filepath, "r") as f:
        content = f.read()

    match  = re.match(r"^---\n(.*?)\n---\n(.*)", content, re.DOTALL)
    config = yaml.safe_load(match.group(1))
    body   = match.group(2)

    if config_updates:
        config.update(config_updates)

    if section_updates:
        for name, new_content in section_updates.items():
            pattern     = rf"(## {re.escape(name)}\n)(.*?)(?=\n## |\Z)"
            replacement = f"## {name}\n{new_content}\n"
            if re.search(pattern, body, re.DOTALL):
                body = re.sub(pattern, replacement, body, flags=re.DOTALL)
            else:
                body += f"\n## {name}\n{new_content}\n"

    with open(filepath, "w") as f:
        f.write(f"---\n{yaml.dump(config, default_flow_style=False)}---\n{body}")


def load_all_feature_logs():
    """
    Load all previous feature files and return a formatted summary.
    Used by Felix Feature to understand what has already been built.
    """
    features_dir = "features"
    if not os.path.exists(features_dir):
        return "No previous features have been implemented yet."

    files = sorted([f for f in os.listdir(features_dir) if f.endswith(".md")])
    if not files:
        return "No previous features have been implemented yet."

    summaries = []
    for filename in files:
        try:
            feature = load_feature_file(os.path.join(features_dir, filename))
            c       = feature["config"]
            s       = feature["sections"]
            summary = (
                f"### {c.get('feature', filename)}\n"
                f"- Date: {c.get('date', 'unknown')}\n"
                f"- Tier: {c.get('tier', 'unknown')}\n"
                f"- Status: {c.get('status', 'unknown')}\n"
            )
            if "Feature Request" in s:
                preview = s["Feature Request"][:200]
                summary += f"- Request: {preview}...\n"
            summaries.append(summary)
        except Exception:
            continue

    return "\n".join(summaries) if summaries else "No completed features found."


# ─── Git & GitHub ─────────────────────────────────────────────

def create_feature_branch(feature_name):
    """Create and checkout a new feature branch off the current branch."""
    branch_name = f"feature/{feature_name.lower().replace(' ', '-')}"
    result = os.system(f"git checkout -b {branch_name}")
    if result != 0:
        raise RuntimeError(
            f"\nFailed to create branch '{branch_name}'.\n"
            f"It may already exist. Check with: git branch\n"
        )
    print(f"  Created branch: {branch_name}")
    return branch_name


def commit_feature_changes(feature_name):
    """Stage and commit all changes on the current feature branch."""
    slug = feature_name.lower().replace(" ", "-")
    os.system("git add .")
    os.system(f'git commit -m "feat: {slug}"')
    print(f"  Changes committed: feat: {slug}")


def push_feature_branch(branch_name):
    """Push the feature branch to the remote origin."""
    result = os.system(f"git push -u origin {branch_name}")
    if result != 0:
        raise RuntimeError(
            f"\nFailed to push branch '{branch_name}' to remote.\n"
            f"Check your remote is set up with: git remote -v\n"
        )
    print(f"  Branch pushed: {branch_name}")


def create_pull_request(feature_name, feature_filepath,
                         base_branch="main"):
    """
    Create a GitHub PR using the gh CLI.
    PR body is built from the feature file so it's always up to date.
    """
    feature  = load_feature_file(feature_filepath)
    sections = feature["sections"]
    config   = feature["config"]

    pr_body = f"""## Feature: {feature_name}

**Date:** {config.get('date', 'N/A')}
**Tier:** {config.get('tier', 'N/A')}

---

### Feature Request
{sections.get('Feature Request', 'N/A')}

---

### Felix Feature — Analyst Assessment
{sections.get('Analyst Assessment', 'N/A')}

---

### Deliverables
Review these output files before merging:
- `outputs/feature_output.md` — code produced by Danny Dev
- `outputs/feature_qa.md` — test results from Quinn Quality
- `outputs/security_report.md` — security findings from Scott Security

---
*Generated by Harness Engineering Pipeline*
"""

    # Write body to temp file to avoid shell escaping issues
    body_file = "/tmp/pr_body.md"
    with open(body_file, "w") as f:
        f.write(pr_body)

    result = os.system(
        f'gh pr create '
        f'--title "feat: {feature_name}" '
        f'--body-file {body_file} '
        f'--base {base_branch}'
    )
    if result != 0:
        print(
            f"\n  Could not create PR automatically.\n"
            f"  Create it manually at: github.com\n"
        )