import { createContext, useContext, useState, useEffect } from 'react';
import { getSession, saveSession, clearSession, getUsers, saveUsers } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const login = (userData) => {
    const session = { ...userData, password: undefined, loginAt: new Date().toISOString() };
    saveSession(session);
    setUser(session);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const register = (formData) => {
    const users = getUsers();
    // Check duplicate email
    if (users.find(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
      throw new Error("Email already registered");
    }
    const newUser = {
      id:        Date.now().toString(),
      firstName: formData.firstName,
      lastName:  formData.lastName,
      name:      `${formData.firstName} ${formData.lastName}`,
      email:     formData.email,
      phone:     formData.phone || "",
      password:  btoa(formData.password),
      role:      formData.role || "user",
      plan:      formData.role === "premium" ? "Premium" : formData.role === "admin" ? "Admin" : "Free",
      joinedAt:  new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    return newUser;
  };

  const authenticate = (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("No account found with this email.");
    if (user.password !== btoa(password)) throw new Error("Incorrect password.");
    return user;
  };

  const resetPassword = (email, newPassword) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) throw new Error("User not found");
    users[idx] = { ...users[idx], password: btoa(newPassword) };
    saveUsers(users);
  };

  const emailExists = (email) => {
    const users = getUsers();
    return !!users.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    saveSession(updated);
    setUser(updated);
    // Also update in users DB
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) { users[idx] = { ...users[idx], ...updates }; saveUsers(users); }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, authenticate, resetPassword, emailExists, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
