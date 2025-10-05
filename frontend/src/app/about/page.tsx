"use client";

import ContentWrapper from "@/components/ContentWrapper";
import { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";

export default function About() {
  const [header, setHeader] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [portraitFoto, setPortraitFoto] = useState<any>(null);
  const [foto1, setFoto1] = useState<any>(null);
  const [foto2, setFoto2] = useState<any>(null);
  const [foto3, setFoto3] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        setLoading(true);
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
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutMe();
  }, []);

  if (loading) {
    return (
      <div className="pt-12 min-h-screen bg-light-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <ContentWrapper header="O mnie" subheader={header}>
      <div className="flex flex-col md:flex-row items-center gap-8 my-8">
        <div className="flex-shrink-0">
          <img
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${portraitFoto}`}
            alt="Portrait"
            className="w-60 h-60 rounded-full object-cover border-4 border-gray-200 shadow-lg"
          />
        </div>

        <div className="flex-1 prose prose-lg">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(content),
            }}
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <img
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${foto1}`}
            alt="about me"
            className="w-full h-196 rounded-lg shadow-lg object-cover object-center"
          />
          <img
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${foto2}`}
            alt="about me"
            className="w-full h-196 rounded-lg shadow-lg object-cover object-center"
          />
          <img
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${foto3}`}
            alt="about me"
            className="w-full h-196 rounded-lg shadow-lg object-cover object-center"
          />
        </div>
      </div>
    </ContentWrapper>
  );
}
