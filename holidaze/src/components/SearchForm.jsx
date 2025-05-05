import { useEffect, useState } from "react";
import debounce from "lodash.debounce";

const SearchForm = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState({
    country: "",
    guests: "",
    checkIn: "",
    checkOut: "",
  });


  const debouncedSearch = debounce((input) => {
    onSearch(input);
  }, 500); 


  useEffect(() => {
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel(); // cancel the debounce when the component is unmounted or before the next effect
  }, [searchInput]); 

  const handleChange = (e) => {
    setSearchInput({ ...searchInput, [e.target.name]: e.target.value });
  };


  const getValidSearchParams = () => {
    const { country, guests, checkIn, checkOut } = searchInput;
    const validSearchParams = {};

    if (country) validSearchParams.country = country;
    if (guests) validSearchParams.guests = parseInt(guests, 10); 
    if (checkIn) validSearchParams.checkIn = checkIn;
    if (checkOut) validSearchParams.checkOut = checkOut;

    return validSearchParams;
  };


  useEffect(() => {
    const validSearchParams = getValidSearchParams();
    debouncedSearch(validSearchParams); 
  }, [searchInput]);

  return (
    <form className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <input
        type="text"
        name="country"
        placeholder="Search by country"
        value={searchInput.country}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="number"
        name="guests"
        placeholder="Guests"
        value={searchInput.guests}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="date"
        name="checkIn"
        value={searchInput.checkIn}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="date"
        name="checkOut"
        value={searchInput.checkOut}
        onChange={handleChange}
        className="p-2 border rounded"
      />
    </form>
  );
};

export default SearchForm;
