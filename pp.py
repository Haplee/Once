import streamlit as st
import datetime
import threading
import pyttsx3
import re
from pathlib import Path
from typing import Optional, Tuple
import mysql.connector
from mysql.connector import Error
import hashlib

# --------------------------
# Configuración de la base de datos
# --------------------------
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',         # Cambia por tu usuario de MySQL
    'password': 'root', # Cambia por tu contraseña de MySQL
    'database': 'once'              # Asegúrate de que esta base de datos exista o cámbiala
}

def get_db_connection():
    try:
        cnx = mysql.connector.connect(**DB_CONFIG)
        return cnx
    except Error as err:
        st.error(f"Error al conectar a la base de datos: {err}")
        return None

def create_tables():
    cnx = get_db_connection()
    if cnx is None:
        return
    cursor = cnx.cursor()
    # Tabla de usuarios
    cursor.execute("""
       CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
       )
    """)
    # Tabla de transacciones (se usa 'cambio' en lugar de 'change')
    cursor.execute("""
       CREATE TABLE IF NOT EXISTS transactions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          customer_amount DECIMAL(10,2),
          money_received DECIMAL(10,2),
          cambio DECIMAL(10,2)
       )
    """)
    # Tabla de reportes diarios
    cursor.execute("""
       CREATE TABLE IF NOT EXISTS daily_reports (
          id INT AUTO_INCREMENT PRIMARY KEY,
          report_date DATE,
          report_text TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
       )
    """)
    cnx.commit()
    cursor.close()
    cnx.close()

# --------------------------
# Funciones de seguridad y login
# --------------------------
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_login(username: str, password: str) -> bool:
    cnx = get_db_connection()
    if cnx is None:
        return False
    cursor = cnx.cursor(dictionary=True)
    hashed = hash_password(password)
    query = "SELECT * FROM users WHERE username = %s AND password = %s"
    cursor.execute(query, (username, hashed))
    user = cursor.fetchone()
    cursor.close()
    cnx.close()
    return user is not None

# Función para agregar un usuario (útil para la primera configuración)
def add_user(username: str, password: str) -> None:
    cnx = get_db_connection()
    if cnx is None:
        return
    cursor = cnx.cursor()
    hashed = hash_password(password)
    query = "INSERT INTO users (username, password) VALUES (%s, %s)"
    try:
        cursor.execute(query, (username, hashed))
        cnx.commit()
    except Error as err:
        st.error(f"Error al agregar el usuario: {err}")
    finally:
        cursor.close()
        cnx.close()

# --------------------------
# Funciones TTS (Text-to-Speech) sin leer emojis
# --------------------------
def remove_emojis(text: str) -> str:
    """
    Elimina emojis del texto utilizando una expresión regular con rangos Unicode.
    """
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # Emoticons
        "\U0001F300-\U0001F5FF"  # Símbolos y pictogramas
        "\U0001F680-\U0001F6FF"  # Transporte y símbolos
        "\U0001F1E0-\U0001F1FF"  # Banderas
        "\U00002700-\U000027BF"  # Dingbats
        "\U0001F900-\U0001F9FF"  # Símbolos suplementarios
        "\U0001FA70-\U0001FAFF"  # Símbolos extendidos
        "\U00002600-\U000026FF"  # Símbolos misceláneos
        "]+",
        flags=re.UNICODE
    )
    return emoji_pattern.sub(r'', text)

def speak(text: str) -> None:
    text_to_speak = remove_emojis(text)
    def run_tts() -> None:
        engine = pyttsx3.init()
        engine.say(text_to_speak)
        engine.runAndWait()
    threading.Thread(target=run_tts, daemon=True).start()

# --------------------------
# Funciones para transacciones e informes en la DB
# --------------------------
def registrar_operacion_db(cliente: float, dinero_recibido: float, cambio: float) -> None:
    cnx = get_db_connection()
    if cnx is None:
        return
    cursor = cnx.cursor()
    query = "INSERT INTO transactions (customer_amount, money_received, cambio) VALUES (%s, %s, %s)"
    cursor.execute(query, (cliente, dinero_recibido, cambio))
    cnx.commit()
    cursor.close()
    cnx.close()

def generar_informe_db() -> str:
    cnx = get_db_connection()
    if cnx is None:
        return "Error al conectar a la base de datos."
    cursor = cnx.cursor(dictionary=True)
    today = datetime.date.today()
    query = "SELECT * FROM transactions WHERE DATE(timestamp) = %s"
    cursor.execute(query, (today,))
    rows = cursor.fetchall()
    report_lines = [f"Informe de operaciones - {today}"]
    for row in rows:
        line = (f"{row['timestamp']} - Cliente pagó {row['customer_amount']:.2f}, "
                f"Recibido: {row['money_received']:.2f}, Cambio: {row['cambio']:.2f}")
        report_lines.append(line)
    report_text = "\n".join(report_lines)
    insert_query = "INSERT INTO daily_reports (report_date, report_text) VALUES (%s, %s)"
    cursor.execute(insert_query, (today, report_text))
    cnx.commit()
    cursor.close()
    cnx.close()
    speak("Informe generado con éxito.")
    return f"✅ Informe generado para {today}"

def obtener_ultimo_informe() -> str:
    cnx = get_db_connection()
    if cnx is None:
        return "Error al conectar a la base de datos."
    cursor = cnx.cursor(dictionary=True)
    query = "SELECT * FROM daily_reports ORDER BY created_at DESC LIMIT 1"
    cursor.execute(query)
    report = cursor.fetchone()
    cursor.close()
    cnx.close()
    if report:
        return report['report_text']
    else:
        return "No hay informes disponibles."

# --------------------------
# Funciones de cálculo
# --------------------------
def get_user_input(value: str) -> Optional[float]:
    try:
        return float(value.replace(',', '.'))
    except (ValueError, AttributeError):
        return None

def validate_positive_number(value: Optional[float]) -> bool:
    return value is not None and value > 0

def calcular_cambio(cliente: float, dinero_recibido: float) -> Tuple[str, Optional[float]]:
    if not (validate_positive_number(cliente) and validate_positive_number(dinero_recibido)):
        return "❌ Error: Los valores deben ser positivos", None
    if cliente > dinero_recibido:
        return "❌ Error: El dinero recibido no puede ser menor que la cuenta del cliente", None
    cambio = dinero_recibido - cliente
    return f"✅ El cambio es: {cambio:.2f} euros", cambio

# --------------------------
# Configuración de la página Streamlit
# --------------------------
st.set_page_config(page_title="Gestión de Monedas con Voz", layout="wide", initial_sidebar_state="collapsed")
st.markdown(
    """
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    </style>
    """,
    unsafe_allow_html=True,
)

# Crear las tablas en la base de datos (si no existen)
create_tables()

# --------------------------
# Página de Login
# --------------------------
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False

if not st.session_state.logged_in:
    st.title("Login")
    username_input = st.text_input("Username")
    password_input = st.text_input("Password", type="password")
    if st.button("Login"):
        if verify_login(username_input, password_input):
            st.success("Login successful!")
            st.session_state.logged_in = True
            st.session_state.username = username_input
        else:
            st.error("Credenciales inválidas")
    st.stop()

# --------------------------
# Aplicación principal
# --------------------------
st.title("Gestión de Monedas con Voz")
col1, col2 = st.columns(2)
cliente_input = col1.text_input("Cuenta del Cliente:")
dinero_input = col2.text_input("Dinero Recibido:")

cliente_value = get_user_input(cliente_input.strip()) if cliente_input.strip() else None
dinero_value = get_user_input(dinero_input.strip()) if dinero_input.strip() else None

if cliente_value is not None and dinero_value is not None:
    resultado, cambio = calcular_cambio(cliente_value, dinero_value)
    if "✅" in resultado and cambio is not None:
        st.success(resultado)
        registrar_operacion_db(cliente_value, dinero_value, cambio)
        speak(resultado)
    else:
        st.error(resultado)
        speak("Error en los valores ingresados.")

col3, col4 = st.columns(2)
if col3.button("Generar Informe"):
    informe_result = generar_informe_db()
    st.info(informe_result)

if col4.button("Leer Último Informe en Voz Alta"):
    ultimo_informe = obtener_ultimo_informe()
    speak(ultimo_informe)
    st.text_area("Último Informe", ultimo_informe, height=200)

if st.button("Borrar Transacciones e Informes"):
    cnx = get_db_connection()
    if cnx:
        cursor = cnx.cursor()
        cursor.execute("DELETE FROM transactions")
        cursor.execute("DELETE FROM daily_reports")
        cnx.commit()
        cursor.close()
        cnx.close()
        st.success("✅ Todos los registros y reportes han sido eliminados.")
        speak("Todos los registros han sido eliminados.")
