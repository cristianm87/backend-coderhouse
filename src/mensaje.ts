export class Mensaje {
  public id: string;
  public author: object;
  public nombre: string;
  public apellido: string;
  public edad: number;
  public alias: string;
  public avatar: string;
  public fecha: string;
  public text: string;

  constructor(
    id: string,
    author: object,
    nombre: string,
    apellido: string,
    edad: number,
    alias: string,
    avatar: string,
    fecha: string,
    text: string
  ) {
    this.id = id;
    this.author = author;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.alias = alias;
    this.avatar = avatar;
    this.fecha = fecha;
    this.text = text;
  }
}
