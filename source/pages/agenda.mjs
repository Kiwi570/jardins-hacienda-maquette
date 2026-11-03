/* Agenda : événements triés automatiquement entre à venir et passés (au chargement, à la date réelle, heure de Paris).
   Le tri écrit dans la page est celui du jour de la génération ; agenda.js le refait dans le navigateur. */
import { html } from '../../outils/gabarit.mjs';
import { tete, surtitre, decompte, aVenir, finEvenement, datesTexte, datesTitre } from '../composants.mjs';

export const page = { cle: 'agenda', fichier: 'agenda', imagePartage: 'grok/confettis-or-1280.webp' };

const carte = (c, e) => html`<li class="evenement" data-evenement="${e.id}" data-fin="${finEvenement(e)}" data-debut="${e.dates[0]}">
  ${c.media({ nom: e.affiche, alt: c.s('agenda.affiche', { titre: e.titre }), classe: 'evenement-affiche', sizes: '(max-width: 760px) 40vw, 18vw', cadrage: '50% 30%' })}
  <div class="evenement-corps">
    <p class="evenement-date">${datesTitre(e.dates)} <span class="etiquette etiquette--passe">${c.t('commun.termine')}</span></p>
    <h3 class="evenement-titre">${e.titre}</h3>
    <p>${e.texte}</p>
    ${e.tarif ? html`<p class="evenement-tarif" data-prix>${e.tarif}</p>` : ''}
    <p class="evenement-actions">${e.page ? c.lien(e.page, { classe: 'bouton bouton--contour bouton--petit', texte: c.t('agenda.voir') }) : ''}${aVenir(e) ? c.lien('reserver', { ancre: 'formulaire', params: `sujet=evenement&evenement=${e.id}`, classe: 'bouton bouton--petit evenement-reserver', texte: c.t('agenda.reserver') }) : ''}</p>
  </div>
</li>`;

export default (c) => {
  const E = c.donnees.evenements;
  const venir = E.filter((e) => aVenir(e)).sort((a, b) => a.dates[0].localeCompare(b.dates[0]));
  const passes = E.filter((e) => !aVenir(e)).sort((a, b) => b.dates.at(-1).localeCompare(a.dates.at(-1)));
  const p = venir[0];
  return html`
${tete(c, { surtitre: c.s('agenda.surtitre'), titre: c.t('agenda.titre'), titre2: c.t('agenda.titre2'), texte: c.t('agenda.texte'), action: c.t('agenda.action'), actionHref: c.url('reserver', 'formulaire', 'sujet=evenement'), info: p ? `${c.s('accueil.hero.prochaine')} : ${p.titre}, ${datesTexte(p.dates)}` : c.s('agenda.vide'), image: 'grok/confettis-or', alt: c.s('agenda.alt'), classe: 'page-tete--sombre' })}

<section class="agenda conteneur" id="a-venir" data-agenda>
  <div class="agenda-colonne">
    ${surtitre(c.s('agenda.surtitre'))}
    <h2 data-anime="lignes">${c.t('agenda.aVenirTitre')}</h2>
    ${p && p.fin ? html`<p class="decompte-surtitre">${p.titre} · ${c.t('sylvestre.decompte')}</p>${decompte(c, p.fin, { libelle: c.s('sylvestre.decompte'), classe: 'decompte--grand' })}` : ''}
    <ul class="evenements" data-liste="a-venir" data-anime="cascade">${venir.map((e) => carte(c, e))}</ul>
    <p class="agenda-vide" data-agenda-vide${venir.length ? ' hidden' : ''}>${c.t('agenda.vide')}</p>
    <aside class="agenda-aussi" data-masquer-apres="${c.donnees.emporter.fin}T23:59:59+01:00" data-anime>
      ${c.media({ nom: 'grok/table-fetes', alt: '', classe: 'agenda-aussi-media', sizes: '(max-width: 760px) 90vw, 20vw' })}
      <div>
        ${surtitre(c.s('agenda.aussiSur'))}
        <h3>${c.t('agenda.aussiTitre')}</h3>
        <p>${c.t('agenda.aussiTexte')}</p>
        <p>${c.lien('emporter', { classe: 'bouton bouton--petit', texte: c.t('agenda.aussiLien') })}</p>
      </div>
    </aside>
  </div>
</section>

<section class="agenda agenda--passes conteneur" id="passes">
  <h2 data-anime="lignes">${c.t('agenda.passesTitre')}</h2>
  <ul class="evenements evenements--passes" data-liste="passes" data-anime="cascade">${passes.map((e) => carte(c, e))}</ul>
</section>
`;
};
