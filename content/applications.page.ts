export const layout = 'application.vto';

export default function* ({ search }: { search: any }) {
  // Applications are loaded from _data/applications.yml
  // The data structure has an 'applications' array
  const data = search.data() || {};
  const applications = data.applications?.applications || [];

  for (const app of applications) {
    yield {
      url: `/application/${app.slug}/`,
      title: `Application for ${app.company}`,
      description: `Job application for ${app.company}`,
      lang: app.lang || 'en',
      slug: app.slug,
      company: app.company,
      headline: app.headline,
      hero_claim: app.hero_claim,
      video: app.video,
      documents: app.documents || [],
      indexable: false, // Don't index these pages in search engines
    };
  }
}
