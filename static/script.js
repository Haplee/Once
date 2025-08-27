/**
 * @file script.js
 * @description Lógica principal para el dashboard de la intranet.
 */

// --- Inicializador Principal ---
document.addEventListener('DOMContentLoaded', () => {
    if (!authService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    initTheme();
    initAuthControls();
    initCalculator();
    initVoiceRecognition();
    initInteractions();
    initDispenser(); // <-- Nuevo inicializador
});


// --- Inicializadores de Componentes ---

function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    if (!themeToggle || !body) return;
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
    });
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
    }
}

function initAuthControls() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authService.logout();
        });
    }
}

function initCalculator() {
    const calcForm = document.getElementById("calcForm");
    const mensajeDiv = document.getElementById("mensaje");
    const dispenseBtn = document.getElementById("dispenseBtn");

    if (!calcForm || !mensajeDiv) return;

    calcForm.addEventListener("submit", function(event) {
        event.preventDefault();
        dispenseBtn.style.display = 'none'; // Ocultar el botón en cada nuevo cálculo

        const cuentaInput = document.getElementById("cuenta");
        const recibidoInput = document.getElementById("recibido");

        if (!cuentaInput.value.trim() || !recibidoInput.value.trim()) {
            mostrarMensaje("Por favor, ingresa ambos valores.", "danger");
            return;
        }

        const cuenta = parseFloat(normalizarNumero(cuentaInput.value));
        const recibido = parseFloat(normalizarNumero(recibidoInput.value));
        const resultado = calcularCambio(cuenta, recibido);

        if (resultado.error) {
            mostrarMensaje(resultado.error, "danger");
        } else {
            const mensaje = `El cambio es de ${resultado.cambio.toFixed(2)} euros.`;
            mostrarMensaje(`El cambio es: <strong>${resultado.cambio.toFixed(2)} euros</strong>.`, "info", false);
            hablar(mensaje);

            // Mostrar y configurar el botón para dispensar
            dispenseBtn.style.display = 'block';
            dispenseBtn.dataset.amount = resultado.cambio.toFixed(2); // Guardar el monto en el botón

            guardarInteraccion({
                id: new Date().getTime(),
                timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
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
    if (!SpeechRecognition || !startBtn || !stopBtn || !resultDiv) {
        if(resultDiv) resultDiv.innerText = "El reconocimiento de voz no es compatible.";
        if(startBtn) startBtn.disabled = true;
        if(stopBtn) stopBtn.disabled = true;
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "es-ES";
    recognition.interimResults = false;

    startBtn.addEventListener("click", () => {
        try {
            recognition.start();
            startBtn.disabled = true;
            stopBtn.disabled = false;
            resultDiv.innerText = "Escuchando...";
        } catch (e) { console.error("Error al iniciar reconocimiento:", e); }
    });

    stopBtn.addEventListener("click", () => { recognition.stop(); });

    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
            }
        }
        resultDiv.innerText = `Texto reconocido: ${transcript}`;
        procesarComandoVoz(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
        resultDiv.innerText = `Error: ${event.error}`;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    recognition.onend = () => {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        if (resultDiv.innerText === "Escuchando...") {
            resultDiv.innerText = "";
        }
    };
}

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

function hablar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = "es-ES";
        window.speechSynthesis.speak(utterance);
    }
}

function procesarComandoVoz(transcript) {
    const cuentaInput = document.getElementById("cuenta");
    const recibidoInput = document.getElementById("recibido");
    const triggersCuenta = ["cuenta", "cuesta"];
    const triggersRecibido = ["recibido", "recibí", "paga con"];
    let valorCuenta = extraerNumeroDespuesDe(transcript, triggersCuenta);
    if (valorCuenta !== null) cuentaInput.value = valorCuenta;
    let valorRecibido = extraerNumeroDespuesDe(transcript, triggersRecibido);
    if (valorRecibido !== null) recibidoInput.value = valorRecibido;
}

function extraerNumeroDespuesDe(transcript, triggers) {
    for (let t of triggers) {
        if (transcript.includes(t)) {
            let parte = transcript.split(t)[1].trim();
            let palabras = parte.split(" ");
            for (let p of palabras) {
                let num = textoANumero(p) ?? parseFloat(normalizarNumero(p));
                if (!isNaN(num)) return num;
            }
        }
    }
    return null;
}

function normalizarNumero(texto) { return texto.replace(',', '.'); }

function textoANumero(texto) {
    const mapa = { "cero": 0, "uno": 1, "dos": 2, "tres": 3, "cuatro": 4, "cinco": 5, "seis": 6, "siete": 7, "ocho": 8, "nueve": 9, "diez": 10, "once": 11, "doce": 12, "trece": 13, "catorce": 14, "quince": 15, "dieciséis": 16, "veinte": 20, "treinta": 30, "cuarenta": 40, "cincuenta": 50 };
    return mapa[texto];
}

// --- Lógica de Almacenamiento Local (Interacciones) ---

function guardarInteraccion(interaction) {
    const interactions = obtenerInteracciones();
    interactions.push(interaction);
    localStorage.setItem("interactions", JSON.stringify(interactions));
    renderInteractions();
}

function obtenerInteracciones() {
    const interactionsJSON = localStorage.getItem("interactions");
    return interactionsJSON ? JSON.parse(interactionsJSON) : [];
}

function renderInteractions() {
    const container = document.getElementById("interactionsContainer");
    const interactions = obtenerInteracciones();
    if (interactions.length === 0) {
        container.innerHTML = "<p>No hay interacciones registradas.</p>";
        return;
    }
    const tableRows = interactions.map(i => `
        <tr>
            <td>${i.id}</td>
            <td>${i.timestamp}</td>
            <td>${i.cuenta.toFixed(2)} €</td>
            <td>${i.recibido.toFixed(2)} €</td>
            <td>${i.cambio.toFixed(2)} €</td>
        </tr>
    `).join('');
    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cuenta</th>
                    <th>Recibido</th>
                    <th>Cambio</th>
                </tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    `;
}
