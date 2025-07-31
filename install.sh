#!/bin/bash

echo "==============================================="
echo "      Linux/macOS Application Installer"
echo "==============================================="
echo ""

# --- System Package Manager Detection ---
if [[ -x "$(command -v apt-get)" ]]; then
    PKG_MANAGER="apt-get"
    UPDATE_CMD="sudo apt-get update"
    INSTALL_CMD="sudo apt-get install -y"
elif [[ -x "$(command -v dnf)" ]]; then
    PKG_MANAGER="dnf"
    UPDATE_CMD="sudo dnf check-update"
    INSTALL_CMD="sudo dnf install -y"
elif [[ -x "$(command -v yum)" ]]; then
    PKG_MANAGER="yum"
    UPDATE_CMD="sudo yum check-update"
    INSTALL_CMD="sudo yum install -y"
elif [[ -x "$(command -v pacman)" ]]; then
    PKG_MANAGER="pacman"
    UPDATE_CMD="sudo pacman -Syu"
    INSTALL_CMD="sudo pacman -S --noconfirm"
elif [[ -x "$(command -v brew)" ]]; then
    PKG_MANAGER="brew"
    UPDATE_CMD="brew update"
    INSTALL_CMD="brew install"
else
    echo "[ERROR] No supported package manager found (apt-get, dnf, yum, pacman, brew)."
    echo "Please install 'ffmpeg' manually before proceeding."
fi

# 1. Update system and install ffmpeg
echo "[STEP 1/3] Updating system and installing ffmpeg..."
if [[ -n "$PKG_MANAGER" ]]; then
    $UPDATE_CMD
    $INSTALL_CMD ffmpeg
    if [[ $? -ne 0 ]]; then
        echo "[ERROR] Failed to install ffmpeg. Please install it manually."
        exit 1
    fi
    echo "[SUCCESS] ffmpeg installed."
else
    # If no package manager, check if ffmpeg is already installed
    if ! command -v ffmpeg &> /dev/null; then
        echo "[WARNING] Could not install ffmpeg automatically."
        echo "Please install ffmpeg manually and re-run this script."
        exit 1
    else
        echo "[INFO] ffmpeg is already installed."
    fi
fi
echo ""

# 2. Create virtual environment
echo "[STEP 2/3] Creating Python virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    if [[ $? -ne 0 ]]; then
        echo "[ERROR] Failed to create virtual environment."
        exit 1
    fi
    echo "[SUCCESS] Virtual environment created."
else
    echo "[INFO] Virtual environment already exists."
fi
echo ""

# 3. Activate virtual environment and install dependencies
echo "[STEP 3/3] Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt
if [[ $? -ne 0 ]]; then
    echo "[ERROR] Failed to install dependencies from requirements.txt."
    exit 1
fi
echo "[SUCCESS] Python dependencies installed."
echo ""

echo "==============================================="
echo "      Installation Complete!"
echo "==============================================="
echo ""
echo "To run the application, use the following commands:"
echo ""
echo "  1. Activate the virtual environment:"
echo "     $ source venv/bin/activate"
echo ""
echo "  2. Run the application:"
echo "     $ python3 pp.py"
echo ""
echo "==============================================="
