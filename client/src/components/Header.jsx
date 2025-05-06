import React, { useState } from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [isScholarlyMenuOpen, setIsScholarlyMenuOpen] = useState(false);

  // Smooth scrolling function to center sections in the viewport.
  const handleScroll = (sectionId) => {
    const sections = document.querySelectorAll("section");
    let targetSection;

    if (sectionId === "explore") {
      // Scroll to the second section (index 1) for Explore
      if (sections.length > 1) {
        targetSection = sections[1];
      }
    } else if (sectionId === "features") {
      // Scroll to the third section (index 2) for Features
      if (sections.length > 2) {
        targetSection = sections[2];
      }
    } else {
      // Scroll to top for Home
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (targetSection) {
      const viewportHeight = window.innerHeight;
      const sectionHeight = targetSection.offsetHeight;
      let scrollPosition;
      if (sectionHeight < viewportHeight) {
        scrollPosition = targetSection.offsetTop - (viewportHeight - sectionHeight) / 2;
      } else {
        scrollPosition = targetSection.offsetTop;
      }
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  // Navigate based on whether the user is signed in.
  const navigateToHome = () => {
    if (isSignedIn) {
      navigate("/home");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="flex items-center justify-between p-6 md:px-16 lg:px-16 bg-white shadow-md sticky top-0 z-50">
      {/* Logo on the left */}
      <button
        onClick={() => handleScroll("home")}
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 cursor-pointer"
      >
        GradView
      </button>

      {/* Navigation */}
      <nav className="flex-1 flex justify-center">
        {/* Navigation for non-signed-in users */}
        <SignedOut>
          <div className="flex space-x-10">
            <button
              onClick={() => {
                handleScroll("home");
                navigateToHome();
              }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-medium hover:font-semibold transition-all cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => {handleScroll("explore");navigateToHome();}}
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-medium hover:font-semibold transition-all cursor-pointer"
            >
              Explore
            </button>
            <button
              onClick={() => {handleScroll("features");navigateToHome();}}
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-medium hover:font-semibold transition-all cursor-pointer"
            >
              Features
            </button>
          </div>
        </SignedOut>
        
        {/* Navigation for signed-in users */}
        <SignedIn>
          <div className="flex space-x-6">
            <Link
              to="/home"
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-medium hover:font-semibold transition-all"
            >
              Home
            </Link>
            <Link
              to="/dash"
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-medium hover:font-semibold transition-all"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-medium hover:font-semibold transition-all"
            >
              Profile
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsScholarlyMenuOpen(!isScholarlyMenuOpen)}
                className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-medium hover:font-semibold transition-all cursor-pointer"
              >
                Scholarly Work ▼
              </button>
              {isScholarlyMenuOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2 w-40 z-50">
                  <Link
                    to="/schwk/projects"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsScholarlyMenuOpen(false)}
                  >
                    Projects
                  </Link>
                  <Link
                    to="/schwk/patents"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsScholarlyMenuOpen(false)}
                  >
                    Patents
                  </Link>
                  <Link
                    to="/schwk/publications"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsScholarlyMenuOpen(false)}
                  >
                    Publications
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/connect"
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-medium hover:font-semibold transition-all"
            >
              Connect
            </Link>
          </div>
        </SignedIn>
      </nav>

      {/* Right side elements */}
      <div className="flex items-center space-x-6">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link
            to="/sign-up"
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-medium hover:font-semibold transition-all"
          >
            Register
          </Link>
          <Link
            to="/sign-in"
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-medium hover:font-semibold transition-all"
          >
            Login
          </Link>
          <Link
            to="mailto:askarthikey01@gmail.com"
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 font-medium hover:font-semibold transition-all"
          >
            Contact Us
          </Link>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;