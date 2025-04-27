import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    avatar: "/images/avatars/sarah.PNG",
    name: "SARAH WILLIAMS",
    role: "Student",
    rating: 5,
    quote: "Focus Meet transformed my online learning experience! The platform is intuitive, making it easy to connect with my peers and instructors without any hassle."
  },
  {
    avatar: "/images/avatars/david.PNG",
    name: "DAVID LEE",
    role: "Teacher",
    rating: 5,
    quote: "As an educator, Focus Meet allows me to facilitate engaging sessions effortlessly. The user-friendly interface helps me focus on what matters most—teaching!"
  },
  {
    avatar: "/images/avatars/jessica.PNG",
    name: "JESSICA CHEN",
    role: "Graduate Student",
    rating: 5,
    quote: "Focus Meet has been an invaluable tool for my study groups. The seamless connectivity and interactive features have made collaboration so much more effective!"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          {/* Updated: Text color changed to blue */}
          <span className="text-sm font-semibold text-[#3B6A9A] uppercase tracking-wider">
            HEAR FROM OUR USERS
          </span>
          {/* Updated: Text color is black, and underline is blue */}
          <h2 className="text-3xl font-bold text-[#20232A] mt-4 mb-8">
            <span className="border-b-4 border-[#3B6A9A] pb-1">What Our Users Have to Say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mx-auto mb-2"
                    />
                    <div className="flex justify-center mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-gray-600 mb-4 italic">
                    {testimonial.quote}
                  </blockquote>
                  <div>
                    <cite className="font-semibold text-[#20232A] not-italic block">
                      {testimonial.name}
                    </cite>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
