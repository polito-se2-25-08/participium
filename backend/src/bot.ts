import { Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";
import dotenv from "dotenv";

dotenv.config();

import registerLoginFeature from "./featuresBot/login";
import registerNewReportFeature from "./featuresBot/newreport";
import checkReports from "./featuresBot/checkReports";

const bot = new Telegraf(process.env.BOT_TOKEN!);

// REAL SESSION MIDDLEWARE
bot.use(new LocalSession({ database: "sessions.json" }).middleware());

// Welcome message
bot.start((ctx) => {
ctx.reply(
    `🤖 *Welcome to Participium Bot!*\n\n` +
    `I can help you manage your reports quickly and easily.\n\n` +
    `📋 *Available commands:*\n` +
    `• /login - Log in to your account\n` +
    `• /newreport - Create a new report\n` +
    `• /myreports - View your reports\n` +
    `• /reportstatus <ID> - Check the status of a specific report\n\n` +
    `💡 *Before you start:* Remember to log in with /login to access your reports!\n\n` +
    `For any issues, contact support.`
);
});

registerLoginFeature(bot);
registerNewReportFeature(bot);
checkReports(bot);

// Graceful shutdown handlers
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot;

