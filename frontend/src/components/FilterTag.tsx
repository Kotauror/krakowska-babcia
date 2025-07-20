export default function FilterTag({
  name,
  selected,
  onClick,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`border-1 md:mx-2 mx-1 my-1 md:px-6 px-2 py-2 text-xs md:text-sm rounded-full decoration-1 hover:cursor-pointer font-medium
 ${selected ? "border-[#27377d]" : "border-gray-600"}  ${
        selected ? "bg-[#b9cbf6]" : "bg-white"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center gap-1">
        {selected && (
          <img
            src="/check.png"
            height={16}
            width={16}
            alt="checkmark"
            className="flex-shrink-0"
          />
        )}
        <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
        <input type="checkbox" checked={selected} className="sr-only" />
      </div>
    </button>
  );
}
