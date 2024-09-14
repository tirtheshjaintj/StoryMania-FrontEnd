import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookie from 'universal-cookie';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/stories/Sidebar';
import NewStory from '../../components/stories/NewStory';
import UpdateProfile from '../../components/stories/UpdateProfile';
import MyStories from '../../components/stories/MyStories';
import { FaArrowLeft } from 'react-icons/fa';
import Chatbot from '../../components/ChatBot';
const url = import.meta.env.VITE_BACKEND_URL;
import { useDispatch, useSelector } from "react-redux";
import { addUser } from '../../store/userSlice';

function Stories_Dashboard() {
  const cookie = new Cookie();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [openTab, setOpenTab] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [user, setUser] = useState(null); // Local state for story data
  const dispatch = useDispatch();
  const user1 = useSelector((state) => state.user);

  const getUser = async () => {
    try {
      const token=cookie.get("user_token");
      const response = await axios.get(`${url}/user/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Add token to Authorization header
        },
        withCredentials: true,
      });
      const userData = response.data;
      if (userData.status) {
        setUser(userData.user);
        dispatch(addUser(userData.user));
      } else {
        toast.error(userData.data.message);
        cookie.remove('user_token', { path: '/' });
        navigate("/user/login");
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch user data');
      cookie.remove('user_token', { path: '/' });
      navigate("/user/login");
    }
  };
  

  useEffect(() => {
    document.title = `User Dashboard`;
    let token = cookie.get('user_token');
    if (!token) navigate('/user/login');
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      toast.success(`Welcome, ${user?.name}! Let's manage your stories.`);
    }
  }, [user]);

  return (
    <div>
      <div className='flex justify-center items-center min-w-screen'>
        <div className="shadow-xl shadow-slate-50/10 border-2 dark:border-slate-50/20 mt-10 md:w-[95vw] min-h-screen flex flex-col md:flex-row justify-between rounded-3xl">
          <div className={`${!openTab ? "block" : "hidden"} md:block`}>
            <Sidebar setTab={setTab} tab={tab} setOpenTab={setOpenTab} setSelectedStory={setSelectedStory} />
          </div>
          <div className={`flex-grow min-h-screen w-[90vw] md:w-full ${openTab ? "block" : "hidden"} relative md:block p-5 border-2 md:border-b-2 md:border-r-2 md:border-t-2 rounded-3xl md:rounded-l-none dark:border-slate-50/20`}>
            <div onClick={() => setOpenTab(false)} className="absolute top-0 left-0 p-3">
              <FaArrowLeft className='text-xl block md:hidden' />
            </div>
            {tab === 0 && <NewStory />}
            {tab === 1 && <MyStories selectedStory={selectedStory} setSelectedStory={setSelectedStory} />}
            {tab === 2 && <UpdateProfile user_data={user} />}
          </div>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
}

export default Stories_Dashboard;
