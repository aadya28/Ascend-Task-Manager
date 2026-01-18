# ASCEND - Task Management Web Application

**A Trello-inspired task management web application built with Flask, MySQL, and modern JavaScript**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-green.svg)](https://flask.palletsprojects.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgments)

---

## About
**ASCEND** is a full-stack task management application. It is inspired by Trello and provides an intuitive interface for managing boards, lists, and tasks.

This project was built as a portfolio application to demonstrate RESTful API design, relational database modeling, and interactive frontend behavior.

### Key Highlights:
- **Beautiful UI** - Clean, modern interface with customizable board backgrounds
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Updates** - Dynamic content updates without page reloads
- **RESTful API** - Well-structured backend with 15+ API endpoints
- **Modular Architecture** - Organized codebase split into logical components

---

## Features

### Board Management
- Create multiple boards with custom names
- Choose from 4 beautiful wallpaper backgrounds
- Rename boards inline (click-to-edit)
- Delete boards with confirmation popup
- View all boards in workspace dashboard

### List Management
- Create unlimited lists within each board
- Rename lists inline
- Delete lists (cascading deletion of tasks)
- Copy entire lists with all tasks
- Organize lists horizontally

### Task Management
- Add tasks to any list
- Mark tasks as complete with checkboxes
- Rename tasks inline
- Delete individual tasks
- Copy tasks within lists
- Task status persistence

### UI/UX Features
- Dropdown action menus for boards, lists, and tasks
- Click-outside-to-close for forms and dropdowns
- Viewport-aware dropdown positioning
- Form validation and error handling
- Smooth animations and transitions
- Font Awesome icons integration

[//]: # (---)

[//]: # ()
[//]: # (## Demo)

[//]: # (### Demo Video)

[//]: # (![Demo Video]&#40;./demo/demo_video.mov&#41;)

[//]: # ()
[//]: # (### Workspace Dashboard)

[//]: # (![Workspace Page]&#40;./demo/workspace1.png&#41;)

[//]: # ()
[//]: # (### Board View)

[//]: # (![Board View]&#40;./demo/board1.png&#41;)

[//]: # ()
[//]: # (### List Operations)

[//]: # (![Workspace Page]&#40;./demo/list1.png&#41;)

[//]: # (![Workspace Page]&#40;./demo/list2.png&#41;)

[//]: # ()
[//]: # (### Task Operations)

[//]: # (![Workspace Page]&#40;./demo/task1.png&#41;)


---

## Tech Stack

### Backend
- **Flask 3.1.0** - Python web framework
- **SQLAlchemy 2.0.36** - ORM for database interactions
- **Flask-SQLAlchemy 3.1.1** - Flask integration for SQLAlchemy
- **MySQL Connector 9.1.0** - MySQL database driver
- **Python-dotenv 1.1.1** - Environment variable management

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with modern features
- **JavaScript (ES6+)** - Modular client-side logic
- **jQuery 3.6.0** - DOM manipulation and AJAX requests
- **Font Awesome 6.0.0** - Icon library
- **Jinja2 3.1.4** - Server-side templating

### Database
- **MySQL 8.0+** - Relational database with cascade delete support

### Development Tools
- **Git** - Version control
- **python-dotenv** - Environment configuration
- **Virtual Environment** - Isolated Python dependencies

---

## Project Structure

```
ASCEND/
├── app.py                          # Main Flask application
├── requirements.txt                # Python dependencies
├── .env                           # Environment variables (not in repo)
├── .gitignore                     # Git ignore rules
├── README.md                      # This file
│
├── static/                        # Static assets
│   ├── assets/
│   │   └── images/                # Logos and wallpapers
│   ├── scripts/                   # JavaScript modules
│   │   ├── common-utils.js        # Shared utilities
│   │   ├── form-handlers.js       # Form show/hide logic
│   │   ├── board-operations.js    # Board CRUD operations
│   │   ├── list-operations.js     # List CRUD operations
│   │   ├── task-operations.js     # Task CRUD operations
│   └── styles/                    # CSS stylesheets
│       ├── template.css           # Base template styles
│       └── components.css         # Component-specific styles
│
└── templates/                     # Jinja2 HTML templates
    ├── template.html              # Base template (layout)
    ├── workspace.html             # Workspace/dashboard view
    └── board.html                 # Individual board view
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
- **MySQL 8.0 or higher** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download Git](https://git-scm.com/downloads)
- **pip** - Python package manager (comes with Python)

---

## Installation & Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/aadya28/Ascend-Task-Manager.git

# Navigate to project directory
cd Ascend-Task-Manager
```

### 2. Set Up Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install required packages
pip install -r requirements.txt
```

### 4. Set Up MySQL Database

```bash
# Log into MySQL
mysql -u root -p

# Create database
CREATE DATABASE Task_Manager;

# Exit MySQL
EXIT;
```

### 5. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Create .env file
touch .env
```

Add the following configuration (replace with your values):

```env
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_NAME=Task_Manager
```

### 6. Initialize Database Tables

The application automatically creates tables on first run, but you can verify:

```bash
# Run Python in the project directory
python3

# In Python shell:
>>> from app import db, app
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

---

## Running the Application

ASCEND can be run using either Docker (recommended) or a locally installed MySQL database.
Choose the approach that best fits your development workflow.

👉 Use **Docker** if you want the fastest setup with zero local MySQL configuration.  
👉 Use **Local MySQL** if you want to explore or modify the database directly.

### Option A: Docker-Based Setup (Recommended)

This is the easiest and most reliable way to run the application.
It uses Docker to manage the MySQL database while the Flask app runs locally.

**Quick Start**

```bash
# Start the Flask app and MySQL Container
./start.sh
```


This single command:
- Starts (or creates) the MySQL Docker container
- Waits for the database to be ready
- Activates the virtual environment
- Launches the Flask application

To stop the application:
```bash
# Stop Flask: Ctrl + C
# Stop MySQL container: 
./stop.sh
```


Once running, open: http://localhost:5001


This approach avoids local MySQL configuration and ensures a consistent environment across machines.

---

### Option B: Local MySQL Setup (Without Docker)

Use this option if you already have MySQL installed and running on your system.

Steps
1. Ensure MySQL is running locally
2. Configure environment variables

Create a .env file in the project root and set your local database credentials:

```env
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_NAME=Task_Manager
```
⚠️ Never commit your `.env` file. It is already included in `.gitignore` to protect sensitive credentials.

3. Start the application

```bash
source venv/bin/activate
python app.py
```

The application will be available at: http://localhost:5001

---

**Automation Scripts (Optional)**

The project includes helper scripts to simplify development:
- `start.sh` – Starts the MySQL Docker container and the Flask app
- `stop.sh` – Stops the MySQL container
- `reset-db.sh` – Deletes the MySQL container and resets the database (development only)

These scripts are convenience tools and are not required if you prefer manual control.

---

## Usage Guide

### Getting Started

1. **Create Your First Board**
   - Click "Create new Board" button on the workspace page
   - Enter a board name
   - (Optional) Select a board background
   - Click "Create"

2. **Add Lists to Your Board**
   - Click on a board to open it
   - Click "➕ Add List" button
   - Enter list name and press Enter or click "Add List"

3. **Add Tasks to Lists**
   - Click "➕ Add Task" button within a list
   - Enter task name and press Enter or click "Add Task"
   - Check the checkbox to mark tasks as complete

### Managing Items

#### Board Actions
- **Rename**: Click the ☰ menu → "Rename Board"
- **Delete**: Click the ☰ menu → "Delete Board" → Confirm

#### List Actions
- **Rename**: Click the ⋯ menu → "Rename List"
- **Copy**: Click the ⋯ menu → "Copy List" (duplicates list + all tasks)
- **Delete**: Click the ⋯ menu → "Delete List"

#### Task Actions
- **Complete**: Click the checkbox next to the task
- **Rename**: Click the ✏️ icon → "Rename Task"
- **Copy**: Click the ✏️ icon → "Copy Task"
- **Delete**: Click the ✏️ icon → "Delete Task"

---

## API Endpoints

The application exposes a RESTful API consumed by the frontend using AJAX requests.

### Board Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all boards (workspace view) |
| POST | `/create_board` | Create a new board |
| GET/POST | `/board/<board_id>` | View/interact with specific board |
| POST | `/rename_board/<board_id>` | Rename a board |
| POST | `/delete_board/<board_id>` | Delete a board |

### List Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create_list/<board_id>` | Create a new list |
| POST | `/rename_list/<list_id>` | Rename a list |
| POST | `/delete_list/<list_id>` | Delete a list |
| POST | `/copy_list/<list_id>` | Copy a list with tasks |

### Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create_task/<list_id>` | Create a new task |
| POST | `/update_task_status/<task_id>` | Update task completion status |
| POST | `/rename_task/<task_id>` | Rename a task |
| POST | `/delete_task/<task_id>` | Delete a task |
| POST | `/copy_task/<task_id>` | Copy a task |

---

## Database Schema

### Tables

#### `boards`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| wallpaper | VARCHAR(255) | NULLABLE |

#### `lists`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| board_id | INTEGER | FOREIGN KEY → boards.id, CASCADE DELETE |
| list_title | VARCHAR(255) | NOT NULL |

#### `tasks`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| list_id | INTEGER | FOREIGN KEY → lists.id, CASCADE DELETE |
| task_name | VARCHAR(100) | NOT NULL |
| is_completed | BOOLEAN | DEFAULT FALSE |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose

---

## Acknowledgments

- Inspired by [Trello](https://trello.com)
- Font Awesome for icons
- Flask and SQLAlchemy communities

---