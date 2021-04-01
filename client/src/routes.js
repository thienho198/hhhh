import RootLayout from './layout/RootLayout';
import Home from './pages/home/Home';
import LoginPage from './pages/login/Login';
import PrivateRoute from './modules/route/PrivateRoute';
import AdminPage from './pages/admin/Admin';
import { Redirect } from 'react-router';
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
               render:()=> <PrivateRoute roles={['admin','super admin']} component={AdminPage}/>,
               path:'/admin',
               exact: true
           },
           {
               render: () => <PrivateRoute roles={['super admin','admin','user','librarian']} component={Home}/>,
               path:'/',
               exact: true
           },
           {
               render: () => <div>Page not found</div>, 
               path:'/',
           }
       ]
    }

]

