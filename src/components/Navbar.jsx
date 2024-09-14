import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "universal-cookie";

export default function Nav({user}) {
  const navigate=useNavigate(); 
  const cookie = new Cookie();
  const dispatch = useDispatch();
  const logOut=()=>{
    cookie.remove('user_token');
    navigate("/user/login");
    dispatch(addUser(null));
  }
  
  return (
    <Navbar fluid rounded className="z-10 pl-5 pr-5">
      <Link to="/" className="flex items-center">
        <img src="storymania.jpg" className="mr-3 h-12 sm:h-12" alt="StoryMania" />
        <span className="self-center whitespace-nowrap text-xl font-semibold">StoryMania</span>
      </Link>

      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" rounded />
          }
        >
         
          {user?<> 
          <Dropdown.Header>
            <span className="block text-sm">{user?.name}</span>
            <span className="block truncate text-sm font-medium">{user?.email}</span>
          </Dropdown.Header>
          <Dropdown.Item>
          <Link to="user/dashboard">
            Dashboard
          </Link>
          </Dropdown.Item>
          <Dropdown.Item onClick={logOut}>Sign out</Dropdown.Item>
          </>
          :<>
           <Dropdown.Item>
          <Link to="user/login">
            User Login
          </Link>
          </Dropdown.Item>
          <Dropdown.Item>
          <Link to="user/signup">
            User Signup
          </Link>
          </Dropdown.Item>
          </>}
        </Dropdown>
      </div>

    </Navbar>
  );
}
