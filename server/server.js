import express from "express";
import { Telegraf } from "telegraf";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import path from "path";
import Database from "./database.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === "development" ? "127.0.0.1" : "0.0.0.0";

// Initialize database
const database = new Database();

// Initialize Telegram bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://telegram.org"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.telegram.org"],
        frameSrc: ["'self'", "https://web.telegram.org"],
      },
    },
  })
);
app.use(compression());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? [
            "http://127.0.0.1:3000",
            "http://localhost:3000",
            "https://web.telegram.org",
          ]
        : ["https://your_domain.com", "https://web.telegram.org"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client")));

// Telegram MiniApp middleware to check if app is opened from Telegram
const telegramAuthMiddleware = (req, res, next) => {
  // Check for initData in various places where Telegram might send it
  const initData =
    req.query.initData ||
    req.headers["x-telegram-init-data"] ||
    req.headers["x-telegram-webapp-init-data"] ||
    req.body?.initData;

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log("InitData = ", initData, ip);

  if (initData) {
    try {
      // Parse Telegram init data
      const params = new URLSearchParams(initData);
      const user = params.get("user");

      console.log("User:", user);
      if (user) {
        const userData = JSON.parse(decodeURIComponent(user));
        req.telegramUser = userData;
        console.log("Telegram user authenticated:", userData.username);
      }
    } catch (error) {
      console.error("Error parsing Telegram init data:", error);
    }
  }

  // Additional check for Telegram WebApp user data in headers
  const telegramUser = req.headers["x-telegram-user"];
  if (telegramUser && !req.telegramUser) {
    try {
      const userData = JSON.parse(decodeURIComponent(telegramUser));
      req.telegramUser = userData;
      console.log("Telegram user authenticated via header:", userData.username);
    } catch (error) {
      console.error("Error parsing Telegram user header:", error);
    }
  }

  next();
};

// Apply Telegram auth middleware to all routes
app.use(telegramAuthMiddleware);

// Serve the main game page
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// API endpoint to get user info
app.get("/api/user", (req, res) => {
  if (req.telegramUser) {
    res.json({
      authenticated: true,
      user: req.telegramUser,
      source: "telegram",
    });
  } else {
    res.json({
      authenticated: false,
      source: "web",
    });
  }
});

// API endpoint to save game result
app.post("/api/game-result", async (req, res) => {
  try {
    const { maxHeap, maxScore, userName } = req.body;

    if (!maxHeap || !maxScore) {
      return res
        .status(400)
        .json({ error: "Missing required fields: maxHeap, maxScore" });
    }

    let userData = {
      user_id: null,
      user_name: userName || "Anonymous",
      user_source: "web",
    };

    // If user is authenticated via Telegram, use their data
    if (req.telegramUser) {
      userData = {
        user_id: req.telegramUser.id.toString(),
        user_name:
          req.telegramUser.username ||
          req.telegramUser.first_name ||
          "Telegram User",
        user_source: "telegram",
      };
    }

    const resultId = await database.saveGameResult(userData, maxHeap, maxScore);

    res.json({
      success: true,
      resultId,
      message: "Game result saved successfully",
    });
  } catch (error) {
    console.error("Error saving game result:", error);
    res.status(500).json({ error: "Failed to save game result" });
  }
});

// API endpoint to get top results
app.get("/api/top-results", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const results = await database.getTopResults(limit);
    res.json({ results });
  } catch (error) {
    console.error("Error getting top results:", error);
    res.status(500).json({ error: "Failed to get top results" });
  }
});

// API endpoint to get user's best result
app.get("/api/user-best", async (req, res) => {
  try {
    if (!req.telegramUser) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.telegramUser.id.toString();
    const result = await database.getUserBestResult(userId);

    if (result) {
      res.json({ result });
    } else {
      res.json({ result: null, message: "No results found for this user" });
    }
  } catch (error) {
    console.error("Error getting user best result:", error);
    res.status(500).json({ error: "Failed to get user best result" });
  }
});

// API endpoint to get user statistics
app.get("/api/user-stats", async (req, res) => {
  try {
    if (!req.telegramUser) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.telegramUser.id.toString();
    const stats = await database.getUserStats(userId);

    res.json({ stats });
  } catch (error) {
    console.error("Error getting user stats:", error);
    res.status(500).json({ error: "Failed to get user stats" });
  }
});

// Telegram webhook endpoint
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  try {
    bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(500);
  }
});

// Bot commands
bot.command("start", (ctx) => {
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "🎮 Играть в Stock 101",
          web_app: { url: "https://stock101.stekir.com" },
        },
      ],
    ],
  };

  ctx.reply(
    "Добро пожаловать в Stock 101! 🎯\n\n" +
      "Логическая игра с плитками. Соберите 101 очко для победы!\n\n" +
      "Нажмите кнопку ниже, чтобы начать игру:",
    { reply_markup: keyboard }
  );
});

bot.command("help", (ctx) => {
  ctx.reply(
    "🎮 Stock 101 - Правила игры:\n\n" +
      "• Цель: собрать 101 очко\n" +
      "• Перемещайте плитки, чтобы объединять одинаковые\n" +
      "• При объединении плитки исчезают и дают очки\n" +
      "• Используйте кнопки управления для отмены ходов и перекраски\n\n" +
      "Удачи! 🍀"
  );
});

// Handle web app data
bot.on("web_app_data", (ctx) => {
  const data = ctx.message.web_app_data.data;
  console.log("Received web app data:", data);

  // Here you can process game data from the web app
  ctx.reply("Данные игры получены! 🎮");
});

// Error handling
bot.catch((err, ctx) => {
  console.error("Bot error:", err);
  ctx.reply("Произошла ошибка. Попробуйте позже.");
});

// Start bot
bot
  .launch()
  .then(() => {
    console.log("Telegram bot started");
  })
  .catch((error) => {
    console.error("Failed to start bot:", error);
  });

// Set webhook for production
if (process.env.NODE_ENV === "production" && process.env.WEBHOOK_URL) {
  bot.telegram
    .setWebhook(process.env.WEBHOOK_URL)
    .then(() => {
      console.log("Webhook set to:", process.env.WEBHOOK_URL);
    })
    .catch((error) => {
      console.error("Failed to set webhook:", error);
    });
}

// Initialize database and start server
async function startServer() {
  try {
    await database.init();

    app.listen(PORT, HOST, () => {
      console.log(`Server running on ${HOST}:${PORT}`);
      if (process.env.NODE_ENV === "development") {
        console.log(`Game available at: http://${HOST}:${PORT}`);
      } else {
        console.log(`Game available at: https://stock101.stekir.com`);
      }
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.once("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  bot.stop("SIGINT");
  await database.close();
  process.exit(0);
});

process.once("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  bot.stop("SIGTERM");
  await database.close();
  process.exit(0);
});
