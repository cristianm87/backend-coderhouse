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
    this.products = new Array<any>();
    this.carrito = new Array<any>();
    this.productosFiltrados = Array<any>();
    this.messages = Array<Mensaje>();
    this.cartId = MongoDbDao.cartCount;
    MongoDbDao.cartCount++;
    this.cartTimestamp = Date.now();
  }

  // mongoose.connect("mongodb://localhost:27017/test", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  // PRODUCTO

  async insertProduct(product: Producto) {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
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
    } finally {
      await mongoose.disconnect(() => {});
    }
  }

  async getProducts(): Promise<Array<Producto>> {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      this.products = await modelProductos.find();
    } catch (error) {
      console.error('getProducts()', error);
    } finally {
      await mongoose.disconnect(() => {});

      return await this.products;
    }
  }

  async updateProduct(newProduct: Producto, id: any) {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
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
    } finally {
      await mongoose.disconnect(() => {});
    }
  }

  async deleteProduct(id: any) {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      await modelProductos.deleteOne({ _id: id });
    } catch (error) {
      console.error('deleteProduct: Producto no encontrado');
    } finally {
      await mongoose.disconnect(() => {});
    }
  }

  async getProductById(id: any): Promise<Array<Producto>> {
    let productById: any = {};
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      productById = await modelProductos.findOne({ _id: id });
    } catch (error) {
      console.error('getProductById: Producto no encontrado');
    } finally {
      await mongoose.disconnect(() => {});
    }
    return productById;
  }

  // CARRITO

  async addToCart(product: any) {
    // falta manejar error por si se ingresan dos productos con el mismo ID
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      await modelCarrito.insertMany(product);
    } catch (error) {
      console.error('Producto duplicado');
    } finally {
      await mongoose.disconnect(() => {});
    }
  }

  async getCartProducts(): Promise<Array<Producto>> {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      const productsFromDb = await modelCarrito.find();
      this.carrito = [];
      for (const product of productsFromDb) {
        this.carrito.push(product);
      }
    } catch (error) {
      console.log(error);
    } finally {
      await mongoose.disconnect(() => {});
      return this.carrito;
    }
  }

  async deleteProductCart(id: any) {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      await modelCarrito.deleteOne({ _id: id });
    } catch (error) {
      console.log(error);
    } finally {
      await mongoose.disconnect(() => {});
    }
  }

  async getCartProductById(id: any): Promise<Producto[]> {
    let cartProductById: any = {};
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      cartProductById = await modelCarrito.findOne({ _id: id });
    } catch (error) {
      console.error('getCartProductById: Producto no encontrado');
    } finally {
      await mongoose.disconnect(() => {});
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
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      await modelMensaje.insertMany(message);
      console.log('Mensaje guardado!');
    } catch (error) {
      console.error('insertMessage()', error);
    } finally {
      await mongoose.disconnect(() => {});
    }
  }

  async getMessages(): Promise<Array<Mensaje>> {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      const messagesFromDb = await modelMensaje.find();
      // this.messages = messagesFromDb;
      this.messages = [];
      for (const mensaje of messagesFromDb) {
        this.messages.push(mensaje);
      }
    } catch (error) {
      console.error('getMessages()', error);
    } finally {
      await mongoose.disconnect(() => {});
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
