from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os

app = Flask(__name__)

# Store messages in memory (in production, use a database)
messages = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    message = {
        'text': data.get('message'),
        'sender': data.get('sender', 'User'),
        'timestamp': datetime.now().strftime('%I:%M %p'),
    }
    messages.append(message)
    return jsonify(message)

@app.route('/get_messages')
def get_messages():
    return jsonify(messages)

if __name__ == '__main__':
    app.run(debug=True, port=8000)
