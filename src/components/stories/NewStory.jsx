import { useState, useEffect } from 'react';
import axios from 'axios';
import TagsInput from 'react-tagsinput';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { Editor } from '@tinymce/tinymce-react';

const url = import.meta.env.VITE_BACKEND_URL;

const NewStory = () => {
  const [title, setTitle] = useState('');
  const [plot, setPlot] = useState('');
  const [tags, setTags] = useState([]);
  const [genre, setGenre] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Story Mania | Create New Story';

    // Fetch genres from backend
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${url}/genres`);
        setGenres(response.data);
      } catch (error) {
        toast.error('Error fetching genres: ' + error.message);
      }
    };

    fetchGenres();
  }, []);

  const handleImageChange = (files) => {
    const validImages = files.filter(file => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type));
    if (validImages.length !== files.length) {
      toast.error('Some files are not valid images');
    }
    setImageFiles(prevFiles => [...prevFiles, ...validImages]);
    const previews = validImages.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...previews]);
  };

  const removeImage = (index) => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length + imageFiles.length > 10) {
      toast.error('You can only upload up to 10 images');
      return;
    }
    handleImageChange(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true, accept: 'image/*' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    if (!title || !plot || !genre || !tags.length) {
      toast.error('All fields are required');
      setIsSubmitting(false);
      return;
    }
  
    if (imageFiles.length < 1) {
      toast.error('You must upload at least one image.');
      setIsSubmitting(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('plot', plot);
    formData.append('genre', genre);
    formData.append('tags', JSON.stringify(tags));
    imageFiles.forEach(image => formData.append('images', image));
  
    try {
      const token = new Cookie().get('user_token'); // Get token from cookies
      await axios.post(`${url}/story/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Add token to Authorization header
        },
       
      });
      toast.success('Story created successfully');
      // Reset the form
      setTitle('');
      setPlot('');
      setGenre('');
      setTags([]);
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      toast.error('Error creating story: ' + (error.response?.data?.message || error.message));
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="w-full p-2 min-h-screen">
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
            onEditorChange={(content) => setPlot(content)}
            apiKey='t866eglfosscw3v3dedu32wsdfjqe5ce4qeqmom6o1kv4kfl'
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
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="mt-1 block w-full p-2 placeholder-slate-200 dark:bg-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select a genre</option>
            {genres.map((g, index) => (
              <option key={index} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Tags</label>
          <TagsInput
            value={tags}
            onChange={(newTags) => setTags(Array.from(new Set(newTags.map(tag => tag.toLowerCase()))))}
            className="mt-1 block w-full p-2 placeholder-slate-200 bg-white p-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Images</label>
          <div {...getRootProps({ className: 'dropzone mt-1 block w-full p-2 placeholder-slate-200 dark:bg-gray-600 border-gray-300 rounded-md shadow-sm' })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some images here, or click to select images</p>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-10">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img src={preview} alt="Preview" className="w-full p-2 h-40 object-contain rounded-md" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
        <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 mr-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? 'Creating...' : 'Create Story'}
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default NewStory;
