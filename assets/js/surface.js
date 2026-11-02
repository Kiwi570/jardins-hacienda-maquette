/* Effet propre « surface » : l'ouverture de l'accueil vue à travers une surface qui ondule.
   Été : reflets d'eau (caustiques) qui dansent sur la photo de la piscine. Hiver : lueur de braise qui monte sur la salle.
   L'onde suit le défilement, et une ride se forme sous la souris ou le doigt, puis se calme (rien ne dérive).
   Règles tenues : densité de pixels limitée (1,25 ordinateur, 1 téléphone), qualité qui baisse seule si les images
   prennent trop de temps, rendu seulement à l'écran, onglet visible, hors mode calme (boucle du socle), bouton pause,
   photo d'origine dessous (repli sans WebGL ou contexte perdu). */
import { boucle, etat } from './socle/index.js?v=2';

const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
const FS = `precision mediump float;
varying vec2 v;
uniform sampler2D tex;
uniform vec2 res, img, pos, souris;
uniform float temps, vit, presse, saison, intro;
vec2 couvrir(vec2 uv){
  float rc = res.x / res.y, ri = img.x / img.y;
  vec2 s = rc > ri ? vec2(1., ri / rc) : vec2(rc / ri, 1.);
  return clamp(uv * s + (1. - s) * pos, .001, .999);
}
float ondes(vec2 p, float t){ return sin(p.x * 1.7 + sin(p.y * 1.3 + t * .4)) * sin(p.y * 1.9 + sin(p.x * 1.1 - t * .3)); }
void main(){
  vec2 uv = vec2(v.x, 1. - v.y);
  float t = temps;
  vec2 asp = vec2(res.x / res.y, 1.);
  float a = .0022 + abs(vit) * .018 + intro * .028;
  uv += vec2(sin(uv.y * 7. + t * .9), cos(uv.x * 6. - t * .7)) * a;
  vec2 dd = (uv - souris) * asp;
  float r = length(dd);
  uv += (dd / (r + .0001)) * sin(r * 42. - t * 5.) * exp(-r * 6.) * presse * .012 / asp;
  vec3 col = texture2D(tex, couvrir(uv)).rgb;
  if (saison > .5) {
    vec2 p = uv * asp * 5.;
    vec2 i = p; float c = 1.;
    for (int n = 0; n < 3; n++) {
      float tt = t * .5 * (1. - (3.5 / float(n + 1)));
      i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
      c += 1. / length(vec2(p.x / (sin(i.x + tt) / .006), p.y / (cos(i.y + tt) / .006)));
    }
    c /= 3.; c = 1.17 - pow(c, 1.4);
    float caus = pow(abs(c), 8.);
    col += vec3(.62, .92, .95) * caus * (.18 + .22 * intro) * smoothstep(.25, 1., uv.y);
  } else {
    vec2 q = uv * asp * vec2(3., 2.) + vec2(0., t * .12);
    float n = (ondes(q * 2., t) * .5 + .5) * (ondes(q * 3.7 + 1.3, t) * .5 + .5);
    float e = smoothstep(.5, .95, n) * smoothstep(.15, 1., uv.y);
    col += vec3(1., .46, .14) * e * (.28 + .3 * intro);
    col *= 1. + .05 * sin(t * 1.3 + uv.x * 3.) * uv.y;
  }
  gl_FragColor = vec4(col, 1.);
}`;

function compiler(gl) {
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  return p;
}

const cadrage = (img) => {
  const parts = getComputedStyle(img).objectPosition.split(/\s+/);
  const f = (x) => (x && x.endsWith('%') ? parseFloat(x) / 100 : 0.5);
  return [f(parts[0]), f(parts[1])];
};

/** @returns {{ pret: Promise, intro(duree:number):void, changerSaison():void, pause(v:boolean):void } | null} */
export function monterSurface(canvas) {
  const hero = canvas.closest('.hero');
  if (!hero || etat.calme) return null;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: false, powerPreference: 'low-power' });
  if (!gl) { canvas.remove(); return null; }
  let prog;
  try { prog = compiler(gl); } catch (err) { console.error('[surface]', err); canvas.remove(); return null; }
  canvas.dataset.souris = '';
  const tactile = matchMedia('(pointer: coarse)').matches;
  let dprMax = Math.min(window.devicePixelRatio || 1, tactile ? 1 : 1.25), echelle = 1;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const lieu = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(lieu);
  gl.vertexAttribPointer(lieu, 2, gl.FLOAT, false, 0, 0);
  const U = Object.fromEntries(['res', 'img', 'pos', 'souris', 'temps', 'vit', 'presse', 'saison', 'intro'].map((n) => [n, gl.getUniformLocation(prog, n)]));
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  ['TEXTURE_WRAP_S', 'TEXTURE_WRAP_T'].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, gl[k], gl.CLAMP_TO_EDGE));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const s = { pret: false, w: 1, h: 1, iw: 1, ih: 1, pos: [0.5, 0.5], vit: 0, presse: 0, mx: 0.5, my: 0.5, y: window.scrollY, t: 0, intro: 0, introDebut: 0, introDuree: 0, lent: 0 };
  const imageCourante = () => {
    const saison = document.documentElement.dataset.saison === 'ete' ? 'ete' : 'hiver';
    return hero.querySelector(`[data-hero-photo][data-saison-seul="${saison}"] img`);
  };
  let source = '';
  const charger = async (img) => {
    if (!img) return;
    if (!img.complete || !img.naturalWidth) { await new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); }); }
    if (!img.naturalWidth || img.currentSrc === source) return;
    try { await img.decode(); } catch {}
    source = img.currentSrc;
    try {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      s.iw = img.naturalWidth; s.ih = img.naturalHeight; s.pos = cadrage(img); s.pret = true;
      canvas.classList.add('surface-prete');
    } catch (err) { console.error('[surface] texture', err); }
  };

  const mesurer = () => {
    s.w = canvas.clientWidth || 1; s.h = canvas.clientHeight || 1;
    const dpr = dprMax * echelle;
    canvas.width = Math.max(1, Math.round(s.w * dpr)); canvas.height = Math.max(1, Math.round(s.h * dpr));
    const img = imageCourante(); if (img) s.pos = cadrage(img);
  };
  new ResizeObserver(mesurer).observe(canvas);
  mesurer();

  /* Ride sous la souris (ordinateur) ou le doigt (tactile) : mesure seulement au mouvement, jamais pendant le défilement. */
  let raf = 0, dernier = null;
  const viser = (x, y) => {
    dernier = [x, y];
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const r = canvas.getBoundingClientRect();
      s.mx = (dernier[0] - r.left) / r.width; s.my = (dernier[1] - r.top) / r.height; s.presse = 1;
    });
  };
  hero.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') viser(e.clientX, e.clientY); });
  hero.addEventListener('touchstart', (e) => { const t = e.touches[0]; if (t) viser(t.clientX, t.clientY); }, { passive: true });

  canvas.addEventListener('webglcontextlost', () => { canvas.remove(); ctl.arreter(); });
  const saisonVal = () => (document.documentElement.dataset.saison === 'ete' ? 1 : 0);
  let cumul = 0, images = 0;
  const ctl = boucle(canvas, (_dt, t) => {
    if (!s.pret) return;
    const dt = s.t ? t - s.t : 0;
    s.t = t;
    const y = window.scrollY;
    const v = dt > 0 && dt < 0.12 ? (y - s.y) / dt : 0;
    s.y = y;
    s.vit += (Math.max(-1, Math.min(1, v / 2400)) - s.vit) * Math.min(1, dt * 5);
    s.presse += (0 - s.presse) * Math.min(1, dt * 1.6);
    if (s.introDuree) {
      const p = Math.min(1, (performance.now() - s.introDebut) / s.introDuree);
      s.intro = 1 - p * p * (3 - 2 * p);
      if (p >= 1) { s.introDuree = 0; s.intro = 0; }
    }
    /* Qualité adaptée : si les images prennent plus de 24 ms en moyenne, la résolution baisse. */
    if (dt > 0 && dt < 0.2) { cumul += dt; images++; }
    if (images >= 40) {
      const moy = cumul / images; cumul = 0; images = 0;
      if (moy > 0.024 && echelle > 0.6) { echelle = Math.max(0.6, echelle - 0.2); mesurer(); }
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U.res, s.w, s.h);
    gl.uniform2f(U.img, s.iw, s.ih);
    gl.uniform2f(U.pos, s.pos[0], s.pos[1]);
    gl.uniform2f(U.souris, s.mx, s.my);
    gl.uniform1f(U.temps, t % 628.3);
    gl.uniform1f(U.vit, s.vit);
    gl.uniform1f(U.presse, s.presse);
    gl.uniform1f(U.saison, saisonVal());
    gl.uniform1f(U.intro, s.intro);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, { lourde: true });

  return {
    pret: charger(imageCourante()),
    intro(duree = 2200) { s.introDebut = performance.now(); s.introDuree = duree; s.intro = 1; },
    changerSaison() { canvas.classList.remove('surface-prete'); s.pret = false; source = ''; charger(imageCourante()); },
    pause(v) { ctl.pause(v); },
  };
}
