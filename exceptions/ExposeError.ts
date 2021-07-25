export default class ExposeError extends Error {
  constructor(public httpStatus: number, message: string, public errors?: any, public stack?: string) {
    super(message);
    this.name = "ExposeError";
  }
}
