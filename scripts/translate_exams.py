#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add prompt_nl / prompt_en / prompt_es (and options_i18n for MCQ)
to all targeted exam JSON files.
Only translates: calcul-mental, sciences, geographie-belgique, grand-defi.
French-subject exams are left untouched.
"""

import json
import glob
import os

BASE = r"c:\Users\X1\Documents\Lena\src\content\exams"


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save(path, data):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


# ── Sciences translations ─────────────────────────────────────────────────────

SCIENCES_PROMPTS = {
    "Un carnivore mange :": {
        "nl": "Een carnivoor eet:",
        "en": "A carnivore eats:",
        "es": "Un carnivoro come:",
        "opts_i18n": {
            "nl": ["vlees", "planten", "fruit", "zaden"],
            "en": ["meat", "plants", "fruit", "seeds"],
            "es": ["carne", "plantas", "fruta", "semillas"],
        },
    },
    "Quel astre éclaire la nuit ?": {
        "nl": "Welk hemellichaam verlicht de nacht?",
        "en": "Which celestial body lights up the night?",
        "es": "Que astro ilumina la noche?",
        "opts_i18n": {
            "nl": ["de Maan", "de Zon", "Mars", "Jupiter"],
            "en": ["the Moon", "the Sun", "Mars", "Jupiter"],
            "es": ["la Luna", "el Sol", "Marte", "Jupiter"],
        },
    },
    "De quoi est composé l'air que l'on respire surtout ?": {
        "nl": "Waaruit bestaat de lucht die we inademen?",
        "en": "What is the air we breathe mainly made of?",
        "es": "De que esta compuesto principalmente el aire que respiramos?",
        "opts_i18n": {
            "nl": ["stikstof en zuurstof", "koolstofdioxide", "waterdamp", "helium"],
            "en": ["nitrogen and oxygen", "carbon dioxide", "water vapour", "helium"],
            "es": ["nitrogeno y oxigeno", "dioxido de carbono", "vapor de agua", "helio"],
        },
    },
    "Un herbivore mange :": {
        "nl": "Een herbivoor eet:",
        "en": "A herbivore eats:",
        "es": "Un herbivoro come:",
        "opts_i18n": {
            "nl": ["planten", "vlees", "insecten", "vissen"],
            "en": ["plants", "meat", "insects", "fish"],
            "es": ["plantas", "carne", "insectos", "peces"],
        },
    },
    "Quel sens utilise-t-on pour sentir une fleur ?": {
        "nl": "Welk zintuig gebruik je om een bloem te ruiken?",
        "en": "Which sense do you use to smell a flower?",
        "es": "Que sentido se usa para oler una flor?",
        "opts_i18n": {
            "nl": ["de reuk", "de smaak", "het zicht", "het gevoel"],
            "en": ["smell", "taste", "sight", "touch"],
            "es": ["el olfato", "el gusto", "la vista", "el tacto"],
        },
    },
    "Le Soleil tourne autour de la Terre.": {
        "nl": "De Zon draait om de Aarde.",
        "en": "The Sun revolves around the Earth.",
        "es": "El Sol gira alrededor de la Tierra.",
    },
    "L'eau bout à 100°C.": {
        "nl": "Water kookt bij 100°C.",
        "en": "Water boils at 100°C.",
        "es": "El agua hierve a 100°C.",
    },
    "Quelle planète est la plus proche du Soleil ?": {
        "nl": "Welke planeet staat het dichtst bij de Zon?",
        "en": "Which planet is closest to the Sun?",
        "es": "Que planeta esta mas cerca del Sol?",
        "opts_i18n": {
            "nl": ["Mercurius", "Venus", "Aarde", "Mars"],
            "en": ["Mercury", "Venus", "Earth", "Mars"],
            "es": ["Mercurio", "Venus", "Tierra", "Marte"],
        },
    },
    "Quel est le rôle des racines d'une plante ?": {
        "nl": "Wat is de rol van de wortels van een plant?",
        "en": "What is the role of a plant's roots?",
        "es": "Cual es la funcion de las raices de una planta?",
        "opts_i18n": {
            "nl": ["water opnemen", "fotosynthese doen", "zaden produceren", "insecten aantrekken"],
            "en": ["absorb water", "do photosynthesis", "produce seeds", "attract insects"],
            "es": ["absorber agua", "hacer fotosintesis", "producir semillas", "atraer insectos"],
        },
    },
    "Quel animal est un mammifère ?": {
        "nl": "Welk dier is een zoogdier?",
        "en": "Which animal is a mammal?",
        "es": "Que animal es un mamifero?",
        "opts_i18n": {
            "nl": ["de hond", "de arend", "de kikker", "de slang"],
            "en": ["the dog", "the eagle", "the frog", "the snake"],
            "es": ["el perro", "el aguila", "la rana", "la serpiente"],
        },
    },
    "Le cycle de l'eau commence par :": {
        "nl": "De watercyclus begint met:",
        "en": "The water cycle begins with:",
        "es": "El ciclo del agua comienza por:",
        "opts_i18n": {
            "nl": ["verdamping", "neerslag", "condensatie", "afvloeiing"],
            "en": ["evaporation", "precipitation", "condensation", "runoff"],
            "es": ["evaporacion", "precipitaciones", "condensacion", "escorrentia"],
        },
    },
    "Quel organe pompe le sang dans le corps ?": {
        "nl": "Welk orgaan pompt het bloed door het lichaam?",
        "en": "Which organ pumps blood through the body?",
        "es": "Que organo bombea la sangre por el cuerpo?",
        "opts_i18n": {
            "nl": ["het hart", "de long", "de hersenen", "de maag"],
            "en": ["the heart", "the lung", "the brain", "the stomach"],
            "es": ["el corazon", "el pulmon", "el cerebro", "el estomago"],
        },
    },
    "Les plantes produisent de l'oxygène.": {
        "nl": "Planten produceren zuurstof.",
        "en": "Plants produce oxygen.",
        "es": "Las plantas producen oxigeno.",
    },
    "Un insecte a combien de pattes ?": {
        "nl": "Hoeveel poten heeft een insect?",
        "en": "How many legs does an insect have?",
        "es": "Cuantas patas tiene un insecto?",
        "opts_i18n": {
            "nl": ["6", "4", "8", "2"],
            "en": ["6", "4", "8", "2"],
            "es": ["6", "4", "8", "2"],
        },
    },
    "Quel animal pond des oeufs ?": {
        "nl": "Welk dier legt eieren?",
        "en": "Which animal lays eggs?",
        "es": "Que animal pone huevos?",
        "opts_i18n": {
            "nl": ["de kip", "de kat", "de hond", "de koe"],
            "en": ["the hen", "the cat", "the dog", "the cow"],
            "es": ["la gallina", "el gato", "el perro", "la vaca"],
        },
    },
    "Les plantes ont besoin de :": {
        "nl": "Planten hebben nodig:",
        "en": "Plants need:",
        "es": "Las plantas necesitan:",
        "opts_i18n": {
            "nl": ["licht, water en aarde", "chocolade en melk", "kou en duisternis", "zand en zout"],
            "en": ["light, water and soil", "chocolate and milk", "cold and darkness", "sand and salt"],
            "es": ["luz, agua y tierra", "chocolate y leche", "frio y oscuridad", "arena y sal"],
        },
    },
    "La chaîne alimentaire commence par :": {
        "nl": "De voedselketen begint bij:",
        "en": "The food chain starts with:",
        "es": "La cadena alimentaria empieza por:",
        "opts_i18n": {
            "nl": ["de planten", "de herbivoren", "de carnivoren", "de afbrekers"],
            "en": ["plants", "herbivores", "carnivores", "decomposers"],
            "es": ["las plantas", "los herbivoros", "los carnivoros", "los descomponedores"],
        },
    },
    "Avec quoi respire-t-on ?": {
        "nl": "Waarmee ademen we?",
        "en": "What do we breathe with?",
        "es": "Con que respiramos?",
        "opts_i18n": {
            "nl": ["de longen", "de maag", "de lever", "de nieren"],
            "en": ["the lungs", "the stomach", "the liver", "the kidneys"],
            "es": ["los pulmones", "el estomago", "el higado", "los rinones"],
        },
    },
    "La photosynthèse est réalisée par :": {
        "nl": "Fotosynthese wordt uitgevoerd door:",
        "en": "Photosynthesis is carried out by:",
        "es": "La fotosintesis la realizan:",
        "opts_i18n": {
            "nl": ["de planten", "de dieren", "de schimmels", "de stenen"],
            "en": ["plants", "animals", "fungi", "stones"],
            "es": ["las plantas", "los animales", "los hongos", "las piedras"],
        },
    },
    "Quelle énergie vient du Soleil ?": {
        "nl": "Welke energie komt van de Zon?",
        "en": "Which energy comes from the Sun?",
        "es": "Que energia proviene del Sol?",
        "opts_i18n": {
            "nl": ["zonne-energie", "windenergie", "waterkrachtenergie", "kernenergie"],
            "en": ["solar energy", "wind energy", "hydraulic energy", "nuclear energy"],
            "es": ["energia solar", "energia eolica", "energia hidraulica", "energia nuclear"],
        },
    },
    "Qu'est-ce qu'un vertébré ?": {
        "nl": "Wat is een gewerveld dier?",
        "en": "What is a vertebrate?",
        "es": "Que es un vertebrado?",
        "opts_i18n": {
            "nl": ["een dier met een wervelkolom", "een dier met 6 poten", "een dier dat vliegt", "een waterlevend dier"],
            "en": ["an animal with a backbone", "an animal with 6 legs", "an animal that flies", "an aquatic animal"],
            "es": ["un animal con columna vertebral", "un animal con 6 patas", "un animal que vuela", "un animal acuatico"],
        },
    },
    "L'eau en état solide est :": {
        "nl": "Water in vaste toestand is:",
        "en": "Water in solid state is:",
        "es": "El agua en estado solido es:",
        "opts_i18n": {
            "nl": ["ijs", "damp", "regen", "dauw"],
            "en": ["ice", "vapour", "rain", "dew"],
            "es": ["hielo", "vapor", "lluvia", "rocio"],
        },
    },
    "Quel sens utilise-t-on pour écouter de la musique ?": {
        "nl": "Welk zintuig gebruik je om naar muziek te luisteren?",
        "en": "Which sense do you use to listen to music?",
        "es": "Que sentido se usa para escuchar musica?",
        "opts_i18n": {
            "nl": ["het gehoor", "het zicht", "de reuk", "het gevoel"],
            "en": ["hearing", "sight", "smell", "touch"],
            "es": ["el oido", "la vista", "el olfato", "el tacto"],
        },
    },
    "Une araignée a combien de pattes ?": {
        "nl": "Hoeveel poten heeft een spin?",
        "en": "How many legs does a spider have?",
        "es": "Cuantas patas tiene una arana?",
        "opts_i18n": {
            "nl": ["8", "6", "4", "10"],
            "en": ["8", "6", "4", "10"],
            "es": ["8", "6", "4", "10"],
        },
    },
    "L'eau en état gazeux est :": {
        "nl": "Water in gasvormige toestand is:",
        "en": "Water in gaseous state is:",
        "es": "El agua en estado gaseoso es:",
        "opts_i18n": {
            "nl": ["damp", "ijs", "sneeuw", "hagel"],
            "en": ["vapour", "ice", "snow", "hail"],
            "es": ["vapor", "hielo", "nieve", "granizo"],
        },
    },
}

# ── Geographie translations ────────────────────────────────────────────────────

GEO_PROMPTS = {
    "Quel est le symbole national belge ?": {
        "nl": "Wat is het nationale symbool van Belgie?",
        "en": "What is the national symbol of Belgium?",
        "es": "Cual es el simbolo nacional belga?",
        "opts_i18n": {
            "nl": ["de leeuw", "de arend", "de haan", "de stier"],
            "en": ["the lion", "the eagle", "the rooster", "the bull"],
            "es": ["el leon", "el aguila", "el gallo", "el toro"],
        },
    },
    "Qu'est-ce que l'Atomium ?": {
        "nl": "Wat is het Atomium?",
        "en": "What is the Atomium?",
        "es": "Que es el Atomium?",
        "opts_i18n": {
            "nl": ["een monument in Brussel", "een vulkaan", "een woud", "een kasteel"],
            "en": ["a monument in Brussels", "a volcano", "a forest", "a castle"],
            "es": ["un monumento en Bruselas", "un volcan", "un bosque", "un castillo"],
        },
    },
    "Dans quelle région se trouve Gand ?": {
        "nl": "In welke regio ligt Gent?",
        "en": "In which region is Ghent located?",
        "es": "En que region se encuentra Gante?",
        "opts_i18n": {
            "nl": ["Vlaanderen", "Wallonie", "Brussel", "Ardennen"],
            "en": ["Flanders", "Wallonia", "Brussels", "Ardennes"],
            "es": ["Flandes", "Valonia", "Bruselas", "Ardenas"],
        },
    },
    "La Belgique fait partie de :": {
        "nl": "Belgie maakt deel uit van:",
        "en": "Belgium is part of:",
        "es": "Belgica forma parte de:",
        "opts_i18n": {
            "nl": ["de Europese Unie", "de Verenigde Staten", "ASEAN", "de Arabische Liga"],
            "en": ["the European Union", "the United States", "ASEAN", "the Arab League"],
            "es": ["la Union Europea", "los Estados Unidos", "la ASEAN", "la Liga Arabe"],
        },
    },
    "Quelle est la capitale de la Belgique ?": {
        "nl": "Wat is de hoofdstad van Belgie?",
        "en": "What is the capital of Belgium?",
        "es": "Cual es la capital de Belgica?",
        "opts_i18n": {
            "nl": ["Brussel", "Antwerpen", "Luik", "Gent"],
            "en": ["Brussels", "Antwerp", "Liege", "Ghent"],
            "es": ["Bruselas", "Amberes", "Lieja", "Gante"],
        },
    },
    "Comment s'appelle la côte belge ?": {
        "nl": "Hoe heet de Belgische kust?",
        "en": "What is the Belgian coast called?",
        "es": "Como se llama la costa belga?",
        "opts_i18n": {
            "nl": ["de Belgische kust", "de Azuurkust", "de Atlantische kust", "de Costa Brava"],
            "en": ["the Belgian Coast", "the Cote d'Azur", "the Atlantic Coast", "the Costa Brava"],
            "es": ["la Costa Belga", "la Costa Azul", "la costa atlantica", "la Costa Brava"],
        },
    },
    "La mer du Nord est :": {
        "nl": "De Noordzee ligt:",
        "en": "The North Sea is:",
        "es": "El Mar del Norte esta:",
        "opts_i18n": {
            "nl": ["ten westen van Belgie", "in het zuiden", "in het oosten", "in het midden"],
            "en": ["to the west of Belgium", "to the south", "to the east", "in the centre"],
            "es": ["al oeste de Belgica", "al sur", "al este", "en el centro"],
        },
    },
    "Quelle ville belge est connue pour ses chocolats ?": {
        "nl": "Welke Belgische stad is bekend om zijn chocolade?",
        "en": "Which Belgian city is known for its chocolates?",
        "es": "Que ciudad belga es conocida por sus chocolates?",
        "opts_i18n": {
            "nl": ["Brussel", "Namen", "Dinant", "Brugge"],
            "en": ["Brussels", "Namur", "Dinant", "Bruges"],
            "es": ["Bruselas", "Namur", "Dinant", "Brujas"],
        },
    },
    "Quelle est la langue parlée en Wallonie ?": {
        "nl": "Welke taal wordt gesproken in Wallonie?",
        "en": "What language is spoken in Wallonia?",
        "es": "Que idioma se habla en Valonia?",
        "opts_i18n": {
            "nl": ["Frans", "Nederlands", "Duits", "Spaans"],
            "en": ["French", "Dutch", "German", "Spanish"],
            "es": ["frances", "neerlandes", "aleman", "espanol"],
        },
    },
    "Anvers est un grand port maritime.": {
        "nl": "Antwerpen is een grote zeehaven.",
        "en": "Antwerp is a major seaport.",
        "es": "Amberes es un gran puerto maritimo.",
    },
    "Dans quelle région se trouve Liège ?": {
        "nl": "In welke regio ligt Luik?",
        "en": "In which region is Liege located?",
        "es": "En que region se encuentra Lieja?",
        "opts_i18n": {
            "nl": ["Wallonie", "Vlaanderen", "Brussel", "Ardennen"],
            "en": ["Wallonia", "Flanders", "Brussels", "Ardennes"],
            "es": ["Valonia", "Flandes", "Bruselas", "Ardenas"],
        },
    },
    "Quel pays borde la Belgique au nord ?": {
        "nl": "Welk land grenst aan Belgie in het noorden?",
        "en": "Which country borders Belgium to the north?",
        "es": "Que pais limita con Belgica por el norte?",
        "opts_i18n": {
            "nl": ["Nederland", "Frankrijk", "Duitsland", "Luxemburg"],
            "en": ["Netherlands", "France", "Germany", "Luxembourg"],
            "es": ["Paises Bajos", "Francia", "Alemania", "Luxemburgo"],
        },
    },
    "La Belgique a une façade sur la mer du Nord.": {
        "nl": "Belgie heeft een kustlijn aan de Noordzee.",
        "en": "Belgium has a coastline on the North Sea.",
        "es": "Belgica tiene costa en el Mar del Norte.",
    },
    "Quel est le continent de la Belgique ?": {
        "nl": "Op welk continent ligt Belgie?",
        "en": "On which continent is Belgium?",
        "es": "En que continente esta Belgica?",
        "opts_i18n": {
            "nl": ["Europa", "Azie", "Afrika", "Amerika"],
            "en": ["Europe", "Asia", "Africa", "America"],
            "es": ["Europa", "Asia", "Africa", "America"],
        },
    },
    "Quelle ville accueille le Grand-Place ?": {
        "nl": "Welke stad herbergt de Grote Markt?",
        "en": "Which city hosts the Grand Place?",
        "es": "Que ciudad alberga la Gran Plaza?",
        "opts_i18n": {
            "nl": ["Brussel", "Luik", "Namen", "Bergen"],
            "en": ["Brussels", "Liege", "Namur", "Mons"],
            "es": ["Bruselas", "Lieja", "Namur", "Mons"],
        },
    },
    "Comment s'appelle le roi de Belgique ?": {
        "nl": "Hoe heet de koning van Belgie?",
        "en": "What is the name of the King of Belgium?",
        "es": "Como se llama el rey de Belgica?",
        "opts_i18n": {
            "nl": ["Philippe", "Albert", "Leopold", "Karel"],
            "en": ["Philippe", "Albert", "Leopold", "Charles"],
            "es": ["Felipe", "Alberto", "Leopoldo", "Carlos"],
        },
    },
    "Quel pays borde la Belgique au sud ?": {
        "nl": "Welk land grenst aan Belgie in het zuiden?",
        "en": "Which country borders Belgium to the south?",
        "es": "Que pais limita con Belgica por el sur?",
        "opts_i18n": {
            "nl": ["Frankrijk", "Nederland", "Duitsland", "Engeland"],
            "en": ["France", "Netherlands", "Germany", "England"],
            "es": ["Francia", "Paises Bajos", "Alemania", "Inglaterra"],
        },
    },
    "Quelle est la langue parlée en Flandre ?": {
        "nl": "Welke taal wordt gesproken in Vlaanderen?",
        "en": "What language is spoken in Flanders?",
        "es": "Que idioma se habla en Flandes?",
        "opts_i18n": {
            "nl": ["Nederlands", "Frans", "Duits", "Engels"],
            "en": ["Dutch", "French", "German", "English"],
            "es": ["neerlandes", "frances", "aleman", "ingles"],
        },
    },
    "Quelle ville belge est surnommée « la Venise du Nord » ?": {
        "nl": "Welke Belgische stad wordt het Venetie van het Noorden genoemd?",
        "en": "Which Belgian city is nicknamed the Venice of the North?",
        "es": "Que ciudad belga es conocida como la Venecia del Norte?",
        "opts_i18n": {
            "nl": ["Brugge", "Gent", "Antwerpen", "Luik"],
            "en": ["Bruges", "Ghent", "Antwerp", "Liege"],
            "es": ["Brujas", "Gante", "Amberes", "Lieja"],
        },
    },
    "Quelle est la monnaie de la Belgique ?": {
        "nl": "Wat is de munteenheid van Belgie?",
        "en": "What is the currency of Belgium?",
        "es": "Cual es la moneda de Belgica?",
        "opts_i18n": {
            "nl": ["de euro", "de frank", "het pond", "de dollar"],
            "en": ["the euro", "the franc", "the pound", "the dollar"],
            "es": ["el euro", "el franco", "la libra", "el dolar"],
        },
    },
    "Quelle est la plus grande ville de Belgique ?": {
        "nl": "Wat is de grootste stad van Belgie?",
        "en": "What is the largest city in Belgium?",
        "es": "Cual es la ciudad mas grande de Belgica?",
        "opts_i18n": {
            "nl": ["Brussel", "Antwerpen", "Gent", "Luik"],
            "en": ["Brussels", "Antwerp", "Ghent", "Liege"],
            "es": ["Bruselas", "Amberes", "Gante", "Lieja"],
        },
    },
    "Quelle forêt belge est très connue ?": {
        "nl": "Welk Belgisch woud is heel bekend?",
        "en": "Which Belgian forest is very well known?",
        "es": "Que bosque belga es muy conocido?",
        "opts_i18n": {
            "nl": ["de Ardennen", "het Zwarte Woud", "de Vogezen", "de Camargue"],
            "en": ["the Ardennes", "the Black Forest", "the Vosges", "the Camargue"],
            "es": ["las Ardenas", "la Selva Negra", "los Vosgos", "la Camarga"],
        },
    },
    "Bruxelles est en Flandre.": {
        "nl": "Brussel ligt in Vlaanderen.",
        "en": "Brussels is in Flanders.",
        "es": "Bruselas esta en Flandes.",
    },
    "Quel fleuve traverse Liège ?": {
        "nl": "Welke rivier stroomt door Luik?",
        "en": "Which river flows through Liege?",
        "es": "Que rio atraviesa Lieja?",
        "opts_i18n": {
            "nl": ["de Maas", "de Schelde", "de Samber", "de Semois"],
            "en": ["the Meuse", "the Scheldt", "the Sambre", "the Semois"],
            "es": ["el Mosa", "el Escalda", "el Sambre", "el Semois"],
        },
    },
    "Combien de régions compte la Belgique ?": {
        "nl": "Hoeveel gewesten heeft Belgie?",
        "en": "How many regions does Belgium have?",
        "es": "Cuantas regiones tiene Belgica?",
        "opts_i18n": {
            "nl": ["3", "2", "4", "5"],
            "en": ["3", "2", "4", "5"],
            "es": ["3", "2", "4", "5"],
        },
    },
}

# ── Grand Defi translations (MATHS/SCIENCES/GEOGRAPHIE/LOGIQUE only) ──────────

GRAND_DEFI_PROMPTS = {
    "[MATHS] 15 + 8 = ?": {"nl": "[MATHS] 15 + 8 = ?", "en": "[MATHS] 15 + 8 = ?", "es": "[MATHS] 15 + 8 = ?"},
    "[MATHS] 20 - 7 = ?": {"nl": "[MATHS] 20 - 7 = ?", "en": "[MATHS] 20 - 7 = ?", "es": "[MATHS] 20 - 7 = ?"},
    "[MATHS] 3 × 4 = ?": {"nl": "[MATHS] 3 × 4 = ?", "en": "[MATHS] 3 × 4 = ?", "es": "[MATHS] 3 × 4 = ?"},
    "[MATHS] 48 + 35 = ?": {"nl": "[MATHS] 48 + 35 = ?", "en": "[MATHS] 48 + 35 = ?", "es": "[MATHS] 48 + 35 = ?"},
    "[MATHS] 7 × 8 = ___.": {"nl": "[MATHS] 7 × 8 = ___.", "en": "[MATHS] 7 × 8 = ___.", "es": "[MATHS] 7 × 8 = ___."},
    "[MATHS] 100 - 37 = ___.": {"nl": "[MATHS] 100 - 37 = ___.", "en": "[MATHS] 100 - 37 = ___.", "es": "[MATHS] 100 - 37 = ___."},
    "[MATHS] 125 + 248 = ___.": {"nl": "[MATHS] 125 + 248 = ___.", "en": "[MATHS] 125 + 248 = ___.", "es": "[MATHS] 125 + 248 = ___."},
    "[MATHS] 9 × 7 = ___.": {"nl": "[MATHS] 9 × 7 = ___.", "en": "[MATHS] 9 × 7 = ___.", "es": "[MATHS] 9 × 7 = ___."},
    "[MATHS] 500 - 163 = ___.": {"nl": "[MATHS] 500 - 163 = ___.", "en": "[MATHS] 500 - 163 = ___.", "es": "[MATHS] 500 - 163 = ___."},
    "[MATHS] 12 × 12 = ___.": {"nl": "[MATHS] 12 × 12 = ___.", "en": "[MATHS] 12 × 12 = ___.", "es": "[MATHS] 12 × 12 = ___."},
    "[MATHS] Combien font 1/2 de 20 ?": {
        "nl": "[MATHS] Hoeveel is 1/2 van 20?",
        "en": "[MATHS] What is 1/2 of 20?",
        "es": "[MATHS] Cuanto es 1/2 de 20?",
    },
    "[MATHS] Combien de centimetres dans 1 metre ?": {
        "nl": "[MATHS] Hoeveel centimeter is 1 meter?",
        "en": "[MATHS] How many centimetres in 1 metre?",
        "es": "[MATHS] Cuantos centimetros tiene 1 metro?",
    },
    "[MATHS] Une semaine a combien de jours ?": {
        "nl": "[MATHS] Hoeveel dagen heeft een week?",
        "en": "[MATHS] How many days does a week have?",
        "es": "[MATHS] Cuantos dias tiene una semana?",
    },
    "[MATHS] 1/4 de 40 = ?": {"nl": "[MATHS] 1/4 van 40 = ?", "en": "[MATHS] 1/4 of 40 = ?", "es": "[MATHS] 1/4 de 40 = ?"},
    "[MATHS] 3/4 de 100 = ___.": {"nl": "[MATHS] 3/4 van 100 = ___.", "en": "[MATHS] 3/4 of 100 = ___.", "es": "[MATHS] 3/4 de 100 = ___."},
    "[MATHS] Combien de grammes dans 1 kilogramme ? ___.": {
        "nl": "[MATHS] Hoeveel gram is 1 kilogram? ___.",
        "en": "[MATHS] How many grams in 1 kilogram? ___.",
        "es": "[MATHS] Cuantos gramos tiene 1 kilogramo? ___.",
    },
    "[MATHS] Un triangle a 4 cotes.": {
        "nl": "[MATHS] Een driehoek heeft 4 zijden.",
        "en": "[MATHS] A triangle has 4 sides.",
        "es": "[MATHS] Un triangulo tiene 4 lados.",
    },
    "[MATHS] 2,5 est plus grand que 2.": {
        "nl": "[MATHS] 2,5 is groter dan 2.",
        "en": "[MATHS] 2.5 is greater than 2.",
        "es": "[MATHS] 2,5 es mayor que 2.",
    },
    "[MATHS] Perimetre d'un carre de cote 5 cm = ___ cm.": {
        "nl": "[MATHS] Omtrek van een vierkant met zijde 5 cm = ___ cm.",
        "en": "[MATHS] Perimeter of a square with side 5 cm = ___ cm.",
        "es": "[MATHS] Perimetro de un cuadrado de lado 5 cm = ___ cm.",
    },
    "[MATHS] Aire d'un rectangle 6 cm × 4 cm = ___ cm².": {
        "nl": "[MATHS] Oppervlakte van een rechthoek 6 cm × 4 cm = ___ cm².",
        "en": "[MATHS] Area of a rectangle 6 cm × 4 cm = ___ cm².",
        "es": "[MATHS] Area de un rectangulo 6 cm × 4 cm = ___ cm².",
    },
    "[MATHS] 3/5 + 1/5 = ___.": {"nl": "[MATHS] 3/5 + 1/5 = ___.", "en": "[MATHS] 3/5 + 1/5 = ___.", "es": "[MATHS] 3/5 + 1/5 = ___."},
    "[MATHS] 0,75 litre = ___ ml.": {"nl": "[MATHS] 0,75 liter = ___ ml.", "en": "[MATHS] 0.75 litre = ___ ml.", "es": "[MATHS] 0,75 litro = ___ ml."},
    "[MATHS] 25% de 200 = ___.": {"nl": "[MATHS] 25% van 200 = ___.", "en": "[MATHS] 25% of 200 = ___.", "es": "[MATHS] 25% de 200 = ___."},
    "[MATHS] 1/2 + 1/4 = ___.": {"nl": "[MATHS] 1/2 + 1/4 = ___.", "en": "[MATHS] 1/2 + 1/4 = ___.", "es": "[MATHS] 1/2 + 1/4 = ___."},
    "[MATHS] 6 × 9 = ?": {"nl": "[MATHS] 6 × 9 = ?", "en": "[MATHS] 6 × 9 = ?", "es": "[MATHS] 6 × 9 = ?"},
    "[MATHS] 72 ÷ 8 = ?": {"nl": "[MATHS] 72 ÷ 8 = ?", "en": "[MATHS] 72 ÷ 8 = ?", "es": "[MATHS] 72 ÷ 8 = ?"},
    "[MATHS] 11 × 11 = ___.": {"nl": "[MATHS] 11 × 11 = ___.", "en": "[MATHS] 11 × 11 = ___.", "es": "[MATHS] 11 × 11 = ___."},
    "[MATHS] Perimetre d'un rectangle 8 cm × 3 cm = ___ cm.": {
        "nl": "[MATHS] Omtrek van een rechthoek 8 cm × 3 cm = ___ cm.",
        "en": "[MATHS] Perimeter of a rectangle 8 cm × 3 cm = ___ cm.",
        "es": "[MATHS] Perimetro de un rectangulo 8 cm × 3 cm = ___ cm.",
    },
    "[MATHS] 15% de 80 = ___.": {"nl": "[MATHS] 15% van 80 = ___.", "en": "[MATHS] 15% of 80 = ___.", "es": "[MATHS] 15% de 80 = ___."},
    "[MATHS] Angle d'un carre : ___ degres.": {
        "nl": "[MATHS] Hoek van een vierkant: ___ graden.",
        "en": "[MATHS] Angle of a square: ___ degrees.",
        "es": "[MATHS] Angulo de un cuadrado: ___ grados.",
    },
    "[MATHS] 2/3 de 120 = ___.": {"nl": "[MATHS] 2/3 van 120 = ___.", "en": "[MATHS] 2/3 of 120 = ___.", "es": "[MATHS] 2/3 de 120 = ___."},
    "[MATHS] Combien de minutes dans 1 heure ?": {
        "nl": "[MATHS] Hoeveel minuten heeft 1 uur?",
        "en": "[MATHS] How many minutes in 1 hour?",
        "es": "[MATHS] Cuantos minutos tiene 1 hora?",
    },
    "[MATHS] Il est 14h00. Quelle heure est-il en heure civile ?": {
        "nl": "[MATHS] Het is 14:00. Hoe laat is het in gewone tijd?",
        "en": "[MATHS] It is 14:00. What time is it in civilian time?",
        "es": "[MATHS] Son las 14:00. Que hora es en hora civil?",
    },
    "[MATHS] Il est 10h15. Dans 45 minutes il sera ___ h ___.": {
        "nl": "[MATHS] Het is 10:15. Over 45 minuten is het ___ u ___.",
        "en": "[MATHS] It is 10:15. In 45 minutes it will be ___ h ___.",
        "es": "[MATHS] Son las 10:15. En 45 minutos seran las ___ h ___.",
    },
    "[MATHS] 1 annee bissextile a 366 jours.": {
        "nl": "[MATHS] Een schrikkeljaar heeft 366 dagen.",
        "en": "[MATHS] A leap year has 366 days.",
        "es": "[MATHS] Un anno bisiesto tiene 366 dias.",
    },
    "[MATHS] Il est 23h45. Dans 20 minutes il sera ___ h ___.": {
        "nl": "[MATHS] Het is 23:45. Over 20 minuten is het ___ u ___.",
        "en": "[MATHS] It is 23:45. In 20 minutes it will be ___ h ___.",
        "es": "[MATHS] Son las 23:45. En 20 minutos seran las ___ h ___.",
    },
    "[MATHS] Exprimer 2h30min en minutes : ___ minutes.": {
        "nl": "[MATHS] Druk 2u30min uit in minuten: ___ minuten.",
        "en": "[MATHS] Express 2h30min in minutes: ___ minutes.",
        "es": "[MATHS] Expresar 2h30min en minutos: ___ minutos.",
    },
    "[MATHS] Dans 1 000, combien y a-t-il de dizaines ? ___": {
        "nl": "[MATHS] Hoeveel tientallen zitten er in 1.000? ___",
        "en": "[MATHS] In 1,000, how many tens are there? ___",
        "es": "[MATHS] En 1.000, cuantas decenas hay? ___",
    },
    "[MATHS] 5 + 5 + 5 = ?": {"nl": "[MATHS] 5 + 5 + 5 = ?", "en": "[MATHS] 5 + 5 + 5 = ?", "es": "[MATHS] 5 + 5 + 5 = ?"},
    "[MATHS] 25 + 25 = ?": {"nl": "[MATHS] 25 + 25 = ?", "en": "[MATHS] 25 + 25 = ?", "es": "[MATHS] 25 + 25 = ?"},
    "[MATHS] 8 × 7 = ___.": {"nl": "[MATHS] 8 × 7 = ___.", "en": "[MATHS] 8 × 7 = ___.", "es": "[MATHS] 8 × 7 = ___."},
    "[MATHS] 144 ÷ 12 = ___.": {"nl": "[MATHS] 144 ÷ 12 = ___.", "en": "[MATHS] 144 ÷ 12 = ___.", "es": "[MATHS] 144 ÷ 12 = ___."},
    "[MATHS] 2/5 de 200 = ___.": {"nl": "[MATHS] 2/5 van 200 = ___.", "en": "[MATHS] 2/5 of 200 = ___.", "es": "[MATHS] 2/5 de 200 = ___."},
    "[MATHS] 3/4 - 1/4 = ___.": {"nl": "[MATHS] 3/4 - 1/4 = ___.", "en": "[MATHS] 3/4 - 1/4 = ___.", "es": "[MATHS] 3/4 - 1/4 = ___."},
    "[MATHS] 1 000 000 s'appelle ___ (en lettres).": {
        "nl": "[MATHS] 1.000.000 heet ___ (in letters).",
        "en": "[MATHS] 1,000,000 is called ___ (in words).",
        "es": "[MATHS] 1.000.000 se llama ___ (en letras).",
    },
    "[MATHS] Quel est le PGCD de 12 et 8 ? ___": {
        "nl": "[MATHS] Wat is de GGD van 12 en 8? ___",
        "en": "[MATHS] What is the GCD of 12 and 8? ___",
        "es": "[MATHS] Cual es el MCD de 12 y 8? ___",
    },
    "[MATHS] Quelle fraction est egale a 0,5 ? ___": {
        "nl": "[MATHS] Welke breuk is gelijk aan 0,5? ___",
        "en": "[MATHS] Which fraction is equal to 0.5? ___",
        "es": "[MATHS] Que fraccion es igual a 0,5? ___",
    },
    # SCIENCES
    "[SCIENCES] La photosynthese se fait dans :": {
        "nl": "[SCIENCES] Fotosynthese vindt plaats in:",
        "en": "[SCIENCES] Photosynthesis takes place in:",
        "es": "[SCIENCES] La fotosintesis ocurre en:",
    },
    "[SCIENCES] Un herbivore mange :": {
        "nl": "[SCIENCES] Een herbivoor eet:",
        "en": "[SCIENCES] A herbivore eats:",
        "es": "[SCIENCES] Un herbivoro come:",
    },
    "[SCIENCES] L'eau bout a :": {
        "nl": "[SCIENCES] Water kookt bij:",
        "en": "[SCIENCES] Water boils at:",
        "es": "[SCIENCES] El agua hierve a:",
    },
    "[SCIENCES] Les insectes ont 6 pattes.": {
        "nl": "[SCIENCES] Insecten hebben 6 poten.",
        "en": "[SCIENCES] Insects have 6 legs.",
        "es": "[SCIENCES] Los insectos tienen 6 patas.",
    },
    "[SCIENCES] La Terre tourne autour du Soleil.": {
        "nl": "[SCIENCES] De Aarde draait om de Zon.",
        "en": "[SCIENCES] The Earth revolves around the Sun.",
        "es": "[SCIENCES] La Tierra gira alrededor del Sol.",
    },
    "[SCIENCES] Un mammifere se distingue par :": {
        "nl": "[SCIENCES] Een zoogdier onderscheidt zich doordat:",
        "en": "[SCIENCES] A mammal is distinguished by:",
        "es": "[SCIENCES] Un mamifero se distingue por:",
    },
    "[SCIENCES] La lumiere voyage plus vite que le son.": {
        "nl": "[SCIENCES] Licht reist sneller dan geluid.",
        "en": "[SCIENCES] Light travels faster than sound.",
        "es": "[SCIENCES] La luz viaja mas rapido que el sonido.",
    },
    "[SCIENCES] Les plantes fabriquent leur nourriture grace a la ___.": {
        "nl": "[SCIENCES] Planten maken hun voedsel dankzij ___.",
        "en": "[SCIENCES] Plants make their food through ___.",
        "es": "[SCIENCES] Las plantas fabrican su alimento gracias a la ___.",
    },
    "[SCIENCES] Le coeur pompe :": {
        "nl": "[SCIENCES] Het hart pompt:",
        "en": "[SCIENCES] The heart pumps:",
        "es": "[SCIENCES] El corazon bombea:",
    },
    "[SCIENCES] La metamorphose : chenille → cocon → ___": {
        "nl": "[SCIENCES] De metamorfose: rups → cocon → ___",
        "en": "[SCIENCES] Metamorphosis: caterpillar → cocoon → ___",
        "es": "[SCIENCES] La metamorfosis: oruga → capullo → ___",
    },
    "[SCIENCES] L'ADN se trouve dans :": {
        "nl": "[SCIENCES] DNA bevindt zich in:",
        "en": "[SCIENCES] DNA is found in:",
        "es": "[SCIENCES] El ADN se encuentra en:",
    },
    # GEOGRAPHIE
    "[GEOGRAPHIE] La capitale de la Belgique est :": {
        "nl": "[GEOGRAPHIE] De hoofdstad van Belgie is:",
        "en": "[GEOGRAPHIE] The capital of Belgium is:",
        "es": "[GEOGRAPHIE] La capital de Belgica es:",
    },
    "[GEOGRAPHIE] La Belgique a combien de communautes linguistiques ?": {
        "nl": "[GEOGRAPHIE] Hoeveel taalgemeenschappen heeft Belgie?",
        "en": "[GEOGRAPHIE] How many linguistic communities does Belgium have?",
        "es": "[GEOGRAPHIE] Cuantas comunidades linguisticas tiene Belgica?",
    },
    "[GEOGRAPHIE] Le fleuve qui traverse Bruxelles s'appelle :": {
        "nl": "[GEOGRAPHIE] De rivier die door Brussel stroomt heet:",
        "en": "[GEOGRAPHIE] The river that flows through Brussels is called:",
        "es": "[GEOGRAPHIE] El rio que atraviesa Bruselas se llama:",
    },
    "[GEOGRAPHIE] Quel ocean borde l'Europe a l'ouest ?": {
        "nl": "[GEOGRAPHIE] Welke oceaan begrenst Europa in het westen?",
        "en": "[GEOGRAPHIE] Which ocean borders Europe to the west?",
        "es": "[GEOGRAPHIE] Que oceano bordea Europa por el oeste?",
    },
    "[GEOGRAPHIE] La region francophone de Belgique s'appelle :": {
        "nl": "[GEOGRAPHIE] De Franstalige regio van Belgie heet:",
        "en": "[GEOGRAPHIE] The French-speaking region of Belgium is called:",
        "es": "[GEOGRAPHIE] La region francofona de Belgica se llama:",
    },
    "[GEOGRAPHIE] La Meuse est :": {
        "nl": "[GEOGRAPHIE] De Maas is:",
        "en": "[GEOGRAPHIE] The Meuse is:",
        "es": "[GEOGRAPHIE] El Mosa es:",
    },
    "[GEOGRAPHIE] Paris est la capitale de :": {
        "nl": "[GEOGRAPHIE] Parijs is de hoofdstad van:",
        "en": "[GEOGRAPHIE] Paris is the capital of:",
        "es": "[GEOGRAPHIE] Paris es la capital de:",
    },
    "[GEOGRAPHIE] Quel pays est voisin de la Belgique a l'est ?": {
        "nl": "[GEOGRAPHIE] Welk land grenst aan Belgie in het oosten?",
        "en": "[GEOGRAPHIE] Which country neighbours Belgium to the east?",
        "es": "[GEOGRAPHIE] Que pais vecino tiene Belgica por el este?",
    },
    # LOGIQUE
    "[LOGIQUE] Quelle vient apres ? Lundi, Mardi, ___": {
        "nl": "[LOGIQUE] Wat komt hierna? Maandag, Dinsdag, ___",
        "en": "[LOGIQUE] What comes next? Monday, Tuesday, ___",
        "es": "[LOGIQUE] Que viene despues? Lunes, Martes, ___",
    },
    "[LOGIQUE] Quel mois vient apres mars ?": {
        "nl": "[LOGIQUE] Welke maand komt na maart?",
        "en": "[LOGIQUE] Which month comes after March?",
        "es": "[LOGIQUE] Que mes viene despues de marzo?",
    },
    "[LOGIQUE] Trouve l'intrus : pomme, poire, carotte, fraise.": {
        "nl": "[LOGIQUE] Vind de indringer: appel, peer, wortel, aardbei.",
        "en": "[LOGIQUE] Find the odd one out: apple, pear, carrot, strawberry.",
        "es": "[LOGIQUE] Encuentra el intruso: manzana, pera, zanahoria, fresa.",
    },
    "[LOGIQUE] Sequence : 2, 4, 6, 8, ___": {
        "nl": "[LOGIQUE] Reeks: 2, 4, 6, 8, ___",
        "en": "[LOGIQUE] Sequence: 2, 4, 6, 8, ___",
        "es": "[LOGIQUE] Secuencia: 2, 4, 6, 8, ___",
    },
    "[LOGIQUE] Sequence : 100, 90, 80, ___": {
        "nl": "[LOGIQUE] Reeks: 100, 90, 80, ___",
        "en": "[LOGIQUE] Sequence: 100, 90, 80, ___",
        "es": "[LOGIQUE] Secuencia: 100, 90, 80, ___",
    },
    "[LOGIQUE] Trouve l'intrus : bus, train, avion, velo, chaise.": {
        "nl": "[LOGIQUE] Vind de indringer: bus, trein, vliegtuig, fiets, stoel.",
        "en": "[LOGIQUE] Find the odd one out: bus, train, plane, bicycle, chair.",
        "es": "[LOGIQUE] Encuentra el intruso: autobus, tren, avion, bici, silla.",
    },
    "[LOGIQUE] Sequence : 1, 2, 4, 8, ___": {
        "nl": "[LOGIQUE] Reeks: 1, 2, 4, 8, ___",
        "en": "[LOGIQUE] Sequence: 1, 2, 4, 8, ___",
        "es": "[LOGIQUE] Secuencia: 1, 2, 4, 8, ___",
    },
    "[LOGIQUE] Sequence : 1, 1, 2, 3, 5, 8, ___": {
        "nl": "[LOGIQUE] Reeks: 1, 1, 2, 3, 5, 8, ___",
        "en": "[LOGIQUE] Sequence: 1, 1, 2, 3, 5, 8, ___",
        "es": "[LOGIQUE] Secuencia: 1, 1, 2, 3, 5, 8, ___",
    },
    "[LOGIQUE] Si tous les chats sont des animaux et Minou est un chat, alors :": {
        "nl": "[LOGIQUE] Als alle katten dieren zijn en Minou een kat is, dan:",
        "en": "[LOGIQUE] If all cats are animals and Minou is a cat, then:",
        "es": "[LOGIQUE] Si todos los gatos son animales y Minou es un gato, entonces:",
    },
    "[LOGIQUE] Sequence : 3, 6, 12, 24, ___": {
        "nl": "[LOGIQUE] Reeks: 3, 6, 12, 24, ___",
        "en": "[LOGIQUE] Sequence: 3, 6, 12, 24, ___",
        "es": "[LOGIQUE] Secuencia: 3, 6, 12, 24, ___",
    },
    "[LOGIQUE] Sequence : 5, 10, 15, 20, ___": {
        "nl": "[LOGIQUE] Reeks: 5, 10, 15, 20, ___",
        "en": "[LOGIQUE] Sequence: 5, 10, 15, 20, ___",
        "es": "[LOGIQUE] Secuencia: 5, 10, 15, 20, ___",
    },
}

TRANSLATABLE_GD_TAGS = ["[MATHS]", "[SCIENCES]", "[GEOGRAPHIE]", "[LOGIQUE]"]


def apply_translation(q, t_dict, add_opts_i18n=False):
    """Apply translations from t_dict to question q. Returns True if changed."""
    prompt = q.get("prompt", "")
    t = t_dict.get(prompt)
    if not t:
        return False
    changed = False
    for lang in ("nl", "en", "es"):
        if lang in t and f"prompt_{lang}" not in q:
            q[f"prompt_{lang}"] = t[lang]
            changed = True
    if add_opts_i18n and "opts_i18n" in t and q.get("type") == "mcq" and "options_i18n" not in q:
        q["options_i18n"] = t["opts_i18n"]
        changed = True
    return changed


def process_calcul_mental(path):
    data = load(path)
    count = 0
    for level_data in data.get("levels", {}).values():
        for q in level_data.get("questions", []):
            if "prompt_nl" not in q:
                p = q.get("prompt", "")
                q["prompt_nl"] = p
                q["prompt_en"] = p
                q["prompt_es"] = p
                count += 1
    save(path, data)
    return count


def process_sciences(path):
    data = load(path)
    count = 0
    for level_data in data.get("levels", {}).values():
        for q in level_data.get("questions", []):
            if apply_translation(q, SCIENCES_PROMPTS, add_opts_i18n=True):
                count += 1
    save(path, data)
    return count


def process_geographie(path):
    data = load(path)
    count = 0
    for level_data in data.get("levels", {}).values():
        for q in level_data.get("questions", []):
            if apply_translation(q, GEO_PROMPTS, add_opts_i18n=True):
                count += 1
    save(path, data)
    return count


def process_grand_defi(path):
    data = load(path)
    count = 0
    for level_data in data.get("levels", {}).values():
        for q in level_data.get("questions", []):
            prompt = q.get("prompt", "")
            if any(tag in prompt for tag in TRANSLATABLE_GD_TAGS):
                if "prompt_nl" not in q:
                    if not apply_translation(q, GRAND_DEFI_PROMPTS):
                        # Fallback for pure math expressions not in dict
                        q["prompt_nl"] = prompt
                        q["prompt_en"] = prompt
                        q["prompt_es"] = prompt
                    count += 1
    save(path, data)
    return count


def main():
    total_files = 0
    total_q = 0

    for f in sorted(glob.glob(os.path.join(BASE, "calcul-mental", "*.json"))):
        n = process_calcul_mental(f)
        print(f"calcul-mental/{os.path.basename(f)}: {n}")
        total_files += 1
        total_q += n

    for f in sorted(glob.glob(os.path.join(BASE, "sciences", "*.json"))):
        n = process_sciences(f)
        print(f"sciences/{os.path.basename(f)}: {n}")
        total_files += 1
        total_q += n

    for f in sorted(glob.glob(os.path.join(BASE, "geographie-belgique", "*.json"))):
        n = process_geographie(f)
        print(f"geographie-belgique/{os.path.basename(f)}: {n}")
        total_files += 1
        total_q += n

    for f in sorted(glob.glob(os.path.join(BASE, "grand-defi", "*.json"))):
        n = process_grand_defi(f)
        print(f"grand-defi/{os.path.basename(f)}: {n}")
        total_files += 1
        total_q += n

    print(f"\nTotal: {total_files} files, {total_q} questions translated.")


if __name__ == "__main__":
    main()
