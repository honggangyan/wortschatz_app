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
                    "content": f"""Provide a JSON like response for the German word '{word}' if it is a noun, 
                    including its plural, gender, meanings with descriptions, and example sentences. 
                    If the word is not a noun, exclude plural and gender, but still include meanings and examples. 
                    The meanings should be distinct with each other, avoid similar meanings, and example sentences should match the provided meanings respectively. 
                    Here is an example you should output,you dont have to tell me it is a json: 
                    {{
                        "Word": "Schloss",
                        "Part_of_speech": "Noun",
                        "Gender": "Das Schloss",
                        "Plural": "Schlösser",
                        "Meanings": [
                            {{
                                "Meaning": "Castle",
                                "Description": "A large and stately residence, often associated with royalty or nobility."
                            }},
                            {{
                                "Meaning": "Lock",
                                "Description": "A device used to secure doors, gates, or containers."
                            }}
                        ],
                        "Examples": [
                            {{
                                "Sentence": "Das Schloss auf dem Hügel ist sehr alt.",
                                "Translation": "The castle on the hill is very old."
                            }},
                            {{
                                "Sentence": "Ich habe den Schlüssel für das Schloss verloren.",
                                "Translation": "I lost the key to the lock."
                            }}
                        ]
                    }}"""
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
