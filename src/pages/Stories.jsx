import axios from "axios";
import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const url = import.meta.env.VITE_BACKEND_URL;

const StoryCard = ({ story }) => {
    const [heroImage, setHeroImage] = useState(story.media[0]);

    // Function to remove HTML tags from the plot// Function to remove HTML tags and special entities like &nbsp;
const stripHtml = (html) => {
  // First, remove HTML tags
  let text = html.replace(/<\/?[^>]+(>|$)/g, "");
  
  // Then, remove common HTML entities like &nbsp;, &amp;, etc.
  text = text.replace(/&nbsp;|&amp;|&quot;|&lt;|&gt;/g, " ");

  // Optionally, you can add more entities to be replaced as needed
  return text.trim(); // Trim spaces at the start and end
};


    return (
        <Card className="w-full shadow-lg rounded-3xl m-0 h-full relative hover:shadow-2xl">
            <div className="flex flex-col w-full h-full pt-2">
                {/* Image/Thumbnail Section */}
                <div className="relative h-80 overflow-hidden mb-4">
                    {heroImage && (
                        <img
                            src={heroImage}
                            alt="Hero"
                            className="w-full h-full object-contain transition-transform duration-300 ease-in-out transform hover:scale-105"
                        />
                    )}
                </div>

                {/* Gallery: Additional images */}
                <div className="flex flex-wrap gap-4 p-2 bg-gray-900 bg-opacity-70 rounded-lg">
                    {story.media.map((image, index) => (
                        <div
                            key={index}
                            className={`w-1/4 h-32 overflow-hidden cursor-pointer relative transition-transform duration-300 ease-in-out transform hover:scale-105 ${
                                image === heroImage ? 'border-4 border-blue-500' : ''
                            }`}
                            onClick={() => setHeroImage(image)}
                        >
                            <img
                                src={image}
                                alt={`Story image ${index + 1}`}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ))}
                </div>

                {/* Text/Description Section */}
                <Link to={`/story/${story._id}`}>
                    <div className="p-5 flex-grow rounded-b-lg">
                        <h5 className="mb-2 text-2xl font-semibold text-center">
                            {story.title.slice(0, 50) + "..."}
                        </h5>
                        <p className="text-base font-medium text-center">
                            {/* Use the stripHtml function to remove HTML tags from the plot */}
                            {stripHtml(story.plot).slice(0, 50) + "..."}
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
                        <p className="mt-4 text-sm text-center text-gray-400">
                            Last Updated: {new Date(story.updatedAt).toDateString()}
                        </p>
                    </div>
                </Link>
            </div>
        </Card>
    );
};

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getStories = async () => {
      try {
        const response = await axios.put(`${url}/story/stories`, {
          withCredentials: true,
        });

        if (response.data.status) {
          setStories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        toast.error("Unable to fetch stories");
      }
    };
    getStories();
  }, []);

  // Filter stories based on search term
  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.plot.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Function to remove HTML tags from the plot
  const stripHtml = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // Regex to remove HTML tags
  };

  return (
    <div>
      {/* Search Input */}
      <div className="w-full max-w-md mx-auto mt-6">
        <input
          type="text"
          className="w-full p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search stories by title, description, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {filteredStories.length > 0 ? (
          filteredStories.map((story) => <StoryCard key={story._id} story={story} />)
        ) : (
          <p className="text-center text-gray-500">No stories found.</p>
        )}
      </div>
    </div>
  );
};



export default Stories;
