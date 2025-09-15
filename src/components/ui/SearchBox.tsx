import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const SearchBox = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const showSearchInput = isHovered || isFocused;

  useEffect(() => {
    if (!showSearchInput && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [showSearchInput]);

  return (
    <div
      className={`relative flex items-center rounded-full px-3 border border-gray-400 w-11 py-2 transition-all duration-300 overflow-hidden shadow-sm ${
        showSearchInput ? "w-72" : "w-10 "
      } ${isFocused ? "ring-2 ring-[#c4a484]" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Tìm kiếm..."
        className={`bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-400 transition-opacity duration-300 ${
          showSearchInput ? "opacity-100 ml-1" : "opacity-0 w-0"
        }`}
      />
      {showSearchInput ? (
        <FontAwesomeIcon
          icon={faArrowRight}
          className="text-gray-500 mr-2 cursor-pointer hover:text-[#c4a484] transition-colors"
        />
      ) : (
        <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
      )}
    </div>
  );
};

export default SearchBox;
