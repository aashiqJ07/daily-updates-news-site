// src/pages/News.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard.jsx';
import { Loader2 } from 'lucide-react';

const NEWSAPI_KEY = '87055bf8e55440909184a60c843c7b45'; // <- REPLACE THIS WITH YOUR REAL KEY

const News = ({ country = 'us', category = 'general', articles, setArticles }) => {
  const [internalArticles, setInternalArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const effectiveArticles = Array.isArray(articles) ? articles : internalArticles;
  const setArticlesSafe = typeof setArticles === 'function' ? setArticles : setInternalArticles;

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllNews = async () => {
      setErrorMsg('');

      if (!NEWSAPI_KEY || NEWSAPI_KEY === 'YOUR_API_KEY_HERE') {
        setErrorMsg('Missing API key. Replace NEWSAPI_KEY in News.jsx with your NewsAPI key.');
        return;
      }

      try {
        setLoading(true);
        const url = `https://newsapi.org/v2/top-headlines?country=${encodeURIComponent(
          country
        )}&category=${encodeURIComponent(category)}&pageSize=40&apiKey=${encodeURIComponent(NEWSAPI_KEY)}`;

        const res = await axios.get(url, { signal: controller.signal });
        const fetched = res?.data?.articles ?? [];
        setArticlesSafe(fetched);
      } catch (error) {
        if (axios.isCancel && axios.isCancel(error)) return;
        if (error.name === 'AbortError' || error.name === 'CanceledError') return;

        console.error('fetchAllNews error:', error);
        if (error?.response) {
          const status = error.response.status;
          const data = error.response.data;
          setErrorMsg(`Request failed: ${status} — ${data?.message || JSON.stringify(data)}`);
        } else {
          setErrorMsg(error.message || 'Network error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
    return () => controller.abort();
  }, [country, category, setArticles]);

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 min-h-screen flex flex-col gap-3 items-center justify-center py-24">
        <Loader2 className="h-12 w-12 animate-spin dark:text-gray-200" />
        <h1 className="text-gray-800 text-xl font-semibold dark:text-gray-200">Loading...</h1>
      </div>
    );
  }

  return (
    <>
      {errorMsg && (
        <div className="max-w-7xl mx-auto p-4 text-red-600 dark:text-red-300">
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      <div className="bg-gray-100 dark:bg-gray-800 py-24 px-4 md:px-0 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {!effectiveArticles || effectiveArticles.length === 0 ? (
            <div className="text-center py-20 text-gray-700 dark:text-gray-200">
              <h2 className="text-2xl font-semibold">No articles found</h2>
              <p className="mt-2">Try searching, changing category or check your API key.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {effectiveArticles.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default News;
