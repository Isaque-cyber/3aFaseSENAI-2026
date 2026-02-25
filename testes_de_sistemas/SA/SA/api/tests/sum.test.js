const can = {
  name: 'pamplemousse',
  ounces: 12,
};

describe('the can', () => {
  test('has 12 ounces', () => {
    expect(can.ounces).toBe(12);
  });

  test('has a sophisticated name', () => {
    expect(can.name).toBe('pamplemousse');
  });
});

const mouse = {
    name: "Mickey",
    status: "Disney",
}

describe("O Mickey está na Disney", () => {
test: ("O Mickey esta onde ?", () => {
 expect(mouse.name).toBe(Sim);
});
test("Ele esta na Disney", () => {
    expect(mouse.name).toBe("Mickey");
})
})