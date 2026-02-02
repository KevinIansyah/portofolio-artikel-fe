export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Kevin Iansyah",
    url: "https://keviniansyah.site",
    jobTitle: "Full Stack Developer",
    sameAs: ["https://github.com/KevinIansyah", "https://www.linkedin.com/in/kevin-iansyah/"],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kevin Iansyah Portfolio",
    url: "https://keviniansyah.site",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://keviniansyah.site/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
