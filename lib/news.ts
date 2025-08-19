export async function fetchArticles(categories: string[]): Promise<Array<{title: string; description: string; url: string}>> {
  const since=new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const promises = categories.map(category => {
    try{
      return fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(category)}&from=${since}&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`)
        .then(response => response.json())
        .then(data => data.articles);
    }catch(error){
      console.error(`Error fetching articles for category "${category}":`, error);
      return [];
    }
  });
  const articles = await Promise.all(promises);
  return articles.flat();
}