let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("startRecording");
const stopBtn = document.getElementById("stopRecording");
const resultDiv = document.getElementById("voiceResult");
const socket = io.connect("http://" + document.domain + ":" + location.port);

stopBtn.disabled = true;

socket.on("voice_result", (data) => {
  if (data.texto) {
    resultDiv.innerText = `Texto reconocido: ${data.texto}`;
  } else if (data.error) {
    resultDiv.innerText = `Error: ${data.error}`;
  }
});

startBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorder.start(1000); // Enviar datos cada 1 segundo
    audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      if (event.data.size > 0) {
        socket.emit("audio_chunk", event.data);
      }
    });

    mediaRecorder.addEventListener("stop", async () => {
      // La lógica de envío de archivos a través de HTTP se puede mantener o eliminar si se prefiere WebSocket
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
