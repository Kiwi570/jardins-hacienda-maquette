/* Fêtes privées (modèle Mariages & réceptions) : types de fêtes réels du site (baptême, anniversaire, pot de départ),
   deux saisons, buffets en images, demande en quatre étapes partagée avec Mariages (récapitulatif en direct). */
import { html } from '../../outils/gabarit.mjs';
import { tete, surtitre, galerie, visionneuse, aCompleter, demandeReception } from '../composants.mjs';

export const page = { cle: 'fetes', fichier: 'fetes-privees', imagePartage: 'site/fetes-ouverture-1280.webp' };

const types = [['t2', 'site/type-bapteme', 'bapteme'], ['t3', 'site/type-anniversaire', 'anniversaire'], ['t4', 'site/type-depart', 'depart']];

export default (c) => html`
${tete(c, { surtitre: c.s('fetes.surtitre'), titre: c.t('fetes.titre'), texte: c.t('fetes.texte'), action: c.t('fetes.action'), actionHref: '#demande', info: c.s('fetes.info'), image: 'site/fetes-ouverture', alt: c.s('fetes.alt'), cadrage: '50% 50%', cadrageMobile: '50% 80%' })}

<section class="types conteneur" id="fetes">
  <div class="types-tete">
    <h2 data-anime="lignes">${c.t('fetes.typesTitre')}</h2>
    <p data-anime>${c.t('fetes.typesTexte')}</p>
  </div>
  <ul class="types-grille types-grille--3" data-anime="cascade">${types.map(([k, img, v]) => html`<li class="type">
    <a href="?type=${v}#demande" data-sans-transition data-choix-type="${v}">
      ${c.media({ nom: img, alt: '', classe: 'type-media', sizes: '(max-width: 760px) 45vw, 28vw' })}
      <span class="type-nom">${c.t('mariages.' + k)}</span>
    </a>
  </li>`)}</ul>
</section>

<section class="fetes-saisons conteneur" id="saisons">
  <h2 data-anime="lignes">${c.t('fetes.saisonsTitre')}</h2>
  <ul class="fetes-saisons-grille" data-anime="cascade">
    <li>${c.media({ nom: 'site/fetes-ete', alt: c.s('fetes.altEte'), classe: 'fetes-saison-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="zoom"' })}<h3>${c.t('fetes.eteTitre')}</h3><p>${c.t('fetes.eteTexte')}</p></li>
    <li>${c.media({ nom: 'site/restaurant-g3', alt: c.s('fetes.altHiver'), cadrage: '50% 55%', classe: 'fetes-saison-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="zoom"' })}<h3>${c.t('fetes.hiverTitre')}</h3><p>${c.t('fetes.hiverTexte')}</p></li>
  </ul>
  <p class="note">${c.t('fetes.note')} ${aCompleter(c)}</p>
</section>

${galerie(c, { id: 'photos', titre: c.t('fetes.galerieTitre'), region: c.s('fetes.galerieRegion'), photos: c.donnees.galeries.fetes })}

${demandeReception(c, { types, titre: c.t('fetes.demandeTitre'), texte: c.t('fetes.demandeTexte'), image: 'site/fetes-g1', alt: c.s('fetes.altRecap') })}
${visionneuse(c)}
`;
