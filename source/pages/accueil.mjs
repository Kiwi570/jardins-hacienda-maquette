/* Accueil : la saison en cours (hiver ou été), le chef et son ardoise, un extrait de la carte, le lieu,
   l'agenda avec son compte à rebours, les réceptions, offrir et emporter, l'accès.
   Effets propres : surface (WebGL de l'ouverture), saison, braises, ardoise, volets, decompte. */
import { html, brut } from '../../outils/gabarit.mjs';
import { prix, surtitre, decompte, ardoise, carteAcces, externe, aVenir, finEvenement, datesTexte, datesTitre, dateCourte, aConfirmer } from '../composants.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'site/salle-ouverture-1280.webp' };

export default (c) => {
  const evts = c.donnees.evenements;
  const prochains = evts.filter((e) => aVenir(e)).sort((a, b) => a.dates[0].localeCompare(b.dates[0]));
  const passes = evts.filter((e) => !aVenir(e)).sort((a, b) => b.dates.at(-1).localeCompare(a.dates.at(-1)));
  const p = prochains[0];
  /* En ce moment : l'actualité de la saison, juste sous le premier écran (une tuile disparaît après sa date). */
  const sylvestre = evts.find((e) => e.id === 'saint-sylvestre');
  const tuiles = [
    ...(sylvestre && aVenir(sylvestre) ? [{ cle: 'sylvestre', image: 'site/affiche-saint-sylvestre', cadrage: '50% 28%', href: c.url('saint-sylvestre'), saison: 'hiver', fin: finEvenement(sylvestre) }] : []),
    { cle: 'emporter', image: 'grok/table-fetes', href: c.url('emporter'), saison: 'hiver', fin: `${c.donnees.emporter.fin}T23:59:59+01:00` },
    { cle: 'journee', image: 'site/journee-festive', href: c.url('terrasse', 'journee'), saison: 'ete' },
    { cle: 'weekend', image: 'site/broche', href: c.url('terrasse', 'weekend'), saison: 'ete' },
    { cle: 'cadeau', image: 'grok/cadeau-kraft', href: c.url('cadeau') },
  ];
  const sections = c.donnees.carte.sections;
  const extrait = [['entrees', [0, 3]], ['plats', [2, 4]], ['desserts', [0, 3]]].map(([id, idx]) => {
    const s = sections.find((x) => x.id === id);
    return { titre: s.titre, plats: idx.map((i) => s.plats[i]) };
  });
  const cartes = [
    { nom: 'site/lieu-salle', cle: 'salle', lien: c.url('restaurant') },
    { nom: 'site/lieu-terrasse', cle: 'terrasse', lien: c.url('terrasse', 'terrasse') },
    { nom: 'site/lieu-piscine', cle: 'piscine', lien: c.url('terrasse') },
    { nom: 'site/lieu-mariages', cle: 'mariages', lien: c.url('mariages') },
  ];
  return html`
<section class="hero" id="debut">
  <div class="hero-scene">
    ${c.media({ nom: 'site/salle-ouverture', alt: c.s('accueil.hero.altHiver'), cadrage: '50% 55%', cadrageMobile: '50% 78%', classe: 'hero-photo', sizes: '100vw', attrs: 'data-saison-seul="hiver" data-hero-photo' })}
    ${c.media({ nom: 'site/piscine-ouverture', alt: c.s('accueil.hero.altEte'), cadrage: '50% 50%', classe: 'hero-photo', sizes: '100vw', attrs: 'data-saison-seul="ete" data-hero-photo' })}
    <canvas class="hero-surface" data-surface data-effet="surface" aria-hidden="true"></canvas>
    <div class="hero-ombre" aria-hidden="true"></div>
  </div>
  <div class="hero-contenu conteneur">
    <p class="surtitre hero-surtitre" data-anime="gsap"><span class="hero-surtitre-long">${c.t('accueil.hero.sousTitre')}</span><span class="hero-surtitre-court">${c.t('accueil.hero.sousTitreCourt')}</span></p>
    <h1 class="hero-titre" data-intro-titre data-superpose><span class="hero-l1" data-anime="gsap">${c.t('accueil.hero.titre1')}</span> <span class="hero-l2" data-anime="gsap">${c.t('accueil.hero.titre2')}</span></h1>
    <p class="hero-texte" data-anime="gsap"><span data-saison-seul="hiver">${c.t('accueil.hero.texteHiver')}</span><span data-saison-seul="ete">${c.t('accueil.hero.texteEte')}</span></p>
    <p class="hero-actions" data-anime="gsap">
      ${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      ${c.lien('carte', { classe: 'bouton bouton--clair', texte: c.t('accueil.hero.action2') })}
    </p>
    <div class="hero-bas" data-anime="gsap">
      <p class="hero-info" data-info-cle>
        <span class="pastille"><span data-saison-seul="hiver">${c.t('commun.saisonHiver')}</span><span data-saison-seul="ete">${c.t('commun.saisonEte')}</span></span>
        ${p ? html`<span class="hero-prochain" data-prochain><span class="hero-prochain-libelle">${c.t('accueil.hero.prochaine')} :</span> ${p.page ? c.lien(p.page, { texte: html`${p.titre}, ${datesTexte(p.dates)}` }) : html`${p.titre}, ${datesTexte(p.dates)}`}</span>` : ''}
      </p>
      <button type="button" class="bascule-saison bascule-saison--hero" data-bascule-saison aria-label="${c.s('commun.basculeAide')}"><span class="bascule-piste" aria-hidden="true"><span class="bascule-bouton"></span></span><span data-saison-seul="hiver">${c.t('commun.voirEte')}</span><span data-saison-seul="ete">${c.t('commun.voirHiver')}</span></button>
    </div>
  </div>
  <button type="button" class="pause-animation" data-pause-surface aria-pressed="false" data-libelle-pause="${c.s('commun.animationPause')}" data-libelle-lecture="${c.s('commun.animationReprise')}"><span class="visuellement-cache" data-libelle-bouton>${c.t('commun.animationPause')}</span><span class="pause-icone" aria-hidden="true"></span></button>
</section>

<section class="moment conteneur" id="en-ce-moment">
  <h2 class="moment-titre" data-anime="lignes">${c.t('accueil.moment.titre')}</h2>
  <ul class="moment-grille" data-anime="cascade">
    ${tuiles.map((t) => html`<li class="moment-tuile"${t.saison ? brut(` data-saison-seul="${t.saison}"`) : ''}${t.fin ? brut(` data-masquer-apres="${t.fin}"`) : ''}>
      <a class="moment-lien" href="${t.href}">
        ${c.media({ nom: t.image, alt: '', cadrage: t.cadrage || '50% 50%', classe: 'moment-media', sizes: '(max-width: 760px) 90vw, 30vw' })}
        <span class="moment-sur">${c.t(`accueil.moment.${t.cle}Sur`)}</span>
        <h3 class="moment-nom">${c.t(`accueil.moment.${t.cle}Titre`)}</h3>
        <span class="moment-texte">${c.t(`accueil.moment.${t.cle}Texte`)}</span>
        <span class="moment-voir" aria-hidden="true">${c.t('accueil.moment.voir')} →</span>
      </a>
    </li>`)}
  </ul>
</section>

<section class="saisons" id="saisons">
  <div class="conteneur saisons-tete">
    ${surtitre(c.s('accueil.saisons.surtitre'))}
    <h2 data-anime="lignes">${c.t('accueil.saisons.titre')}</h2>
  </div>
  <div class="saisons-scene" data-saisons-scene data-effet="saison">
    <article class="saison saison--hiver">
      ${c.media({ nom: 'site/hiver-panneau', alt: c.s('accueil.saisons.altHiver'), classe: 'saison-media', sizes: '(max-width: 760px) 100vw, 100vw' })}
      <div class="saison-texte">
        <p class="surtitre">${c.t('commun.saisonHiver')}</p>
        <h3>${c.t('accueil.saisons.hiverTitre')}</h3>
        <p>${c.t('accueil.saisons.hiverTexte')}</p>
      </div>
    </article>
    <article class="saison saison--ete" data-saison-ete>
      ${c.media({ nom: 'site/ete-panneau', alt: c.s('accueil.saisons.altEte'), classe: 'saison-media', sizes: '(max-width: 760px) 100vw, 100vw' })}
      <div class="saison-texte">
        <p class="surtitre">${c.t('commun.saisonEte')}</p>
        <h3>${c.t('accueil.saisons.eteTitre')}</h3>
        <p>${c.t('accueil.saisons.eteTexte')}</p>
        <p class="saison-detail">${c.t('accueil.saisons.eteDetail')}</p>
        <p class="mention-alcool">${c.t('commun.alcool')}</p>
      </div>
    </article>
    <span class="saisons-couture" aria-hidden="true"></span>
  </div>
  <p class="conteneur saisons-bascule">
    <button type="button" class="bouton bouton--contour bascule-saison" data-bascule-saison><span data-saison-seul="hiver">${c.t('commun.voirEte')}</span><span data-saison-seul="ete">${c.t('commun.voirHiver')}</span></button>
  </p>
</section>

<section class="chef sombre" id="chef">
  <canvas class="braises" data-braises data-effet="braises" aria-hidden="true"></canvas>
  <div class="conteneur chef-grille">
    ${c.media({ nom: 'site/chef', alt: c.s('accueil.chef.alt'), cadrage: '20% 40%', classe: 'chef-media', sizes: '(max-width: 760px) 100vw, 42vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
    <div class="chef-texte">
      ${surtitre(c.s('accueil.chef.surtitre'))}
      <h2 data-anime="lignes">${c.t('accueil.chef.titre')}</h2>
      <p class="chef-sous" data-anime>${c.t('accueil.chef.sousTitre')}</p>
      <p data-anime>${c.t('accueil.chef.texte1')}</p>
      <p data-anime>${c.t('accueil.chef.texte2')}</p>
      <p class="actions" data-anime>${c.lien('restaurant', { classe: 'bouton bouton--clair', texte: c.t('pages.restaurant.nav') })} ${externe(c, c.site.contact.instagram, c.t('ardoise.reseaux'), 'bouton bouton--contour')}</p>
    </div>
  </div>
</section>

<section class="carte-extrait conteneur" id="carte">
  ${c.media({ nom: 'site/plat-volaille', alt: c.s('accueil.carte.alt'), classe: 'carte-extrait-media', sizes: '(max-width: 760px) 100vw, 36vw', attrs: 'data-fx="zoom"' })}
  <div class="carte-extrait-tete">
    ${surtitre(c.s('accueil.carte.surtitre'))}
    <h2 data-anime="lignes">${c.t('accueil.carte.titre')}</h2>
    <p data-anime>${c.t('accueil.carte.texte')}</p>
  </div>
  <div class="volets" data-volets data-effet="volets">
    ${extrait.map((s) => html`<article class="volet">
      <h3 class="volet-titre">${s.titre}</h3>
      <ul class="plats">${s.plats.map((pl) => html`<li class="plat"><span class="plat-nom">${pl.nom}</span><span class="plat-points" aria-hidden="true"></span><span class="plat-prix" data-prix>${prix(c, pl.prix)}</span><span class="plat-texte">${pl.texte}</span></li>`)}</ul>
    </article>`)}
  </div>
  <p class="carte-extrait-lien" data-anime>${c.lien('carte', { classe: 'bouton', texte: c.t('accueil.carte.lien'), attrs: 'data-survol="magnetique"' })}</p>
</section>

<section class="galerie lieu ecran epingle" id="lieu" data-entete-cache data-fx="galerie">
  <div class="conteneur galerie-tete">
    ${surtitre(c.s('accueil.lieu.surtitre'))}
    <h2 data-anime="lignes">${c.t('accueil.lieu.titre')}</h2>
    <p>${c.t('accueil.lieu.texte')}</p>
  </div>
  <div class="piste galerie-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('accueil.lieu.region')}">
    ${cartes.map((k) => html`<article class="carte-lieu">
      ${c.media({ nom: k.nom, alt: c.s(`accueil.lieu.${k.cle}Titre`), classe: 'carte-lieu-media', sizes: '(max-width: 760px) 78vw, 30vw' })}
      <h3><a href="${k.lien}" data-libelle="${c.s(`accueil.lieu.${k.cle}Titre`)}">${c.t(`accueil.lieu.${k.cle}Titre`)}</a></h3>
      <p>${c.t(`accueil.lieu.${k.cle}Texte`)}</p>
    </article>`)}
    <article class="carte-lieu carte-lieu--360">
      ${c.media({ nom: 'site/lieu-360', alt: c.s('accueil.lieu.visiteTitre'), classe: 'carte-lieu-media', sizes: '(max-width: 760px) 78vw, 30vw' })}
      <h3>${c.t('accueil.lieu.visiteTitre')}</h3>
      <p>${c.t('accueil.lieu.visiteTexte')}</p>
      <p>${externe(c, c.site.contact.visite360, c.t('accueil.lieu.visiteLien'), 'lien-fleche')}</p>
    </article>
  </div>
  <p class="galerie-aide" aria-hidden="true">${c.t('commun.faitesGlisser')}</p>
  <div class="galerie-progres" aria-hidden="true"><span></span></div>
</section>

<section class="agenda-accueil sombre" id="agenda" data-agenda>
  <div class="conteneur agenda-grille">
    <div class="agenda-tete">
      ${surtitre(c.s('accueil.agenda.surtitre'))}
      <h2 data-anime="lignes">${c.t('accueil.agenda.titre')}</h2>
    </div>
    ${p ? html`<article class="evenement-vedette" data-evenement="${p.id}" data-fin="${finEvenement(p)}">
      ${c.media({ nom: p.affiche || p.image, alt: c.s('agenda.affiche', { titre: p.titre }), cadrage: '50% 30%', classe: 'evenement-media', sizes: '(max-width: 760px) 90vw, 34vw', attrs: 'data-anime="rideau"' })}
      <div class="evenement-texte">
        <p class="evenement-date">${datesTitre(p.dates)}</p>
        <h3 class="evenement-titre">${p.titre}</h3>
        <p>${p.texte}</p>
        ${p.fin ? decompte(c, p.fin, { libelle: c.s('accueil.agenda.decompte') }) : ''}
        <p class="evenement-actions">
          ${c.lien('reserver', { ancre: 'formulaire', params: `sujet=evenement&evenement=${p.id}`, classe: 'bouton', texte: c.t('accueil.agenda.reserver') })}
          ${p.page ? c.lien(p.page, { classe: 'bouton bouton--clair', texte: c.t('accueil.agenda.voir') }) : ''}
        </p>
      </div>
    </article>` : html`<p>${c.t('agenda.vide')}</p>`}
    <div class="agenda-passes">
      <h3>${c.t('accueil.agenda.passes')}</h3>
      <ul data-anime="cascade">${passes.map((e) => html`<li class="evenement-passe" data-evenement="${e.id}" data-fin="${finEvenement(e)}"><span class="evenement-passe-titre">${e.page ? c.lien(e.page, { texte: e.titre }) : e.titre}</span><span class="evenement-passe-date">${datesTitre(e.dates)}</span><span class="etiquette">${c.t('commun.termine')}</span></li>`)}</ul>
      <p>${c.lien('agenda', { classe: 'lien-fleche', texte: c.t('accueil.agenda.lien') })}</p>
    </div>
  </div>
</section>

<section class="receptions" id="receptions">
  <p class="receptions-mots" data-anime="mots" aria-hidden="true">${c.t('accueil.receptions.mots')}</p>
  <div class="conteneur receptions-grille">
    ${c.media({ nom: 'site/mariage-g6', alt: c.s('accueil.receptions.alt'), classe: 'receptions-media', sizes: '(max-width: 760px) 100vw, 50vw', attrs: 'data-fx="zoom"' })}
    <div>
      ${surtitre(c.s('accueil.receptions.surtitre'))}
      <h2 data-anime="lignes">${c.t('accueil.receptions.titre')}</h2>
      <p data-anime>${c.t('accueil.receptions.texte')}</p>
      <ul class="reperes" data-anime="cascade">
        <li>${c.t('mariages.r1')} ${aConfirmer(c)}</li>
        <li>${c.t('mariages.r2')} ${aConfirmer(c)}</li>
        <li>${c.t('mariages.r3')} ${aConfirmer(c)}</li>
      </ul>
      <p class="actions" data-anime>${c.lien('mariages', { classe: 'bouton', texte: c.t('accueil.receptions.lien'), attrs: 'data-survol="magnetique"' })} ${c.lien('fetes', { classe: 'bouton bouton--contour', texte: c.t('pages.fetes.nav') })}</p>
    </div>
  </div>
</section>

<section class="offrir conteneur" id="offrir">
  ${surtitre(c.s('accueil.offrir.surtitre'))}
  <div class="offrir-grille" data-anime="cascade">
    <article class="offrir-carte">
      ${c.media({ nom: 'site/foie-gras-brioche', alt: c.s('emporter.foieGrasNote'), cadrage: '50% 90%', classe: 'offrir-media', sizes: '(max-width: 760px) 90vw, 40vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
      <h2>${c.t('accueil.offrir.emporterTitre')}</h2>
      <p>${c.t('accueil.offrir.emporterTexte')}</p>
      <p>${c.lien('emporter', { classe: 'bouton', texte: c.t('accueil.offrir.emporterLien') })}</p>
    </article>
    <article class="offrir-carte">
      <div class="mini-carte-cadeau" data-survol="incline" aria-hidden="true"><img src="/assets/images/logo-hacienda-96.png" alt="" width="44" height="44" loading="lazy"><span class="mini-carte-nom">${c.t('cadeau.carteNom')}</span><span class="mini-carte-montant">${c.t('cadeau.carteValidite')}</span></div>
      <h2>${c.t('accueil.offrir.cadeauTitre')}</h2>
      <p>${c.t('accueil.offrir.cadeauTexte')}</p>
      <p>${c.lien('cadeau', { classe: 'bouton bouton--contour', texte: c.t('accueil.offrir.cadeauLien') })}</p>
    </article>
  </div>
</section>

<section class="venir" id="venir">
  <div class="conteneur venir-grille">
    <div>
      ${surtitre(c.s('accueil.venir.surtitre'))}
      <h2 data-anime="lignes">${c.t('accueil.venir.titre')}</h2>
      <p data-anime>${c.t('accueil.venir.texte')}</p>
      <address class="adresse" data-anime>
        <strong>${c.site.nom}</strong><br>${c.site.contact.adresse}<br>
        <a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a>
      </address>
      <p class="a-completer-texte" data-anime>${c.t('accueil.venir.horaires')}</p>
      <p class="note-google" data-anime>${c.t('commun.googleNote')} ${aConfirmer(c)}</p>
      <p class="venir-actions" data-anime>
        ${c.lien('reserver', { ancre: 'formulaire', classe: 'bouton', texte: c.t('commun.actionEntete') })}
        ${externe(c, 'https://www.google.com/maps/search/?api=1&query=6%20Vathier%20Haye%2054580%20Moineville', c.t('commun.itineraire'), 'bouton bouton--contour')}
      </p>
    </div>
    ${carteAcces(c)}
  </div>
</section>
`;
};
