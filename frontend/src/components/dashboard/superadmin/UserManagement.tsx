// src/components/dashboard/superadmin/UserManagement.tsx
"use client";

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { authApi } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole } from '@/lib/types';
import { 
  IconCheck, 
  IconSearch,
  IconRefresh,
  IconUserPlus,
} from '@tabler/icons-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserManagement() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'student' as UserRole,
  });
  
  // Fetch users on component mount
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);
  
  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const { users: fetchedUsers } = await authApi.getAllUsers(token);
      setUsers(fetchedUsers);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Update user role
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    setError(null);
    setSuccess(null);
    
    try {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      // Update user role
      const { user } = await authApi.updateUserRole(token, userId, newRole as UserRole);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId ? { ...u, role: user.role } : u
        )
      );
      
      setSuccess(`Updated ${user.name}'s role to ${user.role}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
      console.error('Error updating user role:', err);
    }
  };
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle new user form submission
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      // In a real implementation, you'd call an API to create a new user
      // For now, we'll just simulate it
      
      setSuccess(`Invitation sent to ${newUserData.email}`);
      setShowAddForm(false);
      setNewUserData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'student' as UserRole,
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add user');
      console.error('Error adding user:', err);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-gray-400">Manage users and their roles</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-white/10 text-white hover:bg-white/10"
            onClick={fetchUsers}
          >
            <IconRefresh className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            className="bg-gradient-to-r from-cyan-500 to-blue-600"
            onClick={() => setShowAddForm(true)}
          >
            <IconUserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="bg-red-900/40 border-red-800 text-white">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-900/40 border-green-800 text-white">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      {showAddForm && (
        <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">Add New User</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm text-gray-400">First Name</label>
                <Input
                  id="firstName"
                  value={newUserData.firstName}
                  onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm text-gray-400">Last Name</label>
                <Input
                  id="lastName"
                  value={newUserData.lastName}
                  onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-400">Email</label>
              <Input
                id="email"
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm text-gray-400">Role</label>
              <Select 
                value={newUserData.role} 
                onValueChange={(value) => setNewUserData({...newUserData, role: value as UserRole})}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/10"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                <IconUserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </form>
        </div>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <IconSearch className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="search"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white"
        />
      </div>
      
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Role</TableHead>
              <TableHead className="text-white">Last Login</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-2"></div>
                    <span>Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                  {searchTerm ? (
                    <>No users match your search criteria</>
                  ) : (
                    <>No users found</>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-t border-white/10 hover:bg-white/5">
                  <TableCell className="text-white font-medium">{user.name}</TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'super_admin' ? 'bg-purple-900/50 text-purple-200' :
                      user.role === 'admin' ? 'bg-blue-900/50 text-blue-200' :
                      user.role === 'faculty' ? 'bg-green-900/50 text-green-200' :
                      user.role === 'staff' ? 'bg-orange-900/50 text-orange-200' :
                      'bg-gray-900/50 text-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={user.role} 
                      onValueChange={(value) => handleRoleUpdate(user.id, value)}
                    >
                      <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}