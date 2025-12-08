import { Telegraf, Markup } from "telegraf";
import axios from "axios";

const REPORT_CATEGORIES = [
  { value: "water_supply", label: "Water Supply - Drinking Water" },
  { value: "architectural_barriers", label: "Architectural Barriers" },
  { value: "sewer_system", label: "Sewer System" },
  { value: "public_lighting", label: "Public Lighting" },
  { value: "waste", label: "Waste" },
  {
    value: "road_signs_traffic_lights",
    label: "Road Signs and Traffic Lights",
  },
  { value: "roads_urban_furnishings", label: "Roads and Urban Furnishings" },
  {
    value: "public_green_areas_playgrounds",
    label: "Public Green Areas and Playgrounds",
  },
  { value: "other", label: "Other" },
];

function buildCategoryKeyboard() {
  return {
    inline_keyboard: REPORT_CATEGORIES.map((c) => [
      { text: c.label, callback_data: `cat_${c.value}` },
    ]),
  };
}

const MAX_PHOTOS = 3;

export default function registerNewReportFeature(bot: Telegraf) {
  // START NEW REPORT
    bot.command("newreport", async (ctx) => {
    ctx.session.reportState = "ASK_TITLE";
    ctx.session.report = {
        photos: [],
    };

    return ctx.reply("📝 Starting a NEW report.\nEnter the report title:");
    });


  // CATEGORY SELECT (callback query)
  bot.on("callback_query", async (ctx) => {
    try {
      const data = ctx.callbackQuery?.data;
      if (!data || !data.startsWith("cat_")) return;

      const category = data.replace("cat_", "");
      ctx.session.report.category = category;
      ctx.session.reportState = "ASK_ANONYMOUS";

      await ctx.answerCbQuery();
      await ctx.editMessageText(`📂 Category selected: ${category}`);
      await ctx.reply("🙈 Anonymous? (yes/no)");
    } catch (err) {
      console.error("Callback error:", err);
      await ctx.reply("❌ Something went wrong.");
    }
  });

  // MAIN TEXT INPUT HANDLER
  bot.on("text", async (ctx, next) => {
    try {
      const text = ctx.message.text;

      if (text.startsWith("/")) return next();

      const state = ctx.session.reportState;
      if (!state) return next();

      switch (state) {
        case "ASK_TITLE":
          ctx.session.report.title = text;
          ctx.session.reportState = "ASK_DESCRIPTION";
          return ctx.reply("✏️ Enter the report description (minimum 10 characters):");

        case "ASK_DESCRIPTION":
          ctx.session.report.description = text;
          ctx.session.reportState = "ASK_CATEGORY";
          return ctx.reply("📂 Choose a category:", {
            reply_markup: buildCategoryKeyboard(),
          });

        case "ASK_ANONYMOUS":
          ctx.session.report.anonymous = text.toLowerCase().startsWith("y");
          ctx.session.reportState = "ASK_PHOTOS";
          return ctx.reply("📸 Send photos (minimum 1):");

        case "ASK_PHOTOS":
          if (text.toLowerCase() === "done") {
            ctx.session.reportState = "ASK_LOCATION";

            await ctx.reply("📍 Send your location:", {
              reply_markup: {
                keyboard: [
                  [{ text: "📌 Send Location", request_location: true }],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
              },
            });

            return;
          }
          return ctx.reply("Send a photo or type 'done'.");

        default:
          return next();
      }
    } catch (err) {
      console.error("Text handler error:", err);
      await ctx.reply("❌ Something went wrong.");
    }
  });

  // PHOTO HANDLER
  bot.on("photo", async (ctx) => {
    try {
      if (ctx.session.reportState !== "ASK_PHOTOS") return;

      const photos = ctx.session.report.photos;
      if (photos.length >= MAX_PHOTOS)
        return ctx.reply("⚠️ Max 3 photos reached. Type 'done'.");

      const fileId = ctx.message.photo.pop().file_id;
      photos.push(fileId);

      if (photos.length >= MAX_PHOTOS) {
        return ctx.reply("📸 You sent 3 photos. Type 'done' to continue.");
      }

      return ctx.reply(
        `Photo saved (${photos.length}/3). Send another or type 'done'.`
      );
    } catch (err) {
      console.error("Photo handler error:", err);
      await ctx.reply("❌ Error saving photo.");
    }
  });

  // LOCATION HANDLER
  bot.on("location", async (ctx) => {
    if (ctx.session.reportState !== "ASK_LOCATION") return;

    try {
      const { latitude, longitude } = ctx.message.location;

      ctx.session.report.latitude = latitude;
      ctx.session.report.longitude = longitude;

      // Reverse geocode
      let addr = null;
      try {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/reverse",
          {
            params: { format: "json", lat: latitude, lon: longitude },
            headers: { "User-Agent": "ParticipiumBot/1.0" },
            timeout: 5000,
          }
        );
        addr = res.data.display_name;
      } catch {
        addr = "Unknown Address";
      }

      ctx.session.report.address = addr;

      // Submit report
      await axios.post("http://localhost:3000/api/v1/reports", ctx.session.report, {
        headers: {
          Authorization: `Bearer ${ctx.session.token}`,
        },
      });

      await ctx.reply("✅ Report submitted!");

    } catch (err) {
      console.error("Report submission error:", err);
      await ctx.reply("❌ Failed to submit report.");
    }

    // Reset session
    ctx.session.reportState = null;
    ctx.session.report = null;
  });

  // GLOBAL ERROR CATCHER
  bot.catch((err, ctx) => {
    console.error("GLOBAL BOT ERROR:", err);
    ctx.reply("⚠️ An internal error occurred. Please try again.");
  });
}
