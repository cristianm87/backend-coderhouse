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
  private cartId: number;
  private static cartCount: number = 1;
  private cartTimestamp: Number;

  constructor() {
    this.products = new Array<any>();
    this.carrito = new Array<any>();
    this.cartId = MongoDbDbaasDao.cartCount;
    MongoDbDbaasDao.cartCount++;
    this.cartTimestamp = Date.now();
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

  // PRODUCTO

  async insertProduct(product: Producto) {
    try {
      await mongoose.connect(
        'mongodb+srv://cristian:DhzAVteV3X-C.VC@cluster0.a5nrm.mongodb.net/ecommerce?retryWrites=true&w=majority'
      );
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
    } finally {
      await mongoose.disconnect(() => {});
    }
  }

  async getProducts(): Promise<Array<Producto>> {
    try {
      await mongoose.connect(
        'mongodb+srv://cristian:DhzAVteV3X-C.VC@cluster0.a5nrm.mongodb.net/ecommerce?retryWrites=true&w=majority'
      );
      const productsFromDb = await modelProductos.find();
      this.products = [];
      for (const product of productsFromDb) {
        this.products.push(product);
      }
    } catch (error) {
      console.log(error);
    } finally {
      await mongoose.disconnect(() => {});

      return this.products;
    }
  }

  async updateProduct(newProduct: Producto, id: any) {
    try {
      await mongoose.connect(
        'mongodb+srv://cristian:DhzAVteV3X-C.VC@cluster0.a5nrm.mongodb.net/ecommerce?retryWrites=true&w=majority'
      );
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
      await mongoose.connect(
        'mongodb+srv://cristian:DhzAVteV3X-C.VC@cluster0.a5nrm.mongodb.net/ecommerce?retryWrites=true&w=majority'
      );
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
      await mongoose.connect(
        'mongodb+srv://cristian:DhzAVteV3X-C.VC@cluster0.a5nrm.mongodb.net/ecommerce?retryWrites=true&w=majority'
      );
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
      await mongoose.connect(
        'mongodb+srv://cristian:DhzAVteV3X-C.VC@cluster0.a5nrm.mongodb.net/ecommerce?retryWrites=true&w=majority'
      );
      await modelCarrito.insertMany(product);
    } catch (error) {
      console.error('Producto duplicado');
    } finally {
      await mongoose.disconnect(() => {});
    }
  }

  async getCartProducts(): Promise<Array<Producto>> {
    try {
      await mongoose.connect(
        'mongodb+srv://cristian:DhzAVteV3X-C.VC@cluster0.a5nrm.mongodb.net/ecommerce?retryWrites=true&w=majority'
      );
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
      await mongoose.connect(
        'mongodb+srv://cristian:DhzAVteV3X-C.VC@cluster0.a5nrm.mongodb.net/ecommerce?retryWrites=true&w=majority'
      );
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
      await mongoose.connect(
        'mongodb+srv://cristian:DhzAVteV3X-C.VC@cluster0.a5nrm.mongodb.net/ecommerce?retryWrites=true&w=majority'
      );
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
