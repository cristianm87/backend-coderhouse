import { ObjectId } from 'mongoose';

export class Producto {
  public _id: string;

  public timestamp: Date;
  public nombre: string;
  public descripcion: string;
  public codigo: string;
  public thumbnail: string;
  public price: number;
  public stock: number;

  constructor(
    _id: string,

    timestamp: Date,
    nombre: string,
    descripcion: string,
    codigo: string,
    thumbnail: string,
    price: number,
    stock: number
  ) {
    this._id = _id;

    this.timestamp = timestamp;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.codigo = codigo;
    this.thumbnail = thumbnail;
    this.price = price;
    this.stock = stock;
  }
}
