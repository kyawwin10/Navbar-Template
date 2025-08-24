import { useRoutes } from 'react-router-dom';
import './App.css'
import MainLayout from './layouts/MainLayout';
import { routes } from './routes';

function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: routes,
    },
  ]);

  return element;
}

export default App
