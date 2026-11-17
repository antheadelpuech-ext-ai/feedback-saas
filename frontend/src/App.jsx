// Composant principal de l'application
import { useState } from 'react'
import './App.css'

// Les 3 réactions possibles sur une réponse
const REACTIONS = [
  { cle: 'pouce', emoji: '👍' },
  { cle: 'coeur', emoji: '❤️' },
  { cle: 'lunettes', emoji: '😎' },
]

// Papillons décoratifs : position de départ, durée du vol et décalage
// (le décalage négatif évite qu'ils bougent tous en même temps)
const PAPILLONS = [
  { gauche: '5%', haut: '10%', duree: '9s', decalage: '0s' },
  { gauche: '85%', haut: '8%', duree: '11s', decalage: '-3s' },
  { gauche: '15%', haut: '45%', duree: '10s', decalage: '-6s' },
  { gauche: '90%', haut: '40%', duree: '12s', decalage: '-2s' },
  { gauche: '8%', haut: '80%', duree: '8s', decalage: '-5s' },
  { gauche: '75%', haut: '85%', duree: '10s', decalage: '-7s' },
  { gauche: '45%', haut: '5%', duree: '13s', decalage: '-4s' },
  { gauche: '50%', haut: '92%', duree: '9s', decalage: '-1s' },
  { gauche: '30%', haut: '25%', duree: '11s', decalage: '-8s' },
  { gauche: '65%', haut: '60%', duree: '12s', decalage: '-9s' },
]

function App() {
  // Texte en cours de saisie dans le champ
  const [titreSaisi, setTitreSaisi] = useState('')
  // Liste des idées ajoutées (perdue au rechargement de la page, c'est voulu)
  // Chaque idée a un id, un titre et une liste de réponses
  // Chaque réponse a un texte et un compteur par réaction
  const [idees, setIdees] = useState([])

  // Le formulaire de réponse est-il affiché ?
  const [reponseOuverte, setReponseOuverte] = useState(false)
  // Idée choisie dans la liste déroulante
  const [ideeChoisieId, setIdeeChoisieId] = useState('')
  // Texte du commentaire en cours de saisie
  const [commentaireSaisi, setCommentaireSaisi] = useState('')

  // Ajoute l'idée saisie à la liste, puis vide le champ
  function ajouterIdee(evenement) {
    evenement.preventDefault()
    const titre = titreSaisi.trim()
    // On ignore les idées vides
    if (titre === '') return
    setIdees([...idees, { id: Date.now(), titre: titre, commentaires: [] }])
    setTitreSaisi('')
  }

  // Affiche le formulaire de réponse, avec la première idée présélectionnée
  function ouvrirReponse() {
    setIdeeChoisieId(String(idees[0].id))
    setReponseOuverte(true)
  }

  // Ajoute le commentaire à l'idée choisie, puis ferme le formulaire
  function envoyerCommentaire(evenement) {
    evenement.preventDefault()
    const texte = commentaireSaisi.trim()
    // On ignore les commentaires vides
    if (texte === '') return
    const nouvelleReponse = {
      texte: texte,
      reactions: { pouce: 0, coeur: 0, lunettes: 0 },
    }
    setIdees(
      idees.map((idee) =>
        String(idee.id) === ideeChoisieId
          ? { ...idee, commentaires: [...idee.commentaires, nouvelleReponse] }
          : idee,
      ),
    )
    setCommentaireSaisi('')
    setReponseOuverte(false)
  }

  // Ajoute 1 au compteur d'une réaction, sur une réponse d'une idée
  function reagir(ideeId, positionReponse, cleReaction) {
    setIdees(
      idees.map((idee) => {
        if (idee.id !== ideeId) return idee
        const commentaires = idee.commentaires.map((reponse, position) =>
          position === positionReponse
            ? {
                ...reponse,
                reactions: {
                  ...reponse.reactions,
                  [cleReaction]: reponse.reactions[cleReaction] + 1,
                },
              }
            : reponse,
        )
        return { ...idee, commentaires: commentaires }
      }),
    )
  }

  return (
    <>
    {/* Papillons holographiques qui volent sur toute la page (pure décoration) */}
    <div className="papillons">
      {PAPILLONS.map((papillon, position) => (
        <div
          key={position}
          className="papillon"
          style={{
            left: papillon.gauche,
            top: papillon.haut,
            animationDuration: papillon.duree,
            animationDelay: papillon.decalage,
          }}
        >
          <div className="papillon-ailes" />
        </div>
      ))}
    </div>

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

      {/* Liste des idées et de leurs réponses, en bulles de BD */}
      <ul>
        {idees.map((idee) => (
          <li key={idee.id}>
            {/* Bulle de l'idée (la "question") */}
            <div className="bulle bulle-idee">{idee.titre}</div>

            {/* Bulles des réponses, avec les boutons de réaction */}
            {idee.commentaires.map((reponse, position) => (
              <div key={position} className="bulle bulle-reponse">
                {reponse.texte}
                <div className="reactions">
                  {REACTIONS.map((reaction) => (
                    <button
                      key={reaction.cle}
                      type="button"
                      className="reaction"
                      onClick={() => reagir(idee.id, position, reaction.cle)}
                    >
                      {reaction.emoji} {reponse.reactions[reaction.cle]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </li>
        ))}
      </ul>

      {/* Bouton "Répondre" : visible seulement s'il y a au moins une idée */}
      {idees.length > 0 && !reponseOuverte && (
        <button type="button" onClick={ouvrirReponse}>
          Répondre
        </button>
      )}

      {/* Formulaire de réponse : choix de l'idée et saisie du commentaire */}
      {reponseOuverte && (
        <form onSubmit={envoyerCommentaire}>
          <select
            value={ideeChoisieId}
            onChange={(evenement) => setIdeeChoisieId(evenement.target.value)}
          >
            {idees.map((idee) => (
              <option key={idee.id} value={String(idee.id)}>
                {idee.titre}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Votre commentaire"
            value={commentaireSaisi}
            onChange={(evenement) => setCommentaireSaisi(evenement.target.value)}
          />
          <button type="submit">Envoyer</button>
        </form>
      )}
    </main>
    </>
  )
}

export default App
