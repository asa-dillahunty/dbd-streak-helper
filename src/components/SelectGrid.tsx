import React, { useState } from "react";
import { PrizeItem } from "./PrizeWheel";
import { Button } from "./ui/button";

interface SelectGridProps {
  items: PrizeItem[];
  handleSelection: (item: PrizeItem) => void;
}

const SelectGrid: React.FC<SelectGridProps> = ({ items, handleSelection }) => {
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

  return (
    <div className="p-4">
      {/* Search bar */}
      <div className="mb-4">
        <input
          autoFocus
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-input bg-card px-4 py-2 text-card-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
        />
      </div>

      {/* Grid of prize icons */}
      {/* min-h-[calc((28+4)*3*.25rem)] force height of table for last page */}
      {/* min-w-[calc((28+4)*7*.25rem)] force width of table for last page */}
      <div className="grid grid-cols-7 gap-4 min-h-[calc((28+4)*3*.25rem)] min-w-[calc((28+4)*7*.25rem)]">
        {currentItems.map((item, index) => (
          <div
            key={index + item.name}
            className="group relative flex h-min items-center justify-center rounded bg-muted hover:cursor-pointer hover:bg-accent"
            onClick={() => handleSelection(item)}
          >
            <img src={item.iconURL} alt={item.name} className="w-28 h-28" />
            {/* Hovercard */}
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background opacity-0 transition-opacity group-hover:opacity-100">
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
          variant="outline"
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
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SelectGrid;
