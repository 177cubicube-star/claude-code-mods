# claude-code-mods

Mods pour Claude Code : de petits plugins de hooks qui modifient l'interface ou le
comportement de l'outil et se rechargent à chaud.

## Mods

| Dossier | Rôle |
| --- | --- |
| `message-banniere/` | Affiche le nom de la session de travail en cours, en gras, noir sur fond jaune (panneau, plus une ligne de statut imitée en Unicode). |

## Charger un mod

```
claude --plugin-dir <chemin>/message-banniere
```

Vérifier et tester un mod :

```
claude plugin validate message-banniere
claude plugin test message-banniere
```

## Limite connue

Dans une **session cloud** affichée par l'application desktop, la bande et le panneau
dessinés par un mod ne s'affichent pas (observé le 2026-10-05) ; seule la ligne de
statut apparaît. Pour le rendu complet, utiliser une session locale ou un terminal.
