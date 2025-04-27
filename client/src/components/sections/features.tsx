import { motion } from "framer-motion";
import { 
  Video, 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Seamless Meeting Creation",
    description: "Create meetings in just a few clicks, setting the stage for productive online interactions tailored for educational contexts.",
    style: "bg-white text-[#20232A] icon-blue" // Standard White Box with Blue Icons
  },
  {
    icon: Users,
    title: "Join Effortlessly",
    description: "Easily join meetings with a simple link or ID, ensuring you never miss out on important discussions.",
    style: "bg-[#3B6A9A] text-white icon-white" // Blue Background, White Text & Icon
  },
  {
    icon: BookOpen,
    title: "Interactive Learning Environment",
    description: "Engage in interactive sessions designed to enhance learning outcomes through real-time collaboration and participation.",
    style: "bg-white text-[#20232A] icon-blue" // Standard White Box with Blue Icons
  },
  {
    icon: Calendar,
    title: "Scheduling Made Simple",
    description: "Plan your sessions effortlessly with easy scheduling options that keep everyone informed and ready.",
    style: "bg-white text-[#20232A] icon-blue"
  },
  {
    icon: MessageSquare,
    title: "Engaging Discussions",
    description: "Facilitate meaningful discussions that enhance understanding and retention through collaborative dialogue.",
    style: "bg-[#3B6A9A] text-white icon-white" // Blue Background, White Text & Icon
  },
  {
    icon: Shield,
    title: "Secure and Private",
    description: "Your privacy matters. Focus Meet ensures secure connections for a trustworthy online learning experience.",
    style: "bg-white text-[#20232A] icon-blue"
  }
];

export default function Features() {
  return (
    <section className="relative py-24 px-4">
      {/* Background Image (More Visible) */}
      <div 
        className="absolute inset-x-0 top-0 h-[50%] bg-cover bg-center opacity-75"
        style={{ backgroundImage: "url('/images/meeting.PNG')" }}>
      </div>

      {/* Dark Overlay for Contrast */}
      <div className="absolute inset-x-0 top-0 h-[50%] bg-black opacity-30"></div>

      {/* Text Content (On Background Image) */}
      <div className="relative container mx-auto text-center text-white z-10">
        <span className="text-sm font-semibold text-[#3B6A9A] uppercase tracking-wider">
          ENHANCE YOUR ONLINE LEARNING
        </span>
        <h2 className="text-4xl font-bold mt-4 mb-4">
          Transforming Education Through Connection
        </h2>
        <p className="max-w-2xl mx-auto">
          Focus Meet streamlines the online learning experience, enabling educators and students to engage in dynamic sessions effortlessly. 
          Join an interactive community where every meeting is an opportunity to learn and grow.
        </p>
      </div>

      {/* Feature Boxes */}
      <div className="relative container mx-auto mt-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`rounded-lg p-6 shadow-md ${
                index < 3 ? "mt-[-20px] backdrop-blur-md" : "" // Further lowered first three boxes
              } ${feature.style}`} // Apply style dynamically
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                feature.style.includes("icon-white") ? "bg-white text-[#3B6A9A]" : "bg-[#EAF3FC] text-[#3B6A9A]"
              }`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-semibold mb-2`}>
                {feature.title}
              </h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
