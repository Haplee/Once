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
