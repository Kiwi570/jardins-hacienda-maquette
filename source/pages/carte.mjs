/* La carte : l'ardoise du moment, puis les quatre volets de la carte (entrées, plats, à partager, desserts),
   prix visibles d'emblée, allergènes à compléter. Effets propres : ardoise, volets. */
import { html } from '../../outils/gabarit.mjs';
import { prix, surtitre, tete, ardoise, externe, aCompleter } from '../composants.mjs';

export const page = { cle: 'carte', fichier: 'la-carte', imagePartage: 'site/carte-ouverture-1280.webp' };

const images = {
  entrees: ['site/foie-gras-brioche', 'altEntrees', '50% 88%'],
  plats: ['site/carte-plats', 'altPlats', '50% 60%'],
  partager: ['site/carte-partager', 'altPartager', '50% 50%'],
  desserts: ['site/carte-desserts', 'altDesserts', '45% 55%'],
};

export default (c) => {
  const S = c.donnees.carte.sections;
  const nums = (id) => S.find((s) => s.id === id).plats.map((p) => p.prix).filter((p) => typeof p === 'number');
  const e = nums('entrees'), p = nums('plats');
  const info = c.s('carte.info', { entreesMin: Math.min(...e), entreesMax: Math.max(...e), platsMin: Math.min(...p), platsMax: Math.max(...p) });
  return html`
${tete(c, { surtitre: c.s('carte.surtitre'), titre: c.t('carte.titre'), texte: c.t('carte.texte'), action: c.t('carte.action'), actionHref: c.url('reserver'), info, image: 'site/carte-ouverture', alt: c.s('carte.alt'), cadrage: '60% 50%' })}

<nav class="sous-nav" aria-label="${c.s('carte.sousNav')}">
  <ul class="conteneur">${S.map((s) => html`<li><a href="#${s.id}" data-sans-transition>${s.titre}</a></li>`)}<li><a href="#allergenes" data-sans-transition>${c.t('carte.allergenesTitre')}</a></li></ul>
</nav>

<section class="ardoise-section sombre" id="ardoise">
  <div class="conteneur ardoise-grille">
    ${ardoise(c)}
    <div>
      ${surtitre(c.s('carte.ardoiseSurtitre'))}
      <h2 data-anime="lignes">${c.t('carte.ardoiseTitre')}</h2>
      <p data-anime>${c.t('ardoise.texte')}</p>
      <p data-anime>${externe(c, c.site.contact.instagram, c.t('ardoise.reseaux'), 'bouton bouton--clair')}</p>
    </div>
  </div>
</section>

<section class="carte-complete conteneur" id="la-carte">
  <h2 class="visuellement-cache">${c.t('carte.titre')}</h2>
  <div class="volets volets--complet" data-volets data-effet="volets">
    ${S.map((s, i) => html`<article class="volet volet--photo${i % 2 ? ' volet--inverse' : ''}" id="${s.id}">
      ${c.media({ nom: images[s.id][0], alt: c.s('carte.' + images[s.id][1]), cadrage: images[s.id][2], classe: 'volet-media', sizes: '(max-width: 760px) 100vw, 40vw' })}
      <div class="volet-corps">
        <h3 class="volet-titre">${s.titre}</h3>
        ${s.note ? html`<p class="volet-note">${s.note}</p>` : ''}
        <ul class="plats">${s.plats.map((pl) => html`<li class="plat"><span class="plat-nom">${pl.nom}</span><span class="plat-points" aria-hidden="true"></span><span class="plat-prix" data-prix>${prix(c, pl.prix)}</span><span class="plat-texte">${pl.texte}</span></li>`)}</ul>
      </div>
    </article>`)}
  </div>
  <p class="carte-prix" data-anime>${c.t('carte.prix')}</p>
</section>

<section class="allergenes conteneur" id="allergenes">
  ${c.media({ nom: 'grok/marche-saison', alt: c.s('carte.altMarche'), classe: 'allergenes-media', sizes: '(max-width: 760px) 100vw, 34vw', attrs: 'data-fx="parallaxe" data-fx-force="7"' })}
  <div>
    <h2 data-anime="lignes">${c.t('carte.allergenesTitre')}</h2>
    <p data-anime>${c.t('carte.allergenesTexte')} ${aCompleter(c)}</p>
    <p data-anime>${c.t('carte.boissonsTexte')} ${aCompleter(c)}</p>
    <h2 class="allergenes-fin" data-anime="lignes">${c.t('carte.finTitre')}</h2>
    <p data-anime>${c.t('carte.finTexte')}</p>
    <p class="actions" data-anime>${c.lien('reserver', { classe: 'bouton', texte: c.t('carte.action'), attrs: 'data-survol="magnetique"' })} ${c.lien('emporter', { classe: 'bouton bouton--contour', texte: c.t('carte.finEmporter') })}</p>
  </div>
</section>
`;
};
