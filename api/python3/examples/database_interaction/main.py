from profiler.core import Profiler
import sqlite3

profiler = Profiler(
    address='localhost:50051',
    token='shs_qsdsq8d79qdsq65d4q6d84sqd68qsd64qsd48q68sf'
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