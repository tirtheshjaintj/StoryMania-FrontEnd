import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import User_Login from './pages/user/User_Login';
import User_Signup from './pages/user/User_Signup';
import User_Dashboard from './pages/user/User_Dashboard';
import { GoogleOAuthProvider } from "@react-oauth/google"
import Home from './pages/Home.jsx';
import Stories from './pages/Stories.jsx';
import Story from './pages/Story.jsx';

const router=createBrowserRouter(
  createRoutesFromChildren(
    <Route path="" element={<App/>}>
    <Route path="/" element={<Home/>}/>
    <Route path="/user/login" element={<User_Login/>}/>
    <Route path="/user/signup" element={<User_Signup/>}/>
    <Route path="/user/dashboard" element={<User_Dashboard/>}/>
    <Route path="/stories" element={<Stories/>}/>
    <Route path="/story/:id" element={<Story/>}/>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
  <Provider store={store}>
  <RouterProvider router={router}/>
  </Provider>
  </GoogleOAuthProvider>
)
