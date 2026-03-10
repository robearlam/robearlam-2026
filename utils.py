# utils.py
# Shared helpers used across all agent runner scripts

def load_output(filename):
    """
    Read a previous agent's output from the outputs folder.
    Each runner uses this to pass upstream work as context
    without re-running agents that have already completed.
    """
    filepath = f"outputs/{filename}"
    try:
        with open(filepath, "r") as f:
            return f.read()
    except FileNotFoundError:
        raise FileNotFoundError(
            f"\nCould not find {filepath}. "
            f"Make sure the previous agent has run successfully before this one.\n"
        )