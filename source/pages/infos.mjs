/* Infos pratiques : horaires (à compléter : aucun statut « ouvert » sans horaires fiables), journées festives,
   accès bar, piscine, réservation, accès (carte dessinée), questions fréquentes. */
import { html } from '../../outils/gabarit.mjs';
import { tete, surtitre, carteAcces, externe, aCompleter } from '../composants.mjs';

export const page = { cle: 'infos', fichier: 'infos-pratiques', imagePartage: 'site/infos-ouverture-1280.webp' };

export default (c) => html`
${tete(c, { surtitre: c.s('infos.surtitre'), titre: c.t('infos.titre'), texte: c.t('infos.texte'), action: c.t('infos.action'), actionHref: c.url('reserver'), info: `${c.site.contact.adresse} · ${c.site.contact.telephone}`, image: 'site/infos-ouverture', alt: c.s('infos.altOuverture'), cadrage: '50% 60%' })}

<section class="infos-grille-section" id="horaires">
  ${c.media({ nom: 'grok/pierre-chaux', alt: '', classe: 'infos-fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
  <div class="conteneur infos-grille" data-anime="cascade">
    <article class="info-bloc info-bloc--horaires"><h2>${c.t('infos.horairesTitre')}</h2><p>${c.t('infos.horairesTexte')} ${aCompleter(c)}</p></article>
    <article class="info-bloc"><h2>${c.t('infos.festivesTitre')}</h2><p>${c.t('infos.festivesTexte')}</p></article>
    <article class="info-bloc"><h2>${c.t('infos.barTitre')}</h2><p>${c.t('infos.barTexte')}</p></article>
    <article class="info-bloc"><h2>${c.t('infos.piscineTitre')}</h2><p>${c.t('infos.piscineTexte')}</p></article>
    <article class="info-bloc"><h2>${c.t('infos.resaTitre')}</h2><p>${c.t('infos.resaTexte')}</p><p>${c.lien('reserver', { classe: 'lien-fleche', texte: c.t('commun.actionEntete') })}</p></article>
  </div>
</section>

<section class="infos-photos conteneur" id="lieu">
  ${c.media({ nom: 'site/infos-piscine', alt: c.s('infos.altPiscine'), classe: 'infos-photo infos-photo--large', sizes: '(max-width: 760px) 100vw, 60vw', attrs: 'data-anime="rideau"' })}
  ${c.media({ nom: 'site/infos-bar', alt: c.s('infos.altBar'), classe: 'infos-photo', sizes: '(max-width: 760px) 100vw, 30vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
</section>

<section class="acces conteneur" id="acces">
  <div>
    ${surtitre(c.s('infos.accesTitre'))}
    <h2 data-anime="lignes">${c.t('accueil.venir.titre')}</h2>
    <p data-anime>${c.t('infos.accesTexte')}</p>
    <address class="adresse" data-anime><strong>${c.site.nom}</strong><br>${c.site.contact.adresse}<br><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></address>
    <p class="actions" data-anime>${externe(c, 'https://www.google.com/maps/search/?api=1&query=6%20Vathier%20Haye%2054580%20Moineville', c.t('commun.itineraire'), 'bouton')}</p>
    ${c.media({ nom: 'site/route-reelle', alt: c.s('infos.altRoute'), classe: 'acces-media', sizes: '(max-width: 760px) 100vw, 30vw', attrs: 'data-fx="zoom"' })}
  </div>
  ${carteAcces(c)}
</section>

<section class="faq conteneur" id="faq" data-sans-visuel>
  <h2 data-anime="lignes">${c.t('infos.faqTitre')}</h2>
  <div class="faq-liste">${c.donnees.faq.map((f) => html`<details class="faq-item" data-anime><summary>${f.q}</summary><div class="faq-reponse"><p>${f.r}</p></div></details>`)}</div>
  <p class="actions" data-anime>${c.lien('reserver', { classe: 'bouton', texte: c.t('commun.actionEntete'), attrs: 'data-survol="magnetique"' })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
</section>
`;
