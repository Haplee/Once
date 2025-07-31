# Aplicación de Calculadora de Cambio y Reconocimiento de Voz

Esta es una aplicación web construida con Flask que proporciona una calculadora de cambio y utiliza reconocimiento de voz para procesar comandos.

## Características

*   **Calculadora de Cambio:** Calcula el cambio a devolver basado en un total y el dinero recibido.
*   **Reconocimiento de Voz:** Procesa audio para identificar frases clave y realizar acciones (funcionalidad básica).
*   **Historial de Interacciones:** Guarda cada cálculo en una base de datos SQLite para futuras consultas.
*   **Modo Oscuro:** Interfaz con tema claro y oscuro.

## Instalación

La instalación se puede realizar ejecutando un único script dependiendo de tu sistema operativo.

### Para Windows

Abre una terminal (CMD o PowerShell) y ejecuta el siguiente comando:

```bash
install.bat
```

El script se encargará de:
1.  Verificar que Python y Git estén instalados.
2.  Descargar y configurar `ffmpeg` (necesario para el procesamiento de audio).
3.  Crear un entorno virtual.
4.  Instalar todas las dependencias de Python.

### Para Linux y macOS

Abre una terminal y ejecuta el siguiente comando:

```bash
chmod +x install.sh
./install.sh
```

El script se encargará de:
1.  Instalar `ffmpeg` usando el gestor de paquetes del sistema.
2.  Crear un entorno virtual.
3.  Instalar todas las dependencias de Python.

## Uso

Después de que la instalación esté completa, sigue estos pasos para iniciar la aplicación:

1.  **Activa el entorno virtual:**
    *   **Windows:** `venv\Scripts\activate`
    *   **Linux/macOS:** `source venv/bin/activate`

2.  **Inicia la aplicación Flask:**
    ```bash
    python pp.py
    ```

3.  **Abre tu navegador:**
    Ve a `http://127.0.0.1:5000` para acceder a la aplicación.

## Cómo Funciona

*   **Backend:** Construido con Flask y Flask-SocketIO. Se encarga de la lógica de negocio, el reconocimiento de voz y la gestión de la base de datos.
*   **Frontend:** HTML, CSS y JavaScript simple. Se comunica con el backend a través de peticiones HTTP y WebSockets.
*   **Base de Datos:** Utiliza SQLite para almacenar el historial de cálculos, lo que simplifica la configuración al no requerir un servidor de base de datos externo.
