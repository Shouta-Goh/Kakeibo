// ***** Googleログイン状態を監視するコンポーネント *****
import React,{ createContext, useState , useEffect, useContext } from 'react';
import { auth } from '../firebase';

type User = {
  displayName: string | null | undefined;
  email: string | null | undefined;
};
type Props = {
  children: JSX.Element,
};
type AuthContextProps = {
  currentUser: User | null | undefined;
};

const AuthContext = createContext<AuthContextProps>({ currentUser: undefined });

export const AuthProvider = ({ children }:Props) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // ログイン状態が変化すると呼ばれる
      setCurrentUser(user);
    });
  }, []);
  return (
    <AuthContext.Provider value={{ currentUser: currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);