import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Configurer Firebase (insérer votre propre configuration Firebase ici)
const firebaseConfig = {
  apiKey: "AIzaSyBn8efw7rjFYtjgHAbxL5ndIKF6t9-OZ5E",
  authDomain: "testfirebase-420a8.firebaseapp.com",
  databaseURL: "https://testfirebase-420a8-default-rtdb.firebaseio.com",
  projectId: "testfirebase-420a8",
  storageBucket: "testfirebase-420a8.appspot.com",
  messagingSenderId: "966048459097",
  appId: "1:966048459097:web:af8009de3191f45ced4448"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function App() {
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Charger les personnes depuis Firebase Firestore
  useEffect(() => {
    const unsubscribe = db.collection('persons').onSnapshot((snapshot) => {
      const personsData = [];
      snapshot.forEach((doc) => {
        personsData.push({ id: doc.id, ...doc.data() });
      });
      setPersons(personsData);
    });

    return () => unsubscribe();
  }, []);

  // Ajouter ou mettre à jour une personne
  const savePerson = () => {
    if (editMode && editId) {
      db.collection('persons').doc(editId).update({
        name: name,
        age: parseInt(age)
      });
      setEditMode(false);
      setEditId(null);
    } else {
      db.collection('persons').add({
        name: name,
        age: parseInt(age)
      });
    }
    setName('');
    setAge('');
  };

  // Pré-remplir le formulaire avec les données de la personne à modifier
  const editPerson = (id, name, age) => {
    setEditMode(true);
    setEditId(id);
    setName(name);
    setAge(age.toString());
  };

  // Supprimer une personne
  const deletePerson = (id) => {
    db.collection('persons').doc(id).delete();
  };
  const test = async () => {
    try{
      const users = await db.collection('persons').get();
      alert("Success! : ");
      const tableUsers = users.docs.map(user => user.data()
      )
      console.log(tableUsers)
    }catch(error){
      console.error("There is an error ! : " + error)
    }
  }

  return (
    <div>
      <h2>CRUD avec Firebase Firestore</h2>
      <div>
        <h3>{editMode ? 'Modifier' : 'Ajouter'} une personne</h3>
        <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Âge" value={age} onChange={(e) => setAge(e.target.value)} />
        <button onClick={savePerson}>{editMode ? 'Modifier' : 'Ajouter'}</button>
        <button onClick={()=>test()}>Test</button>
      </div>
      <div>
        <h3>Liste des personnes</h3>
        <ul>
          {persons.map((person) => (
            <li key={person.id}>
              <strong>{person.name}</strong> ({person.age} ans)
              <button onClick={() => editPerson(person.id, person.name, person.age)}>Modifier</button>
              <button onClick={() => deletePerson(person.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;