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
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{header}</h1>
          <p className="text-xl text-gray-600 mb-8">{subheader}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
