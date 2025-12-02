import pymysql
import os

def seed_database():
    conn = pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "8877")),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "rootpassword"),
        database=os.getenv("DB_NAME", "products_db")
    )

    cursor = conn.cursor()

    # Create table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INT PRIMARY KEY,
            name VARCHAR(255),
            category VARCHAR(100),
            price FLOAT,
            stock INT
        )
    """)

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM products")
    count = cursor.fetchone()[0]

    if count > 0:
        print("Products already exist. Skipping seed.")
        cursor.close()
        conn.close()
        return

    # Insert products
    products = [
        (1, "Laptop Pro", "Electronics", 1299.99, 25),
        (2, "Wireless Headphones", "Audio", 199.99, 50),
        (3, "Smart Watch", "Wearables", 349.99, 30),
        (4, "Gaming Mouse", "Accessories", 79.99, 100),
        (5, "4K Monitor", "Electronics", 599.99, 15),
        (6, "Bluetooth Speaker", "Audio", 89.99, 75)
    ]

    cursor.executemany(
        "INSERT INTO products (id, name, category, price, stock) VALUES (%s, %s, %s, %s, %s)",
        products
    )

    conn.commit()
    print(f"Seeded {len(products)} products!")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    seed_database()
