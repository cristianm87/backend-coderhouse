import { Producto } from '../producto';
import { Mensaje } from '../mensaje';
import { IDao } from '../interfaces/daos/IDao';
import mongoose from 'mongoose';
import { modelProductos } from '../models/modelProducto';
import { modelCarrito } from '../models/modelCarrito';
import { modelMensaje } from '../models/modelMensaje';
export class MongoDbDao implements IDao {
  products: Array<any>;
  carrito: Array<any>;
  productosFiltrados: Array<any>;
  messages: Array<any>;
  private cartId: number;
  private static cartCount: number = 1;
  private cartTimestamp: Number;

  constructor() {
    (async () => {
      mongoose.connect('mongodb://localhost:27017/ecommerce');
    })();
    this.products = new Array<any>();
    this.carrito = new Array<any>();
    this.productosFiltrados = Array<any>();
    this.messages = Array<Mensaje>();
    this.cartId = MongoDbDao.cartCount;
    MongoDbDao.cartCount++;
    this.cartTimestamp = Date.now();
  }
  async closeConnection() {
    await mongoose.disconnect(() => {});
  }
  getMessagesSync(): Mensaje[] {
    throw new Error('Method not implemented.');
  }

  // PRODUCTO

  async insertProduct(product: Producto) {
    try {
      await modelProductos.insertMany({
        timestamp: Date.now(),
        name: product.name,
        description: product.description,
        code: product.code,
        thumbnail: product.thumbnail,
        price: product.price,
        stock: product.stock,
      });
      console.log('Producto guardado!');
    } catch (error) {
      console.log('insertProduct()', error);
    }
  }

  async getProducts(): Promise<Array<Producto>> {
    try {
      this.products = await modelProductos.find();
    } catch (error) {
      console.error('getProducts()', error);
    } finally {
      return await this.products;
    }
  }

  async updateProduct(newProduct: Producto, id: any) {
    try {
      await modelProductos.updateOne(
        { _id: id },
        {
          $set: {
            name: newProduct.name,
            description: newProduct.description,
            code: newProduct.code,
            thumbnail: newProduct.thumbnail,
            price: newProduct.price,
            stock: newProduct.stock,
          },
        }
      );
    } catch (error) {
      console.error('updateProduct: Producto no encontrado');
    }
  }

  async deleteProduct(id: any) {
    try {
      await modelProductos.deleteOne({ _id: id });
    } catch (error) {
      console.error('deleteProduct: Producto no encontrado');
    }
  }

  async getProductById(id: any): Promise<Array<Producto>> {
    let productById: any = {};
    try {
      productById = await modelProductos.findOne({ _id: id });
    } catch (error) {
      console.error('getProductById: Producto no encontrado');
    }
    return productById;
  }

  // CARRITO

  async addToCart(product: any) {
    // falta manejar error por si se ingresan dos productos con el mismo ID
    try {
      await modelCarrito.insertMany(product);
    } catch (error) {
      console.error('Producto duplicado');
    }
  }

  async getCartProducts(): Promise<Array<Producto>> {
    try {
      const productsFromDb = await modelCarrito.find();
      this.carrito = [];
      for (const product of productsFromDb) {
        this.carrito.push(product);
      }
    } catch (error) {
      console.log(error);
    } finally {
      return this.carrito;
    }
  }

  async deleteProductCart(id: any) {
    try {
      await modelCarrito.deleteOne({ _id: id });
    } catch (error) {
      console.log(error);
    }
  }

  async getCartProductById(id: any): Promise<Producto[]> {
    let cartProductById: any = {};
    try {
      cartProductById = await modelCarrito.findOne({ _id: id });
    } catch (error) {
      console.error('getCartProductById: Producto no encontrado');
    }
    return cartProductById;
  }

  getCartId() {
    return this.cartId;
  }
  getCartTimestamp() {
    return this.cartTimestamp;
  }

  // FILTRAR PRODUCTOS

  async filterByName(filtro: any) {
    const productos = await this.getProducts();
    this.productosFiltrados = productos.filter(
      producto => producto.name == filtro
    );
  }

  async filterByPrice(min: any, max: any) {
    const productos = await this.getProducts();
    this.productosFiltrados = productos.filter(
      producto => producto.price >= min && producto.price <= max
    );
  }

  getProductsFiltered() {
    const productos = this.productosFiltrados;
    if (productos.length < 1) {
      return this.getProducts();
    } else {
      return this.productosFiltrados;
    }
  }

  // MENSAJES

  async insertMessage(message: any) {
    try {
      await modelMensaje.insertMany(message);
      console.log('Mensaje guardado!');
    } catch (error) {
      console.error('insertMessage()', error);
    }
  }

  async getMessages(): Promise<Array<Mensaje>> {
    try {
      const messagesFromDb = await modelMensaje.find();
      // this.messages = messagesFromDb;
      this.messages = [];
      for (const mensaje of messagesFromDb) {
        this.messages.push(mensaje);
      }
    } catch (error) {
      console.error('getMessages()', error);
    } finally {
      return this.messages;
    }
  }

  //

  getProductsCartAsync(): void {
    throw new Error('Method not implemented.');
  }

  getProductsSync(): Producto[] {
    throw new Error('Method not implemented.');
  }
  getProductByIdSync(id: any): void {
    throw new Error('Method not implemented.');
  }
  getCartProductByIdSync(id: any): void {
    throw new Error('Method not implemented.');
  }

  getCartProductsSync(): void {
    throw new Error('Method not implemented.');
  }
}
