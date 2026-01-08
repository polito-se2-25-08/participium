import { Telegraf } from "telegraf";
import bot from "../bot";
import { userRepository } from "../repositories/userRepository";

/**
 * Escape special markdown characters for Telegram
 */
function escapeMD(text: string): string {
    return text.replaceAll(/[_*[\]()~`>#+=|{}.!-]/g, String.raw`\$&`);
}

/**
 * Send a message to the configured ADMIN chat.
 * Useful for ops/alerts. Requires ADMIN_CHAT_ID env.
 */
export default function notifyAdmin(botInstance: Telegraf, message: string) {
    botInstance.telegram.sendMessage(process.env.ADMIN_CHAT_ID!, escapeMD(message), {
        parse_mode: "Markdown",
    });
}

/**
 * Send a message to a specific Telegram chat ID using the shared bot instance.
 */
export async function sendToChatId(chatId: number, message: string) {
    if (!chatId || Number.isNaN(Number(chatId))) {
        throw new Error("Invalid chatId provided to sendToChatId");
    }
    await bot.telegram.sendMessage(chatId, escapeMD(message), { parse_mode: "Markdown" });
}

/**
 * Resolve a user's Telegram chat ID and send them a message.
 * Looks for common field names on User row (telegram_chat_id, telegramChatId, etc.).
 * Falls back to ADMIN_CHAT_ID if not found, with a warning log.
 */
export async function sendToUserId(userId: number, message: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error(`User ${userId} not found`);

    let chatId: number | undefined;
    const value = (user as any).chat_id;
    if (typeof value === "number") {
        chatId = value;
    }
    else if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
        chatId = Number(value);
    }

    if (!chatId) {
        console.warn(
            `No telegram chat id for user ${userId}.`
        );
        throw new Error(
            `Cannot send Telegram message: user ${userId} has no chat id and ADMIN_CHAT_ID not configured`
        );
    }

    await sendToChatId(chatId, message);
}
