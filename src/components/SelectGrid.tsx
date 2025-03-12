import React, { useState } from "react";
import { PrizeItem } from "./PrizeWheel";
import { Button } from "./ui/button";

interface SelectGridProps {
  items: PrizeItem[];
}

const SelectGrid: React.FC<SelectGridProps> = ({ items }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 21; // Adjust as needed

  // Filter items by search query (case-insensitive)
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleSelection = (item: PrizeItem) => {
    console.log(item.name);
  };

  return (
    <div className="p-4">
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Grid of prize icons */}
      {/* min-h-[calc((28+4)*3*.25rem)] force height of table for last page */}
      {/* min-w-[calc((28+4)*7*.25rem)] force width of table for last page */}
      <div className="grid grid-cols-7 gap-4 min-h-[calc((28+4)*3*.25rem)] min-w-[calc((28+4)*7*.25rem)]">
        {currentItems.map((item, index) => (
          <div
            key={index + item.name}
            className="relative group flex justify-center items-center bg-slate-800 hover:bg-slate-700 rounded hover:cursor-pointer h-min"
            onClick={() => handleSelection(item)}
          >
            <img src={item.iconURL} alt={item.name} className="w-28 h-28" />
            {/* Hovercard */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap">
              {item.name}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          variant={"default"}
        >
          Previous
        </Button>
        <span>
          Page {currentPage + 1} of {totalPages || 1}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage >= totalPages - 1 || totalPages === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SelectGrid;
