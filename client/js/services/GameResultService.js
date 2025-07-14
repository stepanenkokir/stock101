export class GameResultService {
  constructor() {
    this.baseUrl = window.location.origin;
  }

  async saveGameResult(maxHeap, maxScore, userName = null) {
    try {
      if (!userName) {
        userName = localStorage.getItem("stock101_username") || null;
      }
      const response = await fetch(`${this.baseUrl}/api/game-result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxHeap,
          maxScore,
          userName,
        }),
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
      const response = await fetch(
        `${this.baseUrl}/api/top-results?limit=${limit}`
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
      const response = await fetch(`${this.baseUrl}/api/user-best`);

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
      const response = await fetch(`${this.baseUrl}/api/user-stats`);

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
      const response = await fetch(`${this.baseUrl}/api/user`);

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
