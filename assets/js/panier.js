/* Commande à emporter : une seule source (localStorage « hacienda:panier »), identique dans tous les onglets
   (événement storage), donnée abîmée nettoyée sans bloquer le site, panier vidé après une commande simulée.
   Effet propre « envol » : au défilement, les produits montent ; à l'ajout, le visuel s'envole vers le panier. */
import { etat } from './socle/index.js?v=2';

const CLE = 'hacienda:panier';
const ls = () => { try { return window.localStorage; } catch { return null; } };
const vide = () => ({ lignes: {}, jour: '', moment: 'midi' });
const euros = (n) => `${(Math.round(n * 100) / 100).toLocaleString('fr-FR', { minimumFractionDigits: Number.isInteger(Math.round(n * 100) / 100) ? 0 : 2, maximumFractionDigits: 2 })} €`;
const kg = (q) => `${String(q).replace('.', ',')} kg`;

function lire() {
  try {
    const brut = ls() && ls().getItem(CLE);
    if (!brut) return vide();
    const d = JSON.parse(brut);
    if (!d || typeof d !== 'object' || typeof d.lignes !== 'object' || Array.isArray(d.lignes)) throw new Error('forme');
    for (const [k, v] of Object.entries(d.lignes)) if (!(typeof v === 'number' && v > 0 && v < 100)) delete d.lignes[k];
    return { ...vide(), ...d };
  } catch {
    try { ls() && ls().removeItem(CLE); } catch {}
    return vide();
  }
}
function ecrire(d) { try { ls() && ls().setItem(CLE, JSON.stringify(d)); } catch {} }

export function initPanier() {
  const zone = document.querySelector('[data-panier-produits]');
  const aside = document.querySelector('[data-panier]');
  if (!zone || !aside) return;
  const T = JSON.parse(document.querySelector('[data-panier-textes]').textContent);
  const produits = Object.fromEntries([...document.querySelectorAll('[data-produit]')].map((li) => [li.dataset.produit, { prix: +li.dataset.prixUnitaire, unite: li.dataset.unite, li }]));
  const lignesEl = aside.querySelector('[data-panier-lignes]');
  const modele = document.querySelector('[data-panier-modele]');
  const totalEl = aside.querySelector('[data-panier-total]');
  const videEl = aside.querySelector('[data-panier-vide]');
  const retraitEl = aside.querySelector('[data-panier-retrait]');
  const pastille = document.querySelector('[data-panier-pastille]');
  const annonce = document.querySelector('[data-panier-annonce]');
  const form = document.querySelector('[data-commande]');
  let d = lire();
  /* Les produits retirés de la carte disparaissent du panier. */
  for (const k of Object.keys(d.lignes)) if (!produits[k]) delete d.lignes[k];

  const total = () => Object.entries(d.lignes).reduce((s, [k, q]) => s + produits[k].prix * q, 0);
  const nombre = () => Object.entries(d.lignes).reduce((s, [k, q]) => s + (produits[k].unite === 'kg' ? 1 : q), 0);

  /* Calendrier : jours passés grisés et désactivés, aujourd'hui repéré (date de Paris). */
  const aujourdhui = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  form.querySelectorAll('[data-jour]').forEach((r) => {
    const lab = r.closest('.jour');
    if (r.value < aujourdhui) { r.disabled = true; lab.setAttribute('title', 'passé'); }
    if (r.value === aujourdhui) lab.classList.add('jour--aujourdhui');
    r.checked = r.value === d.jour && !r.disabled;
  });
  if (d.jour && !form.querySelector(`[data-jour][value="${d.jour}"]:not(:disabled)`)) d.jour = '';
  const moment = form.querySelector(`[name="moment"][value="${d.moment}"]`);
  if (moment) moment.checked = true;

  function rendre() {
    lignesEl.replaceChildren();
    for (const [k, q] of Object.entries(d.lignes)) {
      const li = modele.content.firstElementChild.cloneNode(true);
      li.dataset.ligne = k;
      li.querySelector('.panier-ligne-nom').textContent = T.noms[k];
      li.querySelector('[data-qte]').textContent = produits[k].unite === 'kg' ? kg(q) : String(q);
      li.querySelector('.panier-ligne-prix').textContent = euros(produits[k].prix * q);
      lignesEl.appendChild(li);
    }
    const n = nombre(), t = total();
    videEl.hidden = n > 0;
    totalEl.textContent = euros(t);
    if (pastille) {
      pastille.hidden = n === 0;
      pastille.querySelector('[data-panier-nombre]').textContent = String(n);
      pastille.querySelector('[data-panier-pastille-total]').textContent = euros(t);
    }
    if (d.jour) {
      const date = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(d.jour + 'T12:00:00+01:00'));
      retraitEl.textContent = T.retrait.replace('{jour}', date).replace('{moment}', (d.moment === 'soir' ? T.soir : T.midi).toLowerCase());
    } else retraitEl.textContent = '';
  }

  function changer(k, delta) {
    const pas = produits[k].unite === 'kg' ? 0.5 : 1;
    const q = Math.round(((d.lignes[k] || 0) + delta * pas) * 2) / 2;
    if (q <= 0) delete d.lignes[k]; else d.lignes[k] = Math.min(q, 20);
    ecrire(d); rendre();
  }

  /* Envol vers le panier : un clone du visuel part de sa place et rejoint la pastille. */
  function envol(li) {
    const gsap = window.gsap;
    const src = li.querySelector('[data-envol-image]');
    if (!gsap || etat.calme || !src || !pastille || pastille.hidden) return;
    const a = src.getBoundingClientRect(), b = pastille.getBoundingClientRect();
    const clone = src.cloneNode(true);
    clone.classList.add('envol-clone');
    clone.setAttribute('aria-hidden', 'true');
    Object.assign(clone.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
    document.body.appendChild(clone);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    gsap.timeline({ onComplete: () => { clone.remove(); pastille.classList.remove('rebond'); void pastille.offsetWidth; pastille.classList.add('rebond'); } })
      .to(clone, { x: dx, duration: 0.75, ease: 'power1.inOut' }, 0)
      .to(clone, { y: dy, duration: 0.75, ease: 'back.in(1.4)' }, 0)
      .to(clone, { scale: 0.12, rotate: 18, borderRadius: '50%', duration: 0.75, ease: 'power2.in' }, 0)
      .to(clone, { opacity: 0, duration: 0.15 }, 0.62);
  }

  zone.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ajouter]');
    if (!b) return;
    const k = b.dataset.ajouter, li = produits[k].li;
    if (produits[k].unite === 'kg') {
      const poids = parseFloat(li.querySelector('[data-poids]').value) || 1;
      d.lignes[k] = Math.min(20, Math.round(((d.lignes[k] || 0) + poids) * 2) / 2);
    } else d.lignes[k] = Math.min(20, (d.lignes[k] || 0) + 1);
    ecrire(d); rendre();
    envol(li);
    annonce.textContent = T.ajoute.replace('{nom}', T.noms[k]).replace('{total}', euros(total()));
  });
  lignesEl.addEventListener('click', (e) => {
    const li = e.target.closest('[data-ligne]');
    if (!li) return;
    if (e.target.closest('[data-plus]')) changer(li.dataset.ligne, 1);
    if (e.target.closest('[data-moins]')) changer(li.dataset.ligne, -1);
  });
  form.addEventListener('change', (e) => {
    if (e.target.name === 'jour') { d.jour = e.target.value; form.querySelector('[data-erreur-jour]').hidden = true; }
    if (e.target.name === 'moment') d.moment = e.target.value;
    ecrire(d); rendre();
  });
  /* Vérifications propres à la commande, avant celles du formulaire simulé (phase de capture). */
  document.addEventListener('submit', (e) => {
    if (e.target !== form) return;
    const sansProduit = nombre() === 0, sansJour = !d.jour;
    aside.querySelector('[data-erreur-panier]').hidden = !sansProduit;
    form.querySelector('[data-erreur-jour]').hidden = !sansJour;
    if (sansProduit || sansJour) {
      e.preventDefault(); e.stopImmediatePropagation();
      (sansJour ? form.querySelector('[data-jour]:not(:disabled)') : zone.querySelector('[data-ajouter]'))?.focus();
    }
  }, true);
  form.addEventListener('submit', () => {
    setTimeout(() => {
      const msg = form.querySelector('[data-message-envoi]');
      if (msg && !msg.hidden) { d = vide(); ecrire(d); rendre(); form.querySelectorAll('[data-jour]').forEach((r) => { r.checked = false; }); }
    }, 0);
  });
  window.addEventListener('storage', (e) => { if (e.key === CLE) { d = lire(); rendre(); } });

  /* La pastille se cache quand la commande est à l'écran. */
  const section = document.getElementById('commande');
  if (pastille && section) new IntersectionObserver(([en]) => pastille.classList.toggle('cachee', en.isIntersecting), { threshold: 0.08 }).observe(section);
  rendre();
  window.__panier = { lire, total };
}

/* Montée des produits au défilement (effet « envol », partie liée au défilement). */
export function envolDefilement() {
  const gsap = window.gsap, grille = document.querySelector('[data-effet="envol"]');
  if (!gsap || !window.ScrollTrigger || !grille || etat.calme) return;
  const visuels = [...grille.querySelectorAll('.produit-visuel')];
  gsap.matchMedia().add('(min-width: 421px)', () => {
    visuels.forEach((v, i) => {
      /* Le visuel monte en se redressant, sans sortir de son cadre (jamais sur le texte du produit). */
      gsap.fromTo(v, { y: 18 + (i % 4) * 6, scale: 0.8, rotation: i % 2 ? 3 : -3 }, {
        y: 0, scale: 1, rotation: 0, ease: 'none',
        scrollTrigger: { trigger: v.closest('.produit'), start: 'top bottom', end: 'top 55%', scrub: 0.6 },
      });
    });
  });
  gsap.matchMedia().add('(max-width: 420px)', () => {
    visuels.forEach((v, i) => {
      gsap.fromTo(v, { y: 8, scale: 0.84, rotation: i % 2 ? 3 : -3 }, { y: 0, scale: 1, rotation: 0, ease: 'none', scrollTrigger: { trigger: v, start: 'top bottom', end: 'top 60%', scrub: 0.6 } });
    });
  });
}
