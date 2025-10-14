import mysql.connector
from mysql.connector import Error

try:
    print("1")
    connection = mysql.connector.connect(
        host="localhost",
        database="bd_belladonna",
        user="root",
        password="root",
        connect_timeout=30  # Increased timeout
    )
    print("2")
    if connection.is_connected():
        print("Successfully connected to MySQL database")
    else:
        print("Connection to MySQL database failed")
        # Perform database operations
except Error as e:
    print(f"Error connecting to MySQL: {e}")
finally:
    if 'connection' in locals() and connection.is_connected():
        connection.close()
        print("MySQL connection closed")
    else:
        print("No connection to close")