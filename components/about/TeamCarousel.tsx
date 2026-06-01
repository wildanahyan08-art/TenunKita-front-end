"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Globe,
  Video,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Wildan Ahyan Daffa",
    title: "Front End Developer",
    description:
      "Siswa kelas XI RPL 2 yang bertanggung jawab dalam pengembangan antarmuka pengguna (frontend) website TenunKita. Fokus pada menghadirkan tampilan yang modern, responsif, dan mudah digunakan.",
    imageUrl: "/wildan.jpeg",
    githubUrl: "#",
    twitterUrl: "#",
    youtubeUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Davin Falih Ramadhan",
    title: "Backend Developer",
    description:
      "Siswa kelas XI RPL 1 yang bertanggung jawab dalam pengembangan dan pengelolaan sistem backend serta database website TenunKita. Memastikan server, API, dan data berjalan dengan lancar.",
    imageUrl: "/davin.jpeg",
    githubUrl: "#",
    twitterUrl: "#",
    youtubeUrl: "#",
    linkedinUrl: "#",
  },
];

export function TeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () =>
    setCurrentIndex((index) => (index + 1) % teamMembers.length);
  const handlePrevious = () =>
    setCurrentIndex(
      (index) => (index - 1 + teamMembers.length) % teamMembers.length
    );

  const currentMember = teamMembers[currentIndex];

  const socialIcons = [
    { icon: Code2, url: currentMember.githubUrl, label: "GitHub" },
    { icon: Globe, url: currentMember.twitterUrl, label: "Twitter" },
    { icon: Video, url: currentMember.youtubeUrl, label: "YouTube" },
    { icon: Users, url: currentMember.linkedinUrl, label: "LinkedIn" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Desktop layout */}
      <div className="hidden md:flex relative items-center">
        {/* Avatar */}
        <div className="w-[470px] h-[470px] rounded-3xl overflow-hidden bg-gray-200 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMember.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <Image
                src={currentMember.imageUrl}
                alt={currentMember.name}
                width={470}
                height={470}
                className="w-full h-full object-cover"
                draggable={false}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 ml-[-80px] z-10 max-w-xl flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMember.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentMember.name}
                </h2>
                <p className="text-sm font-medium text-amber-700 uppercase tracking-[0.1em]">
                  {currentMember.title}
                </p>
              </div>

              <p className="text-black text-base leading-relaxed mb-8">
                {currentMember.description}
              </p>

              <div className="flex space-x-4">
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <Link
                    key={label}
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 hover:scale-105 cursor-pointer"
                    aria-label={label}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden max-w-sm mx-auto text-center bg-transparent">
        {/* Avatar */}
        <div className="w-full aspect-square bg-gray-200 rounded-3xl overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMember.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <Image
                src={currentMember.imageUrl}
                alt={currentMember.name}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                draggable={false}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card content */}
        <div className="px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMember.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {currentMember.name}
              </h2>
              <p className="text-sm font-medium text-amber-700 uppercase tracking-[0.1em] mb-4">
                {currentMember.title}
              </p>
              <p className="text-black text-sm leading-relaxed mb-6">
                {currentMember.description}
              </p>
              <div className="flex justify-center space-x-4">
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <Link
                    key={label}
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 cursor-pointer"
                    aria-label={label}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          onClick={handlePrevious}
          aria-label="Previous member"
          className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 shadow-md flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex gap-2">
          {teamMembers.map((_, memberIndex) => (
            <button
              key={memberIndex}
              onClick={() => setCurrentIndex(memberIndex)}
              className={cn(
                "w-3 h-3 rounded-full transition-colors cursor-pointer",
                memberIndex === currentIndex
                  ? "bg-gray-900"
                  : "bg-gray-400"
              )}
              aria-label={`Go to member ${memberIndex + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next member"
          className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 shadow-md flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
