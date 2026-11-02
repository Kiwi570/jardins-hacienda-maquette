/* Fiche événement : Saint-Sylvestre 2026. Compte à rebours jusqu'à minuit, menu et accord mets et vins lus sur l'affiche,
   réservation préremplie. Après la date, la fiche dit que la soirée a eu lieu (decompte.js). */
import { html } from '../../outils/gabarit.mjs';
import { tete, surtitre, decompte, aCompleter } from '../composants.mjs';

export const page = { cle: 'saint-sylvestre', fichier: 'agenda/saint-sylvestre', imagePartage: 'site/sylvestre-ouverture-1280.webp' };

export default (c) => {
  const e = c.donnees.evenements.find((x) => x.id === 'saint-sylvestre');
  return html`
${tete(c, { surtitre: c.s('sylvestre.surtitre'), titre: c.t('sylvestre.titre'), texte: c.t('sylvestre.texte'), action: c.t('sylvestre.action'), actionHref: c.url('reserver', 'formulaire', 'sujet=evenement&evenement=saint-sylvestre'), info: c.s('sylvestre.tarif'), image: 'site/sylvestre-ouverture', alt: c.s('sylvestre.altOuverture'), cadrage: '62% 50%', classe: 'page-tete--sombre' })}

<section class="sylvestre-decompte sombre" id="minuit" data-evenement="saint-sylvestre" data-fin="${e.fin}">
  ${c.media({ nom: 'grok/horloge-aiguilles', alt: c.s('sylvestre.altHorloge'), classe: 'sylvestre-horloge', sizes: '(max-width: 760px) 60vw, 26vw', attrs: 'data-fx="zoom"' })}
  <div>
    ${surtitre(c.s('sylvestre.decompte'))}
    ${decompte(c, e.fin, { libelle: c.s('sylvestre.decompte'), classe: 'decompte--grand' })}
    <p class="sylvestre-passe" data-evenement-passe hidden>${c.t('sylvestre.passe')}</p>
    <p class="sylvestre-dj" data-anime>${c.t('sylvestre.dj')}</p>
  </div>
</section>

<section class="sylvestre-menu conteneur" id="menu-soiree">
  <div>
    <h2 data-anime="lignes">${c.t('sylvestre.menuTitre')}</h2>
    <ol class="menu-fete" data-anime="cascade">${c.donnees.sylvestre.map((m) => html`<li><strong>${m.plat}</strong><span>${m.detail}</span>${m.vin ? html`<em>${m.vin}</em>` : ''}</li>`)}</ol>
    <p class="menu-tarif" data-prix data-anime>${c.t('sylvestre.tarif')}</p>
    <p class="mention-alcool">${c.t('commun.alcool')}</p>
    <ul class="liste-points" data-anime="cascade">
      <li>${c.t('sylvestre.horaires')}</li>
      <li>${c.t('sylvestre.acompte')}</li>
      <li>${c.t('sylvestre.enLigne')}</li>
    </ul>
    <p class="actions" data-anime>${c.lien('reserver', { ancre: 'formulaire', params: 'sujet=evenement&evenement=saint-sylvestre', classe: 'bouton', texte: c.t('sylvestre.action'), attrs: 'data-survol="magnetique"' })} ${c.lien('agenda', { classe: 'bouton bouton--contour', texte: c.t('sylvestre.retour') })}</p>
  </div>
  <figure class="sylvestre-affiche" data-anime>
    ${c.media({ nom: 'site/affiche-saint-sylvestre', alt: c.s('sylvestre.altAffiche'), classe: 'affiche-media', sizes: '(max-width: 760px) 90vw, 34vw', attrs: 'data-survol="incline"' })}
    <figcaption>${c.t('sylvestre.afficheTitre')}</figcaption>
  </figure>
</section>
`;
};
