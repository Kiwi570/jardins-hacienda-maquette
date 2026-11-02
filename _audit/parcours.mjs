/* Parcours propres aux Jardins de l'Hacienda : panier des fêtes (total, deux onglets, donnée abîmée, envoi simulé),
   demande de réception en étapes, réservation préremplie et journée festive limitée à sa saison, carte cadeau (total), compte à rebours, agenda trié,
   visionneuse (Échap, focus rendu), interrupteur de saison. */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  /* 1. Panier : total = somme des lignes, synchronisé entre deux onglets, donnée abîmée nettoyée. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/a-emporter', { waitUntil: 'load' });
      await attendrePret(page);
      await page.evaluate(() => { try { localStorage.removeItem('hacienda:panier'); } catch {} });
      await page.reload({ waitUntil: 'load' }); await attendrePret(page);
      await page.locator('[data-ajouter="tourte-escargots"]').click();
      await page.locator('[data-ajouter="tourte-escargots"]').click();
      await page.locator('[data-ajouter="pate-lorrain"]').click();
      await attendre(300);
      const { attendu, affiche } = await page.evaluate(() => {
        const p = window.__panier.lire();
        const prix = Object.fromEntries([...document.querySelectorAll('[data-produit]')].map((li) => [li.dataset.produit, +li.dataset.prixUnitaire]));
        const attendu = Object.entries(p.lignes).reduce((s, [k, q]) => s + prix[k] * q, 0);
        const affiche = parseFloat(document.querySelector('[data-panier-total]').textContent.replace(/[^\d,]/g, '').replace(',', '.'));
        return { attendu, affiche };
      });
      if (Math.abs(attendu - affiche) > 0.005 || attendu !== 2 * 32 + 28) R.echec('panier', `total affiché ${affiche} au lieu de ${attendu} (attendu 92)`, { page: '/a-emporter', taille: '390×844' });
      const autre = await ctx.newPage();
      await autre.goto(BASE + '/a-emporter', { waitUntil: 'load' }); await attendrePret(autre);
      await page.locator('[data-ajouter="escargots"]').click(); await attendre(400);
      const total2 = await autre.evaluate(() => document.querySelector('[data-panier-total]').textContent);
      if (!/110/.test(total2)) R.echec('panier', `le second onglet affiche ${total2} au lieu de 110 €`, { page: '/a-emporter' });
      /* Envoi sans jour : refusé, avec un message. */
      await page.evaluate(() => document.getElementById('commande').scrollIntoView());
      await page.fill('#c-prenom', 'Test'); await page.fill('#c-nom', 'Maquette'); await page.fill('#c-tel', '0612345678'); await page.fill('#c-email', 'test@exemple.fr');
      await page.locator('.commande-form [type="submit"]').click(); await attendre(200);
      if (await page.locator('[data-erreur-jour]').isHidden()) R.echec('panier', 'une commande sans jour de retrait n’affiche pas d’erreur', { page: '/a-emporter' });
      const jour = page.locator('[data-jour]:not(:disabled)').first();
      if (await jour.count()) {
        await jour.check({ force: true });
        await page.locator('.commande-form [type="submit"]').click(); await attendre(300);
        const ok = await page.evaluate(() => !document.querySelector('.commande-form [data-message-envoi]').hidden);
        const vide = await page.evaluate(() => Object.keys(window.__panier.lire().lignes).length === 0);
        if (!ok) R.echec('panier', 'la commande complète n’affiche pas le message simulé', { page: '/a-emporter' });
        if (!vide) R.echec('panier', 'le panier n’est pas vidé après la commande simulée', { page: '/a-emporter' });
      }
      await page.evaluate(() => localStorage.setItem('hacienda:panier', '{abîmé'));
      await page.reload({ waitUntil: 'load' });
      if ((await attendrePret(page)) === 'jamais-pret') R.echec('panier', 'une donnée abîmée bloque le site', { page: '/a-emporter' });
      await autre.close();
    } finally { await ctx.close(); }
  }

  /* 2. Demande de réception : on ne passe pas l'étape 2 sans nombre d'invités ; le récapitulatif suit. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/mariages?type=anniversaire#demande', { waitUntil: 'load' });
      await attendrePret(page);
      const type = await page.evaluate(() => (document.querySelector('[name="type"]:checked') || {}).value);
      if (type !== 'anniversaire') R.echec('reception', `le type n’est pas prérempli par l’adresse (${type})`, { page: '/mariages' });
      await page.locator('[data-etape-suiv]').click(); await attendre(500);
      await page.locator('[data-etape-suiv]').click(); await attendre(300);
      const etape = await page.evaluate(() => [...document.querySelectorAll('[data-etape]')].find((e) => !e.hidden)?.dataset.etape);
      if (etape !== '2') R.echec('reception', `l’étape 2 a été passée sans nombre d’invités (étape ${etape})`, { page: '/mariages' });
      await page.fill('#m-invites', '80'); await attendre(200);
      const recap = await page.locator('[data-recap-champ="invites"]').textContent();
      if (!/80/.test(recap || '')) R.echec('reception', 'le récapitulatif ne suit pas la saisie', { page: '/mariages' });
    } finally { await ctx.close(); }
  }

  /* 3. Réservation préremplie depuis la Saint-Sylvestre ; carte cadeau : total = montant × quantité. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/reserver?sujet=evenement&evenement=saint-sylvestre#formulaire', { waitUntil: 'load' });
      await attendrePret(page);
      const r = await page.evaluate(() => ({ sujet: (document.querySelector('[name="sujet"]:checked') || {}).value, evt: document.querySelector('#r-evenement')?.value, visible: !document.querySelector('[data-si-sujet="evenement"]').hidden }));
      if (r.sujet !== 'evenement' || r.evt !== 'saint-sylvestre' || !r.visible) R.echec('reservation', `préremplissage incomplet : ${JSON.stringify(r)}`, { page: '/reserver' });
      /* Journée festive : une date hors des mardis, mercredis et jeudis de juin à septembre est refusée. */
      await page.goto(BASE + '/reserver?sujet=journee#formulaire', { waitUntil: 'load' });
      await attendrePret(page);
      await page.fill('#r-date', '2027-01-05');
      for (const [id, v] of [['#r-prenom', 'Test'], ['#r-nom', 'Maquette'], ['#r-email', 'test@exemple.fr'], ['#r-tel', '0612345678']]) await page.fill(id, v);
      await page.locator('.reservation-form [type="submit"]').click(); await attendre(300);
      const refus = await page.evaluate(() => document.querySelector('#r-date').getAttribute('aria-invalid') === 'true');
      if (!refus) R.echec('reservation', 'une journée festive en janvier est acceptée', { page: '/reserver' });
      await page.goto(BASE + '/carte-cadeau', { waitUntil: 'load' });
      await attendrePret(page);
      await page.locator('[name="montant"][value="100"]').check({ force: true });
      await page.selectOption('#g-qte', '3'); await attendre(300);
      const t = await page.locator('[data-cadeau-total]').textContent();
      if (!/^300/.test((t || '').trim())) R.echec('cadeau', `total ${t} au lieu de 300 €`, { page: '/carte-cadeau' });
    } finally { await ctx.close(); }
  }

  /* 4. Compte à rebours qui avance, visionneuse (Échap, focus rendu), interrupteur de saison sans rechargement. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/agenda/saint-sylvestre', { waitUntil: 'load' });
      await attendrePret(page);
      /* Les boucles ne tournent qu'à l'écran : le compte à rebours est amené au centre avant la lecture. */
      await page.evaluate(() => document.querySelector('[data-decompte]').scrollIntoView({ block: 'center' })); await attendre(400);
      const lire = () => page.evaluate(() => [...document.querySelectorAll('[data-decompte] [data-unite="secondes"] .chiffre-bande')].map((b) => b.style.getPropertyValue('--n')).join(''));
      const a = await lire(); await attendre(2200); const b = await lire();
      if (a === b) R.regarder('decompte', 'les secondes du compte à rebours ne changent pas (mode calme ou date passée ?)', { page: '/agenda/saint-sylvestre' });
      await page.goto(BASE + '/terrasse-piscine', { waitUntil: 'load' });
      await attendrePret(page);
      const vignette = page.locator('[data-vis-ouvrir]').first();
      await vignette.scrollIntoViewIfNeeded(); await vignette.click(); await attendre(300);
      if (await page.locator('[data-visionneuse]').isHidden()) R.echec('visionneuse', 'la visionneuse ne s’ouvre pas', { page: '/terrasse-piscine' });
      await page.keyboard.press('ArrowRight'); await attendre(150);
      await page.keyboard.press('Escape'); await attendre(200);
      const ferme = await page.locator('[data-visionneuse]').isHidden();
      const focus = await page.evaluate(() => document.activeElement && document.activeElement.matches('[data-vis-ouvrir]'));
      if (!ferme) R.echec('visionneuse', 'Échap ne ferme pas la visionneuse', { page: '/terrasse-piscine' });
      if (!focus) R.echec('visionneuse', 'le focus ne revient pas sur la vignette', { page: '/terrasse-piscine' });
      await page.goto(BASE + '/', { waitUntil: 'load' });
      await attendrePret(page);
      const avant = await page.evaluate(() => document.documentElement.dataset.saison);
      await page.locator('.bascule-saison--hero').click(); await attendre(1600);
      const apres = await page.evaluate(() => document.documentElement.dataset.saison);
      if (avant === apres) R.echec('saison', 'l’interrupteur ne change pas la saison', { page: '/' });
      const voile = await page.evaluate(() => !!document.querySelector('.bascule-voile'));
      if (voile) R.echec('saison', 'le rideau de la bascule reste à l’écran', { page: '/' });
    } finally { await ctx.close(); }
  }
}
