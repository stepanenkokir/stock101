// Telegram MiniApp Integration Module
class TelegramIntegration {
  constructor() {
    this.isTelegramApp = false;
    this.user = null;
    this.init();
  }

  async init() {
    try {
      // Check if we're in Telegram Web App
      if (window.Telegram && window.Telegram.WebApp) {
        this.isTelegramApp = true;
        this.webApp = window.Telegram.WebApp;

        // Initialize Telegram Web App
        this.webApp.ready();

        // Get user info
        this.user = this.webApp.initDataUnsafe?.user;

        // Set theme
        this.webApp.setHeaderColor("#1a1a1a");
        this.webApp.setBackgroundColor("#ffffff");

        console.log("Telegram Web App initialized");
        console.log("User:", this.user);

        // Add username to header if available
        this.addUsernameToHeader();

        // Listen for theme changes
        this.webApp.onEvent("themeChanged", () => {
          this.updateTheme();
        });

        // Listen for viewport changes
        this.webApp.onEvent("viewportChanged", () => {
          this.updateViewport();
        });
      } else {
        // Check if we're authenticated via server
        await this.checkServerAuth();
      }
    } catch (error) {
      console.error("Error initializing Telegram integration:", error);
    }
  }

  async checkServerAuth() {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();

      if (data.authenticated && data.source === "telegram") {
        this.isTelegramApp = true;
        this.user = data.user;
        this.addUsernameToHeader();
        console.log("User authenticated via server:", this.user);
      }
    } catch (error) {
      console.error("Error checking server auth:", error);
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
      const colorScheme = this.webApp.colorScheme;
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
      const viewportHeight = this.webApp.viewportHeight;
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

// Export for ES modules
export default TelegramIntegration;
