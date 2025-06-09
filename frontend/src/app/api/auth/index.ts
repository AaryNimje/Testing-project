// API client for authentication
export const authApi = {
  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
    return res.json();
  },
  async signup(data: { email: string; password: string; firstName: string; lastName: string }) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Signup failed');
    return res.json();
  },
  async getProfile(token: string) {
    const res = await fetch('/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  }
};