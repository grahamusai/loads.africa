"use client";
import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const Benefits = () => {
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
    <div id="benefits" className="py-20 bg-black text-white">
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
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Benefits for{" "}
            <span className="text-teal-500">Every Stakeholder</span>
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Our platform delivers value to everyone in your trucking ecosystem.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Truck owner benefits"
              width={600}
              height={600}
              className="rounded-lg shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h3
              variants={fadeIn}
              className="text-2xl font-bold mb-6 flex items-center"
            >
              <span className="bg-teal-500 text-black rounded-full w-10 h-10 flex items-center justify-center mr-3">
                1
              </span>
              For Truck Owners & Fleet Managers
            </motion.h3>

            <div className="space-y-6">
              {[
                "Reduce operational costs by up to 20%",
                "Minimize vehicle downtime with predictive maintenance",
                "Improve fleet utilization and asset management",
                "Enhance driver retention with better route planning",
                "Gain complete visibility into your entire operation",
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.1,
                        duration: 0.5,
                      },
                    },
                  }}
                  className="flex items-start"
                >
                  <div className="bg-teal-500 rounded-full p-1 mr-3 mt-1">
                    <ChevronRight className="h-4 w-4 text-black" />
                  </div>
                  <p className="text-gray-300">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="order-2 md:order-1"
          >
            <motion.h3
              variants={fadeIn}
              className="text-2xl font-bold mb-6 flex items-center"
            >
              <span className="bg-teal-500 text-black rounded-full w-10 h-10 flex items-center justify-center mr-3">
                2
              </span>
              For Carriers & Drivers
            </motion.h3>

            <div className="space-y-6">
              {[
                "Simplified paperwork and documentation",
                "Real-time communication with dispatchers",
                "Optimized routes that save time and fuel",
                "Transparent payment processing",
                "Mobile access to all critical information",
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.1,
                        duration: 0.5,
                      },
                    },
                  }}
                  className="flex items-start"
                >
                  <div className="bg-teal-500 rounded-full p-1 mr-3 mt-1">
                    <ChevronRight className="h-4 w-4 text-black" />
                  </div>
                  <p className="text-gray-300">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Carrier benefits"
              width={600}
              height={600}
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
