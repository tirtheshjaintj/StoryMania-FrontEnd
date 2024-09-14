import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { FaPencilAlt } from 'react-icons/fa';
import { addUser } from '../../store/userSlice'; // Assuming this action is for adding user to store
const url = import.meta.env.VITE_BACKEND_URL;
import Cookie from "universal-cookie";

function UpdateProfile({ user_data }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cookie = new Cookie();

  useEffect(() => {
    document.title = 'Story Mania | Update Profile';
    console.log(user_data);
  }, []);

  const [user, setUser] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user_data) {
      setUser(user_data);
    }
  }, [user_data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (user.name && !/^[a-zA-Z\s]+$/.test(user.name)) {
      newErrors.name = 'Name must contain only letters and spaces.';
    }
    if (user.phone_number && !/^[0-9]{10}$/.test(user.phone_number)) {
      newErrors.phone_number = 'Phone number must contain exactly 10 digits.';
    }
    if (user.address && user.address.length < 10) {
      newErrors.address = 'Address must be at least 10 characters long.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const token = cookie.get('user_token'); // Get token from cookies
      const response = await axios.put(`${url}/user/update`, user, {
        headers: {
          'Authorization': `Bearer ${token}` // Add token to Authorization header
        },
       
      });
      if (response.data.status) {
        toast.success('Profile updated successfully!');
        if (response.data.user) {
          dispatch(addUser(response.data.user)); // Dispatch updated user data to store
        }
      }
    } catch (error) {
      toast.error(`Error updating profile: ${error.response?.data?.message || 'Unknown error'}`);
    }
    setIsSubmitting(false);
  };
  

  return (
    <div className="w-full p-4 min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col w-full p-2">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 placeholder-slate-200 dark:bg-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={user.phone_number}
            onChange={handleChange}
            className="mt-1 block w-full p-2 placeholder-slate-200 dark:bg-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your phone number"
          />
          {errors.phone_number && <p className="text-red-600 text-sm mt-1">{errors.phone_number}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={user.address}
            onChange={handleChange}
            className="mt-1 block w-full p-2 placeholder-slate-200 dark:bg-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your address"
            rows={4}
          />
          {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 dark:text-white dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            disabled={isSubmitting}
          >
            {!isSubmitting ? (
              <div className="flex items-center">Update Profile&nbsp;<FaPencilAlt /></div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="flex items-center">Updating Profile&nbsp;</div>
                <div className="spinner border-t-transparent border-solid animate-spin rounded-full border-white border-4 h-6 w-6"></div>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
