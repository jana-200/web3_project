import { Link } from 'react-router-dom';
import { Article } from '../../types';
import './ArticleCard.css';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link to={`/articles/${article.id}`} className="article-card-link">
      <div className="article-card">
        <div className="card-header">
          <span className="category-badge">{article.category}</span>
          <span className="article-date">{article.date}</span>
        </div>
        
        <div className="card-content">
          <h3 className="article-title">{article.title}</h3>
          <p className="article-excerpt">{article.excerpt}</p>
          
          <div className="card-footer">
            <span className="article-author">By {article.author}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;