from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # 导入 CORS
import openai
from openai import OpenAI
import config  # 导入您的配置文件
import json  # 导入 json 模块

app = Flask(__name__)
CORS(app)  # 启用 CORS

# 设置 OpenAI API 密钥
client = OpenAI(api_key=config.OPENAI_API_KEY)

@app.route('/')
def wortschatz():
    return render_template('index.html')

@app.route('/api/getWordDetails', methods=['POST'])
def get_word_details():
    data = request.json
    word = data.get('word')

    if not word:
        return jsonify({"error": "No word provided"}), 400  # 返回错误信息

    try:
        chat_completion = client.chat.completions.create(
                                                            messages=[
                                                                {
                                                                    "role": "user",
                                                                    "content": f"""You are an expert in teaching German vocabulary. You will be given the Input'{word}'. Provide a JSON-like explanation of the Input using these rules:
                                                        1. Input Handling:
                                                        - If the Input '{word}' is a non-German word, identify the original language of '{word}' because the meaning and translation parts of your Output must use the original language.
                                                        - For misspelled German words, correct the spelling.

                                                        2. Output Format:
                                                        {{
                                                            "Word": "<German word>",
                                                            "Part_of_speech": "<noun/verb/etc.>",
                                                            "Gender": "<Der/Die/Das> (for nouns only)",
                                                            "Plural": "<plural form> (for nouns only)",
                                                            "Meanings": [
                                                                {{
                                                                    "Meaning": "<not in German , but in the original language >",
                                                                    "Example": "<example in German>",
                                                                    "Translation": "<translate the example in the same language of the Input'{word}' >"
                                                                }},
                                                                {{
                                                                    "Meaning": "<not in German , but in the original language >",
                                                                    "Example": "<example in German>",
                                                                    "Translation": "<translate the example in the same language of the Input'{word}' >"
                                                                }}
                                                            ]
                                                        }}

                                                        3. Notes:
                                                        - Include distinct, concise meanings in the original language.
                                                        - Use accurate spelling and grammar.
                                                        - Do not include anything except the Output.
                                                        - Pay attention here!!In the output, make sure the "Meaning" and "Translation" parts are using the original language of the Input'{word}'.
                                                        """
                                                                }
                                                            ],
                                                            model="gpt-4o-mini"
                                                        )
        # 解析 OpenAI 的响应
        response = chat_completion.choices[0].message.content
        response_json = json.loads(response)  # 将字符串解析为 JSON 对象
        return jsonify(response_json)  # 返回 JSON 对象

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # 返回错误信息

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
