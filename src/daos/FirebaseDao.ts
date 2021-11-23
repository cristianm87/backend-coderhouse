import { IDao } from '../interfaces/daos/IDao';
import { Mensaje } from '../mensaje';
import { Producto } from '../producto';
const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    './DbFirebase/proyecto-back-ca329-firebase-adminsdk-n8ijy-e1f0e749ea.json'
  ),
  databaseURL: 'http://proyecto-back-ca329.firebaseio.com',
});

export class FirebaseDao implements IDao {
  productos: Array<Producto>;
  carrito: Array<Producto>;
  private cartId: number;
  private static cartCount: number = 1;
  private cartTimestamp: Number;

  constructor() {
    this.productos = new Array<Producto>();
    this.carrito = new Array<Producto>();
    this.cartId = FirebaseDao.cartCount;
    FirebaseDao.cartCount++;
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

  async insertProduct(product: Producto) {
    const firestoreAdmin = firebaseAdmin.firestore();
    const collection = firestoreAdmin.collection('productos');
    try {
      await collection.doc().set({
        ...product,
        timestamp: Date.now(),
      });
      console.log('insertProduct: Producto agregado!');
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts(): Promise<Producto[]> {
    const firestoreAdmin = firebaseAdmin.firestore();
    const collection = firestoreAdmin.collection('productos');

    const queryGet = await collection.get();
    const response = queryGet.docs.map((doc: any) => {
      const data = doc.data();

      return {
        _id: doc.id,
        timestamp: data.timestamp,
        name: data.name,
        description: data.description,
        code: data.code,
        thumbnail: data.thumbnail,
        price: data.price,
        stock: data.stock,
      };
    });
    return response;
  }

  async updateProduct(newProduct: Producto, id: any) {
    const firestoreAdmin = firebaseAdmin.firestore();
    const collection = firestoreAdmin.collection('productos');

    await collection.doc(id).update({
      timestamp: Date.now(),
      name: newProduct.name,
      description: newProduct.description,
      code: newProduct.code,
      thumbnail: newProduct.thumbnail,
      price: newProduct.price,
      stock: newProduct.stock,
    });
  }

  async getProductById(id: any): Promise<Producto[]> {
    const firestoreAdmin = firebaseAdmin.firestore();
    const collection = firestoreAdmin.collection('productos');
    let product: any = {};
    try {
      const doc = await collection.doc(id).get();
      const data = doc.data();
      product = {
        _id: doc.id,
        timestamp: data.timestamp,
        name: data.name,
        description: data.description,
        code: data.code,
        price: data.price,
        thumbnail: data.thumbnail,
        stock: data.stock,
      };
    } catch (error) {
      console.error('Producto no encontrado');
    }

    return product;
  }

  async deleteProduct(id: any) {
    const firestoreAdmin = firebaseAdmin.firestore();
    const collection = firestoreAdmin.collection('productos');

    await collection.doc(id).delete();
  }

  async addToCart(product: any) {
    const firestoreAdmin = firebaseAdmin.firestore();
    const collection = firestoreAdmin.collection('carrito');
    try {
      console.log('addToCart Product', product);
      await collection.doc(product._id).set({
        timestamp: product.timestamp,
        name: product.name,
        description: product.description,
        code: product.code,
        thumbnail: product.thumbnail,
        price: product.price,
        stock: product.stock,
      });
      console.log('addToCart: Producto agregado', product);
    } catch (error) {
      console.log(error);
    }
  }

  async getCartProducts(): Promise<Producto[]> {
    const firestoreAdmin = firebaseAdmin.firestore();
    const collection = firestoreAdmin.collection('carrito');

    const queryGet = await collection.get();
    const response = queryGet.docs.map((doc: any) => {
      const data = doc.data();

      return {
        _id: doc.id,
        timestamp: data.timestamp,
        name: data.name,
        description: data.description,
        code: data.code,
        thumbnail: data.thumbnail,
        price: data.price,
        stock: data.stock,
      };
    });
    return response;
  }

  async getCartProductById(id: any): Promise<Producto[]> {
    const firestoreAdmin = firebaseAdmin.firestore();
    const collection = firestoreAdmin.collection('carrito');
    const doc = await collection.doc(id).get();
    return doc.data();
  }

  async deleteProductCart(id: any) {
    const firestoreAdmin = firebaseAdmin.firestore();
    const collection = firestoreAdmin.collection('carrito');

    await collection.doc(id).delete();
  }

  public getCartId() {
    return this.cartId;
  }

  public getCartTimestamp() {
    return this.cartTimestamp;
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
