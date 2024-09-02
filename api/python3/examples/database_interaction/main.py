from profiler.core import Profiler
import sqlite3

profiler = Profiler(
    address='localhost:50051',
    token='hsp_0d6d562910026e3ba0b511dd2c99a47d374f810055003c149eb5fbcdad693319'
)

@profiler.track()
def query_database():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE test (id INTEGER, value TEXT)')
    cursor.execute('INSERT INTO test (id, value) VALUES (1, "Hello")')
    cursor.execute('SELECT * FROM test')
    return cursor.fetchall()

if __name__ == "__main__":
    query_database()