import { useState } from 'react';
import { Card, Dropdown } from 'flowbite-react';
import { FaTrash, FaPencilAlt, FaEye, FaAddressBook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthorModal from './AuthorModal'; // Import your modal component

export default function StoryCard({ story, onUpdate, onDelete }) {
  const [heroImage, setHeroImage] = useState(story.media[0] || '');
  const [showModal, setShowModal] = useState(false);

  const stripHtml = (html) => {
    let text = html.replace(/<\/?[^>]+(>|$)/g, "");
    text = text.replace(/&nbsp;|&amp;|&quot;|&lt;|&gt;/g, " ");
    return text.trim();
  };

  const handleDeleteConfirm = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(story._id);
        Swal.fire('Deleted!', 'Your story has been deleted.', 'success');
      }
    });
  };


  const handleImageClick = (image) => {
    setHeroImage(image);
  };

  return (
    <>
      <Card className="w-full shadow-lg rounded-3xl m-0 dark:bg-gray-800 relative hover:shadow-2xl">
        <div className="flex flex-col w-full h-full pt-2">
          <div className="absolute top-0 right-0 z-10 hover:bg-gray-700 shadow-2xl rounded-full p-2">
            <Dropdown label={
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
              </svg>
            } inline={true} arrowIcon={false}>
              <Dropdown.Item icon={FaEye}>
                <Link to={`/story/${story._id}`}>Read</Link>
              </Dropdown.Item>
              <Dropdown.Item icon={FaPencilAlt} onClick={() => onUpdate(story._id)}>
                Update
              </Dropdown.Item>
              <Dropdown.Item icon={FaAddressBook} onClick={() => setShowModal(true)}>
                Author
              </Dropdown.Item>
              <Dropdown.Item icon={FaTrash} onClick={handleDeleteConfirm} className="text-red-600">
                Delete
              </Dropdown.Item>
            </Dropdown>
          </div>

          <div className="flex-grow h-[20em] overflow-hidden relative">
            <div className="relative h-80 overflow-hidden mb-4">
              {heroImage && (
                <img src={heroImage} alt="Hero" className="w-full h-full object-contain" />
              )}
            </div>
            <div className="absolute bottom-0 left-0 w-full flex flex-wrap gap-4 p-4 bg-gray-900 bg-opacity-70">
              {story.media.map((image, index) => (
                <div
                  key={index}
                  className="w-1/4 h-20 overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image}
                    alt={`Story image ${index + 1}`}
                    className={`w-full h-full object-cover ${image === heroImage ? 'border-4 border-blue-500' : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 flex-grow">
            <h5 className="mb-2 text-2xl font-semibold text-center">
              {story.title.slice(0, 50) + "..." }
            </h5>
            <p className="text-base font-medium text-center">
              {stripHtml(story.plot).slice(0, 50) + "..." }
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {story.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="absolute right-0.5 bottom-0 p-5 mt-2 text-sm text-center">
              Last Updated: {new Date(story.updatedAt).toDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Author Modal */}
     {showModal && <AuthorModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        storyId={story._id}
        currentAuthors={story.authors}
      />}
    </>
  );
}
