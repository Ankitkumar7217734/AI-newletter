export async function fetchArticles(
  categories: string[]
): Promise<Array<{ title: string; description: string; url: string }>> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  type NewsApiArticle = {
    title?: string | null;
    description?: string | null;
    url?: string | null;
  };

  const promises = categories.map(async (category) => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          category
        )}&from=${since}&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
      );
      if (!response.ok) {
        console.error(
          `Failed to fetch articles for category "${category}":`,
          response.statusText
        );
        return [] as Array<{ title: string; description: string; url: string }>;
      }

      const data = await response.json();
      if (!data || !Array.isArray(data.articles)) return [];

      return (data.articles as NewsApiArticle[])
        .slice(0, 5)
        .map((article) => ({
          title: article.title ?? "",
          description: article.description ?? "",
          url: article.url ?? "",
        }))
        .filter((a) => a.title && a.url) as Array<{
        title: string;
        description: string;
        url: string;
      }>;
    } catch (error) {
      console.error(
        `Error fetching articles for category "${category}":`,
        error
      );
      return [] as Array<{ title: string; description: string; url: string }>;
    }
  });

  const articles = await Promise.all(promises);
  return articles.flat();
}
