import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FaSearch, FaUserPlus } from 'react-icons/fa';

const url = import.meta.env.VITE_BACKEND_URL;

Modal.setAppElement('#root'); // Set the root element for accessibility

const AuthorModal = ({ showModal, onClose, storyId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [existingAuthors, setExistingAuthors] = useState([]);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`${url}/story/${storyId}`);
        setExistingAuthors(response.data.authors);
      } catch (error) {
        console.error("Error fetching story:", error);
        toast.error("Unable to fetch story");
      }
    };
    fetchStory();
  }, [storyId]);

  useEffect(() => {
    if (searchTerm) {
      axios.get(`${url}/user/search`, {
        params: { query: searchTerm }
      })
        .then(response => {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data.filter(user => !existingAuthors.includes(user._id)));
        })
        .catch(error => {
          console.error('Error fetching users:', error);
          toast.error('Error fetching users.');
        });
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm, existingAuthors]);

  const handleAddAuthor = (authorId) => {
    axios.patch(`${url}/story/stories/${storyId}/add-author`, { authorId }, { withCredentials: true })
      .then(response => {
        toast.success('Author added successfully!');
        setExistingAuthors(prev => [...prev, authorId]);
        setSelectedUsers(prev => [...prev, authorId]);
        onClose();
      })
      .catch(error => {
        console.error('Error adding author:', error);
        toast.error('Failed to add author.');
      });
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
      contentLabel="Add Authors Modal"
    >
      <div className="bg-slate-200 rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-black">Add Authors</h2>

        {/* Display Existing Authors */}
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2 text-black">Existing Authors:</h3>
          <div className="flex flex-col gap-2">
            {existingAuthors.length > 0 ? (
              existingAuthors.map((authorId) => (
                <div key={authorId} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                  <span className="text-gray-800 font-medium">{authorId}</span>
                </div>
              ))
            ) : (
              <p>No existing authors.</p>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-4 flex items-center border border-gray-300 rounded-lg bg-gray-50 p-2">
          <input
            type="text"
            placeholder="Search by name, email, or phone number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-transparent text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg"
          />
          <button
            className="ml-2 text-blue-500 hover:text-blue-700"
            onClick={() => setSearchTerm('')}
          >
            <FaSearch size={18} />
          </button>
        </div>

        {/* Search Results */}
        <div className="space-y-2">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user._id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">{user.name}</span> <br />
                  <span className="text-gray-500 text-sm">{user.email}</span>
                </div>
                <button
                  onClick={() => handleAddAuthor(user._id)}
                  disabled={selectedUsers.includes(user._id)}
                  className={`ml-2 ${selectedUsers.includes(user._id) ? 'bg-gray-400' : 'bg-blue-500'} text-white hover:bg-blue-600 px-3 py-1 rounded`}
                >
                  <FaUserPlus size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className='text-black'>No users found.</p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthorModal;
