# 📘 Calculadora de Cambio - Flask

## 📌 Descripción

Este proyecto es una aplicación web desarrollada con Flask que permite calcular el cambio a devolver a un cliente basado en el monto de la cuenta y el dinero recibido. La aplicación ha sido actualizada para incluir:
- Un diseño responsivo que se adapta a diferentes dispositivos.
- Interfaz con los colores corporativos de la ONCE (verde, amarillo y blanco como principales).
- Funcionalidad de Modo Oscuro para mejorar la accesibilidad y preferencia del usuario.
- Síntesis de voz de los resultados a través del navegador.

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el repositorio (si aplica)

Si el proyecto está alojado en un repositorio, clónalo con el siguiente comando:

```bash
git clone https://github.com/tu_usuario/tu_repositorio.git
cd tu_repositorio
```

### 2️⃣ Crear y activar un entorno virtual (Opcional pero recomendado)

En Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

### 3️⃣ Instalar dependencias

Instala las dependencias. El proyecto utiliza Flask.

Puedes instalar Flask directamente:
```bash
pip install flask
```
O, si prefieres usar el archivo `requirements.txt` (que actualmente solo contiene `flask`):
```bash
pip install -r requirements.txt
```

### 4️⃣ Configurar la aplicación

No es necesaria ninguna configuración adicional, ya que la aplicación está lista para ejecutarse tal como está. Asegúrate de que los archivos estáticos (CSS e iconos) estén en la carpeta `static` y las plantillas en `templates`.

## 🏃‍♂️ Ejecutar la Aplicación

Para iniciar la aplicación, ejecuta el siguiente comando en la terminal:

```bash
python pp.py
```

Una vez que el servidor esté corriendo, abre tu navegador y visita `http://localhost:5000` para usar la calculadora de cambio.

## 🛠️ Funcionalidades

- ✅ **Cálculo de Cambio**: Calcula el cambio a devolver basado en la cuenta y el dinero recibido.
 - ✅ **Manejo de Solicitudes**: Soporta solicitudes GET (para la página) y POST (para el cálculo AJAX).
 - ✅ **Resultados en JSON y HTML**: La API de cálculo (`/calcular`) devuelve JSON. El resultado se muestra dinámicamente en el HTML.
 - ✅ **Síntesis de Voz (Navegador)**: Lee los mensajes de resultado en voz alta utilizando la API de Síntesis de Voz del navegador web (opción de activar/desactivar).
 - ✅ **Diseño Responsivo**: Interfaz adaptada a diferentes dispositivos (usando Bootstrap 5).
 - ✅ **Colores Corporativos ONCE**: La interfaz utiliza una paleta de colores basada en el verde, amarillo y blanco característicos de la ONCE.
 - ✅ **Modo Oscuro**: Incluye un interruptor para alternar entre un tema claro y un tema oscuro, con persistencia de la preferencia del usuario.
 - ✅ **Accesibilidad**: Uso de atributos ARIA y buen contraste de colores (considerado en ambos temas).

## 📂 Estructura de Archivos

```
📂 calculadora_cambio
│-- pp.py               # Script principal de Flask
│-- 📂 static           # Carpeta para archivos estáticos
│   │-- static.css      # Estilos CSS personalizados
│   │-- icono.ico       # Icono de la aplicación (usado en el HTML)
│-- 📂 templates        # Carpeta para plantillas HTML
│   │-- index.html      # Plantilla principal de la aplicación
# (Nota: script.js también está en static/ pero es opcional listarlo si se considera parte de la implementación de index.html)
# (Nota: README no listaba icono.ico que sí está, y listaba icono.png/default-icon.png que no están)
```

## 🔧 Solución de Problemas

Si encuentras problemas al ejecutar la aplicación, prueba lo siguiente:

### Verificar la instalación de Flask

Asegúrate de que Flask esté instalado correctamente en tu entorno virtual:

```bash
pip show flask
```

Si no está instalado, ejecuta:

```bash
pip install flask
```

### Revisar la ubicación de los archivos estáticos

Asegúrate de que los archivos `static.css` (hoja de estilos) y `icono.ico` (icono de la pestaña) estén en la carpeta `static/`. Si estos no se cargan correctamente, verifica las rutas en `templates/index.html` y los nombres de los archivos. El archivo JavaScript `script.js` también reside en `static/`.

### Comprobar la conexión del servidor

Si la aplicación no se carga en `http://localhost:5000`, asegúrate de que el servidor Flask esté corriendo sin errores en la terminal.

### Depurar errores de JavaScript

Abre la consola del navegador (F12) y revisa si hay errores relacionados con la síntesis de voz o el manejo de formularios.

## 📝 Autor

*Fran Vidal*

