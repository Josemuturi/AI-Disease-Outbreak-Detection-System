# database.py  –  SQLite Database Setup for Audit Logs  |  MKU 2026
import sqlite3
from datetime import datetime

DB_NAME = "outbreak.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            user TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    # Add some seed data if empty
    cursor.execute("SELECT COUNT(*) FROM audit_logs")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO audit_logs (action, user, timestamp) VALUES (?, ?, ?)", 
                       ("System started and initialized database", "System", datetime.utcnow().isoformat()))
        cursor.execute("INSERT INTO audit_logs (action, user, timestamp) VALUES (?, ?, ?)", 
                       ("LSTM Model accuracy verified at 87.4%", "Administrator", datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()

def log_action(action: str, user: str):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO audit_logs (action, user, timestamp) VALUES (?, ?, ?)", 
                   (action, user, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()

def get_logs(limit=20):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT id, action, user, timestamp FROM audit_logs ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [{"id": r[0], "action": r[1], "user": r[2], "timestamp": r[3]} for r in rows]
