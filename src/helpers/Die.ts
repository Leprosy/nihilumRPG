export class Die {
  static cast(exp: string): number {
    const dieRegex = /([0-9]+)d([0-9]+)(\+[0-9]+)*/i;
    const match = exp.match(dieRegex);

    if (match) {
      const number = +match[1];
      const side = +match[2];
      const plus = +match[3] ? +match[3] : 0;
      return number * (Math.round(Math.random() * (side - 1)) + 1) + plus;
    } else {
      return 0;
    }
  }

  static check(exp: string, threshold: number): boolean {
    const throwValue = Die.cast(exp);
    return throwValue > threshold;
  }
}