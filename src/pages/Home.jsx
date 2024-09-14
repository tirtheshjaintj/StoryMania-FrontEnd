import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import Steps from '../components/Steps'
import ShuffleHero from '../components/Shuffle'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import Chatbot from '../components/ChatBot'

function Home() {
  useEffect(()=>{
    document.title="TJ Story Mania By Tirthesh Jain";
  },[]);
  return (
    <>
<Hero/>
<Steps/>
<ShuffleHero/>
<FAQ/>
<Footer/>
<Chatbot/>
</>
)
}

export default Home