document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const languageSelect = document.getElementById('language');

    // --- Gestión del Tema (Modo Oscuro) ---
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeSwitch) {
        themeSwitch.checked = currentTheme === 'dark';
    }

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeSwitch) {
            themeSwitch.checked = theme === 'dark';
        }
    };

    if (themeSwitch) {
        themeSwitch.addEventListener('change', (e) => {
            setTheme(e.target.checked ? 'dark' : 'light');
        });
    }

    // --- Gestión del Idioma ---
    const currentLanguage = localStorage.getItem('language') || 'es';
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }

    const setLanguage = (lang) => {
        localStorage.setItem('language', lang);
        if (window.translatePage) {
            window.translatePage(lang);
        }
    };

    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

    // Aplicar idioma al cargar cualquier página
    if (window.translatePage) {
        window.translatePage(currentLanguage);
    }

    // Aplicar tema al cargar cualquier página, no solo la de configuración
    if (!themeSwitch) { // Si no estamos en la página de settings
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }
});
