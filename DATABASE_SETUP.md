# Configuración de la Base de Datos para la Calculadora de Cambio

Este documento describe los pasos para configurar una base de datos SQLite para almacenar las interacciones con la calculadora de cambio.

## 1. Instalar las dependencias necesarias

Necesitarás `Flask-SQLAlchemy` para interactuar con la base de datos desde la aplicación Flask.

```bash
pip install Flask-SQLAlchemy
```

## 2. Configurar la base de datos en la aplicación

Modifica `pp.py` para configurar la base de datos y definir el modelo de datos.

```python
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import logging
import speech_recognition as sr
import io
from pydub import AudioSegment
import datetime

# Inicializar la aplicación Flask
app = Flask(__name__, static_folder="static")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///interactions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo de la base de datos
class Interaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    cuenta = db.Column(db.Float, nullable=False)
    recibido = db.Column(db.Float, nullable=False)
    cambio = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<Interaction {self.id}>'

# ... (resto del código de pp.py)
```

## 3. Crear la base de datos

Puedes crear la base de datos y la tabla `interaction` desde una terminal de Python.

Abre una terminal en el directorio del proyecto y ejecuta `python`. Luego, introduce los siguientes comandos:

```python
from pp import db, app
with app.app_context():
    db.create_all()
exit()
```

Esto creará un archivo `interactions.db` en el directorio del proyecto con la tabla `interaction` lista para ser usada.

## 4. Guardar las interacciones

Modifica la ruta `/calcular` en `pp.py` para guardar cada cálculo exitoso en la base de datos.

```python
@app.route("/calcular", methods=["POST"])
def calcular():
    # ... (código existente para obtener cuenta y recibido)

    mensaje, cambio = calcular_cambio(cuenta, recibido)

    if cambio is None:
        return jsonify({"error": mensaje}), 400

    # Guardar la interacción en la base de datos
    interaction = Interaction(cuenta=cuenta, recibido=recibido, cambio=cambio)
    db.session.add(interaction)
    db.session.commit()

    return jsonify({"mensaje": mensaje, "cambio": cambio})
```
