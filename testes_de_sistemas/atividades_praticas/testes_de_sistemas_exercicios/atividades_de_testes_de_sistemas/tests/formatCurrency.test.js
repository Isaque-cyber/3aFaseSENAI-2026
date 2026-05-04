import { formatCurrency } from "../src/functions/formatCurrency";

describe("formatCurrency", () => {
  it("deve formatar o valor corretamente", () => {
    expect(formatCurrency(10.5)).toBe("R$ 10,50");
  });
});