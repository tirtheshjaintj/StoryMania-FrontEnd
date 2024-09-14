import { useEffect, useState } from 'react';
import StoryCard from './StoryCard';
import axios from 'axios';
import { FaSortAmountDown, FaSortAmountUp, FaCalendarAlt, FaCalendarDay } from 'react-icons/fa';
import toast from 'react-hot-toast';
import UpdateStory from './UpdateStory';
import Cookie from "universal-cookie";

const url = import.meta.env.VITE_BACKEND_URL;

function MyStories({ selectedStory, setSelectedStory }) {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAsc');
  const cookie = new Cookie();


const getStories = async () => {
  try {
    const token = cookie.get('user_token'); // Get token from cookies
    const response = await axios.get(`${url}/user/stories`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to Authorization header
      },
     
    });
    if (response.data.status) {
      console.log(response.data);
      setStories(response.data.data);
      setFilteredStories(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching stories:", error);
    toast.error("Unable to fetch stories");
  }
};


const onDelete = async (storyId) => {
  try {
    const token = cookie.get('user_token'); // Get token from cookies
    const response = await axios.delete(`${url}/stories/delete/${storyId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to Authorization header
      },
     
    });
    if (response.data.status) {
      const newStories = stories.filter((s) => s._id !== storyId);
      setStories(newStories);
      toast.success(response.data.message);
    }
  } catch (error) {
    toast.error("Unable to delete story");
  }
};


  const handleUpdate = (storyId) => {
    // Find the story to update
    const storyToUpdate = stories.find((story) => story._id === storyId);
    console.log(storyToUpdate);
    setSelectedStory(storyToUpdate);
    // Open update modal or form here
  };

  useEffect(() => {
    getStories();
  }, []);

  useEffect(() => {
    getStories();
  }, [selectedStory]);

  useEffect(() => {
    let filtered = stories.filter((story) => {
      return story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             story.plot?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dateAsc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'dateDesc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredStories(filtered);
  }, [searchTerm, sortBy, stories]);

  return (
    <div className="py-5">
      {!selectedStory && (
        <>
          <div className="flex w-full flex-col lg:flex-row gap-4 justify-between items-center mb-6">
            <div className="flex w-full gap-2 items-center justify-start">
              <input
                type="text"
                placeholder="Search by title or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 w-full border placeholder-slate-300 rounded-md lg:w-1/3 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Sorting Options */}
            <div className="flex gap-4 items-center">
              <button onClick={() => setSortBy(sortBy === 'dateAsc' ? 'dateDesc' : 'dateAsc')}>
                {sortBy === 'dateAsc' ? <FaSortAmountDown className="text-gray-600 dark:text-gray-300" /> : <FaSortAmountUp className="text-gray-600 dark:text-gray-300" />}
              </button>
              <button onClick={() => setSortBy(sortBy === 'dateAsc' ? 'dateDesc' : 'dateAsc')}>
                {sortBy === 'dateAsc' ? <FaCalendarAlt className="text-gray-600 dark:text-gray-300" /> : <FaCalendarDay className="text-gray-600 dark:text-gray-300" />}
              </button>
            </div>
          </div>
          <div className="grid gap-6 justify-items-center pt-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mx-auto">
            {filteredStories.length > 0 ? (
              filteredStories.map((story) => (
                <StoryCard
                  key={story._id}
                  story={story}
                  onUpdate={handleUpdate}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <p>No stories found</p>
            )}
          </div>
        </>
      )}
      {/* Render update form/modal */}
      {selectedStory && (
        <UpdateStory storyData={selectedStory}  setSelectedStory={setSelectedStory}/>
      )}
    </div>
  );
}

export default MyStories;
