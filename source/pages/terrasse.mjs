/* Terrasse & piscine : les palmes s'écartent sur la piscine, la frise d'une journée festive, les règles,
   le week-end, les pool parties (vidéo aérienne en boucle, avec pause), la galerie avec visionneuse, la visite 360°.
   Effet propre : palmes. */
import { html } from '../../outils/gabarit.mjs';
import { tete, surtitre, externe, galerie, visionneuse, aConfirmer, aCompleter } from '../composants.mjs';

export const page = { cle: 'terrasse', fichier: 'terrasse-piscine', imagePartage: 'site/piscine-ouverture-1280.webp' };

const palme = (cote) => html`<svg class="palme palme--${cote}" viewBox="0 0 300 600" aria-hidden="true" data-palme="${cote}"><g fill="currentColor">
  <path d="M290 600 C 250 470 220 360 170 250 C 150 210 120 170 80 140 C 120 150 160 180 185 220 C 175 160 150 100 105 50 C 160 90 195 150 205 215 C 215 150 240 90 285 40 C 255 110 230 180 222 250 C 250 330 275 460 300 600 Z"/>
  <path d="M175 245 C 120 230 60 235 0 270 C 60 220 130 205 180 225 Z"/>
  <path d="M190 290 C 130 300 70 340 20 400 C 70 320 140 280 195 270 Z"/>
  <path d="M210 230 C 200 170 205 110 230 60 C 225 130 225 180 222 236 Z"/>
</g></svg>`;

export default (c) => {
  const photos = c.donnees.galeries.piscine;
  return html`
${tete(c, { surtitre: c.s('terrasse.surtitre'), titre: c.t('terrasse.titre'), titre2: c.t('terrasse.titre2'), texte: c.t('terrasse.texte'), actions: [{ texte: c.t('terrasse.action'), href: c.url('reserver', 'formulaire', 'sujet=journee'), saison: 'ete' }, { texte: c.t('terrasse.actionHiver'), href: c.url('restaurant'), saison: 'hiver' }], info: c.s('terrasse.info'), infoHiver: c.s('terrasse.infoHiver'), image: 'site/piscine-ouverture', alt: c.s('terrasse.alt'), cadrage: '50% 55%', classe: 'page-tete--palmes', avant: html`<div class="palmes" data-effet="palmes" aria-hidden="true">${palme('gauche')}${palme('droite')}</div>` })}

<p class="bandeau-saison" data-saison-seul="hiver">${c.t('terrasse.hors')}</p>

<section class="terrasse-intro conteneur" id="terrasse">
  ${c.media({ nom: 'site/terrasse-paillote', alt: c.s('terrasse.altTerrasse'), classe: 'terrasse-intro-media', sizes: '(max-width: 760px) 100vw, 42vw', attrs: 'data-anime="rideau"' })}
  <div>
    ${surtitre(c.s('terrasse.surtitre'))}
    <h2 data-anime="lignes">${c.t('terrasse.terrasseTitre')}</h2>
    <p data-anime>${c.t('terrasse.terrasseTexte')}</p>
    <p class="reperes-ligne" data-anime>${c.t('terrasse.terrasseInfo')} ${aConfirmer(c)}</p>
  </div>
</section>

<section class="journee sombre-eau" id="journee">
  ${c.media({ nom: 'grok/eau-texture', alt: '', classe: 'journee-fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
  <div class="conteneur journee-grille">
    <div>
      ${surtitre(c.s('commun.saisonEte'))}
      <h2 data-anime="lignes">${c.t('terrasse.journeeTitre')}</h2>
      <p data-anime>${c.t('terrasse.journeeTexte')}</p>
      <p class="note" data-anime>${c.t('terrasse.journeeTarif')} ${aCompleter(c)}</p>
      <div class="frise" data-fx="trace">
        <svg class="frise-trait" viewBox="0 0 10 400" preserveAspectRatio="none" aria-hidden="true"><path d="M5 0 V 400" data-fx-trait/></svg>
        <ol>${c.donnees.journee.map((j) => html`<li class="frise-etape" data-repere><span class="frise-heure">${j.heure}</span><span class="frise-titre">${j.titre}</span><span class="frise-texte">${j.texte}</span></li>`)}</ol>
      </div>
    </div>
    ${c.media({ nom: 'site/journee-festive', alt: c.s('terrasse.altJournee'), classe: 'journee-media', sizes: '(max-width: 760px) 100vw, 36vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  </div>
</section>

<section class="regles conteneur" id="regles">
  <div class="regles-texte">
    <h2 data-anime="lignes">${c.t('terrasse.reglesTitre')}</h2>
    <ul class="liste-points" data-anime="cascade">${['regle1', 'regle2', 'regle3', 'regle4', 'regle5'].map((k) => html`<li>${c.t('terrasse.' + k)}</li>`)}</ul>
  </div>
  ${c.media({ nom: 'grok/transat-serviette', alt: c.s('terrasse.altTransat'), classe: 'regles-media', sizes: '(max-width: 760px) 100vw, 30vw', attrs: 'data-fx="zoom"' })}
</section>

<section class="weekend" id="weekend">
  ${c.media({ nom: 'grok/palmes-ombres', alt: '', classe: 'weekend-fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="10"' })}
  <div class="conteneur weekend-grille">
    <div class="weekend-tete">${surtitre(c.s('terrasse.weekendSurtitre'))}<h2 data-anime="lignes">${c.t('terrasse.weekendTitre')}</h2></div>
    <ul class="jours-semaine" data-anime="cascade">
      <li><strong>${c.t('terrasse.vendredi')}</strong><span>${c.t('terrasse.vendrediTexte')}</span></li>
      <li><strong>${c.t('terrasse.samedi')}</strong><span>${c.t('terrasse.samediTexte')}</span></li>
      <li><strong>${c.t('terrasse.dimanche')}</strong><span>${c.t('terrasse.dimancheTexte')} ${c.lien('grand-buffet', { classe: 'lien-fleche', texte: c.t('terrasse.dimancheLien') })}</span></li>
    </ul>
    ${c.media({ nom: 'site/broche', alt: c.s('terrasse.altBroche'), classe: 'weekend-media', sizes: '(max-width: 760px) 100vw, 34vw', attrs: 'data-anime="rideau"' })}
  </div>
</section>

<section class="pool sombre" id="pool-parties">
  <figure class="pool-video" data-video-boucle>
    <video id="video-piscine" muted loop playsinline preload="none" poster="/assets/images/site/piscine-drone-1280.webp" data-src="/assets/videos/piscine-drone.mp4" aria-label="${c.s('terrasse.videoAlt')}"></video>
    <img class="pool-video-repli" src="/assets/images/site/piscine-drone-1280.webp" srcset="/assets/images/site/piscine-drone-640.webp 640w, /assets/images/site/piscine-drone-1280.webp 1280w" sizes="100vw" alt="${c.s('terrasse.videoAlt')}" width="1280" height="544" loading="lazy" decoding="async">
  </figure>
  <div class="conteneur pool-texte">
    <h2 data-anime="lignes">${c.t('terrasse.poolTitre')}</h2>
    <p data-anime>${c.t('terrasse.poolTexte')}</p>
    <p class="mention-alcool" data-anime>${c.t('commun.alcool')}</p>
    <button type="button" class="bouton bouton--clair bouton--petit" data-pause-pour="video-piscine" data-libelle-pause="${c.s('terrasse.videoPause')}" data-libelle-lecture="${c.s('terrasse.videoLecture')}"><span data-libelle-bouton>${c.t('terrasse.videoPause')}</span></button>
  </div>
</section>

${galerie(c, { id: 'photos', titre: c.t('terrasse.galerieTitre'), region: c.s('terrasse.galerieRegion'), photos })}

<section class="visite conteneur" id="visite-360">
  ${c.media({ nom: 'site/fresque', alt: c.s('terrasse.altFresque'), classe: 'visite-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="onde"' })}
  <div>
    <h2 data-anime="lignes">${c.t('terrasse.visiteTitre')}</h2>
    <p data-anime>${c.t('terrasse.visiteTexte')}</p>
    <p class="actions" data-anime>${externe(c, c.site.contact.visite360, c.t('terrasse.visiteLien1'), 'bouton')} ${externe(c, c.site.contact.visite360b, c.t('terrasse.visiteLien2'), 'bouton bouton--contour')}</p>
    <div data-saison-seul="ete">
      <h2 class="visite-fin" data-anime="lignes">${c.t('terrasse.finTitre')}</h2>
      <p data-anime>${c.t('terrasse.finTexte')}</p>
      <p data-anime>${c.lien('reserver', { params: 'sujet=journee', ancre: 'formulaire', classe: 'bouton', texte: c.t('terrasse.action'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
    <div data-saison-seul="hiver">
      <h2 class="visite-fin" data-anime="lignes">${c.t('terrasse.finTitreHiver')}</h2>
      <p data-anime>${c.t('terrasse.finTexteHiver')}</p>
      <p class="actions" data-anime>${c.lien('restaurant', { classe: 'bouton', texte: c.t('terrasse.actionHiver') })} ${externe(c, c.site.contact.instagram, c.t('fiche.instagram'), 'bouton bouton--contour')}</p>
    </div>
  </div>
</section>
${visionneuse(c)}
`;
};
