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
        id: 'licorne-nuage-magique',
        name: 'Nuage Magique',
        motif: '☁️',
        priceCoins: 110,
        description: 'Un ciel poudré où les nuages brillent tout doucement.',
        palette: {
          background: ['#FDFBFF', '#E4E6FF'],
          accent: '#9C8CFF',
          textLight: '#333333'
        }
      },
      {
        id: 'licorne-foret-enchantee',
        name: 'Forêt Enchantée',
        motif: '🦄',
        priceCoins: 150,
        description: 'Des lucioles étincelantes pour guider chaque aventure.',
        palette: {
          background: ['#C4F0FF', '#EFD6FF'],
          accent: '#7A5CFF',
          textLight: '#333333'
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
      },
      {
        id: 'lion-crepuscule-royal',
        name: 'Crépuscule Royal',
        motif: '👑',
        priceCoins: 150,
        description: 'Un coucher de soleil royal pour les rois et reines de la savane.',
        palette: {
          background: ['#FFB284', '#FF7D6B'],
          accent: '#5C3A2C',
          textLight: '#3B2C2A'
        }
      },
      {
        id: 'lion-oasis-fraiche',
        name: 'Oasis Fraîche',
        motif: '🌴',
        priceCoins: 130,
        description: 'Une oasis douce pour se reposer après les grandes aventures.',
        palette: {
          background: ['#FFF4C2', '#B0E9D0'],
          accent: '#3E8872',
          textLight: '#2C2C2C'
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
      },
      {
        id: 'pingouin-aurore-boreale',
        name: 'Aurore Boréale',
        motif: '🌌',
        priceCoins: 160,
        description: 'Un ciel dansant de lumières pour pêcher avec magie.',
        palette: {
          background: ['#3A6BFF', '#9AF7FF'],
          accent: '#24F0A8',
          textLight: '#FFFFFF'
        }
      },
      {
        id: 'pingouin-village-glace',
        name: 'Village de Glace',
        motif: '🏠',
        priceCoins: 110,
        description: 'Des igloos douillets pour se réchauffer entre amis.',
        palette: {
          background: ['#F0FBFF', '#C3E9FF'],
          accent: '#FF9EA5',
          textLight: '#233041'
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
      },
      {
        id: 'panda-nuage-coton',
        name: 'Nuages de Coton',
        motif: '☁️',
        priceCoins: 110,
        description: 'Des nuages gourmands pour des câlins sans fin.',
        palette: {
          background: ['#FFFFFF', '#E9F1FF'],
          accent: '#7B8FB5',
          textLight: '#2E3A4F'
        }
      },
      {
        id: 'panda-montagne-brumeuse',
        name: 'Montagne Brumeuse',
        motif: '⛰️',
        priceCoins: 150,
        description: 'Une montagne mystérieuse enveloppée de brume douce.',
        palette: {
          background: ['#DDE9FF', '#B4C9FF'],
          accent: '#5666A3',
          textLight: '#24315A'
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
      },
      {
        id: 'renard-nocturne-etoile',
        name: 'Forêt au Clair des Étoiles',
        motif: '🌠',
        priceCoins: 150,
        description: 'Une forêt scintillante pour se cacher en douceur.',
        palette: {
          background: ['#33415C', '#162036'],
          accent: '#FFAF5F',
          textLight: '#FFFFFF'
        }
      },
      {
        id: 'renard-lueur-crepuscule',
        name: 'Lueur du Crépuscule',
        motif: '🌇',
        priceCoins: 135,
        description: 'Le ciel orangé qui réchauffe les moustaches.',
        palette: {
          background: ['#FFB88A', '#FF7E67'],
          accent: '#FFCE6F',
          textLight: '#3E1B0D'
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
      },
      {
        id: 'grenouille-pluie-douce',
        name: 'Pluie Douce',
        motif: '🌧️',
        priceCoins: 120,
        description: 'Des gouttes de pluie qui chantent doucement.',
        palette: {
          background: ['#C8F4FF', '#A1E0FF'],
          accent: '#4BB7D8',
          textLight: '#1E4046'
        }
      },
      {
        id: 'grenouille-jungle-lumineuse',
        name: 'Jungle Lumineuse',
        motif: '🪲',
        priceCoins: 150,
        description: 'Une jungle brillante où les lucioles guident les pas.',
        palette: {
          background: ['#4ADE80', '#22D3EE'],
          accent: '#155E75',
          textLight: '#063136'
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
      },
      {
        id: 'hibou-foret-nocturne',
        name: 'Forêt Nocturne',
        motif: '🌲',
        priceCoins: 135,
        description: 'Une forêt mystérieuse qui murmure des secrets.',
        palette: {
          background: ['#2E3B58', '#162239'],
          accent: '#7AC4FF',
          textLight: '#E6F2FF'
        }
      },
      {
        id: 'hibou-clair-de-lune',
        name: 'Clair de Lune',
        motif: '🌙',
        priceCoins: 145,
        description: 'La lumière argentée pour éclairer les grandes idées.',
        palette: {
          background: ['#3A4E7A', '#1C2540'],
          accent: '#C4D9FF',
          textLight: '#E9F2FF'
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
      },
      {
        id: 'dauphin-recif-corallien',
        name: 'Récif Corallien',
        motif: '🐠',
        priceCoins: 150,
        description: 'Un récif coloré plein de surprises scintillantes.',
        palette: {
          background: ['#4CC0FF', '#FF8AD9'],
          accent: '#FFCF67',
          textLight: '#012043'
        }
      },
      {
        id: 'dauphin-plage-crepuscule',
        name: 'Plage au Crépuscule',
        motif: '🌅',
        priceCoins: 135,
        description: 'Un coucher de soleil doux sur les vagues calmes.',
        palette: {
          background: ['#FFB5A7', '#87CEFA'],
          accent: '#2B6CB0',
          textLight: '#1F2B3B'
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
      },
      {
        id: 'dragon-grotte-tresors',
        name: 'Grotte aux Trésors',
        motif: '💎',
        priceCoins: 155,
        description: 'Des gemmes colorées qui brillent dans le noir.',
        palette: {
          background: ['#5B2E8A', '#2C1A4F'],
          accent: '#FFD966',
          textLight: '#F3E8FF'
        }
      },
      {
        id: 'dragon-feu-mystique',
        name: 'Feu Mystique',
        motif: '✨',
        priceCoins: 165,
        description: 'Des étincelles magiques pour voler très haut.',
        palette: {
          background: ['#FF5F9E', '#5F27FF'],
          accent: '#FFD23F',
          textLight: '#FFEFF9'
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
      defaultPalette: {
        primary: '#FF7AA8',
        secondary: '#C7A8FF',
        accent: '#FFD1F4'
      },
      backgrounds: backgroundSpecs.licorne.map(enrichBackground)
    },
    lion: {
      id: 'lion',
      name: 'Lion',
      iconUrl: `${baseAvatarPath}lion.svg`,
      defaultPalette: {
        primary: '#F77F2F',
        secondary: '#FFCF7D',
        accent: '#FFF1C1'
      },
      backgrounds: backgroundSpecs.lion.map(enrichBackground)
    },
    pingouin: {
      id: 'pingouin',
      name: 'Pingouin',
      iconUrl: `${baseAvatarPath}pingouin.svg`,
      defaultPalette: {
        primary: '#2D3F66',
        secondary: '#9BD4FF',
        accent: '#FFFFFF'
      },
      backgrounds: backgroundSpecs.pingouin.map(enrichBackground)
    },
    panda: {
      id: 'panda',
      name: 'Panda',
      iconUrl: `${baseAvatarPath}panda.svg`,
      defaultPalette: {
        primary: '#3E4A5B',
        secondary: '#B4C5D4',
        accent: '#FFFFFF'
      },
      backgrounds: backgroundSpecs.panda.map(enrichBackground)
    },
    renard: {
      id: 'renard',
      name: 'Renard',
      iconUrl: `${baseAvatarPath}renard.svg`,
      defaultPalette: {
        primary: '#E8743D',
        secondary: '#FFB784',
        accent: '#FFE5C3'
      },
      backgrounds: backgroundSpecs.renard.map(enrichBackground)
    },
    grenouille: {
      id: 'grenouille',
      name: 'Grenouille',
      iconUrl: `${baseAvatarPath}grenouille.svg`,
      defaultPalette: {
        primary: '#4AA94B',
        secondary: '#97F2A6',
        accent: '#E4FFE9'
      },
      backgrounds: backgroundSpecs.grenouille.map(enrichBackground)
    },
    hibou: {
      id: 'hibou',
      name: 'Hibou',
      iconUrl: `${baseAvatarPath}hibou.svg`,
      defaultPalette: {
        primary: '#6B50D8',
        secondary: '#3A4E7A',
        accent: '#FFD93D'
      },
      backgrounds: backgroundSpecs.hibou.map(enrichBackground)
    },
    dauphin: {
      id: 'dauphin',
      name: 'Dauphin',
      iconUrl: `${baseAvatarPath}dauphin.svg`,
      defaultPalette: {
        primary: '#2BA8FF',
        secondary: '#41EAD4',
        accent: '#FFE29A'
      },
      backgrounds: backgroundSpecs.dauphin.map(enrichBackground)
    },
    dragon: {
      id: 'dragon',
      name: 'Dragon',
      iconUrl: `${baseAvatarPath}dragon.svg`,
      defaultPalette: {
        primary: '#FF6F91',
        secondary: '#5F27FF',
        accent: '#FFD23F'
      },
      backgrounds: backgroundSpecs.dragon.map(enrichBackground)
    }
  };

  window.AVATAR_LIBRARY = library;
})();
