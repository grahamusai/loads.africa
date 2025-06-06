'use client'
import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TruckIcon, MenuIcon, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
     <div
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="text-white container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <TruckIcon className="h-8 w-8 text-yellow-500 mr-2" />
          <span className="text-xl font-bold">TruckFlow</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link
            href="#features"
            className="hover:text-yellow-500 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#benefits"
            className="hover:text-yellow-500 transition-colors"
          >
            Benefits
          </Link>
          <Link
            href="#testimonials"
            className="hover:text-yellow-500 transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="hover:text-yellow-500 transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex space-x-4">
          <Link
          href={"/auth"}
            className="border-yellow-500 text-yellow-500  hover:text-yellow-700"
          >
            Get Started
          </Link>
         
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-black/95 border-t border-gray-800"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="#features"
              className="py-2 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="py-2 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Benefits
            </Link>
            <Link
              href="#testimonials"
              className="py-2 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="py-2 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black w-full"
              >
                Log In
              </Button>
              <Button className="bg-yellow-500 text-black hover:bg-yellow-600 w-full">
                Get Started
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
    </>
   
  );
};

export default Navbar;
