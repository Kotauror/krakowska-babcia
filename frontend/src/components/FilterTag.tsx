export default function FilterTag({
  name,
  selected,
  onClick,
  showCheckbox = true,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
  showCheckbox?: boolean;
}) {
  return (
    <button
      className={`border-1 md:mx-2 mx-1 my-1 md:px-6 px-2 py-2 text-xs md:text-sm rounded-full decoration-1 hover:cursor-pointer font-medium flex items-center gap-2
 ${
   selected
     ? "border-[#27377d] bg-[#215a80] text-white"
     : "border-gray-300 bg-white text-gray-700"
 }`}
      onClick={onClick}
      type="button"
    >
      {showCheckbox && (
        <div className="relative">
          <div
          className={`w-4 h-4 border-2 rounded-lg flex items-center justify-center ${
            selected ? "border-white bg-white" : "border-gray-400 bg-white"
          }`}
        >
          {selected && (
            <svg
              className="w-3 h-3 text-[#27377d]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
          </div>
        </div>
      )}
      <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
    </button>
  );
}
