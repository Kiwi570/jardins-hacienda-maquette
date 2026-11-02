/* Composants partagés par les pages (hors du dossier pages : le générateur ne les prend pas pour des pages). */
import { html, brut } from '../outils/gabarit.mjs';

export const prix = (c, p) => (p === 'marche' ? c.s('commun.prixMarche') : `${String(p).replace('.', ',')} €`);
export const euros = (n) => `${Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')} €`;

const jour = (iso) => new Date(iso + 'T12:00:00+01:00');
export const dateLongue = (iso) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(jour(iso));
export const dateCourte = (iso) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: 'numeric', month: 'long' }).format(jour(iso));
export const jourMois = (iso) => { const d = jour(iso); return { j: new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: 'numeric' }).format(d), m: new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', month: 'short' }).format(d) }; };
/* Dates d'un événement : « dimanches 9, 16, 23 et 30 août 2026 » ou « jeudi 31 décembre 2026 ». */
export function datesTexte(dates) {
  if (dates.length === 1) return dateLongue(dates[0]);
  const d = dates.map(jour);
  const fmt = (o) => (x) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', ...o }).format(x);
  const jours = d.map(fmt({ day: 'numeric' }));
  const nomJour = fmt({ weekday: 'long' })(d[0]);
  return `${nomJour}s ${jours.slice(0, -1).join(', ')} et ${jours.at(-1)} ${fmt({ month: 'long', year: 'numeric' })(d[0])}`;
}
/* Même texte en début de ligne : seule la première lettre en majuscule (« Jeudi 31 décembre 2026 »). */
export const datesTitre = (dates) => { const t = datesTexte(dates); return t.charAt(0).toUpperCase() + t.slice(1); };
/* Fin d'un événement (dernier jour, minuit à Paris) : sert au tri entre à venir et passés, ici et dans le navigateur. */
export const finEvenement = (e) => e.fin || `${e.dates.at(-1)}T23:59:59+01:00`;
export const aVenir = (e, maintenant = new Date()) => new Date(finEvenement(e)) > maintenant;

export const surtitre = (t) => html`<p class="surtitre">${t}</p>`;
export const aCompleter = (c, texte) => html`<span class="a-completer">${texte ?? c.s('commun.aCompleter')}</span>`;
export const aConfirmer = (c) => html`<span class="a-confirmer">${c.s('commun.aConfirmer')}</span>`;
export const externe = (c, href, texte, classe = '', attrs = '') => html`<a href="${href}" target="_blank" rel="noopener" aria-describedby="nouvel-onglet"${classe ? brut(` class="${classe}"`) : ''}${brut(attrs ? ' ' + attrs : '')}>${texte}</a>`;

/* Tête de page intérieure : titre, texte, action principale et information clé au-dessus de la ligne de flottaison. */
export function tete(c, { surtitre: st, titre, texte, action, actionHref, info, image, alt, cadrage = '50% 50%', cadrageMobile, attrsMedia = 'data-fx="parallaxe"', avant = '', apres = '', classe = '' }) {
  return html`<section class="page-tete ${classe}" id="debut">
  <div class="page-tete-fond">
    ${c.media({ nom: image, alt, cadrage, cadrageMobile, priorite: true, classe: 'page-tete-media', sizes: '100vw', attrs: attrsMedia })}
  </div>
  ${avant}
  <div class="page-tete-texte conteneur">
    ${surtitre(st)}
    <h1 class="page-titre" data-anime="lignes" data-intro-titre>${titre}</h1>
    ${texte ? html`<p class="page-intro" data-anime>${texte}</p>` : ''}
    <p class="page-actions">${action ? html`<a class="bouton" href="${actionHref}" data-action-principale data-survol="magnetique">${action}</a>` : ''}${info ? html`<span class="page-info" data-info-cle>${info}</span>` : ''}</p>
  </div>
  ${apres}
</section>`;
}

/* Compte à rebours : chiffres sur une largeur fixe, mis à jour par le navigateur (decompte.js). */
export function decompte(c, cible, { libelle, classe = '' } = {}) {
  const reste = Math.max(0, new Date(cible) - new Date());
  const unites = [['jours', Math.max(2, String(Math.floor(reste / 864e5)).length)], ['heures', 2], ['minutes', 2], ['secondes', 2]];
  const v = { jours: Math.floor(reste / 864e5), heures: Math.floor(reste / 36e5) % 24, minutes: Math.floor(reste / 6e4) % 60, secondes: Math.floor(reste / 1e3) % 60 };
  return html`<div class="decompte ${classe}" data-decompte="${cible}" data-effet="decompte" role="timer" aria-label="${libelle}">
  <p class="visuellement-cache" data-decompte-texte>${v.jours} ${c.s('commun.jours')}, ${v.heures} ${c.s('commun.heures')}, ${v.minutes} ${c.s('commun.minutes')}</p>
  ${unites.map(([u, n]) => html`<div class="decompte-unite" aria-hidden="true"><span class="decompte-chiffres" data-unite="${u}" data-taille="${n}">${String(v[u]).padStart(n, '0').split('').map((d) => html`<span class="chiffre-boite"><span class="chiffre-bande" style="--n:${d}" data-audit-ignorer>${brut('<span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>')}</span></span>`)}</span><span class="decompte-libelle">${c.t('commun.' + u)}</span></div>`)}
</div>`;
}

/* L'ardoise du moment : texte écrit à la craie, révélé au défilement (ardoise, site.js). */
export function ardoise(c, { classe = '' } = {}) {
  return html`<div class="ardoise ${classe}" data-effet="ardoise">
  ${c.media({ nom: 'grok/ardoise', alt: c.s('ardoise.alt'), classe: 'ardoise-fond', sizes: '(max-width: 760px) 100vw, 60vw' })}
  <div class="ardoise-texte">
    <p class="ardoise-titre craie"><span>${c.t('ardoise.titre')}</span></p>
    <svg class="ardoise-trait" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M4 16 C 90 6, 200 22, 396 10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
    <ul class="ardoise-liste craie">${['l1', 'l2', 'l3', 'l4'].map((k) => html`<li><span>${c.t('ardoise.' + k)}</span></li>`)}</ul>
  </div>
  <span class="ardoise-chiffon" aria-hidden="true"></span>
</div>`;
}

/* Carte d'accès dessinée en SVG : positions réelles (projection simple), traits qui se dessinent. */
export function carteAcces(c) {
  const { villes } = c.donnees.acces;
  /* Ouest élargi : le nom de Moineville tient à gauche de son point, loin des routes qui partent toutes vers l'est. */
  const lon0 = 5.74, lon1 = 6.30, lat0 = 48.64, lat1 = 49.66;
  const W = 360, H = 520;
  const x = (lon) => 40 + ((lon - lon0) / (lon1 - lon0)) * (W - 80);
  const y = (lat) => 30 + ((lat1 - lat) / (lat1 - lat0)) * (H - 60);
  const centre = villes.find((v) => v.principal);
  const autres = villes.filter((v) => !v.principal && v.carte !== false);
  const f = (n) => n.toFixed(1);
  return html`<figure class="carte-acces" data-visuel>
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.s('accueil.venir.carte')}" data-effet="carte">
    <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="10" class="carte-cadre" data-audit-ignorer/>
    ${autres.map((v) => html`<path data-fx-trait data-audit-ignorer class="carte-route" d="M${f(x(v.lon))} ${f(y(v.lat))} Q ${f((x(v.lon) + x(centre.lon)) / 2 + 18)} ${f((y(v.lat) + y(centre.lat)) / 2)} ${f(x(centre.lon))} ${f(y(centre.lat))}"/>`)}
    ${autres.map((v) => html`<g class="carte-ville" data-repere><circle cx="${f(x(v.lon))}" cy="${f(y(v.lat))}" r="4.5"/>${v.distance
      ? html`<text x="${f(x(v.lon))}" y="${f(y(v.lat) + 24)}" text-anchor="middle">${v.nom} · ${v.distance}</text>`
      : html`<text x="${f(x(v.lon) + 10)}" y="${f(y(v.lat) + 5)}">${v.nom}</text>`}</g>`)}
    <g class="carte-ville carte-ville--centre" data-repere><circle cx="${f(x(centre.lon))}" cy="${f(y(centre.lat))}" r="9"/><text x="${f(x(centre.lon) - 16)}" y="${f(y(centre.lat) + 7)}" text-anchor="end">${centre.nom}</text></g>
  </svg>
  <figcaption class="visuellement-cache">${c.t('accueil.venir.carte')}</figcaption>
</figure>`;
}

/* Visionneuse partagée (galeries) : ouverte depuis une vignette, flèches, glissement, Échap. */
export function visionneuse(c) {
  return html`<div class="visionneuse" data-visionneuse data-recouvrement role="dialog" aria-modal="true" aria-label="${c.s('commun.agrandir')}" hidden>
  <button type="button" class="visionneuse-fermer" data-vis-fermer aria-label="${c.s('commun.fermer')}"><span aria-hidden="true">×</span></button>
  <figure class="visionneuse-cadre" data-vis-cadre><figcaption data-vis-legende></figcaption></figure>
  <button type="button" class="visionneuse-nav visionneuse-prec" data-vis-prec aria-label="${c.s('commun.precedent')}"><span aria-hidden="true">←</span></button>
  <button type="button" class="visionneuse-nav visionneuse-suiv" data-vis-suiv aria-label="${c.s('commun.suivant')}"><span aria-hidden="true">→</span></button>
  <p class="visionneuse-compte" data-vis-compte aria-live="polite"></p>
</div>`;
}

/* Galerie horizontale épinglée (bibliothèque : galerie) dont chaque photo s'ouvre dans la visionneuse. */
export function galerie(c, { id, titre, region, photos, surtitreTexte, texte }) {
  return html`<section class="galerie ecran epingle" id="${id}" data-entete-cache data-fx="galerie">
  <div class="conteneur galerie-tete">
    ${surtitreTexte ? surtitre(surtitreTexte) : ''}
    <h2 data-anime="lignes">${titre}</h2>
    ${texte ? html`<p>${texte}</p>` : ''}
  </div>
  <div class="piste galerie-piste" data-galerie tabindex="0" role="region" aria-label="${region}">
    ${photos.map((p, i) => html`<a class="carte-photo" href="#${id}-${i + 1}" id="${id}-${i + 1}" data-vis-ouvrir data-sans-transition aria-label="${c.s('commun.agrandir')} : ${p.alt}">
      ${c.media({ nom: p.nom, alt: p.alt, cadrage: p.cadrage || '50% 50%', classe: 'carte-photo-media', sizes: '(max-width: 760px) 78vw, 32vw' })}
    </a>`)}
  </div>
  <p class="galerie-aide" aria-hidden="true">${c.t('commun.faitesGlisser')}</p>
  <div class="galerie-progres" aria-hidden="true"><span></span></div>
</section>`;
}

/* Demande de réception en quatre étapes, récapitulatif en direct (initEtapes, site.js). Partagée par Mariages et Fêtes privées :
   types = [[clé de texte, image, valeur]] ; le premier type est coché (l'adresse ?type= le change). */
export function demandeReception(c, { types, titre, texte, image, alt }) {
  return html`<section class="demande conteneur" id="demande">
  <div class="demande-tete">
    <h2 data-anime="lignes">${titre}</h2>
    <p data-anime>${texte}</p>
    <ol class="etapes-liste" aria-hidden="true">${['e1', 'e2', 'e3', 'e4'].map((k, i) => html`<li data-etape-repere="${i + 1}">${c.t('mariages.' + k)}</li>`)}</ol>
  </div>
  <div class="demande-grille">
    <form class="etapes" data-formulaire data-etapes action="#" novalidate>
      <p class="etape-compte" data-etape-compte aria-live="polite">${c.t('mariages.etapeSur', { n: 1 })}</p>
      <div class="etapes-cadre" data-etapes-cadre>
        <fieldset class="etape" data-etape="1">
          <legend>${c.t('mariages.e1')}</legend>
          <div class="champ"><span class="champ-libelle" id="l-type">${c.t('mariages.type')}</span>
            <div class="puces" role="radiogroup" aria-labelledby="l-type">${types.map(([k, , v], i) => html`<label class="puce-choix"><input type="radio" name="type" value="${v}"${i === 0 ? brut(' checked') : ''}><span>${c.t('mariages.' + k)}</span></label>`)}</div></div>
          <div class="champ"><label for="m-date">${c.t('mariages.date')}</label><input id="m-date" name="date" type="date" aria-describedby="m-date-aide"><p class="aide" id="m-date-aide">${c.t('mariages.dateAide')}</p></div>
        </fieldset>
        <fieldset class="etape" data-etape="2" hidden>
          <legend>${c.t('mariages.e2')}</legend>
          <div class="champ"><label for="m-invites">${c.t('mariages.invites')}</label><input id="m-invites" name="invites" type="number" min="1" max="500" inputmode="numeric" required></div>
          <div class="champ"><span class="champ-libelle" id="l-moment">${c.t('mariages.moment')}</span>
            <div class="puces" role="radiogroup" aria-labelledby="l-moment">${['dejeuner', 'diner', 'journee'].map((v, i) => html`<label class="puce-choix"><input type="radio" name="moment" value="${v}"${i === 2 ? brut(' checked') : ''}><span>${c.t('mariages.' + v)}</span></label>`)}</div></div>
          <div class="champ"><span class="champ-libelle" id="l-espaces">${c.t('mariages.espaces')}</span>
            <div class="puces" role="group" aria-labelledby="l-espaces">${['salle', 'terrasse', 'piscine'].map((v) => html`<label class="puce-choix"><input type="checkbox" name="espaces" value="${v}"><span>${c.t('mariages.' + v)}</span></label>`)}</div></div>
        </fieldset>
        <fieldset class="etape" data-etape="3" hidden>
          <legend>${c.t('mariages.e3')}</legend>
          <div class="champs-2">
            <div class="champ"><label for="m-prenom">${c.t('commun.prenom')}</label><input id="m-prenom" name="prenom" autocomplete="given-name" required></div>
            <div class="champ"><label for="m-nom">${c.t('commun.nom')}</label><input id="m-nom" name="nom" autocomplete="family-name" required></div>
            <div class="champ"><label for="m-email">${c.t('commun.email')}</label><input id="m-email" name="email" type="email" autocomplete="email" required></div>
            <div class="champ"><label for="m-tel">${c.t('commun.tel')}</label><input id="m-tel" name="tel" type="tel" autocomplete="tel" required></div>
          </div>
          <div class="champ"><label for="m-message">${c.t('commun.message')} (${c.t('commun.facultatif')})</label><textarea id="m-message" name="message" rows="4"></textarea></div>
        </fieldset>
        <fieldset class="etape" data-etape="4" hidden>
          <legend>${c.t('mariages.e4')}</legend>
          <p>${c.t('mariages.recapTexte')}</p>
          <p class="mention-donnees">${c.tb('commun.donnees')}</p>
        </fieldset>
      </div>
      <p class="etapes-nav">
        <button type="button" class="bouton bouton--contour" data-etape-prec hidden>${c.t('commun.precedent')}</button>
        <button type="button" class="bouton" data-etape-suiv>${c.t('commun.suivant')}</button>
        <button type="submit" class="bouton" data-etape-envoyer hidden>${c.t('mariages.envoyer')}</button>
      </p>
      <p data-message-envoi role="status" tabindex="-1" hidden></p>
    </form>
    <aside class="recap" data-recap aria-labelledby="recap-titre">
      ${c.media({ nom: image, alt, cadrage: '50% 55%', classe: 'recap-media', sizes: '(max-width: 860px) 90vw, 28vw' })}
      <h3 id="recap-titre">${c.t('mariages.recap')}</h3>
      <dl>
        <dt>${c.t('mariages.type')}</dt><dd data-recap-champ="type"></dd>
        <dt>${c.t('mariages.date')}</dt><dd data-recap-champ="date"></dd>
        <dt>${c.t('mariages.invites')}</dt><dd data-recap-champ="invites"></dd>
        <dt>${c.t('mariages.moment')}</dt><dd data-recap-champ="moment"></dd>
        <dt>${c.t('mariages.espaces')}</dt><dd data-recap-champ="espaces"></dd>
        <dt>${c.t('commun.contact')}</dt><dd data-recap-champ="contact"></dd>
      </dl>
      <p class="note">${c.t('commun.simule')}</p>
    </aside>
  </div>
</section>
<script type="application/json" data-recap-textes>${brut(JSON.stringify({ vide: c.s('mariages.recapVide'), etape: c.s('mariages.etapeSur'), libelles: { mariage: c.s('mariages.t1'), bapteme: c.s('mariages.t2'), anniversaire: c.s('mariages.t3'), depart: c.s('mariages.t4'), dejeuner: c.s('mariages.dejeuner'), diner: c.s('mariages.diner'), journee: c.s('mariages.journee'), salle: c.s('mariages.salle'), terrasse: c.s('mariages.terrasse'), piscine: c.s('mariages.piscine') } }).replace(/</g, '\\u003c'))}</script>`;
}
