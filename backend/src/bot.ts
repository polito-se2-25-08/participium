import { Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";
import dotenv from "dotenv";

dotenv.config();

import registerLoginFeature from "./featuresBot/login";
import registerNewReportFeature from "./featuresBot/newreport";

const bot = new Telegraf(process.env.BOT_TOKEN!);

// REAL SESSION MIDDLEWARE
bot.use(new LocalSession({ database: "sessions.json" }).middleware());

registerLoginFeature(bot);
registerNewReportFeature(bot);

export default bot;

