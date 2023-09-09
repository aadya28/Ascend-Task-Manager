from flask import Flask, render_template

app = Flask(__name__, template_folder='templates')

@app.route('/board')
def Board():
    return render_template('board.html')

@app.route('/')
def Workspace():
    return render_template('workspace.html')

if __name__ == "__main__":
    app.run(debug = True)