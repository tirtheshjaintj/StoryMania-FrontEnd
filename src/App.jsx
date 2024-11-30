import { Outlet} from "react-router-dom";
import Background from "./components/background";
import Navbar from "./components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import ModeBall from "./components/modeBall";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookie from "universal-cookie";
import axios from "axios";
import { addUser } from "./store/userSlice";
const url=import.meta.env.VITE_BACKEND_URL;

function App() {
  const cookie = new Cookie();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

const getUser = async () => {
  try {
    const token = cookie.get('user_token'); // Get token from cookies
    const response = await axios.get(`${url}/user/getUser`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Add token to Authorization header
      },
      withCredentials: true,
    });
    
    const userData = response.data;
    if (userData.status) {
      dispatch(addUser(userData.user));
    } else {
      toast.error(userData.message);
      cookie.remove('user_token');
    }
  } catch (error) {
    console.log(error);
  }
};


  useEffect(()=>{
    console.log(url);
    document.title="TJ Story Mania By Tirthesh Jain";
    if( cookie.get('user_token')){
    getUser();
    }
  });

  return (
    <>
<Background>
  <Navbar user={user}/>
  <Toaster position="bottom-right"/>
  <Outlet/>
  <ModeBall/>
</Background>
    </>
  )
}

export default App
