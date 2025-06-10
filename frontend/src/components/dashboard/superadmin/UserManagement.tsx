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
  
  // Define fetchUsers outside useEffect so it can be used as a dependency
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const { users: fetchedUsers } = await authApi.getAllUsers(token);
      setUsers(fetchedUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch users on component mount
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]); // Added fetchUsers as a dependency
  
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user role';
      setError(errorMessage);
      console.error('Error updating user role:', err);
    }
  };
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchUsers()}
          >
            <IconRefresh className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <IconUserPlus className="h-4 w-4 mr-1" />
            Add User
          </Button>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Error and Success alerts */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-green-800 text-white border-green-700">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      {/* Users Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => handleRoleUpdate(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder={user.role} />
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
                  <TableCell>
                    {/* Add any additional action buttons here */}
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