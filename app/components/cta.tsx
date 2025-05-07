'use client'
import React from 'react'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import Image from "next/image";

const Cta = () => {
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
          transition: { duration: 0.6 },
        },
      };
    
      const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      };
  return (
    <section className="py-20 text-white bg-black relative overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-yellow-500/10"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-3xl mx-auto text-center"
      >
        <motion.h2 
          variants={fadeIn}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Ready to Transform Your <span className="text-yellow-500">Trucking Business</span>?
        </motion.h2>
        
        <motion.p 
          variants={fadeIn}
          className="text-xl mb-8 text-gray-300"
        >
          Join thousands of trucking companies already saving time and money with our platform.
        </motion.p>
        
        <motion.div 
          variants={fadeIn}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button className="bg-yellow-500 text-black hover:bg-yellow-600 text-lg px-8 py-6">
            Start Your Free Trial
          </Button>
          <Button variant="outline" className="border-white text-black hover:bg-white/10 text-lg px-8 py-6">
            Request a Demo
          </Button>
        </motion.div>
        
        <motion.p 
          variants={fadeIn}
          className="mt-6 text-gray-400"
        >
          No credit card required. 14-day free trial.
        </motion.p>
      </motion.div>
    </div>
  </section>
  )
}

export default Cta