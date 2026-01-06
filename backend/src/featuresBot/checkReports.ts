import axios from "axios";
import { Telegraf } from "telegraf";
import { ActiveReport } from "../controllers/interface/ActiveReport";
import { Notification } from "../models/Notification";

export default function checkReports(bot: Telegraf) {
  // START NEW REPORT
    // /users/:id/reports route for getting the reports for a specific user
      bot.command("myreports", async (ctx) => {
        try {
          // Check if user is logged in
          if (!(ctx as any).session?.token || !(ctx as any).session?.id) {
            return ctx.reply("❌ You need to login first. Use /login to authenticate.");
          }

          const userId = (ctx as any).session.id;
          if (!userId || Number.isNaN(userId)) {
            return ctx.reply("❌ Invalid user session. Please login again with /login.");
          }

          const res = await axios.get(`http://localhost:3000/api/v1/users/${userId}/reports`);
          const reports: ActiveReport[] = res.data.data;

          if (reports.length === 0) {
            return ctx.reply("📝 You don't have any reports yet.");
          }

          await ctx.reply("📋 Here is the list of your reports:");

          reports.forEach(report => {
            ctx.reply(`📄 Report #${report.id}: ${report.title}\n📊 Status: ${report.status}`);
          });
        } catch (error) {
          console.error("Error fetching reports:", error);
          ctx.reply("❌ Sorry, I couldn't fetch your reports. Please try again later.");
        }
      });

    //route to get specific report /reports/:id
    bot.command("reportstatus", async (ctx) => {
      try {
        const session = (ctx as any).session;

        if (!session?.token || !session?.id) {
          return ctx.reply("❌ You need to login first. Use /login to authenticate.");
        }

        const args = ctx.message.text.split(" ").slice(1);
        const reportId = Number.parseInt(args[0]);

        if (!reportId || Number.isNaN(reportId)) {
          return ctx.reply("❌ Usage: /reportstatus <report_id>");
        }

        //  FETCH REPORT
        const resReport = await axios.get(
          `http://localhost:3000/api/v1/reports/${reportId}`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );

        const report: ActiveReport = resReport.data.data;

        await ctx.reply(
          `📄 Report #${report.id}: ${report.title}\n📊 Status: ${report.status}`
        );

        // 🔔 FETCH NOTIFICATIONS
        const resNotifications = await axios.get(
          `http://localhost:3000/api/v1/notifications`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );

        const notifications: Notification[] = resNotifications.data.data;
        const reportNotifications = notifications.filter(
          n => n.report_id === reportId
        );

        if (!reportNotifications.length) {
          return ctx.reply("📭 No updates available for this report.");
        }

        await ctx.reply("📢 Recent updates for this report:");

        for (const notification of reportNotifications) {
          const date = new Date(notification.created_at).toLocaleDateString();
          await ctx.reply(`📅 ${date}: ${notification.message}`);
        }

      } catch (error: any) {
        console.error(
          "Error fetching report status:",
          error.response?.status,
          error.response?.data
        );
        ctx.reply("❌ Sorry, I couldn't fetch the report details. Please check the report ID and try again.");
      }
    });
    // GLOBAL ERROR CATCHER
    bot.catch((err, ctx) => {
      console.error("GLOBAL BOT ERROR:", err);
      ctx.reply("⚠️ An internal error occurred. Please try again.");
    });
}
