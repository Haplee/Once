@echo off
setlocal enabledelayedexpansion

REM --- Configuration ---
set "PYTHON_VERSION=3"
set "VENV_NAME=venv"
set "FFMPEG_URL=https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
set "FFMPEG_ZIP_FILE=ffmpeg.zip"
set "FFMPEG_DIR=%CD%\ffmpeg"

REM --- Helper Functions ---
:check_command
where %1 >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] '%1' command not found. Please install it and make sure it's in your PATH.
    exit /b 1
)
exit /b 0

:download_file
echo [INFO] Downloading %1...
powershell -Command "Invoke-WebRequest -Uri '%1' -OutFile '%2'"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to download %1. Please check your internet connection or the URL.
    exit /b 1
)
exit /b 0

:unzip_file
echo [INFO] Unzipping %1...
powershell -Command "Expand-Archive -Path '%1' -DestinationPath '%2' -Force"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to unzip %1.
    exit /b 1
)
exit /b 0


REM --- Main Script ---
echo ===============================================
echo      Windows Application Installer
echo ===============================================
echo.

REM 1. Check for prerequisites
echo [STEP 1/5] Checking for prerequisites...
call :check_command git
if %errorlevel% neq 0 exit /b 1
call :check_command python
if %errorlevel% neq 0 exit /b 1
echo [SUCCESS] Git and Python are installed.
echo.

REM 2. Download and set up FFmpeg
echo [STEP 2/5] Setting up FFmpeg...
if not exist "%FFMPEG_DIR%" (
    call :download_file "%FFMPEG_URL%" "%FFMPEG_ZIP_FILE%"
    if %errorlevel% neq 0 exit /b 1

    call :unzip_file "%FFMPEG_ZIP_FILE%" "ffmpeg_temp"
    if %errorlevel% neq 0 exit /b 1

    REM Move contents from the extracted subfolder to the main ffmpeg dir
    for /d %%i in (ffmpeg_temp\*) do (
        move "%%i" "%FFMPEG_DIR%"
    )
    rmdir ffmpeg_temp
    del "%FFMPEG_ZIP_FILE%"
    echo [SUCCESS] FFmpeg has been downloaded and extracted.
) else (
    echo [INFO] FFmpeg directory already exists. Skipping download.
)
set "PATH=%FFMPEG_DIR%\bin;%PATH%"
echo [INFO] FFmpeg added to PATH for this session.
echo.

REM 3. Create virtual environment
echo [STEP 3/5] Creating Python virtual environment...
if not exist "%VENV_NAME%" (
    python -m venv %VENV_NAME%
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment.
        exit /b 1
    )
    echo [SUCCESS] Virtual environment created.
) else (
    echo [INFO] Virtual environment already exists.
)
echo.

REM 4. Activate virtual environment and install dependencies
echo [STEP 4/5] Installing Python dependencies...
call "%VENV_NAME%\Scripts\activate.bat"
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies from requirements.txt.
    exit /b 1
)
echo [SUCCESS] Python dependencies installed.
echo.

REM 5. Final instructions
echo [STEP 5/5] Installation Complete!
echo ===============================================
echo.
echo To run the application, use the following commands:
echo.
echo   1. Activate the virtual environment:
echo      ^> %VENV_NAME%\Scripts\activate.bat
echo.
echo   2. Run the application:
echo      ^> python pp.py
echo.
echo ===============================================

endlocal
exit /b 0
