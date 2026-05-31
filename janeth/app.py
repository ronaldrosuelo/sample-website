from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)  # Enables cross-origin requests

# ⚠️ UPDATE THIS WITH YOUR POSTGRESQL CREDENTIALS
DB_CONFIG = {
    "dbname": "your_db_name",
    "user": "postgres",
    "password": "your_password",
    "host": "localhost",
    "port": "5432"
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

# Route to serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')

# API Endpoint: Fetch the latest uploaded image
@app.route('/api/photo', methods=['GET'])
def get_photo():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT image_data FROM romantic_gallery ORDER BY id DESC LIMIT 1;")
        row = cur.fetchone()
        cur.close()
        conn.close()
        
        if row:
            return jsonify({"url": row})
        return jsonify({"url": None})
    except Exception as e:
        print(e)
        return jsonify({"error": "Database error"}), 500

# API Endpoint: Save a newly uploaded image
@app.route('/api/photo', methods=['POST'])
def save_photo():
    try:
        data = request.get_json()
        image_base64 = data.get('image')
        
        if not image_base64:
            return jsonify({"error": "No image data provided"}), 400
            
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO romantic_gallery (image_data) VALUES (%s);", (image_base64,))
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"message": "Memory saved successfully to PostgreSQL! ❤️"})
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to save to database"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)