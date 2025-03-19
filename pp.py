import streamlit as st
import datetime
import logging
from pathlib import Path
import os

# Configuración de la página
st.set_page_config(page_title="Gestión de Monedas", layout="wide", initial_sidebar_state="collapsed")

# Ocultar menú y footer de Streamlit
hide_menu_style = """
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    </style>
"""
st.markdown(hide_menu_style, unsafe_allow_html=True)

# Crear carpetas si no existen
base_dir = Path(__file__).parent
registros_dir = base_dir / "registros"
informes_dir = base_dir / "informes"
registros_dir.mkdir(exist_ok=True)
informes_dir.mkdir(exist_ok=True)

# Configuración inicial
BANCO_INICIAL = 50000
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def get_user_input(value: str):
    try:
        return float(value.replace(',', '.'))
    except ValueError:
        return None

def validate_positive_number(value):
    return value is not None and value > 0

def calcular_cambio(cliente, dinero_recibido):
    if not validate_positive_number(cliente) or not validate_positive_number(dinero_recibido):
        return "❌ Error: Los valores deben ser positivos"
    if cliente > dinero_recibido:
        return "❌ Error: El dinero recibido no puede ser menor que la cuenta del cliente"
    return f"✅ El cambio es: {dinero_recibido - cliente:.2f}" if dinero_recibido > cliente else "✅ No hay cambio"

def registrar_operacion(cliente, dinero_recibido, cambio):
    registro_path = registros_dir / "registro_diario.txt"
    with open(registro_path, 'a', encoding="utf-8") as registro:
        registro.write(f"Cliente pagó {cliente:.2f}, Recibido: {dinero_recibido:.2f}, Cambio: {cambio}\n")

def generar_informe():
    fecha_actual = datetime.datetime.now().strftime('%Y-%m-%d')
    archivo_informe = informes_dir / f"informe_{fecha_actual}.txt"
    
    with open(archivo_informe, 'w', encoding="utf-8") as f:
        f.write(f"Informe de operaciones - {fecha_actual}\n")
        f.write("========================================\n")
        
        registro_path = registros_dir / "registro_diario.txt"
        if registro_path.exists():
            with open(registro_path, 'r', encoding="utf-8") as registro:
                f.write(registro.read())
        else:
            f.write("No hay operaciones registradas para hoy.\n")
    
    return f"✅ Informe generado: {archivo_informe.name}"

def listar_informes():
    informes = list(informes_dir.glob("informe_*.txt"))
    if not informes:
        return "⚠ No se encontraron informes."
    return "\n".join(f"{i+1}. {informe.name}" for i, informe in enumerate(sorted(informes, key=lambda x: x.stat().st_ctime, reverse=True)))

def borrar_registros_e_informes():
    for archivo in registros_dir.glob("*") + informes_dir.glob("*"):
        archivo.unlink()
    return "✅ Todos los informes y registros han sido eliminados."

# Interfaz con Streamlit
st.title("☘️ Gestión de Monedas ☘️")

col1, col2 = st.columns(2)
cliente = col1.text_input("Cuenta del Cliente:")
dinero_recibido = col2.text_input("Dinero Recibido:")

cliente_value = get_user_input(cliente)
dinero_value = get_user_input(dinero_recibido)

if cliente_value is not None and dinero_value is not None:
    resultado = calcular_cambio(cliente_value, dinero_value)
    if "✅" in resultado:
        st.success(resultado)
        registrar_operacion(cliente_value, dinero_value, resultado)
    else:
        st.error(resultado)

col3, col4 = st.columns(2)

if col3.button("📄 Generar Informe"):
    informe_result = generar_informe()
    st.info(informe_result)

if col4.button("📂 Listar Informes"):
    informes = listar_informes()
    st.text_area("Informes Disponibles", informes, height=200)

st.markdown("---")

# Botón para eliminar registros con autenticación
if st.button("🗑️ Borrar Registros e Informes"):
    st.switch_page("pages/autenticacion.py")
