import { Producto } from './producto';

export class Carrito {
  private carrito: Array<Producto>;
  private static contador: number = 1;
  private id: number;
  private timestamp: Number;

  constructor() {
    this.carrito = Array<Producto>();
    this.id = Carrito.contador;
    Carrito.contador++;
    this.timestamp = Date.now();
  }
  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getProductos() {
    return this.carrito;
  }
  public getProductoById(id: number) {
    const producto = this.carrito.find(element => element.id === Number(id));
    return producto;
  }
  public addProducto(producto: Producto) {
    this.carrito.push(producto);
  }
  public deleteProducto(id: number) {
    let index = this.carrito.findIndex(element => element.id === Number(id));
    this.carrito.splice(index, 1);
  }
}
