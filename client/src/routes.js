import RootLayout from './layout/RootLayout';
import Home from './pages/home/Home';
import LoginPage from './pages/login/Login';
import PrivateRoute from './modules/route/PrivateRoute';
import AdminPage from './pages/admin/Admin';
import RolePage from './pages/role/Role';
import NotFoundPage from './pages/not-found/NotFound';
import UserPage from './pages/user/User';
import MenuPage from './pages/menu/MenuPage';

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
               render:()=> <PrivateRoute roles={['admin','super admin']} component={RolePage}/>,
               path:'/Admin/Role',
               exact: true
           },
           {
            render:()=> <PrivateRoute roles={['admin','super admin']} component={MenuPage}/>,
            path:'/Admin/Menu',
            exact: true
            },
            {
                render:()=> <PrivateRoute roles={['admin','super admin']} component={UserPage}/>,
                path:'/Admin/User',
                exact: true
            },
           {
               render: () => <PrivateRoute roles={['super admin','admin','user','librarian']} component={Home}/>,
               path:'/',
               exact: true
           },
           {
               render: () => <NotFoundPage />, 
               path:'/',
           }
       ]
    }

]

