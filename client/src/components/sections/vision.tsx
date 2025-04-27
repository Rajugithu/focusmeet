import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Vision() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Image and Empower Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative order-2 md:order-1"
          >
            <img 
              src="/images/visionlearning.PNG" 
              alt="Students learning online"
              className="rounded-lg shadow-lg w-full object-cover h-[400px]"
            />

            {/* Empower Box - Larger Text, Positioned Bottom Right */}
            <div className="absolute bottom-[-20px] right-[-20px] bg-[#3B6A9A] text-white p-5 rounded-lg w-2/3 shadow-md border-4 border-white md:right-[-30px] md:w-[250px]">
              <h3 className="text-xl font-bold mb-2"> {/* Increased from text-lg → text-xl */}
                Empower Your Learning
              </h3>
              <p className="text-base"> {/* Increased from text-sm → text-base */}
                Years of Experience
              </p>
            </div>
          </motion.div>

          {/* Main Text Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="order-1 md:order-2"
          >
            {/* Moved this text slightly up */}
            <span className="text-sm font-semibold text-[#3B6A9A] uppercase tracking-wider block mb-2">
              UNLOCK SEAMLESS ONLINE LEARNING
            </span>
            <h2 className="text-3xl font-bold text-[#20232A] mt-[-10px]">
              <span className="border-b-4 border-[#3B6A9A] pb-1">
                Empower Your Educational Journey
              </span>
            </h2>
            <p className="text-gray-600 mb-6">
              <br />Focus Meet provides a powerful platform designed to enhance the online educational experience. With a straightforward sign-up and sign-in process, you can effortlessly create or join meetings tailored for learning. Enjoy interactive sessions that foster collaboration and engagement among participants, ensuring that every educational opportunity is maximized.
            </p>

            {/* Features Section */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <div className="w-12 h-12 bg-[#EAF3FC] rounded-full flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-[#3B6A9A]" />
                </div>
                <h3 className="text-xl font-semibold text-[#20232A] mb-2">
                  Our Commitment
                </h3>
                <p className="text-gray-600">
                  Empowering learners through accessible online meetings.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[#EAF3FC] rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-[#3B6A9A]" />
                </div>
                <h3 className="text-xl font-semibold text-[#20232A] mb-2">
                  Our Vision
                </h3>
                <p className="text-gray-600">
                  Creating a dynamic space for online education that connects students and instructors seamlessly.
                </p>
              </div>
            </div>

            {/* Button Moved Up Slightly */}
            <Button 
              size="lg"
              className="bg-[#3B6A9A] hover:bg-[#2E5580] text-white font-semibold mt-[-10px]"
            >
              JOIN US TODAY
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
