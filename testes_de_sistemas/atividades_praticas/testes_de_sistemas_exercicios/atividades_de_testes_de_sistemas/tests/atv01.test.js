import sum from "../src/functions/atv01";

describe("sum", () => {
  it("should add two numbers", () => {
    expect(sum(2, 3)).toBe(5);
  });
});