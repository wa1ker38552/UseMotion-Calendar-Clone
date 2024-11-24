from flask import render_template
from flask import request
from flask import Flask
import datetime
import openai

app = Flask(__name__)
openai.api_key = ""

def get_response(prompt):
    response = openai.chat.completions.create(
        model="o1-mini",
        messages=[{"role": "user", "content": f'{prompt}\nBased on this information, output like this: <a time in ISO string format>\n<name for task. DO NOT ADD FORMATTING>. The current date is {datetime.datetime.now()}. If you cannot give a valid response, return NONE'}]
    )
    try:
        raw = response.choices[0].message.content.split('\n')
        return {
            'success': True,
            'time': raw[0],
            'name': raw[1]
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

@app.route('/')
def app_index():
    return render_template('index.html')

@app.route('/api/generate', methods=['POST'])
def api_generate():
    data = request.json
    if 'prompt' in data:
        return get_response(data['prompt'])
    return {'success': False, 'error': 'Invalid argument'}

app.run(debug=True)