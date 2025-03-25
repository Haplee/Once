Aquí tienes el `README.md` con el estilo que has solicitado:

---

# 📘 Gestión de Usuarios - Carga Automática en MySQL

## 📌 Descripción
Este proyecto es un script en **Python** que automatiza la creación de una tabla de usuarios en **MySQL** y la carga de datos desde un archivo **CSV**. El script encripta las contraseñas y maneja la inserción de datos en la base de datos.

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el repositorio (si aplica)
```bash
git clone https://github.com/tu_usuario/tu_repositorio.git
cd tu_repositorio
```

### 2️⃣ Crear y activar un entorno virtual (Opcional pero recomendado)
#### En Windows:
```bash
python -m venv venv
venv\Scripts\activate
```
#### En macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3️⃣ Instalar dependencias
```bash
pip install -r requirements.txt
```
(Si el archivo `requirements.txt` no existe, puedes instalar **mysql-connector-python** manualmente con el siguiente comando):
```bash
pip install mysql-connector-python
```

### 4️⃣ Configurar la base de datos
Antes de ejecutar el script, asegúrate de tener una base de datos **MySQL** en funcionamiento. Cambia las credenciales de conexión en el script `add_users_db.py`:

```python
db_config = {
    'host': 'localhost',
    'user': 'root',  # Cambia a tu usuario
    'password': 'root',  # Cambia a tu contraseña
    'database': 'once'  # Asegúrate de que la base de datos 'once' exista
}
```

## 🏃‍♂️ Ejecutar el Script

Para ejecutar el script que crea la tabla y carga los usuarios desde el archivo CSV, usa el siguiente comando:

```bash
python add_users_db.py
```

Este script asegurará que la tabla `users` esté creada en la base de datos y cargará los usuarios del archivo CSV ubicado en `users/users.csv`.

## 🛠️ Funcionalidades
✅ **Creación Automática de la Tabla:** Si la tabla `users` no existe, el script la crea automáticamente.  
✅ **Carga de Usuarios desde CSV:** Lee los usuarios desde un archivo CSV y los inserta en la base de datos.  
✅ **Encriptación de Contraseñas:** Las contraseñas se almacenan de forma segura utilizando **SHA-256**.  
✅ **Validación de Datos CSV:** El script valida que el archivo CSV contenga 7 campos antes de insertar los datos.

## 📂 Estructura de Archivos
```
📂 proyecto
│-- add_users_db.py  # Script principal para gestionar la base de datos
│-- 📂 users        # Carpeta donde se encuentra el archivo CSV
│-- users.csv       # Archivo CSV con los usuarios a cargar
│-- requirements.txt  # Dependencias necesarias
```

## 🔧 Solución de Problemas

Si encuentras problemas al ejecutar el script, prueba lo siguiente:

1. **Verificar la conexión a MySQL**
   Asegúrate de que MySQL esté corriendo en tu sistema y que la base de datos y las credenciales sean correctas.
   
2. **Revisar el formato del archivo CSV**
   Asegúrate de que el archivo CSV tenga el siguiente formato:
   ```
   usuario:contraseña:nombre:apellidos:dni:fecha_de_alta:fecha_de_baja
   ```

3. **Reinstalar dependencias**
   Si hay problemas con las librerías, puedes intentar reinstalar las dependencias:
   ```bash
   pip install --upgrade --force-reinstall -r requirements.txt
   ```

## 📝 Autor
- **[Fran Vidal]**

