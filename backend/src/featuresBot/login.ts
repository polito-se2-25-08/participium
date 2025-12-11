import axios from "axios";
import { Telegraf } from "telegraf";

export default function registerLoginFeature(bot: Telegraf) {
  bot.command("login", (ctx) => {
    (ctx as any).session.loginState = "ASK_USERNAME";
    (ctx as any).session.username = null;
    ctx.reply("Enter your username:");
  });

  bot.on("text", async (ctx, next) => {
    const state = (ctx as any).session.loginState;

    // Ignore commands inside login
    if (ctx.message.text.startsWith("/")) return next();

    if (state === "ASK_USERNAME") {
      (ctx as any).session.username = ctx.message.text;
      (ctx as any).session.loginState = "ASK_PASSWORD";
      return ctx.reply("Enter your password:");
    }

    if (state === "ASK_PASSWORD") {
      try {
        const res = await axios.post("http://localhost:3000/api/v1/login", {
          username: (ctx as any).session.username!,
          password: ctx.message.text,
        });

        (ctx as any).session.token = res.data.data.token;
        (ctx as any).session.id = res.data.data.user.id;
        (ctx as any).session.loginState = null;

        return ctx.reply(`✅ Login successful!`);
      } catch (err: any) {
        return ctx.reply(
          err?.response?.data?.message ||
            "❌ Login failed. Check your username or password."
        );
      }
    }

    return next();
  });
}
