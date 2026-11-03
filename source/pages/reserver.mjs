/* Réserver & contact : une seule demande (table, événement, réception, question), préremplie par l'adresse
   (?sujet=evenement&evenement=saint-sylvestre), dates passées refusées, nombre de couverts, réservation simulée. */
import { html, brut } from '../../outils/gabarit.mjs';
import { tete, surtitre, externe, aVenir, datesTexte } from '../composants.mjs';

export const page = { cle: 'reserver', fichier: 'reserver', imagePartage: 'site/reserver-ouverture-1280.webp', barre: { ancre: 'formulaire', texte: 'reserver.action' } };

export default (c) => {
  const venir = c.donnees.evenements.filter((e) => aVenir(e));
  return html`
${tete(c, { surtitre: c.s('reserver.surtitre'), titre: c.t('reserver.titre'), titre2: c.t('reserver.titre2'), texte: c.t('reserver.texte'), action: c.t('reserver.action'), actionHref: '#formulaire', info: `${c.s('commun.appeler')} : ${c.site.contact.telephone}`, image: 'site/reserver-ouverture', alt: c.s('reserver.alt'), cadrage: '50% 55%', classe: 'page-tete--court' })}

<section class="reservation conteneur" id="formulaire">
  <form class="reservation-form" data-formulaire data-reservation action="#" novalidate>
    ${surtitre(c.s('reserver.surtitre'))}
    <h2 data-anime="lignes">${c.t('reserver.formTitre')}</h2>
    <fieldset class="champ"><legend class="champ-libelle">${c.t('reserver.sujet')}</legend>
      <div class="puces">${[['table', 'sujetTable'], ['journee', 'sujetJournee'], ['evenement', 'sujetEvenement'], ['reception', 'sujetReception'], ['question', 'sujetQuestion']].map(([v, k], i) => html`<label class="puce-choix"><input type="radio" name="sujet" value="${v}"${i === 0 ? brut(' checked') : ''} data-sujet><span>${c.t('reserver.' + k)}</span></label>`)}</div>
    </fieldset>
    <div class="champ" data-si-sujet="evenement" hidden><label for="r-evenement">${c.t('reserver.evenement')}</label><select id="r-evenement" name="evenement">${venir.map((e) => html`<option value="${e.id}" data-date="${e.dates[0]}">${e.titre} : ${datesTexte(e.dates)}</option>`)}</select></div>
    <div class="evenement-resume" data-si-sujet="evenement" hidden>
      ${venir.filter((e) => e.formules).map((e) => html`<fieldset class="champ" data-formules-pour="${e.id}"><legend class="champ-libelle">${c.t('reserver.formule')}</legend>
        <div class="puces">${e.formules.map((f, i) => html`<label class="puce-choix"><input type="radio" name="formule" value="${f.id}"${i === 0 ? brut(' checked') : ''}><span>${f.libelle} · ${f.prix} €</span></label>`)}</div></fieldset>`)}
      <p class="note">${c.t('reserver.evenementNote')}</p>
    </div>
    <div class="reception-liens" data-si-sujet="reception" hidden>
      <p>${c.t('reserver.receptionTexte')}</p>
      <p class="actions">${c.lien('mariages', { ancre: 'demande', classe: 'bouton', texte: c.t('reserver.receptionMariage') })} ${c.lien('fetes', { ancre: 'demande', classe: 'bouton bouton--contour', texte: c.t('reserver.receptionFete') })}</p>
    </div>
    <p class="note" data-si-sujet="journee" hidden>${c.t('reserver.journeeNote')}</p>
    <div class="champs-3" data-si-sujet="table journee evenement">
      <div class="champ" data-si-sujet="table journee"><label for="r-date">${c.t('reserver.date')}</label><input id="r-date" name="date" type="date" data-date-future required></div>
      <div class="champ" data-si-sujet="table"><span class="champ-libelle" id="l-service">${c.t('reserver.service')}</span><div class="puces" role="radiogroup" aria-labelledby="l-service"><label class="puce-choix"><input type="radio" name="service" value="midi" checked><span>${c.t('reserver.midi')}</span></label><label class="puce-choix"><input type="radio" name="service" value="soir"><span>${c.t('reserver.soir')}</span></label></div></div>
      <div class="champ"><label for="r-couverts">${c.t('reserver.couverts')}</label><select id="r-couverts" name="couverts">${Array.from({ length: 20 }, (_, i) => html`<option value="${i + 1}"${i === 1 ? brut(' selected') : ''}>${i + 1}</option>`)}<option value="plus">21 +</option></select></div>
    </div>
    <div class="champs-2">
      <div class="champ"><label for="r-prenom">${c.t('commun.prenom')}</label><input id="r-prenom" name="prenom" autocomplete="given-name" required></div>
      <div class="champ"><label for="r-nom">${c.t('commun.nom')}</label><input id="r-nom" name="nom" autocomplete="family-name" required></div>
      <div class="champ"><label for="r-email">${c.t('commun.email')}</label><input id="r-email" name="email" type="email" autocomplete="email" required></div>
      <div class="champ"><label for="r-tel">${c.t('commun.tel')}</label><input id="r-tel" name="tel" type="tel" autocomplete="tel" required></div>
    </div>
    <div class="champ"><label for="r-message">${c.t('commun.message')} (${c.t('commun.facultatif')})</label><textarea id="r-message" name="message" rows="4"></textarea></div>
    <p class="mention-donnees">${c.tb('commun.donnees')}</p>
    <button type="submit" class="bouton">${c.t('reserver.envoyer')}</button>
    <p data-message-envoi data-texte="${c.s('commun.simule')}" role="status" tabindex="-1" hidden></p>
  </form>
  <aside class="joindre">
    ${c.media({ nom: 'site/table-fenetre', alt: c.s('reserver.altFenetre'), classe: 'joindre-media', sizes: '(max-width: 760px) 100vw, 30vw', attrs: 'data-fx="parallaxe" data-fx-force="7"' })}
    <h2>${c.t('reserver.joindreTitre')}</h2>
    <p>${c.t('reserver.joindreTexte')}</p>
    <p><a class="bouton" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
    <address class="adresse">${c.site.contact.adresse}<br><span class="a-completer-texte">${c.t('commun.emailACompleter')}</span></address>
    <p>${externe(c, c.site.contact.instagram, c.t('commun.instagram'), 'lien-fleche')} · ${externe(c, c.site.contact.facebook, c.t('commun.facebook'), 'lien-fleche')}</p>
  </aside>
</section>
`;
};
