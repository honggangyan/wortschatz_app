from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Import CORS
import openai
from openai import OpenAI
import config  # Import configuration file
import json  # Import json module

app = Flask(__name__)
CORS(app)  # Enable CORS

# Set OpenAI API key
client = OpenAI(api_key=config.OPENAI_API_KEY)


@app.route("/")
def wortschatz():
    return render_template("index.html")

# API route for exchange information between frontend and backend
# receive the word from the frontend as a JSON object with a "word" field
@app.route("/api/getWordDetails", methods=["POST"])
def get_word_details():
    data = request.json
    word = data.get("word")

    if not word:
        return jsonify({"error": "No word provided"}), 400  # Return error message

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"""You are an expert in teaching German vocabulary. You will be given the Input'{word}'. Provide a JSON-like explanation of the Input using these rules:
                                                        1. Input Handling:
                                                        - If the Input '{word}' is a non-German word, translate it to German and original form.
                                                        - For misspelled input, correct the spelling.

                                                        2. Output Format:
                                                        {{
                                                            "Word": "<The German word>",
                                                            "Part_of_speech": "<noun/verb/etc.>",
                                                            "Gender": "<Der/Die/Das> (for nouns only) + the word",
                                                            "Plural": "<plural form> (for nouns only)",
                                                            "Meanings": [
                                                                {{
                                                                    "Meaning": "<short phrase of one distinct meaning - in English>",
                                                                    "Example": "<example in German>",
                                                                    "Translation": "<translation of the example>"
                                                                }},
                                                                {{
                                                                    "Meaning": "<short phrase of one distinct meaning - in English >",
                                                                    "Example": "<example in German>",
                                                                    "Translation": "<translation of the example>"
                                                                }}                                                        
                                                            ]
                                                        }}

                                                        3. Notes:
                                                        - The meanings should be distinct to each other to avoid repetition.
                                                        - The Examples should be the same level of the given word, or even easier than it.
                                                        - Use accurate spelling and grammar.
                                                        - Do not include anything except the Output.
                                                        """,
                }
            ],
            model="gpt-4o-mini",
        )
        # Parse OpenAI's response
        response = chat_completion.choices[0].message.content
        response_json = json.loads(response)  # Parse string to JSON object
        return jsonify(response_json)  # Return JSON object

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return error message


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5002)
