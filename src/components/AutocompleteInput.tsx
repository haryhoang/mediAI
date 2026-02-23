import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";

interface AutocompleteInputProps {
  onSelect: (medicine: string) => void;
  placeholder?: string;
}

const MEDICINE_DATABASE = [
  "Amoxicillin 500mg",
  "Paracetamol 500mg",
  "Ibuprofen 400mg",
  "Cefuroxime 500mg",
  "Augmentin 1g",
  "Panadol Extra",
  "Decolgen Forte",
  "Hapacol 650",
  "Aspirin 81mg",
  "Metformin 500mg",
  "Amlodipine 5mg",
  "Atorvastatin 10mg",
  "Omeprazole 20mg",
  "Salbutamol 2mg",
  "Cetirizine 10mg",
  "Loratadine 10mg",
  "Prednisolone 5mg",
  "Dexamethasone 0.5mg",
  "Vitamin C 500mg",
  "Zinc 15mg"
];

export const AutocompleteInput = ({ onSelect, placeholder = "Tìm tên thuốc..." }: AutocompleteInputProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = MEDICINE_DATABASE.filter(m => 
      m.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (medicine: string) => {
    onSelect(medicine);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medi-teal/20 focus:border-medi-teal outline-none transition-all"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {suggestions.map((medicine, index) => (
            <button
              key={index}
              onClick={() => handleSelect(medicine)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between group"
            >
              <span className="text-slate-700">{medicine}</span>
              <Plus className="w-4 h-4 text-medi-teal opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
