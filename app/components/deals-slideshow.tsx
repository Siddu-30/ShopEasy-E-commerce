"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Define slideshow images for deals
const slideshowImages = [
  {
    id: 1,
    name: "Summer Sale",
    image: "/images/slideshow/summer-sale.jpg",
    gradient: "from-red-500/30 to-orange-500/30"
  },
  {
    id: 2,
    name: "Flash Deals",
    image: "/images/slideshow/flash-deals.jpg",
    gradient: "from-purple-500/30 to-pink-500/30"
  },
  {
    id: 3,
    name: "Clearance Sale",
    image: "/images/slideshow/clearance-sale.jpg",
    gradient: "from-blue-500/30 to-teal-500/30"
  },
  {
    id: 4,
    name: "Limited Time Offers",
    image: "/images/slideshow/limited-offers.jpg",
    gradient: "from-amber-500/30 to-red-500/30"
  },
  {
    id: 5,
    name: "Special Discounts",
    image: "/images/slideshow/special-discounts.jpg",
    gradient: "from-emerald-500/30 to-cyan-500/30"
  }
]

export default function DealsSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    // Preload images
    const preloadImages = async () => {
      try {
        await Promise.all(
          slideshowImages.map((slide) => {
            return new Promise<void>((resolve, reject) => {
              const img = new window.Image();
              img.src = slide.image;
              img.onload = () => resolve();
              img.onerror = () => reject(new Error(`Failed to load image: ${slide.image}`));
            });
          })
        );
        setImagesLoaded(true);
      } catch (error) {
        console.error("Failed to preload images:", error);
        setImagesLoaded(true); // Still set to true to show something
      }
    };

    preloadImages();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [slideshowImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshowImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideshowImages.length) % slideshowImages.length)
  }

  return (
    <div className="relative w-full h-[300px] md:h-[350px] overflow-hidden rounded-lg shadow-md">
      {slideshowImages.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.name}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Slide title */}
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-xl md:text-2xl font-bold text-white">{slide.name}</h3>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-2 p-2 text-white transform -translate-y-1/2 bg-black/30 backdrop-blur-sm rounded-full top-1/2 hover:bg-black/50 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 p-2 text-white transform -translate-y-1/2 bg-black/30 backdrop-blur-sm rounded-full top-1/2 hover:bg-black/50 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slideshowImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
} 