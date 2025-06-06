import { UserRole } from '@/lib/constants';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      institutionId?: string;
      departmentId?: string;
      avatar?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    institutionId?: string;
    departmentId?: string;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    institutionId?: string;
    departmentId?: string;
  }
}