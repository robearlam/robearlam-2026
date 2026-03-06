# test_connections.py
# Verifies that both API keys are valid and reachable

import os
from dotenv import load_dotenv
import anthropic
import openai

# Load the values from your .env file into the environment
load_dotenv()

def test_anthropic():
    print("Testing Anthropic (Claude)...")
    try:
        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        message = client.messages.create(
            model=os.getenv("ANTHROPIC_MODEL_NAME"),
            max_tokens=50,
            messages=[{"role": "user", "content": "Reply with just the word: connected"}]
        )
        print(f"  ✅ Anthropic connected — response: {message.content[0].text}\n")
    except Exception as e:
        print(f"  ❌ Anthropic failed — {e}\n")

def test_openai():
    print("Testing OpenAI (GPT-4o)...")
    try:
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL_NAME"),
            messages=[{"role": "user", "content": "Reply with just the word: connected"}],
            max_tokens=50
        )
        print(f"  ✅ OpenAI connected — response: {response.choices[0].message.content}\n")
    except Exception as e:
        print(f"  ❌ OpenAI failed — {e}\n")

if __name__ == "__main__":
    print("\n--- API Connection Tests ---\n")
    test_anthropic()
    test_openai()
    print("--- Done ---\n")