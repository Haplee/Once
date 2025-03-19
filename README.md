# Once
# Gestion de Monedas - Streamlit App

Este es un sistema de gestión de monedas desarrollado con **Streamlit**, que permite calcular automáticamente el cambio de un cliente, registrar operaciones y generar informes diarios.

## 📌 Características
- **Cálculo automático del cambio** cuando se introduce la cantidad recibida.
- **Registro de operaciones** en la carpeta `registros`.
- **Generación de informes diarios** en la carpeta `informes`.
- **Interfaz amigable y funcional** en Streamlit.
- **Eliminación segura de registros e informes** con autenticación.

---

## 🚀 Instalación y ejecución

### 1️⃣ Requisitos previos
Asegúrate de tener instalado Python 3.11 o superior y **Streamlit**.

```sh
pip install streamlit
```

### 2️⃣ Clonar el repositorio
```sh
git clone https://github.com/Haplee/Once.git
cd Once
```

### 3️⃣ Ejecutar la aplicación
```sh
streamlit run pp.py
```

---

## 📂 Estructura del proyecto
```plaintext
📁 Once/
│── pp.py                 # Código principal de la app en Streamlit
│── README.md             # Documentación del proyecto
│── 📂 registros/          # Archivos de registros de transacciones
│── 📂 informes/           # Archivos de informes generados
```

---

## 🔐 Autenticación para eliminar archivos
Para borrar los registros e informes, es necesario autenticarse con:
- **Usuario:** `admin`
- **Contraseña:** `suerte2025`

Se abrirá una nueva pestaña para introducir las credenciales antes de proceder a la eliminación.

---

## 🛠️ Posibles errores y soluciones

**1️⃣ Error `streamlit: command not found`**
- Solución: Asegúrate de tener **Streamlit** instalado:
  ```sh
  pip install streamlit
  ```

**2️⃣ Error `UnicodeEncodeError` al escribir archivos**
- Solución: Modifica el código para usar UTF-8 al escribir archivos:
  ```python
  open('archivo.txt', 'w', encoding='utf-8')
  ```

**3️⃣ Error `fatal: main cannot be resolved to branch` en Git**
- Solución: Asegúrate de que el nombre de la rama es `main` (con minúscula):
  ```sh
  git branch -M main
  ```
