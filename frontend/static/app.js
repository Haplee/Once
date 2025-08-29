// =================================================================================
// Contenido de i18n.js
// =================================================================================
const translations = {
    es: {
        // General
        dashboard_title: "Dashboard Principal",
        nav_dashboard: "Dashboard",
        nav_settings: "Configuración",
        nav_logout: "Cerrar Sesión",
        welcome_message: "Bienvenido, {name}",
        // Settings Page
        preferences_title: "Preferencias de la Interfaz",
        language_label: "Idioma:",
        lang_es: "Español",
        lang_en: "Inglés",
        lang_fr: "Francés",
        dark_mode_label: "Modo Oscuro:",
        // Dashboard Widgets
        calculator_title: "Calculadora de Cambio",
        customer_account_label: "Cuenta del cliente (€):",
        money_received_label: "Dinero Recibido (€):",
        calculate_change_button: "Calcular Cambio",
        dispense_change_button: "Dispensar Cambio",
        voice_control_title: "Control por Voz",
        record_voice_button: "Grabar voz",
        stop_button: "Detener",
        interactions_history_title: "Historial de Interacciones",
        interactions_history_desc: "Consulta el historial completo de todas las transacciones registradas en el sistema.",
        view_full_history_button: "Ver Historial Completo",
        // Settings Page Specific
        settings_title: "Configuración",
        back_to_dashboard_button: "Volver al Dashboard",
        profile_management_title: "Gestión de Perfil",
        new_password_label: "Nueva Contraseña:",
        confirm_password_label: "Confirmar Contraseña:",
        save_password_button: "Guardar Contraseña",
        dispenser_settings_title: "Ajustes del Dispensador",
        dispenser_api_url_label: "URL de la API del Dispensador:",
        dispenser_timeout_label: "Timeout (segundos):",
        save_settings_button: "Guardar Ajustes",
        // Login Page
        intranet_access_title: "Acceso a Intranet",
        username_label: "Usuario:",
        password_label: "Contraseña:",
        login_button: "Acceder",
        // Interactions Page
        interactions_history_page_title: "Historial de Interacciones",
        all_transactions_title: "Todas las Transacciones",
        loading_interactions_message: "Cargando interacciones...",
    },
    en: {
        // General
        dashboard_title: "Main Dashboard",
        nav_dashboard: "Dashboard",
        nav_settings: "Settings",
        nav_logout: "Logout",
        welcome_message: "Welcome, {name}",
        // Settings Page
        preferences_title: "Interface Preferences",
        language_label: "Language:",
        lang_es: "Spanish",
        lang_en: "English",
        lang_fr: "French",
        dark_mode_label: "Dark Mode:",
        // Settings Page Specific
        settings_title: "Settings",
        back_to_dashboard_button: "Back to Dashboard",
        profile_management_title: "Profile Management",
        new_password_label: "New Password:",
        confirm_password_label: "Confirm Password:",
        save_password_button: "Save Password",
        dispenser_settings_title: "Dispenser Settings",
        dispenser_api_url_label: "Dispenser API URL:",
        dispenser_timeout_label: "Timeout (seconds):",
        save_settings_button: "Save Settings",
        // Login Page
        intranet_access_title: "Intranet Access",
        username_label: "Username:",
        password_label: "Password:",
        login_button: "Login",
        // Interactions Page
        interactions_history_page_title: "Interactions History",
        all_transactions_title: "All Transactions",
        loading_interactions_message: "Loading interactions...",
        // Dashboard Widgets
        calculator_title: "Change Calculator",
        customer_account_label: "Customer's account (€):",
        money_received_label: "Money Received (€):",
        calculate_change_button: "Calculate Change",
        dispense_change_button: "Dispense Change",
        voice_control_title: "Voice Control",
        record_voice_button: "Record voice",
        stop_button: "Stop",
        interactions_history_title: "Interactions History",
        interactions_history_desc: "Check the complete history of all transactions registered in the system.",
        view_full_history_button: "View Full History",
    },
    fr: {
        // General
        dashboard_title: "Tableau de Bord Principal",
        nav_dashboard: "Tableau de bord",
        nav_settings: "Paramètres",
        nav_logout: "Déconnexion",
        welcome_message: "Bienvenue, {name}",
        // Settings Page
        preferences_title: "Préférences de l'interface",
        language_label: "Langue:",
        lang_es: "Espagnol",
        lang_en: "Anglais",
        lang_fr: "Français",
        dark_mode_label: "Mode Sombre:",
        // Settings Page Specific
        settings_title: "Paramètres",
        back_to_dashboard_button: "Retour au Tableau de Bord",
        profile_management_title: "Gestion de Profil",
        new_password_label: "Nouveau Mot de Passe:",
        confirm_password_label: "Confirmer le Mot de Passe:",
        save_password_button: "Enregistrer le Mot de Passe",
        dispenser_settings_title: "Paramètres du Distributeur",
        dispenser_api_url_label: "URL de l'API du Distributeur:",
        dispenser_timeout_label: "Timeout (secondes):",
        save_settings_button: "Enregistrer les Paramètres",
        // Dashboard Widgets
        calculator_title: "Calculateur de Monnaie",
        customer_account_label: "Compte client (€):",
        money_received_label: "Argent Reçu (€):",
        calculate_change_button: "Calculer la Monnaie",
        dispense_change_button: "Distribuer la Monnaie",
        voice_control_title: "Contrôle Vocal",
        record_voice_button: "Enregistrer la voix",
        stop_button: "Arrêter",
        interactions_history_title: "Historique des Interactions",
        interactions_history_desc: "Consultez l'historique complet de toutes les transactions enregistrées dans le système.",
        view_full_history_button: "Voir l'Historique Complet",
        // Interactions Page
        interactions_history_page_title: "Historique des Interactions",
        all_transactions_title: "Toutes les Transactions",
        loading_interactions_message: "Chargement des interactions...",
    }
};

const translatePage = (lang) => {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        let translation = translations[lang]?.[key] || translations['es']?.[key];

        if (translation) {
            const name = authService.getCurrentUser()?.name;
            if (name && translation.includes('{name}')) {
                translation = translation.replace('{name}', name);
            }
            element.textContent = translation;
        }
    });
    document.documentElement.lang = lang;
};

// =================================================================================
// Contenido de script.js
// =================================================================================

function initComponents() {
  initAuthControls();
  initCalculator();
  initVoiceRecognition();
  initDispenser();

  // La traducción se llama aquí, después de que todo se inicializa
  const currentLanguage = localStorage.getItem('language') || 'es';
  translatePage(currentLanguage);
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


// =================================================================================
// Lógica combinada de DOMContentLoaded
// =================================================================================
document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica de settings.js ---
    const themeSwitch = document.getElementById('theme-switch');
    const languageSelect = document.getElementById('language');

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeSwitch) {
            themeSwitch.checked = theme === 'dark';
        }
    };

    const setLanguage = (lang) => {
        localStorage.setItem('language', lang);
        translatePage(lang);
    };

    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    if (themeSwitch) {
        themeSwitch.addEventListener('change', (e) => {
            setTheme(e.target.checked ? 'dark' : 'light');
        });
    }

    if (languageSelect) {
        const currentLanguage = localStorage.getItem('language') || 'es';
        languageSelect.value = currentLanguage;
        languageSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

    // --- Lógica de script.js ---
    // Esto es para la página principal (index.html)
    if (document.querySelector('.dashboard-grid')) {
        authService.isAuthenticated().then(isAuthenticated => {
            if (!isAuthenticated) {
                window.location.href = '/login';
                return;
            }
            initComponents();
        });
    } else {
        // Para otras páginas como settings.html, solo traducimos
        const currentLanguage = localStorage.getItem('language') || 'es';
        translatePage(currentLanguage);
    }
});
