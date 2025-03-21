import streamlit as st
import datetime
import logging
import pyttsx3
import threading
from pathlib import Path

# Configuración de la página
st.set_page_config(page_title="Gestión de Monedas", layout="wide", initial_sidebar_state="collapsed")

# Ocultar menú y footer de Streamlit
st.markdown("""
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    </style>
""", unsafe_allow_html=True)

# Crear carpetas si no existen
base_dir = Path(__file__).parent
registros_dir = base_dir / "registros"
informes_dir = base_dir / "informes"
registros_dir.mkdir(exist_ok=True)
informes_dir.mkdir(exist_ok=True)

# Configuración del módulo de voz
def speak(text):
    def run_tts():
        engine = pyttsx3.init()
        engine.say(text)
        engine.runAndWait()

    threading.Thread(target=run_tts, daemon=True).start()

# Funciones de cálculo y registro
def get_user_input(value: str):
    try:
        return float(value.replace(',', '.'))
    except ValueError:
        return None

def validate_positive_number(value):
    return value is not None and value > 0

def calcular_cambio(cliente, dinero_recibido):
    if not validate_positive_number(cliente) or not validate_positive_number(dinero_recibido):
        return "❌ Error: Los valores deben ser positivos", None
    if cliente > dinero_recibido:
        return "❌ Error: El dinero recibido no puede ser menor que la cuenta del cliente", None
    
    cambio = dinero_recibido - cliente
    return f"✅ El cambio es: {cambio:.2f} euros", cambio

def registrar_operacion(cliente, dinero_recibido, cambio):
    registro_path = registros_dir / "registro_diario.txt"
    hora_actual = datetime.datetime.now().strftime('%H:%M:%S')

    with open(registro_path, 'a', encoding="utf-8") as registro:
        registro.write(f"{hora_actual} - Cliente pagó {cliente:.2f}, Recibido: {dinero_recibido:.2f}, Cambio: {cambio:.2f}\n")

# Interfaz con Streamlit
st.title("☘️ Gestión de Monedas con Voz ☘️")

col1, col2 = st.columns(2)
cliente = col1.text_input("Cuenta del Cliente:")
dinero_recibido = col2.text_input("Dinero Recibido:")

cliente_value = get_user_input(cliente)
dinero_value = get_user_input(dinero_recibido)

if cliente_value is not None and dinero_value is not None:
    resultado, cambio = calcular_cambio(cliente_value, dinero_value)
    if "✅" in resultado:
        st.success(resultado)
        registrar_operacion(cliente_value, dinero_value, cambio)
        speak(resultado)  # Leer el resultado en voz alta
    else:
        st.error(resultado)
        speak("Error en los valores ingresados.")  # Informar error por voz

col3, col4 = st.columns(2)

def generar_informe():
    fecha_actual = datetime.datetime.now().strftime('%Y-%m-%d')
    archivo_informe = informes_dir / f"informe_{fecha_actual}.txt"
    
    with open(archivo_informe, 'w', encoding="utf-8") as f:
        f.write(f"Informe de operaciones - {fecha_actual}\n")
        f.write("\n")
        
        registro_path = registros_dir / "registro_diario.txt"
        if registro_path.exists():
            with open(registro_path, 'r', encoding="utf-8") as registro:
                contenido = registro.read()
                f.write(contenido)
                speak("Informe generado con éxito.")  # Leer en voz alta
        else:
            f.write("No hay operaciones registradas para hoy.\n")
            speak("No hay operaciones registradas para hoy.")  # Leer en voz alta
    
    return f"✅ Informe generado: {archivo_informe.name}"

if col3.button("📄 Generar Informe"):
    informe_result = generar_informe()
    st.info(informe_result)

if col4.button("📂 Leer Último Informe en Voz Alta"):
    informes = sorted(informes_dir.glob("informe_*.txt"), key=lambda x: x.stat().st_ctime, reverse=True)
    if informes:
        with open(informes[0], 'r', encoding="utf-8") as f:
            contenido = f.read()
            speak(contenido)  # Leer el contenido en voz alta
            st.text_area("Último Informe", contenido, height=200)
    else:
        st.warning("⚠ No hay informes disponibles.")
        speak("No hay informes disponibles.")  # Informar en voz alta

# Botón para eliminar registros con voz
if st.button("🗑️ Borrar Registros e Informes"):
    for archivo in list(registros_dir.glob("*")) + list(informes_dir.glob("*")):
        archivo.unlink()
    st.success("✅ Todos los informes y registros han sido eliminados.")
    speak("Todos los registros han sido eliminados.")  # Informar en voz alta
