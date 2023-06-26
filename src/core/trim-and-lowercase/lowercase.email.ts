export class LowercaseEmail {
  private readonly _email: string;

  constructor(email: string) {
    this._email = email.toLowerCase();
  }

  toString(): string {
    return this._email;
  }
}
