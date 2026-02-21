import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBox = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isExpanded = isHovered || isFocused;

  useEffect(() => {
    if (!isExpanded && inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.blur();
    }
  }, [isExpanded]);

  return (
    <div
      className={`flex items-center rounded-full border bg-white shadow-sm transition-all duration-500 ease-in-out ${
        isExpanded 
          ? "w-64 border-[#c4a484] px-4 py-2 justify-between"
          : "w-10 h-10 border-transparent justify-center cursor-pointer hover:bg-gray-100"
      } ${isFocused ? "ring-2 ring-[#c4a484]/20" : ""}`}
      
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Tìm kiếm..."
        className={`bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 transition-all duration-500 ease-in-out ${
          isExpanded 
            ? "w-full opacity-100 mr-2"
            : "w-0 opacity-0 p-0" 
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <FontAwesomeIcon
        icon={faSearch}
        className={`text-gray-500 transition-colors duration-300 ${
            isExpanded ? "text-[#c4a484]" : "text-lg"
        }`}
      />
    </div>
  );
};

export default SearchBox;