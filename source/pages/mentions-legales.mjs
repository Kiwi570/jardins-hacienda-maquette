/* Mentions légales : fiche à fournir, éditeur, hébergeur, crédits (photographes, illustrations générées),
   confidentialité, maquette. Barre de lecture et sommaire qui suit la lecture. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', imagePartage: 'grok/legal-lin-1280.webp', sansAction: true, sansEffet: true };

const sections = ['fiche', 'editeur', 'hebergeur', 'credits', 'confidentialite', 'maquette'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court" id="debut">
  <div class="page-tete-fond">${c.media({ nom: 'grok/legal-lin', alt: c.s('mentions.alt'), priorite: true, classe: 'page-tete-media', sizes: '100vw' })}</div>
  <div class="page-tete-texte conteneur">
    <h1 class="page-titre" data-intro-titre>${c.t('mentions.titre')}</h1>
    <nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}">${c.t(`mentions.${s}.titre`)}</a></li>`)}</ul></nav>
  </div>
</section>
<div class="texte-long conteneur" data-sans-visuel>
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel><h2>${c.t(`mentions.${s}.titre`)}</h2><p>${c.t(`mentions.${s}.texte`)}</p></section>`)}
</div>
`;
