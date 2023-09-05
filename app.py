from flask import Flask, render_template

app = Flask(__name__, template_folder='templates')

@app.route('/')
def Board():
    return render_template('board.html')

if __name__ == "__main__":
    app.run(debug = True)