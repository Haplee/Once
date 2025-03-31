from flask import Flask, render_template, request, jsonify
import logging

# Inicializar la aplicación Flask
app = Flask(__name__, static_folder="static")

# Configurar logging básico para depuración
logging.basicConfig(level=logging.DEBUG)

def calcular_cambio(cuenta, recibido):
    """
    Calcula el cambio a devolver basado en la cuenta y el dinero recibido.
    
    :param cuenta: float, monto de la cuenta
    :param recibido: float, dinero recibido
    :return: tuple, (mensaje, cambio) o (error, None) en caso de fallo
    """
    if cuenta <= 0 or recibido <= 0:
        return "Los valores deben ser positivos.", None
    if recibido < cuenta:
        return "El dinero recibido es insuficiente.", None
    cambio = recibido - cuenta
    mensaje = f"El cambio es: {cambio:.2f} euros."
    return mensaje, cambio

@app.route("/", methods=["GET", "POST"])
def index():
    """Maneja la página principal y procesa solicitudes GET y POST."""
    resultado = None
    if request.method == "POST":
        try:
            cuenta = float(request.form.get("cuenta", 0))
            recibido = float(request.form.get("recibido", 0))
            mensaje, _ = calcular_cambio(cuenta, recibido)
            resultado = mensaje
        except ValueError:
            resultado = "Error: Ingresa valores numéricos válidos."
    return render_template("index.html", resultado=resultado)

@app.route("/calcular", methods=["POST"])
def calcular():
    """Calcula el cambio y devuelve un JSON con el resultado."""
    try:
        cuenta = float(request.form.get("cuenta", 0))
        recibido = float(request.form.get("recibido", 0))
        mensaje, cambio = calcular_cambio(cuenta, recibido)
        if cambio is None:
            return jsonify({"error": mensaje}), 400
        return jsonify({"mensaje": mensaje, "cambio": cambio})
    except ValueError:
        return jsonify({"error": "Ingresa valores numéricos válidos."}), 400

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)