#!/bin/bash

# Actualizar el sistema
sudo apt-get update
sudo apt-get upgrade -y

# Instalar MySQL Server
sudo apt-get install -y mysql-server

# Instalar dependencias de Python
pip install --upgrade pip
pip install -r requirements.txt

echo "Instalación completada."
echo "Recuerda configurar la base de datos MySQL con el usuario 'usuario' y la contraseña 'usuario'."
echo "Puedes hacerlo con los siguientes comandos:"
echo "sudo mysql -e \"CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'usuario';\""
echo "sudo mysql -e \"GRANT ALL PRIVILEGES ON once.* TO 'usuario'@'localhost';\""
echo "sudo mysql -e \"FLUSH PRIVILEGES;\""
