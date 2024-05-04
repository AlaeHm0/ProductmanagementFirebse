import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const storage = firebase.storage();
// Configuration Firebase (à remplacer par votre propre configuration)

const File = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  // Gestion du changement de fichier
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Envoi du fichier vers Firebase Storage
  const handleUpload = () => {
    if (file) {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(file.name);
      fileRef.put(file).then(() => {
        alert("Fichier envoyé avec succès !");
      }).catch(error => {
        console.error("Erreur lors de l'envoi du fichier :", error);
      });
    } else {
      alert("Aucun fichier sélectionné !");
    }
  };

  const fetchFile = async () => {
        try {
            const storageRef = storage.ref()
            const childRef = storageRef.child('/etude.jpg')
            const url = await childRef.getDownloadURL()
            setFileUrl(url)
        }catch(err){
            console.error(err)
        }
        
    }
  useEffect(()=>{
    fetchFile()
  },[])
  return (
    <div>
      <h2>Uploader un fichier vers Firebase Storage</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Envoyer</button>
      <img src={fileUrl} alt="" />
    </div>
  );
};

export default File;
