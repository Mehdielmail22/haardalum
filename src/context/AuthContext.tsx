import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  getToken: () => string | null;
  handleAuthError: (response: Response) => Promise<boolean>; // Add new error handling function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Initialize auth state by validating stored token
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        // Validate token with backend before setting user state
        try {
          const response = await fetch('http://localhost:5000/api/profile', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          } else {
            // Token is invalid, clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } catch (error) {
          // Network error or server unavailable, clear localStorage to be safe
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('user', JSON.stringify(userData)); // Persist user data
    localStorage.setItem('token', jwtToken); // Persist token
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user'); // Clear user data
    localStorage.removeItem('token'); // Clear token
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  // New function to handle authentication-related errors
  const handleAuthError = async (response: Response): Promise<boolean> => {
    if (response.status === 401) {
      logout(); // Log out the user
      navigate('/login'); // Redirect to login page
      return true; // Indicate that the error was handled
    }
    return false; // Indicate that the error was not handled (or not a 401)
  };

  return (
    <AuthContext.Provider value={{ user, token, isInitialized, login, logout, getToken, handleAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
