/**
 * @file script.js
 * @description Main logic for the intranet dashboard (index.html).
 */

// --- Main Initializer ---
document.addEventListener('DOMContentLoaded', () => {
  // The backend now protects routes, so a client-side redirect is not essential,
  // but this ensures all scripts dependent on authService run after it has initialized.
  authService.isAuthenticated().then(isAuthenticated => {
    if (!isAuthenticated) {
      // If the auth check fails, the user is likely not logged in.
      // The backend should have already redirected, but as a fallback:
      window.location.href = '/login';
      return;
    }
    // Initialize all components that depend on a logged-in user.
    initComponents();
  });
});

// --- Component Initializers ---
function initComponents() {
  initAuthControls();
  initCalculator();
  initVoiceRecognition();
  initDispenser();
  // We can also trigger a manual translation call here if needed,
  // since i18n.js is loaded and settings.js has set the language.
  if (window.translatePage) {
      const currentLanguage = localStorage.getItem('language') || 'es';
      window.translatePage(currentLanguage);
  }
}

function initAuthControls() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await authService.logout();
    });
  }
}

function initCalculator() {
    const calcForm = document.getElementById("calcForm");
    const mensajeDiv = document.getElementById("mensaje");
    const dispenseBtn = document.getElementById("dispenseBtn");

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

    let recognition;

    startBtn.addEventListener("click", () => {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        const currentLanguage = localStorage.getItem('language') || 'es';
        const recognitionLang = { es: 'es-ES', en: 'en-US', fr: 'fr-FR' }[currentLanguage];
        recognition.lang = recognitionLang;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resultDiv.innerText = `Texto reconocido: ${transcript}`;
        };
        recognition.onerror = (event) => {
            resultDiv.innerText = `Error en el reconocimiento: ${event.error}`;
        };
        recognition.onend = () => {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        };

        recognition.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;
        resultDiv.innerText = "Escuchando...";
    });

    stopBtn.addEventListener("click", () => {
        if (recognition) {
            recognition.stop();
        }
    });
}

function initDispenser() {
    const dispenseBtn = document.getElementById("dispenseBtn");
    if (dispenseBtn) {
        dispenseBtn.addEventListener('click', async () => {
            const amount = dispenseBtn.dataset.amount;
            if (amount) await dispenseChange(amount);
        });
    }
}

// --- Logic and Helper Functions ---

async function dispenseChange(amount) {
    const dispenseBtn = document.getElementById("dispenseBtn");
    dispenseBtn.disabled = true;
    dispenseBtn.textContent = 'Dispensando...';

    try {
        const response = await fetch('/api/dispense', {
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

function hablar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);

        const currentLanguage = localStorage.getItem('language') || 'es';
        const synthesisLang = { es: 'es-ES', en: 'en-US', fr: 'fr-FR' }[currentLanguage];
        utterance.lang = synthesisLang;

        window.speechSynthesis.speak(utterance);
    }
}

function guardarInteraccion(interaction) {
    const interactions = JSON.parse(localStorage.getItem("interactions") || "[]");
    interactions.push(interaction);
    localStorage.setItem("interactions", JSON.stringify(interactions));
    if (window.renderInteractions) {
        renderInteractions();
    }
}
