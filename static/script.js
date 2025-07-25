document.addEventListener("DOMContentLoaded", () => {
  const resultDiv = document.getElementById("voiceResult");
  const-socket = io.connect("http://" + document.domain + ":" + location.port);

  socket.on("connect", () => {
    console.log("Conectado al servidor de WebSocket.");
    startRecording();
  });

  socket.on("disconnect", () => {
    console.log("Desconectado del servidor de WebSocket.");
    stopRecording();
  });

  socket.on("voice_result", (data) => {
    if (data.texto) {
      resultDiv.innerText = `Texto reconocido: ${data.texto}`;
    } else if (data.error) {
      resultDiv.innerText = `Error: ${data.error}`;
    }
  });

  let mediaRecorder;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          socket.emit("audio_chunk", event.data);
        }
      });

      mediaRecorder.start(1000); // Enviar datos cada 1 segundo
      resultDiv.innerText = "Grabando...";
    } catch (err) {
      alert("No se pudo acceder al micrófono: " + err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  // Código para el formulario de cálculo de cambio
  const calcForm = document.getElementById("calcForm");
  const calcButton = document.getElementById("calcularBtn");
  const mensajeDiv = document.getElementById("mensaje");

  calcForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cuentaInput = document.getElementById("cuenta");
    const recibidoInput = document.getElementById("recibido");

    if (!cuentaInput.value.trim() || !recibidoInput.value.trim()) {
      mensajeDiv.innerText = "Por favor, ingresa ambos valores.";
      return;
    }

    calcButton.disabled = true;
    calcButton.innerText = "Calculando...";

    const formData = new FormData(calcForm);

    try {
      const response = await fetch("/calcular", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        mensajeDiv.innerHTML = `El cambio es: <strong>${data.cambio.toFixed(
          2
        )} euros</strong>.`;
      } else {
        mensajeDiv.innerText = data.error;
      }
    } catch (error) {
      mensajeDiv.innerText =
        "Error al conectar con el servidor. Inténtalo de nuevo.";
    } finally {
      calcButton.disabled = false;
      calcButton.innerText = "Calcular Cambio";
    }
  });
});
