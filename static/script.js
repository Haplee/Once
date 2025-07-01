let speechEnabled = true;

    // Función para remover emoticonos usando expresión regular
    function removeEmojis(text) {
      return text.replace(/[\u2700-\u27BF\uE000-\uF8FF\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '');
    }

    // Función para reproducir texto en voz alta sin emoticonos
    function speakText(text) {
      if (speechEnabled && 'speechSynthesis' in window) {
        let cleanText = removeEmojis(text); // Limpieza de emojis, aunque no se usan actualmente
        let utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-ES'; // Correcto para español
        window.speechSynthesis.speak(utterance);
      } else if (!speechEnabled) {
        console.log("Síntesis de voz desactivada."); // Log para desarrollador
      } else if ('speechSynthesis' in window === false) { // Solo advertir si la API no existe
        console.warn("Tu navegador no soporta la síntesis de voz.");
      }
    }

    // Se espera que el DOM esté cargado para acceder a estos elementos.
    // Si este script se carga en el <head> con defer, está bien.
    // Si se carga al final del <body>, también está bien.
    const calcForm = document.getElementById("calcForm");
    const calcButton = document.getElementById("calcularBtn");
    const originalButtonText = calcButton.innerHTML;
    const cuentaInput = document.getElementById("cuenta");
    const recibidoInput = document.getElementById("recibido");
    const mensajeDiv = document.getElementById("mensaje");
    const toggleSpeechButton = document.getElementById("toggleSpeech");

    // Inicializar el texto del botón de voz según el estado inicial
    if (toggleSpeechButton) {
        toggleSpeechButton.innerText = speechEnabled ? "Desactivar Voz" : "Activar Voz";
    }

    // Lógica para el cambio de tema (Modo Oscuro/Claro)
    const themeToggleButton = document.getElementById("theme-toggle-button");
    const bodyElement = document.body;

    function applyTheme(theme) {
        if (theme === "dark") {
            bodyElement.classList.add("theme-dark");
            themeToggleButton.innerText = "Modo Claro";
        } else {
            bodyElement.classList.remove("theme-dark");
            themeToggleButton.innerText = "Modo Oscuro";
        }
    }

    if (themeToggleButton) {
        // Aplicar tema guardado al cargar la página
        const savedTheme = localStorage.getItem("theme") || "light"; // Default to light
        applyTheme(savedTheme);

        themeToggleButton.addEventListener("click", () => {
            let newTheme = bodyElement.classList.contains("theme-dark") ? "light" : "dark";
            applyTheme(newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    if (calcForm) { // Asegurarse de que el formulario exista antes de añadir el listener
        calcForm.addEventListener("submit", async function(event) {
          event.preventDefault();

          if (!cuentaInput.value.trim() || !recibidoInput.value.trim()) {
            mensajeDiv.classList.remove("d-none", "alert-info");
            mensajeDiv.classList.add("alert-danger");
            mensajeDiv.innerText = "Por favor, ingresa ambos valores.";
            return;
          }

          calcButton.disabled = true;
          calcButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Calculando...`;
          mensajeDiv.classList.add("d-none");

          const formData = new FormData(event.target);
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
              speakText(data.mensaje);
            } else {
              mensajeDiv.classList.remove("d-none", "alert-info");
              mensajeDiv.classList.add("alert-danger");
              mensajeDiv.innerText = data.error;
            }
          } catch (error) {
            console.error("Error en la petición fetch:", error);
            mensajeDiv.classList.remove("d-none", "alert-info");
            mensajeDiv.classList.add("alert-danger");
            mensajeDiv.innerText = "Error al conectar con el servidor. Inténtalo de nuevo.";
          } finally {
            calcButton.disabled = false;
            calcButton.innerHTML = originalButtonText;
          }
        });
    }


    if (toggleSpeechButton) { // Asegurarse de que el botón exista
        toggleSpeechButton.addEventListener("click", function() {
          speechEnabled = !speechEnabled;
          toggleSpeechButton.innerText = speechEnabled ? "Desactivar Voz" : "Activar Voz";
          if (speechEnabled) {
            // speakText("Síntesis de voz activada.");
          } else {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
          }
        });
    }
