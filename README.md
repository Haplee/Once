# Aplicación de Calculadora de Cambio y Reconocimiento de Voz

Esta es una aplicación web del lado del cliente que proporciona una calculadora de cambio y utiliza el reconocimiento de voz del navegador para rellenar los campos.

## Características

*   **Calculadora de Cambio:** Calcula el cambio a devolver basado en un total y el dinero recibido.
*   **Reconocimiento de Voz:** Utiliza la Web Speech API del navegador para reconocer comandos de voz y rellenar automáticamente los campos de "cuenta" y "recibido".
*   **Historial de Interacciones:** Guarda cada cálculo en el `localStorage` del navegador.
*   **Modo Oscuro:** Interfaz con tema claro y oscuro.

## Instalación

No se requiere instalación. Al ser una aplicación puramente de lado del cliente (HTML, CSS, JavaScript), no necesita un backend ni dependencias complicadas.

## Uso

Simplemente abre el archivo `index.html` en tu navegador web.

## Cómo Funciona

*   **Frontend:** HTML, CSS y JavaScript. La lógica de la aplicación se ejecuta completamente en el navegador.
*   **Reconocimiento de Voz:** Integrado a través de la `Web Speech API`, que permite al navegador capturar y transcribir la voz.
*   **Almacenamiento:** El historial de cálculos se guarda en el `localStorage` del navegador, lo que permite persistencia de datos sin necesidad de una base de datos.
*   **Comandos de Voz:** Para rellenar los campos, puedes decir frases como:
    *   "cuenta de 20 y recibido 50"
    *   "cuenta de 15.50 y recibido de 20"
