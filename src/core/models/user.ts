export class UserValidatedClass {
  email: string;
  email_verified: boolean;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;

  constructor(data: any) {
    this.email = data.email;
    this.email_verified = data.email_verified;
    this.name = data.name;
    this.nickname = data.nickname;
    this.picture = data.picture;
    this.updated_at = data.updated_at;
  }
}
