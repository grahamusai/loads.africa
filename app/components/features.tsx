'use client'

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  TruckIcon,
  BarChart3Icon,
  ClockIcon,
  DollarSignIcon,
  ShieldCheckIcon,
  MenuIcon,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = () => {

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
    <section id="features" className="text-white py-20 bg-gray-950">
    <div className="container mx-auto px-4">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="text-center mb-16"
      >
        <motion.h2 
          variants={fadeIn}
          className="text-3xl md:text-4xl font-bold mb-4 text-white"
        >
          Powerful <span className="text-teal-500">Features</span> for Modern Trucking
        </motion.h2>
        <motion.p 
          variants={fadeIn}
          className="text-xl text-gray-400 max-w-3xl mx-auto"
        >
          Our platform is designed specifically for the trucking industry, with tools that solve your biggest challenges.
        </motion.p>
      </motion.div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: <TruckIcon className="h-10 w-10 text-teal-500" />,
            title: "Fleet Management",
            description: "Track your entire fleet in real-time. Monitor vehicle status, maintenance schedules, and driver assignments all in one place."
          },
          {
            icon: <BarChart3Icon className="h-10 w-10 text-teal-500" />,
            title: "Performance Analytics",
            description: "Gain insights into your business with comprehensive analytics. Identify trends and make data-driven decisions."
          },
          {
            icon: <ClockIcon className="h-10 w-10 text-teal-500" />,
            title: "Route Optimization",
            description: "Save time and fuel with intelligent route planning. Automatically calculate the most efficient routes for your drivers."
          },
          {
            icon: <DollarSignIcon className="h-10 w-10 text-teal-500" />,
            title: "Expense Tracking",
            description: "Keep track of all expenses including fuel, maintenance, and driver payments. Generate detailed financial reports."
          },
          {
            icon: <ShieldCheckIcon className="h-10 w-10 text-teal-500" />,
            title: "Compliance Management",
            description: "Stay compliant with industry regulations. Automated alerts and documentation help you avoid penalties."
          },
          {
            icon: <TruckIcon className="h-10 w-10 text-teal-500" />,
            title: "Load Matching",
            description: "Find the perfect loads for your fleet. Our matching algorithm connects you with shippers that fit your routes."
          }
        ].map((feature, index) => (
          <motion.div 
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: index * 0.1,
                  duration: 0.5 
                }
              }
            }}
            className="bg-gray-900 p-8 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  )
}

export default features