#!/usr/bin/env python3
"""
Test script to verify environment variables and database connection
Run this before deploying to Railway
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_environment():
    print("=== Environment Variables Test ===")

    # Check required environment variables
    required_vars = [
        'SECRET_KEY',
        'DB_USER',
        'DB_PASSWORD',
        'DB_HOST',
        'DB_NAME'
    ]

    for var in required_vars:
        value = os.environ.get(var)
        if value:
            # Mask sensitive data
            if 'PASSWORD' in var or 'SECRET' in var:
                display_value = '*' * len(value) if len(value) > 0 else 'NOT SET'
            else:
                display_value = value
            print(f"✅ {var}: {display_value}")
        else:
            print(f"❌ {var}: NOT SET")

    print(f"\n=== Database Connection Test ===")

    # Test database connection
    try:
        from app import create_app, db

        app = create_app()
        with app.app_context():
            # Try to connect to database
            db.create_all()
            print("✅ Database connection successful")
            print(f"✅ Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")

            # Test a simple query
            from app import Boards
            board_count = Boards.query.count()
            print(f"✅ Current boards in database: {board_count}")

    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")

    print(f"\n=== Port Configuration ===")
    port = int(os.environ.get('PORT', 8000))
    print(f"✅ App will run on port: {port}")

if __name__ == "__main__":
    test_environment()