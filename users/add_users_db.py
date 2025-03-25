import csv
import hashlib
import mysql.connector
from mysql.connector import Error
import os

# Configuración de la base de datos
db_config = {
    'host': 'localhost',           # Cambia por tu host si no es local
    'user': 'root',                # Cambia por tu usuario de MySQL
    'password': 'root',            # Cambia por tu contraseña de MySQL
    'database': 'once'             # Asegúrate de que la base de datos 'once' exista
}

# Función para encriptar las contraseñas
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Crear la tabla si no existe
def create_table():
    try:
        cnx = mysql.connector.connect(**db_config)
        cursor = cnx.cursor()
        # Crear la tabla 'users' si no existe
        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            nombre VARCHAR(100),
            apellidos VARCHAR(100),
            dni VARCHAR(20) UNIQUE,
            fecha_alta DATE,
            fecha_baja DATE,
            INDEX (username)
        );
        """
        cursor.execute(create_table_query)
        cnx.commit()
        cursor.close()
        cnx.close()
        print("Tabla 'users' asegurada o creada.")
    except Error as err:
        print(f"Error al crear la tabla: {err}")

# Función para agregar un usuario a la base de datos
def add_user(username: str, password: str, nombre: str, apellidos: str, dni: str, fecha_alta: str, fecha_baja: str = None) -> None:
    try:
        cnx = mysql.connector.connect(**db_config)
        cursor = cnx.cursor()
        # Hash de la contraseña
        hashed_password = hash_password(password)
        
        # Si las fechas están vacías, se convierten en None
        fecha_alta = fecha_alta if fecha_alta.strip() != "" else None
        fecha_baja = fecha_baja if fecha_baja and fecha_baja.strip() != "" else None
        
        # Insertar datos en la tabla 'users'
        query = """INSERT INTO users (username, password, nombre, apellidos, dni, fecha_alta, fecha_baja)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (username, hashed_password, nombre, apellidos, dni, fecha_alta, fecha_baja))
        cnx.commit()
        cursor.close()
        cnx.close()
        print(f"Usuario {username} agregado exitosamente.")
    except Error as err:
        print(f"Error al agregar el usuario {username}: {err}")

# Función para leer el archivo CSV y agregar usuarios
def cargar_usuarios_csv(csv_file_path: str):
    try:
        if not os.path.exists(csv_file_path):
            print(f"El archivo {csv_file_path} no existe.")
            return

        with open(csv_file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.reader(file, delimiter=':')
            # Saltar la cabecera si existe (por ejemplo, si el primer campo es 'usuario')
            first_line = True
            for row in csv_reader:
                if first_line:
                    if row and row[0].lower() == "usuario":
                        first_line = False
                        continue
                    first_line = False
                if len(row) == 7:  # Asegurarse de que haya 7 columnas en cada fila
                    username, password, nombre, apellidos, dni, fecha_alta, fecha_baja = row
                    add_user(username, password, nombre, apellidos, dni, fecha_alta, fecha_baja)
                else:
                    print(f"Fila malformada en CSV: {row}")
    except Exception as e:
        print(f"Error al leer el archivo CSV: {e}")

# Llamadas al proceso
def main():
    create_table()  # Asegura que la tabla exista
    cargar_usuarios_csv('users/users.csv')  # Carga los usuarios desde el archivo CSV

# Ejecutar el proceso
if __name__ == "__main__":
    main()
