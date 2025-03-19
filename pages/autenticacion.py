import streamlit as st
import os
from pathlib import Path

# Configuración de la página
st.set_page_config(page_title="Autenticación", layout="wide", initial_sidebar_state="collapsed")

# Ocultar menú y footer de Streamlit
hide_menu_style = """
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    </style>
"""
st.markdown(hide_menu_style, unsafe_allow_html=True)

# Definir usuario y contraseña
USERNAME = "admin"
PASSWORD = "suerte2025"

st.title("🔒 Autenticación")

usuario = st.text_input("Usuario:")
contrasena = st.text_input("Contraseña:", type="password")

if st.button("Iniciar sesión"):
    if usuario == USERNAME and contrasena == PASSWORD:
        base_dir = Path(__file__).parent.parent
        registros_dir = base_dir / "registros"
        informes_dir = base_dir / "informes"

        # Eliminar archivos de registros e informes
        for archivo in registros_dir.glob("*") + informes_dir.glob("*"):
            archivo.unlink()

        st.success("✅ Todos los informes y registros han sido eliminados.")
    else:
        st.error("❌ Usuario o contraseña incorrectos.")
