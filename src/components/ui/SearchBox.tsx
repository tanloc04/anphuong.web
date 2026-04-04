import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "@/hooks/useDebounce"; // Trỏ đúng đường dẫn hook của sếp
import axiosClient from "@/api/axiosClient";
import type { SearchResult } from "@/@types/product.types";

const SearchBox = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Logic Search & Gợi ý
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isExpanded = isHovered || isFocused || searchTerm.length > 0;

  // 1. Áp dụng "Bùa chú" Debounce
  const debouncedTerm = useDebounce(searchTerm, 300);

  // 2. Click outside để đóng dropdown và thu gọn input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Gọi API Autocomplete khi debouncedTerm thay đổi
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedTerm.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        // Gọi API sếp vừa viết ở Backend
        const res = await axiosClient.get(
          `/product/autocomplete?keyword=${debouncedTerm}`,
        );
        if (res.data?.success) {
          setResults(res.data.data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Lỗi search:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedTerm]);

  const handleSelectProduct = (id: number) => {
    setShowDropdown(false);
    setSearchTerm("");
    setIsFocused(false);
    navigate(`/product/${id}`);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Search Input Container */}
      <div
        className={`flex items-center rounded-full border bg-white shadow-sm transition-all duration-500 ease-in-out ${
          isExpanded
            ? "w-80 border-[#c4a484] px-4 py-2"
            : "w-10 h-10 border-transparent justify-center cursor-pointer hover:bg-gray-100"
        } ${isFocused ? "ring-2 ring-[#c4a484]/20" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Tìm sản phẩm, mã SKU..."
          className={`bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 transition-all duration-500 ease-in-out ${
            isExpanded ? "w-full opacity-100 mr-2" : "w-0 opacity-0 p-0"
          }`}
          onFocus={() => setIsFocused(true)}
        />

        {loading ? (
          <FontAwesomeIcon icon={faSpinner} spin className="text-[#c4a484]" />
        ) : (
          <FontAwesomeIcon
            icon={faSearch}
            className={`transition-colors duration-300 ${
              isExpanded ? "text-[#c4a484]" : "text-gray-500 text-lg"
            }`}
          />
        )}
      </div>

      {/* 🚀 DROP DOWN KẾT QUẢ - BAY LƠ LỬNG 🚀 */}
      {showDropdown && isExpanded && searchTerm.trim().length >= 2 && (
        <div className="absolute top-12 right-0 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[999] overflow-hidden animate-fade-in">
          {results.length === 0 && !loading ? (
            <div className="p-4 text-center text-sm text-gray-400 italic">
              Không tìm thấy kết quả...
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50">
                Gợi ý sản phẩm
              </div>
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectProduct(item.id)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                >
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/40"}
                    alt={item.productName}
                    className="w-10 h-10 object-cover rounded-md shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      {item.productName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] bg-gray-100 text-gray-500 px-1 rounded border border-gray-200">
                        {item.productCode}
                      </span>
                      <span className="text-xs text-[#c4a484] font-bold">
                        {item.price.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
