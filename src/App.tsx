import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Box, Typography , MenuList , MenuItem} from '@mui/material';
import { Route, Routes, NavLink } from "react-router-dom";
import { Home } from "./components/Home";
import { DisplayKakeibo } from "./components/displayKakeibo";
import { NoMatch } from "./components/NoMatch";
import { useAuthContext } from './components/AuthContext';

function App() {
  // ./AuthContext で作成したログインユーザー情報 コンテキスト
  const { currentUser } = useAuthContext();

  return (
    <div className="App">
      <Box sx={{margin:'15px 0'}}>
        <Typography variant="h4" sx={{ color: 'primary.main' }}>{ currentUser ? "Hello! "+currentUser.displayName+"!" : "未ログインです。"}</Typography>
      </Box>
      <Routes>
        {/* page1 */}
        <Route path="/" element={<DisplayKakeibo />} />
        {/* 404 */}
        <Route path="*" element={<NoMatch />} />
      </Routes>
      <Home />
    </div>
  );
}

export default App;