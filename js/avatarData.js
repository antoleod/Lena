(function () {
  const baseAvatarPath = '../assets/avatars/';

  const backgroundSpecs = {
    licorne: [
      {
        id: 'licorne-arc-en-ciel',
        name: 'Arc-en-ciel Pastel',
        motif: '🌈',
        priceCoins: 140,
        description: 'Des nuages chantilly et un arc-en-ciel tendre pour rêver grand.',
        palette: {
          background: ['#FDEBFF', '#CFF4FF'],
          accent: '#FF82C6',
          textLight: '#333333'
        }
      },
      {
        id: 'licorne-galaxie-scintillante',
        name: 'Galaxie Scintillante',
        motif: '🌌',
        priceCoins: 180,
        description: 'Voyage à travers une galaxie remplie de nébuleuses et d\'étoiles filantes.',
        palette: {
          background: ['#2E3359', '#4A3F7E'],
          accent: '#957DAD',
          textLight: '#FFFFFF'
        }
      },
      {
        id: 'licorne-foret-enchantee',
        name: 'Forêt Enchantée',
        motif: '🌳',
        priceCoins: 150,
        description: 'Une forêt magique où la lumière filtre à travers les arbres centenaires.',
        palette: {
          background: ['#C8E6C9', '#A5D6A7'],
          accent: '#81C784',
          textLight: '#1B5E20'
        }
      }
    ],
    lion: [
      {
        id: 'lion-savana-doree',
        name: 'Savane Dorée',
        motif: '🌞',
        priceCoins: 120,
        description: 'La chaleur du soleil africain pour rugir de bonheur.',
        palette: {
          background: ['#FFE7A0', '#FFD07A'],
          accent: '#F77F2F',
          textLight: '#3B2C2A'
        }
      }
    ],
    pingouin: [
      {
        id: 'pingouin-banquise-etoilee',
        name: 'Banquise Étoilée',
        motif: '❄️',
        priceCoins: 120,
        description: 'Des étoiles polaires qui scintillent sur la glace.',
        palette: {
          background: ['#E0F7FF', '#BFE3FF'],
          accent: '#1F6DF2',
          textLight: '#153051'
        }
      }
    ],
    panda: [
      {
        id: 'panda-bambou-doux',
        name: 'Bosquet de Bambous',
        motif: '🎋',
        priceCoins: 130,
        description: 'La brise fraîche d’un bosquet de bambous chantants.',
        palette: {
          background: ['#E8FFE6', '#B7F5C6'],
          accent: '#4DAD5B',
          textLight: '#2B462A'
        }
      }
    ],
    renard: [
      {
        id: 'renard-clairiere-doree',
        name: 'Clairière Dorée',
        motif: '🍂',
        priceCoins: 125,
        description: 'Feuilles d’automne et lumière dorée pour les curieux.',
        palette: {
          background: ['#FFE9D5', '#FFD0A3'],
          accent: '#E8743D',
          textLight: '#4C2A15'
        }
      }
    ],
    grenouille: [
      {
        id: 'grenouille-etang-fleuri',
        name: 'Étang Fleuri',
        motif: '🌸',
        priceCoins: 115,
        description: 'Des nénuphars parfumés pour bondir avec joie.',
        palette: {
          background: ['#D7FFE0', '#A8F4C1'],
          accent: '#5BCB63',
          textLight: '#28462B'
        }
      }
    ],
    hibou: [
      {
        id: 'hibou-nuit-etoilee',
        name: 'Nuit Étoilée',
        motif: '🌟',
        priceCoins: 140,
        description: 'Un ciel nocturne rempli de constellations douces.',
        palette: {
          background: ['#1F264F', '#0D1233'],
          accent: '#FFD93D',
          textLight: '#FFFFFF'
        }
      }
    ],
    dauphin: [
      {
        id: 'dauphin-ocean-tropical',
        name: 'Océan Tropical',
        motif: '🐚',
        priceCoins: 130,
        description: 'Des eaux turquoises pour nager avec les amis poissons.',
        palette: {
          background: ['#41EAD4', '#2BA8FF'],
          accent: '#FFE29A',
          textLight: '#0B1B2B'
        }
      }
    ],
    dragon: [
      {
        id: 'dragon-volcan-magique',
        name: 'Volcan Magique',
        motif: '🔥',
        priceCoins: 160,
        description: 'De la lave scintillante pour réchauffer les ailes.',
        palette: {
          background: ['#FF7A7A', '#FFAF45'],
          accent: '#63231C',
          textLight: '#3B0E0E'
        }
      }
    ],
    fraise: [
      {
        id: 'fraise-jardin-etoile',
        name: 'Jardin aux Étoiles',
        motif: '🍓',
        priceCoins: 95,
        description: 'Un jardin parfumé où brillent des fraises constellées.',
        palette: {
          background: ['#FFE1F0', '#FFC5DE'],
          accent: '#FF6FA2',
          textLight: '#4C1036'
        }
      }
    ],
    pomme: [
      {
        id: 'pomme-verger-ensoleille',
        name: 'Verger Ensoleillé',
        motif: '🌳',
        priceCoins: 100,
        description: 'Des pommiers dorés et une lumière douce du matin.',
        palette: {
          background: ['#FFF5E6', '#D8FFB4'],
          accent: '#FF8A5C',
          textLight: '#2C3B1A'
        }
      }
    ],
    banane: [
      {
        id: 'banane-jungle-rieuse',
        name: 'Jungle Rieuse',
        motif: '🌿',
        priceCoins: 95,
        description: 'Une jungle remplie de rires et de feuilles dansantes.',
        palette: {
          background: ['#FFF8B8', '#DFFFA8'],
          accent: '#FFCF3F',
          textLight: '#3A3A10'
        }
      }
    ],
    ananas: [
      {
        id: 'ananas-fete-tropicale',
        name: 'Fête Tropicale',
        motif: '🌴',
        priceCoins: 105,
        description: 'Un ciel orangé et des palmiers qui dansent.',
        palette: {
          background: ['#FFF0D0', '#FFE766'],
          accent: '#FF9A1F',
          textLight: '#45300E'
        }
      }
    ]
  };

  function svgDataUri(svg) {
    return `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29')}`;
  }

  function createPreviewSvg(palette, motif, size) {
    const width = size;
    const height = Math.round(size * 0.75);
    const [start, end] = palette.background;
    const accent = palette.accent;
    const textColor = palette.textLight || '#333333';
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${start}"/>
      <stop offset="100%" stop-color="${end}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" rx="24" fill="url(#grad)"/>
  <circle cx="${width * 0.18}" cy="${height * 0.3}" r="${height * 0.14}" fill="${accent}" opacity="0.28"/>
  <circle cx="${width * 0.82}" cy="${height * 0.24}" r="${height * 0.12}" fill="${accent}" opacity="0.24"/>
  <text x="50%" y="60%" font-family="'Fredoka', 'Nunito', sans-serif" font-weight="700" font-size="${height * 0.36}" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${motif || '✨'}</text>
</svg>`;
    return svgDataUri(svg);
  }

  function enrichBackground(background) {
    if (!background || !background.palette) return background;
    const preview = createPreviewSvg(background.palette, background.motif, 160);
    const icon = createPreviewSvg(background.palette, background.motif, 96);
    return {
      ...background,
      previewUrl: preview,
      iconUrl: icon
    };
  }

  const library = {
    licorne: {
      id: 'licorne',
      name: 'Licorne',
      iconUrl: `${baseAvatarPath}licorne.svg`,
      backgrounds: backgroundSpecs.licorne.map(enrichBackground)
    },
    lion: {
      id: 'lion',
      name: 'Lion',
      iconUrl: `${baseAvatarPath}lion.svg`,
      backgrounds: backgroundSpecs.lion.map(enrichBackground)
    },
    pingouin: {
      id: 'pingouin',
      name: 'Pingouin',
      iconUrl: `${baseAvatarPath}pingouin.svg`,
      backgrounds: backgroundSpecs.pingouin.map(enrichBackground)
    },
    panda: {
      id: 'panda',
      name: 'Panda',
      iconUrl: `${baseAvatarPath}panda.svg`,
      backgrounds: backgroundSpecs.panda.map(enrichBackground)
    },
    renard: {
      id: 'renard',
      name: 'Renard',
      iconUrl: `${baseAvatarPath}renard.svg`,
      backgrounds: backgroundSpecs.renard.map(enrichBackground)
    },
    grenouille: {
      id: 'grenouille',
      name: 'Grenouille',
      iconUrl: `${baseAvatarPath}grenouille.svg`,
      backgrounds: backgroundSpecs.grenouille.map(enrichBackground)
    },
    hibou: {
      id: 'hibou',
      name: 'Hibou',
      iconUrl: `${baseAvatarPath}hibou.svg`,
      backgrounds: backgroundSpecs.hibou.map(enrichBackground)
    },
    dauphin: {
      id: 'dauphin',
      name: 'Dauphin',
      iconUrl: `${baseAvatarPath}dauphin.svg`,
      backgrounds: backgroundSpecs.dauphin.map(enrichBackground)
    },
    dragon: {
      id: 'dragon',
      name: 'Dragon',
      iconUrl: `${baseAvatarPath}dragon.svg`,
      backgrounds: backgroundSpecs.dragon.map(enrichBackground)
    },
    fraise: {
      id: 'fraise',
      name: 'Fraise Pétillante',
      iconUrl: `${baseAvatarPath}fraise.svg`,
      backgrounds: backgroundSpecs.fraise.map(enrichBackground)
    },
    pomme: {
      id: 'pomme',
      name: 'Pomme Brillante',
      iconUrl: `${baseAvatarPath}pomme.svg`,
      backgrounds: backgroundSpecs.pomme.map(enrichBackground)
    },
    banane: {
      id: 'banane',
      name: 'Banane Rigolote',
      iconUrl: `${baseAvatarPath}banane.svg`,
      backgrounds: backgroundSpecs.banane.map(enrichBackground)
    },
    ananas: {
      id: 'ananas',
      name: 'Ananas Disco',
      iconUrl: `${baseAvatarPath}ananas.svg`,
      backgrounds: backgroundSpecs.ananas.map(enrichBackground)
    }
  };

  window.AVATAR_LIBRARY = library;
})();
