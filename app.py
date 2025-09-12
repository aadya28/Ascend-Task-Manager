from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

db = SQLAlchemy()

class Boards(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    wallpaper = db.Column(db.String(255), nullable=True)

    # Add cascade options to delete associated lists and tasks
    lists = relationship('Lists', backref='board', lazy=True, cascade='all, delete-orphan')

class Lists(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey('boards.id', ondelete='CASCADE'), nullable=False)
    list_title = db.Column(db.String(255), nullable=False)

    # Add cascade options to delete associated tasks
    tasks = relationship('Tasks', backref='list', lazy=True, cascade='all, delete-orphan')

class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    list_id = db.Column(db.Integer, db.ForeignKey('lists.id', ondelete='CASCADE'), nullable=False)
    task_name = db.Column(db.String(100), nullable=False)
    is_completed = db.Column(db.Boolean, default=False)

def create_app():
    # Initialize Flask app
    app = Flask(__name__, template_folder='templates')

    # Build database URL from environment variables
    db_user = os.environ.get('DB_USER', 'root')
    db_password = os.environ.get('DB_PASSWORD', '')
    db_host = os.environ.get('DB_HOST', 'localhost')
    db_name = os.environ.get('DB_NAME', 'Task_Manager')

    # For production, Railway will provide DATABASE_URL directly
    # For local, we build it from individual components
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        database_url = f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}"
    elif database_url.startswith('postgresql://'):
        # Production PostgreSQL with pg8000
        database_url = database_url.replace('postgresql://', 'postgresql+pg8000://', 1)
    elif database_url.startswith('mysql://'):
        # Handle Railway MySQL URL format if needed
        database_url = database_url.replace('mysql://', 'mysql+mysqlconnector://', 1)

    # Set Flask configuration (moved outside the conditional blocks)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-in-production')

    # Initialize extensions
    db.init_app(app)

    # Create tables within app context
    with app.app_context():
        db.create_all()

    # Your routes here
    @app.route('/')
    def workspace():
        boards = Boards.query.all()
        return render_template('workspace.html', boards=boards)

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

    @app.route('/board/<int:board_id>', methods=['GET', 'POST'])
    def board(board_id):
        board = Boards.query.get(board_id)
        boards = Boards.query.all()
        lists = Lists.query.filter_by(board_id=board_id).all()

        if board:
            if request.method == 'POST':
                list_title = request.form.get('list_title')

                if list_title:
                    new_list = Lists(list_title=list_title, board_id=board_id)
                    db.session.add(new_list)
                    db.session.commit()
                    return redirect(url_for('board', board_id=board_id))

            # Fetch tasks for each list
            tasks_for_lists = {}
            for a_list in lists:
                tasks = Tasks.query.filter_by(list_id=a_list.id).all()
                tasks_for_lists[a_list.id] = tasks

            return render_template('board.html', board=board, boards=boards, lists=lists, tasks=tasks_for_lists)
        else:
            return "Board not found", 404

    @app.route('/delete_board/<int:board_id>', methods=['POST'])
    def delete_board(board_id):
        board = Boards.query.get(board_id)
        if board:
            try:
                db.session.delete(board)
                db.session.commit()
                return jsonify({'message': 'Board deleted successfully'}), 200
            except Exception as e:
                print("Error deleting board:", str(e))
                return jsonify({'message': 'Error deleting board'}), 500
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

    @app.route('/create_list/<int:board_id>', methods=['POST'])
    def create_list(board_id):
        if request.method == 'POST':
            list_title = request.form.get('list_title')

            if list_title:
                new_list = Lists(list_title=list_title, board_id=board_id)
                db.session.add(new_list)
                db.session.commit()
                print('List created successfully')
                return jsonify({'list_id': new_list.id, 'message': 'List created successfully'}), 200
            else:
                return jsonify({'message': 'Invalid list title'}), 400

    @app.route('/delete_list/<int:list_id>', methods=['POST'])
    def delete_list(list_id):
        print("List ID:", list_id)
        list_to_delete = Lists.query.get(list_id)
        if list_to_delete:
            try:
                db.session.delete(list_to_delete)
                db.session.commit()
                print('List deleted successfully')
                return jsonify({'message': 'List deleted successfully'}), 200
            except Exception as e:
                print("Error deleting list:", str(e))
                return jsonify({'message': 'Error deleting list'}), 500
        else:
            return jsonify({'message': 'List not found'}), 404

    @app.route('/rename_list/<int:list_id>', methods=['POST'])
    def rename_list(list_id):
        if request.method == 'POST':
            new_list_title = request.json.get('newListTitle')

            if new_list_title:
                list_to_rename = Lists.query.get(list_id)

                if list_to_rename:
                    list_to_rename.list_title = new_list_title
                    db.session.commit()
                    return jsonify({'message': 'List renamed successfully'}), 200
                else:
                    return jsonify({'message': 'List not found'}), 404
            else:
                return jsonify({'message': 'Invalid list title'}), 400

    @app.route('/copy_list/<int:list_id>', methods=['POST'])
    def copy_list(list_id):
        if request.method == 'POST':
            list_to_copy = Lists.query.get(list_id)

            if list_to_copy:
                try:
                    new_list = Lists(list_title=list_to_copy.list_title, board_id=list_to_copy.board_id)
                    db.session.add(new_list)
                    db.session.commit()

                    # Copy tasks from the original list to the new list
                    tasks_to_copy = Tasks.query.filter_by(list_id=list_id).all()
                    for task in tasks_to_copy:
                        new_task = Tasks(list_id=new_list.id, task_name=task.task_name)
                        db.session.add(new_task)

                    db.session.commit()

                    return jsonify({'message': 'List copied successfully', 'copied_list_id': new_list.id}), 200
                except Exception as e:
                    print("Error copying list:", str(e))
                    return jsonify({'message': 'Error copying list'}), 500
            else:
                return jsonify({'message': 'List not found'}), 404

    @app.route('/create_task/<int:list_id>', methods=['POST'])
    def create_task(list_id):
        if request.method == 'POST':
            task_name = request.form.get('task_title')
            is_completed = False

            if task_name:
                new_task = Tasks(list_id=list_id, task_name=task_name, is_completed=is_completed)
                db.session.add(new_task)
                db.session.commit()

                return jsonify({'message': 'Task added successfully', 'task_id': new_task.id}), 200
            else:
                return jsonify({'message': 'Invalid task name'}), 400

    @app.route('/update_task_status/<int:task_id>', methods=['POST'])
    def update_task_status(task_id):
        if request.method == 'POST':
            is_completed = request.form.get('is_completed')

            task = Tasks.query.get(task_id)

            if task:
                task.is_completed = is_completed.lower() == 'true' if is_completed else False
                db.session.commit()
                return jsonify({'message': 'Task status updated successfully'}), 200
            else:
                return jsonify({'message': 'Task not found'}), 404

    @app.route('/rename_task/<int:task_id>', methods=['POST'])
    def rename_task(task_id):
        try:
            data = request.get_json()
            new_task_title = data.get('newTaskTitle')

            task = Tasks.query.get(task_id)
            if task:
                task.task_name = new_task_title
                db.session.commit()

                return jsonify({'message': 'Task renamed successfully'})
            else:
                return jsonify({'error': 'Task not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/delete_task/<int:task_id>', methods=['POST'])
    def delete_task(task_id):
        task_to_delete = Tasks.query.get(task_id)
        if task_to_delete:
            try:
                db.session.delete(task_to_delete)
                db.session.commit()
                return jsonify({'message': 'Task deleted successfully'}), 200
            except Exception as e:
                print("Error deleting task:", str(e))
                return jsonify({'message': 'Error deleting task'}), 500
        else:
            return jsonify({'message': 'Task not found'}), 404

    @app.route('/copy_task/<int:task_id>', methods=['POST'])
    def copy_task(task_id):
        if request.method == 'POST':
            task_to_copy = Tasks.query.get(task_id)

            if task_to_copy:
                try:
                    new_task = Tasks(list_id=task_to_copy.list_id, task_name=task_to_copy.task_name)
                    db.session.add(new_task)
                    db.session.commit()
                    return jsonify({'message': 'Task copied successfully', 'copied_task_id': new_task.id}), 200
                except Exception as e:
                    print("Error copying task:", str(e))
                    return jsonify({'message': 'Error copying task'}), 500
            else:
                return jsonify({'message': 'Task not found'}), 404

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
else:
    # This is for gunicorn
    app = create_app()