import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertWaitlistSchema, type InsertWaitlist } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Extend InsertWaitlist type with phone field
type InsertWaitlistUpdated = InsertWaitlist & {
  phone: string;
};

export default function Contact() {
  const { toast } = useToast();

  //  Use updated type with phone field
  const form = useForm<InsertWaitlistUpdated>({
    resolver: zodResolver(insertWaitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "", // Ensure phone is included
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertWaitlist) => {
      await apiRequest("POST", "/api/waitlist", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <section className="relative py-16 px-4">
      {/* Background Image with Darker Overlay */}
      <div
        className="absolute inset-0 h-[65%] bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/images/Contact.PNG')" }}
      ></div>

      {/* Strong Black Shadow Overlay for Better Contrast */}
      <div className="absolute inset-0 h-[65%] bg-black opacity-60"></div>

      <div className="relative container mx-auto">
        {/* Text Content */}
        <div className="text-center text-white mb-8">
          <span className="text-sm font-semibold text-[#3B6A9A] uppercase tracking-wider">
            CONNECT WITH US
          </span>
          <h2 className="text-3xl font-bold text-white mt-4 mb-4">
            <span className="border-b-4 border-[#3B6A9A] pb-1">
              Get Started with Focus Meet
            </span>
          </h2>
          <p className="text-white max-w-2xl mx-auto">
            Have questions or ready to enhance your online learning? We're here to help you navigate your educational journey effortlessly.
          </p>
        </div>

        {/* Contact Form Container */}
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 mx-auto mt-12">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Contact Info with Background Image */}
            <div
              className="relative text-white p-8"
              style={{
                backgroundImage: "url('/images/ContactForm.PNG')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
            {/* Black Shadow Effect */}
        <div className="absolute inset-0 bg-black opacity-80 shadow-2xl"></div>

              {/* Content Inside Contact Box */}
              <div className="relative z-10">
                <p className="text-sm uppercase text-gray-300 font-semibold tracking-wider">
                  CONTACT INFORMATION
                </p>
                <h3 className="text-2xl font-semibold mb-6 mt-2 border-b-4 border-[#3B6A9A] pb-1">
                  Reach Out Anytime
                </h3>

                <ul className="space-y-4">
                  <li className="flex items-center space-x-3 text-white">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 5c0-1.1.9-2 2-2h3.3c.4 0 .8.3.9.7l1.5 4.5c.1.5 0 .9-.5 1.1l-2.3 1.1c1.1 2.5 3.1 4.5 5.6 5.6l1.1-2.3c.2-.4.6-.6 1.1-.5l4.5 1.5c.4.1.7.5.7.9V19c0 1.1-.9 2-2 2h-1c-8.3 0-15-6.7-15-15v-1z"/>
                    </svg>
                    <span>(555) 123-4567</span>
                  </li>
                  <li className="flex items-center space-x-3 text-white">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 8l8 5 8-5M5 19h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2z"/>
                    </svg>
                    <span>support@focusmeet.com</span>
                  </li>
                  <li className="flex items-center space-x-3 text-white">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 13c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z"/>
                      <path d="M19.5 10c0 6.5-7.5 11.5-7.5 11.5s-7.5-5-7.5-11.5c0-3.9 3.4-7 7.5-7s7.5 3.1 7.5 7z"/>
                    </svg>
                    <span>123 Learning Lane, Education City</span>
                  </li>
                  <li className="flex items-center space-x-3 text-white">
                    <span>🕒</span>
                    <span>Mon - Fri: 9:00am - 6:00pm</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/*  Fix: Added Phone Number Field */}
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 987-6543" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="How can we help you?" className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-[#3B6A9A] text-white">SEND MESSAGE</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
