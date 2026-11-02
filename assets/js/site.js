/* Effets et fonctionnalités propres aux Jardins de l'Hacienda. Le socle gère l'ouverture, les transitions, l'en-tête,
   le menu, le mode calme, les boucles, les mesures et la bibliothèque d'effets (posés par attributs dans les pages).
   Effets propres du plan, chacun marqué data-effet : surface, saison, braises, ardoise, volets, decompte, envol, palmes,
   carte-relief, carte. */
import { demarrer, boucle, etat, suivre, lacher, bloquerDefilement, debloquerDefilement, rafraichir, quand } from './socle/index.js?v=2';
import { monterSurface } from './surface.js?v=2';
import { initPanier, envolDefilement } from './panier.js?v=2';

const gsap = window.gsap;
const html = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ST = () => window.ScrollTrigger;
let surfacePrete = () => {};
const pret = [new Promise((r) => { surfacePrete = r; })];
let surface = null;
const COULEURS = { hiver: '#1b1310', ete: '#163b33' };
const ss = () => { try { return window.sessionStorage; } catch { return null; } };
const parisJour = (d = new Date()) => new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

/* ---------- saison : interrupteur Été / Hiver (rideau circulaire depuis le bouton) et scène au défilement ---------- */
function initSaison() {
  const annonce = document.createElement('p');
  annonce.className = 'visuellement-cache'; annonce.setAttribute('aria-live', 'polite');
  document.body.appendChild(annonce);
  const appliquer = (vers) => {
    html.dataset.saison = vers;
    try { ss() && ss().setItem('hacienda:saison', vers); } catch {}
    $$('[data-bascule-saison]').forEach((b) => b.setAttribute('aria-pressed', String(vers === 'ete')));
    annonce.textContent = vers === 'ete' ? 'Saison d’été affichée' : 'Saison d’hiver affichée';
    if (surface) surface.changerSaison();
    rafraichir && rafraichir();
    ST() && ST().refresh();
  };
  $$('[data-bascule-saison]').forEach((b) => {
    b.setAttribute('aria-pressed', String(html.dataset.saison === 'ete'));
    b.addEventListener('click', () => {
      const vers = html.dataset.saison === 'ete' ? 'hiver' : 'ete';
      if (etat.calme || !gsap) { appliquer(vers); return; }
      const r = b.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const voile = document.createElement('div');
      voile.className = 'bascule-voile'; voile.setAttribute('aria-hidden', 'true'); voile.dataset.recouvrement = '';
      voile.style.background = COULEURS[vers];
      document.body.appendChild(voile);
      suivre(voile);
      gsap.timeline({ onComplete: () => { lacher(voile); voile.remove(); } })
        .fromTo(voile, { clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(150vmax at ${x}px ${y}px)`, duration: 0.6, ease: 'power3.in' })
        .add(() => appliquer(vers))
        .to(voile, { opacity: 0, duration: 0.5, ease: 'power2.out' }, '+=0.12');
    });
  });
}

function sceneSaisons() {
  const scene = $('[data-saisons-scene]');
  if (!scene || !gsap || !ST() || etat.calme) return;
  gsap.matchMedia().add('(min-width: 901px)', () => {
    const tw = gsap.fromTo(scene, { '--coupe': '104%' }, {
      '--coupe': '50%', ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top 85%', end: 'center 55%', scrub: 0.6 },
    });
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); scene.style.removeProperty('--coupe'); };
  });
  gsap.matchMedia().add('(max-width: 900px)', () => {
    $$('.saison', scene).forEach((el) => {
      const media = $('.media', el);
      gsap.set(media, { scale: 1.18 });
      ST().create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(media, { scale: 1, duration: 1.6, ease: 'power3.out' }) });
    });
  });
}

/* ---------- braises : fines braises (hiver) ou pollen doré (été) qui montent dans la section du chef ---------- */
function initBraises() {
  /* Une seule lueur dessinée à l'avance (par saison), puis copiée à l'échelle : aucun dégradé recalculé à chaque image. */
  const sprite = (couleur) => {
    const c = document.createElement('canvas'); c.width = c.height = 32;
    const x = c.getContext('2d'), g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, couleur); g.addColorStop(0.35, couleur.replace(/[\d.]+\)$/, '0.45)')); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, 32, 32); return c;
  };
  const S = { hiver: sprite('rgba(255,170,80,1)'), ete: sprite('rgba(240,217,176,1)') };
  $$('[data-braises]').forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, parts = [];
    const n = () => Math.round(Math.min(46, Math.max(14, (w * h) / 32000)));
    const nouvelle = (bas = true) => ({ x: Math.random() * w, y: bas ? h + Math.random() * h * 0.3 : Math.random() * h, r: 0.6 + Math.random() * 1.9, v: 18 + Math.random() * 40, ph: Math.random() * 6.28, vie: 0.5 + Math.random() * 0.5 });
    new ResizeObserver(() => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w)); canvas.height = Math.max(1, Math.round(h));
      parts = Array.from({ length: n() }, () => nouvelle(false));
    }).observe(canvas);
    boucle(canvas, (dt, t) => {
      const ete = html.dataset.saison === 'ete';
      const img = ete ? S.ete : S.hiver;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of parts) {
        p.y -= p.v * (ete ? 0.45 : 1) * dt;
        p.x += Math.sin(t * (ete ? 0.6 : 1.4) + p.ph) * (ete ? 14 : 8) * dt;
        if (p.y < -10) Object.assign(p, nouvelle(true));
        const vacille = ete ? 0.75 : 0.55 + 0.45 * Math.sin(t * 6 + p.ph * 3);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.y / h)) * p.vie * vacille;
        const d = p.r * 10;
        ctx.drawImage(img, p.x - d / 2, p.y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }, { lourde: true });
  });
}

/* ---------- ardoise : le texte s'écrit à la craie au défilement, un chiffon passe ---------- */
function initArdoise() {
  if (!gsap || !ST() || etat.calme) return;
  $$('.ardoise').forEach((a) => {
    const lignes = $$('.craie > span, .craie li', a);
    const chiffon = $('.ardoise-chiffon', a);
    let L = 0, H = 0;
    new ResizeObserver(() => { L = a.clientWidth; H = a.clientHeight; }).observe(a);
    lignes.forEach((l) => l.style.setProperty('--m', '-10%'));
    const tl = gsap.timeline({ paused: true });
    lignes.forEach((l, i) => { tl.fromTo(l, { '--m': '-10%' }, { '--m': '112%', ease: 'power1.inOut', duration: 0.9 }, i * 0.42); });
    tl.fromTo(chiffon, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0).to(chiffon, { opacity: 0, duration: 0.4 }, lignes.length * 0.42 + 0.3);
    tl.eventCallback('onUpdate', () => {
      const p = tl.progress();
      chiffon.style.transform = `translate(${(0.15 + p * 0.75) * L}px, ${(0.25 + p * 0.55) * H}px) translate(-50%, -50%)`;
    });
    ST().create({ trigger: a, start: 'top 78%', once: true, onEnter: () => tl.play() });
  });
}

/* ---------- volets : la carte se déplie en 3D au défilement, prix lisibles dès le départ ---------- */
function initVolets() {
  if (!gsap || !ST() || etat.calme) return;
  $$('[data-volets] .volet').forEach((v) => {
    gsap.set(v, { rotationX: -34, y: 50, opacity: 0, transformPerspective: 1400 });
    ST().create({ trigger: v, start: 'top 90%', once: true, onEnter: () => gsap.to(v, { rotationX: 0, y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', clearProps: 'transform' }) });
  });
}

/* ---------- carte : les villes apparaissent, puis les routes se tracent vers Moineville, une seule fois ---------- */
function initCarte() {
  if (!gsap || !ST() || etat.calme) return;
  $$('[data-effet="carte"]').forEach((svg) => {
    const routes = $$('[data-fx-trait]', svg);
    const villes = $$('[data-repere]', svg);
    routes.forEach((t) => { t.setAttribute('pathLength', '1'); t.style.strokeDasharray = '1 1.2'; t.style.strokeDashoffset = '1.1'; });
    gsap.set(villes, { opacity: 0, y: 8 });
    ST().create({ trigger: svg, start: 'top 82%', once: true, onEnter: () => {
      gsap.timeline()
        .to(villes, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'transform' })
        .to(routes, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: 'power2.inOut' }, 0.25);
    } });
  });
}

/* ---------- decompte : jours, heures, minutes, secondes jusqu'à la date (heure de Paris) ---------- */
function initDecompte() {
  $$('[data-decompte]').forEach((el) => {
    const cible = new Date(el.dataset.decompte).getTime();
    const groupes = Object.fromEntries($$('[data-unite]', el).map((g) => [g.dataset.unite, $$('.chiffre-bande', g)]));
    const texte = $('[data-decompte-texte]', el);
    const maj = () => {
      const reste = Math.max(0, cible - Date.now());
      const v = { jours: Math.floor(reste / 864e5), heures: Math.floor(reste / 36e5) % 24, minutes: Math.floor(reste / 6e4) % 60, secondes: Math.floor(reste / 1e3) % 60 };
      /* Valeur lisible (lecteurs d'écran) : à la minute, pour ne pas changer sans cesse. */
      if (texte) { const t = `${v.jours} jours, ${v.heures} heures, ${v.minutes} minutes`; if (texte.textContent !== t) texte.textContent = t; }
      for (const [u, bandes] of Object.entries(groupes)) {
        const s = String(v[u]).padStart(bandes.length, '0').slice(-bandes.length);
        bandes.forEach((b, i) => { if (b.style.getPropertyValue('--n') !== s[i]) b.style.setProperty('--n', s[i]); });
      }
      if (reste <= 0) el.hidden = true;
    };
    maj();
    let acc = 0;
    boucle(el, (dt) => { acc += dt; if (acc >= 0.25) { acc = 0; maj(); } });
  });
}

/* ---------- agenda : statuts calculés à la date réelle (à venir / passés), au chargement ---------- */
function initAgenda() {
  const maintenant = Date.now();
  $$('[data-evenement][data-fin]').forEach((el) => {
    if (new Date(el.dataset.fin).getTime() > maintenant) return;
    el.classList.add('est-passe');
    const liste = el.closest('[data-liste="a-venir"]');
    const passes = $('[data-liste="passes"]');
    if (liste && passes) passes.prepend(el);
    $$('[data-decompte]', el).forEach((d) => { d.hidden = true; });
    $$('[data-evenement-passe]', el).forEach((p) => { p.hidden = false; });
  });
  const venir = $('[data-liste="a-venir"]');
  if (venir) {
    const vide = $('[data-agenda-vide]');
    if (vide) vide.hidden = !!venir.children.length;
    $$('.agenda .decompte').forEach((d) => { if (!venir.children.length) d.hidden = true; });
  }
  const prochain = $('[data-prochain]');
  const vedette = $('.evenement-vedette');
  if (prochain && vedette && vedette.classList.contains('est-passe')) prochain.hidden = true;
}

/* ---------- palmes : les palmes s'écartent sur la piscine au défilement ---------- */
function initPalmes() {
  if (!gsap || !ST() || etat.calme) return;
  const zone = $('[data-effet="palmes"]');
  if (!zone) return;
  const tete = zone.closest('.page-tete');
  const g = $('[data-palme="gauche"]', zone), d = $('[data-palme="droite"]', zone);
  gsap.set(d, { scaleX: -1 });
  const st = { trigger: tete, start: 'top top', end: 'bottom 30%', scrub: 0.5 };
  gsap.fromTo(g, { xPercent: 0, rotation: 0 }, { xPercent: -55, rotation: -10, ease: 'none', scrollTrigger: st });
  gsap.fromTo(d, { xPercent: 0, rotation: 0 }, { xPercent: 55, rotation: 10, ease: 'none', scrollTrigger: { ...st } });
}

/* ---------- carte-relief : la carte cadeau pivote au défilement, montant et destinataire en direct ---------- */
function initCadeau() {
  const form = $('[data-cadeau]');
  if (!form) return;
  const carte = $('[data-carte-cadeau]');
  const mEl = $('[data-cadeau-montant]'), tEl = $('[data-cadeau-total]'), pEl = $('[data-cadeau-pour-apercu]');
  const maj = () => {
    const m = +(form.querySelector('[name="montant"]:checked') || {}).value || 50;
    const q = +form.querySelector('[name="quantite"]').value || 1;
    const pour = form.querySelector('[name="pour"]').value.trim();
    if (gsap && !etat.calme && mEl.textContent !== String(m)) {
      const o = { v: +mEl.textContent || m };
      gsap.to(o, { v: m, duration: 0.5, ease: 'power2.out', onUpdate: () => { mEl.textContent = String(Math.round(o.v)); } });
    } else mEl.textContent = String(m);
    tEl.textContent = `${m * q} €`;
    pEl.textContent = pour ? `Pour ${pour}` : ' ';
  };
  form.addEventListener('input', maj);
  form.addEventListener('change', maj);
  maj();
  if (gsap && ST() && !etat.calme) {
    gsap.fromTo(carte, { rotationY: -16, rotationX: 8, transformPerspective: 1200 }, { rotationY: 10, rotationX: -4, ease: 'none', scrollTrigger: { trigger: form, start: 'top 85%', end: 'bottom 40%', scrub: 0.6 } });
  }
}

/* ---------- réservation : sujet, date à venir, événement prérempli ---------- */
function erreurChamp(champ, message) {
  const id = 'erreur-' + champ.id;
  let p = document.getElementById(id);
  if (!message) { if (p) p.textContent = ''; champ.removeAttribute('aria-invalid'); return; }
  if (!p) { p = document.createElement('p'); p.id = id; p.className = 'champ-erreur'; p.setAttribute('aria-live', 'polite'); champ.closest('.champ').appendChild(p); champ.setAttribute('aria-describedby', [champ.getAttribute('aria-describedby'), id].filter(Boolean).join(' ')); }
  p.textContent = message; champ.setAttribute('aria-invalid', 'true');
}
function initReservation() {
  const auj = parisJour();
  $$('[data-date-future], #m-date').forEach((i) => { i.min = auj; });
  const form = $('[data-reservation]');
  if (!form) return;
  const sujet = () => (form.querySelector('[name="sujet"]:checked') || {}).value || 'table';
  const maj = () => {
    const s = sujet();
    $$('[data-si-sujet]', form).forEach((b) => {
      const visible = b.dataset.siSujet.split(' ').includes(s);
      b.hidden = !visible;
      $$('input, select, textarea', b).forEach((c) => { c.disabled = !visible; });
    });
  };
  form.addEventListener('change', (e) => { if (e.target.name === 'sujet') maj(); });
  maj();
  document.addEventListener('submit', (e) => {
    if (e.target !== form) return;
    const d = form.querySelector('[data-date-future]');
    /* Journée festive : un mardi, un mercredi ou un jeudi, de juin à septembre. */
    const horsJournee = (v) => { const [a, m, j] = v.split('-').map(Number); const js = new Date(Date.UTC(a, m - 1, j)).getUTCDay(); return m < 6 || m > 9 || js < 2 || js > 4; };
    const message = !d || d.disabled || !d.value ? ''
      : d.value < auj ? 'Choisissez une date à venir.'
      : sujet() === 'journee' && horsJournee(d.value) ? 'Les journées festives ont lieu le mardi, le mercredi et le jeudi, de juin à septembre.' : '';
    if (d) erreurChamp(d, message);
    if (message) { e.preventDefault(); e.stopImmediatePropagation(); d.focus(); }
  }, true);
}

/* ---------- mariages : demande en quatre étapes, hauteur animée, récapitulatif en direct ---------- */
function initEtapes() {
  const form = $('[data-etapes]');
  if (!form) return;
  const T = JSON.parse($('[data-recap-textes]').textContent);
  const cadre = $('[data-etapes-cadre]', form);
  const etapes = $$('[data-etape]', form);
  const reperes = $$('[data-etape-repere]');
  const prec = $('[data-etape-prec]', form), suiv = $('[data-etape-suiv]', form), envoyer = $('[data-etape-envoyer]', form);
  const compte = $('[data-etape-compte]', form);
  let n = 1;
  const val = (nom) => { const c = form.querySelectorAll(`[name="${nom}"]`); if (!c.length) return ''; if (c[0].type === 'radio') return (form.querySelector(`[name="${nom}"]:checked`) || {}).value || ''; if (c[0].type === 'checkbox') return [...form.querySelectorAll(`[name="${nom}"]:checked`)].map((x) => x.value); return c[0].value.trim(); };
  const lib = (v) => T.libelles[v] || v;
  const recap = () => {
    const r = {
      type: lib(val('type')),
      date: val('date') ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(val('date') + 'T12:00:00')) : '',
      invites: val('invites'),
      moment: lib(val('moment')),
      espaces: val('espaces').map(lib).join(', '),
      contact: [val('prenom'), val('nom'), val('email'), val('tel')].filter(Boolean).join(' · '),
    };
    $$('[data-recap-champ]').forEach((dd) => { dd.textContent = r[dd.dataset.recapChamp] || T.vide; });
  };
  const verifier = (fs) => {
    let premier = null;
    $$('input, select, textarea', fs).forEach((c) => {
      let m = '';
      const v = (c.value || '').trim();
      if (c.required && !v) m = 'Ce champ est à remplir.';
      else if (v && c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = 'Adresse e-mail à vérifier (exemple : nom@domaine.fr).';
      else if (v && c.type === 'tel' && v.replace(/[^\d]/g, '').length < 9) m = 'Numéro à vérifier (10 chiffres).';
      else if (v && c.type === 'number' && (+v < +(c.min || 0) || +v > +(c.max || 1e9))) m = 'Nombre à vérifier.';
      else if (v && c.type === 'date' && c.min && v < c.min) m = 'Choisissez une date à venir.';
      if (c.id) erreurChamp(c, m);
      if (m && !premier) premier = c;
    });
    if (premier) premier.focus();
    return !premier;
  };
  const aller = (k) => {
    const avant = cadre.offsetHeight;
    etapes.forEach((e) => { e.hidden = +e.dataset.etape !== k; });
    n = k;
    prec.hidden = n === 1; suiv.hidden = n === 4; envoyer.hidden = n !== 4;
    compte.textContent = T.etape.replace('{n}', n);
    reperes.forEach((r) => { const i = +r.dataset.etapeRepere; r.classList.toggle('actif', i === n); r.classList.toggle('fait', i < n); });
    recap();
    if (!etat.calme) {
      const apres = cadre.scrollHeight;
      cadre.style.height = avant + 'px';
      requestAnimationFrame(() => { cadre.style.height = apres + 'px'; });
      setTimeout(() => { cadre.style.height = ''; }, 480);
    }
    const champ = $('input, select, textarea', etapes[n - 1]);
    if (champ) champ.focus({ preventScroll: true });
  };
  suiv.addEventListener('click', () => { if (verifier(etapes[n - 1])) aller(n + 1); });
  prec.addEventListener('click', () => aller(n - 1));
  form.addEventListener('input', recap);
  form.addEventListener('change', recap);
  document.addEventListener('submit', (e) => {
    if (e.target !== form) return;
    if (n < 4) { e.preventDefault(); e.stopImmediatePropagation(); if (verifier(etapes[n - 1])) aller(n + 1); }
  }, true);
  /* Choix depuis les cartes « Toutes vos réceptions » : préremplit le type sans recharger la page. */
  $$('[data-choix-type]').forEach((a) => a.addEventListener('click', (e) => {
    const r = form.querySelector(`[name="type"][value="${a.dataset.choixType}"]`);
    if (!r) return;
    e.preventDefault();
    r.checked = true; if (n !== 1) aller(1); recap();
    try { history.replaceState(null, '', `?type=${a.dataset.choixType}#demande`); } catch {}
    $('#demande').scrollIntoView({ behavior: etat.calme ? 'auto' : 'smooth' });
  }));
  aller(1);
  if (location.hash === '#demande') cadre.style.height = '';
}

/* ---------- visionneuse : ouverte depuis une vignette, flèches, glissement, Échap, lien direct par photo ---------- */
function initVisionneuse() {
  const v = $('[data-visionneuse]');
  if (!v) return;
  /* L'image de la visionneuse n'existe qu'une fois ouverte : aucune image vide dans la page. */
  const img = document.createElement('img'); img.alt = ''; img.dataset.visImage = '';
  const leg = $('[data-vis-legende]', v), cpt = $('[data-vis-compte]', v);
  const cadre = $('[data-vis-cadre]', v);
  let liens = [], i = 0, retour = null;
  const grande = (im) => { const s = (im.getAttribute('srcset') || '').split(',').map((x) => x.trim().split(' ')[0]).filter(Boolean); return s[s.length - 1] || im.currentSrc || im.src; };
  const montrer = (k) => {
    i = (k + liens.length) % liens.length;
    const im = $('img', liens[i]);
    if (!img.isConnected) cadre.prepend(img);
    img.src = grande(im); img.alt = im.alt; leg.textContent = im.alt;
    cpt.textContent = `Photo ${i + 1} sur ${liens.length}`;
    try { history.replaceState(null, '', '#' + liens[i].id); } catch {}
  };
  const ouvrir = (lien) => {
    liens = $$('[data-vis-ouvrir]', lien.closest('section'));
    retour = lien;
    v.hidden = false;
    bloquerDefilement('visionneuse'); suivre(v);
    montrer(liens.indexOf(lien));
    $('[data-vis-fermer]', v).focus();
  };
  const fermer = () => {
    v.hidden = true; img.removeAttribute('src'); img.remove();
    debloquerDefilement('visionneuse'); lacher(v);
    try { history.replaceState(null, '', location.pathname + location.search); } catch {}
    retour && retour.focus({ preventScroll: true });
  };
  document.addEventListener('click', (e) => {
    const l = e.target.closest('[data-vis-ouvrir]');
    if (l) { e.preventDefault(); ouvrir(l); }
  });
  $('[data-vis-fermer]', v).addEventListener('click', fermer);
  $('[data-vis-prec]', v).addEventListener('click', () => montrer(i - 1));
  $('[data-vis-suiv]', v).addEventListener('click', () => montrer(i + 1));
  v.addEventListener('click', (e) => { if (e.target === v) fermer(); });
  v.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); fermer(); }
    else if (e.key === 'ArrowLeft') montrer(i - 1);
    else if (e.key === 'ArrowRight') montrer(i + 1);
    else if (e.key === 'Tab') {
      const f = $$('button', v);
      const a = f.indexOf(document.activeElement);
      if (e.shiftKey && a <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && a === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  let x0 = null;
  v.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  v.addEventListener('pointerup', (e) => { if (x0 !== null && Math.abs(e.clientX - x0) > 50) montrer(i + (e.clientX < x0 ? 1 : -1)); x0 = null; });
  /* Lien direct vers une photo (#photos-3) : elle s'ouvre après l'ouverture de la page. */
  const cible = location.hash && document.getElementById(location.hash.slice(1));
  if (cible && cible.matches('[data-vis-ouvrir]')) window.addEventListener('socle:pret', () => ouvrir(cible), { once: true });
}

/* ---------- vidéo en boucle (pool parties) : chargée à l'approche, en pause hors écran et sur demande ---------- */
function initVideo() {
  $$('[data-video-boucle]').forEach((fig) => {
    const vid = $('video', fig);
    if (!vid || etat.calme) return;
    const lente = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
    if (lente) return;
    let pause = false;
    vid.addEventListener('playing', () => fig.classList.add('lecture'));
    const bouton = document.querySelector(`[data-pause-pour="${vid.id}"]`);
    if (bouton) bouton.addEventListener('click', () => { pause = !pause; if (pause) vid.pause(); else vid.play().catch(() => {}); });
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!vid.src) { vid.src = vid.dataset.src; }
        if (!pause) vid.play().catch(() => {});
      } else vid.pause();
    }, { rootMargin: '200px' }).observe(fig);
  });
}

/* ---------- FAQ : ouverture et fermeture animées ---------- */
function initFaq() {
  $$('.faq-item').forEach((d) => {
    const s = $('summary', d), r = $('.faq-reponse', d);
    if (!s || !r) return;
    s.addEventListener('click', (e) => {
      if (etat.calme || !r.animate) return;
      e.preventDefault();
      if (d.open) {
        const a = r.animate([{ height: r.offsetHeight + 'px' }, { height: '0px' }], { duration: 280, easing: 'ease-out' });
        a.onfinish = () => { d.open = false; };
      } else {
        d.open = true;
        const h = r.offsetHeight;
        r.animate([{ height: '0px' }, { height: h + 'px' }], { duration: 320, easing: 'ease-out' });
      }
    });
  });
}

/* ---------- pause de la surface de l'ouverture ---------- */
function initPauseSurface() {
  const b = $('[data-pause-surface]');
  if (!b) return;
  if (!surface) { b.hidden = true; return; }
  b.addEventListener('click', () => {
    const p = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(p));
    $('[data-libelle-bouton]', b).textContent = p ? b.dataset.libelleLecture : b.dataset.libellePause;
    surface.pause(p);
  });
}

/* ---------- intro ---------- */
let lettres = null;
function preparerTitre() {
  const l1 = $('.hero-l1');
  if (!l1 || !window.SplitText || etat.calme) return;
  try { lettres = new window.SplitText(l1, { type: 'chars', charsClass: 'hero-lettre' }); } catch { lettres = null; }
}

demarrer({
  preparer() {
    const c = $('[data-surface]');
    if (c) surface = monterSurface(c);
    /* La surface se prépare pendant l'attente mais ne s'anime qu'une fois l'ouverture finie :
       l'intro reste légère (et accélérable) même sur un appareil lent, puis l'eau ou la braise prend vie. */
    if (surface && etat.arrivee === 'intro') {
      surface.pause(true);
      quand('pret', () => { const b = $('[data-pause-surface]'); if (!b || b.getAttribute('aria-pressed') !== 'true') { surface.pause(false); surface.intro(1800); } });
    }
    /* L'ouverture attend la surface au plus 450 ms : sinon la photo est déjà là, la surface apparaît en fondu ensuite. */
    Promise.race([Promise.resolve(surface && surface.pret), new Promise((r) => setTimeout(r, 450))]).then(surfacePrete, surfacePrete);
    initSaison(); sceneSaisons(); initBraises(); initArdoise(); initVolets(); initCarte(); initDecompte(); initAgenda();
    initPalmes(); initCadeau(); initReservation(); initEtapes(); initVisionneuse(); initVideo(); initFaq(); initPauseSurface();
    initPanier(); envolDefilement();
    preparerTitre();
  },
  pret,
  /* Intro (environ 2,3 s) : le cercle doré se trace autour du H, le panneau s'ouvre en cercle sur la page,
     « Les Jardins » monte lettre par lettre, « de l'Hacienda » glisse, puis le reste arrive. */
  jouer() {
    if (!gsap) return null;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const p = '.ouverture-panneau';
    tl.set(p, { '--trou': 0 })
      .fromTo('.ouverture-cercle circle', { strokeDashoffset: 1.1 }, { strokeDashoffset: 0, duration: 0.75, ease: 'power2.inOut' }, 0)
      .fromTo('.ouverture-logo', { scale: 1 }, { scale: 1.06, duration: 0.6, ease: 'power2.inOut' }, 0.1)
      .fromTo('.ouverture-ligne, .ouverture-saison', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, 0.22)
      .to('.ouverture-sceau, .ouverture-ligne, .ouverture-saison', { opacity: 0, scale: 0.92, duration: 0.32, ease: 'power2.in' }, 0.82)
      .fromTo(p, { '--trou': 0 }, { '--trou': 160, duration: 1.05, ease: 'power3.inOut' }, 0.78);
    if ($('.hero-l1')) {
      const ch = lettres ? lettres.chars : [$('.hero-l1')];
      tl.set('.hero-l1', { opacity: 1 }, 0)
        .fromTo(ch, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.035 }, 0.95)
        .fromTo('.hero-l2', { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 1.35)
        .fromTo('.hero-surtitre', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 1.3)
        .fromTo('.hero-texte, .hero-actions, .hero-bas', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.09 }, 1.55)
        .fromTo('.entete-rangee', { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 1.7);
    } else if ($('[data-effet="palmes"]')) {
      tl.fromTo('[data-palme="gauche"]', { xPercent: -40 }, { xPercent: 0, duration: 1.2 }, 0.9)
        .fromTo('[data-palme="droite"]', { xPercent: 40, scaleX: -1 }, { xPercent: 0, scaleX: -1, duration: 1.2 }, 0.9);
    }
    return tl;
  },
  etatFinal() {
    if (!gsap) return;
    if (lettres) { try { lettres.revert(); } catch {} lettres = null; }
    gsap.set('.hero-l1, .hero-l2, .hero-surtitre, .hero-texte, .hero-actions, .hero-bas, .entete-rangee', { clearProps: 'transform,opacity' });
  },
  arrivee() {
    if (!gsap || !$('.hero-l1')) return;
    const ch = lettres ? lettres.chars : [$('.hero-l1')];
    gsap.set('.hero-l1', { opacity: 1 });
    gsap.fromTo(ch, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.03, ease: 'power3.out', delay: 0.1 });
    gsap.fromTo('.hero-l2', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, delay: 0.35, ease: 'power3.out' });
    gsap.fromTo('.hero-surtitre, .hero-texte, .hero-actions, .hero-bas', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, delay: 0.4 });
    surface && surface.intro(1600);
  },
});
