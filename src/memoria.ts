import { ObjectId } from 'mongoose';
import { Producto } from './producto';
export class Memoria {
  private array: Array<Producto>;

  constructor() {
    this.array = [];
  }
  getArray() {
    return this.array;
  }
  getElementById(id: string) {
    const result = this.array.find(element => element._id == id);
    return result;
  }
  addElement(objeto: Producto) {
    this.array.push(objeto);
    return objeto;
  }
  emptyArray() {
    this.array = [];
  }
  updateObject(newProduct: Producto, id: string) {
    let index = this.array.findIndex(element => element._id == id);
    this.array[index] = newProduct;
  }

  deleteObject(id: string) {
    let index = this.array.findIndex(element => element._id == id);
    if (index != -1) {
      this.array.splice(index, 1);
    }
  }
}
