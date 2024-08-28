from profiler import probe
import sqlite3

@probe()
def query_database():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE test (id INTEGER, value TEXT)')
    cursor.execute('INSERT INTO test (id, value) VALUES (1, "Hello")')
    cursor.execute('SELECT * FROM test')
    return cursor.fetchall()

if __name__ == "__main__":
    query_database()