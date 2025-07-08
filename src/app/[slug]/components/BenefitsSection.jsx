// app/[slug]/components/BenefitsSection.js
"use client";
import React from "react";
import { FiCheckCircle } from "react-icons/fi";

const BenefitsSection = ({ benefits, actionButtonText }) => {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">কেন আমরা সেরা?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-2"
            >
              <FiCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center mt-12">
        <a
          href="#checkout-form"
          className="mt-8 inline-block bg-green-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
        >
          {actionButtonText || "Order Now"}
        </a>
      </div>
    </section>
  );
};

export default BenefitsSection;
