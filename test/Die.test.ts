import { Die } from "../src/helpers/Die";

test("Test a single die", () => {
  for (let i = 0; i < 50; ++i) {
    const result = Die.cast("1d6");
    expect(result < 7).toBe(true);
  }
});

test("Test a single die with modifier", () => {
  for (let i = 0; i < 50; ++i) {
    const result = Die.cast("1d6+5");
    expect(result < 12).toBe(true);
    expect(result > 5).toBe(true);
  }
});

test("Test a bad string", () => {
  const result = Die.cast("xxx");
  expect(result).toBe(0);
});

test("Test a check", () => {
  const result = Die.check("1d6+5", 4);
  expect(result).toBeTruthy();
});