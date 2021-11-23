import { Producto } from '../producto';
import { IDao } from '../interfaces/daos/IDao';
import mongoose from 'mongoose';
import { modelProductos } from '../models/modelProducto';
import { modelCarrito } from '../models/modelCarrito';
import { Mensaje } from '../mensaje';
import { modelMensaje } from '../models/modelMensaje';

export class MongoDbDbaasDao implements IDao {
  products: Array<any>;
  carrito: Array<any>;
  productosFiltrados: Array<any>;
  messages: Array<any>;
  private cartId: number;
  private static cartCount: number = 1;
  private cartTimestamp: Number;

  constructor() {
    (async () => {
      await mongoose.connect(
        'mongodb+srv://cristian:DhzAVteV3X-C.VC@cluster0.a5nrm.mongodb.net/ecommerce?retryWrites=true&w=majority'
      );
    })();

    this.products = new Array<any>();
    this.carrito = new Array<any>();
    this.productosFiltrados = Array<any>();
    this.messages = Array<Mensaje>();
    this.cartId = MongoDbDbaasDao.cartCount;
    MongoDbDbaasDao.cartCount++;
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
      console.log(error);
    }
  }

  async getProducts(): Promise<Array<Producto>> {
    try {
      const productsFromDb = await modelProductos.find();
      this.products = [];
      for (const product of productsFromDb) {
        this.products.push(product);
      }
    } catch (error) {
      console.log(error);
    } finally {
      return this.products;
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
    return this.productosFiltrados;
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
