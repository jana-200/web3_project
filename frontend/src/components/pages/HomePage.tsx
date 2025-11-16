import { useOutletContext } from 'react-router-dom';
import { ArticleContextType, Article } from '../../types';
import ArticleCard from '../pages/ArticleCard';
import './HomePage.css';

const HomePage = () => {
  const { articles } = useOutletContext<ArticleContextType>();

  const latestArticles = articles.slice(-3).reverse();

  return (
    <div className="home-page">
      <div className="container">
        {/* Latest Articles */}
        <section className="latest-articles">
          <h2 className="section-title">Latest Updates</h2>
          <div className="articles-grid">
            {latestArticles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePage;