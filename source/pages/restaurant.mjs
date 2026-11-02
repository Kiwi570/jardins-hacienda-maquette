/* Le restaurant (modèle des pages de lieu, comme Terrasse & piscine) : la salle au coin du feu, braises de la cheminée,
   l'ardoise du chef, la salle en images (galerie épinglée et visionneuse), l'essentiel à savoir, la réservation. */
import { html } from '../../outils/gabarit.mjs';
import { tete, surtitre, ardoise, externe, galerie, visionneuse, aCompleter } from '../composants.mjs';

export const page = { cle: 'restaurant', fichier: 'restaurant', imagePartage: 'site/restaurant-ouverture-1280.webp' };

export default (c) => html`
${tete(c, { surtitre: c.s('restaurant.surtitre'), titre: c.t('restaurant.titre'), texte: c.t('restaurant.texte'), action: c.t('restaurant.action'), actionHref: c.url('reserver', 'formulaire'), info: c.s('restaurant.info'), image: 'site/restaurant-ouverture', alt: c.s('restaurant.alt'), cadrage: '50% 50%' })}

<section class="chef feu sombre" id="cheminee">
  <canvas class="braises" data-braises data-effet="braises" aria-hidden="true"></canvas>
  <div class="conteneur chef-grille">
    ${c.media({ nom: 'site/restaurant-feu', alt: c.s('restaurant.altFeu'), cadrage: '50% 45%', classe: 'chef-media', sizes: '(max-width: 760px) 100vw, 42vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
    <div class="chef-texte">
      ${surtitre(c.s('restaurant.feuSurtitre'))}
      <h2 data-anime="lignes">${c.t('restaurant.feuTitre')}</h2>
      <p class="chef-sous" data-anime>${c.t('restaurant.feuTexte')}</p>
      <p data-anime>${c.t('restaurant.feuTexte2')}</p>
    </div>
  </div>
</section>

${galerie(c, { id: 'photos', titre: c.t('restaurant.galerieTitre'), region: c.s('restaurant.galerieRegion'), photos: c.donnees.galeries.restaurant })}

<section class="ardoise-section sombre" id="ardoise">
  <div class="conteneur ardoise-grille">
    ${ardoise(c)}
    <div>
      ${surtitre(c.s('restaurant.chefSurtitre'))}
      <h2 data-anime="lignes">${c.t('restaurant.chefTitre')}</h2>
      <p data-anime>${c.t('restaurant.chefTexte')}</p>
      <p class="actions" data-anime>${c.lien('carte', { classe: 'bouton bouton--clair', texte: c.t('restaurant.chefLien') })} ${externe(c, c.site.contact.instagram, c.t('ardoise.reseaux'), 'bouton bouton--contour')}</p>
    </div>
  </div>
</section>

<section class="regles conteneur" id="savoir">
  <div class="regles-texte">
    <h2 data-anime="lignes">${c.t('restaurant.savoirTitre')}</h2>
    <ul class="liste-points" data-anime="cascade">
      <li>${c.t('restaurant.s1')}</li>
      <li>${c.t('restaurant.s2')}</li>
      <li>${c.t('restaurant.s3')} ${c.lien('emporter', { classe: 'lien-fleche', texte: c.t('pages.emporter.nav') })}</li>
      <li>${c.t('restaurant.s4')} ${aCompleter(c)}</li>
    </ul>
    <h2 class="visite-fin" data-anime="lignes">${c.t('restaurant.finTitre')}</h2>
    <p data-anime>${c.t('restaurant.finTexte')}</p>
    <p class="actions" data-anime>${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('restaurant.action'), attrs: 'data-survol="magnetique"' })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
  </div>
  ${c.media({ nom: 'site/table-fenetre', alt: c.s('restaurant.altSavoir'), classe: 'regles-media', sizes: '(max-width: 760px) 100vw, 30vw', attrs: 'data-fx="zoom"' })}
</section>
${visionneuse(c)}
`;
