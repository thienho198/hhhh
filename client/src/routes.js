import RootLayout from './layout/RootLayout';
import Home from './pages/home/Home';
import LoginPage from './pages/login/Login';
import {Redirect} from 'react-router-dom';

const isAuthenticated = false; 
export default [
    {
        component: LoginPage,
        path: '/login',
        exact: true
    },
    {
       component: RootLayout,
       path:'/',
       routes: [
           {
               render: ()=>isAuthenticated ? <Home/> : <Redirect to='/login'/>,
               path:'/home',
               exact: true
           }
       ]
    }
]