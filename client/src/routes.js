import RootLayout from './layout/RootLayout';
import Home from './pages/home/Home';
import LoginPage from './pages/login/Login';
import PrivateRoute from './modules/route/PrivateRoute';

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
               render: () => <PrivateRoute component={Home}/>,
               path:'/',
               exact: true
           }
       ]
    }
]

