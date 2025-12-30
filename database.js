import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize Database
let db;

export const initDb = async () => {
    db = await open({
        filename: './leads.db',
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      company TEXT,
      phone TEXT,
      source TEXT DEFAULT 'Web',
      status TEXT DEFAULT 'New',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    console.log('[DB] Database initialized and tables ready.');
};

export const addLead = async (email, company, phone) => {
    const result = await db.run(
        'INSERT INTO leads (email, company, phone) VALUES (?, ?, ?)',
        email, company, phone
    );
    return result;
};

export const getLeads = async () => {
    return await db.all('SELECT * FROM leads ORDER BY created_at DESC');
};

export const getAnalytics = async () => {
    // Get total leads
    const total = await db.get('SELECT COUNT(*) as count FROM leads');

    // Get leads over last 7 days (mocking the query logic for simplicity to group by day)
    // In a real production app you'd do complex date grouping here. 
    // For "Real Life" MVP, we will return the raw count and let frontend handle history or just show totals.

    return {
        totalLeads: total.count,
        recentLeads: await db.all('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5')
    };
};
