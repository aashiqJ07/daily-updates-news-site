// src/components/NewsCard.jsx
import React from 'react';

function NewsCard({ article }) {
  if (!article) return null;

  const { source, author, title, description, url, urlToImage, publishedAt } = article;

  const image = urlToImage || 'https://via.placeholder.com/800x450?text=No+Image';
  const date = publishedAt ? new Date(publishedAt).toLocaleString() : '';

  return (
    <article className="max-w-md mx-auto bg-white dark:bg-gray-900 hover:scale-[1.02] transition-all rounded-xl shadow-md overflow-hidden hover:shadow-lg duration-300">
      <a href={url || '#'} target="_blank" rel="noopener noreferrer" className="block">
        <div className="h-48 w-full overflow-hidden bg-gray-200">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="p-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 hover:text-blue-600">
            {title || 'Untitled'}
          </h2>

          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
              {description.length > 120 ? `${description.slice(0, 120)}...` : description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">{source?.name || 'Unknown'}</span>
            <span>{date}</span>
          </div>
        </div>
      </a>
    </article>
  );
}

export default NewsCard;
