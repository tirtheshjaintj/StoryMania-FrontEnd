import React from "react";
import Faq from "react-faq-component";

const data = {
    title: <div className="font-bold text-4xl text-black dark:text-white text-center mb-10">FAQs (How it Works)</div>,
    rows: [
        {
            title: <h3 className="p-2 text-xl text-black font-semibold dark:text-white">How do I start reading a story?</h3>,
            content: <p className="p-4 text-[20px] text-blac dark:text-white">To start reading, simply browse the collection of stories, choose one that interests you, and click "Start Reading." You'll be guided through an interactive journey where your choices shape the outcome.</p>,
        },
        {
            title: <h3 className="p-2 text-xl text-black font-semibold dark:text-white">Can I save my progress?</h3>,
            content: <p className="p-4 text-[20px] text-black dark:text-white">Yes, you can save your progress at any point. When you return, you'll be able to pick up exactly where you left off, or even revisit previous decisions.</p>,
        },
        {
            title: <h3 className="p-2 text-xl text-black font-semibold dark:text-white">Is the platform free to use?</h3>,
            content: <p className="p-4 text-[20px] text-black dark:text-white">Our platform offers both free and premium content. While many stories are free, some premium stories may require a small fee or subscription for full access.</p>,
        },
        {
            title: <h3 className="p-2 text-xl text-black font-semibold dark:text-white">How do I make choices in a story?</h3>,
            content: <p className="p-4 text-[20px] text-black dark:text-white">As you read, you'll encounter moments where you can make choices that affect the plot. Simply click on the option you'd like to choose, and the story will adapt based on your selection.</p>,
        },
        {
            title: <h3 className="p-2 text-xl text-black font-semibold dark:text-white">Can I share my story progress with friends?</h3>,
            content: <p className="p-4 text-[20px] text-black dark:text-white">Yes, you can share your progress or completed stories with friends via social media links available at the end of each story. Invite others to experience the same or different paths!</p>,
        },
        {
            title: <h3 className="p-2 text-xl text-black font-semibold dark:text-white">What genres of stories are available?</h3>,
            content: <p className="p-4 text-[20px] text-black dark:text-white">We offer a wide range of genres including fantasy, science fiction, mystery, romance, and more. You can filter stories by genre or explore trending stories on our homepage.</p>,
        },
        {
            title: <h3 className="p-2 text-xl text-black font-semibold dark:text-white">Can I create my own interactive stories?</h3>,
            content: <p className="p-4 text-[20px] text-black dark:text-white">Absolutely! Our platform allows you to create your own interactive fiction stories. Use our editor to craft a narrative where readers can make choices that affect the outcome. Share your story with the community once you're finished!</p>,
        },
    ],
};

const styles = {
    bgColor: 'transparent',
    titleTextColor: "white",
    titleFontWeight: "bold",
    rowTitleColor: "white",
    rowContentColor: 'gray',
    arrowColor: "white",
    rowTitleTextColor: "white",
    rowContentTextColor: "gray",
    rowContentTextSize: "14px",
};

const config = {
    animate: true,
    tabFocus: true,
};

function FAQ() {
  return (
    <div className="my-10 p-1 rounded-lg shadow-lg">
      <Faq
        data={data}
        styles={styles}
        config={config}
      />
    </div>
  );
}

export default FAQ;
