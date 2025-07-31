# Guía de Instalación para Windows

Esta guía detalla los pasos para instalar y ejecutar la aplicación en un entorno Windows.

## 1. Requisitos Previos

Necesitarás tener Git y Python instalados en tu sistema. Si no los tienes, puedes descargarlos desde los siguientes enlaces:

*   **Git:** [git-scm.com](https://git-scm.com/download/win)
*   **Python:** [python.org](https://www.python.org/downloads/windows/)
    *   **Importante:** Durante la instalación de Python, asegúrate de marcar la casilla que dice **"Add Python to PATH"**.

## 2. Instalar FFmpeg (para Reconocimiento de Voz)

La funcionalidad de reconocimiento de voz depende de la librería `pydub`, que a su vez necesita `ffmpeg` para procesar audio.

1.  **Descarga FFmpeg:**
    *   Ve a [ffmpeg.org/download.html](https://ffmpeg.org/download.html#build-windows).
    *   Selecciona una de las builds para Windows (por ejemplo, de "gyan.dev" o "BtbN").
    *   Descarga el archivo ZIP que contiene los ejecutables.

2.  **Configura FFmpeg en el PATH:**
    *   Descomprime el archivo ZIP en una ubicación permanente en tu disco duro (por ejemplo, `C:\ffmpeg`).
    *   Abre el menú de inicio y busca "Editar las variables de entorno del sistema".
    *   En la ventana de "Propiedades del sistema", haz clic en el botón "Variables de entorno...".
    *   En la sección "Variables del sistema", busca la variable `Path` y haz clic en "Editar...".
    *   Haz clic en "Nuevo" y añade la ruta a la carpeta `bin` dentro del directorio donde descomprimiste FFmpeg (por ejemplo, `C:\ffmpeg\bin`).
    *   Haz clic en "Aceptar" en todas las ventanas para guardar los cambios.
    *   Para verificar que la instalación fue exitosa, abre una nueva terminal (CMD o PowerShell) y ejecuta:
        ```bash
        ffmpeg -version
        ```
        Deberías ver la información de la versión de FFmpeg.

## 3. Clonar el Repositorio

Abre una terminal (CMD, PowerShell o Git Bash) y clona el repositorio del proyecto:

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>
```

## 4. Configurar el Entorno Virtual

Es una buena práctica usar un entorno virtual para aislar las dependencias del proyecto.

```bash
# Crear un entorno virtual
python -m venv venv

# Activar el entorno virtual
venv\Scripts\activate
```

Una vez activado, verás `(venv)` al principio de la línea de comandos de tu terminal.

## 5. Instalar las Dependencias

Con el entorno virtual activado, instala todas las dependencias listadas en el archivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

## 6. Configurar las Variables de Entorno

Si planeas usar la base de datos MySQL (opcional, ya que el proyecto usa SQLite por defecto), sigue estos pasos:

1.  Crea un archivo llamado `.env` en la raíz del proyecto.
2.  Añade la configuración de tu base de datos al archivo:
    ```
    DB_HOST=localhost
    DB_USER=tu_usuario_mysql
    DB_PASSWORD=tu_contraseña_mysql
    DB_DATABASE=once
    ```

## 7. Iniciar la Aplicación

Finalmente, puedes iniciar la aplicación Flask:

```bash
python pp.py
```

La aplicación estará disponible en tu navegador en la siguiente dirección: `http://127.0.0.1:5000`
