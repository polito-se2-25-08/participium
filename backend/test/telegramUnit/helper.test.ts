import helper from "../../src/featuresBot/helper";


describe("helper feature", () => {
  function createMockCtx() {
    return {
      reply: jest.fn(),
    };
  }

  it("registers and executes /help command", async () => {
    let helpHandler: Function | undefined;

    const fakeBot = {
      command: jest.fn((command: string, handler: Function) => {
        if (command === "help") {
          helpHandler = handler;
        }
      }),
    } as any;

    helper(fakeBot);

    expect(helpHandler).toBeDefined();

    const ctx = createMockCtx();
    await helpHandler!(ctx);

    expect(ctx.reply).toHaveBeenCalled();
    expect(ctx.reply.mock.calls[0][0]).toContain("Available Commands");
  });

  it("registers and executes /contacts command", async () => {
    let contactsHandler: Function | undefined;

    const fakeBot = {
      command: jest.fn((command: string, handler: Function) => {
        if (command === "contacts") {
          contactsHandler = handler;
        }
      }),
    } as any;

    helper(fakeBot);

    expect(contactsHandler).toBeDefined();

    const ctx = createMockCtx();
    await contactsHandler!(ctx);

    expect(ctx.reply).toHaveBeenCalled();
    expect(ctx.reply.mock.calls[0][0]).toContain("Municipality Officers");
  });

  it("registers and executes /faq command", async () => {
    let faqHandler: Function | undefined;

    const fakeBot = {
      command: jest.fn((command: string, handler: Function) => {
        if (command === "faq") {
          faqHandler = handler;
        }
      }),
    } as any;

    helper(fakeBot);

    expect(faqHandler).toBeDefined();

    const ctx = createMockCtx();
    await faqHandler!(ctx);

    expect(ctx.reply).toHaveBeenCalled();
    expect(ctx.reply.mock.calls[0][0]).toContain("Frequently Asked Questions");
  });
});
