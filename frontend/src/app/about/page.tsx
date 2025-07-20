"use client";

import { useEffect, useState } from "react";

export default function About() {
  const [header, setHeader] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [portraitFoto, setPortraitFoto] = useState<any>(null);
  const [foto1, setFoto1] = useState<any>(null);
  const [foto2, setFoto2] = useState<any>(null);
  const [foto3, setFoto3] = useState<any>(null);

  useEffect(() => {
    const fetchAboutMe = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DIRECTUS_URL}items/o_mnie`
      );
      const data = await response.json();

      setHeader(data.data.naglowek);
      setContent(data.data.tekst);
      setPortraitFoto(data.data.zdjecie_portretowe);

      setFoto1(data.data.zdjecie);
      setFoto2(data.data.zdjecie2);
      setFoto3(data.data.zdjecie3);
    };
    fetchAboutMe();
  }, []);

  return (
    <div className="pt-12 space-y-4 min-h-screen bg-light-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">O mnie</h1>
          <p className="text-xl text-gray-600">{header}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 my-8">
          <div className="flex-shrink-0">
            <img
              src={`http://www.krakowskababcia.pl:8055/assets/${portraitFoto}`}
              alt="Portrait"
              className="w-60 h-60 rounded-full object-cover border-4 border-gray-200 shadow-lg"
            />
          </div>

          <div className="flex-1 prose prose-lg">
            <div
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img
              src={`http://www.krakowskababcia.pl:8055/assets/${foto1}`}
              alt="about me"
              className="w-full h-196 rounded-lg shadow-lg object-cover object-center"
            />
            <img
              src={`http://www.krakowskababcia.pl:8055/assets/${foto2}`}
              alt="about me"
              className="w-full h-196 rounded-lg shadow-lg object-cover object-center"
            />
            <img
              src={`http://www.krakowskababcia.pl:8055/assets/${foto3}`}
              alt="about me"
              className="w-full h-196 rounded-lg shadow-lg object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
