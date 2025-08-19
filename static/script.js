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
        } catch(e) {
            // Esto puede pasar si el reconocimiento ya ha empezado
            console.error(e);
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
        if(resultDiv.innerText === "Escuchando..."){
            resultDiv.innerText = "";
        }
    };

} else {
    startBtn.disabled = true;
    stopBtn.disabled = true;
    resultDiv.innerText = "El reconocimiento de voz no es compatible con tu navegador.";
}

function normalizarNumero(texto) {
    return texto.replace(',', '.');
}

function procesarComandoVoz(transcript) {
    const cuentaInput = document.getElementById("cuenta");
    const recibidoInput = document.getElementById("recibido");

    // Expresiones regulares para buscar "cuenta" y "recibido" y capturar el número que sigue.
    // Se consideran números enteros o decimales (con coma o punto).
    const regexCuenta = /cuenta\sde\s([\d,.]+|\d+)/;
    const regexRecibido = /recibido\sde\s([\d,.]+|\d+)|recibido\s([\d,.]+|\d+)/;


    const matchCuenta = transcript.match(regexCuenta);
    if (matchCuenta && matchCuenta[1]) {
        cuentaInput.value = normalizarNumero(matchCuenta[1]);
    }

    const matchRecibido = transcript.match(regexRecibido);
    if (matchRecibido && (matchRecibido[1] || matchRecibido[2])) {
        recibidoInput.value = normalizarNumero(matchRecibido[1] || matchRecibido[2]);
    }
}


// Lógica del tema (sin cambios)
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
const calcButton = document.getElementById("calcularBtn");
const mensajeDiv = document.getElementById("mensaje");
const viewInteractionsBtn = document.getElementById("viewInteractionsBtn");
const interactionsContainer = document.getElementById("interactionsContainer");

// Función para calcular el cambio
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

// Función para guardar una interacción en LocalStorage
function guardarInteraccion(interaction) {
    const interactions = obtenerInteracciones();
    interactions.push(interaction);
    localStorage.setItem("interactions", JSON.stringify(interactions));
}

// Función para obtener todas las interacciones de LocalStorage
function obtenerInteracciones() {
    const interactionsJSON = localStorage.getItem("interactions");
    return interactionsJSON ? JSON.parse(interactionsJSON) : [];
}

// Event listener para el formulario de cálculo
calcForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const cuentaInput = document.getElementById("cuenta");
    const recibidoInput = document.getElementById("recibido");

    if (!cuentaInput.value.trim() || !recibidoInput.value.trim()) {
        mensajeDiv.className = "alert alert-danger";
        mensajeDiv.innerText = "Por favor, ingresa ambos valores.";
        return;
    }

    const cuenta = parseFloat(cuentaInput.value);
    const recibido = parseFloat(recibidoInput.value);

    const resultado = calcularCambio(cuenta, recibido);

    if (resultado.error) {
        mensajeDiv.className = "alert alert-danger";
        mensajeDiv.innerText = resultado.error;
    } else {
        mensajeDiv.className = "alert alert-info";
        mensajeDiv.innerHTML = `El cambio es: <strong>${resultado.cambio.toFixed(2)} euros</strong>.`;

        // Guardar la interacción
        const nuevaInteraccion = {
            id: new Date().getTime(), // ID único basado en el timestamp
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            cuenta: cuenta,
            recibido: recibido,
            cambio: resultado.cambio
        };
        guardarInteraccion(nuevaInteraccion);
    }
});

// Event listener para ver las interacciones
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
