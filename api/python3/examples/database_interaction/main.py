from profiler.core import Profiler
import sqlite3

profiler = Profiler(
    endpoint_url='http://localhost:5000',
    license_id='1234',
    license_secret='567'
)

@profiler.probe()
def query_database():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE test (id INTEGER, value TEXT)')
    cursor.execute('INSERT INTO test (id, value) VALUES (1, "Hello")')
    cursor.execute('SELECT * FROM test')
    return cursor.fetchall()

if __name__ == "__main__":
    query_database()