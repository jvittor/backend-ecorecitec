export class User {
    constructor(
      public id: number,
      public email: string,
      public username: string,
      public password: string,
      public role: string,
      public imageBase64?: string
    ) {}
  }