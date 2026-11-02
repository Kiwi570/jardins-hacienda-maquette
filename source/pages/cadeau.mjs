/* Carte cadeau : montant de 25 à 200 €, quantité, destinataire et petit mot ; la carte en relief se met à jour en direct,
   total toujours visible ; paiement simulé. Conditions lues sur le visuel actuel de la carte. */
import { html, brut } from '../../outils/gabarit.mjs';
import { tete, surtitre, aCompleter, aConfirmer } from '../composants.mjs';

export const page = { cle: 'cadeau', fichier: 'carte-cadeau', imagePartage: 'grok/cadeau-kraft-1280.webp' };

export default (c) => {
  const C = c.donnees.cadeau;
  return html`
${tete(c, { surtitre: c.s('cadeau.surtitre'), titre: c.t('cadeau.titre'), texte: c.t('cadeau.texte'), action: c.t('cadeau.action'), actionHref: '#composer', info: c.s('cadeau.info'), image: 'grok/cadeau-kraft', alt: c.s('cadeau.alt') })}

<section class="cadeau conteneur" id="composer">
  <div class="cadeau-apercu">
    <div class="carte-cadeau" data-carte-cadeau data-visuel data-effet="carte-relief" data-survol="incline">
      <img src="/assets/images/logo-hacienda-96.png" alt="" width="56" height="56" loading="lazy">
      <p class="carte-cadeau-nom">${c.t('cadeau.carteNom')}</p>
      <p class="carte-cadeau-lieu">${c.site.nom}</p>
      <p class="carte-cadeau-montant" data-prix><span data-cadeau-montant>${C.defaut}</span> €</p>
      <p class="carte-cadeau-pour" data-cadeau-pour-apercu>&nbsp;</p>
    </div>
    <p class="note">${c.t('cadeau.conditions')}</p>
  </div>
  <form class="cadeau-form" data-formulaire data-cadeau action="#" novalidate>
    ${surtitre(c.s('cadeau.surtitre'))}
    <h2 data-anime="lignes">${c.t('cadeau.composerTitre')}</h2>
    <fieldset class="champ"><legend class="champ-libelle">${c.t('cadeau.montant')} ${aConfirmer(c)}</legend>
      <div class="puces">${C.montants.map((m) => html`<label class="puce-choix"><input type="radio" name="montant" value="${m}"${m === C.defaut ? brut(' checked') : ''}><span>${m} €</span></label>`)}</div>
    </fieldset>
    <div class="champs-2">
      <div class="champ"><label for="g-qte">${c.t('cadeau.quantite')}</label><select id="g-qte" name="quantite">${[1, 2, 3, 4, 5].map((n) => html`<option value="${n}">${n}</option>`)}</select></div>
      <div class="champ"><label for="g-pour">${c.t('cadeau.pour')}</label><input id="g-pour" name="pour" autocomplete="off" aria-describedby="g-pour-aide" maxlength="40"><p class="aide" id="g-pour-aide">${c.t('cadeau.pourAide')}</p></div>
      <div class="champ"><label for="g-de">${c.t('cadeau.de')}</label><input id="g-de" name="de" autocomplete="name" required maxlength="40"></div>
      <div class="champ"><label for="g-email">${c.t('commun.email')}</label><input id="g-email" name="email" type="email" autocomplete="email" required></div>
    </div>
    <div class="champ"><label for="g-mot">${c.t('cadeau.mot')} (${c.t('commun.facultatif')})</label><textarea id="g-mot" name="mot" rows="3" maxlength="200"></textarea></div>
    <p class="cadeau-total"><span>${c.t('cadeau.total')}</span><strong data-cadeau-total data-prix>${C.defaut} €</strong></p>
    <p class="mention-donnees">${c.tb('commun.donnees')}</p>
    <p class="note">${c.t('cadeau.paiementACompleter')}</p>
    <button type="submit" class="bouton">${c.t('cadeau.offrir')}</button>
    <p data-message-envoi role="status" tabindex="-1" hidden data-texte="${c.s('cadeau.simule')}"></p>
  </form>
</section>
`;
};
