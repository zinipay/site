// app/[slug]/components/VideoSection.js
"use client";
import React from 'react';

const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const match = url.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    } catch {
      return null;
    }
};

const VideoSection = ({ videoSection }) => {
  if (!videoSection?.videos || videoSection.videos.length === 0) return null;
console.log("videoSection:", videoSection); // Debugging line to check videoSection data
  return (
    <section className="py-20 bg-gray-900 text-center text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4">{videoSection.title}</h2>
        <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
          {videoSection.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {videoSection.videos.map((videoUrl, index) => {
            const embedUrl = getYoutubeEmbedUrl(videoUrl);
            if (!embedUrl) return null;
            return (
              <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl bg-black">
                <iframe
                  src={embedUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${videoSection.title} - Video ${index + 1}`}
                  className="w-full h-64"
                ></iframe>
              </div>
            );
          })}
        </div>
      </div>
      
    </section>
  );
};

export default VideoSection;