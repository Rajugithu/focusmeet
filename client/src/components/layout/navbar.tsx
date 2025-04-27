import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-[#20232A]">
            Focus Meet
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/login"
            onClick={() => console.log("Navigating to login")}
            className="text-[#20232A] hover:text-[#3B6A9A]"
          >
            Sign In
          </Link>

          <a href="#" className="text-[#20232A] hover:text-[#3B6A9A]">
            Meetings
          </a>
          <a href="#" className="text-[#20232A] hover:text-[#3B6A9A]">
            About
          </a>
          <a href="#" className="text-[#20232A] hover:text-[#3B6A9A]">
            Help
          </a>
          <Link
            to="/signup"
            className="bg-[#3B6A9A] hover:bg-[#EAF3FC] text-white py-2 px-4 rounded" // Added py-2 px-4 rounded to make it appear as a button
          >
            Sign Up
          </Link>
        </div>

        <Button className="md:hidden" variant="outline" size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </motion.nav>
  );
}
