/* Image de partage 1200×630 de chaque page (photo du client, logo, accroche, polices et couleurs du site).
   outils/images-partage.mjs photographie ces pages et écrit assets/partage/<page>-<langue>.jpg. */
import { html, brut } from '../../outils/gabarit.mjs';

export function page(c) {
  const cle = c.page.cle;
  const image = c.page.imagePartage || c.site.imagePartage;
  return html`<!doctype html>
<html lang="${c.l}"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/css/socle.css"><link rel="stylesheet" href="/assets/css/site.css">
<style>${brut(`:root{--fond:${c.site.couleurs.fond};--texte:${c.site.couleurs.texte}}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:var(--fond);color:var(--texte)}
.carte{display:grid;grid-template-columns:1fr 1fr;width:1200px;height:630px}
.carte-texte{display:flex;flex-direction:column;justify-content:space-between;padding:64px}
.carte-texte img{width:84px;height:84px;object-fit:contain}
.carte-texte{border-right:6px solid #a93f1a}
.carte-titre{font-family:var(--police-titres);font-size:64px;line-height:1.02;margin:0;text-wrap:balance}
.carte-nom{font-family:var(--police-titres);font-size:30px;font-weight:600;margin:0}
.carte-ligne{font-size:19px;font-weight:600;margin:6px 0 0;opacity:.75}
.carte-image{background:center/cover no-repeat}`)}</style>
</head><body>
<div class="carte">
  <div class="carte-texte">
    <img src="/assets/images/logo-hacienda-192.png" alt="">
    <p class="carte-titre">${c.t(`pages.${cle}.accroche`)}</p>
    <div><p class="carte-nom">${c.site.nom}</p><p class="carte-ligne">${c.t('commun.introLigne')}</p></div>
  </div>
  <div class="carte-image" style="background-image:url('/assets/images/${image}')"></div>
</div>
</body></html>`;
}
