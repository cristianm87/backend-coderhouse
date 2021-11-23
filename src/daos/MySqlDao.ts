import { IDao } from '../interfaces/daos/IDao';
import { Producto } from '../producto';
import knex from 'knex';
import { Mensaje } from '../mensaje';

const options_mariaDB = {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'ecommerce',
  },
};

export class MySqlDao implements IDao {
  productos: Array<Producto>;
  carrito: Array<Producto>;
  private cartId: number;
  private static cartCount: number = 1;
  private cartTimestamp: Number;
  constructor() {
    this.createTableProductos();
    this.productos = new Array<Producto>();
    this.carrito = new Array<Producto>();
    this.cartId = MySqlDao.cartCount;
    MySqlDao.cartCount++;
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

  // PRODUCTOS

  private createTableProductos = async () => {
    const knexEcommerce = knex(options_mariaDB);
    try {
      const tableName = 'productos';
      if (await knexEcommerce.schema.hasTable(tableName)) {
        console.log(`La tabla ${tableName} ya existe!`);
        return;
      } else {
        await knexEcommerce.schema.createTable(tableName, table => {
          table.increments('_id').primary();
          table.bigInteger('timestamp').notNullable();
          table.string('name', 25).notNullable();
          table.string('description', 50).notNullable();
          table.string('code', 12).notNullable();
          table.string('thumbnail', 50).defaultTo('pending');
          table.float('price').defaultTo(0);
          table.integer('stock').defaultTo(0);
        });
        console.log(`La tabla ${tableName} fue creada!`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      await knexEcommerce.destroy();
    }
  };

  async insertProduct(product: Producto) {
    const knexEcommerce = knex(options_mariaDB);
    try {
      await knexEcommerce('productos').insert([
        {
          timestamp: Date.now(),
          name: product.name,
          description: product.description,
          code: product.code,
          thumbnail: product.thumbnail,
          price: product.price,
          stock: product.stock,
        },
      ]);
      console.log('Producto agregado!');
    } catch (error) {
      console.log(error);
    } finally {
      await knexEcommerce.destroy();
    }
  }

  async getProducts(): Promise<Array<Producto>> {
    const knexEcommerce = knex(options_mariaDB);
    try {
      const productsFromDb = await knexEcommerce.from('productos').select('*');
      this.productos = [];
      for (const product of productsFromDb) {
        this.productos.push(product);
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await knexEcommerce.destroy();
      return this.productos;
    }
  }

  async updateProduct(newProduct: Producto, id: any) {
    const knexEcommerce = knex(options_mariaDB);

    try {
      await knexEcommerce
        .from('productos')
        .where('_id', id)
        .update('name', newProduct.name)
        .update('description', newProduct.description)
        .update('code', newProduct.code)
        .update('thumbnail', newProduct.thumbnail)
        .update('price', newProduct.price)
        .update('stock', newProduct.stock);
      console.log('Producto actualizado!');
    } catch (error) {
      console.log(error);
    } finally {
      await knexEcommerce.destroy();
    }
  }

  async getProductById(id: any): Promise<Array<Producto>> {
    const knexEcommerce = knex(options_mariaDB);
    let productById: any = {};
    try {
      const productFromDb = await knexEcommerce
        .select('*')
        .limit(1)
        .from('productos')
        .where('_id', id);
      productById = {
        _id: productFromDb[0]._id,
        timestamp: productFromDb[0].timestamp,
        name: productFromDb[0].name,
        description: productFromDb[0].description,
        code: productFromDb[0].code,
        thumbnail: productFromDb[0].thumbnail,
        price: productFromDb[0].price,
        stock: productFromDb[0].stock,
      };
    } catch (error) {
      console.error('getProductById: Producto no encontrado');
    } finally {
      await knexEcommerce.destroy();
      console.log('getProductById', productById);
      return productById;
    }
  }

  async deleteProduct(id: any) {
    const knexEcommerce = knex(options_mariaDB);
    try {
      await knexEcommerce.from('productos').where('_id', id).del();
      console.log('Producto eliminado!');
    } catch (error) {
      console.log(error);
    } finally {
      await knexEcommerce.destroy();
    }
  }

  // CARRITO
  private createTableCarrito = async () => {
    const knexEcommerce = knex(options_mariaDB);
    try {
      const tableName = 'carrito';
      if (await knexEcommerce.schema.hasTable(tableName)) {
        console.log(`La tabla ${tableName} ya existe!`);
        return;
      } else {
        await knexEcommerce.schema.createTable(tableName, table => {
          table.increments('_id').primary();
          table.bigInteger('timestamp').notNullable();
          table.string('name', 25).notNullable();
          table.string('description', 50).notNullable();
          table.string('code', 12).notNullable();
          table.string('thumbnail', 50).notNullable();
          table.float('price').notNullable();
          table.integer('stock').notNullable();
        });
        console.log(`La tabla ${tableName} fue creada!`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      await knexEcommerce.destroy();
    }
  };

  async addToCart(product: any) {
    await this.createTableCarrito();
    const knexEcommerce = knex(options_mariaDB);
    try {
      await knexEcommerce('carrito').insert([
        {
          _id: product._id,
          timestamp: product.timestamp,
          name: product.name,
          description: product.description,
          code: product.code,
          thumbnail: product.thumbnail,
          price: product.price,
          stock: product.stock,
        },
      ]);
      console.log('Producto agregado al carrito!');
    } catch (error) {
      console.log('addToCart: Producto duplicado');
    } finally {
      await knexEcommerce.destroy();
    }
  }

  async getCartProducts(): Promise<Array<Producto>> {
    await this.createTableCarrito();
    const knexEcommerce = knex(options_mariaDB);
    try {
      const carritoFromDb = await knexEcommerce.from('carrito').select('*');
      this.carrito = [];
      for (const product of carritoFromDb) {
        this.carrito.push(product);
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      await knexEcommerce.destroy();
      return this.carrito;
    }
  }

  async getCartProductById(id: any): Promise<Producto[]> {
    const knexEcommerce = knex(options_mariaDB);
    let cartProductById: any = {};
    try {
      const productFromDb = await knexEcommerce
        .from('carrito')
        .select('*')
        .where('_id', id);
      cartProductById = {
        _id: productFromDb[0]._id,
        timestamp: productFromDb[0].timestamp,
        name: productFromDb[0].name,
        description: productFromDb[0].description,
        code: productFromDb[0].code,
        thumbnail: productFromDb[0].thumbnail,
        price: productFromDb[0].price,
        stock: productFromDb[0].stock,
      };
    } catch (error) {
      console.log('getCartProductById: Producto no encontrado');
    } finally {
      await knexEcommerce.destroy();
      return cartProductById;
    }
  }

  async deleteProductCart(id: any) {
    const knexEcommerce = knex(options_mariaDB);
    try {
      await knexEcommerce.from('carrito').where('_id', id).del();
      console.log('Producto eliminado del carrito!');
    } catch (error) {
      console.log(error);
    } finally {
      await knexEcommerce.destroy();
    }
  }

  public getCartId() {
    return this.cartId;
  }

  public getCartTimestamp() {
    return this.cartTimestamp;
  }

  //

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
