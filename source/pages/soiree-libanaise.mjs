/* Fiche d'une soirée passée (modèle des fiches d'événement, comme la Saint-Sylvestre) : Soirée libanaise du 31 octobre 2026.
   Les informations viennent de l'affiche ; la fiche dit que la soirée a eu lieu et renvoie vers l'agenda. */
import { html } from '../../outils/gabarit.mjs';
import { tete, surtitre, externe } from '../composants.mjs';

export const page = { cle: 'soiree-libanaise', fichier: 'agenda/soiree-libanaise', imagePartage: 'site/libanaise-ouverture-1280.webp' };

export default (c) => html`
${tete(c, { surtitre: c.s('libanaise.surtitre'), titre: c.t('libanaise.titre'), texte: c.t('libanaise.texte'), action: c.t('fiche.prochains'), actionHref: c.url('agenda', 'a-venir'), info: c.s('libanaise.info'), image: 'site/libanaise-ouverture', alt: c.s('libanaise.alt'), cadrage: '50% 50%', classe: 'page-tete--sombre' })}

<section class="fiche-passee sombre" id="passee">
  <div class="conteneur fiche-passee-grille">
    <p class="fiche-date" data-visuel data-anime aria-hidden="true"><span class="fiche-date-jour">31</span><span class="fiche-date-mois">oct. 2026</span></p>
    <div>
    ${surtitre(c.s('agenda.surtitre'))}
    <h2 data-anime="lignes">${c.t('libanaise.passeTitre')}</h2>
    <p data-anime>${c.t('libanaise.passe')}</p>
    <p class="actions" data-anime>${c.lien('agenda', { ancre: 'a-venir', classe: 'bouton', texte: c.t('fiche.prochains') })} ${externe(c, c.site.contact.instagram, c.t('fiche.instagram'), 'bouton bouton--contour')}</p>
    </div>
  </div>
</section>

<section class="sylvestre-menu conteneur" id="programme">
  <div>
    <h2 data-anime="lignes">${c.t('fiche.programmeTitre')}</h2>
    <ul class="liste-points" data-anime="cascade">${['p1', 'p2', 'p3', 'p4'].map((k) => html`<li>${c.t('libanaise.' + k)}</li>`)}</ul>
    <p class="menu-tarif" data-prix data-anime>${c.t('libanaise.tarif')}</p>
  </div>
  <figure class="sylvestre-affiche" data-anime>
    ${c.media({ nom: 'site/affiche-soiree-libanaise', alt: c.s('libanaise.altAffiche'), classe: 'affiche-media', sizes: '(max-width: 760px) 90vw, 34vw', attrs: 'data-survol="incline"' })}
    <figcaption>${c.t('fiche.afficheTitre')}</figcaption>
  </figure>
</section>
`;
