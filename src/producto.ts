export class Producto {
  public id: number;
  public timestamp: Date;
  public nombre: string;
  public descripcion: string;
  public codigo: string;
  public thumbnail: string;
  public price: number;

  constructor(
    id: number,
    timestamp: Date,
    nombre: string,
    descripcion: string,
    codigo: string,
    thumbnail: string,
    price: number
  ) {
    this.id = id;
    this.timestamp = timestamp;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.codigo = codigo;
    this.thumbnail = thumbnail;
    this.price = price;
  }
}
