import { motion } from "framer-motion";

const images = [
  {
    src: "/images/IMG 1.PNG",
    alt: "Online classroom session with multiple participants",
    category: "Virtual Classroom"
  },
  {
    src: "/images/IMG 2.PNG",
    alt: "Professional team meeting in virtual environment",
    category: "Team Collaboration"
  },
  {
    src: "/images/IMG 3.PNG",
    alt: "Student participating in online learning",
    category: "Student Engagement"
  },
  {
    src: "/images/IMG 4.PNG",
    alt: "Educational interface with interactive elements",
    category: "User Interface"
  },
  {
    src: "/images/IMG 5.PNG",
    alt: "Student engaged in online learning",
    category: "Learning Experience"
  },
  {
    src: "/images/IMG 6.PNG",
    alt: "Educational technology in action",
    category: "EdTech Innovation"
  }
];

export default function Showcase() {
  return (
    <section className="py-16 px-4 bg-[#EAF3FC]">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          {/* Updated text color for DISCOVER OUR EDUCATIONAL RESOURCES */}
          <span className="text-sm font-semibold text-[#3B6A9A] uppercase tracking-wider">
            DISCOVER OUR EDUCATIONAL RESOURCES
          </span>
          {/* Updated text with bold blue underline */}
          <h2 className="text-3xl font-bold text-[#20232A] mt-4 mb-4">
            <span className="border-b-4 border-[#3B6A9A] pb-1">Showcasing Effective Learning</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Focus Meet is dedicated to enhancing your online learning journey. Our gallery features snapshots from various interactive sessions, highlighting the collaborative atmosphere and engaging discussions that take place. Each image reflects our commitment to creating a secure and dynamic educational environment where every participant can thrive.
          </p>
        </div>

        {/* Updated Grid for Proper Spacing */}
        <div className="grid md:grid-cols-3 gap-12"> {/* Increased spacing with gap-12 */}
          {images.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Image Box */}
              <motion.div
                className="rounded-lg overflow-hidden shadow-lg bg-white w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </motion.div>

              {/* Text BELOW Image Box */}
              <p className="text-[#3B6A9A] text-sm font-semibold text-center mt-3">
                {image.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
