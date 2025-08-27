from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configurar logging básico para ver las órdenes en la consola del servidor
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

# Habilitar CORS para permitir peticiones desde el frontend
CORS(app)

@app.route('/api/dispense', methods=['POST'])
def dispense_coins():
    """
    Endpoint para recibir órdenes de dispensar cambio.
    Espera un JSON con la clave 'amount'.
    """
    data = request.get_json()

    if not data or 'amount' not in data:
        logging.warning("Petición recibida sin el campo 'amount'.")
        return jsonify({"status": "error", "message": "El campo 'amount' es requerido."}), 400

    amount = data['amount']

    try:
        # Validar que el monto sea un número y sea positivo
        amount_float = float(amount)
        if amount_float <= 0:
            logging.warning(f"Intento de dispensar un monto no positivo: {amount_float}")
            return jsonify({"status": "error", "message": "El monto a dispensar debe ser un número positivo."}), 400

        # --- SIMULACIÓN DE INTERACCIÓN CON HARDWARE ---
        # En una implementación real, aquí iría el código que controla el hardware.
        log_message = f"ORDEN DE HARDWARE: Dispensar {amount_float:.2f} euros."
        logging.info(log_message)
        print(log_message)
        # --- FIN DE LA SIMULACIÓN ---

        return jsonify({
            "status": "success",
            "message": f"Orden para dispensar {amount_float:.2f} euros procesada."
        }), 200

    except (ValueError, TypeError):
        logging.error(f"Se recibió un monto inválido: {amount}")
        return jsonify({"status": "error", "message": "El monto debe ser un número válido."}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
