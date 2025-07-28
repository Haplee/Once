from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import logging
import speech_recognition as sr
import io
import mysql.connector
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Inicializar la aplicación Flask y SocketIO
app = Flask(__name__, static_folder="static")
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)

# Configurar logging básico para depuración
logging.basicConfig(level=logging.DEBUG)

# Configuración de la base de datos
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_DATABASE"),
}

def init_db():
    try:
        # Conexión sin especificar la base de datos para poder crearla
        conn = mysql.connector.connect(
            host=db_config["host"],
            user=db_config["user"],
            password=db_config["password"]
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_config['database']}")
        conn.database = db_config['database']

        # Crear tabla de cálculos si no existe
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS calculos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cuenta DECIMAL(10, 2),
                recibido DECIMAL(10, 2),
                cambio DECIMAL(10, 2),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        cursor.close()
        conn.close()
        logging.info("Base de datos y tabla inicializadas correctamente.")
    except mysql.connector.Error as err:
        logging.error(f"Error al inicializar la base de datos: {err}")

# Frases clave para detectar en el reconocimiento
PALABRAS_CLAVE = [
    "cuenta del cliente",
    "el cliente ha entregado",
    "dinero recibido",
    "cambio",
    "total a pagar"
]

def calcular_cambio(cuenta, recibido):
    if cuenta <= 0 or recibido <= 0:
        return "Los valores deben ser positivos.", None
    if recibido < cuenta:
        return "El dinero recibido es insuficiente.", None
    cambio = recibido - cuenta
    mensaje = f"El cambio es: {cambio:.2f} euros."
    return mensaje, cambio

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/calcular", methods=["POST"])
def calcular():
    cuenta_str = request.form.get("cuenta")
    recibido_str = request.form.get("recibido")

    if not cuenta_str or not recibido_str or cuenta_str.strip() == "" or recibido_str.strip() == "":
        return jsonify({"error": "Ambos campos, cuenta y recibido, son obligatorios y deben ser números."}), 400

    try:
        cuenta = float(cuenta_str)
        recibido = float(recibido_str)
    except ValueError:
        return jsonify({"error": "Ingresa valores numéricos válidos para cuenta y recibido."}), 400

    mensaje, cambio = calcular_cambio(cuenta, recibido)

    if cambio is None:
        return jsonify({"error": mensaje}), 400

    # Guardar el cálculo en la base de datos
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO calculos (cuenta, recibido, cambio) VALUES (%s, %s, %s)",
            (cuenta, recibido, cambio)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        logging.error(f"Error al guardar en la base de datos: {err}")
        return jsonify({"error": "Error interno al guardar el cálculo."}), 500

    return jsonify({"mensaje": mensaje, "cambio": cambio})

@app.route("/reconocer-voz", methods=["POST"])
def reconocer_voz():
    """
    Ruta para recibir un archivo de audio y detectar palabras clave.
    Se espera un archivo en 'audio' en formato WAV u otro compatible.
    """
    if "audio" not in request.files:
        return jsonify({"error": "No se recibió archivo de audio."}), 400

    audio_file = request.files["audio"]

    if audio_file.filename == "":
        return jsonify({"error": "Archivo de audio vacío."}), 400

    r = sr.Recognizer()
    try:
        audio_bytes = audio_file.read()
        audio_data = sr.AudioFile(io.BytesIO(audio_bytes))
        with audio_data as source:
            audio = r.record(source)

        texto = r.recognize_google(audio, language="es-ES")
        logging.debug(f"Texto reconocido: {texto}")

        detectadas = [frase for frase in PALABRAS_CLAVE if frase.lower() in texto.lower()]

        if detectadas:
            return jsonify({"mensaje": "Palabras clave detectadas", "frases": detectadas, "texto": texto})
        else:
            return jsonify({"mensaje": "No se detectaron palabras clave.", "texto": texto})

    except sr.UnknownValueError:
        return jsonify({"error": "No se pudo entender el audio."}), 400
    except sr.RequestError as e:
        return jsonify({"error": f"Error en el servicio de reconocimiento: {e}"}), 500

@socketio.on("audio_chunk")
def handle_audio_chunk(chunk):
    r = sr.Recognizer()
    try:
        audio_data = sr.AudioData(chunk, 44100, 2)
        texto = r.recognize_google(audio_data, language="es-ES")
        logging.debug(f"Texto reconocido: {texto}")

        detectadas = [frase for frase in PALABRAS_CLAVE if frase.lower() in texto.lower()]

        if detectadas:
            emit("voice_result", {"mensaje": "Palabras clave detectadas", "frases": detectadas, "texto": texto})
        else:
            emit("voice_result", {"mensaje": "No se detectaron palabras clave.", "texto": texto})

    except sr.UnknownValueError:
        emit("voice_result", {"error": "No se pudo entender el audio."})
    except sr.RequestError as e:
        emit("voice_result", {"error": f"Error en el servicio de reconocimiento: {e}"})

if __name__ == "__main__":
    init_db()
    socketio.run(app, debug=True, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)
