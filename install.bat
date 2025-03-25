@echo off
:: ------------------------------
:: Verificar si el script se ejecuta con privilegios de administrador
:: ------------------------------
openfiles >nul 2>&1
if %errorlevel% neq 0 (
    echo No tienes permisos de administrador.
    echo ¿Quieres ejecutarlo como administrador? (S/N)
    set /p admin_choice=
    if /I "%admin_choice%" EQU "S" (
        powershell -Command "Start-Process cmd -ArgumentList '/c %~fnx0' -Verb RunAs"
        exit
    ) else (
        echo Ejecutando sin privilegios de administrador...
    )
)

:: ------------------------------
:: Detectar la arquitectura del sistema
:: ------------------------------
set "sysArch=%PROCESSOR_ARCHITECTURE%"
echo Arquitectura del sistema: %sysArch%

:: ------------------------------
:: Verificar si Python está instalado
:: ------------------------------
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo Python no encontrado. Instalando Python...
    winget install Python.Python -e --silent
    setx PATH "%PATH%;C:\Users\%USERNAME%\AppData\Local\Microsoft\WindowsApps"
    echo Reinicia la terminal para aplicar cambios en PATH.
) else (
    echo Python ya está instalado.
)

:: ------------------------------
:: Verificar si MySQL está instalado
:: ------------------------------
where mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL no encontrado. Instalando MySQL...
    winget install MySQL.MySQLServer -e --silent
) else (
    echo MySQL ya está instalado.
)

:: ------------------------------
:: Asegurarse de que pip esté instalado y actualizado
:: ------------------------------
python -m ensurepip --default-pip
python -m pip install --upgrade pip

:: ------------------------------
:: Instalar dependencias desde requirements.txt
:: ------------------------------
if exist requirements.txt (
    echo Instalando dependencias desde requirements.txt...
    python -m pip install -r requirements.txt
) else (
    echo Archivo requirements.txt no encontrado. Asegúrate de colocarlo en el directorio correcto.
    exit /b 1
)

:: ------------------------------
:: Verificar la arquitectura del intérprete de Python
:: ------------------------------
for /f "delims=" %%a in ('python -c "import platform; print(platform.architecture()[0])"') do set PYARCH=%%a
echo Arquitectura de Python: %PYARCH%
if "%sysArch%"=="AMD64" (
    if /I not "%PYARCH%"=="64bit" (
        echo Advertencia: El intérprete de Python no es de 64-bit en un sistema 64-bit.
    )
) else (
    if /I not "%PYARCH%"=="32bit" (
        echo Advertencia: El intérprete de Python no es de 32-bit en un sistema 32-bit.
    )
)

:: ------------------------------
:: Compilar el ejecutable con PyInstaller
:: ------------------------------
if exist app.py (
    echo Creando ejecutable con PyInstaller...
    python -m pip install pyinstaller
    pyinstaller --onefile --noconsole app.py
    if exist dist\app.exe (
        echo Ejecutable creado exitosamente en la carpeta "dist".
    ) else (
        echo Error: No se pudo crear el ejecutable.
        exit /b 1
    )
) else (
    echo Archivo app.py no encontrado. No se puede crear el ejecutable.
    exit /b 1
)

:: ------------------------------
:: Iniciar el ejecutable generado
:: ------------------------------
echo Iniciando la aplicación...
start "" dist\app.exe

pause
