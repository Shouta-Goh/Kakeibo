import {Button , TextField, InputLabel, MenuItem, Box, DialogTitle, DialogContent, DialogActions, DialogContentText} from '@mui/material';
import { useState, useEffect }  from 'react';
import { db } from '../firebase';
import {  collection, doc ,onSnapshot, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthContext } from './AuthContext';

export const InputKakeibo = (props)=> {
  // ./AuthContext で作成したログインユーザー情報 コンテキスト
  const { currentUser } = useAuthContext();

  //「登録」フォーム送信時：データ追加
  const handleSubmit = async (event) => {
    try{
      event.preventDefault();
      const { product, price, category } = event.target.elements;
      event.target.elements[event.target.elements.length-1].disabled=true;
      const dataCollectionRef = collection(db, 'data');
      const documentRef = await addDoc(dataCollectionRef, {
        user: currentUser.displayName,
        product: product.value,
        price: Number(price.value),
        category: category.value,
        timpstamp: serverTimestamp(),
      });
      event.target.reset();
      event.target.elements[event.target.elements.length-1].disabled=false;
    } catch (err) {
      console.log(`Error: ${JSON.stringify(err)}`);
      alert("エラーが発生しました。ページを再表示します。")
      window.location.reload()
    }
  };

  //ダイアログ制御
  const handleClickOpen = () => {
    props.setOpen(true);
  };
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
        textAlign:'left',
      }}
      noValidate
      autoComplete="on"
      onSubmit={handleSubmit}
      >   
      <DialogTitle>レシート追加</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex',justifyContent: 'flex-start',alignItems: 'center', flexWrap: {
          xs: 'wrap',
          md:'nowrap'
        },}}>
          <InputLabel id="product-label" sx={{ width: 150 }}>買ったものは？</InputLabel>
          <TextField labelId="product-label" label="商品名" variant="outlined" name="product" type="text" size="small" margin="normal" />
        </Box>
        <Box sx={{ display: 'flex',justifyContent: 'flex-start',alignItems: 'center', flexWrap: {
          xs: 'wrap',
          md:'nowrap'
        }, }}>
          <InputLabel id="price-label" sx={{ width: 150 }}>いくら買ったの？</InputLabel>
          <TextField labelId="price-label" label="購入額" variant="outlined" name="price" type="number" size="small" margin="normal" />
        </Box>
        <Box sx={{ display: 'flex',justifyContent: 'flex-start',alignItems: 'center', flexWrap: {
          xs: 'wrap',
          md:'nowrap'
        }, }}>
          <InputLabel id="category-label" sx={{ width: 150 }}>どういう系？</InputLabel>
          <TextField
            select
            labelId="category-label"
            name="category"
            label="カテゴリー"
            size="small" 
          >
            <MenuItem value="商品カテゴリーを選択">商品カテゴリーを選択</MenuItem>
            <MenuItem value="日用品">日用品</MenuItem>
            <MenuItem value="外食">外食</MenuItem>
            <MenuItem value="お買い物">お買い物</MenuItem>
            <MenuItem value="スイーツ">スイーツ</MenuItem>
            <MenuItem value="その他">その他</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button type="submit" onClick={handleClose}>登録</Button>
      </DialogActions>
    </Box>
  );
}