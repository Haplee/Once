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

@app.route("/", methods=["GET"])
def index():
    """Maneja la página principal."""
    # La lógica POST fue eliminada ya que el formulario usa AJAX a /calcular.
    # 'resultado' ya no se pasa ya que fue eliminado del template.
    return render_template("index.html")

@app.route("/calcular", methods=["POST"])
def calcular():
    """Calcula el cambio y devuelve un JSON con el resultado."""
    cuenta_str = request.form.get("cuenta")
    recibido_str = request.form.get("recibido")

    if not cuenta_str or not recibido_str or cuenta_str.strip() == "" or recibido_str.strip() == "":
        return jsonify({"error": "Ambos campos, cuenta y recibido, son obligatorios y deben ser números."}), 400

    try:
        cuenta = float(cuenta_str)
        recibido = float(recibido_str)
    except ValueError:
        return jsonify({"error": "Ingresa valores numéricos válidos para cuenta y recibido."}), 400

    mensaje, cambio = calcular_cambio(cuenta, recibido)

    if cambio is None: # Error detectado en calcular_cambio (ej. dinero insuficiente, valores no positivos)
        return jsonify({"error": mensaje}), 400

    return jsonify({"mensaje": mensaje, "cambio": cambio})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)