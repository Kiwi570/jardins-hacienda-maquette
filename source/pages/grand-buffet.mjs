/* Fiche d'une soirée passée (modèle des fiches d'événement) : le Grand Buffet des dimanches d'août 2026.
   Programme de la journée en frise (trait qui se dessine), affiche, buffet en images. */
import { html } from '../../outils/gabarit.mjs';
import { tete, surtitre, externe, galerie, visionneuse } from '../composants.mjs';

export const page = { cle: 'grand-buffet', fichier: 'agenda/grand-buffet', imagePartage: 'site/buffet-ouverture-1080.webp' };

export default (c) => html`
${tete(c, { surtitre: c.s('buffet.surtitre'), titre: c.t('buffet.titre'), texte: c.t('buffet.texte'), action: c.t('fiche.prochains'), actionHref: c.url('agenda', 'a-venir'), info: c.s('buffet.info'), image: 'site/buffet-ouverture', alt: c.s('buffet.alt'), cadrage: '50% 60%', classe: 'page-tete--sombre' })}

<section class="fiche-passee sombre" id="passee">
  <div class="conteneur fiche-passee-grille">
    <p class="fiche-date" data-visuel data-anime aria-hidden="true"><span class="fiche-date-jour">9 – 30</span><span class="fiche-date-mois">août 2026</span></p>
    <div>
    ${surtitre(c.s('agenda.surtitre'))}
    <h2 data-anime="lignes">${c.t('buffet.passeTitre')}</h2>
    <p data-anime>${c.t('buffet.passe')}</p>
    <p class="actions" data-anime>${c.lien('agenda', { ancre: 'a-venir', classe: 'bouton', texte: c.t('fiche.prochains') })} ${externe(c, c.site.contact.instagram, c.t('fiche.instagram'), 'bouton bouton--contour')}</p>
    </div>
  </div>
</section>

<section class="sylvestre-menu conteneur" id="programme">
  <div>
    <h2 data-anime="lignes">${c.t('fiche.programmeTitre')}</h2>
    <div class="frise" data-fx="trace">
      <svg class="frise-trait" viewBox="0 0 10 400" preserveAspectRatio="none" aria-hidden="true"><path d="M5 0 V 400" data-fx-trait/></svg>
      <ol>${[1, 2, 3, 4].map((n) => html`<li class="frise-etape" data-repere><span class="frise-heure">${c.t(`buffet.f${n}h`)}</span><span class="frise-titre">${c.t(`buffet.f${n}t`)}</span><span class="frise-texte">${c.t(`buffet.f${n}x`)}</span></li>`)}</ol>
    </div>
    <p class="menu-tarif" data-prix data-anime>${c.t('buffet.tarif')}</p>
  </div>
  <figure class="sylvestre-affiche" data-anime>
    ${c.media({ nom: 'site/affiche-grand-buffet', alt: c.s('buffet.altAffiche'), classe: 'affiche-media', sizes: '(max-width: 760px) 90vw, 34vw', attrs: 'data-survol="incline"' })}
    <figcaption>${c.t('fiche.afficheTitre')}</figcaption>
  </figure>
</section>

${galerie(c, { id: 'photos', titre: c.t('fiche.galerieTitre'), region: c.s('fiche.galerieRegion'), photos: c.donnees.galeries.buffet })}
${visionneuse(c)}
`;
