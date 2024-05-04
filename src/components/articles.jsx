import React, { useState, useEffect } from 'react';
import { useFirebase } from '../helpers/firebaseConfig';
import 'firebase/compat/database';
import 'firebase/compat/auth';
import File from './file';
import { useStateContext } from '../helpers/context';
import { useAuthState } from 'react-firebase-hooks/auth';

const database = useFirebase.database()
const auth = useFirebase.auth()


function Article() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Charger les articles depuis Firebase
  useEffect(() => {
    const articlesRef = database.ref('articles');
    articlesRef.on('value', (snapshot) => {
      const articlesData = snapshot.val();
      const articlesArray = [];
      for (let id in articlesData) {
        articlesArray.push({ id, ...articlesData[id] });
      }
      setArticles(articlesArray);
    });
  }, []);

  // Ajouter ou mettre à jour un article
  const saveArticle = () => {
    if (editMode) {
      // Mettre à jour l'article existant
      database.ref(`articles/${editId}`).update({
        title: title,
        content: content
      });
      setEditMode(false);
      setEditId(null);
    } else {
      // Ajouter un nouvel article
      database.ref('articles').push({
        title: title,
        content: content
      });
    }
    setTitle('');
    setContent('');
  };

  // Modifier un article
  const editArticle = (id, title, content) => {
    setEditMode(true);
    setEditId(id);
    setTitle(title);
    setContent(content);
  };

  // Supprimer un article
  const deleteArticle = (id) => {
    const articleRef = database.ref(`/articles/${id}`);
    articleRef.remove();
  };

  
  return (
    <div>
      
      <h2>Hi {}</h2>
      <div>
        <h3>Ajouter/Modifier un article</h3>
        <input type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Contenu" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        <button onClick={saveArticle}>{editMode ? 'Modifier' : 'Ajouter'}</button>
      </div>
      <div>
        <h3>Liste des articles</h3>
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <strong>{article.title}</strong>: {article.content}
              <button onClick={() => editArticle(article.id, article.title, article.content)}>Modifier</button>
              <button onClick={() => deleteArticle(article.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
      <File />
    </div>
  );
}

export default Article;