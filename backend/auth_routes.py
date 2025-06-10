# backend/auth_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime
import os
import uuid
from models import User, Institution, SessionLocal
from sqlalchemy.exc import SQLAlchemyError

# Create Blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Function to initialize JWT
def init_jwt(app):
    app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    jwt = JWTManager(app)
    return jwt

# Login route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    session = SessionLocal()
    try:
        # Find user by email
        user = session.query(User).filter(User.email == email).first()
        
        # For now, we'll just check the password directly
        # In production, you would verify against a hashed password
        if not user or password != "password":  # Replace with proper password verification
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Create access token
        access_token = create_access_token(
            identity={
                'id': str(user.id),
                'email': user.email,
                'role': user.role,
                'name': user.full_name
            }
        )
        
        # Update last login
        user.last_login = datetime.utcnow()
        session.commit()
        
        return jsonify({
            'token': access_token,
            'user': {
                'id': str(user.id),
                'email': user.email,
                'name': user.full_name,
                'role': user.role
            }
        }), 200
    
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        session.close()

# Sign up route
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    role = data.get('role', 'student')  # Default to student
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    # Extract domain from email for institution matching
    domain = email.split('@')[-1]
    
    session = SessionLocal()
    try:
        # Check if user already exists
        existing_user = session.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({'message': 'User with this email already exists'}), 409
        
        # Find or create institution based on email domain
        institution = session.query(Institution).filter(Institution.domain == domain).first()
        if not institution:
            # For student signups, require existing institution
            if role == 'student':
                return jsonify({'message': 'Institution not found for this email domain'}), 404
            
            # For other roles, create a new institution (this would be controlled by superadmin in production)
            institution = Institution(
                name=f"{domain.split('.')[0].title()} Institution",
                domain=domain,
                settings={}
            )
            session.add(institution)
            session.flush()  # Get the ID without committing
        
        # Create new user
        new_user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role,
            institution_id=institution.id,
            # In production, you would hash the password
            # password_hash=generate_password_hash(password)
        )
        
        session.add(new_user)
        session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': str(new_user.id),
                'email': new_user.email,
                'role': new_user.role
            }
        }), 201
    
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        session.close()

# User profile route (protected)
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.id == current_user['id']).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': str(user.id),
                'email': user.email,
                'name': user.full_name,
                'role': user.role,
                'institution': user.institution.name if user.institution else None,
                'lastLogin': user.last_login.isoformat() if user.last_login else None
            }
        }), 200
    
    except SQLAlchemyError as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        session.close()

# SuperAdmin route for user role management
@auth_bp.route('/users/role', methods=['PUT'])
@jwt_required()
def update_user_role():
    current_user = get_jwt_identity()
    
    # Check if the current user is a superadmin
    if current_user.get('role') != 'super_admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    
    data = request.json
    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    
    user_id = data.get('userId')
    new_role = data.get('role')
    
    if not user_id or not new_role:
        return jsonify({'message': 'User ID and role are required'}), 400
    
    # Validate role
    valid_roles = ['super_admin', 'admin', 'faculty', 'staff', 'student']
    if new_role not in valid_roles:
        return jsonify({'message': f'Invalid role. Must be one of {valid_roles}'}), 400
    
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.id == user_id).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user.role = new_role
        session.commit()
        
        return jsonify({
            'message': 'User role updated successfully',
            'user': {
                'id': str(user.id),
                'email': user.email,
                'name': user.full_name,
                'role': user.role
            }
        }), 200
    
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        session.close()

# Get all users (admin/superadmin only)
@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = get_jwt_identity()
    
    # Check if the current user is an admin or superadmin
    if current_user.get('role') not in ['admin', 'super_admin']:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    session = SessionLocal()
    try:
        users = session.query(User).all()
        
        user_list = [{
            'id': str(user.id),
            'email': user.email,
            'name': user.full_name,
            'role': user.role,
            'institution': user.institution.name if user.institution else None,
            'lastLogin': user.last_login.isoformat() if user.last_login else None,
            'createdAt': user.created_at.isoformat()
        } for user in users]
        
        return jsonify({'users': user_list}), 200
    
    except SQLAlchemyError as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        session.close()