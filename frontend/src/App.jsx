// Composant principal de l'application
import { useState } from 'react'
import './App.css'

function App() {
  // Texte en cours de saisie dans le champ
  const [titreSaisi, setTitreSaisi] = useState('')
  // Liste des idées ajoutées (perdue au rechargement de la page, c'est voulu)
  const [idees, setIdees] = useState([])

  // Ajoute l'idée saisie à la liste, puis vide le champ
  function ajouterIdee(evenement) {
    evenement.preventDefault()
    const titre = titreSaisi.trim()
    // On ignore les idées vides
    if (titre === '') return
    setIdees([...idees, { id: Date.now(), titre: titre }])
    setTitreSaisi('')
  }

  return (
    <main>
      {/* Titre de la page : il dépend de l'environnement (fichiers .env) */}
      <h1>{import.meta.env.VITE_APP_NAME}</h1>

      {/* Formulaire de saisie d'une idée */}
      <form onSubmit={ajouterIdee}>
        <input
          type="text"
          placeholder="Titre de l'idée"
          value={titreSaisi}
          onChange={(evenement) => setTitreSaisi(evenement.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      {/* Liste des idées ajoutées */}
      <ul>
        {idees.map((idee) => (
          <li key={idee.id}>{idee.titre}</li>
        ))}
      </ul>
    </main>
  )
}

export default App
