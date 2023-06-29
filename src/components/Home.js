import {Button , Divider} from '@mui/material';
import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthContext } from './AuthContext';
import { useLogout } from './LogOut';

const provider = new GoogleAuthProvider();

export const Home =() => {
  // ./AuthContext で作成したログインユーザー情報 コンテキスト
  const { currentUser } = useAuthContext();
  const { logout } = useLogout();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();

    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage)
      });
  };
  const handleChangeEmail = (event) => {
    setEmail(event.currentTarget.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.currentTarget.value);
  };

  return (
    <div>
      <Divider sx={{ m:"15px auto",borderColor:'border.main' }} />
      {
        currentUser ?
          <Button button onClick={logout} variant="outlined">ログアウトする</Button>
          :
          <form onSubmit={handleSubmit}>
            <div>
              <Button type="submit" variant="contained">Googleアカウントでログインする</Button>
            </div>
          </form>
      }
    </div>
  );
}