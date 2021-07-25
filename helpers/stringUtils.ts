export {};
declare global {
  interface String {
    is: (targetValue: string) => boolean;
  }
}

String.prototype.is = function (targetValue: string) {
  return targetValue === this.trim();
};
