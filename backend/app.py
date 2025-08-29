from flask import Flask, request, jsonify, session, send_from_directory, redirect, url_for
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import logging
import os
from functools import wraps

# --- Path Setup ---
# Get the absolute path of the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# ../frontend
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')
# ../frontend/static
STATIC_DIR = os.path.join(FRONTEND_DIR, 'static')


# --- App Initialization ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# Serve static files from the absolute path to 'frontend/static'
app = Flask(__name__, static_folder=STATIC_DIR, static_url_path='/static')

app.secret_key = os.urandom(24)

# --- Extensions ---
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

# --- User Data Store (In-memory) ---
users = {
    'user': { "name": "user", "password_hash": bcrypt.generate_password_hash('password').decode('utf-8') },
    'admin': { "name": "admin", "password_hash": bcrypt.generate_password_hash('admin').decode('utf-8') },
    'fvb': { "name": "Francisco Vidal", "password_hash": bcrypt.generate_password_hash('fvb').decode('utf-8') },
    'smr': { "name": "Sara Mateo", "password_hash": bcrypt.generate_password_hash('smr').decode('utf-8') }
}

# --- Decorators ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated_function

# --- Frontend Routes ---
@app.route('/')
@login_required
def index_page():

    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/login')
def login_page():
    if 'user_id' in session:
        return redirect(url_for('index_page'))
    return send_from_directory(FRONTEND_DIR, 'login.html')


@app.route('/settings')
@login_required
def settings_page():
    return send_from_directory(FRONTEND_DIR, 'settings.html')


@app.route('/interactions')
@login_required
def interactions_page():

    return send_from_directory(FRONTEND_DIR, 'interactions.html')


# --- API Routes ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = users.get(username)
    if user and bcrypt.check_password_hash(user['password_hash'], password):
        session['user_id'] = username
        return jsonify({"status": "success", "user": {"name": user['name'], "username": username}})

    return jsonify({"status": "error", "message": "Invalid credentials."}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"status": "success"})

@app.route('/api/check_auth', methods=['GET'])
def check_auth():
    user_id = session.get('user_id')
    if user_id and user_id in users:
        user = users[user_id]
        return jsonify({"isAuthenticated": True, "user": {"name": user['name'], "username": user_id}})
    return jsonify({"isAuthenticated": False})

@app.route('/api/dispense', methods=['POST'])
@login_required
def dispense_coins():
    data = request.get_json()
    amount = data.get('amount')
    try:
        amount_float = float(amount)
        if amount_float <= 0:
            return jsonify({"status": "error", "message": "Amount must be positive."}), 400

        logging.info(f"Dispensing {amount_float:.2f} euros for user {session.get('user_id')}.")
        return jsonify({"status": "success", "message": f"Orden para dispensar {amount_float:.2f} euros procesada."})

    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Invalid amount."}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
