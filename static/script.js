// --- Lógica de reconocimiento de voz con Web Speech API ---

const startBtn = document.getElementById("startRecording");
const stopBtn = document.getElementById("stopRecording");
const resultDiv = document.getElementById("voiceResult");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "es-ES";
    recognition.interimResults = false;

    startBtn.addEventListener("click", () => {
        try {
            recognition.start();
            startBtn.disabled = true;
            stopBtn.disabled = false;
            resultDiv.innerText = "Escuchando...";
        } catch (e) {
            console.error(e); // Puede fallar si ya está corriendo
        }
    });

    stopBtn.addEventListener("click", () => {
        recognition.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
        resultDiv.innerText = "";
    });

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
        resultDiv.innerText = `Error en el reconocimiento: ${event.error}`;
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
} else {
    startBtn.disabled = true;
    stopBtn.disabled = true;
    resultDiv.innerText = "El reconocimiento de voz no es compatible con tu navegador.";
}

// --- Funciones de ayuda para procesar comandos de voz ---

// Normalizar números con coma
function normalizarNumero(texto) {
    return texto.replace(',', '.');
}

// Convertir palabras a número si es posible (ej: "veinte" -> 20)
function textoANumero(texto) {
    const mapa = {
        "cero": 0, "uno": 1, "una": 1, "dos": 2, "tres": 3, "cuatro": 4, "cinco": 5,
        "seis": 6, "siete": 7, "ocho": 8, "nueve": 9, "diez": 10,
        "once": 11, "doce": 12, "trece": 13, "catorce": 14, "quince": 15,
        "dieciseis": 16, "dieciséis": 16, "diecisiete": 17, "dieciocho": 18, "diecinueve": 19,
        "veinte": 20, "veintiuno": 21, "veintidos": 22, "veintidós": 22, "veintitres": 23, "veintitrés": 23,
        "veinticuatro": 24, "veinticinco": 25, "treinta": 30, "cuarenta": 40,
        "cincuenta": 50, "sesenta": 60, "setenta": 70, "ochenta": 80, "noventa": 90,
        "cien": 100
    };

    if (!isNaN(texto)) return parseFloat(texto); // Si ya es número
    return mapa[texto] ?? null;
}

// Buscar número después de cierta palabra clave
function extraerDespuesDe(transcript, triggers) {
    for (let t of triggers) {
        if (transcript.includes(t)) {
            let parte = transcript.split(t)[1].trim();
            let palabras = parte.split(" ");
            for (let p of palabras) {
                let num = textoANumero(p) || parseFloat(normalizarNumero(p));
                if (!isNaN(num)) return num;
            }
        }
    }
    return null;
}

// Procesar lo que se ha reconocido por voz
function procesarComandoVoz(transcript) {
    const cuentaInput = document.getElementById("cuenta");
    const recibidoInput = document.getElementById("recibido");

    // Triggers para cada campo
    const triggersCuenta = ["cuenta"];
    // Aquí añadimos "dinero" además de "recibido"
    const triggersRecibido = ["recibido", "recibi", "recibí", "dinero"];

    // Buscar número para cuenta
    let valorCuenta = extraerDespuesDe(transcript, triggersCuenta);
    if (valorCuenta !== null) {
        cuentaInput.value = valorCuenta;
    }

    // Buscar número para recibido
    let valorRecibido = extraerDespuesDe(transcript, triggersRecibido);
    if (valorRecibido !== null) {
        recibidoInput.value = valorRecibido;
    }
}

// --- Lógica del tema (oscuro/claro) ---
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    body.classList.add("dark-mode");
}

// --- Lógica de la calculadora y almacenamiento en LocalStorage ---

const calcForm = document.getElementById("calcForm");
const mensajeDiv = document.getElementById("mensaje");
const viewInteractionsBtn = document.getElementById("viewInteractionsBtn");
const interactionsContainer = document.getElementById("interactionsContainer");

// Calcular cambio
function calcularCambio(cuenta, recibido) {
    if (cuenta <= 0 || recibido <= 0) {
        return { error: "Los valores deben ser positivos." };
    }
    if (recibido < cuenta) {
        return { error: "El dinero recibido es insuficiente." };
    }
    const cambio = recibido - cuenta;
    return { cambio };
}

// Guardar interacción
function guardarInteraccion(interaction) {
    const interactions = obtenerInteracciones();
    interactions.push(interaction);
    localStorage.setItem("interactions", JSON.stringify(interactions));
}

// Obtener interacciones
function obtenerInteracciones() {
    const interactionsJSON = localStorage.getItem("interactions");
    return interactionsJSON ? JSON.parse(interactionsJSON) : [];
}

// Evento submit del formulario
calcForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const cuentaInput = document.getElementById("cuenta");
    const recibidoInput = document.getElementById("recibido");

    if (!cuentaInput.value.trim() || !recibidoInput.value.trim()) {
        mensajeDiv.className = "alert alert-danger";
        mensajeDiv.innerText = "Por favor, ingresa ambos valores.";
        return;
    }

    const cuenta = parseFloat(normalizarNumero(cuentaInput.value));
    const recibido = parseFloat(normalizarNumero(recibidoInput.value));

    const resultado = calcularCambio(cuenta, recibido);

    if (resultado.error) {
        mensajeDiv.className = "alert alert-danger";
        mensajeDiv.innerText = resultado.error;
    } else {
        mensajeDiv.className = "alert alert-info";
        mensajeDiv.innerHTML = `El cambio es: <strong>${resultado.cambio.toFixed(2)} euros</strong>.`;

        // Guardar interacción
        const nuevaInteraccion = {
            id: new Date().getTime(),
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            cuenta: cuenta,
            recibido: recibido,
            cambio: resultado.cambio
        };
        guardarInteraccion(nuevaInteraccion);
    }
});

// Ver interacciones
viewInteractionsBtn.addEventListener("click", () => {
    const interactions = obtenerInteracciones();

    if (interactions.length === 0) {
        interactionsContainer.innerHTML = "<p>No hay interacciones registradas.</p>";
        return;
    }

    let table = `
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
            <tbody>
    `;

    interactions.forEach(i => {
        table += `
            <tr>
                <td>${i.id}</td>
                <td>${i.timestamp}</td>
                <td>${i.cuenta.toFixed(2)}</td>
                <td>${i.recibido.toFixed(2)}</td>
                <td>${i.cambio.toFixed(2)}</td>
            </tr>
        `;
    });

    table += "</tbody></table>";
    interactionsContainer.innerHTML = table;
});

