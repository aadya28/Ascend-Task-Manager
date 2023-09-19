from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__, template_folder='templates')

# MySQL Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:my-secret-pw@localhost/Task_Manager'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To suppress a warning
db = SQLAlchemy(app)

class Board(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    wallpaper = db.Column(db.String(255), nullable=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    board_name = db.Column(db.String(100), nullable=False)
    list_name = db.Column(db.String(100), nullable=False)
    task_name = db.Column(db.String(100), nullable=False)

# Move the creation of the table into a function
def create_tables():
    with app.app_context():
        db.create_all()

# Initialize the app context by creating the tables
create_tables()

@app.route('/create_board', methods=['POST'])
def create_board():
    if request.method == 'POST':
        board_title = request.form.get('board_title')
        wallpaper = request.form.get('data-wallpaper')

        if board_title:
            new_board = Board(name=board_title, wallpaper=wallpaper)
            db.session.add(new_board)
            db.session.commit()
    return redirect('/')

@app.route('/')
def workspace():
    boards = Board.query.all()
    return render_template('workspace.html', boards=boards)

if __name__ == "__main__":
    app.run(debug=True)