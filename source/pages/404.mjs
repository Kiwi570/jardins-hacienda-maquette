/* Page 404 « Table introuvable », avec son image. */
import { html } from '../../outils/gabarit.mjs';
import { tete } from '../composants.mjs';

export const page = { cle: '404', fichier: '404', partage: false };

export default (c) => html`
${tete(c, { surtitre: '404', titre: c.t('introuvable.titre'), texte: c.t('introuvable.texte'), action: c.t('introuvable.retour'), actionHref: c.url('accueil'), info: '', image: 'site/introuvable', cadrage: '50% 62%', alt: c.s('introuvable.alt'), classe: 'page-tete--sombre', apres: html`<p class="conteneur introuvable-lien">${c.lien('carte', { classe: 'lien-fleche', texte: c.t('introuvable.carte') })}</p>` })}
`;
