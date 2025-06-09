// Extend your API client with user management endpoints
export const authApi = {
  // ...existing methods (login, signup, getProfile)

  async getAllUsers(token: string) {
    const res = await fetch('/api/auth/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async updateUserRole(token: string, userId: string, newRole: string) {
    const res = await fetch(`/api/auth/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: newRole })
    });
    if (!res.ok) throw new Error('Failed to update user role');
    return res.json();
  },

  async inviteUser(token: string, data: { email: string; firstName: string; lastName: string; role: string }) {
    const res = await fetch('/api/auth/invite', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to invite user');
    return res.json();
  }
};