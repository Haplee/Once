from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import logging
import speech_recognition as sr
import io

# Inicializar la aplicación Flask y SocketIO
app = Flask(__name__, static_folder="static")
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)

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

    return jsonify({"mensaje": mensaje, "cambio": cambio})

@socketio.on("audio_chunk")
def handle_audio_chunk(chunk):
    """
    Recibe un fragmento de audio y lo procesa.
    """
    r = sr.Recognizer()
    try:
        audio_data = sr.AudioData(chunk, 44100, 2)
        texto = r.recognize_google(audio_data, language="es-ES")
        logging.debug(f"Texto reconocido: {texto}")

        # Buscar palabras clave en el texto
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
    socketio.run(app, debug=True, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)
