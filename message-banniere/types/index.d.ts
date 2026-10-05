export type Titre = string | null

declare module 'claude-code' {
  interface PluginState {
    'message-banniere': { titre: Titre }
  }
}
