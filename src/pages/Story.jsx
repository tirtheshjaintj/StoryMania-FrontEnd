import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitizing HTML
import { Card } from 'flowbite-react';

const url = import.meta.env.VITE_BACKEND_URL;

function Story() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`${url}/story/${id}`);
        setStory(response.data);
        document.title=`${response?.data?.title} || Story Mania`;
        setHeroImage(response.data.media[0] || ''); // Set initial hero image
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching story:", error);
        toast.error("Unable to fetch story");
      }
    };
    fetchStory();
  }, [id]);

  if (!story) return <div>Loading...</div>;

  const handleImageClick = (image) => {
    setHeroImage(image);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg rounded-3xl dark:bg-gray-800 relative hover:shadow-2xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left section: Hero image and gallery */}
          <div className="flex-grow">
            {/* Hero Image */}
            <div className="relative h-80 overflow-hidden mb-4">
              {heroImage && (
                <img
                  src={heroImage} // Use the hero image from state
                  alt="Hero"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Gallery: Additional images */}
            <div className="flex flex-wrap gap-4">
              {story.media.map((image, index) => (
                <div
                  key={index}
                  className="w-1/4 h-40 overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(image)} // Set hero image on click
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

          {/* Right section: Story details */}
          <div className="flex flex-col justify-between w-full md:w-1/2">
            {/* Story Title */}
            <h1 className="text-4xl font-bold mb-4">{story.title}</h1>

            {/* Story Plot (Rendered as sanitized HTML) */}
            <div
              className="text-lg font-medium mb-4"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.plot) }} // Sanitize the HTML using DOMPurify
            />

            {/* Genre */}
            <p className="text-base font-semibold mb-2">
              Genre: <span className="text-gray-500">{story.genre}</span>
            </p>

            {/* Authors */}
            {story.authors && (
              <p className="text-base font-semibold mb-4">
                Author Name(s):{" "}
                {story.authors.map((author, index) => (
                  <span key={index}>
                    {author}
                    {index < story.authors.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {story.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Last Updated */}
            <p className="text-sm text-gray-500 mt-4">
              Last Updated: {new Date(story.updatedAt).toDateString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Story;
