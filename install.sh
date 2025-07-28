#!/bin/bash

# Actualizar el sistema
sudo apt-get update
sudo apt-get upgrade -y

# Instalar MySQL Server y python3-venv
sudo apt-get install -y mysql-server python3-venv

# Crear un entorno virtual
python3 -m venv venv

# Activar el entorno virtual
source venv/bin/activate

# Instalar dependencias de Python
pip install --upgrade pip
pip install -r requirements.txt

# Verificar la instalación
echo "Verificando la instalación de las dependencias..."
python -c "import flask"
if [ $? -eq 0 ]; then
    echo "Las dependencias se han instalado correctamente."
else
    echo "Error: No se pudo importar la librería 'flask'. Por favor, revisa la instalación."
    exit 1
fi

echo "Instalación completada."
echo "Recuerda configurar la base de datos MySQL con el usuario 'usuario' y la contraseña 'usuario'."
echo "Puedes hacerlo con los siguientes comandos:"
echo "sudo mysql -e \"CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'usuario';\""
echo "sudo mysql -e \"GRANT ALL PRIVILEGES ON once.* TO 'usuario'@'localhost';\""
echo "sudo mysql -e \"FLUSH PRIVILEGES;\""
echo ""
echo "Para activar el entorno virtual, usa el comando:"
echo "source venv/bin/activate"
