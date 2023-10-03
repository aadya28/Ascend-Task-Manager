from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder='templates')

# MySQL Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:my-secret-pw@localhost/Task_Manager'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To suppress a warning
db = SQLAlchemy(app)

class Boards(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    wallpaper = db.Column(db.String(255), nullable=True)
    lists = db.relationship('Lists', backref='board', lazy=True)

class Lists(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    list_title = db.Column(db.String(255), nullable=False)
    board_id = db.Column(db.Integer, db.ForeignKey('boards.id'), nullable=False)

class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    list_id = db.Column(db.Integer, db.ForeignKey('lists.id'), nullable=False)
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
        selected_wallpaper = request.form.get('selected_wallpaper')

        print("Boards Title:", board_title)
        print("Wallpaper:", selected_wallpaper)

        if board_title:
            new_board = Boards(name=board_title, wallpaper=selected_wallpaper)
            db.session.add(new_board)
            db.session.commit()
    return redirect('/')

@app.route('/')
def workspace():
    boards = Boards.query.all()
    return render_template('workspace.html', boards=boards)

@app.route('/board/<int:board_id>', methods=['GET', 'POST'])
def board(board_id):
    board = Boards.query.get(board_id)
    boards = Boards.query.all()
    if board:
        if request.method == 'POST':
            list_title = request.form.get('list_title')

            if list_title:
                new_list = Lists(list_title=list_title, board_id=board_id)
                db.session.add(new_list)
                db.session.commit()
                return redirect(url_for('board', board_id=board_id))

        return render_template('board.html', board=board, boards=boards)
    else:
        return "Board not found", 404

@app.route('/delete_board/<int:board_id>', methods=['POST'])
def delete_board(board_id):
    board = Boards.query.get(board_id)
    if board:
        db.session.delete(board)
        db.session.commit()
        return jsonify({'message': 'Board deleted successfully'}), 200
    else:
        return jsonify({'message': 'Board not found'}), 404

@app.route('/rename_board/<int:board_id>', methods=['POST'])
def rename_board(board_id):
    if request.method == 'POST':
        new_board_name = request.json.get('newBoardName')

        board = Boards.query.get(board_id)
        if board:
            board.name = new_board_name
            db.session.commit()
            return jsonify({'message': 'Board renamed successfully'}), 200
        else:
            return jsonify({'message': 'Board not found'}), 404

if __name__ == "__main__":
    app.run(debug=True)