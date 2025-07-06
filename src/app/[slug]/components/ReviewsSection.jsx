"use client";
import React from "react";
import { FiStar } from "react-icons/fi";

const ReviewsSection = ({ reviews, actionButtonText }) => {
  console.log("reviews", reviews);
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">ক্রেতাদের মতামত</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews?.map((review, index) => (
            <div
              key={index}
              className="bg-gray-50/70 p-8 rounded-lg border border-gray-200"
            >
              <div className="flex text-amber-400 mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">"{review.text}"</p>
              <div className="flex flex-col items-center">
                {review.avatarUrl && (
                  <img
                    src={review.avatarUrl}
                    alt={review.author}
                    className="w-14 h-14 rounded-full object-cover mb-2 border-2 border-indigo-200"
                  />
                )}
                <p className="font-bold text-lg">{review.author}</p>
                {review.address && (
                  <p className="text-gray-500 text-sm">{review.address}</p>
                )}
              </div>
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

export default ReviewsSection;
