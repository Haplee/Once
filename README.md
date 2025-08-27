# Aplicación de Intranet Corporativa con Dispensador de Monedas

Esta es una aplicación web completa que simula una intranet corporativa. La funcionalidad principal incluye una calculadora de cambio avanzada con control por voz y un sistema para enviar órdenes a un dispensador de monedas (simulado a través de un servicio de backend).

## Características Principales

*   **Diseño de Intranet:** Interfaz de usuario profesional con un dashboard, widgets y navegación lateral.
*   **Sistema de Autenticación:** Página de inicio de sesión para proteger el acceso al dashboard.
*   **Calculadora de Cambio:** Calcula el cambio a devolver.
*   **Control por Voz:** Utiliza la Web Speech API para rellenar los campos de la calculadora.
*   **Síntesis de Voz:** Anuncia los resultados y errores en voz alta.
*   **Historial de Interacciones:** Guarda cada cálculo en el `localStorage` del navegador.
*   **Tema Claro/Oscuro:** Interfaz personalizable.
*   **Integración con Backend:** Se conecta a un servicio de Python (Flask) para simular el envío de comandos a hardware externo.

## Arquitectura del Proyecto

El proyecto se divide en dos componentes principales:

1.  **Frontend:** Una aplicación de una sola página (SPA) construida con HTML, CSS y JavaScript puro. Se ejecuta completamente en el navegador del usuario.
2.  **Backend (Servicio del Dispensador):** Un servidor ligero escrito en Python usando el framework Flask. Este servicio expone una API para recibir órdenes desde el frontend. **Este componente es el que debe ejecutarse en la Raspberry Pi o el dispositivo que controlará el hardware.**

---

## Guía de Instalación y Uso

Sigue estos pasos para ejecutar la aplicación completa en tu entorno de desarrollo.

### Prerrequisitos

*   Un navegador web moderno (Chrome, Firefox, etc.).
*   Python 3.x instalado en tu sistema.
*   `pip` (el gestor de paquetes de Python).

### 1. Configuración del Backend (Servicio del Dispensador)

Este servidor es necesario para que la función de "Dispensar Cambio" funcione.

**a. Abrir una terminal o línea de comandos.**

**b. Navegar a la carpeta raíz del proyecto.**

**c. Instalar las dependencias de Python:**
```bash
pip install -r requirements.txt
```

**d. Ejecutar el servidor Flask:**
```bash
python dispenser_service.py
```
Deberías ver una salida indicando que el servidor está corriendo en `http://127.0.0.1:5000` (o `http://0.0.0.0:5000`). ¡No cierres esta terminal! El servidor debe permanecer en ejecución.

### 2. Ejecución del Frontend

**a. Abrir el archivo `login.html` en tu navegador web.**
Puedes hacerlo haciendo doble clic en el archivo o arrastrándolo a la ventana de tu navegador.

**b. Iniciar sesión.**
Usa las credenciales que se encuentran en el archivo `users.json`. Por ejemplo, `usuario: admin`, `contraseña: admin123`.

### 3. Probar la Integración

1.  En el dashboard, usa la "Calculadora de Cambio" para calcular un cambio.
2.  Después de un cálculo exitoso, aparecerá un botón verde **"Dispensar Cambio"**.
3.  Haz clic en ese botón.
4.  Observa la terminal donde se está ejecutando el servidor de Python. Deberías ver un mensaje de log como:
    `ORDEN DE HARDWARE: Dispensar X.XX euros.`
    Esto confirma que el frontend se ha comunicado con éxito con el backend.

---

## Guía de Integración con Hardware Real (Arduino/Raspberry Pi)

El archivo `dispenser_service.py` está diseñado para ser el cerebro que se ejecuta en tu Raspberry Pi. Para conectarlo a tu hardware real, sigue estos pasos:

1.  **Localiza la sección de simulación en `dispenser_service.py`:**
    Busca el comentario `# --- SIMULACIÓN DE INTERACCIÓN CON HARDWARE ---`.

2.  **Reemplaza la simulación con tu código de hardware:**
    Justo debajo de ese comentario, donde actualmente solo hay un `print` y un `logging.info`, debes añadir el código que controla tu dispensador de monedas.

    *   **Si usas una Raspberry Pi:** Podrías usar la librería `RPi.GPIO` para controlar los pines GPIO que activan los motores o solenoides de tu dispensador.
    *   **Si usas un Arduino:** Podrías enviar una señal desde Python a través del puerto serie USB a tu Arduino (usando la librería `pyserial`). El Arduino recibiría esta señal y ejecutaría el código para mover los servomotores.

**Ejemplo conceptual para Raspberry Pi (usando `RPi.GPIO`):**
```python
# --- SIMULACIÓN DE INTERACCIÓN CON HARDWARE ---
# ... (código anterior)

# EJEMPLO: Reemplaza esto con tu lógica
import RPi.GPIO as GPIO
import time

# Configura tu pin GPIO
DISPENSE_PIN = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(DISPENSE_PIN, GPIO.OUT)

# Lógica para dispensar
print(f"Activando pin {DISPENSE_PIN} para dispensar {amount_float:.2f} euros.")
GPIO.output(DISPENSE_PIN, GPIO.HIGH)
time.sleep(1) # Mantener activado por 1 segundo (ajustar según tu hardware)
GPIO.output(DISPENSE_PIN, GPIO.LOW)

print("Dispensador desactivado.")
# No olvides limpiar los pines al cerrar la app si es necesario
# GPIO.cleanup()

# --- FIN DE LA SIMULACIÓN ---
```
Este es solo un ejemplo. Deberás adaptar el código a la configuración específica de tu dispensador de monedas.
