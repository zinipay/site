"use client";
import React, { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaDiscord,
  FaWhatsapp,
} from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin, FiMessageCircle, FiX } from "react-icons/fi";

const PageFooter = ({ contactUs }) => {
  const [isFabOpen, setIsFabOpen] = useState(false);
  if (!contactUs) return null;

  const {
    call,
    email,
    address,
    facebook,
    instagram,
    telegram,
    whatsapp,
    discord,
  } = contactUs;

  const contactOptions = [
    { name: 'Facebook', icon: FaFacebook, href: facebook, color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    { name: 'Instagram', icon: FaInstagram, href: instagram, color: 'bg-pink-600', hover: 'hover:bg-pink-700' },
    { name: 'Telegram', icon: FaTelegram, href: telegram, color: 'bg-sky-500', hover: 'hover:bg-sky-600' },
    { name: 'WhatsApp', icon: FaWhatsapp, href: `https://wa.me/${whatsapp?.replace(/\D/g, "")}`, color: 'bg-green-500', hover: 'hover:bg-green-600' },
    { name: 'Discord', icon: FaDiscord, href: `https://discord.com/users/${discord}`, color: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
  ].filter(option => option.href); // Filter out options without a link

  return (
    <>
      {/* --- Main Footer Section --- */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-white mb-8">যোগাযোগের তথ্য</h3>
          </div>
          
          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <div className="flex flex-col items-center space-y-2">
              <FiPhone className="text-3xl text-sky-400 mb-2" />
              <h4 className="text-lg font-semibold text-white">ফোন</h4>
              <a href={`tel:${call}`} className="hover:text-sky-400 transition-colors">{call}</a>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <FiMail className="text-3xl text-sky-400 mb-2" />
              <h4 className="text-lg font-semibold text-white">ইমেইল</h4>
              <a href={`mailto:${email}`} className="hover:text-sky-400 transition-colors">{email}</a>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <FiMapPin className="text-3xl text-sky-400 mb-2" />
              <h4 className="text-lg font-semibold text-white">ঠিকানা</h4>
              <p>{address}</p>
            </div>
          </div>
          
          {/* Social Icons in Footer */}
          <div className="mt-10 flex justify-center gap-6 text-2xl">
            {contactOptions.map(({ name, icon: Icon, href }) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="hover:text-white hover:scale-110 transform transition-all">
                <Icon />
              </a>
            ))}
          </div>

        </div>
        {/* Copyright */}
        <div className="bg-gray-950 py-4 px-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* --- Floating Action Button (FAB) Section --- */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-center space-y-4">
          
          {/* Pop-up Contact Buttons */}
          <div className={`transition-all duration-300 ease-in-out ${isFabOpen ? 'opacity-100' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
             <div className="flex flex-col items-center space-y-3">
                {contactOptions.map((option, index) => (
                  <a
                    key={option.name}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-white transition-all duration-300 ${option.color} ${option.hover} ${isFabOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: isFabOpen ? `${index * 40}ms` : '0ms' }}
                    aria-label={option.name}
                  >
                    <option.icon size={22} />
                    {/* Tooltip */}
                    <span className="absolute right-full mr-4 px-2 py-1 text-xs font-semibold text-white bg-gray-800 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {option.name}
                    </span>
                  </a>
                ))}
            </div>
          </div>
          
          {/* Main Toggle Button */}
          <button
            onClick={() => setIsFabOpen(!isFabOpen)}
            aria-label="Toggle Contact Menu"
            title="যোগাযোগ করুন"
            className="w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-sky-300 transform transition-all duration-200 hover:scale-110"
          >
            <div className="transition-transform duration-300 ease-in-out" style={{ transform: isFabOpen ? 'rotate(45deg)' : 'rotate(0)' }}>
              {isFabOpen ? <FiX size={28} /> : <FiMessageCircle size={28} />}
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default PageFooter;