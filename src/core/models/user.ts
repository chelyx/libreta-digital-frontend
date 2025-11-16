export class User {
  auth0Id: string;
  nombre: string;
  email: string;
  legajo?: string;
  picture?: string;

  constructor(data: any) {
    this.email = data.email;
    this.legajo = data.legajo;
    this.nombre = data.nombre;
    this.picture = data.picture;
    this.auth0Id = data.auth0Id;
  }
}
