import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://inha-alumni.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/about/greeting",
    "/about/rules",
    "/about/organization",
    "/about/history",
    "/about/location",
    "/news/notice",
    "/news/events",
    "/news/newsletter",
    "/news/press",
    "/news/gallery",
    "/business/shop",
    "/business/card",
    "/business/place",
    "/business/concert",
    "/business/startup",
    "/community/local-news",
    "/community/board",
    "/community/condolence",
    "/community/jobs",
    "/network/search",
    "/network/guide",
    "/network/companies",
    "/network/industry",
    "/scholarship/about",
    "/scholarship/fund",
    "/scholarship/donors",
    "/scholarship/notice",
    "/university/news",
    "/university/academic",
    "/donate",
  ];

  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
