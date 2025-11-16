import { useParams, useOutletContext } from 'react-router-dom';
import { ArticleContextType } from '../../types';
import './ArticleDetailPage.css';
import article1 from '../../assets/article1.jpg'
import article2 from '../../assets/article2.webp'
import article3 from '../../assets/article3.png'

const ArticleDetailPage = () => {
  const { articles } = useOutletContext<ArticleContextType>();
  const { id } = useParams<{ id: string }>();
  const articleId = Number(id);
  const article = articles.find(a => a.id === articleId);

  const articleImages: { [key: number]: string } = {
    1: article1,
    2: article2,
    3: article3,
  };

  const articleImage = article ? articleImages[article.id] : null;

  if (!article) {
    return (
      <div className="article-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Article Not Found</h2>
            <p>The article you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <div className="container">
        <article className="article-detail">
          <header className="article-header">
            <div className="article-meta-top">
              <span className="category">{article.category}</span>
              <span className="publication-date">{article.date}</span>
            </div>
            
            <h1 className="article-title">{article.title}</h1>
            
            <div className="author-info">
              <span className="author">By {article.author}</span>
              <span className="read-time">3 min read</span>
            </div>
          </header>

          <div className="article-image">
            {articleImage ? (
              <img 
                src={articleImage} 
                alt={article.title}
                className="article-image-real"
              />
            ) : (
              <div className="image-placeholder-large">
                <span>Featured Image</span>
              </div>
            )}
          </div>

          <div className="article-content">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <footer className="article-footer">
            <div className="tags">
              <span className="tag-label">Tags:</span>
              <span className="tag">Technology</span>
              <span className="tag">Innovation</span>
              <span className="tag">{article.category}</span>
              <span className="tag">Research</span>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetailPage;