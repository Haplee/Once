let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("startRecording");
const stopBtn = document.getElementById("stopRecording");
const resultDiv = document.getElementById("voiceResult");

stopBtn.disabled = true;

startBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorder.start();
    audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      try {
        const response = await fetch("/reconocer-voz", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (response.ok) {
          resultDiv.innerText = `Texto reconocido: ${data.texto}`;
        } else {
          resultDiv.innerText = `Error: ${data.error}`;
        }
      } catch (error) {
        resultDiv.innerText = "Error al conectar con el servidor.";
      }
    });

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resultDiv.innerText = "Grabando...";

  } catch (err) {
    alert("No se pudo acceder al micrófono: " + err);
  }
});

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  resultDiv.innerText = "";
});

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    body.classList.add("dark-mode");
}


// View interactions
const viewInteractionsBtn = document.getElementById("viewInteractionsBtn");
const interactionsContainer = document.getElementById("interactionsContainer");

viewInteractionsBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("/interactions");
        const interactions = await response.json();

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

    } catch (error) {
        interactionsContainer.innerHTML = "<p>Error al cargar las interacciones.</p>";
    }
});


// Código JS para formulario calcular cambio
const calcForm = document.getElementById("calcForm");
const calcButton = document.getElementById("calcularBtn");
const mensajeDiv = document.getElementById("mensaje");

calcForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  const cuentaInput = document.getElementById("cuenta");
  const recibidoInput = document.getElementById("recibido");

  if (!cuentaInput.value.trim() || !recibidoInput.value.trim()) {
    mensajeDiv.classList.remove("d-none", "alert-info");
    mensajeDiv.classList.add("alert-danger");
    mensajeDiv.innerText = "Por favor, ingresa ambos valores.";
    return;
  }

  calcButton.disabled = true;
  calcButton.innerText = "Calculando...";
  mensajeDiv.classList.add("d-none");

  const formData = new FormData(calcForm);

  try {
    const response = await fetch("/calcular", {
      method: "POST",
      body: formData
    });
    const data = await response.json();

    if (response.ok) {
      mensajeDiv.classList.remove("d-none", "alert-danger");
      mensajeDiv.classList.add("alert-info");
      mensajeDiv.innerHTML = `El cambio es: <strong>${data.cambio.toFixed(2)} euros</strong>.`;
    } else {
      mensajeDiv.classList.remove("d-none", "alert-info");
      mensajeDiv.classList.add("alert-danger");
      mensajeDiv.innerText = data.error;
    }
  } catch (error) {
    mensajeDiv.classList.remove("d-none", "alert-info");
    mensajeDiv.classList.add("alert-danger");
    mensajeDiv.innerText = "Error al conectar con el servidor. Inténtalo de nuevo.";
  } finally {
    calcButton.disabled = false;
    calcButton.innerText = "Calcular Cambio";
  }
});
