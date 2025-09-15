import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'; // Dùng icon cho nút điều hướng

const slides = [
  { src: "/home-page/slider_1.jpg", title: "Không gian sống", desc: "Định hình phong cách" },
  { src: "/home-page/slider_2.jpg", title: "Nội thất bếp", desc: "Tinh tế và hiện đại" },
  { src: "/home-page/slider_3.jpg", title: "Phòng ngủ", desc: "Thư giãn thoải mái" },
  { src: "/home-page/slider_4.jpg", title: "Phòng khách", desc: "Sang trọng tối giản" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden mt-16">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-4xl md:text-6xl font-montserrat-bold mb-6">{slide.title}</h1>
            <p className="text-xl font-montserrat md:text-2xl mb-8 opacity-90">{slide.desc}</p>
            <button
            className="bg-[#c4a484] hover:bg-[#b8956f] font-montserrat text-white px-8 py-3 text-lg rounded-lg transition-colors duration-300 cursor-pointer active:scale-95"
            >
            Khám phá ngay
            </button>
          </div>
        </div>
      ))}

      {/* Nút điều hướng trái/phải */}
      <button
        onClick={goPrev}
        className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        onClick={goNext}
        className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
``
      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
