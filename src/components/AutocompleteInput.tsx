import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

const AutocompleteInput: React.FC<{
  onSelectedValue: (value: string) => void;
  title: string;
  placeholder: string;
  data: string[];
  minLength: number;
  limit: number;
}> = ({
  onSelectedValue,
  title,
  placeholder,
  data = [],
  minLength = 3,
  limit = 10,
}) => {
  const uuid = useMemo(() => crypto.randomUUID(), []);
  const [inputValue, setInputValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (data.length === 0) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (activeIndex > 0) setActiveIndex(activeIndex - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (activeIndex < data.length - 1) setActiveIndex(activeIndex + 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        const selectedItem = data[activeIndex];
        setInputValue(selectedItem);
      }
      onSelectedValue("");
    }
  };

  const debounceHandler = (value: string) => {
    setActiveIndex(-1);
    onSelectedValue(minLength > value.length ? "" : value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceInput = useCallback(debounce(debounceHandler, 500), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceInput(e.target.value);
    setInputValue(e.target.value);
  };

  useEffect(() => {
    return () => debounceInput.cancel();
  }, [debounceInput]);

  return (
    <div className="relative">
      <label
        htmlFor={`autocomplete_input_${uuid}`}
        className="block text-xs font-medium text-gray-700 dark:text-gray-200"
      >
        {title}
      </label>

      <input
        type="text"
        id={`autocomplete_input_${uuid}`}
        placeholder={placeholder}
        onChange={handleInputChange}
        value={inputValue}
        onKeyDown={handleKeyDown}
        className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />

      <div className="absolute top-[100] mt-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        <ul>
          {data.slice(0, limit).map((item, index) => (
            <li
              className={`
                cursor-pointer rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                ${index === activeIndex ? "bg-gray-100 dark:bg-gray-700" : ""}
              `}
              onClick={() => {
                setInputValue(item);
                onSelectedValue("");
              }}
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AutocompleteInput;
