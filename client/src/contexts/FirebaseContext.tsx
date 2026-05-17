import React, { createContext, useContext, useEffect, useState } from 'react';

interface MockUser {
  uid: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  role: 'client';
}

interface StoredAccount extends MockUser {
  password: string;
}

interface EmailAuthInput {
  email: string;
  password: string;
}

interface RegisterInput extends EmailAuthInput {
  firstName: string;
  lastName: string;
}

interface FirebaseContextType {
  user: MockUser | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (input: EmailAuthInput) => Promise<void>;
  registerWithEmail: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);
const USER_KEY = 'kwetu-demo-user';
const USERS_KEY = 'kwetu-demo-accounts';

const demoGoogleUser: MockUser = {
  uid: 'demo-google-user',
  firstName: 'Kwetu',
  lastName: 'Client',
  displayName: 'Kwetu Client',
  email: 'client@kwetu.local',
  photoURL: null,
  role: 'client',
};

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function readStoredAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return [];
  const savedAccounts = window.localStorage.getItem(USERS_KEY);
  if (!savedAccounts) return [];
  return JSON.parse(savedAccounts) as StoredAccount[];
}

function writeStoredAccounts(accounts: StoredAccount[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem(USER_KEY);
    if (saved) {
      setUser(JSON.parse(saved) as MockUser);
    }
    setLoading(false);
  }, []);

  const persistUser = (nextUser: MockUser) => {
    window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const loginWithGoogle = async () => {
    persistUser(demoGoogleUser);
  };

  const loginWithEmail = async ({ email, password }: EmailAuthInput) => {
    const accounts = readStoredAccounts();
    const account = accounts.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
    );

    if (!account) {
      throw new Error('Invalid email or password');
    }

    const { password: _password, ...safeUser } = account;
    persistUser(safeUser);
  };

  const registerWithEmail = async ({ firstName, lastName, email, password }: RegisterInput) => {
    const accounts = readStoredAccounts();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (accounts.some((item) => item.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists');
    }

    const nextAccount: StoredAccount = {
      uid: createId('user'),
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      displayName: `${trimmedFirstName} ${trimmedLastName}`.trim(),
      email: normalizedEmail,
      photoURL: null,
      role: 'client',
      password,
    };

    writeStoredAccounts([nextAccount, ...accounts]);
    const { password: _password, ...safeUser } = nextAccount;
    persistUser(safeUser);
  };

  const login = async () => {
    await loginWithGoogle();
  };

  const logout = async () => {
    window.localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <FirebaseContext.Provider
      value={{ user, loading, login, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
