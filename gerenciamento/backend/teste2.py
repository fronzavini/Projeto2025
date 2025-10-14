import pymysql.cursors

def connect_and_query():
    connection = None  # Initialize connection to None
    try:
        # Establish a connection to the MySQL database
        connection = pymysql.connect(host='localhost',
                                     user='root',
                                     password='root',
                                     database='bd_belladonna',
                                     cursorclass=pymysql.cursors.DictCursor) # Use DictCursor to get results as dictionaries

        print("Connection established successfully!")
    except pymysql.Error as e:
        print(f"Error connecting to MySQL: {e}")
    finally:
        if connection:
            connection.close()
            print("\nConnection closed.")

if __name__ == "__main__":
    connect_and_query()