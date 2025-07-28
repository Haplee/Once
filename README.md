# Aplicación de Calculadora de Cambio y Reconocimiento de Voz con FastAPI

Esta es una aplicación web que combina una calculadora de cambio con un sistema de reconocimiento de voz en tiempo real, construida con FastAPI.

## Características

*   **Calculadora de Cambio:** Calcula el cambio a devolver a un cliente.
*   **Reconocimiento de Voz:** Reconoce palabras clave en tiempo real para activar acciones.
*   **Base de Datos MySQL:** Almacena un historial de todos los cálculos de cambio realizados.
*   **API Interactiva:** Documentación de la API generada automáticamente por FastAPI.

## Requisitos

*   Python 3.8+
*   MySQL Server
*   `python3-venv`

## Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_REPOSITORIO>
    ```

2.  **Ejecuta el script de instalación:**
    Este script instalará todas las dependencias necesarias, incluyendo MySQL Server, y creará un entorno virtual.
    ```bash
    chmod +x install.sh
    ./install.sh
    ```

3.  **Configura la base de datos MySQL:**
    El script de instalación te proporcionará los comandos para crear el usuario y la base de datos. Debes ejecutarlos manually:
    ```sql
    sudo mysql -e "CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'usuario';"
    sudo mysql -e "GRANT ALL PRIVILEGES ON once.* TO 'usuario'@'localhost';"
    sudo mysql -e "FLUSH PRIVILEGES;"
    ```

4.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto con la siguiente información:
    ```
    DB_HOST=localhost
    DB_USER=usuario
    DB_PASSWORD=usuario
    DB_DATABASE=once
    ```

## Uso

1.  **Activa el entorno virtual:**
    Antes de ejecutar la aplicación, asegúrate de activar el entorno virtual:
    ```bash
    source venv/bin/activate
    ```

2.  **Inicia la aplicación:**
    Usa `uvicorn` para iniciar el servidor:
    ```bash
    uvicorn pp:socket_app --host 0.0.0.0 --port 5000 --reload
    ```

3.  **Abre tu navegador:**
    Ve a `http://localhost:5000` para acceder a la aplicación.

4.  **API Interactiva:**
    Para ver la documentación de la API generada automáticamente, ve a `http://localhost:5000/docs`.

5.  **Desactiva el entorno virtual:**
    Cuando hayas terminado, puedes desactivar el entorno virtual con el comando:
    ```bash
    deactivate
    ```

## Cómo funciona

*   **Frontend:** La interfaz de usuario está construida con HTML, CSS y JavaScript. Utiliza `Socket.IO` para la comunicación en tiempo real con el backend.
*   **Backend:** El backend está desarrollado con FastAPI y Uvicorn. Se encarga de:
    *   Servir la página web.
    *   Manejar las peticiones de la calculadora de cambio.
    *   Procesar el audio en tiempo real para el reconocimiento de voz.
    *   Conectarse a la base de datos MySQL para almacenar los cálculos.
*   **Base de Datos:** Se utiliza MySQL para almacenar un historial de todos los cálculos de cambio. La tabla `calculos` se crea automáticamente al iniciar la aplicación si no existe.
