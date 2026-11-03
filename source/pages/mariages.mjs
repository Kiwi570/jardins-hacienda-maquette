/* Mariages & réceptions : repères (à confirmer), types de réceptions, galerie, avis réels (Mariages.net),
   demande en quatre étapes avec récapitulatif en direct (colonne fixe sur grand écran). */
import { html, brut } from '../../outils/gabarit.mjs';
import { tete, surtitre, externe, galerie, visionneuse, aConfirmer, aCompleter, demandeReception } from '../composants.mjs';

export const page = { cle: 'mariages', fichier: 'mariages', imagePartage: 'site/mariages-ouverture-1280.webp', barre: { ancre: 'demande', texte: 'mariages.action' } };

const types = [['t1', 'site/type-mariage', 'mariage'], ['t2', 'site/type-bapteme', 'bapteme'], ['t3', 'site/type-anniversaire', 'anniversaire'], ['t4', 'site/type-depart', 'depart']];

export default (c) => html`
${tete(c, { surtitre: c.s('mariages.surtitre'), titre: c.t('mariages.titre'), titre2: c.t('mariages.titre2'), texte: c.t('mariages.texte'), action: c.t('mariages.action'), actionHref: '#demande', info: c.s('mariages.info'), image: 'site/mariages-ouverture', alt: c.s('mariages.alt'), cadrage: '50% 55%' })}

<section class="reperes-section conteneur" id="reperes">
  <h2 data-anime="lignes">${c.t('mariages.reperesTitre')}</h2>
  <ul class="reperes-grille" data-anime="cascade">${['r1', 'r2', 'r3', 'r4'].map((k) => html`<li>${c.t('mariages.' + k)}</li>`)}</ul>
  <p class="note">${c.t('commun.sourceAnnuaires')} : ${aConfirmer(c)}</p>
  <p class="note">${c.t('mariages.noteDecider')} ${aCompleter(c)}</p>
  ${c.media({ nom: 'grok/mariage-details', alt: c.s('mariages.altDetails'), classe: 'reperes-media', sizes: '(max-width: 760px) 60vw, 22vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
</section>

<section class="types conteneur" id="receptions">
  <div class="types-tete">
    <h2 data-anime="lignes">${c.t('mariages.typesTitre')}</h2>
    <p data-anime>${c.t('mariages.typesTexte')}</p>
  </div>
  <ul class="types-grille" data-anime="cascade">${types.map(([k, img, v]) => html`<li class="type">
    <a href="${v === 'mariage' ? '?type=mariage#demande' : c.url('fetes', 'demande', `type=${v}`)}"${v === 'mariage' ? brut(' data-sans-transition data-choix-type="mariage"') : ''}>
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

${demandeReception(c, { types, titre: c.t('mariages.demandeTitre'), texte: c.t('mariages.demandeTexte'), image: 'site/receptions', alt: c.s('mariages.altRecap'), conditions: html`<p class="note">${c.t('mariages.conditions')} ${aConfirmer(c)}</p>` })}
${visionneuse(c)}
`;
