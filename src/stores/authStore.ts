import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  hasPermission: (action: string) => boolean;
}

const rolePermissions: Record<UserRole, string[]> = {
  'Administrator': ['*'],
  'Collaborator': ['create_project', 'edit_project', 'upload_document', 'edit_document', 'comment'],
  'Viewer': ['view_project', 'view_document', 'comment'],
  'Approver': ['view_project', 'view_document', 'approve', 'reject', 'comment'],
  'Legal Reviewer': ['view_project', 'view_document', 'edit_legal', 'approve_legal', 'comment'],
  'Finance Approver': ['view_project', 'view_document', 'edit_finance', 'approve_finance', 'comment'],
};

export const useAuthStore = create<AuthStore>()(  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (email: string, _password: string) => {
        // Mock login - replace with actual API call
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email,
          role: 'Administrator',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          department: 'Legal',
          status: 'active',
          createdAt: new Date().toISOString(),
        };

        set({
          user: mockUser,
          isAuthenticated: true,
          token: 'mock-jwt-token',
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      hasPermission: (action: string) => {
        const { user } = get();
        if (!user) return false;

        const permissions = rolePermissions[user.role];
        return permissions.includes('*') || permissions.includes(action);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);