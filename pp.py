from flask import Flask, render_template, request, jsonify
import logging
import speech_recognition as sr
import io

# Inicializar la aplicación Flask
app = Flask(__name__, static_folder="static")

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

    # Usar SpeechRecognition para procesar el audio recibido
    r = sr.Recognizer()
    try:
        audio_bytes = audio_file.read()
        audio_data = sr.AudioFile(io.BytesIO(audio_bytes))
        with audio_data as source:
            audio = r.record(source)

        texto = r.recognize_google(audio, language="es-ES")
        logging.debug(f"Texto reconocido: {texto}")

        # Buscar palabras clave en el texto
        detectadas = [frase for frase in PALABRAS_CLAVE if frase.lower() in texto.lower()]

        if detectadas:
            return jsonify({"mensaje": "Palabras clave detectadas", "frases": detectadas, "texto": texto})
        else:
            return jsonify({"mensaje": "No se detectaron palabras clave.", "texto": texto})

    except sr.UnknownValueError:
        return jsonify({"error": "No se pudo entender el audio."}), 400
    except sr.RequestError as e:
        return jsonify({"error": f"Error en el servicio de reconocimiento: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
