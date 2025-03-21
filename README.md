# 📘 Gestión de Monedas - Streamlit App

## 📌 Descripción
Esta es una aplicación web creada con **Streamlit** para gestionar transacciones monetarias, calcular cambios y generar informes de operaciones.

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
(Si el archivo `requirements.txt` no existe, puedes instalar Streamlit manualmente con `pip install streamlit`.)

## 🏃‍♂️ Ejecutar la Aplicación
```bash
streamlit run nombre_del_archivo.py
```
Ejemplo:
```bash
streamlit run app.py
```

## 🛠️ Funcionalidades
✅ **Cálculo de Cambio:** Permite ingresar el monto del cliente y el dinero recibido para calcular el cambio.  
✅ **Registro de Operaciones:** Guarda cada transacción en un archivo de texto.  
✅ **Generación de Informes:** Crea informes diarios con el historial de transacciones.  
✅ **Listado de Informes:** Permite visualizar los informes generados.  
✅ **Eliminación de Registros:** Opción para borrar todos los informes y registros.

## 📂 Estructura de Archivos
```
📂 proyecto
│-- app.py  # Código principal de la aplicación
│-- 📂 registros  # Carpeta donde se almacenan los registros
│-- 📂 informes   # Carpeta donde se guardan los informes generados
│-- requirements.txt  # Dependencias necesarias
```

## 🔧 Solución de Problemas
Si tienes problemas al ejecutar la app, prueba lo siguiente:
1. **Verificar la versión de Python**
   ```bash
   python --version
   ```
   Asegúrate de tener **Python 3.7+**.
2. **Reinstalar dependencias**
   ```bash
   pip install --upgrade --force-reinstall -r requirements.txt
   ```
3. **Ejecutar en otro puerto (en caso de conflicto)**
   ```bash
   streamlit run app.py --server.port=8502
   ```

## 📝 Autor
- **[Fran Vidal]** 