import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useUser, SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? "hidden" : "unset";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "unset";
  };

  return (
    <div className="bg-black shadow-lg shadow-teal-400 border border-teal-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 lg:h-20">
          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="rounded-lg text-teal-400 hover:text-teal-300 transition duration-200 focus:outline-none focus:ring-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex-1 flex justify-center lg:justify-start lg:ml-8">
            <button
              onClick={() => navigate(user ? "/home" : "/")}
              className="text-2xl font-bold text-teal-400 tracking-tight hover:text-teal-300 transition duration-200"
            >
              Skxelfii
            </button>
          </div>

          {/* Navbar Buttons */}
          <nav className="hidden lg:flex items-center justify-end">
            <ul className="flex space-x-6">
              <SignedIn>
                <li>
                  <button
                    onClick={() => navigate("/home")}
                    className="px-4 py-2 font-bold text-[20px] text-teal-400 hover:text-black hover:bg-teal-400 rounded-lg transition duration-300"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <SignOutButton signOutCallback={() => navigate("/login")}>
                    <button className="px-4 py-2 font-bold text-[20px] text-teal-400 hover:text-black hover:bg-teal-400 rounded-lg transition duration-300">
                      Logout
                    </button>
                  </SignOutButton>
                </li>
              </SignedIn>

              <SignedOut>
                <li>
                  <button
                    onClick={() => navigate("/sign-up")}
                    className="px-4 py-2 font-bold text-[20px] text-teal-400 hover:text-black hover:bg-teal-400 rounded-lg transition duration-300"
                  >
                    Sign Up
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/sign-in")}
                    className="px-4 py-2 font-bold text-[20px] text-teal-400 hover:text-black hover:bg-teal-400 rounded-lg transition duration-300"
                  >
                    Sign In
                  </button>
                </li>
              </SignedOut>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={closeMenu}
        >
          <div
            className="absolute inset-y-0 left-0 w-72 bg-black shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeMenu}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-teal-100 text-teal-500 transition-all duration-200"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

            <nav className="flex-1 py-6 space-y-1 ml-5 mt-10">
              <SignedIn>
                <button
                  onClick={() => {
                    navigate("/home");
                    closeMenu();
                  }}
                  className="block w-full text-left px-5 py-2 text-base font-bold text-teal-400 hover:text-black hover:bg-teal-400 rounded-lg transition duration-300"
                >
                  Home
                </button>
                <SignOutButton signOutCallback={() => {
                  closeMenu();
                  navigate("/login");
                }}>
                  <button className="block w-full text-left px-5 py-2 text-base font-bold text-teal-400 hover:text-black hover:bg-teal-400 rounded-lg transition duration-300">
                    Logout
                  </button>
                </SignOutButton>
              </SignedIn>

              <SignedOut>
                <button
                  onClick={() => {
                    navigate("/sign-up");
                    closeMenu();
                  }}
                  className="block w-full text-left px-5 py-2 text-base font-bold text-teal-400 hover:text-black hover:bg-teal-400 rounded-lg transition duration-300"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => {
                    navigate("/sign-in");
                    closeMenu();
                  }}
                  className="block w-full text-left px-5 py-2 text-base font-bold text-teal-400 hover:text-black hover:bg-teal-400 rounded-lg transition duration-300"
                >
                  Sign In
                </button>
              </SignedOut>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
