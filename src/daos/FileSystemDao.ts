import { IDao } from '../interfaces/daos/IDao';
import { Producto } from '../producto';
import fs from 'fs';
import { Mensaje } from '../mensaje';

export class FileSystemDao implements IDao {
  productos: Array<Producto>;
  carrito: Array<Producto>;
  private cartId: number;
  private static cartCount: number = 1;
  private cartTimestamp: Number;
  constructor() {
    this.productos = new Array<Producto>();
    this.carrito = new Array<Producto>();
    this.cartId = FileSystemDao.cartCount;
    FileSystemDao.cartCount++;
    this.cartTimestamp = Date.now();
  }
  closeConnection(): void {
    throw new Error('Method not implemented.');
  }
  getMessagesSync(): Mensaje[] {
    throw new Error('Method not implemented.');
  }
  filterByName(filtro: any): void {
    throw new Error('Method not implemented.');
  }
  filterByPrice(min: any, max: any): void {
    throw new Error('Method not implemented.');
  }
  getProductsFiltered(): void {
    throw new Error('Method not implemented.');
  }
  insertMessage(message: Mensaje): void {
    throw new Error('Method not implemented.');
  }
  getMessages(): Promise<Mensaje[]> {
    throw new Error('Method not implemented.');
  }

  private pathProductos: string = './DbFileSystem/productos.txt';
  private pathCarrito: string = './DbFileSystem/carrito.txt';

  private getNewId() {
    const maxId: number = Math.max(
      ...this.productos.map(product => Number(product._id)),
      0
    );
    const newId: number = maxId + 1;
    return newId;
  }

  async insertProduct(product: Producto) {
    product.timestamp = new Date();
    product._id = String(this.getNewId());
    this.productos.push(product);

    try {
      const productsFromTxt = fs.readFileSync(this.pathProductos, 'utf-8');
      const parsProductsFromTxt = JSON.parse(productsFromTxt);
      const productsNew = [...parsProductsFromTxt, product];
      fs.writeFileSync(
        this.pathProductos,
        JSON.stringify(productsNew, null, '\t')
      );
      console.log('Producto agregado!');
    } catch (error) {
      fs.writeFileSync(
        this.pathProductos,
        JSON.stringify(this.productos, null, '\t')
      );
      console.log('Producto agregado!');
    }
  }

  async getProducts(): Promise<Producto[]> {
    fs.readFile(this.pathProductos, 'utf-8', (error, content) => {
      if (error) {
        console.log('Hubo un error con el readFile de getProducts');
      } else {
        this.productos = [];
        const savedProducts = JSON.parse(content);
        savedProducts.forEach((producto: Producto) => {
          this.productos.push(producto);
        });
      }
    });

    return this.productos;
  }

  updateProduct(newProduct: Producto, id: any): void {
    let index = this.productos.findIndex(element => element._id == id);
    const productToBeUpdated = this.productos[index];
    const productUpdated = Object.assign(productToBeUpdated, newProduct);
    this.productos[index] = productUpdated;
    fs.writeFileSync(
      this.pathProductos,
      JSON.stringify(this.productos, null, '\t')
    );
  }

  deleteProduct(id: any) {
    let index = this.productos.findIndex(element => element._id == id);
    if (index != -1) {
      this.productos.splice(index, 1);
    }
    fs.writeFileSync(
      this.pathProductos,
      JSON.stringify(this.productos, null, '\t')
    );
  }

  getProductByIdSync(id: any) {
    const product = this.productos.find(producto => producto._id == id);
    return product;
  }

  addToCart(product: any) {
    this.carrito.push(product);
    try {
      const productsFromTxt = fs.readFileSync(this.pathCarrito, 'utf-8');
      const parsProductsFromTxt = JSON.parse(productsFromTxt);
      const productsNew = [...parsProductsFromTxt, product];
      fs.writeFileSync(
        this.pathCarrito,
        JSON.stringify(productsNew, null, '\t')
      );
    } catch (error) {
      fs.writeFileSync(
        this.pathCarrito,
        JSON.stringify(this.carrito, null, '\t')
      );
    }
  }

  async getCartProducts(): Promise<Producto[]> {
    fs.readFile(this.pathCarrito, 'utf-8', (error, content) => {
      if (error) {
        console.error('getCartProducts: El carrito esta vacio');
      } else {
        this.carrito = [];
        const savedProducts = JSON.parse(content);
        savedProducts.forEach((producto: Producto) => {
          this.carrito.push(producto);
        });
      }
    });
    return this.carrito;
  }

  public getCartId() {
    return this.cartId;
  }

  public getCartTimestamp() {
    return this.cartTimestamp;
  }

  getCartProductByIdSync(id: any) {
    const product = this.carrito.find(element => element._id == id);
    return product;
  }

  deleteProductCart(id: any) {
    let index = this.carrito.findIndex(element => element._id == id);
    if (index != -1) {
      this.carrito.splice(index, 1);
    }
    fs.writeFileSync(
      this.pathCarrito,
      JSON.stringify(this.carrito, null, '\t')
    );
  }

  getCartProductById(id: any): Promise<Producto[]> {
    throw new Error('Method not implemented.');
  }

  getProductById(id: any): Promise<Producto[]> {
    throw new Error('Method not implemented.');
  }
  getProductsSync(): Producto[] {
    throw new Error('Method not implemented.');
  }

  getCartProductsSync() {
    throw new Error('Method not implemented.');
  }
}
