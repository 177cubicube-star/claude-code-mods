import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Titre } from '../types'

// Texte noir sur fond jaune vif : contraste maximal (rendu du panneau).
const TEXTE = '#000000'
const FOND = '#FFD400'

// Affiché tant que la session n'a pas encore de nom.
const SANS_NOM = 'SESSION SANS NOM'

const PANNEAU = 'banniere'
const TITRE_PANNEAU = 'Session de travail'

// Largeur demandée au panneau ancré : assez pour le nom, sans écraser la conversation.
const COLONNES = 32

// La ligne de statut n'accepte que du texte brut. Majuscules simples et barres :
// les lettres Unicode « gras » et les emojis se rendent à des largeurs inégales.
const ligne = (nom: string): string => `▌ ${nom.toUpperCase()} ▐`

const titre = atom({ plugin: 'message-banniere', key: 'titre' } as const, null as Titre)

export const register: Register = on => {
  // Le nom de la session accompagne ces deux événements « classic » ;
  // on le mémorise dès qu'il est présent (il peut apparaître après le démarrage).
  on('classic.SessionStart', async ($, e, next) => {
    if (e.session_title) await update($, titre, () => e.session_title ?? null)
    $.ui.status(ligne((await read($, titre)) ?? SANS_NOM))
    return next(e)
  })

  on('classic.UserPromptSubmit', async ($, e, next) => {
    if (e.session_title) await update($, titre, () => e.session_title ?? null)
    $.ui.status(ligne((await read($, titre)) ?? SANS_NOM))
    return next(e)
  })

  // Panneau ouvert au démarrage (la surface peut le garder en attente si elle est trop étroite)...
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'banniere',
      description: 'Affiche le nom de la session de travail en cours',
    })
    $.ui.status(ligne((await read($, titre)) ?? SANS_NOM))
    void $.ui.open({ id: PANNEAU, title: TITRE_PANNEAU, columns: COLONNES })

    return next(e)
  })

  // ...et rouvert à chaque message : une action de la personne place le panneau à toute largeur.
  on('prompt.submit', async ($, e, next) => {
    $.ui.status(ligne((await read($, titre)) ?? SANS_NOM))
    void $.ui.open({ id: PANNEAU, title: TITRE_PANNEAU, columns: COLONNES })

    return next(e)
  })

  on('command.run', { command: 'banniere' }, async $ => {
    $.ui.status(ligne((await read($, titre)) ?? SANS_NOM))
    await $.ui.open({ id: PANNEAU, title: TITRE_PANNEAU, columns: COLONNES })

    return { text: 'Bannière ouverte.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANNEAU }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const nom = (await read($, titre)) ?? SANS_NOM

    return (
      <Box
        backgroundColor={FOND}
        paddingX={3}
        paddingY={1}
        flexGrow={1}
        alignItems="center"
        justifyContent="center"
      >
        <Text bold color={TEXTE} backgroundColor={FOND}>
          {nom.toUpperCase()}
        </Text>
      </Box>
    )
  })
}
