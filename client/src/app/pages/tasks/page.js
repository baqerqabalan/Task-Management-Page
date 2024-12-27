import React, { useState } from "react";
import Header from "../../components/tasks/Header";
import ThemeProvider from "../../context/ThemeProviderComponent";
import FilterBar from "@/app/components/tasks/FilterBar";
import TasksList from "@/app/components/tasks/TasksList";

const Tasks = () => {
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("");

  //Handle Fetch Data after successful Addition
  const triggerFetchData = () => {
    setShouldFetchData(true);
  };

  // Handle search term from Filter Bar
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle filter option from Filter Bar
  const handleFilterChange = (filter) => {
    setFilterOption(filter);
  };


  return (
    <ThemeProvider>
      <Header />
      <FilterBar onTaskAdded={triggerFetchData} onSearch={handleSearch} onFilterChange={handleFilterChange} />
      <TasksList shouldFetchData={shouldFetchData} searchTerm={searchTerm} filterOption={filterOption}/>
    </ThemeProvider>
  );
};

export default Tasks;