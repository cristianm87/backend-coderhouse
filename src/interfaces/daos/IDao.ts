import { Producto } from '../../producto';

export interface IDao {
  insertProduct(product: Producto): void;
  getProducts(): Promise<Array<Producto>>;
  getProductsSync(): Array<Producto>;
  updateProduct(newProduct: Producto, id: any): void;
  deleteProduct(id: any): void;
  getProductByIdSync(id: any): void;
  getProductById(id: any): Promise<Array<Producto>>;
  getCartProductById(id: any): Promise<Array<Producto>>;
  getCartProductByIdSync(id: any): void;
  addToCart(product: any): void; // cambiar any por correcto
  getCartProducts(): Promise<Array<Producto>>;
  getCartProductsSync(): void;
  getCartId(): void;
  getCartTimestamp(): void;
  deleteProductCart(id: any): void;
}
