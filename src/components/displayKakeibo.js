import {Typography, Divider, Button ,FormControl , Select, InputLabel, MenuItem, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog} from '@mui/material';
import { useState, useEffect, useMemo, useLayoutEffect }  from 'react';
import { db } from '../firebase';
import {  collection, doc ,onSnapshot, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuthContext } from './AuthContext';
import { InputKakeibo } from "./InputKakeibo";

export const DisplayKakeibo = ()=> {
  // ./AuthContext で作成したログインユーザー情報 コンテキスト
  const { currentUser } = useAuthContext();
  const [shoppingDataBase, setShoppingDataBase] = useState([]);
  const [shoppingData, setShoppingData] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [filterKey, setFilterKey] = useState("すべて表示");
  const [maxPrice, setMaxPrice] = useState(0);
  const [maxPriceProduct, setMaxPriceProduct] = useState("");
  const now = new Date();

  const [dateKey, setDateKey] = useState(now.getMonth()+1);

  //データ表示：最も高い商品算出処理
  const calcMaxPriceProduct = (_ProductList) => {
    //最大値を算出
    if(_ProductList.length > 0){
      let shippingData_MaxPrice = _ProductList[0];
      _ProductList.forEach((data)=>{
        if(data.price > shippingData_MaxPrice.price){
          shippingData_MaxPrice = data;
        }
      });
      setMaxPrice(shippingData_MaxPrice.price);
      setMaxPriceProduct(shippingData_MaxPrice.product);
    }else{
      setMaxPrice(0);
      setMaxPriceProduct("");
    } 
  }

  //データ表示：月表示
  const handleDate = (event) => {
    setDateKey(Number(event.target.value))
  }

  //データ表示処理
  const getDocsFromDB = async ()=>{
    //月初
    let startDate = new Date();
    startDate.setMonth(dateKey - 1);
    startDate.setDate(1);
    startDate.setHours(0,0,0,0);
    //月末
    let endDate = new Date();
    endDate.setMonth(dateKey - 1);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23,59,59,59);

    const dataCollectionRef = query(collection(db, 'data'), where("timpstamp", ">=", startDate), where("timpstamp", "<=", endDate));
    //onSnapshot ： データベースが変更された場合、リアルタイムで検知する
    const unsub = onSnapshot(dataCollectionRef, (querySnapshot) => {
      const querySnapshotDocs_Mapped = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setShoppingDataBase(querySnapshotDocs_Mapped);
      setShoppingData(querySnapshotDocs_Mapped);

      //最大値を算出
      calcMaxPriceProduct(querySnapshotDocs_Mapped);

      setSortKey("");
      setFilterKey("すべて表示");
    });

    return unsub;
  }

  //初期表示時：データ取得
  useEffect(() => {
    let unmounted = false;

    (async ()=>{
      if(!unmounted){
        await getDocsFromDB();
      }
    })();

    return ()=>{ unmounted = true }
  }, [dateKey]);

  //「削除」フォーム送信時：データ削除
  const deleteUser = async (id) => {
    const userDocumentRef = doc(db, 'data', id);
    await deleteDoc(userDocumentRef);
  };

  //データ表示：ソート機能
  const handleSort = (event) => {
    setSortKey(event.target.value)
  }

  useEffect(() => {
    console.log("データ表示：ソート機能")
    let key = "";
    if(sortKey === "price-ascend"){
      key="price";
      //表示データをソート
      const sortedShippingData_Edit = [...shoppingData].sort((a,b)=>
        a[key] > b[key]? 1 :-1
      );
      setShoppingData(sortedShippingData_Edit);
      //ベースデータをソート
      const sortedShippingData_Base_Edit = [...shoppingDataBase].sort((a,b)=>
        a[key] > b[key]? 1 :-1
      );
      setShoppingDataBase(sortedShippingData_Base_Edit);
    }else if(sortKey === "price-descend"){
      key="price";
      //表示データをソート
      const sortedShippingData_Edit = [...shoppingData].sort((a,b)=>
        a[key] < b[key]? 1 :-1
      );
      setShoppingData(sortedShippingData_Edit);
      //ベースデータをソート
      const sortedShippingData_Base_Edit = [...shoppingDataBase].sort((a,b)=>
        a[key] < b[key]? 1 :-1
      );
      setShoppingDataBase(sortedShippingData_Base_Edit);
    }
  }, [sortKey]);

  //データ表示：フィルター機能
  const handleFilter = (event) => {
    setFilterKey(event.target.value)
  }

  useEffect(() => {
    console.log("データ表示：フィルター機能")
    if(filterKey === "すべて表示"){
      const filteredShippingData_Edit = [...shoppingDataBase]
      setShoppingData(filteredShippingData_Edit);
      
      //最大値を算出
      calcMaxPriceProduct(filteredShippingData_Edit);
    }else{
      const filteredShippingData_Edit = [...shoppingDataBase].filter(data => data.category === filterKey);
      setShoppingData(filteredShippingData_Edit);

      //最大値を算出
      calcMaxPriceProduct(filteredShippingData_Edit);
    }
  }, [filterKey]);

  //ダイアログ制御
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      {
        currentUser ? 
        <Box sx={{ maxWidth: 800 , m:"30px auto", p:"0 15px" }}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="sort-selector-label">並び替え</InputLabel>
            <Select
              labelId="sort-selector-label"
              name="sort"
              label="並び替え"
              size="small" 
              value={sortKey}
              onChange={handleSort}
            >
              <MenuItem value="price-ascend">価格 - 昇順</MenuItem>
              <MenuItem value="price-descend">価格 - 降順</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="category-selector-label">カテゴリー</InputLabel>
            <Select
              labelId="category-selector-label"
              name="category"
              label="カテゴリー"
              size="small" 
              value={filterKey}
              onChange={handleFilter}
            >
              <MenuItem value="すべて表示">すべて表示</MenuItem>
              <MenuItem value="日用品">日用品</MenuItem>
              <MenuItem value="外食">外食</MenuItem>
              <MenuItem value="お買い物">お買い物</MenuItem>
              <MenuItem value="スイーツ">スイーツ</MenuItem>
              <MenuItem value="その他">その他</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="month-selector-label">月</InputLabel>
            <Select
              labelId="month-selector-label"
              name="month"
              label="月"
              size="small" 
              value={dateKey}
              onChange={handleDate}
            >
              <MenuItem value="1">1月</MenuItem>
              <MenuItem value="2">2月</MenuItem>
              <MenuItem value="3">3月</MenuItem>
              <MenuItem value="4">4月</MenuItem>
              <MenuItem value="5">5月</MenuItem>
              <MenuItem value="6">6月</MenuItem>
              <MenuItem value="7">7月</MenuItem>
              <MenuItem value="8">8月</MenuItem>
              <MenuItem value="9">9月</MenuItem>
              <MenuItem value="10">10月</MenuItem>
              <MenuItem value="11">11月</MenuItem>
              <MenuItem value="12">12月</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ m:"15px auto" }}>
            <Typography variant="body1" sx={{ color:'primary.main' }}>選択カテゴリー：{filterKey}</Typography>
            {maxPriceProduct ? <Typography variant="body1" sx={{ color:'primary.main' }}>一番高かったもの：{maxPriceProduct} ({maxPrice.toLocaleString()}円)</Typography>: ""}
          </Box>
        
          <TableContainer sx={{ m:"30px auto" }}>
            <Table sx={{ minWidth: 420 }} aria-label="purchase list">
              <TableHead>
                <TableRow>
                  <TableCell>買い物</TableCell>
                  <TableCell align="right">カテゴリー</TableCell>
                  <TableCell align="right">購入額</TableCell>
                  <TableCell align="right">削除</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  shoppingData.map((
                    data
                    ) => (
                    <TableRow
                      key={data.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                      <TableCell component="th" scope="row">
                        {data.product}
                      </TableCell>
                      <TableCell align="right">{data.category}</TableCell>
                      <TableCell align="right">{data.price.toLocaleString()}</TableCell>
                      <TableCell align="right"><Button variant="outlined" color="error" size="small" onClick={() => deleteUser(data.id)}>削除</Button></TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant="contained" onClick={handleClickOpen}>
            レシートを登録
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <InputKakeibo setOpen={setOpen} />
          </Dialog>
        </Box>
        :
        ""
      }
    </div>
  );
}