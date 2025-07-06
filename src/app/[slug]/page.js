// app/[slug]/page.js
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios"; // Real API calls should use axios or similar

// Import all the new section components
import HeroSection from "./components/HeroSection";
import BenefitsSection from "./components/BenefitsSection";
import VideoSection from "./components/VideoSection";
import ReviewsSection from "./components/ReviewsSection";
import FaqSection from "./components/FaqSection";
import CheckoutForm from "./components/CheckoutForm";
import PageFooter from "./components/PageFooter";
import { axiosUser } from "../config/useAxiosPublic";

// This is the main page component
const IdPage = ({ params }) => {
  const { slug } = params; // Get slug from URL
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("Slug from params:", slug); // Debugging line to check slug
  useEffect(() => {
    if (!slug) return; // slug না থাকলে ডেটা ফেচ হবে না

    const localStorageKey = `landingPageData_${slug}`;
    // fetch from the local storage 
    const localData = localStorage.getItem(localStorageKey);
    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        setPageData(parsedData);
        setLoading(false); // Show cached data immediately
      } catch (e) {
        console.error("Failed to parse localStorage data", e);
      }
    }

    const fetchPageData = async () => {
      try {
        // Fetch real data from your API using the slug
        const res = await axiosUser.get(`/landing-page/public/${slug}`);
        console.log("Fetched data:", res.data); // Debugging line to check fetched data
        const freshData = res.data.data;
        setPageData(freshData);
        localStorage.setItem(localStorageKey, JSON.stringify(freshData));
      } catch (err) {
        console.error("Failed to load landing page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        পেজ পাওয়া যায়নি।
      </div>
    );
  }

  // Destructure data for cleaner prop passing
  const { pageContentData, productList } = pageData;
  const {
    header,
    actionButtonText,
    miniDescription,
    benefits,
    videoSection,
    reviews,
    qna,
    aboutUs,
    contactUs,
  } = pageContentData;

  // Assuming single product for now, as per your previous setup
  const productInfo = productList;
  return (
    <div className="bg-white font-sans text-gray-800">
      <HeroSection header={header} actionButtonText={actionButtonText} />

      <main>
        {miniDescription && (
          <section className="py-16 bg-white text-center">
            <p className="text-2xl font-light italic text-gray-600 max-w-4xl mx-auto px-6">
              "{miniDescription}"
            </p>
          </section>
        )}

        <BenefitsSection
          benefits={benefits}
          actionButtonText={actionButtonText}
        />
        <VideoSection videoSection={videoSection} />
        <ReviewsSection reviews={reviews} actionButtonText={actionButtonText} />

        {aboutUs && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-6">আমাদের সম্পর্কে</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{aboutUs}</p>
            </div>
          </section>
        )}

        <FaqSection qna={qna} />
        <CheckoutForm productInfo={productInfo} landingPageId={pageData?.id} />
      </main>

      <PageFooter contactUs={contactUs} />
    </div>
  );
};

export default IdPage;
