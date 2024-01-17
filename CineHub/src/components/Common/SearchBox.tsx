import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { getSearchKeyword } from "../../services/search";
import { useDebounce } from "../../hooks/useDebounce";

interface SearchBoxProps {
  autoFocus?: boolean;
  className?: string;
}

function SearchBox({ autoFocus, className }: SearchBoxProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );
  const debounceSearchInput = useDebounce<string>(searchInput);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setSuggestions([]);

    if (!debounceSearchInput.trim()) return;

    getSearchKeyword(debounceSearchInput.trim()).then((keywords) =>
      setSuggestions(keywords)
    );
  }, [debounceSearchInput, location.search]);

  const searchSubmitHandler = (e: FormEvent) => {
    e.preventDefault();

    if (!searchInput.trim()) return;

    navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
    setSuggestions([]);
  };

  return (
    <>
      <div
        className={`${className} absolute z-30 top-7 left-6 right-6 rounded-full md:rounded-none shadow-md group bg-dark border border-gray-light ${
          suggestions.length > 0 && "!rounded-3xl md:!rounded-none"
        }`}
      >
        <form onSubmit={searchSubmitHandler} className="relative  ">
          <input
            className="w-full pl-14 pr-7 py-2 outline-none bg-transparent  placeholder-gray-500 text-white"
            type="text"
            placeholder="Search..."
            value={searchInput}
            autoFocus={autoFocus}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="absolute top-1/2 -translate-y-1/2 left-5">
            <BiSearch
              size={25}
              className="hover:text-white transition duration-300"
            />
          </button>
        </form>

        {suggestions.length > 0 && (
          <ul className="hidden group-focus-within:flex flex-col gap-3 py-3 relative after:absolute after:top-0 after:h-[2px]  after:bg-gray-dark after:left-[5%] after:right-[5%]">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    navigate(`/search?query=${encodeURIComponent(suggestion)}`);
                    setSuggestions([]);
                  }}
                  className="flex items-center gap-3 ml-5 hover:text-white transition duration-300"
                >
                  <BiSearch size={25} />
                  <span>{suggestion}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default SearchBox;
