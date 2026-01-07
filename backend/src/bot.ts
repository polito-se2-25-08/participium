import { Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";
import dotenv from "dotenv";

dotenv.config();

import registerLoginFeature from "./featuresBot/login";
import registerNewReportFeature from "./featuresBot/newreport";
import checkReports from "./featuresBot/checkReports";
import helper from "./featuresBot/helper";
import notifications from "./featuresBot/notifications";

const bot = new Telegraf(process.env.BOT_TOKEN!);

// REAL SESSION MIDDLEWARE
bot.use(new LocalSession({ database: "sessions.json" }).middleware());

// Welcome message
bot.start((ctx) => {
ctx.reply(
    `🤖 *Welcome to Participium Bot!*\n\n` +
    `I can help you manage your reports quickly and easily.\n\n` +
    `📋 *Available commands:*\n\n` +
    `• /login - Log in to your account\n\n` +
    `• /newreport - Create a new report\n` +
    `• /myreports - View your reports\n` +
    `• /reportstatus <ID> - Check the status of a specific report\n\n` +
    `• /help - View all commands\n` +
    `• /contacts - View municipality workers contact details \n` +
    `• /faq - View frequently asked questions \n\n` +
    `For any issues, contact support.` +
    `💡 *Before you start:* Remember to log in with /login to access your reports!\n\n` +
    `💡 *After you logged in you will receive real time notifications of every update to your reports.*\n\n` 

);
});

registerLoginFeature(bot);
registerNewReportFeature(bot);
checkReports(bot);
helper(bot);
//notifications(bot, "🤖 Bot has started successfully.");

// Graceful shutdown handlers
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot;

