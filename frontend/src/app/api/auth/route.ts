import { NextRequest, NextResponse } from 'next/server';
import { USERS } from '@/lib/constants';

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
    let authenticatedUser = null;
    let userRole = null;

    Object.entries(USERS).forEach(([role, user]) => {
      if (user.username === username && user.password === password) {
        authenticatedUser = user;
        userRole = role;
      }
    });

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
    const user = USERS[userInfo.role];
    
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

// Middleware helper for protecting routes
export function createAuthMiddleware() {
  return async (request: NextRequest) => {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const userInfo = verifySimpleToken(token);
    
    if (!userInfo) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-role', userInfo.role);
    requestHeaders.set('x-user-username', userInfo.username);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  };
}

// Role-based access control helper
export function requireRole(allowedRoles: string[]) {
  return (request: NextRequest) => {
    const userRole = request.headers.get('x-user-role');
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Insufficient permissions' 
        },
        { status: 403 }
      );
    }
    
    return null; // Allow access
  };
}