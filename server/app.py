# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from model import generate_caption
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'temp'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/caption', methods=['POST'])
def caption():
    print("✅ Reached the /caption endpoint")
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image_file = request.files['image']
    image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
    image_file.save(image_path)

    try:
        caption = generate_caption(image_path)
        return jsonify({'caption': caption})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
