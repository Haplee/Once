/**
 * @file script.js
<<<<<<< HEAD
 * @description Lógica principal para el dashboard de la intranet (index.html).
=======

 * @description Lógica principal para el dashboard de la intranet (index.html).

>>>>>>> main
 */

// --- Inicializador Principal ---
document.addEventListener('DOMContentLoaded', () => {
    if (!authService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
<<<<<<< HEAD
    }
    initAuthControls();
    initCalculator();
    initVoiceRecognition();
    initDispenser();
});

// --- Inicializadores de Componentes ---

function initAuthControls() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
=======
>>>>>>> main
    }
}

<<<<<<< HEAD
=======
    initAuthControls();
    initCalculator();
    initVoiceRecognition();
    initDispenser();
});

// --- Inicializadores de Componentes ---

function initAuthControls() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
}

>>>>>>> main
function initCalculator() {
    const calcForm = document.getElementById("calcForm");
    const mensajeDiv = document.getElementById("mensaje");
    const dispenseBtn = document.getElementById("dispenseBtn");

<<<<<<< HEAD
=======

>>>>>>> main
    if (!calcForm || !mensajeDiv || !dispenseBtn) return;

    calcForm.addEventListener("submit", function(event) {
        event.preventDefault();
        dispenseBtn.style.display = 'none';

        const cuentaInput = document.getElementById("cuenta");
        const recibidoInput = document.getElementById("recibido");

        if (!cuentaInput.value.trim() || !recibidoInput.value.trim()) {
            mostrarMensaje("Por favor, ingresa ambos valores.", "danger");
            return;
        }

<<<<<<< HEAD
=======

>>>>>>> main
        const cuenta = parseFloat(cuentaInput.value);
        const recibido = parseFloat(recibidoInput.value);
        const resultado = calcularCambio(cuenta, recibido);

        if (resultado.error) {
            mostrarMensaje(resultado.error, "danger");
        } else {
            const mensaje = `El cambio es de ${resultado.cambio.toFixed(2)} euros.`;
            mostrarMensaje(`El cambio es: <strong>${resultado.cambio.toFixed(2)} euros</strong>.`, "info", false);
            hablar(mensaje);

            dispenseBtn.style.display = 'block';
            dispenseBtn.dataset.amount = resultado.cambio.toFixed(2);

            // Guardar la interacción en localStorage
            guardarInteraccion({
                id: new Date().getTime(),
                timestamp: new Date().toISOString(),
                cuenta: cuenta,
                recibido: recibido,
                cambio: resultado.cambio
            });
        }
    });
}

function initVoiceRecognition() {
    const startBtn = document.getElementById("startRecording");
    const stopBtn = document.getElementById("stopRecording");
    const resultDiv = document.getElementById("voiceResult");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !startBtn || !stopBtn || !resultDiv) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "es-ES";
    recognition.interimResults = false;

    startBtn.addEventListener("click", () => {
        recognition.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;
        resultDiv.innerText = "Escuchando...";
    });

    stopBtn.addEventListener("click", () => recognition.stop());

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resultDiv.innerText = `Texto reconocido: ${transcript}`;
        // Lógica para procesar comando de voz (simplificada)
    };
    recognition.onerror = (event) => resultDiv.innerText = `Error: ${event.error}`;
    recognition.onend = () => {
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };
}

<<<<<<< HEAD
=======

>>>>>>> main
function initDispenser() {
    const dispenseBtn = document.getElementById("dispenseBtn");
    if (dispenseBtn) {
        dispenseBtn.addEventListener('click', async () => {
            const amount = dispenseBtn.dataset.amount;
            if (amount) await dispenseChange(amount);
        });
    }
}

// --- Funciones de Lógica y Ayuda ---

async function dispenseChange(amount) {
    const dispenseBtn = document.getElementById("dispenseBtn");
    dispenseBtn.disabled = true;
    dispenseBtn.textContent = 'Dispensando...';

    try {
        const response = await fetch('http://localhost:5000/api/dispense', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseFloat(amount) }),
        });
        const result = await response.json();
        if (response.ok) {
            mostrarMensaje(`Éxito: ${result.message}`, 'info');
        } else {
            mostrarMensaje(`Error: ${result.message}`, 'danger');
        }
    } catch (error) {
        mostrarMensaje('Error de conexión con el servicio dispensador.', 'danger');
    } finally {
        dispenseBtn.disabled = false;
        dispenseBtn.textContent = 'Dispensar Cambio';
        dispenseBtn.style.display = 'none';
    }
}

function calcularCambio(cuenta, recibido) {
    if (recibido < cuenta) return { error: "El dinero recibido es insuficiente." };
    return { cambio: recibido - cuenta };
}

function mostrarMensaje(mensaje, tipo, hablarMsg = true) {
    const mensajeDiv = document.getElementById("mensaje");
    mensajeDiv.className = `alert alert-${tipo}`;
    mensajeDiv.innerHTML = mensaje;
    if (hablarMsg) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = mensaje;
        hablar(tempDiv.textContent || "");
    }
}

<<<<<<< HEAD
=======
=======
function initInteractions() {
    const viewBtn = document.getElementById("viewInteractionsBtn");
    if (viewBtn) {
        viewBtn.addEventListener("click", renderInteractions);
    }
    renderInteractions();
}

/**
 * Configura el botón para dispensar cambio.
 */
function initDispenser() {
    const dispenseBtn = document.getElementById("dispenseBtn");
    if (dispenseBtn) {
        dispenseBtn.addEventListener('click', async () => {
            const amount = dispenseBtn.dataset.amount;
            if (amount) {
                await dispenseChange(amount);
            }
        });
    }
}

// --- Funciones de Lógica y Ayuda ---

async function dispenseChange(amount) {
    const dispenseBtn = document.getElementById("dispenseBtn");
    dispenseBtn.disabled = true;
    dispenseBtn.textContent = 'Dispensando...';

    try {
        const response = await fetch('http://localhost:5000/api/dispense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: parseFloat(amount) }),
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            mostrarMensaje(`Éxito: ${result.message}`, 'info');
        } else {
            mostrarMensaje(`Error: ${result.message || 'No se pudo contactar al servidor.'}`, 'danger');
        }
    } catch (error) {
        console.error('Error al contactar el servicio dispensador:', error);
        mostrarMensaje('Error de conexión con el servicio dispensador.', 'danger');
    } finally {
        dispenseBtn.disabled = false;
        dispenseBtn.textContent = 'Dispensar Cambio';
        dispenseBtn.style.display = 'none'; // Ocultar después del intento
    }
}

function calcularCambio(cuenta, recibido) {
    if (cuenta <= 0 || recibido <= 0) return { error: "Los valores deben ser positivos." };
    if (recibido < cuenta) return { error: "El dinero recibido es insuficiente." };
    return { cambio: recibido - cuenta };
}

function mostrarMensaje(mensaje, tipo, hablarMsg = true) {
    const mensajeDiv = document.getElementById("mensaje");
    mensajeDiv.className = `alert alert-${tipo}`;
    mensajeDiv.innerHTML = mensaje;
    if (hablarMsg) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = mensaje;
        hablar(tempDiv.textContent || tempDiv.innerText || "");
    }
}

>>>>>>> main
function hablar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = "es-ES";
        window.speechSynthesis.speak(utterance);
    }
}

function guardarInteraccion(interaction) {
    const interactions = JSON.parse(localStorage.getItem("interactions") || "[]");
    interactions.push(interaction);
    localStorage.setItem("interactions", JSON.stringify(interactions));
    renderInteractions();
}
<<<<<<< HEAD
=======

>>>>>>> main
