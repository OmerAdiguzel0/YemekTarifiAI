export interface User {
  _id: string;
  googleId: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  diyetTercihleri: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 