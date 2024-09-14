import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ShuffleHero = () => {
  return (
    <section className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div> 
        <h3 className="text-4xl  md:text-6xl font-semibold">
        Dive Into Interactive Stories 📖
        </h3>
        <p className="text-base  md:text-lg  my-4 md:my-6">
        Explore an endless world of interactive fiction where your choices shape the narrative. Discover new adventures with every click.
        </p>
      </div>
      <ShuffleGrid />
    </section>
  );
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: "minion.png",
  },
  {
    id: 2,
    src: "onepunch.webp",
  },
  {
    id: 3,
    src: "minon.png",
  },
  {
    id: 4,
    src: "harrypotter.png",
  },
  {
    id: 5,
    src: "hermoine.png",
  },
  {
    id: 6,
    src: "girl.png",
  },
  {
    id: 7,
    src: "babyboss.png",
  },
  {
    id: 8,
    src: "samurai.png",
  },
  {
    id: 9,
    src: "ant.png",
  },
  {
    id: 10,
    src: "naruto.png",
  },
  {
    id: 11,
    src: "kakashi.png",
  },
  {
    id: 12,
    src: "zoro.png",
  },
  {
    id: 13,
    src: "luffy.png",
  },
  {
    id: 14,
    src: "spongbob.png",
  },
  {
    id: 15,
    src: "jerry.png",
  },
  {
    id: 16,
    src: "mouse.png",
  },
 
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "contain", // Ensure the entire image is shown
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center", // Center the image
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());
    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default ShuffleHero;