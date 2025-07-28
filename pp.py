from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import logging
import speech_recognition as sr
import io
from pydub import AudioSegment
import datetime

# Inicializar la aplicación Flask
app = Flask(__name__, static_folder="static")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///interactions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo de la base de datos
class Interaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    cuenta = db.Column(db.Float, nullable=False)
    recibido = db.Column(db.Float, nullable=False)
    cambio = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<Interaction {self.id}>'

# Configurar logging básico para depuración
logging.basicConfig(level=logging.DEBUG)

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

    interaction = Interaction(cuenta=cuenta, recibido=recibido, cambio=cambio)
    db.session.add(interaction)
    db.session.commit()

    return jsonify({"mensaje": mensaje, "cambio": cambio})

@app.route("/interactions", methods=["GET"])
def get_interactions():
    interactions = Interaction.query.all()
    return jsonify([
        {
            "id": i.id,
            "timestamp": i.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "cuenta": i.cuenta,
            "recibido": i.recibido,
            "cambio": i.cambio
        } for i in interactions
    ])

@app.route("/reconocer-voz", methods=["POST"])
def reconocer_voz():
    if "audio" not in request.files:
        return jsonify({"error": "No se recibió archivo de audio."}), 400

    audio_file = request.files["audio"]
    if audio_file.filename == "":
        return jsonify({"error": "Archivo de audio vacío."}), 400

    try:
        # Convert webm to wav
        audio = AudioSegment.from_file(io.BytesIO(audio_file.read()), format="webm")
        wav_data = io.BytesIO()
        audio.export(wav_data, format="wav")
        wav_data.seek(0)

        r = sr.Recognizer()
        with sr.AudioFile(wav_data) as source:
            audio_data = r.record(source)

        texto = r.recognize_google(audio_data, language="es-ES")
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
    except Exception as e:
        logging.error(f"Error processing audio: {e}")
        return jsonify({"error": "Error al procesar el archivo de audio."}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
