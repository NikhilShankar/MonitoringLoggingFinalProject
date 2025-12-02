from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    category: str
    price: float
    stock: int

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True
