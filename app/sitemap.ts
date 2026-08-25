import type { MetadataRoute } from "next";

// TODO: Update to Star Grade once setup
const siteUrl = "https://astro-dashboard-six.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
    ];
}
