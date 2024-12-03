// wordDetails.js
function parseWordDetails(data) {
    // 检查数据是否有效
    if (!data || !data.Word) {
        return '<p>No word details available.</p>'; // 处理未定义的情况
    }

    // 创建 HTML 结构
    let html = `
        <div class="word-details">
            <h3>${data.Word}</h3> <!-- 显示单词 -->
            <p>Part of Speech: ${data.Part_of_speech}</p> <!-- 显示词性 -->
    `;

    // 仅在词性为名词时显示性别和复数形式
    if (data.Part_of_speech.toLowerCase() === 'noun') {
        html += `
            <p>Gender: ${data.Gender}</p> <!-- 显示性别 -->
            <p>Plural: ${data.Plural}</p> <!-- 显示复数形式 -->
        `;
    }

    // 添加含义部分
    html += `
            <h4>Meanings:</h4>
            <ol>
                ${data.Meanings.map(meaning => 
                    `<li>${meaning.Meaning} — ${meaning.Description}</li>`
                ).join('')}
                <!-- 遍历并显示每个含义及其描述 -->
            </ol>
    `;

    // 添加例句部分
    html += `
            <h4>Examples:</h4>
            <ol>
                ${data.Examples.map(example => 
                    `<li>${example.Sentence} — "${example.Translation}"</li>`
                ).join('')}
                <!-- 遍历并显示每个例句及其翻译 -->
            </ol>
        </div>
    `;

    return html; // 返回生成的 HTML 字符串
}

// Example
const wordData = {
    "Word": "Schloss",
    "Part_of_speech": "Noun",
    "Gender": "Das Schloss",
    "Plural": "Schlösser",
    "Meanings": [
        {
            "Meaning": "Castle",
            "Description": "A large and stately residence, often associated with royalty or nobility."
        },
        {
            "Meaning": "Lock",
            "Description": "A device used to secure doors, gates, or containers."
        }
    ],
    "Examples": [
        {
            "Sentence": "Das Schloss auf dem Hügel ist sehr alt.",
            "Translation": "The castle on the hill is very old."
        },
        {
            "Sentence": "Ich habe den Schlüssel für das Schloss verloren.",
            "Translation": "I lost the key to the lock."
        }
    ]
};
