export class Producto {
  public _id: string;
  public timestamp: Date;
  public name: string;
  public description: string;
  public code: string;
  public thumbnail: string;
  public price: number;
  public stock: number;

  constructor(
    _id: string,
    timestamp: Date,
    name: string,
    description: string,
    code: string,
    thumbnail: string,
    price: number,
    stock: number
  ) {
    this._id = _id;
    this.timestamp = timestamp;
    this.name = name;
    this.description = description;
    this.code = code;
    this.thumbnail = thumbnail;
    this.price = price;
    this.stock = stock;
  }
}
