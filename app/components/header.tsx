'use client'
import React from 'react'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
          setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
    
      const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6 }
        }
      };
    
      const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2
          }
        }
      };
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
<div className="absolute inset-0 z-0">
  <video 
    autoPlay 
    loop 
    muted 
    playsInline
    className="object-cover w-full h-full opacity-50"
  >
    <source src="/videos/trucking.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div className="absolute inset-0 bg-black/70"></div>
</div>

<div className="container mx-auto px-4 z-10 relative">
  <motion.div 
    initial="hidden"
    animate="visible"
    variants={staggerContainer}
    className="max-w-3xl mx-auto text-center"
  >
    <motion.h1 
      variants={fadeIn}
      className="text-4xl md:text-6xl font-bold mb-6 text-white"
    >
      Revolutionize Your <span className="text-teal-500">Trucking</span> Business
    </motion.h1>
    
    <motion.p 
      variants={fadeIn}
      className="text-xl md:text-2xl mb-8 text-gray-300"
    >
      Streamline operations, reduce costs, and increase efficiency with our all-in-one trucking management platform.
    </motion.p>
    
    <motion.div 
      variants={fadeIn}
      className="flex flex-col sm:flex-row justify-center gap-4"
    >
      <Button className="bg-teal-500 text-black hover:bg-teal-600 text-lg px-8 py-6">
        Get Started
      </Button>
      <Button variant="outline" className="border-white hover:bg-white/10 text-lg px-8 py-6">
        Schedule Demo
      </Button>
    </motion.div>
  </motion.div>
</div>

<motion.div 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1.5, duration: 1 }}
  className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
>
  <Link href="#features" className="flex flex-col items-center text-gray-400 hover:text-teal-500 transition-colors">
    <span className="text-sm mb-2">Learn More</span>
    <ChevronRight className="h-6 w-6 rotate-90" />
  </Link>
</motion.div>
</section>
  )
}

export default Header