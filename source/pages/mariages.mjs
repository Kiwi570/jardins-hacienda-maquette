/* Mariages & réceptions : repères (à confirmer), types de réceptions, galerie, avis réels (Mariages.net),
   demande en quatre étapes avec récapitulatif en direct (colonne fixe sur grand écran). */
import { html, brut } from '../../outils/gabarit.mjs';
import { tete, surtitre, externe, galerie, visionneuse, aConfirmer } from '../composants.mjs';

export const page = { cle: 'mariages', fichier: 'mariages', imagePartage: 'site/mariages-ouverture-1280.webp' };

const types = [['t1', 'site/type-mariage', 'mariage'], ['t2', 'site/type-bapteme', 'bapteme'], ['t3', 'site/type-anniversaire', 'anniversaire'], ['t4', 'site/type-depart', 'depart'], ['t5', 'site/type-seminaire', 'seminaire']];

export default (c) => html`
${tete(c, { surtitre: c.s('mariages.surtitre'), titre: c.t('mariages.titre'), texte: c.t('mariages.texte'), action: c.t('mariages.action'), actionHref: '#demande', info: c.s('mariages.info'), image: 'site/mariages-ouverture', alt: c.s('mariages.alt'), cadrage: '50% 55%' })}

<section class="reperes-section conteneur" id="reperes">
  <h2 data-anime="lignes">${c.t('mariages.reperesTitre')}</h2>
  <ul class="reperes-grille" data-anime="cascade">${['r1', 'r2', 'r3', 'r4', 'r5'].map((k) => html`<li>${c.t('mariages.' + k)}</li>`)}</ul>
  <p class="note">${c.t('commun.sourceAnnuaires')} : ${aConfirmer(c)}</p>
  ${c.media({ nom: 'grok/mariage-details', alt: c.s('mariages.altDetails'), classe: 'reperes-media', sizes: '(max-width: 760px) 60vw, 22vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
</section>

<section class="types conteneur" id="receptions">
  <div class="types-tete">
    <h2 data-anime="lignes">${c.t('mariages.typesTitre')}</h2>
    <p data-anime>${c.t('mariages.typesTexte')}</p>
  </div>
  <ul class="types-grille" data-anime="cascade">${types.map(([k, img, v]) => html`<li class="type">
    <a href="?type=${v}#demande" data-sans-transition data-choix-type="${v}">
      ${c.media({ nom: img, alt: '', classe: 'type-media', sizes: '(max-width: 760px) 45vw, 18vw' })}
      <span class="type-nom">${c.t('mariages.' + k)}</span>
    </a>
  </li>`)}</ul>
</section>

${galerie(c, { id: 'photos', titre: c.t('mariages.galerieTitre'), region: c.s('mariages.galerieRegion'), photos: c.donnees.galeries.mariages })}

<section class="avis" id="avis">
  ${c.media({ nom: 'site/avis-fond', alt: '', classe: 'avis-fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  <div class="conteneur avis-contenu">
    <h2 data-anime="lignes">${c.t('mariages.avisTitre')}</h2>
    <blockquote class="avis-citation" data-anime><p>${c.t('mariages.avisCitation')}</p><footer>${c.t('mariages.avisAuteur')}</footer></blockquote>
    <p data-anime>${c.t('mariages.avisNote')} ${aConfirmer(c)}</p>
    <p data-anime>${externe(c, c.site.contact.mariagesNet, c.t('mariages.avisLien'), 'bouton bouton--clair')}</p>
  </div>
</section>

<section class="demande conteneur" id="demande">
  <div class="demande-tete">
    <h2 data-anime="lignes">${c.t('mariages.demandeTitre')}</h2>
    <p data-anime>${c.t('mariages.demandeTexte')}</p>
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
      ${c.media({ nom: 'site/receptions', alt: c.s('mariages.altRecap'), cadrage: '50% 55%', classe: 'recap-media', sizes: '(max-width: 860px) 90vw, 28vw' })}
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
<script type="application/json" data-recap-textes>${brut(JSON.stringify({ vide: c.s('mariages.recapVide'), etape: c.s('mariages.etapeSur'), libelles: { mariage: c.s('mariages.t1'), bapteme: c.s('mariages.t2'), anniversaire: c.s('mariages.t3'), depart: c.s('mariages.t4'), seminaire: c.s('mariages.t5'), dejeuner: c.s('mariages.dejeuner'), diner: c.s('mariages.diner'), journee: c.s('mariages.journee'), salle: c.s('mariages.salle'), terrasse: c.s('mariages.terrasse'), piscine: c.s('mariages.piscine') } }).replace(/</g, '\\u003c'))}</script>
${visionneuse(c)}
`;
