
import React, {useEffect, useState } from 'react';
import Login from 'modules/credential/login/Login';
import axios from 'axios/mainAxios';
import {ACCOUNT} from 'config/apis';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    axios.get(ACCOUNT.getInfo)
    .then(()=>{
      setIsLoggedIn(true);
    })
    .catch(err=>{
      console.log(err);
      setIsLoggedIn(false);
    })
  },[])

  return isLoggedIn ? <div>Dang nhap thanh cong</div> : <Login />;
}

export default App;
