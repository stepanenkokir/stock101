import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Database {
  constructor() {
    this.dbPath = join(__dirname, "game_results.db");
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error("Error opening database:", err);
          reject(err);
        } else {
          console.log("Connected to SQLite database");
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS game_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          user_name TEXT,
          user_source TEXT DEFAULT 'web',
          max_heap INTEGER,
          max_score INTEGER,
          game_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      this.db.run(createTableSQL, (err) => {
        if (err) {
          console.error("Error creating table:", err);
          reject(err);
        } else {
          console.log("Game results table ready");
          resolve();
        }
      });
    });
  }

  async saveGameResult(userData, maxHeap, maxScore) {
    return new Promise((resolve, reject) => {
      const { user_id, user_name, user_source } = userData;

      const sql = `
        INSERT INTO game_results (user_id, user_name, user_source, max_heap, max_score)
        VALUES (?, ?, ?, ?, ?)
      `;

      this.db.run(
        sql,
        [user_id, user_name, user_source, maxHeap, maxScore],
        function (err) {
          if (err) {
            console.error("Error saving game result:", err);
            reject(err);
          } else {
            console.log(`Game result saved with ID: ${this.lastID}`);
            resolve(this.lastID);
          }
        }
      );
    });
  }

  async getTopResults(limit = 10) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT user_name, user_source, max_heap, max_score, game_date
        FROM game_results
        ORDER BY max_score DESC, max_heap DESC
        LIMIT ?
      `;

      this.db.all(sql, [limit], (err, rows) => {
        if (err) {
          console.error("Error getting top results:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getUserBestResult(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT user_name, user_source, max_heap, max_score, game_date
        FROM game_results
        WHERE user_id = ?
        ORDER BY max_score DESC, max_heap DESC
        LIMIT 1
      `;

      this.db.get(sql, [userId], (err, row) => {
        if (err) {
          console.error("Error getting user best result:", err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getUserStats(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as games_played,
          MAX(max_score) as best_score,
          MAX(max_heap) as best_heap,
          AVG(max_score) as avg_score
        FROM game_results
        WHERE user_id = ?
      `;

      this.db.get(sql, [userId], (err, row) => {
        if (err) {
          console.error("Error getting user stats:", err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error("Error closing database:", err);
            reject(err);
          } else {
            console.log("Database connection closed");
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

export default Database;
