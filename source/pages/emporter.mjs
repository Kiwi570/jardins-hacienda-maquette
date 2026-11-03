/* À emporter : produits des fêtes, panier (une seule source, synchronisé entre onglets), jour de retrait
   du 5 au 31 décembre (jours passés grisés, calculés à la date réelle), moment Midi ou Soir, commande simulée.
   Effet propre : envol (les produits montent au défilement, et s'envolent vers le panier à l'ajout). */
import { html, brut } from '../../outils/gabarit.mjs';
import { tete, surtitre, euros, aCompleter } from '../composants.mjs';

export const page = { cle: 'emporter', fichier: 'a-emporter', imagePartage: 'grok/table-fetes-1280.webp', barre: { ancre: 'commande', texte: 'emporter.barreCommande' } };

const motifs = ['spirale', 'feuille', 'losange', 'etoile', 'vague', 'arc', 'cercle', 'grain'];
const initiales = (n) => n.replace(/^(Le |La |L'|Les )/, '').split(/[\s-]+/).filter((m) => m.length > 2 && !['aux', 'des', 'les', 'une'].includes(m)).slice(0, 2).map((m) => m[0].toUpperCase()).join('');

function calendrier(c, debut, fin) {
  /* Décembre 2026 : le 1er tombe un mardi. Les jours hors période sont inactifs ; le navigateur grise ceux qui sont passés. */
  const [a, m] = debut.split('-').map(Number);
  const premier = new Date(Date.UTC(a, m - 1, 1)).getUTCDay();
  const decalage = (premier + 6) % 7;
  const jours = new Date(Date.UTC(a, m, 0)).getUTCDate();
  const d0 = +debut.slice(8), d1 = +fin.slice(8);
  const noms = c.s('emporter.joursSemaine').split(' ');
  const cases = [];
  for (let i = 0; i < decalage; i++) cases.push(html`<span class="jour jour--vide" aria-hidden="true"></span>`);
  for (let j = 1; j <= jours; j++) {
    const iso = `${a}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
    const ouvert = j >= d0 && j <= d1;
    cases.push(ouvert
      ? html`<label class="jour"><input type="radio" name="jour" value="${iso}" data-jour required><span>${j}</span></label>`
      : html`<span class="jour jour--hors" aria-hidden="true"><span>${j}</span></span>`);
  }
  return html`<fieldset class="calendrier" data-calendrier>
    <legend>${c.t('emporter.jour')} : ${c.t('emporter.moisDecembre')}</legend>
    <div class="calendrier-tete" aria-hidden="true">${noms.map((n) => html`<span>${n}</span>`)}</div>
    <div class="calendrier-jours">${cases}</div>
  </fieldset>`;
}

export default (c) => {
  const E = c.donnees.emporter;
  return html`
${tete(c, { surtitre: c.s('emporter.surtitre'), titre: c.t('emporter.titre'), titre2: c.t('emporter.titre2'), texte: c.t('emporter.texte'), action: c.t('emporter.action'), actionHref: '#produits', info: c.s('emporter.info'), classe: 'page-tete--court', image: 'grok/table-fetes', alt: c.s('emporter.alt') })}

<section class="produits conteneur" id="produits" data-panier-produits>
  <div class="produits-tete">
    ${surtitre(c.s('emporter.surtitre'))}
    <h2 data-anime="lignes">${c.t('emporter.produitsTitre')}</h2>
    <p class="note" data-anime>${c.t('emporter.allergenes')}</p>
  </div>
  <ul class="produits-grille" data-effet="envol">
    ${E.produits.map((p, i) => html`<li class="produit" data-produit="${p.id}" data-prix-unitaire="${p.prix}" data-unite="${p.unite}">
      <div class="produit-visuel produit-visuel--${motifs[i % motifs.length]}" data-visuel data-envol-image aria-hidden="true">
        <span class="produit-initiales">${initiales(p.nom)}</span>
        <span class="produit-ornement"></span>
        <span class="produit-photo-attente">${c.t('emporter.visuelACompleter')}</span>
      </div>
      <h3 class="produit-nom">${p.nom}</h3>
      <p class="produit-texte">${p.texte}${p.format ? html` <span class="a-completer">${p.format}</span>` : ''}</p>
      <p class="produit-bas">
        <span class="produit-prix" data-prix>${euros(p.prix)}${p.unite === 'kg' ? html` <small>${c.t('emporter.parKg')}</small>` : ''}</span>
        ${p.unite === 'kg' ? html`<label class="produit-poids"><span class="visuellement-cache">${c.t('emporter.quantiteDe', { nom: p.nom })}</span><select data-poids>${[0.5, 1, 1.5, 2].map((k) => html`<option value="${k}"${k === 1 ? brut(' selected') : ''}>${String(k).replace('.', ',')} kg</option>`)}</select></label>` : ''}
        <button type="button" class="bouton bouton--petit" data-ajouter="${p.id}" aria-label="${c.s('emporter.ajouterA', { nom: p.nom })}">${c.t('emporter.ajouter')}</button>
      </p>
    </li>`)}
  </ul>
  <figure class="produits-foie-gras" data-anime>
    ${c.media({ nom: 'site/foie-gras-brioche', alt: c.s('emporter.foieGrasNote'), cadrage: '50% 90%', classe: 'produits-foie-gras-media', sizes: '(max-width: 760px) 100vw, 30vw', attrs: 'data-fx="zoom"' })}
    <figcaption>${c.t('emporter.foieGrasNote')}</figcaption>
  </figure>
</section>

<section class="commande sombre" id="commande" data-masque-barre>
  <div class="conteneur commande-grille">
    <form class="commande-form" data-formulaire data-commande action="#" novalidate data-message-texte="${c.s('emporter.simule')}">
      ${surtitre(c.s('emporter.retraitTitre'))}
      <h2 data-anime="lignes">${c.t('emporter.retraitTitre')}</h2>
      <p data-anime>${c.t('emporter.retraitTexte')}</p>
      ${calendrier(c, E.debut, E.fin)}
      <p class="champ-erreur" data-erreur-jour hidden>${c.t('emporter.choisirJour')}</p>
      <fieldset class="choix-moment">
        <legend>${c.t('emporter.moment')}</legend>
        <label class="puce-choix"><input type="radio" name="moment" value="midi" checked><span>${c.t('emporter.midi')}</span></label>
        <label class="puce-choix"><input type="radio" name="moment" value="soir"><span>${c.t('emporter.soir')}</span></label>
      </fieldset>
      <h3>${c.t('emporter.coordonnees')}</h3>
      <div class="champs-2">
        <div class="champ"><label for="c-prenom">${c.t('commun.prenom')}</label><input id="c-prenom" name="prenom" autocomplete="given-name" required></div>
        <div class="champ"><label for="c-nom">${c.t('commun.nom')}</label><input id="c-nom" name="nom" autocomplete="family-name" required></div>
        <div class="champ"><label for="c-tel">${c.t('commun.tel')}</label><input id="c-tel" name="tel" type="tel" autocomplete="tel" required></div>
        <div class="champ"><label for="c-email">${c.t('commun.email')}</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <p class="mention-donnees">${c.tb('commun.donnees')}</p>
      <p class="note">${c.t('emporter.paiement')}</p>
      <button type="submit" class="bouton">${c.t('emporter.valider')}</button>
      <p data-message-envoi role="status" tabindex="-1" hidden data-texte="${c.s('emporter.simule')}"></p>
    </form>
    <aside class="panier" data-panier aria-labelledby="panier-titre">
      ${c.media({ nom: 'grok/retrait-kraft', alt: c.s('emporter.altRetrait'), classe: 'panier-media', sizes: '(max-width: 760px) 100vw, 30vw', attrs: 'data-anime="rideau"' })}
      <h2 id="panier-titre" class="panier-titre">${c.t('emporter.panierTitre')}</h2>
      <p class="panier-vide" data-panier-vide>${c.t('emporter.panierVide')}</p>
      <ul class="panier-lignes" data-panier-lignes></ul>
      <p class="panier-total"><span>${c.t('emporter.total')}</span><strong data-panier-total data-prix>0 €</strong></p>
      <p class="panier-retrait" data-panier-retrait></p>
      <p class="champ-erreur" data-erreur-panier hidden>${c.t('emporter.choisirProduit')}</p>
    </aside>
  </div>
</section>

<a class="panier-pastille" href="#commande" data-panier-pastille data-sans-transition hidden aria-label="${c.s('emporter.panierOuvrir')}"><span class="panier-pastille-nombre" data-panier-nombre>0</span><span data-panier-pastille-total>0 €</span></a>
<p class="visuellement-cache" aria-live="polite" data-panier-annonce></p>
<template data-panier-modele><li class="panier-ligne"><span class="panier-ligne-nom"></span><span class="panier-ligne-qte"><button type="button" class="qte-btn" data-moins aria-label="${c.s('emporter.moins')}">−</button><span data-qte></span><button type="button" class="qte-btn" data-plus aria-label="${c.s('emporter.plus')}">+</button></span><span class="panier-ligne-prix" data-prix></span></li></template>
<script type="application/json" data-panier-textes>${brut(JSON.stringify({ articles: c.s('emporter.articles'), ajoute: c.s('emporter.ajoute'), retrait: c.s('emporter.retraitResume'), midi: c.s('emporter.midi'), soir: c.s('emporter.soir'), aujourdhui: c.s('emporter.aujourdhui'), noms: Object.fromEntries(E.produits.map((p) => [p.id, p.nom])) }).replace(/</g, '\\u003c'))}</script>
`;
};
