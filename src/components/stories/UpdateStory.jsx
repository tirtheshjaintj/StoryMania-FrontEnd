import { useState, useEffect } from 'react';
import axios from 'axios';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import toast from 'react-hot-toast';
import { FaEdit } from 'react-icons/fa';
import { Editor } from '@tinymce/tinymce-react';
import Cookie from "universal-cookie";


const url = import.meta.env.VITE_BACKEND_URL;

function UpdateStory({ storyData,setSelectedStory}) {
  const [title, setTitle] = useState('');
  const [plot, setPlot] = useState('');
  const [tags, setTags] = useState([]);
  const [genre, setGenre] = useState('');
  const [image, setImage] = useState(null);
  const [media, setMedia] = useState([]); // Holds media URLs
  const [imagePreview, setImagePreview] = useState(''); // New image preview
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cookie = new Cookie();

  useEffect(() => {
    document.title = `Update Story`;
    console.log(storyData);
    if (storyData) {
      setTitle(storyData.title || '');
      setPlot(storyData.plot || '');
      setTags(storyData.tags || []);
      setGenre(storyData.genre || '');
      setMedia(storyData.media || []); // Set media from storyData
    }
  }, [storyData]);

  const validateImage = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(file.type);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && validateImage(file)) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Set preview for the new image
    } else {
      toast.error('Invalid image file. Please upload a valid image.');
    }
    event.target.value = ''; // Clear the file input
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    setIsSubmitting(true);
  
    if (!title || !plot || !tags.length || !genre) {
      toast.error('All fields are required');
      setIsSubmitting(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('plot', plot);
    formData.append('tags', JSON.stringify(tags));
    formData.append('genre', genre);
    if (image) {
      formData.append('image', image); // Append new image if it exists
    }
  
    try {
      const token = cookie.get('user_token'); // Get token from cookies
      const response = await axios.put(`${url}/story/update/${storyData?._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Add token to Authorization header
        },
        withCredentials: true
      });
  
      toast.success('Story updated successfully');
      setSelectedStory(null);
      // Reset the form
      setTitle('');
      setPlot('');
      setTags([]);
      setGenre('');
      setImage(null);
      setImagePreview('');
      setMedia([]); // Clear media preview
    } catch (error) {
      console.error(error);
      toast.error('Error updating story: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="w-full p-4 min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col w-full p-2 placeholder-slate-200">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 placeholder-slate-200 dark:bg-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add Title Here"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Plot</label>
          <Editor
            value={plot}
            apiKey='t866eglfosscw3v3dedu32wsdfjqe5ce4qeqmom6o1kv4kfl'
            onEditorChange={(content) => setPlot(content)}
            init={{
              height: 300,
              menubar: false,
              plugins: 'lists link image code',
              toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="mt-1 block w-full p-2 placeholder-slate-200 dark:bg-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add Genre Here"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tags</label>
          <TagsInput
            value={tags}
            onChange={(newTags) => {
              // Convert all tags to lowercase and remove duplicates
              const uniqueLowercaseTags = Array.from(new Set(newTags.map((tag) => tag.toLowerCase())));
              setTags(uniqueLowercaseTags);
            }}
            className="mt-1 block w-full p-2 placeholder-slate-200 bg-white p-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Existing Media</label>
          <div className="flex gap-2">
            {media.map((mediaUrl, index) => (
              <img key={index} src={mediaUrl} alt={`Media ${index}`} className="w-24 h-24 object-cover rounded-md" />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 placeholder-slate-200 dark:bg-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="w-full p-2 h-40 object-contain rounded-md" />
            </div>
          )}
        </div>
        <div className='flex justify-end'>
          <button
            type="submit"
            className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 dark:text-white dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            disabled={isSubmitting}
          >
            {!isSubmitting ? (
              <div className='flex items-center'>Update Story&nbsp;<FaEdit /></div>
            ) : (
              <div className="flex items-center justify-center">
                <div className='flex items-center'>Updating Story&nbsp;</div>
                <div className="spinner border-t-transparent border-solid animate-spin rounded-full border-white border-4 h-6 w-6"></div>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateStory;
