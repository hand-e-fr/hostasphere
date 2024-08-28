from profiler import probe
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

@probe()
def train_model():
    iris = load_iris()
    X_train, X_test, y_train, y_test = train_test_split(iris.data, iris.target, test_size=0.2)
    model = RandomForestClassifier()
    model.fit(X_train, y_train)
    return model.score(X_test, y_test)

if __name__ == "__main__":
    train_model()