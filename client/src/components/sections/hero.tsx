import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] pt-24 pb-16 px-4 bg-[#EAF3FC] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero.png" 
          alt="Educational interface"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div> {/* Adjusted opacity for clarity */}
      </div>

      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-xl border border-gray-300" /* Enhanced border & shadow */
        >
          <span className="text-sm font-semibold text-[#3B6A9A] uppercase tracking-wider px-4 py-1 bg-[#EAF3FC] rounded-full border border-[#3B6A9A]">
            ELEVATE YOUR LEARNING EXPERIENCE
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#20232A] my-4">
            Connect, Collaborate, Educate
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Focus Meet empowers learners and educators to seamlessly engage in productive online sessions. With easy sign-up and sign-in processes, you can create or join meetings in just a few clicks, ensuring that you never miss an opportunity to learn or teach.
          </p>
          <Button 
            size="lg" 
            className="bg-[#3B6A9A] hover:bg-[#EAF3FC]/90 text-white font-semibold"
          >
            START YOUR JOURNEY
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Educational icons overlay
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 p-4">
              {['video', 'group', 'book', 'calendar', 'chat', 'shield'].map((icon, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-white/90 rounded-lg shadow-lg flex items-center justify-center"
                >
                  <img 
                    src={`/icons/${icon}.svg`} 
                    alt={`Educational icon ${icon}`}
                    className="w-8 h-8"
                  />
                </div>
              ))}
            </div>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}
