import { useRoutes } from 'react-router-dom';
import './App.css'
import MainLayout from './layouts/MainLayout';
import { routes } from './routes';
import Login from './modules/login/Login';
import AuthLayout from './layouts/AuthLayout';
import Register from './modules/register/Register';
import VarifyEmail from './modules/varifyEmail/VarifyEmail';
import { Toaster } from 'sonner';

function App() {
  const element = useRoutes([
    {
      element: <AuthLayout />,
      children: [
        { path: "/", element: <Login /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        {path: "/varifyEmail", element: <VarifyEmail />}
      ],
    },

    {
      path: "/",
      element: <MainLayout />,
      children: routes,
    },

    {
      path: "*",
      element: <Login />,
    },
  ]);
  <Toaster richColors closeButton />
  return element;
}

export default App
