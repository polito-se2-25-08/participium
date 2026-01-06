import { Telegraf } from "telegraf";

export default function helper(bot: Telegraf) {
  bot.command("contacts", async (ctx) => {
    const contactsText = `
📇 *Contact Details*

🏛️ *Municipality Officers*
• 👤 Maria Rossi  
  ✉️ maria.rossi@comune.it  

• 👤 Luca Bianchi  
  ✉️ luca.bianchi@comune.it  

🛠️ *Technical Team*
• 👤 Andrea Verdi — Roads & Infrastructure  
  ✉️ andrea.verdi@comune.it  

• 👤 Sofia Neri — Public Lighting  
  ✉️ sofia.neri@comune.it  

• 👤 Marco Conti — Waste Management  
  ✉️ marco.conti@comune.it  

• 👤 Giulia Ferraro — Green Areas  
  ✉️ giulia.ferraro@comune.it  
    `;

    await ctx.reply(contactsText, {
      parse_mode: "Markdown",
    });
  });

    bot.command("help", async (ctx) => {
    const contactsText = `
❓ *Help*

📋 *Available Commands*

🔐 *Account*
• /login — Log in to your account

📝 *Reports*
• /newreport — Create a new report
• /myreports — View your reports
• /reportstatus <ID> — Check the status of a report

ℹ️ *Information*
• /help — View all commands
• /contacts — Municipality contact details
• /faq — Frequently asked questions

💡 *Before you start*
Remember to log in using /login to access and manage your reports.
    `;

    await ctx.reply(contactsText, {
      parse_mode: "Markdown",
    });
  });

  bot.command("faq", async (ctx) => {
    const faqText = `
❓ *Frequently Asked Questions (FAQ)*

1️⃣ *What is Participium?*  
Participium is a platform that allows citizens to report problems in the city, like potholes or broken streetlights.

2️⃣ *Do I need an account to create a report?*  
Yes. You must register and confirm your email before submitting reports.

3️⃣ *Can I send a report anonymously?*  
Yes. You can choose to hide your name when submitting a report.

4️⃣ *What kind of problems can I report?*  
Issues like road damage, waste, public lighting, architectural barriers, green areas, and more.

5️⃣ *Do I need to add photos?*  
Yes. At least one photo is required (up to 3).

6️⃣ *What happens after I submit a report?*  
Your report is checked by the Municipality and then accepted or rejected.

7️⃣ *How can I check the status of my report?*  
You can check it on the platform or through this Telegram bot.

8️⃣ *Can I see reports from other citizens?*  
Yes. All accepted reports are visible on the public map.

9️⃣ *What can this Telegram bot do?*  
It helps you create reports and check their status.

    `;

    await ctx.reply(faqText, {
      parse_mode: "Markdown",
    });
  });
}


