// app/[slug]/components/HeroSection.js
"use client";
import Image from "next/image";
import React from "react";

const HeroSection = ({ header, actionButtonText }) => {
  // Return null if there's no header data to display
  if (!header) {
    return null;
  }

  return (
    <header className="bg-amber-50 py-16 md:py-24">
      <div className="container mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-amber-900 leading-tight">
          {header.text || "Welcome to Our Page"}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-lg md:text-xl text-amber-800 max-w-3xl">
          {header.subtitle || "Discover something amazing."}
        </p>

        {/* Hero Image */}
        {header?.imageUrl && (
          <div className="mt-8 mb-6 w-full max-w-sm md:max-w-md">
            <div className="relative aspect-square w-full rounded-2xl shadow-xl overflow-hidden">
                <Image 
                  src={header.imageUrl} 
                  alt={header.text || "Hero Image"}
                  layout="fill" // Makes the image fill the container
                  objectFit="cover" // Ensures the image covers the area without distortion
                  className="transition-transform duration-500 hover:scale-105"
                  // Add a fallback for broken images
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600/FFF7ED/333?text=Image"; }}
                />
            </div>
          </div>
        )}

        {/* Call-to-Action Button */}
        <a
          href="#checkout-form"
          className="mt-8 inline-block bg-green-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
        >
          {actionButtonText || "Order Now"}
        </a>
      </div>
    </header>
  );
};

export default HeroSection;