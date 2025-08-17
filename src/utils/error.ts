export class BaseError extends Error {
  public readonly status: number;
  public name: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.status = statusCode;
    this.name = 'BaseError';
  }

  toResponse() {
    return {
      message: this.message,
      errorName: this.name,
      statusCode: this.status,
    };
  }
}
