import { Link } from "wouter";
import { SiFacebook, SiGithub, SiLinkedin, SiInstagram } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#20232A] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Section - Focus Meet Description */}
          <div>
            <h3 className="font-bold text-xl mb-4">Focus Meet</h3>
            <p className="text-gray-400 mb-6">
              At Focus Meet, we provide a seamless online meeting platform tailored for educational purposes, allowing users to sign in or sign up to create or join meetings with ease.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <SiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <SiGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <SiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <SiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Middle Section - Helpful Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 border-b-2 border-[#3B6A9A] w-max pb-1">
              Helpful Links
            </h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="/signup" className="text-gray-400 hover:text-white">Sign Up</Link></li>
              <li><Link href="/signin" className="text-gray-400 hover:text-white">Sign In</Link></li>
              <li><Link href="/create-meeting" className="text-gray-400 hover:text-white">Create Meeting</Link></li>
              <li><Link href="/join-meeting" className="text-gray-400 hover:text-white">Join Meeting</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="/help" className="text-gray-400 hover:text-white">Help</Link></li>
            </ul>
          </div>

          {/* Right Section - Reach Us */}
          <div>
            <h3 className="font-semibold text-lg mb-4 border-b-2 border-[#3B6A9A] w-max pb-1">
              Reach Us
            </h3>
            <address className="text-gray-400 not-italic space-y-2">
              <p>
                <span className="text-[#3B6A9A]">📞</span> 
                <a href="tel:+15551234567" className="hover:text-white ml-2">(555) 123-4567</a>
              </p>
              <p>
                <span className="text-[#3B6A9A]">✉️</span> 
                <a href="mailto:info@focusmeet.com" className="hover:text-white ml-2">info@focusmeet.com</a>
              </p>
              <p>
                <span className="text-[#3B6A9A]">📍</span> 
                <span className="ml-2">456 Oak Ave, Denver, CO</span>
              </p>
              <p>
                <span className="text-[#3B6A9A]">🕒</span> 
                <span className="ml-2">Mon - Fri: 9:00am - 5:00pm</span>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Focus Meet. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
