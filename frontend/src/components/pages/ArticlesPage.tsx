import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ArticleContextType, Article } from '../../types';
import ArticleCard from '../pages/ArticleCard';
import './ArticlesPage.css';

const ArticlesPage = () => {
  const { articles } = useOutletContext<ArticleContextType>();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  const categories = ['All', ...new Set(articles.map(article => article.category))];

  const filteredArticles = articles
    .filter(article => 
      selectedCategory === 'All' || article.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  return (
    <div className="articles-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">All Articles</h1>
          <p className="page-subtitle">Browse our complete collection of tech insights</p>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="category-filter" className="filter-label">Category:</label>
            <select 
              id="category-filter"
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter" className="filter-label">Sort by:</label>
            <select 
              id="sort-filter"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="results-count">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
          </div>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="no-articles">
              <p>No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;