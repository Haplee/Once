import asyncio
from playwright.async_api import async_playwright, expect
import pathlib

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # 1. Navegar a la página de login a través del servidor HTTP
        login_page_url = "http://localhost:5000/login"
        await page.goto(login_page_url)

        # 2. Realizar el login con las credenciales correctas
        await page.get_by_label("Usuario:").fill("user")
        await page.get_by_label("Contraseña:").fill("password")
        await page.get_by_role("button", name="Acceder").click()

        # 3. Esperar a que el dashboard cargue y verificar la URL y el título
        await expect(page).to_have_url("http://localhost:5000/")
        await expect(page).to_have_title("Dashboard - Intranet")
        await expect(page.get_by_role("heading", name="Dashboard Principal")).to_be_visible()

        # 4. Usar la calculadora
        await page.get_by_label("Cuenta del cliente (€):").fill("10.50")
        await page.get_by_label("Dinero Recibido (€):").fill("20")
        await page.get_by_role("button", name="Calcular Cambio").click()

        # 5. Verificar que el cambio es correcto y el botón de dispensar aparece
        change_message = page.locator("#mensaje")
        await expect(change_message).to_contain_text("El cambio es: 9.50 euros.")

        dispense_btn = page.get_by_role("button", name="Dispensar Cambio")
        await expect(dispense_btn).to_be_visible()

        # 6. Hacer clic en el botón de dispensar
        await dispense_btn.click()

        # 7. Verificar el mensaje de éxito del dispensador
        await expect(change_message).to_contain_text("Orden para dispensar 9.50 euros procesada.")

        # 8. Tomar el screenshot
        screenshot_path = "jules-scratch/verification/verification.png"
        await page.screenshot(path=screenshot_path)
        print(f"Screenshot guardado en: {screenshot_path}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
