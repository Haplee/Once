/**
 * @file interactions.js
 * @description Lógica para mostrar el historial de interacciones en la página dedicada.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Asegurarse de que el servicio de autenticación está disponible
    if (typeof authService === 'undefined' || !authService.isAuthenticated()) {
        // Redirigir si no está autenticado
        window.location.href = 'login.html';
        return;
    }

    renderInteractionsTable();
});

/**
 * Obtiene las interacciones desde localStorage.
 * @returns {Array} Un array de objetos de interacción.
 */
function getInteractions() {
    const interactionsJSON = localStorage.getItem("interactions");
    // Devuelve un array vacío si no hay nada en localStorage para evitar errores
    return interactionsJSON ? JSON.parse(interactionsJSON) : [];
}

/**
 * Renderiza la tabla de interacciones en el contenedor designado.
 */
function renderInteractionsTable() {
    const container = document.getElementById("interactions-table-container");
    if (!container) {
        console.error("El contenedor para la tabla de interacciones no fue encontrado.");
        return;
    }

    const interactions = getInteractions();

    if (interactions.length === 0) {
        container.innerHTML = "<p>No hay interacciones registradas en el historial.</p>";
        return;
    }

    // Ordenar las interacciones de la más reciente a la más antigua por ID (timestamp)
    interactions.sort((a, b) => b.id - a.id);

    // Crear las filas de la tabla dinámicamente
    const tableRows = interactions.map(interaction => `
        <tr>
            <td>${interaction.id}</td>
            <td>${new Date(interaction.timestamp).toLocaleString('es-ES')}</td>
            <td>${interaction.cuenta.toFixed(2)} €</td>
            <td>${interaction.recibido.toFixed(2)} €</td>
            <td>${interaction.cambio.toFixed(2)} €</td>
        </tr>
    `).join('');

    // Construir la tabla completa
    container.innerHTML = `
        <table class="table" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">ID Transacción</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Fecha y Hora</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Cuenta</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Recibido</th>
                    <th style-="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Cambio</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
}
