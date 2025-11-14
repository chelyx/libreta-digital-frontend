export class UserValidatedClass {
  email: string;
  legajo: string;
  nombre: string;
  picture: string;
  auth0Id: string;


  constructor(data: any) {
    this.email = data.email;
    this.legajo = data.legajo;
    this.nombre = data.nombre;
    this.picture = data.picture;
    this.auth0Id = data.auth0Id;
  }

}

export interface User {
  auth0Id: string;
  nombre: string;
  email: string;
  rol: string;
  legajo?: string;
  picture?: string;
}
