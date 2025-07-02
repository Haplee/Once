let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("startRecording");
const stopBtn = document.getElementById("stopRecording");
const resultDiv = document.getElementById("voiceResult");

stopBtn.disabled = true;

startBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();
    audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio_data", audioBlob, "grabacion.wav");

      resultDiv.innerText = "Procesando reconocimiento...";

      try {
        const response = await fetch("/reconocer-voz", {
          method: "POST",
          body: formData
        });
        const data = await response.json();

        if (response.ok) {
          if(data.texto && data.texto.trim() !== "") {
            resultDiv.innerText = `Texto reconocido: ${data.texto}`;
          } else {
            resultDiv.innerText = data.mensaje || "No se reconoció texto.";
          }
        } else {
          resultDiv.innerText = `Error: ${data.error || "Error desconocido"}`;
        }
      } catch (error) {
        resultDiv.innerText = "Error en la conexión con el servidor.";
      }
    });

    startBtn.disabled = true;
    stopBtn.disabled = false;

  } catch (err) {
    alert("No se pudo acceder al micrófono: " + err);
  }
});

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
});
