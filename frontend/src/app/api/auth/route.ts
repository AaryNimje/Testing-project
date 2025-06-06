// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Define user record type
type UserRecord = {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  avatar: string;
};

// Define your mock users
const USERS: Record<string, UserRecord> = {
  super_admin: {
    id: '1',
    username: 'superadmin',
    password: 'admin123',
    name: 'Super Administrator',
    email: 'superadmin@platform.edu',
    avatar: '/avatars/superadmin.jpg'
  },
  admin: {
    id: '2',
    username: 'admin',
    password: 'admin123',
    name: 'University Admin',
    email: 'admin@university.edu',
    avatar: '/avatars/admin.jpg'
  },
  faculty: {
    id: '3',
    username: 'faculty',
    password: 'faculty123',
    name: 'Dr. Sarah Johnson',
    email: 'faculty@university.edu',
    avatar: '/avatars/faculty.jpg'
  },
  student: {
    id: '4',
    username: 'student',
    password: 'student123',
    name: 'Alex Chen',
    email: 'student@university.edu',
    avatar: '/avatars/student.jpg'
  },
  staff: {
    id: '5',
    username: 'staff',
    password: 'staff123',
    name: 'Maria Rodriguez',
    email: 'staff@university.edu',
    avatar: '/avatars/staff.jpg'
  }
};

// Types
interface LoginRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  token?: string;
  message?: string;
}

// POST /api/auth - Login endpoint
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username and password are required' 
        } as AuthResponse,
        { status: 400 }
      );
    }

    // Simulate database lookup delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check credentials against our user database
    let authenticatedUser: UserRecord | null = null;
    let userRole: string | null = null;

    // Use for...of loop instead of forEach for better type inference
    for (const [role, user] of Object.entries(USERS)) {
      if (user.username === username && user.password === password) {
        authenticatedUser = user;
        userRole = role;
        break; // Exit loop early when found
      }
    }

    if (!authenticatedUser || !userRole) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid username or password' 
        } as AuthResponse,
        { status: 401 }
      );
    }

    // Generate a simple token (in production, use JWT with proper signing)
    const token = generateSimpleToken(authenticatedUser.username, userRole);

    // Return successful authentication
    const response: AuthResponse = {
      success: true,
      user: {
        id: authenticatedUser.id,
        username: authenticatedUser.username,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
        role: userRole,
        avatar: authenticatedUser.avatar
      },
      token,
      message: 'Login successful'
    };

    // Set httpOnly cookie for additional security
    const cookieResponse = NextResponse.json(response);
    cookieResponse.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });

    return cookieResponse;

  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      } as AuthResponse,
      { status: 500 }
    );
  }
}

// GET /api/auth - Verify token / Get current user
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.replace('Bearer ', '');
    const tokenFromCookie = request.cookies.get('auth-token')?.value;
    
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No authentication token provided' 
        } as AuthResponse,
        { status: 401 }
      );
    }

    // Verify token and extract user info
    const userInfo = verifySimpleToken(token);
    
    if (!userInfo) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired token' 
        } as AuthResponse,
        { status: 401 }
      );
    }

    // Get full user data
    const userRole = userInfo.role as keyof typeof USERS;
    const user = USERS[userRole];
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User not found' 
        } as AuthResponse,
        { status: 404 }
      );
    }

    const response: AuthResponse = {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: userInfo.role,
        avatar: user.avatar
      },
      token
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Token verification failed' 
      } as AuthResponse,
      { status: 401 }
    );
  }
}

// DELETE /api/auth - Logout endpoint
export async function DELETE(request: NextRequest) {
  try {
    // Clear the authentication cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Logged out successfully' 
      } as AuthResponse
    );

    response.cookies.delete('auth-token');
    
    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Logout failed' 
      } as AuthResponse,
      { status: 500 }
    );
  }
}

// Utility functions for token management
function generateSimpleToken(username: string, role: string): string {
  // In production, use proper JWT library
  const payload = {
    username,
    role,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifySimpleToken(token: string): { username: string; role: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check if token is expired
    if (payload.exp < Date.now()) {
      return null;
    }
    
    return {
      username: payload.username,
      role: payload.role
    };
  } catch {
    return null;
  }
}