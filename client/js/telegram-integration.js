// Telegram MiniApp Integration Module
class TelegramIntegration {
  constructor() {
    this.isTelegramApp = false;
    this.user = null;
    this.isInitialized = false;
    this.init();
  }

  async init() {
    try {
      // Check if we're in Telegram Web App
      if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;

        // Проверяем различные признаки того, что мы в Telegram
        const isActuallyInTelegram =
          webApp.initData && webApp.initData.length > 0;
        const userAgent = navigator.userAgent;
        const isTelegramUserAgent =
          userAgent.includes("TelegramWebApp") ||
          userAgent.includes("Telegram");
        const hasTelegramFeatures = webApp.platform && webApp.version;
        const hasTelegramColorScheme =
          webApp.themeParams && webApp.themeParams.bg_color;
        const hasTelegramViewport = webApp.viewportStableHeight > 0;

        // Дополнительные проверки для более точного определения
        const hasValidInitData =
          isActuallyInTelegram && webApp.initData.includes("user=");
        const hasValidUserAgent = isTelegramUserAgent;
        const hasValidPlatform =
          hasTelegramFeatures &&
          (webApp.platform === "ios" || webApp.platform === "android");
        const hasValidTheme =
          hasTelegramColorScheme && webApp.themeParams.text_color;
        const hasValidViewport =
          hasTelegramViewport && webApp.viewportStableHeight > 100;

        // Более мягкая проверка для Telegram Mini App
        // Если есть Telegram WebApp API, считаем что мы в Telegram
        const hasTelegramWebAppAPI = true; // Если мы здесь, значит API доступен

        const criticalIndicators = [
          hasTelegramWebAppAPI, // Telegram WebApp API доступен
          hasValidViewport, // Есть валидный viewport
        ];

        const secondaryIndicators = [
          hasValidInitData, // Есть валидные initData с пользователем
          hasValidUserAgent, // Должен быть Telegram User Agent
          hasValidPlatform, // Должна быть валидная платформа
          hasValidTheme, // Должна быть валидная тема
        ];

        // Требуем 1 критический индикатор И хотя бы 1 вторичный
        const criticalCount = criticalIndicators.filter(Boolean).length;
        const secondaryCount = secondaryIndicators.filter(Boolean).length;

        console.log("Telegram detection indicators:", {
          hasValidInitData,
          hasValidUserAgent,
          hasValidPlatform,
          hasValidTheme,
          hasValidViewport,
          criticalCount,
          secondaryCount,
        });

        if (criticalCount >= 1 && secondaryCount >= 1) {
          this.isTelegramApp = true;
          this.webApp = webApp;

          console.log("Telegram WebApp detected and initialized");

          // Try to get user data from initData
          if (webApp.initData) {
            try {
              const params = new URLSearchParams(webApp.initData);
              const userParam = params.get("user");
              if (userParam) {
                this.user = JSON.parse(decodeURIComponent(userParam));
                console.log("User data extracted from initData:", this.user);
              }
            } catch (error) {
              console.error("Error parsing user data from initData:", error);
            }
          }

          // Initialize Telegram Web App
          this.webApp.ready();

          // Set theme
          this.webApp.setHeaderColor("#1a1a1a");
          this.webApp.setBackgroundColor("#ffffff");

          // Listen for theme changes
          this.webApp.onEvent("themeChanged", () => {
            this.updateTheme();
          });

          // Listen for viewport changes
          this.webApp.onEvent("viewportChanged", () => {
            this.updateViewport();
          });
        } else {
          console.log("Not enough Telegram indicators, checking server auth");
          // Если локальные проверки не показали Telegram, проверяем сервер
          await this.checkServerAuth();
        }
      } else {
        // Если нет Telegram WebApp API, проверяем сервер
        await this.checkServerAuth();
      }
      this.isInitialized = true;
    } catch (error) {
      console.error("Error initializing Telegram integration:", error);
      this.isInitialized = true;
    }
  }

  async checkServerAuth() {
    try {
      // Prepare headers for Telegram user data
      const headers = {};

      // If we have user data, send it to server
      if (this.user) {
        headers["x-telegram-user"] = encodeURIComponent(
          JSON.stringify(this.user)
        );
      }

      // If we have webApp with initData, send it too
      if (this.webApp && this.webApp.initData) {
        headers["x-telegram-webapp-init-data"] = this.webApp.initData;
      }

      const response = await fetch("/api/user", {
        headers: headers,
      });
      const data = await response.json();

      if (data.authenticated && data.source === "telegram") {
        this.isTelegramApp = true;
        this.user = data.user;
        this.addUsernameToHeader();
        console.log("Telegram user authenticated via server");
      } else {
        // Явно устанавливаем false для обычного браузера
        this.isTelegramApp = false;
        console.log("Not authenticated via Telegram server");
      }
    } catch (error) {
      console.error("Error checking server auth:", error);
      // В случае ошибки тоже устанавливаем false
      this.isTelegramApp = false;
    }
  }

  addUsernameToHeader() {
    if (this.user && this.user.username) {
      const header = document.querySelector(".header");
      if (header) {
        // Create username element
        const usernameElement = document.createElement("div");
        usernameElement.className = "telegram-username";
        usernameElement.textContent = `@${this.user.username}`;
        usernameElement.style.cssText = `
          position: absolute;
          top: 5px;
          right: 5px;
          font-size: 12px;
          color: #666;
          background: rgba(255, 255, 255, 0.8);
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 500;
        `;

        header.style.position = "relative";
        header.appendChild(usernameElement);
      }
    }
  }

  updateTheme() {
    if (this.webApp) {
      const themeParams = this.webApp.themeParams;

      // Apply Telegram theme colors
      document.documentElement.style.setProperty(
        "--tg-bg-color",
        themeParams.bg_color || "#ffffff"
      );
      document.documentElement.style.setProperty(
        "--tg-text-color",
        themeParams.text_color || "#000000"
      );
      document.documentElement.style.setProperty(
        "--tg-hint-color",
        themeParams.hint_color || "#999999"
      );
      document.documentElement.style.setProperty(
        "--tg-link-color",
        themeParams.link_color || "#2481cc"
      );
      document.documentElement.style.setProperty(
        "--tg-button-color",
        themeParams.button_color || "#2481cc"
      );
      document.documentElement.style.setProperty(
        "--tg-button-text-color",
        themeParams.button_text_color || "#ffffff"
      );
    }
  }

  updateViewport() {
    if (this.webApp) {
      const viewportStableHeight = this.webApp.viewportStableHeight;

      // Adjust game container height for Telegram viewport
      const gameContainer = document.querySelector(".game-container");
      if (gameContainer && viewportStableHeight) {
        gameContainer.style.height = `${viewportStableHeight}px`;
      }
    }
  }

  // Send data back to Telegram bot
  sendData(data) {
    if (this.webApp) {
      this.webApp.sendData(JSON.stringify(data));
    }
  }

  // Show main button
  showMainButton(text, callback) {
    if (this.webApp) {
      this.webApp.MainButton.text = text;
      this.webApp.MainButton.onClick(callback);
      this.webApp.MainButton.show();
    }
  }

  // Hide main button
  hideMainButton() {
    if (this.webApp) {
      this.webApp.MainButton.hide();
    }
  }

  // Show back button
  showBackButton(callback) {
    if (this.webApp) {
      this.webApp.BackButton.onClick(callback);
      this.webApp.BackButton.show();
    }
  }

  // Hide back button
  hideBackButton() {
    if (this.webApp) {
      this.webApp.BackButton.hide();
    }
  }

  // Expand the app
  expand() {
    if (this.webApp) {
      this.webApp.expand();
    }
  }

  // Close the app
  close() {
    if (this.webApp) {
      this.webApp.close();
    }
  }

  // Get user info
  getUser() {
    return this.user;
  }

  // Check if running in Telegram
  isInTelegram() {
    return this.isTelegramApp;
  }
}

export default TelegramIntegration;
