import { expect, test } from 'claude-code/testing'

const SURFACES = ['terminal', 'desktop', 'vscode', 'mobile'] as const

const monter = ($: any, surface: (typeof SURFACES)[number]) =>
  $.ui.mount({
    plugin: 'message-banniere',
    surface,
    component: 'Pane',
    requestId: 'banniere',
    props: {
      title: 'Session de travail',
      isFocused: false,
      bodyColumns: 80,
      placement: 'inline',
    },
  })

test('sans titre connu, le panneau affiche un texte par défaut sur chaque surface', async $ => {
  for (const surface of SURFACES) {
    const ui = await monter($, surface)
    expect(await ui.find({ type: 'Text', text: /SESSION SANS NOM/ })).toBeDefined()
    await ui.unmount()
  }
})

test("avec un titre de session, le panneau l'affiche en majuscules", async ($, on) => {
  on('classic.UserPromptSubmit', () => ({}))
  await $.classic.UserPromptSubmit({ prompt: 'salut', session_title: 'Refonte du pipeline' })
  const ui = await monter($, 'terminal')
  expect(await ui.find({ type: 'Text', text: /REFONTE DU PIPELINE/ })).toBeDefined()
  await ui.unmount()
})
