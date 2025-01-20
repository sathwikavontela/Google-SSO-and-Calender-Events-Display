import React from "react";

const FilterDateInput = ({ filterDate, setFilterDate }) => (
  <div className="w-full flex justify-end">
    <input
      className="block w-36 mb-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      type="date"
      onChange={(e) => setFilterDate(e.target.value)}
      value={filterDate}
    />
  </div>
);

export default FilterDateInput;
