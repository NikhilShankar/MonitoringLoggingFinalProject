from database import SessionLocal, engine, Base
from models import Product

def seed_products():
    db = SessionLocal()

    # Check if products already exist
    if db.query(Product).count() > 0:
        print("Products already exist in database. Skipping seed.")
        db.close()
        return

    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    # Products from the hardcoded HTML
    products = [
        Product(id=1, name="Laptop Pro", category="Electronics", price=1299.99, stock=25),
        Product(id=2, name="Wireless Headphones", category="Audio", price=199.99, stock=50),
        Product(id=3, name="Smart Watch", category="Wearables", price=349.99, stock=30),
        Product(id=4, name="Gaming Mouse", category="Accessories", price=79.99, stock=100),
        Product(id=5, name="4K Monitor", category="Electronics", price=599.99, stock=15),
        Product(id=6, name="Bluetooth Speaker", category="Audio", price=89.99, stock=75)
    ]

    db.add_all(products)
    db.commit()
    print(f"Successfully seeded {len(products)} products!")
    db.close()

if __name__ == "__main__":
    seed_products()
