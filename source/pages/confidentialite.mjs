/* Politique de confidentialité (modèle des pages légales) : données des formulaires, usages, conservation, destinataires,
   stockage dans le navigateur, droits. Les informations propres à l'établissement restent « à compléter ». */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'confidentialite', fichier: 'confidentialite', imagePartage: 'grok/legal-lin-1280.webp', sansAction: true, sansEffet: true };

const sections = ['responsable', 'donnees', 'finalites', 'conservation', 'destinataires', 'navigateur', 'droits', 'maquette'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court" id="debut">
  <div class="page-tete-fond">${c.media({ nom: 'grok/legal-lin', alt: c.s('confidentialite.alt'), priorite: true, classe: 'page-tete-media', sizes: '100vw' })}</div>
  <div class="page-tete-texte conteneur">
    <h1 class="page-titre" data-intro-titre>${c.t('confidentialite.titre')}</h1>
    <nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}">${c.t(`confidentialite.${s}.titre`)}</a></li>`)}</ul></nav>
  </div>
</section>
<div class="texte-long conteneur" data-sans-visuel>
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel><h2>${c.t(`confidentialite.${s}.titre`)}</h2><p>${c.t(`confidentialite.${s}.texte`)}</p></section>`)}
</div>
`;
