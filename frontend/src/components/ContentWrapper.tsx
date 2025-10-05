import { Annie_Use_Your_Telescope } from "next/font/google";

const annie_use_your_telescope = Annie_Use_Your_Telescope({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function ContentWrapper({
  children,
  header,
  subheader,
}: {
  children: React.ReactNode;
  header: string;
  subheader: string;
}) {
  return (
    <div className="pt-12 space-y-4 min-h-screen bg-light-background">
      <div className="container mx-auto px-4">
        <div className={`text-center ${annie_use_your_telescope.className}`}>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{header}</h1>
          <p className="md:text-2xl text-xl text-gray-600 mb-8 ${annie_use_your_telescope.className}">{subheader}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
