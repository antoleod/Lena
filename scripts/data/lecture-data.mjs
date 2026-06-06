// Authored reading-comprehension content for the exam library.
// Each story keeps its `pages` (the text the child reads) and a `questionPool`
// tagged by difficulty: 'easy' | 'medium' | 'hard'.
// The generator derives the 3 exam levels (facile/moyen/difficile) from these.
//
// Pool authoring rule (so every level has enough questions):
//   >= 6 'easy', >= 4 'medium' (literal+light inference), >= 4 'hard'
//   (inference / vocabulary / fill_blank).

const mc = (prompt, options, answer, correction, pageRef) => ({
  type: 'mcq', prompt, options, answer, correction, pageRef,
});
const tf = (prompt, answer, correction, pageRef) => ({
  type: 'true_false', prompt, answer, correction, pageRef,
});
const fb = (prompt, answer, correction, pageRef) => ({
  type: 'fill_blank', prompt, answer, correction, pageRef,
});

export const LECTURE_DATA = [
  // 1 ── Anniversaire ────────────────────────────────────────────────────────
  {
    title: "L'anniversaire de Léo", emoji: '🎂',
    pages: [
      { text: "Ce matin, Léo se réveille tout content. Aujourd'hui, c'est son anniversaire ! Il part à l'école avec un petit sac bleu serré contre lui.", keywords: ['matin', 'anniversaire', 'école', 'sac', 'bleu'] },
      { text: "Sur le chemin, Léo croise son ami Hugo. « Qu'est-ce que tu caches dans ton sac ? » demande Hugo, curieux. Léo sourit mais ne dit rien.", keywords: ['chemin', 'Hugo', 'sac'] },
      { text: "Dans la classe, Léo ouvre enfin son sac bleu. À l'intérieur, il y a un grand gâteau au chocolat préparé par sa maman.", keywords: ['classe', 'gâteau', 'chocolat', 'maman'] },
      { text: "« Je veux partager mon gâteau avec tous mes amis ! » dit Léo très fort. Toute la classe applaudit de joie.", keywords: ['partager', 'amis', 'classe'] },
      { text: "La maîtresse prend un grand couteau. Elle coupe doucement le gâteau en huit parts égales, une pour chaque enfant de la table.", keywords: ['maîtresse', 'couteau', 'huit', 'parts'] },
      { text: "Chacun reçoit sa part. Le chocolat est moelleux et sucré. Hugo se lèche les doigts en riant.", keywords: ['part', 'chocolat', 'Hugo'] },
      { text: "Pour finir, toute la classe se lève et chante très fort : « Joyeux anniversaire, Léo ! » Léo est le plus heureux des enfants.", keywords: ['classe', 'chante', 'anniversaire', 'heureux'] },
    ],
    questionPool: [
      { tag: 'easy', ...mc('Où arrive Léo ?', ["À l'école", 'Au parc', 'À la piscine'], "À l'école", "Page 1 : Léo arrive à l'école.", 'p1') },
      { tag: 'easy', ...mc('De quelle couleur est le sac ?', ['Bleu', 'Rouge', 'Vert'], 'Bleu', 'Page 1 : un petit sac bleu.', 'p1') },
      { tag: 'easy', ...mc("Qu'y a-t-il dans le sac ?", ['Un gâteau', 'Un ballon', 'Un livre'], 'Un gâteau', 'Page 2 : il y a un gâteau.', 'p2') },
      { tag: 'easy', ...tf('Le gâteau est au chocolat.', true, 'Page 2 : le gâteau est au chocolat.', 'p2') },
      { tag: 'easy', ...mc('Avec qui Léo veut-il partager ?', ['Ses amis', 'Son chien', 'Le facteur'], 'Ses amis', 'Page 3 : partager avec ses amis.', 'p3') },
      { tag: 'easy', ...mc('En combien de parts coupe-t-elle le gâteau ?', ['Huit', 'Cinq', 'Dix'], 'Huit', 'Page 4 : huit parts.', 'p4') },
      { tag: 'medium', ...tf('La classe chante pour Léo.', true, 'Page 5 : toute la classe chante.', 'p5') },
      { tag: 'medium', ...mc('Pourquoi la classe chante-t-elle ?', ["C'est l'anniversaire de Léo", "C'est la récréation", 'Il pleut'], "C'est l'anniversaire de Léo", "Page 5 : joyeux anniversaire Léo !", 'p5') },
      { tag: 'medium', ...mc('Qui coupe le gâteau ?', ['La maîtresse', 'Léo', 'La maman'], 'La maîtresse', 'Page 4 : la maîtresse coupe le gâteau.', 'p4') },
      { tag: 'medium', ...tf('Léo garde tout le gâteau pour lui.', false, 'Page 3 : il veut partager.', 'p3') },
      { tag: 'hard', ...mc('Que ressent Léo, à ton avis ?', ['Il est content', 'Il est fâché', 'Il a peur'], 'Il est content', "C'est son anniversaire et il partage : il est content.", 'p5') },
      { tag: 'hard', ...fb('Le gâteau est au ___ .', 'chocolat', 'Page 2 : un gâteau au chocolat.', 'p2') },
      { tag: 'hard', ...mc('Le mot « partager » veut dire :', ['Donner une part à chacun', 'Tout garder', 'Jeter'], 'Donner une part à chacun', 'Partager = donner une part aux autres.', 'p3') },
      { tag: 'hard', ...tf('Léo arrive à l’école le matin.', true, 'Page 1 : ce matin, Léo arrive.', 'p1') },
    ],
  },

  // 2 ── École ────────────────────────────────────────────────────────────────
  {
    title: 'Le cartable oublié', emoji: '🎒',
    pages: [
      { text: "Ce matin, le réveil sonne très tôt. Emma se lève vite, avale son bol de lait et se dépêche pour ne pas être en retard à l'école.", keywords: ['matin', 'Emma', 'tôt', 'école'] },
      { text: "Elle court si vite qu'elle ne regarde même pas sur la table de l'entrée. La porte claque derrière elle.", keywords: ['court', 'table', 'porte'] },
      { text: "Arrivée en classe, Emma veut sortir ses cahiers. Mais quand elle ouvre son cartable… il est complètement vide !", keywords: ['classe', 'cartable', 'vide'] },
      { text: "Emma devient toute triste. Elle comprend qu'elle a oublié son vrai cartable à la maison, sur la table de l'entrée.", keywords: ['triste', 'oublié', 'maison'] },
      { text: "Soudain, on frappe à la porte de la classe. C'est sa maman, essoufflée, qui tient le cartable dans ses bras. Elle sourit gentiment à Emma.", keywords: ['porte', 'maman', 'cartable', 'sourit'] },
      { text: "« Merci beaucoup, maman ! » dit Emma, soulagée. Toute la classe applaudit la maman d'Emma.", keywords: ['merci', 'maman', 'applaudit'] },
      { text: "Emma ouvre enfin son cartable et sort ses crayons de couleur. Elle est contente et prête à travailler.", keywords: ['crayons', 'contente'] },
    ],
    questionPool: [
      { tag: 'easy', ...mc('Que fait Emma le matin ?', ['Elle se dépêche', 'Elle dort', 'Elle joue'], 'Elle se dépêche', 'Page 1 : elle se dépêche.', 'p1') },
      { tag: 'easy', ...tf("Le cartable d'Emma est vide.", true, 'Page 2 : son cartable est vide.', 'p2') },
      { tag: 'easy', ...mc('Comment se sent Emma quand son cartable est vide ?', ['Triste', 'Joyeuse', 'Fâchée'], 'Triste', 'Page 3 : Emma est triste.', 'p3') },
      { tag: 'easy', ...mc("Où Emma a-t-elle oublié son cartable ?", ['À la maison', 'Dans le bus', 'Au parc'], 'À la maison', 'Page 3 : oublié à la maison.', 'p3') },
      { tag: 'easy', ...mc('Qui apporte le cartable ?', ['Sa maman', 'Son papa', 'La maîtresse'], 'Sa maman', 'Page 4 : sa maman arrive.', 'p4') },
      { tag: 'easy', ...tf('La classe applaudit Emma.', true, 'Page 5 : la classe applaudit.', 'p5') },
      { tag: 'medium', ...mc('Que sort Emma de son cartable ?', ['Ses crayons', 'Son goûter', 'Un livre'], 'Ses crayons', 'Page 6 : elle sort ses crayons.', 'p6') },
      { tag: 'medium', ...tf('Emma se lève tard.', false, 'Page 1 : Emma se lève tôt.', 'p1') },
      { tag: 'medium', ...mc('Que dit Emma à sa maman ?', ['Merci', 'Au revoir', 'Pardon'], 'Merci', 'Page 5 : Emma dit merci.', 'p5') },
      { tag: 'medium', ...mc('Comment se sent Emma à la fin ?', ['Contente', 'Triste', 'En colère'], 'Contente', 'Page 6 : elle est contente.', 'p6') },
      { tag: 'hard', ...mc('Pourquoi la maman sourit-elle ?', ["Elle a aidé Emma", 'Elle est fâchée', 'Elle a froid'], 'Elle a aidé Emma', 'Elle apporte le cartable oublié : elle aide Emma.', 'p4') },
      { tag: 'hard', ...fb('Emma a ___ son cartable à la maison.', 'oublié', 'Page 3 : elle a oublié son cartable.', 'p3') },
      { tag: 'hard', ...mc('Le mot « vide » est le contraire de :', ['Plein', 'Petit', 'Lourd'], 'Plein', 'Vide ↔ plein.', 'p2') },
      { tag: 'hard', ...tf('Emma reste triste jusqu’à la fin.', false, 'Page 6 : elle redevient contente.', 'p6') },
    ],
  },

  // 3 ── Amitié (goûter partagé) ──────────────────────────────────────────────
  {
    title: 'Le goûter partagé', emoji: '🍪',
    pages: [
      { text: "À dix heures, la cloche sonne la récréation. Tom sort dans la cour avec un grand sac rempli de biscuits dorés.", keywords: ['récréation', 'cour', 'Tom', 'biscuits'] },
      { text: "Tom s'assoit sur un banc. Il regarde le sac : il y a vraiment trop de biscuits pour lui tout seul. Pendant ce temps, ses amis jouent au ballon.", keywords: ['banc', 'trop', 'biscuits', 'amis'] },
      { text: "Tom réfléchit un instant, puis il a une idée. Il appelle Lola, Hugo et Mia : « Venez, j'ai des biscuits pour tout le monde ! »", keywords: ['idée', 'Lola', 'Hugo', 'Mia'] },
      { text: "Les trois amis arrivent en courant. Ils sont très contents et disent tous « merci » à Tom.", keywords: ['amis', 'contents', 'merci'] },
      { text: "Ils s'assoient ensemble sous le grand arbre de la cour et mangent les biscuits en discutant et en riant.", keywords: ['arbre', 'mangent', 'rient'] },
      { text: "De loin, la maîtresse voit toute la scène. Elle sourit et pense tout bas : « Partager, c'est beau ! »", keywords: ['maîtresse', 'sourit', 'partager'] },
    ],
    questionPool: [
      { tag: 'easy', ...mc('Quand arrive Tom avec ses biscuits ?', ['À la récréation', 'Au déjeuner', 'Le matin'], 'À la récréation', 'Page 1 : à la récréation.', 'p1') },
      { tag: 'easy', ...mc('Que ramène Tom ?', ['Des biscuits', 'Des bonbons', 'Des pommes'], 'Des biscuits', 'Page 1 : un sac de biscuits.', 'p1') },
      { tag: 'easy', ...tf('Tom a trop de biscuits pour lui seul.', true, 'Page 2 : trop de biscuits pour lui tout seul.', 'p2') },
      { tag: 'easy', ...mc("Combien d'amis Tom appelle-t-il ?", ['Trois', 'Deux', 'Quatre'], 'Trois', 'Page 3 : Lola, Hugo et Mia.', 'p3') },
      { tag: 'easy', ...mc('Que disent les amis à Tom ?', ['Merci', 'Pardon', 'Bravo'], 'Merci', 'Page 4 : ils disent merci.', 'p4') },
      { tag: 'easy', ...mc("Où s'assoient-ils pour manger ?", ["Sous l'arbre", 'En classe', 'Sur les marches'], "Sous l'arbre", "Page 5 : sous l'arbre.", 'p5') },
      { tag: 'medium', ...tf('La maîtresse est fâchée.', false, 'Page 6 : la maîtresse sourit.', 'p6') },
      { tag: 'medium', ...mc('Que dit la maîtresse ?', ["Partager, c'est beau !", 'Allez en classe !', 'Bravo Tom !'], "Partager, c'est beau !", 'Page 6.', 'p6') },
      { tag: 'medium', ...mc('Comment sont les amis quand Tom propose les biscuits ?', ['Très contents', 'Tristes', 'Fatigués'], 'Très contents', 'Page 4 : très contents.', 'p4') },
      { tag: 'medium', ...tf('Tom mange tous les biscuits seul.', false, 'Page 3-5 : il partage.', 'p3') },
      { tag: 'hard', ...mc('Pourquoi Tom partage-t-il ?', ['Il en a trop pour lui seul', 'Il n’aime pas les biscuits', 'On le lui demande'], 'Il en a trop pour lui seul', 'Page 2 : trop pour lui tout seul.', 'p2') },
      { tag: 'hard', ...fb('Les amis disent ___ à Tom.', 'merci', 'Page 4 : ils disent merci.', 'p4') },
      { tag: 'hard', ...mc('« Partager » veut dire :', ['Donner aux autres', 'Cacher', 'Vendre'], 'Donner aux autres', 'Partager = donner une part.', 'p6') },
      { tag: 'hard', ...tf('Cette histoire parle de l’amitié.', true, 'Tom partage avec ses amis.', 'p6') },
    ],
  },

  // 4 ── Animaux (chat perdu) ─────────────────────────────────────────────────
  {
    title: 'Le petit chat perdu', emoji: '🐱',
    pages: [
      { text: "Sur le chemin de l'école, Nina aperçoit une petite boule de poils au coin de la rue. C'est un petit chat tout blanc, assis tout seul.", keywords: ['chemin', 'Nina', 'chat', 'blanc'] },
      { text: "Le chat miaule doucement. Ses grands yeux sont tristes : il a l'air perdu et un peu effrayé.", keywords: ['miaule', 'perdu', 'effrayé'] },
      { text: "Nina s'accroupit tout près de lui et lui tend la main, sans faire de bruit. Le chat s'approche et vient la sentir.", keywords: ['accroupit', 'main', 'sentir'] },
      { text: "Autour du cou du chat, il y a un petit collier rouge. Nina lit l'étiquette : « Je m'appelle Caramel, j'habite rue des Roses. »", keywords: ['collier', 'Caramel', 'rue des Roses'] },
      { text: "Nina prend doucement Caramel dans ses bras et marche jusqu'à la rue des Roses. Devant la maison, elle sonne et une dame ouvre la porte.", keywords: ['bras', 'maison', 'dame', 'porte'] },
      { text: "« Caramel ! Je te cherchais partout ! » s'écrie la dame. Elle remercie Nina mille fois. Dans ses bras, Caramel ronronne de bonheur.", keywords: ['remercie', 'Nina', 'ronronne', 'bonheur'] },
    ],
    questionPool: [
      { tag: 'easy', ...mc('Où Nina voit-elle le chat ?', ["Sur le chemin de l'école", 'Dans le jardin', 'En classe'], "Sur le chemin de l'école", 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('De quelle couleur est le chat ?', ['Blanc', 'Noir', 'Roux'], 'Blanc', 'Page 1 : un petit chat blanc.', 'p1') },
      { tag: 'easy', ...mc('Que fait le chat ?', ['Il miaule', 'Il aboie', 'Il chante'], 'Il miaule', 'Page 2 : le chat miaule.', 'p2') },
      { tag: 'easy', ...tf("Le chat s'appelle Caramel.", true, 'Page 4 : il s’appelle Caramel.', 'p4') },
      { tag: 'easy', ...mc('Où habite le chat ?', ['Rue des Roses', 'Rue du Moulin', 'Avenue des Lilas'], 'Rue des Roses', 'Page 4.', 'p4') },
      { tag: 'easy', ...mc('Qui ouvre la porte ?', ['Une dame', 'Un garçon', 'La maîtresse'], 'Une dame', 'Page 5 : une dame ouvre.', 'p5') },
      { tag: 'medium', ...tf('La dame est fâchée contre Nina.', false, 'Page 6 : elle remercie Nina.', 'p6') },
      { tag: 'medium', ...mc('Comment Caramel montre-t-il son bonheur ?', ['Il ronronne', 'Il miaule fort', 'Il saute'], 'Il ronronne', 'Page 6 : il ronronne.', 'p6') },
      { tag: 'medium', ...mc('Comment Nina trouve-t-elle l’adresse du chat ?', ['Sur le collier', 'Sur internet', 'Une amie lui dit'], 'Sur le collier', 'Page 4 : Nina lit le collier.', 'p4') },
      { tag: 'medium', ...tf('Le chat a l’air perdu.', true, 'Page 2 : il a l’air perdu.', 'p2') },
      { tag: 'hard', ...mc('Pourquoi Nina ramène-t-elle le chat ?', ['Pour aider le chat perdu', 'Pour le garder', 'Pour jouer'], 'Pour aider le chat perdu', 'Elle fait une bonne action.', 'p5') },
      { tag: 'hard', ...fb('Caramel ___ de bonheur.', 'ronronne', 'Page 6.', 'p6') },
      { tag: 'hard', ...mc('« Perdu » veut dire :', ['Qui ne retrouve pas son chemin', 'Très content', 'Endormi'], 'Qui ne retrouve pas son chemin', 'Perdu = qui ne sait plus où aller.', 'p2') },
      { tag: 'hard', ...tf('Nina aide un animal dans cette histoire.', true, 'Elle aide le chat Caramel.', 'p6') },
    ],
  },

  // 5 ── Parc ─────────────────────────────────────────────────────────────────
  {
    title: 'La sortie au parc', emoji: '🌳',
    pages: [
      { text: "Aujourd'hui est un jour spécial : toute la classe part en sortie au grand parc de la ville. Dès le matin, tout le monde est content et impatient !", keywords: ['sortie', 'classe', 'parc', 'content'] },
      { text: "Avant de partir, le maître distribue à chaque enfant une casquette rouge. « Comme ça, je vous verrai bien et personne ne se perdra », explique-t-il.", keywords: ['maître', 'casquettes', 'rouges', 'perdra'] },
      { text: "Arrivés au parc, les enfants courent vers les jeux. Ils glissent sur les toboggans et montent très haut sur les balançoires.", keywords: ['jeux', 'toboggans', 'balançoires'] },
      { text: "Quand le soleil est haut, à midi, le maître appelle tout le monde. Les enfants s'assoient en cercle sur l'herbe fraîche pour le pique-nique.", keywords: ['midi', 'herbe', 'pique-nique'] },
      { text: "Dans les paniers, il y a des sandwichs au fromage, des fruits bien mûrs et des jus de pomme frais. Tout le monde se régale.", keywords: ['sandwichs', 'fruits', 'jus de pomme'] },
      { text: "L'après-midi passe vite. Sur le chemin du retour vers l'école, fatigués mais joyeux, les enfants chantent une chanson tous ensemble.", keywords: ['retour', 'fatigués', 'chantent', 'chanson'] },
    ],
    questionPool: [
      { tag: 'easy', ...mc('Où va la classe ?', ['Au parc', 'À la piscine', 'Au musée'], 'Au parc', 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('De quelle couleur sont les casquettes ?', ['Rouges', 'Bleues', 'Jaunes'], 'Rouges', 'Page 2.', 'p2') },
      { tag: 'easy', ...tf('Les enfants jouent sur des toboggans.', true, 'Page 3.', 'p3') },
      { tag: 'easy', ...mc('Quand mangent-ils ?', ['À midi', 'Le matin', 'Le soir'], 'À midi', 'Page 4.', 'p4') },
      { tag: 'easy', ...mc("Qu'y a-t-il à boire ?", ['Du jus de pomme', 'Du lait', 'De la limonade'], 'Du jus de pomme', 'Page 5.', 'p5') },
      { tag: 'easy', ...mc('Qui distribue les casquettes ?', ['Le maître', 'La maman', 'Le directeur'], 'Le maître', 'Page 2.', 'p2') },
      { tag: 'medium', ...tf('Les enfants pleurent au retour.', false, 'Page 6 : ils chantent.', 'p6') },
      { tag: 'medium', ...mc('Pourquoi des casquettes rouges ?', ['Pour ne pas se perdre', 'Pour avoir chaud', 'Pour jouer'], 'Pour ne pas se perdre', 'Page 2.', 'p2') },
      { tag: 'medium', ...mc('Que mangent-ils au pique-nique ?', ['Des sandwichs et des fruits', 'Des pizzas', 'Des frites'], 'Des sandwichs et des fruits', 'Page 5.', 'p5') },
      { tag: 'medium', ...tf('Tout le monde est content au début.', true, 'Page 1.', 'p1') },
      { tag: 'hard', ...mc('Que font les enfants au retour ?', ['Ils chantent', 'Ils dorment', 'Ils courent'], 'Ils chantent', 'Page 6.', 'p6') },
      { tag: 'hard', ...fb('Ils mangent sur l’ ___ .', 'herbe', 'Page 4 : sur l’herbe.', 'p4') },
      { tag: 'hard', ...mc('« Pique-nique » veut dire :', ['Repas pris dehors', 'Jeu de ballon', 'Promenade'], 'Repas pris dehors', 'Un repas que l’on mange dehors.', 'p4') },
      { tag: 'hard', ...tf('La sortie se passe bien.', true, 'Les enfants sont contents.', 'p6') },
    ],
  },

  // 6 ── Nature (dessin / forêt) ──────────────────────────────────────────────
  {
    title: 'Le dessin de la forêt', emoji: '🎨',
    pages: [
      { text: "Lucie adore dessiner. Chaque soir, après ses devoirs, elle ouvre son grand cahier vert et laisse courir ses crayons sur le papier.", keywords: ['soir', 'Lucie', 'cahier', 'vert', 'crayons'] },
      { text: "Un matin, la maîtresse arrive avec une grande nouvelle : « Nous allons organiser un concours de dessin sur le thème de la nature ! »", keywords: ['maîtresse', 'concours', 'dessin', 'nature'] },
      { text: "Lucie sait tout de suite quoi dessiner. Elle imagine une forêt magique, pleine de papillons aux ailes colorées qui volent entre les branches.", keywords: ['forêt', 'papillons', 'colorés'] },
      { text: "Page après page, elle ajoute des détails : un grand arbre au tronc épais, une rivière qui brille au soleil et des fleurs partout.", keywords: ['arbre', 'rivière', 'fleurs'] },
      { text: "Le jour du concours arrive enfin. Le cœur battant, Lucie remet son dessin à la maîtresse avec un grand sourire.", keywords: ['concours', 'remet', 'sourire'] },
      { text: "La maîtresse regarde tous les dessins, puis elle annonce la gagnante : « C'est Lucie ! » Toute la classe applaudit très fort.", keywords: ['gagnante', 'Lucie', 'applaudit'] },
    ],
    questionPool: [
      { tag: 'easy', ...mc('Quand Lucie dessine-t-elle ?', ['Chaque soir', 'Le matin', 'À la récréation'], 'Chaque soir', 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('De quelle couleur est son cahier ?', ['Vert', 'Rouge', 'Bleu'], 'Vert', 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('Que dessine Lucie pour le concours ?', ['Une forêt', 'La mer', 'Un château'], 'Une forêt', 'Page 3.', 'p3') },
      { tag: 'easy', ...mc('Que met-elle dans la forêt ?', ['Des papillons', 'Des avions', 'Des voitures'], 'Des papillons', 'Page 3.', 'p3') },
      { tag: 'easy', ...tf('Lucie gagne le concours.', true, 'Page 6.', 'p6') },
      { tag: 'easy', ...mc('Qui annonce le concours ?', ['La maîtresse', 'Le directeur', 'La maman'], 'La maîtresse', 'Page 2.', 'p2') },
      { tag: 'medium', ...mc('Que dessine-t-elle aussi ?', ['Un arbre et une rivière', 'Un robot', 'Une fusée'], 'Un arbre et une rivière', 'Page 4.', 'p4') },
      { tag: 'medium', ...tf('Lucie est triste à la fin.', false, 'Elle gagne, tout le monde applaudit.', 'p6') },
      { tag: 'medium', ...mc('Comment remet-elle son dessin ?', ['Avec un sourire', 'En pleurant', 'En courant'], 'Avec un sourire', 'Page 5.', 'p5') },
      { tag: 'medium', ...tf('Le dessin montre la nature.', true, 'Forêt, papillons, rivière, fleurs.', 'p4') },
      { tag: 'hard', ...mc('Pourquoi Lucie gagne-t-elle, à ton avis ?', ['Son dessin est très beau', 'Elle court vite', 'Elle est grande'], 'Son dessin est très beau', 'Elle a fait un beau dessin de forêt.', 'p6') },
      { tag: 'hard', ...fb('Lucie dessine une ___ pleine de papillons.', 'forêt', 'Page 3.', 'p3') },
      { tag: 'hard', ...mc('« Colorés » veut dire :', ['De plusieurs couleurs', 'Très grands', 'Très rapides'], 'De plusieurs couleurs', 'Colorés = avec des couleurs.', 'p3') },
      { tag: 'hard', ...tf('Lucie aime dessiner la nature.', true, 'Elle dessine forêt et fleurs.', 'p3') },
    ],
  },

  // 7 ── Famille ──────────────────────────────────────────────────────────────
  {
    title: 'Le dimanche en famille', emoji: '👨‍👩‍👧',
    pages: [
      { text: "Le dimanche est le jour préféré de Maya. Ce matin, elle enfile son tablier et prépare des crêpes avec sa maman dans la cuisine.", keywords: ['dimanche', 'Maya', 'crêpes', 'maman', 'cuisine'] },
      { text: "Chacun aide à sa façon. Son papa met la table avec soin, et son petit frère apporte le sucre en marchant tout doucement.", keywords: ['papa', 'table', 'frère', 'sucre'] },
      { text: "Quand tout est prêt, toute la famille s'installe et mange les crêpes encore chaudes. Elles sentent bon le beurre et le sucre.", keywords: ['famille', 'crêpes', 'mange'] },
      { text: "L'après-midi, ils mettent leurs bottes et vont faire une longue promenade dans la forêt. Maya ramasse des feuilles de toutes les couleurs.", keywords: ['promenade', 'forêt', 'feuilles'] },
      { text: "Le soir, on sonne à la porte : c'est mamie ! Elle arrive avec un délicieux gâteau aux pommes encore tiède.", keywords: ['soir', 'mamie', 'gâteau', 'pommes'] },
      { text: "Avant de se coucher, Maya pense à sa journée. Elle adore vraiment les dimanches passés avec toute sa famille.", keywords: ['adore', 'dimanches', 'famille'] },
    ],
    questionPool: [
      { tag: 'easy', ...mc('Quel jour se passe l’histoire ?', ['Dimanche', 'Lundi', 'Samedi'], 'Dimanche', 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('Que prépare Maya ?', ['Des crêpes', 'Une pizza', 'Une soupe'], 'Des crêpes', 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('Avec qui prépare-t-elle les crêpes ?', ['Sa maman', 'Son papa', 'Mamie'], 'Sa maman', 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('Que fait le papa ?', ['Il met la table', 'Il dort', 'Il joue'], 'Il met la table', 'Page 2.', 'p2') },
      { tag: 'easy', ...mc('Qu’apporte le petit frère ?', ['Le sucre', 'Le pain', 'Le sel'], 'Le sucre', 'Page 2.', 'p2') },
      { tag: 'easy', ...tf('La famille mange dans la cuisine.', true, 'Page 3.', 'p3') },
      { tag: 'medium', ...mc('Que font-ils l’après-midi ?', ['Une promenade', 'La sieste', 'Du vélo'], 'Une promenade', 'Page 4.', 'p4') },
      { tag: 'medium', ...mc('Qui vient le soir ?', ['Mamie', 'Le voisin', 'La maîtresse'], 'Mamie', 'Page 5.', 'p5') },
      { tag: 'medium', ...mc('Quel gâteau apporte mamie ?', ['Aux pommes', 'Au chocolat', 'À la fraise'], 'Aux pommes', 'Page 5.', 'p5') },
      { tag: 'medium', ...tf('Maya déteste les dimanches.', false, 'Page 6 : elle adore.', 'p6') },
      { tag: 'hard', ...mc('Combien de personnes de la famille sont citées ?', ['Cinq', 'Deux', 'Trois'], 'Cinq', 'Maya, maman, papa, frère, mamie.', 'p5') },
      { tag: 'hard', ...fb('Le soir, mamie apporte un ___ aux pommes.', 'gâteau', 'Page 5.', 'p5') },
      { tag: 'hard', ...mc('Pourquoi Maya adore le dimanche ?', ['Elle est avec sa famille', 'Il n’y a pas école', 'Il fait chaud'], 'Elle est avec sa famille', 'Page 6.', 'p6') },
      { tag: 'hard', ...tf('Chacun aide à la maison.', true, 'Papa, frère, maman, Maya aident.', 'p2') },
    ],
  },

  // 8 ── Vacances ─────────────────────────────────────────────────────────────
  {
    title: 'Les vacances à la mer', emoji: '🏖️',
    pages: [
      { text: "C'est l'été ! Les écoles sont fermées et Hugo part en vacances à la mer avec ses parents. Dans la voiture, il chante tout le long du voyage.", keywords: ['été', 'Hugo', 'mer', 'vacances'] },
      { text: "Dès le premier jour, Hugo court sur la plage. Avec son seau et sa pelle, il construit un grand château de sable avec quatre tours.", keywords: ['plage', 'château', 'sable', 'tours'] },
      { text: "En se promenant au bord de l'eau, il ramasse de jolis coquillages nacrés. Soudain, il découvre aussi un petit crabe rouge qui se cache sous une pierre.", keywords: ['coquillages', 'crabe', 'rouge'] },
      { text: "L'après-midi, quand il fait bien chaud, Hugo met son maillot et se baigne dans l'eau bleue et fraîche. Les vagues le font rire.", keywords: ['baigne', 'eau', 'bleue', 'vagues'] },
      { text: "Le soir, pour le récompenser, ses parents lui offrent une grande glace à la fraise. Hugo la déguste lentement face au coucher de soleil.", keywords: ['soir', 'glace', 'fraise'] },
      { text: "De retour à l'appartement, Hugo bâille très fort. Il est fatigué, mais il est vraiment très heureux de ses vacances à la mer.", keywords: ['fatigué', 'heureux', 'vacances'] },
    ],
    questionPool: [
      { tag: 'easy', ...mc('À quelle saison part Hugo ?', ['En été', 'En hiver', 'Au printemps'], 'En été', 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('Où part Hugo ?', ['À la mer', 'À la montagne', 'À la campagne'], 'À la mer', 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('Que construit Hugo ?', ['Un château de sable', 'Une cabane', 'Un bateau'], 'Un château de sable', 'Page 2.', 'p2') },
      { tag: 'easy', ...mc('Que ramasse-t-il ?', ['Des coquillages', 'Des cailloux', 'Des feuilles'], 'Des coquillages', 'Page 3.', 'p3') },
      { tag: 'easy', ...tf('Hugo trouve un crabe rouge.', true, 'Page 3.', 'p3') },
      { tag: 'easy', ...mc('Que fait Hugo l’après-midi ?', ['Il se baigne', 'Il dort', 'Il lit'], 'Il se baigne', 'Page 4.', 'p4') },
      { tag: 'medium', ...mc('Quelle glace mange Hugo ?', ['À la fraise', 'Au chocolat', 'À la vanille'], 'À la fraise', 'Page 5.', 'p5') },
      { tag: 'medium', ...tf('L’eau est bleue.', true, 'Page 4.', 'p4') },
      { tag: 'medium', ...mc('Avec qui Hugo part-il ?', ['Ses parents', 'Ses amis', 'Sa classe'], 'Ses parents', 'Page 1.', 'p1') },
      { tag: 'medium', ...tf('Hugo est triste à la fin.', false, 'Page 6 : il est heureux.', 'p6') },
      { tag: 'hard', ...mc('Comment se sent Hugo à la fin ?', ['Fatigué mais heureux', 'En colère', 'Malade'], 'Fatigué mais heureux', 'Page 6.', 'p6') },
      { tag: 'hard', ...fb('Hugo construit un château de ___ .', 'sable', 'Page 2.', 'p2') },
      { tag: 'hard', ...mc('« Se baigner » veut dire :', ['Aller dans l’eau', 'Se sécher', 'Manger'], 'Aller dans l’eau', 'Se baigner = entrer dans l’eau.', 'p4') },
      { tag: 'hard', ...tf('L’histoire se passe pendant les vacances.', true, 'Page 1.', 'p1') },
    ],
  },

  // 9 ── Bibliothèque ─────────────────────────────────────────────────────────
  {
    title: 'Le livre rouge', emoji: '📖',
    pages: [
      { text: "Un mercredi après-midi, Théo entre pour la première fois à la bibliothèque de son quartier. Il pousse la grande porte sans faire de bruit.", keywords: ['mercredi', 'Théo', 'bibliothèque', 'porte'] },
      { text: "À l'intérieur, c'est immense. Des centaines de livres sont rangés sur de grandes étagères de bois qui montent jusqu'au plafond.", keywords: ['livres', 'étagères', 'bois'] },
      { text: "En levant les yeux, Théo remarque un petit livre rouge posé tout en haut d'une étagère. Cette couleur vive l'attire aussitôt.", keywords: ['rouge', 'livre', 'étagère'] },
      { text: "La gentille bibliothécaire prend une échelle et attrape le livre pour lui. Sur la couverture, on voit un magnifique dragon qui crache du feu.", keywords: ['bibliothécaire', 'couverture', 'dragon'] },
      { text: "Théo s'installe dans le coin lecture, sur un gros coussin moelleux, et commence à lire. L'histoire est si captivante qu'il ne voit pas le temps passer.", keywords: ['coin lecture', 'coussin', 'lire'] },
      { text: "Avant de partir, Théo décide d'emprunter le livre rouge pour finir l'histoire à la maison. Il rentre chez lui en serrant le livre contre lui, tout content.", keywords: ['emprunte', 'livre', 'content'] },
    ],
    questionPool: [
      { tag: 'easy', ...mc('Où va Théo ?', ['À la bibliothèque', 'À la piscine', 'À l’école'], 'À la bibliothèque', 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('Sur quoi sont rangés les livres ?', ['Des étagères', 'Le sol', 'Une table'], 'Des étagères', 'Page 2.', 'p2') },
      { tag: 'easy', ...mc('De quelle couleur est le livre spécial ?', ['Rouge', 'Bleu', 'Vert'], 'Rouge', 'Page 3.', 'p3') },
      { tag: 'easy', ...tf('La couverture montre un dragon.', true, 'Page 4.', 'p4') },
      { tag: 'easy', ...mc('Qui donne le livre à Théo ?', ['La bibliothécaire', 'La maîtresse', 'Sa maman'], 'La bibliothécaire', 'Page 4.', 'p4') },
      { tag: 'easy', ...mc('Où s’assoit Théo pour lire ?', ['Le coin lecture', 'La cour', 'La cuisine'], 'Le coin lecture', 'Page 5.', 'p5') },
      { tag: 'medium', ...tf('Théo laisse le livre à la bibliothèque.', false, 'Page 6 : il l’emprunte.', 'p6') },
      { tag: 'medium', ...mc('Que fait Théo à la fin ?', ['Il emprunte le livre', 'Il déchire le livre', 'Il le cache'], 'Il emprunte le livre', 'Page 6.', 'p6') },
      { tag: 'medium', ...mc('Est-ce la première fois que Théo vient ?', ['Oui', 'Non', 'On ne sait pas'], 'Oui', 'Page 1 : pour la première fois.', 'p1') },
      { tag: 'medium', ...tf('Théo aime le livre.', true, 'Il l’emprunte, content.', 'p6') },
      { tag: 'hard', ...mc('Pourquoi Théo emprunte-t-il le livre ?', ['Pour le lire chez lui', 'Pour le vendre', 'Pour le jeter'], 'Pour le lire chez lui', 'Il rentre content avec le livre.', 'p6') },
      { tag: 'hard', ...fb('Le livre montre un ___ .', 'dragon', 'Page 4.', 'p4') },
      { tag: 'hard', ...mc('« Emprunter » un livre veut dire :', ['Le prendre puis le rendre', 'Le garder pour toujours', 'L’acheter'], 'Le prendre puis le rendre', 'On emprunte puis on rend.', 'p6') },
      { tag: 'hard', ...tf('L’histoire se passe à la bibliothèque.', true, 'Page 1.', 'p1') },
    ],
  },

  // 10 ── Sport ────────────────────────────────────────────────────────────────
  {
    title: 'Le match de Sami', emoji: '⚽',
    pages: [
      { text: "Ce samedi est un grand jour : Sami joue son tout premier match de football avec son club. Il est un peu nerveux mais très impatient.", keywords: ['samedi', 'Sami', 'football', 'match'] },
      { text: "Dans les vestiaires, il enfile son maillot bleu tout neuf. Dans son dos brille le numéro sept, son chiffre porte-bonheur.", keywords: ['maillot', 'bleu', 'numéro', 'sept'] },
      { text: "Le match commence. L'équipe adverse attaque très vite et marque un but. Au tableau, l'équipe de Sami perd un à zéro.", keywords: ['équipe', 'perd', 'but'] },
      { text: "Sami ne baisse pas les bras. Il reçoit le ballon, court très vite le long du terrain et tire de toutes ses forces : but ! Le score est un partout.", keywords: ['court', 'ballon', 'but', 'score'] },
      { text: "Les deux équipes se battent jusqu'à la dernière minute. Et là, son ami Léo récupère le ballon et marque le deuxième but pour leur équipe !", keywords: ['Léo', 'deuxième', 'but'] },
      { text: "L'arbitre siffle la fin du match. L'équipe de Sami gagne deux à un. Sur le terrain, tous les joueurs sautent de joie et se serrent dans les bras.", keywords: ['arbitre', 'gagne', 'joie'] },
    ],
    questionPool: [
      { tag: 'easy', ...mc('Quel jour a lieu le match ?', ['Samedi', 'Dimanche', 'Lundi'], 'Samedi', 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('À quel sport joue Sami ?', ['Au football', 'Au tennis', 'Au basket'], 'Au football', 'Page 1.', 'p1') },
      { tag: 'easy', ...mc('De quelle couleur est son maillot ?', ['Bleu', 'Rouge', 'Vert'], 'Bleu', 'Page 2.', 'p2') },
      { tag: 'easy', ...mc('Quel numéro porte Sami ?', ['Sept', 'Cinq', 'Dix'], 'Sept', 'Page 2.', 'p2') },
      { tag: 'easy', ...tf('Au début, l’équipe de Sami perd.', true, 'Page 3 : un à zéro.', 'p3') },
      { tag: 'easy', ...mc('Que fait Sami ?', ['Il marque un but', 'Il tombe', 'Il sort'], 'Il marque un but', 'Page 4.', 'p4') },
      { tag: 'medium', ...mc('Qui marque le deuxième but ?', ['Son ami Léo', 'Sami', 'Le gardien'], 'Son ami Léo', 'Page 5.', 'p5') },
      { tag: 'medium', ...tf('L’équipe de Sami gagne le match.', true, 'Page 6 : deux à un.', 'p6') },
      { tag: 'medium', ...mc('Quel est le score final ?', ['Deux à un', 'Un à zéro', 'Trois à deux'], 'Deux à un', 'Page 6.', 'p6') },
      { tag: 'medium', ...tf('C’est le premier match de Sami.', true, 'Page 1.', 'p1') },
      { tag: 'hard', ...mc('Pourquoi tout le monde saute de joie ?', ['L’équipe a gagné', 'Il pleut', 'C’est fini'], 'L’équipe a gagné', 'Page 6.', 'p6') },
      { tag: 'hard', ...fb('Sami marque un ___ .', 'but', 'Page 4.', 'p4') },
      { tag: 'hard', ...mc('« Une équipe » est :', ['Un groupe de joueurs', 'Un seul joueur', 'Un ballon'], 'Un groupe de joueurs', 'Une équipe = plusieurs joueurs ensemble.', 'p3') },
      { tag: 'hard', ...tf('Sami et Léo jouent ensemble.', true, 'Ils sont dans la même équipe.', 'p5') },
    ],
  },
];
