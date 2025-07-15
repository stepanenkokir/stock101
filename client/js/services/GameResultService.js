export class GameResultService {
  constructor() {
    this.baseUrl = window.location.origin;
  }

  async saveGameResult(maxHeap, maxScore, userName = null) {
    try {
      if (!userName) {
        userName = localStorage.getItem("stock101_username") || null;
      }

      // Prepare headers for Telegram user data
      const headers = {
        "Content-Type": "application/json",
      };

      if (
        window.telegramIntegration &&
        window.telegramIntegration.isInTelegram()
      ) {
        const user = window.telegramIntegration.getUser();
        if (user) {
          headers["x-telegram-user"] = encodeURIComponent(
            JSON.stringify(user)
          );
        }

        if (
          window.telegramIntegration.webApp &&
          window.telegramIntegration.webApp.initData
        ) {
          headers["x-telegram-webapp-init-data"] =
            window.telegramIntegration.webApp.initData;
        }
      }

      const body = {
        maxHeap,
        maxScore,
        userName,
      };

      // Если есть initData, добавим его явно в body
      if (
        window.telegramIntegration &&
        window.telegramIntegration.isInTelegram() &&
        window.telegramIntegration.webApp &&
        window.telegramIntegration.webApp.initData
      ) {
        body.initData = window.telegramIntegration.webApp.initData;
      }

      const response = await fetch(`${this.baseUrl}/api/game-result`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error saving game result:", error);
      throw error;
    }
  }

  async getTopResults(limit = 10) {
    try {
      // Prepare headers for Telegram user data
      const headers = {};

      // If we're in Telegram, attach headers
      if (
        window.telegramIntegration &&
        window.telegramIntegration.isInTelegram()
      ) {
        const user = window.telegramIntegration.getUser();
        if (user) {
          headers["x-telegram-user"] = encodeURIComponent(
            JSON.stringify(user)
          );
        }

        if (
          window.telegramIntegration.webApp &&
          window.telegramIntegration.webApp.initData
        ) {
          headers["x-telegram-webapp-init-data"] =
            window.telegramIntegration.webApp.initData;
        }
      }

      const response = await fetch(
        `${this.baseUrl}/api/top-results?limit=${limit}`,
        {
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.results;
    } catch (error) {
      console.error("Error getting top results:", error);
      throw error;
    }
  }

  async getUserBestResult() {
    try {
      // Prepare headers for Telegram user data
      const headers = {};

      // If we're in Telegram, try to get user data and send it
      if (
        window.telegramIntegration &&
        window.telegramIntegration.isInTelegram()
      ) {
        const user = window.telegramIntegration.getUser();
        if (user) {
          headers["x-telegram-user"] = encodeURIComponent(JSON.stringify(user));
        }

        // Also try to get initData from Telegram WebApp
        if (
          window.telegramIntegration.webApp &&
          window.telegramIntegration.webApp.initData
        ) {
          headers["x-telegram-webapp-init-data"] =
            window.telegramIntegration.webApp.initData;
        }
      }

      const response = await fetch(`${this.baseUrl}/api/user-best`, {
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error("Error getting user best result:", error);
      throw error;
    }
  }

  async getUserStats() {
    try {
      // Prepare headers for Telegram user data
      const headers = {};

      // If we're in Telegram, try to get user data and send it
      if (
        window.telegramIntegration &&
        window.telegramIntegration.isInTelegram()
      ) {
        const user = window.telegramIntegration.getUser();
        if (user) {
          headers["x-telegram-user"] = encodeURIComponent(JSON.stringify(user));
        }

        // Also try to get initData from Telegram WebApp
        if (
          window.telegramIntegration.webApp &&
          window.telegramIntegration.webApp.initData
        ) {
          headers["x-telegram-webapp-init-data"] =
            window.telegramIntegration.webApp.initData;
        }
      }

      const response = await fetch(`${this.baseUrl}/api/user-stats`, {
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.stats;
    } catch (error) {
      console.error("Error getting user stats:", error);
      throw error;
    }
  }

  async getUserInfo() {
    try {
      // Prepare headers for Telegram user data
      const headers = {};

      // If we're in Telegram, try to get user data and send it
      if (
        window.telegramIntegration &&
        window.telegramIntegration.isInTelegram()
      ) {
        const user = window.telegramIntegration.getUser();
        if (user) {
          headers["x-telegram-user"] = encodeURIComponent(JSON.stringify(user));
        }

        // Also try to get initData from Telegram WebApp
        if (
          window.telegramIntegration.webApp &&
          window.telegramIntegration.webApp.initData
        ) {
          headers["x-telegram-webapp-init-data"] =
            window.telegramIntegration.webApp.initData;
        }
      }

      const response = await fetch(`${this.baseUrl}/api/user`, {
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error getting user info:", error);
      throw error;
    }
  }
}
