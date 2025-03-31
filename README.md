*📘 Calculadora de Cambio - Flask*

*📌 Descripción*
Este proyecto es una aplicación web desarrollada con Flask que permite calcular el cambio a devolver a un cliente basado en el monto de la cuenta y el dinero recibido. La aplicación incluye un frontend en HTML y CSS para una experiencia de usuario intuitiva, con características como síntesis de voz y un diseño responsivo.

*🚀 Instalación y Configuración*

1️⃣ Clonar el repositorio (si aplica)
Si el proyecto está alojado en un repositorio, clónalo con el siguiente comando:
``bash
``git clone https://github.com/tu_usuario/tu_repositorio.git
``cd tu_repositorio

*2️⃣ Crear y activar un entorno virtual (Opcional pero recomendado)*
En Windows:
``bash
``python -m venv venv
``venv\Scripts\activate


*3️⃣ Instalar dependencias*
Instala las dependencias necesarias (en este caso, Flask):
``bash
``pip install flask
Si existe un archivo requirements.txt, puedes instalar todas las dependencias con:
``bash
``pip install -r requirements.txt

*4️⃣ Configurar la aplicación*
No es necesaria ninguna configuración adicional, ya que la aplicación está lista para ejecutarse tal como está. Asegúrate de que los archivos estáticos (CSS e iconos) estén en la carpeta static y las plantillas en templates.

*🏃‍♂️ Ejecutar la Aplicación*
Para iniciar la aplicación, ejecuta el siguiente comando en la terminal:
``bash
``python app.py
Una vez que el servidor esté corriendo, abre tu navegador y visita http://localhost:5000 para usar la calculadora de cambio.

*🛠️ Funcionalidades*
   *✅ Cálculo de Cambio: Calcula el cambio a devolver basado en la cuenta y el dinero recibido.*
   *✅ Manejo de Solicitudes: Soporta solicitudes GET y POST para interactuar con el usuario.*
   *✅ Resultados en JSON y HTML: Devuelve los resultados tanto en formato JSON (para AJAX) como en HTML.*
   *✅ Síntesis de Voz: Lee los mensajes de resultado en voz alta (con opción de activar/desactivar).*
   *✅ Diseño Responsivo y Accesible: Interfaz adaptada a diferentes dispositivos y accesible para usuarios con lectores de pantalla.*

*📂 Estructura de Archivos*

   ``📂 calculadora_cambio
   ``│-- app.py                # Script principal de Flask
   ``│-- 📂 static             # Carpeta para archivos estáticos
   ``│   │-- styles.css        # Estilos CSS personalizados
   ``│   │-- icono.png         # Icono personalizado
   ``│   │-- default-icon.png  # Icono de respaldo
   ``│-- 📂 templates          # Carpeta para plantillas HTML
   ``│   │-- index.html        # Plantilla principal de la aplicación

*🔧 Solución de Problemas*

Si encuentras problemas al ejecutar la aplicación, prueba lo siguiente:
Verificar la instalación de Flask
Asegúrate de que Flask esté instalado correctamente en tu entorno virtual:
``bash
``pip show flask
Si no está instalado, ejecuta:
``bash
``pip install flask

Revisar la ubicación de los archivos estáticos
Asegúrate de que los archivos styles.css, icono.png y default-icon.png estén en la carpeta static. Si el icono no se carga, verifica la ruta en el HTML.
Comprobar la conexión del servidor
Si la aplicación no se carga en http://localhost:5000, asegúrate de que el servidor Flask esté corriendo sin errores en la terminal.
Depurar errores de JavaScript
Abre la consola del navegador (F12) y revisa si hay errores relacionados con la síntesis de voz o el manejo de formularios.

*📝 Autor*
[*Fran Vidal*]