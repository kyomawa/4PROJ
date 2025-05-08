"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchLocation } from "@/actions/navigation/action";
import { LocationResult } from "@/actions/navigation/types";
import { Search, X, MapPin } from "lucide-react";

// ===================================================================================================

type MapSearchBarProps = {
  onLocationSelect: (location: { name: string; position: { lat: number; lng: number } }) => void;
  placeholder?: string;
};

// ===================================================================================================

export default function MapSearchBar({ onLocationSelect, placeholder = "Où allez-vous ?" }: MapSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch search results
  useEffect(() => {
    if (debouncedSearchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const result = await searchLocation(debouncedSearchQuery);
        if (result.success && result.data) {
          setSearchResults(result.data);
          setShowResults(true);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [debouncedSearchQuery]);

  const handleLocationClick = (location: LocationResult) => {
    onLocationSelect({
      name: location.formatted || `${location.street || ""} ${location.city || ""}`.trim(),
      position: { lat: location.latitude, lng: location.longitude },
    });
    setSearchQuery("");
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div ref={searchContainerRef} className="relative w-full z-[4999]">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <Search className="size-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <div className="size-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Results dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-[4999] max-h-80 overflow-y-auto">
          <div className="p-1">
            {searchResults.map((result, index) => (
              <div
                key={`${result.placeId}-${index}`}
                className="p-3 hover:bg-neutral-50 rounded cursor-pointer"
                onClick={() => handleLocationClick(result)}
              >
                <div className="flex items-start">
                  <MapPin className="size-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium line-clamp-1">{result.formatted || result.placeId}</div>
                    {(result.street || result.city || result.country) && (
                      <div className="text-sm text-neutral-500 line-clamp-1">
                        {[result.street, result.city, result.country].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {showResults && searchQuery.length >= 3 && searchResults.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-[4999]">
          <div className="p-4 text-center text-neutral-500">Aucun résultat trouvé pour &quot;{searchQuery}&quot;</div>
        </div>
      )}
    </div>
  );
}

// ===================================================================================================
