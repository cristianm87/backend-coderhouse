import { Producto } from '../producto';
import { IDao } from '../interfaces/daos/IDao';
import { Mensaje } from '../mensaje';

export class MemoryDao implements IDao {
  productos: Array<Producto>;
  productosFiltrados: Array<Producto>;
  carrito: Array<Producto>;
  mensajes: Array<Mensaje>;
  private count: number;
  private cartId: number;
  private static cartCount: number = 1;
  private cartTimestamp: Number;

  constructor() {
    this.productos = new Array<Producto>();
    this.productosFiltrados = new Array<Producto>();
    this.carrito = new Array<Producto>();
    this.mensajes = new Array<Mensaje>();
    this.count = 0;
    this.cartId = MemoryDao.cartCount;
    MemoryDao.cartCount++;
    this.cartTimestamp = Date.now();
  }
  closeConnection(): void {
    throw new Error('Method not implemented.');
  }

  // PRODUCTOS

  getProductsSync() {
    return this.productos;
  }

  insertProduct(product: Producto) {
    this.productos.push({
      name: product.name,
      description: product.description,
      code: product.code,
      thumbnail: product.thumbnail,
      price: Number(product.price),
      stock: Number(product.stock),
      _id: String(this.count + 1),
      timestamp: new Date(),
    });
    this.count++;
    console.log('Producto agregado!');
    return product;
  }

  updateProduct(newValues: Producto, id: string) {
    let index = this.productos.findIndex(element => (element._id = id));
    const productToBeUpdated = this.productos[index];
    const productUpdated = Object.assign(productToBeUpdated, newValues);
    this.productos[index] = productUpdated;
  }

  deleteProduct(id: string) {
    let index = this.productos.findIndex(product => product._id == id);
    if (index != -1) {
      this.productos.splice(index, 1);
    }
  }

  getProductByIdSync(id: string) {
    const product = this.productos.find(element => element._id == id);
    return product;
  }

  filterByName(filtro: any): void {
    this.productosFiltrados = this.productos.filter(
      producto => producto.name == filtro
    );
  }

  filterByPrice(min: any, max: any) {
    this.productosFiltrados = this.productos.filter(
      producto => producto.price >= min && producto.price <= max
    );
  }

  getProductsFiltered() {
    return this.productosFiltrados;
  }

  // CARRITO

  addToCart(product: Producto) {
    this.carrito.push(product);
  }

  getCartProductsSync() {
    return this.carrito;
  }

  getCartProductByIdSync(id: string) {
    const product = this.carrito.find(element => element._id == id);
    return product;
  }

  public getCartId() {
    return this.cartId;
  }

  public getCartTimestamp() {
    return this.cartTimestamp;
  }

  deleteProductCart(id: string) {
    let index = this.carrito.findIndex(element => element._id == id);
    if (index != -1) {
      this.carrito.splice(index, 1);
    }
  }

  // MENSAJES

  insertMessage(message: Mensaje) {
    this.mensajes.push(message);
    console.log('Mensaje agregado!');
    return this.mensajes;
  }

  getMessagesSync(): Mensaje[] {
    return this.mensajes;
  }

  getMessages(): Promise<Mensaje[]> {
    throw new Error('Method not implemented.');
  }

  getCartProductById(id: any): Promise<Producto[]> {
    throw new Error('Method not implemented.');
  }

  getProductById(id: any): Promise<Producto[]> {
    throw new Error('Method not implemented.');
  }
  getProducts(): Promise<Producto[]> {
    throw new Error('Method not implemented.');
  }

  getCartProducts(): Promise<Producto[]> {
    throw new Error('Method not implemented.');
  }
}
