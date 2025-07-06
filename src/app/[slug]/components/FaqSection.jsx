// app/[slug]/components/FaqSection.js
"use client";
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FaqSection = ({ qna }) => {
  const [openFaq, setOpenFaq] = useState(null);

  if (!qna || qna.length === 0) return null;

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center">সাধারণ জিজ্ঞাসা</h2>
        <div className="space-y-4">
          {qna.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center p-6 text-left">
                <span className="text-lg font-semibold">{item.question}</span>
                {openFaq === index ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 text-gray-600"><p>{item.answer}</p></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;