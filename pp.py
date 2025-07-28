from fastapi import FastAPI, Request, Form, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import logging
import speech_recognition as sr
import io
import mysql.connector
from dotenv import load_dotenv
import os
import socketio

# Cargar variables de entorno
load_dotenv()

# Inicializar la aplicación FastAPI
app = FastAPI()

# Montar archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configurar plantillas de Jinja2
templates = Jinja2Templates(directory="templates")

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

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/calcular")
async def calcular(cuenta: float = Form(...), recibido: float = Form(...)):
    mensaje, cambio = calcular_cambio(cuenta, recibido)

    if cambio is None:
        return {"error": mensaje}

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
        return {"error": "Error interno al guardar el cálculo."}

    return {"mensaje": mensaje, "cambio": cambio}

# Configurar Socket.IO
sio = socketio.AsyncServer(async_mode="asgi")
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

@sio.on("connect")
async def connect(sid, environ):
    logging.info(f"Cliente conectado: {sid}")

@sio.on("disconnect")
async def disconnect(sid):
    logging.info(f"Cliente desconectado: {sid}")

@sio.on("audio_chunk")
async def handle_audio_chunk(sid, chunk):
    r = sr.Recognizer()
    try:
        audio_data = sr.AudioData(chunk, 44100, 2)
        texto = r.recognize_google(audio_data, language="es-ES")
        logging.debug(f"Texto reconocido: {texto}")

        detectadas = [frase for frase in PALABRAS_CLAVE if frase.lower() in texto.lower()]

        if detectadas:
            await sio.emit("voice_result", {"mensaje": "Palabras clave detectadas", "frases": detectadas, "texto": texto}, to=sid)
        else:
            await sio.emit("voice_result", {"mensaje": "No se detectaron palabras clave.", "texto": texto}, to=sid)

    except sr.UnknownValueError:
        await sio.emit("voice_result", {"error": "No se pudo entender el audio."}, to=sid)
    except sr.RequestError as e:
        await sio.emit("voice_result", {"error": f"Error en el servicio de reconocimiento: {e}"}, to=sid)

# Para ejecutar la aplicación: uvicorn pp:socket_app --reload
# El __main__ ya no es necesario con uvicorn
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(socket_app, host="0.0.0.0", port=5000, reload=True)
