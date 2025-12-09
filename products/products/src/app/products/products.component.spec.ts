import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductsComponent } from './products.component';
import { ProductService } from './product.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: ProductService;

  const mockProducts = [
    { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics', stock: 10 },
    { id: 2, name: 'Smart Watch', price: 299.99, category: 'Electronics', stock: 8 },
    { id: 3, name: 'Desk Chair', price: 199.99, category: 'Furniture', stock: 20 },
    { id: 4, name: 'Coffee Maker', price: 79.99, category: 'Appliances', stock: 15 },
    { id: 5, name: 'Backpack', price: 49.99, category: 'Accessories', stock: 50 },
    { id: 6, name: 'Headphones', price: 149.99, category: 'Electronics', stock: 12 }
];


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    spyOn(productService, 'getProducts').and.returnValue(of(mockProducts));
    fixture.detectChanges();
  });

  it('should create the Products component', () => {
    expect(component).toBeTruthy();
  });

  it('should render Products Catalog heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1');
    expect(heading?.textContent).toContain('Products Catalog');
  });

  it('should render the products table', () => {
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();
  });

  it('should render 6 product rows in the table', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(6);
  });

  it('should display Laptop Pro and Smart Watch in the table', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent || '';
    expect(text).toContain('Laptop Pro');
    expect(text).toContain('Smart Watch');
  });
});
