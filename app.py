from flask import Flask, request, jsonify
import openai
import config  # 导入您的配置文件

app = Flask(__name__)

# 设置 OpenAI API 密钥
openai.api_key = config.OPENAI_API_KEY

@app.route('/api/getWordDetails', methods=['POST'])
def get_word_details():
    data = request.json
    word = data.get('word')

    # 调用 OpenAI API
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"Provide a structured JSON response for the German word '{word}' including its meanings and example sentences."}
        ]
    )

    # 解析 OpenAI 的响应
    structured_data = response['choices'][0]['message']['content']
    
    return jsonify(structured_data)

if __name__ == '__main__':
    app.run(debug=True, port= 5001)
