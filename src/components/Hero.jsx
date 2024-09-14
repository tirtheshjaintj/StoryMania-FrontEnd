import { Link } from "react-router-dom";

export default function Hero() {

  return (
    <div className="p-5 md:p-32 sm:py-48 lg:py-56 mt-20 md:mt-0">
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
      Stories are waiting to be read and created by You 🏰
      </h1>
      <p className="mt-6 text-lg leading-8 ">
      Welcome to TJ Story Mania by Tirthesh Jain, your ultimate solution for maintaining a clean story and organized character development.     
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          to="/user/dashboard"
          className="rounded-md text-white bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Get started
        </Link>
       
        <Link
          to="/stories" href="#steps" className="text-sm font-semibold leading-6 ">
         Read Stories <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  </div>
  )
}
