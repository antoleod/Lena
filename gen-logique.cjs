const fs = require('fs');
const path = require('path');
const dir = 'src/content/exams/logique';

function write(filename, data) {
  fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2));
  console.log('wrote ' + filename);
}

function exam(id, title, emoji, order, facile, moyen, difficile) {
  return {
    id, category: 'logique', categoryLabel: 'Logique', categoryEmoji: '🧠',
    categoryOrder: 10, title, emoji, order,
    levels: {
      facile: { passPercent: 60, questions: facile },
      moyen: { passPercent: 65, questions: moyen },
      difficile: { passPercent: 70, questions: difficile },
    }
  };
}

function q(id, prompt, prompt_nl, prompt_en, prompt_es, options, answer, cor, cor_nl, cor_en, cor_es) {
  return { id, type: 'mcq', prompt, prompt_nl, prompt_en, prompt_es, options, answer,
    correction: cor, correction_nl: cor_nl, correction_en: cor_en, correction_es: cor_es };
}

// ── 01 Suites +N ──────────────────────────────────────────────────────────────
write('logique-01.json', exam('logique-01','Suites qui montent 📈','📈',1,
  [
    q('l01-f01','Continue : 2, 4, 6, 8, …','Ga verder: 2, 4, 6, 8, …','Continue: 2, 4, 6, 8, …','Continúa: 2, 4, 6, 8, …',['9','10','11','12'],'10','+2 : 10.','+2: 10.','Add 2: 10.','Suma 2: 10.'),
    q('l01-f02','Continue : 1, 2, 3, 4, …','Ga verder: 1, 2, 3, 4, …','Continue: 1, 2, 3, 4, …','Continúa: 1, 2, 3, 4, …',['4','5','6','7'],'5','+1 : 5.','+1: 5.','Add 1: 5.','Suma 1: 5.'),
    q('l01-f03','Continue : 5, 7, 9, 11, …','Ga verder: 5, 7, 9, 11, …','Continue: 5, 7, 9, 11, …','Continúa: 5, 7, 9, 11, …',['12','13','14','15'],'13','+2 : 13.','+2: 13.','Add 2: 13.','Suma 2: 13.'),
    q('l01-f04','Continue : 0, 3, 6, 9, …','Ga verder: 0, 3, 6, 9, …','Continue: 0, 3, 6, 9, …','Continúa: 0, 3, 6, 9, …',['10','11','12','13'],'12','+3 : 12.','+3: 12.','Add 3: 12.','Suma 3: 12.'),
    q('l01-f05','Continue : 10, 11, 12, 13, …','Ga verder: 10, 11, 12, 13, …','Continue: 10, 11, 12, 13, …','Continúa: 10, 11, 12, 13, …',['13','14','15','16'],'14','+1 : 14.','+1: 14.','Add 1: 14.','Suma 1: 14.'),
    q('l01-f06','Continue : 1, 4, 7, 10, …','Ga verder: 1, 4, 7, 10, …','Continue: 1, 4, 7, 10, …','Continúa: 1, 4, 7, 10, …',['11','12','13','14'],'13','+3 : 13.','+3: 13.','Add 3: 13.','Suma 3: 13.'),
    q('l01-f07','Continue : 4, 6, 8, 10, …','Ga verder: 4, 6, 8, 10, …','Continue: 4, 6, 8, 10, …','Continúa: 4, 6, 8, 10, …',['11','12','13','14'],'12','+2 : 12.','+2: 12.','Add 2: 12.','Suma 2: 12.'),
    q('l01-f08','Continue : 0, 5, 10, 15, …','Ga verder: 0, 5, 10, 15, …','Continue: 0, 5, 10, 15, …','Continúa: 0, 5, 10, 15, …',['18','20','22','25'],'20','+5 : 20.','+5: 20.','Add 5: 20.','Suma 5: 20.'),
    q('l01-f09','Continue : 3, 6, 9, 12, …','Ga verder: 3, 6, 9, 12, …','Continue: 3, 6, 9, 12, …','Continúa: 3, 6, 9, 12, …',['14','15','16','17'],'15','+3 : 15.','+3: 15.','Add 3: 15.','Suma 3: 15.'),
    q('l01-f10','Continue : 7, 9, 11, 13, …','Ga verder: 7, 9, 11, 13, …','Continue: 7, 9, 11, 13, …','Continúa: 7, 9, 11, 13, …',['14','15','16','17'],'15','+2 : 15.','+2: 15.','Add 2: 15.','Suma 2: 15.'),
  ],
  [
    q('l01-m01','Continue : 5, 10, 15, 20, …','Ga verder: 5, 10, 15, 20, …','Continue: 5, 10, 15, 20, …','Continúa: 5, 10, 15, 20, …',['23','25','27','30'],'25','+5 : 25.','+5: 25.','Add 5: 25.','Suma 5: 25.'),
    q('l01-m02','Continue : 7, 11, 15, 19, …','Ga verder: 7, 11, 15, 19, …','Continue: 7, 11, 15, 19, …','Continúa: 7, 11, 15, 19, …',['21','22','23','24'],'23','+4 : 23.','+4: 23.','Add 4: 23.','Suma 4: 23.'),
    q('l01-m03','Continue : 3, 10, 17, 24, …','Ga verder: 3, 10, 17, 24, …','Continue: 3, 10, 17, 24, …','Continúa: 3, 10, 17, 24, …',['28','30','31','33'],'31','+7 : 31.','+7: 31.','Add 7: 31.','Suma 7: 31.'),
    q('l01-m04','Continue : 10, 20, 30, 40, …','Ga verder: 10, 20, 30, 40, …','Continue: 10, 20, 30, 40, …','Continúa: 10, 20, 30, 40, …',['45','48','50','55'],'50','+10 : 50.','+10: 50.','Add 10: 50.','Suma 10: 50.'),
    q('l01-m05','Continue : 2, 9, 16, 23, …','Ga verder: 2, 9, 16, 23, …','Continue: 2, 9, 16, 23, …','Continúa: 2, 9, 16, 23, …',['28','30','32','34'],'30','+7 : 30.','+7: 30.','Add 7: 30.','Suma 7: 30.'),
    q('l01-m06','Continue : 4, 10, 16, 22, …','Ga verder: 4, 10, 16, 22, …','Continue: 4, 10, 16, 22, …','Continúa: 4, 10, 16, 22, …',['26','28','30','32'],'28','+6 : 28.','+6: 28.','Add 6: 28.','Suma 6: 28.'),
    q('l01-m07','Continue : 1, 6, 11, 16, …','Ga verder: 1, 6, 11, 16, …','Continue: 1, 6, 11, 16, …','Continúa: 1, 6, 11, 16, …',['19','20','21','22'],'21','+5 : 21.','+5: 21.','Add 5: 21.','Suma 5: 21.'),
    q('l01-m08','Continue : 12, 20, 28, 36, …','Ga verder: 12, 20, 28, 36, …','Continue: 12, 20, 28, 36, …','Continúa: 12, 20, 28, 36, …',['42','44','46','48'],'44','+8 : 44.','+8: 44.','Add 8: 44.','Suma 8: 44.'),
    q('l01-m09','Continue : 0, 11, 22, 33, …','Ga verder: 0, 11, 22, 33, …','Continue: 0, 11, 22, 33, …','Continúa: 0, 11, 22, 33, …',['40','42','44','46'],'44','+11 : 44.','+11: 44.','Add 11: 44.','Suma 11: 44.'),
    q('l01-m10','Continue : 6, 15, 24, 33, …','Ga verder: 6, 15, 24, 33, …','Continue: 6, 15, 24, 33, …','Continúa: 6, 15, 24, 33, …',['40','41','42','43'],'42','+9 : 42.','+9: 42.','Add 9: 42.','Suma 9: 42.'),
  ],
  [
    q('l01-d01','Continue : 1, 1, 2, 3, 5, 8, …','Ga verder: 1, 1, 2, 3, 5, 8, …','Continue: 1, 1, 2, 3, 5, 8, …','Continúa: 1, 1, 2, 3, 5, 8, …',['11','12','13','14'],'13','Fibonacci : 5+8=13.','Fibonacci: 5+8=13.','Fibonacci: 5+8=13.','Fibonacci: 5+8=13.'),
    q('l01-d02','Continue : 1, 4, 9, 16, 25, …','Ga verder: 1, 4, 9, 16, 25, …','Continue: 1, 4, 9, 16, 25, …','Continúa: 1, 4, 9, 16, 25, …',['30','34','36','38'],'36','Carrés : 6²=36.','Kwadraten: 6²=36.','Squares: 6²=36.','Cuadrados: 6²=36.'),
    q('l01-d03','Continue : 2, 3, 5, 8, 12, …','Ga verder: 2, 3, 5, 8, 12, …','Continue: 2, 3, 5, 8, 12, …','Continúa: 2, 3, 5, 8, 12, …',['15','16','17','18'],'17','Écarts +1,+2,+3,+4,+5 : 17.','+1,+2,+3,+4,+5: 17.','Gaps: +5=17.','Diferencias: +5=17.'),
    q('l01-d04','Continue : 3, 6, 11, 18, 27, …','Ga verder: 3, 6, 11, 18, 27, …','Continue: 3, 6, 11, 18, 27, …','Continúa: 3, 6, 11, 18, 27, …',['36','38','40','42'],'38','Écarts +3,+5,+7,+9,+11 : 38.','+3,+5,+7,+9,+11: 38.','Gaps +3,+5,+7,+9,+11: 38.','Dif. +3,+5,+7,+9,+11: 38.'),
    q('l01-d05','Continue : 1, 3, 7, 15, 31, …','Ga verder: 1, 3, 7, 15, 31, …','Continue: 1, 3, 7, 15, 31, …','Continúa: 1, 3, 7, 15, 31, …',['55','61','63','65'],'63','×2+1 : 31×2+1=63.','×2+1: 63.','×2+1: 63.','×2+1: 63.'),
    q('l01-d06','Quelle règle ? 5, 8, 13, 21, 34, …','Welke regel? 5, 8, 13, 21, 34, …','What rule? 5, 8, 13, 21, 34, …','¿Qué regla? 5, 8, 13, 21, 34, …',['52','55','57','60'],'55','Fibonacci décalé : 21+34=55.','Fibonacci verschoven: 55.','Shifted Fibonacci: 55.','Fibonacci desplazado: 55.'),
    q('l01-d07','Continue : 2, 5, 10, 17, 26, …','Ga verder: 2, 5, 10, 17, 26, …','Continue: 2, 5, 10, 17, 26, …','Continúa: 2, 5, 10, 17, 26, …',['35','37','38','40'],'37','Écarts +3,+5,+7,+9,+11 : +11=37.','+3,+5,+7,+9,+11: 37.','Gaps: +11=37.','Dif.: +11=37.'),
    q('l01-d08','Continue : 100, 91, 82, 73, …','Ga verder: 100, 91, 82, 73, …','Continue: 100, 91, 82, 73, …','Continúa: 100, 91, 82, 73, …',['62','63','64','65'],'64','-9 : 73-9=64.','-9: 64.','Subtract 9: 64.','Resta 9: 64.'),
    q('l01-d09','Continue : 0, 1, 3, 6, 10, …','Ga verder: 0, 1, 3, 6, 10, …','Continue: 0, 1, 3, 6, 10, …','Continúa: 0, 1, 3, 6, 10, …',['13','14','15','16'],'15','Nombres triangulaires +5 : 15.','Driehoeksgetallen: 15.','Triangular numbers: 15.','Números triangulares: 15.'),
    q('l01-d10','Continue : 50, 45, 39, 32, 24, …','Ga verder: 50, 45, 39, 32, 24, …','Continue: 50, 45, 39, 32, 24, …','Continúa: 50, 45, 39, 32, 24, …',['13','15','16','17'],'15','Écarts -5,-6,-7,-8,-9 : -9=15.','-5,-6,-7,-8,-9: 15.','-5,-6,-7,-8,-9: 15.','-5,-6,-7,-8,-9: 15.'),
  ]
));

// ── 02 Suites qui descendent ──────────────────────────────────────────────────
write('logique-02.json', exam('logique-02','Suites qui descendent 📉','📉',2,
  [
    q('l02-f01','Continue : 10, 9, 8, 7, …','Ga verder: 10, 9, 8, 7, …','Continue: 10, 9, 8, 7, …','Continúa: 10, 9, 8, 7, …',['5','6','7','4'],'6','-1 : 6.','-1: 6.','Subtract 1: 6.','Resta 1: 6.'),
    q('l02-f02','Continue : 20, 18, 16, 14, …','Ga verder: 20, 18, 16, 14, …','Continue: 20, 18, 16, 14, …','Continúa: 20, 18, 16, 14, …',['10','11','12','13'],'12','-2 : 12.','-2: 12.','Subtract 2: 12.','Resta 2: 12.'),
    q('l02-f03','Continue : 15, 12, 9, 6, …','Ga verder: 15, 12, 9, 6, …','Continue: 15, 12, 9, 6, …','Continúa: 15, 12, 9, 6, …',['2','3','4','5'],'3','-3 : 3.','-3: 3.','Subtract 3: 3.','Resta 3: 3.'),
    q('l02-f04','Continue : 30, 25, 20, 15, …','Ga verder: 30, 25, 20, 15, …','Continue: 30, 25, 20, 15, …','Continúa: 30, 25, 20, 15, …',['8','9','10','11'],'10','-5 : 10.','-5: 10.','Subtract 5: 10.','Resta 5: 10.'),
    q('l02-f05','Continue : 8, 7, 6, 5, …','Ga verder: 8, 7, 6, 5, …','Continue: 8, 7, 6, 5, …','Continúa: 8, 7, 6, 5, …',['2','3','4','5'],'4','-1 : 4.','-1: 4.','Subtract 1: 4.','Resta 1: 4.'),
    q('l02-f06','Continue : 12, 10, 8, 6, …','Ga verder: 12, 10, 8, 6, …','Continue: 12, 10, 8, 6, …','Continúa: 12, 10, 8, 6, …',['2','3','4','5'],'4','-2 : 4.','-2: 4.','Subtract 2: 4.','Resta 2: 4.'),
    q('l02-f07','Continue : 50, 40, 30, 20, …','Ga verder: 50, 40, 30, 20, …','Continue: 50, 40, 30, 20, …','Continúa: 50, 40, 30, 20, …',['5','8','10','12'],'10','-10 : 10.','-10: 10.','Subtract 10: 10.','Resta 10: 10.'),
    q('l02-f08','Continue : 9, 8, 7, 6, …','Ga verder: 9, 8, 7, 6, …','Continue: 9, 8, 7, 6, …','Continúa: 9, 8, 7, 6, …',['3','4','5','6'],'5','-1 : 5.','-1: 5.','Subtract 1: 5.','Resta 1: 5.'),
    q('l02-f09','Continue : 18, 15, 12, 9, …','Ga verder: 18, 15, 12, 9, …','Continue: 18, 15, 12, 9, …','Continúa: 18, 15, 12, 9, …',['4','5','6','7'],'6','-3 : 6.','-3: 6.','Subtract 3: 6.','Resta 3: 6.'),
    q('l02-f10','Continue : 20, 16, 12, 8, …','Ga verder: 20, 16, 12, 8, …','Continue: 20, 16, 12, 8, …','Continúa: 20, 16, 12, 8, …',['2','3','4','5'],'4','-4 : 4.','-4: 4.','Subtract 4: 4.','Resta 4: 4.'),
  ],
  [
    q('l02-m01','Continue : 100, 90, 80, 70, …','Ga verder: 100, 90, 80, 70, …','Continue: 100, 90, 80, 70, …','Continúa: 100, 90, 80, 70, …',['55','60','65','70'],'60','-10 : 60.','-10: 60.','Subtract 10: 60.','Resta 10: 60.'),
    q('l02-m02','Continue : 50, 43, 36, 29, …','Ga verder: 50, 43, 36, 29, …','Continue: 50, 43, 36, 29, …','Continúa: 50, 43, 36, 29, …',['20','22','24','26'],'22','-7 : 22.','-7: 22.','Subtract 7: 22.','Resta 7: 22.'),
    q('l02-m03','Continue : 80, 71, 62, 53, …','Ga verder: 80, 71, 62, 53, …','Continue: 80, 71, 62, 53, …','Continúa: 80, 71, 62, 53, …',['42','44','46','48'],'44','-9 : 44.','-9: 44.','Subtract 9: 44.','Resta 9: 44.'),
    q('l02-m04','Continue : 60, 54, 48, 42, …','Ga verder: 60, 54, 48, 42, …','Continue: 60, 54, 48, 42, …','Continúa: 60, 54, 48, 42, …',['34','36','38','40'],'36','-6 : 36.','-6: 36.','Subtract 6: 36.','Resta 6: 36.'),
    q('l02-m05','Continue : 99, 88, 77, 66, …','Ga verder: 99, 88, 77, 66, …','Continue: 99, 88, 77, 66, …','Continúa: 99, 88, 77, 66, …',['53','55','57','59'],'55','-11 : 55.','-11: 55.','Subtract 11: 55.','Resta 11: 55.'),
    q('l02-m06','Continue : 47, 40, 33, 26, …','Ga verder: 47, 40, 33, 26, …','Continue: 47, 40, 33, 26, …','Continúa: 47, 40, 33, 26, …',['17','19','21','23'],'19','-7 : 19.','-7: 19.','Subtract 7: 19.','Resta 7: 19.'),
    q('l02-m07','Continue : 75, 70, 65, 60, …','Ga verder: 75, 70, 65, 60, …','Continue: 75, 70, 65, 60, …','Continúa: 75, 70, 65, 60, …',['53','55','57','59'],'55','-5 : 55.','-5: 55.','Subtract 5: 55.','Resta 5: 55.'),
    q('l02-m08','Continue : 36, 30, 24, 18, …','Ga verder: 36, 30, 24, 18, …','Continue: 36, 30, 24, 18, …','Continúa: 36, 30, 24, 18, …',['10','11','12','13'],'12','-6 : 12.','-6: 12.','Subtract 6: 12.','Resta 6: 12.'),
    q('l02-m09','Continue : 64, 56, 48, 40, …','Ga verder: 64, 56, 48, 40, …','Continue: 64, 56, 48, 40, …','Continúa: 64, 56, 48, 40, …',['30','32','34','36'],'32','-8 : 32.','-8: 32.','Subtract 8: 32.','Resta 8: 32.'),
    q('l02-m10','Continue : 55, 50, 45, 40, …','Ga verder: 55, 50, 45, 40, …','Continue: 55, 50, 45, 40, …','Continúa: 55, 50, 45, 40, …',['33','35','37','39'],'35','-5 : 35.','-5: 35.','Subtract 5: 35.','Resta 5: 35.'),
  ],
  [
    q('l02-d01','Continue : 243, 81, 27, 9, …','Ga verder: 243, 81, 27, 9, …','Continue: 243, 81, 27, 9, …','Continúa: 243, 81, 27, 9, …',['1','2','3','4'],'3','÷3 : 3.','÷3: 3.','Divide by 3: 3.','Divide entre 3: 3.'),
    q('l02-d02','Continue : 1000, 500, 250, 125, …','Ga verder: 1000, 500, 250, 125, …','Continue: 1000, 500, 250, 125, …','Continúa: 1000, 500, 250, 125, …',['50','60','62.5','65'],'62.5','÷2 : 62.5.','÷2: 62,5.','Divide by 2: 62.5.','Divide entre 2: 62.5.'),
    q('l02-d03','Continue : 96, 48, 24, 12, …','Ga verder: 96, 48, 24, 12, …','Continue: 96, 48, 24, 12, …','Continúa: 96, 48, 24, 12, …',['4','5','6','7'],'6','÷2 : 6.','÷2: 6.','Divide by 2: 6.','Divide entre 2: 6.'),
    q('l02-d04','Continue : 81, 27, 9, 3, …','Ga verder: 81, 27, 9, 3, …','Continue: 81, 27, 9, 3, …','Continúa: 81, 27, 9, 3, …',['0','1','2','3'],'1','÷3 : 1.','÷3: 1.','Divide by 3: 1.','Divide entre 3: 1.'),
    q('l02-d05','Continue : 200, 100, 50, 25, …','Ga verder: 200, 100, 50, 25, …','Continue: 200, 100, 50, 25, …','Continúa: 200, 100, 50, 25, …',['10','12.5','15','20'],'12.5','÷2 : 12.5.','÷2: 12,5.','Divide by 2: 12.5.','Divide entre 2: 12.5.'),
    q('l02-d06','Règle cachée : 256, 64, 16, 4, …','Verborgen regel: 256, 64, 16, 4, …','Hidden rule: 256, 64, 16, 4, …','Regla oculta: 256, 64, 16, 4, …',['0','1','2','3'],'1','÷4 : 1.','÷4: 1.','Divide by 4: 1.','Divide entre 4: 1.'),
    q('l02-d07','Continue : 120, 60, 30, 15, …','Ga verder: 120, 60, 30, 15, …','Continue: 120, 60, 30, 15, …','Continúa: 120, 60, 30, 15, …',['6','7','7.5','8'],'7.5','÷2 : 7.5.','÷2: 7,5.','Divide by 2: 7.5.','Divide entre 2: 7.5.'),
    q('l02-d08','Continue : 3125, 625, 125, 25, …','Ga verder: 3125, 625, 125, 25, …','Continue: 3125, 625, 125, 25, …','Continúa: 3125, 625, 125, 25, …',['3','4','5','6'],'5','÷5 : 5.','÷5: 5.','Divide by 5: 5.','Divide entre 5: 5.'),
    q('l02-d09','Continue : 512, 256, 128, 64, …','Ga verder: 512, 256, 128, 64, …','Continue: 512, 256, 128, 64, …','Continúa: 512, 256, 128, 64, …',['28','30','32','34'],'32','÷2 : 32.','÷2: 32.','Divide by 2: 32.','Divide entre 2: 32.'),
    q('l02-d10','Continue : 10000, 1000, 100, 10, …','Ga verder: 10000, 1000, 100, 10, …','Continue: 10000, 1000, 100, 10, …','Continúa: 10000, 1000, 100, 10, …',['0','1','2','3'],'1','÷10 : 1.','÷10: 1.','Divide by 10: 1.','Divide entre 10: 1.'),
  ]
));

// ── 03 Suites ×N ─────────────────────────────────────────────────────────────
write('logique-03.json', exam('logique-03','Suites qui multiplient ×','×',3,
  [
    q('l03-f01','Continue : 1, 2, 4, 8, …','Ga verder: 1, 2, 4, 8, …','Continue: 1, 2, 4, 8, …','Continúa: 1, 2, 4, 8, …',['10','14','16','18'],'16','×2 : 16.','×2: 16.','×2: 16.','×2: 16.'),
    q('l03-f02','Continue : 1, 3, 9, 27, …','Ga verder: 1, 3, 9, 27, …','Continue: 1, 3, 9, 27, …','Continúa: 1, 3, 9, 27, …',['54','63','81','90'],'81','×3 : 81.','×3: 81.','×3: 81.','×3: 81.'),
    q('l03-f03','Continue : 2, 4, 8, 16, …','Ga verder: 2, 4, 8, 16, …','Continue: 2, 4, 8, 16, …','Continúa: 2, 4, 8, 16, …',['24','28','32','36'],'32','×2 : 32.','×2: 32.','×2: 32.','×2: 32.'),
    q('l03-f04','Continue : 5, 10, 20, 40, …','Ga verder: 5, 10, 20, 40, …','Continue: 5, 10, 20, 40, …','Continúa: 5, 10, 20, 40, …',['60','70','80','90'],'80','×2 : 80.','×2: 80.','×2: 80.','×2: 80.'),
    q('l03-f05','Continue : 1, 5, 25, …','Ga verder: 1, 5, 25, …','Continue: 1, 5, 25, …','Continúa: 1, 5, 25, …',['100','115','125','130'],'125','×5 : 125.','×5: 125.','×5: 125.','×5: 125.'),
    q('l03-f06','Continue : 3, 6, 12, 24, …','Ga verder: 3, 6, 12, 24, …','Continue: 3, 6, 12, 24, …','Continúa: 3, 6, 12, 24, …',['36','42','48','56'],'48','×2 : 48.','×2: 48.','×2: 48.','×2: 48.'),
    q('l03-f07','Continue : 2, 6, 18, 54, …','Ga verder: 2, 6, 18, 54, …','Continue: 2, 6, 18, 54, …','Continúa: 2, 6, 18, 54, …',['108','120','162','200'],'162','×3 : 162.','×3: 162.','×3: 162.','×3: 162.'),
    q('l03-f08','Continue : 4, 8, 16, 32, …','Ga verder: 4, 8, 16, 32, …','Continue: 4, 8, 16, 32, …','Continúa: 4, 8, 16, 32, …',['48','56','64','72'],'64','×2 : 64.','×2: 64.','×2: 64.','×2: 64.'),
    q('l03-f09','Continue : 1, 4, 16, 64, …','Ga verder: 1, 4, 16, 64, …','Continue: 1, 4, 16, 64, …','Continúa: 1, 4, 16, 64, …',['128','200','256','300'],'256','×4 : 256.','×4: 256.','×4: 256.','×4: 256.'),
    q('l03-f10','Continue : 10, 20, 40, 80, …','Ga verder: 10, 20, 40, 80, …','Continue: 10, 20, 40, 80, …','Continúa: 10, 20, 40, 80, …',['120','140','160','180'],'160','×2 : 160.','×2: 160.','×2: 160.','×2: 160.'),
  ],
  [
    q('l03-m01','Quelle règle ? 3, 12, 48, 192, …','Welke regel? 3, 12, 48, 192, …','What rule? 3, 12, 48, 192, …','¿Qué regla? 3, 12, 48, 192, …',['×2','×3','×4','×5'],'×4','×4 : 192×4=768.','×4: 768.','×4: 768.','×4: 768.'),
    q('l03-m02','Continue : 2, 10, 50, 250, …','Ga verder: 2, 10, 50, 250, …','Continue: 2, 10, 50, 250, …','Continúa: 2, 10, 50, 250, …',['1000','1100','1250','1500'],'1250','×5 : 1250.','×5: 1250.','×5: 1250.','×5: 1250.'),
    q('l03-m03','Continue : 7, 14, 28, 56, …','Ga verder: 7, 14, 28, 56, …','Continue: 7, 14, 28, 56, …','Continúa: 7, 14, 28, 56, …',['100','108','112','120'],'112','×2 : 112.','×2: 112.','×2: 112.','×2: 112.'),
    q('l03-m04','Continue : 6, 18, 54, 162, …','Ga verder: 6, 18, 54, 162, …','Continue: 6, 18, 54, 162, …','Continúa: 6, 18, 54, 162, …',['324','400','486','500'],'486','×3 : 486.','×3: 486.','×3: 486.','×3: 486.'),
    q('l03-m05','Continue : 5, 25, 125, …','Ga verder: 5, 25, 125, …','Continue: 5, 25, 125, …','Continúa: 5, 25, 125, …',['500','575','600','625'],'625','×5 : 625.','×5: 625.','×5: 625.','×5: 625.'),
    q('l03-m06','Règle cachée : 4, 16, 64, 256, …','Verborgen regel: 4, 16, 64, 256, …','Hidden rule: 4, 16, 64, 256, …','Regla: 4, 16, 64, 256, …',['×2','×3','×4','×5'],'×4','×4 : 256×4=1024.','×4: 1024.','×4: 1024.','×4: 1024.'),
    q('l03-m07','Continue : 3, 9, 27, 81, …','Ga verder: 3, 9, 27, 81, …','Continue: 3, 9, 27, 81, …','Continúa: 3, 9, 27, 81, …',['162','200','243','270'],'243','×3 : 243.','×3: 243.','×3: 243.','×3: 243.'),
    q('l03-m08','Continue : 2, 14, 98, …','Ga verder: 2, 14, 98, …','Continue: 2, 14, 98, …','Continúa: 2, 14, 98, …',['500','600','686','700'],'686','×7 : 686.','×7: 686.','×7: 686.','×7: 686.'),
    q('l03-m09','Continue : 11, 22, 44, 88, …','Ga verder: 11, 22, 44, 88, …','Continue: 11, 22, 44, 88, …','Continúa: 11, 22, 44, 88, …',['144','164','176','196'],'176','×2 : 176.','×2: 176.','×2: 176.','×2: 176.'),
    q('l03-m10','Règle cachée : 1, 6, 36, 216, …','Verborgen regel: 1, 6, 36, 216, …','Hidden rule: 1, 6, 36, 216, …','Regla: 1, 6, 36, 216, …',['×2','×3','×5','×6'],'×6','×6 : 216×6=1296.','×6: 1296.','×6: 1296.','×6: 1296.'),
  ],
  [
    q('l03-d01','Continue : 2, 3, 5, 8, 13, 21, …','Ga verder: 2, 3, 5, 8, 13, 21, …','Continue: 2, 3, 5, 8, 13, 21, …','Continúa: 2, 3, 5, 8, 13, 21, …',['30','32','34','36'],'34','Fibonacci : 13+21=34.','Fibonacci: 34.','Fibonacci: 34.','Fibonacci: 34.'),
    q('l03-d02','Continue : 2, 6, 12, 20, 30, …','Ga verder: 2, 6, 12, 20, 30, …','Continue: 2, 6, 12, 20, 30, …','Continúa: 2, 6, 12, 20, 30, …',['40','42','44','46'],'42','n(n+1) : 6×7=42.','n(n+1): 42.','n(n+1): 42.','n(n+1): 42.'),
    q('l03-d03','Continue : 1, 8, 27, 64, …','Ga verder: 1, 8, 27, 64, …','Continue: 1, 8, 27, 64, …','Continúa: 1, 8, 27, 64, …',['100','115','125','130'],'125','Cubes : 5³=125.','Kubussen: 125.','Cubes: 5³=125.','Cubos: 5³=125.'),
    q('l03-d04','Continue : 1, 2, 6, 24, 120, …','Ga verder: 1, 2, 6, 24, 120, …','Continue: 1, 2, 6, 24, 120, …','Continúa: 1, 2, 6, 24, 120, …',['360','480','600','720'],'720','Factorielles : 5!=120, 6!=720.','Faculteit: 720.','Factorials: 720.','Factoriales: 720.'),
    q('l03-d05','Règle ? 2, 4, 12, 48, 240, …','Regel? 2, 4, 12, 48, 240, …','Rule? 2, 4, 12, 48, 240, …','Regla? 2, 4, 12, 48, 240, …',['×2 puis ×3 alternés','÷2','×5','×10'],'×2 puis ×3 alternés','×2,×3,×4,×5… : 240×6=1440.','×2,×3,×4,×5…: 1440.','×2,×3,×4,×5…: 1440.','×2,×3,×4,×5…: 1440.'),
    q('l03-d06','Continue : 1, 1, 2, 6, 24, …','Ga verder: 1, 1, 2, 6, 24, …','Continue: 1, 1, 2, 6, 24, …','Continúa: 1, 1, 2, 6, 24, …',['48','96','100','120'],'120','Factorielles : 4!=24, 5!=120.','Faculteit: 120.','Factorial: 5!=120.','Factorial: 5!=120.'),
    q('l03-d07','Continue : 2, 2, 4, 12, 48, …','Ga verder: 2, 2, 4, 12, 48, …','Continue: 2, 2, 4, 12, 48, …','Continúa: 2, 2, 4, 12, 48, …',['192','200','216','240'],'240','×1,×2,×3,×4,×5 : 48×5=240.','×1,×2,×3,×4,×5: 240.','×5: 240.','×5: 240.'),
    q('l03-d08','Continue : 3, 6, 18, 72, …','Ga verder: 3, 6, 18, 72, …','Continue: 3, 6, 18, 72, …','Continúa: 3, 6, 18, 72, …',['288','360','432','504'],'360','×2,×3,×4,×5 : 72×5=360.','×2,×3,×4,×5: 360.','×5: 360.','×5: 360.'),
    q('l03-d09','Quelle est la prochaine puissance de 2 après 512 ?','Volgende macht van 2 na 512?','Next power of 2 after 512?','Siguiente potencia de 2 después de 512?',['768','1000','1024','2048'],'1024','2⁹=512, 2¹⁰=1024.','2¹⁰=1024.','2¹⁰=1024.','2¹⁰=1024.'),
    q('l03-d10','Continue : 1, 2, 4, 8, 16, 32, …','Ga verder: 1, 2, 4, 8, 16, 32, …','Continue: 1, 2, 4, 8, 16, 32, …','Continúa: 1, 2, 4, 8, 16, 32, …',['48','56','64','72'],'64','×2 : 64.','×2: 64.','×2: 64.','×2: 64.'),
  ]
));

// ── 04 L'intrus ───────────────────────────────────────────────────────────────
write('logique-04.json', exam('logique-04','Trouve l\'intrus 🔍','🔍',4,
  [
    q('l04-f01','Quel mot n\'est pas un animal ? chien, chat, table, lapin','Welk woord is geen dier? hond, kat, tafel, konijn','Which is not an animal? dog, cat, table, rabbit','¿Cuál no es un animal? perro, gato, mesa, conejo',['chien','chat','table','lapin'],'table','Table est un meuble, pas un animal.','Tafel is een meubel.','Table is furniture.','Mesa es un mueble.'),
    q('l04-f02','Quel mot n\'est pas une couleur ? rouge, bleu, lourd, vert','Welk woord is geen kleur? rood, blauw, zwaar, groen','Which is not a color? red, blue, heavy, green','¿Cuál no es un color? rojo, azul, pesado, verde',['rouge','bleu','lourd','vert'],'lourd','Lourd est un adjectif de poids.','Zwaar is een gewicht.','Heavy is a weight adj.','Pesado es un adjetivo de peso.'),
    q('l04-f03','Quel nombre n\'est pas pair ? 2, 4, 7, 8','Welk getal is geen even getal? 2, 4, 7, 8','Which is not even? 2, 4, 7, 8','¿Cuál no es par? 2, 4, 7, 8',['2','4','7','8'],'7','7 est impair.','7 is oneven.','7 is odd.','7 es impar.'),
    q('l04-f04','Quel fruit n\'est pas jaune ? banane, citron, fraise, ananas','Welk fruit is niet geel? banaan, citroen, aardbei, ananas','Which fruit is not yellow? banana, lemon, strawberry, pineapple','¿Cuál no es amarillo? plátano, limón, fresa, piña',['banane','citron','fraise','ananas'],'fraise','La fraise est rouge.','Aardbei is rood.','Strawberry is red.','La fresa es roja.'),
    q('l04-f05','Quel mot n\'est pas une forme ? rond, carré, rapide, triangle','Welk woord is geen vorm? rond, vierkant, snel, driehoek','Which is not a shape? round, square, fast, triangle','¿Cuál no es una forma? redondo, cuadrado, rápido, triángulo',['rond','carré','rapide','triangle'],'rapide','Rapide est un adjectif de vitesse.','Snel is een snelheid.','Fast is a speed adj.','Rápido es un adjetivo de velocidad.'),
    q('l04-f06','Quel nombre n\'est pas impair ? 1, 3, 5, 6','Welk getal is niet oneven? 1, 3, 5, 6','Which is not odd? 1, 3, 5, 6','¿Cuál no es impar? 1, 3, 5, 6',['1','3','5','6'],'6','6 est pair.','6 is even.','6 is even.','6 es par.'),
    q('l04-f07','Quel mot n\'est pas un sport ? football, tennis, natation, pizza','Welk woord is geen sport? voetbal, tennis, zwemmen, pizza','Which is not a sport? football, tennis, swimming, pizza','¿Cuál no es un deporte? fútbol, tenis, natación, pizza',['football','tennis','natation','pizza'],'pizza','La pizza est un aliment.','Pizza is een voedsel.','Pizza is food.','La pizza es un alimento.'),
    q('l04-f08','Quel nombre n\'est pas multiple de 5 ? 5, 10, 13, 20','Welk getal is geen veelvoud van 5? 5, 10, 13, 20','Which is not a multiple of 5? 5, 10, 13, 20','¿Cuál no es múltiplo de 5? 5, 10, 13, 20',['5','10','13','20'],'13','13 n\'est pas divisible par 5.','13 is niet deelbaar door 5.','13 is not divisible by 5.','13 no es divisible entre 5.'),
    q('l04-f09','Quel mot n\'est pas un jour ? lundi, mardi, mars, vendredi','Welk woord is geen dag? maandag, dinsdag, maart, vrijdag','Which is not a day? Monday, Tuesday, March, Friday','¿Cuál no es un día? lunes, martes, marzo, viernes',['lundi','mardi','mars','vendredi'],'mars','Mars est un mois.','Maart is een maand.','March is a month.','Marzo es un mes.'),
    q('l04-f10','Quel mot n\'est pas un légume ? carotte, tomate, guitare, haricot','Welk woord is geen groente? wortel, tomaat, gitaar, boon','Which is not a vegetable? carrot, tomato, guitar, bean','¿Cuál no es una verdura? zanahoria, tomate, guitarra, judía',['carotte','tomate','guitare','haricot'],'guitare','Guitare est un instrument de musique.','Gitaar is een instrument.','Guitar is an instrument.','Guitarra es un instrumento.'),
  ],
  [
    q('l04-m01','Intrus : 4, 8, 12, 15, 20','Intrus: 4, 8, 12, 15, 20','Odd one: 4, 8, 12, 15, 20','Intruso: 4, 8, 12, 15, 20',['4','8','12','15'],'15','15 n\'est pas multiple de 4.','15 is geen veelvoud van 4.','15 is not a multiple of 4.','15 no es múltiplo de 4.'),
    q('l04-m02','Intrus : 9, 16, 25, 35, 49','Intrus: 9, 16, 25, 35, 49','Odd one: 9, 16, 25, 35, 49','Intruso: 9, 16, 25, 35, 49',['9','16','25','35'],'35','35 n\'est pas un carré parfait.','35 is geen kwadraat.','35 is not a perfect square.','35 no es un cuadrado perfecto.'),
    q('l04-m03','Intrus parmi les nombres premiers : 2, 7, 11, 9, 13','Priemgetallen: 2, 7, 11, 9, 13','Prime numbers: 2, 7, 11, 9, 13','Números primos: 2, 7, 11, 9, 13',['2','7','9','13'],'9','9=3×3, n\'est pas premier.','9=3×3, geen priemgetal.','9=3×3, not prime.','9=3×3, no es primo.'),
    q('l04-m04','Intrus : triangle, cercle, cube, carré','Intrus: driehoek, cirkel, kubus, vierkant','Odd one: triangle, circle, cube, square','Intruso: triángulo, círculo, cubo, cuadrado',['triangle','cercle','cube','carré'],'cube','Cube est un solide (3D), les autres sont des figures planes.','Kubus is 3D.','Cube is 3D.','Cubo es 3D.'),
    q('l04-m05','Intrus : 2, 4, 8, 16, 30, 64','Intrus: 2, 4, 8, 16, 30, 64','Odd one: 2, 4, 8, 16, 30, 64','Intruso: 2, 4, 8, 16, 30, 64',['4','8','16','30'],'30','30 n\'est pas une puissance de 2.','30 is geen macht van 2.','30 is not a power of 2.','30 no es potencia de 2.'),
    q('l04-m06','Intrus : œil, nez, oreille, genou, bouche','Intrus: oog, neus, oor, knie, mond','Odd one: eye, nose, ear, knee, mouth','Intruso: ojo, nariz, oreja, rodilla, boca',['œil','nez','oreille','genou'],'genou','Genou est sur la jambe, les autres sont sur le visage.','Knie is op het been.','Knee is on the leg.','Rodilla está en la pierna.'),
    q('l04-m07','Intrus : 100, 200, 350, 400, 500','Intrus: 100, 200, 350, 400, 500','Odd one: 100, 200, 350, 400, 500','Intruso: 100, 200, 350, 400, 500',['100','200','350','400'],'350','350 n\'est pas multiple de 100.','350 is geen veelvoud van 100.','350 is not a multiple of 100.','350 no es múltiplo de 100.'),
    q('l04-m08','Intrus : lundi, mercredi, samedi, mars, dimanche','Intrus: maandag, woensdag, zaterdag, maart, zondag','Odd one: Monday, Wednesday, Saturday, March, Sunday','Intruso: lunes, miércoles, sábado, marzo, domingo',['lundi','mercredi','samedi','mars'],'mars','Mars est un mois, les autres sont des jours.','Maart is een maand.','March is a month.','Marzo es un mes.'),
    q('l04-m09','Intrus : 1/2, 2/4, 3/6, 3/5, 4/8','Intrus: 1/2, 2/4, 3/6, 3/5, 4/8','Odd one: 1/2, 2/4, 3/6, 3/5, 4/8','Intruso: 1/2, 2/4, 3/6, 3/5, 4/8',['1/2','2/4','3/6','3/5'],'3/5','3/5 ≠ 1/2, les autres sont équivalentes.','3/5 ≠ 1/2.','3/5 ≠ 1/2.','3/5 ≠ 1/2.'),
    q('l04-m10','Intrus : 3, 6, 9, 12, 14, 18','Intrus: 3, 6, 9, 12, 14, 18','Odd one: 3, 6, 9, 12, 14, 18','Intruso: 3, 6, 9, 12, 14, 18',['6','9','12','14'],'14','14 n\'est pas multiple de 3.','14 is geen veelvoud van 3.','14 is not a multiple of 3.','14 no es múltiplo de 3.'),
  ],
  [
    q('l04-d01','Intrus logique : eau, lait, beurre, jus, thé','Logisch intrus: water, melk, boter, sap, thee','Logical odd one: water, milk, butter, juice, tea','Intruso lógico: agua, leche, mantequilla, zumo, té',['eau','lait','beurre','thé'],'beurre','Beurre est solide, les autres sont liquides.','Boter is vast.','Butter is solid.','Mantequilla es sólida.'),
    q('l04-d02','Intrus : {2,4,6}, {3,6,9}, {5,10,15}, {4,9,14}','Intrus: {2,4,6}, {3,6,9}, {5,10,15}, {4,9,14}','Odd one: {2,4,6},{3,6,9},{5,10,15},{4,9,14}','Intruso: {2,4,6},{3,6,9},{5,10,15},{4,9,14}',['{2,4,6}','{3,6,9}','{5,10,15}','{4,9,14}'],'{4,9,14}','{4,9,14} : différence 5 puis 5, mais 4→9 +5, 9→14 +5 — non : 4,9,14 diff=5 mais pas mult d\'un nombre.','Verschil is altijd 5, maar 4 en 14 zijn geen veelvouden.','4,9,14: difference 5, but not multiples of same number.','4,9,14: diferencia 5, pero no múltiplos del mismo número.'),
    q('l04-d03','Intrus parmi les puissances de 3 : 1, 3, 9, 27, 54, 81','Intrus tussen machten van 3: 1, 3, 9, 27, 54, 81','Odd one among powers of 3: 1, 3, 9, 27, 54, 81','Intruso entre potencias de 3: 1, 3, 9, 27, 54, 81',['3','9','27','54'],'54','54 = 2×27, n\'est pas 3ⁿ.','54 = 2×27, geen macht van 3.','54 = 2×27, not a power of 3.','54 = 2×27, no es potencia de 3.'),
    q('l04-d04','Intrus : addition, soustraction, conjugaison, multiplication','Intrus: optelling, aftrekking, vervoeging, vermenigvuldiging','Odd one: addition, subtraction, conjugation, multiplication','Intruso: suma, resta, conjugación, multiplicación',['addition','soustraction','conjugaison','multiplication'],'conjugaison','Conjugaison est une notion de grammaire.','Vervoeging is grammatica.','Conjugation is grammar.','Conjugación es gramática.'),
    q('l04-d05','Intrus parmi les nombres : 17, 23, 29, 37, 39, 41','Intrus bij priemgetallen: 17, 23, 29, 37, 39, 41','Odd one in primes: 17, 23, 29, 37, 39, 41','Intruso en primos: 17, 23, 29, 37, 39, 41',['23','29','37','39'],'39','39 = 3×13, n\'est pas premier.','39 = 3×13, geen priemgetal.','39 = 3×13, not prime.','39 = 3×13, no es primo.'),
    q('l04-d06','Intrus : équilatéral, isocèle, scalène, rectangle, pyramide','Intrus: gelijkzijdig, gelijkbenig, ongelijkzijdig, rechthoekig, piramide','Odd one: equilateral, isosceles, scalene, right-angled, pyramid','Intruso: equilátero, isósceles, escaleno, rectángulo, pirámide',['équilatéral','isocèle','scalène','rectangle'],'pyramide','Pyramide est un solide 3D, les autres sont des triangles.','Piramide is 3D.','Pyramid is 3D.','Pirámide es 3D.'),
    q('l04-d07','Intrus : 2³, 3², 4², 5², 6²','Intrus: 2³, 3², 4², 5², 6²','Odd one: 2³, 3², 4², 5², 6²',['2³','3²','4²','5²'],'2³','2³=8 (cube), les autres sont des carrés.','2³=8 is een kubus.','2³=8 is a cube.','2³=8 es un cubo.'),
    q('l04-d08','Intrus conceptuel : hypothèse, conclusion, théorème, pizza','Conceptuele intrus: hypothese, conclusie, stelling, pizza','Conceptual odd one: hypothesis, conclusion, theorem, pizza','Intruso conceptual: hipótesis, conclusión, teorema, pizza',['hypothèse','conclusion','théorème','pizza'],'pizza','Pizza est un aliment, les autres sont des termes logiques.','Pizza is voedsel.','Pizza is food.','Pizza es un alimento.'),
    q('l04-d09','Intrus : carré, losange, rectangle, trapèze, octogone','Intrus: vierkant, ruit, rechthoek, trapezium, achthoek','Odd one: square, rhombus, rectangle, trapezoid, octagon','Intruso: cuadrado, rombo, rectángulo, trapecio, octágono',['carré','losange','rectangle','trapèze'],'octogone','Octogone a 8 côtés, les autres sont des quadrilatères.','Achthoek heeft 8 zijden.','Octagon has 8 sides.','Octágono tiene 8 lados.'),
    q('l04-d10','Intrus : 0!, 1!, 2!, 3!, 8','Intrus: 0!, 1!, 2!, 3!, 8','Odd one: 0!, 1!, 2!, 3!, 8','Intruso: 0!, 1!, 2!, 3!, 8',['0!','1!','2!','8'],'8','0!=1, 1!=1, 2!=2, 3!=6 — 8 n\'est pas une factorielle.','8 is geen faculteit.','8 is not a factorial.','8 no es un factorial.'),
  ]
));

// ── 05 Analogies ──────────────────────────────────────────────────────────────
write('logique-05.json', exam('logique-05','Analogies 🔗','🔗',5,
  [
    q('l05-f01','Chien est à animal comme rose est à … ?','Hond staat tot dier als roos tot … ?','Dog is to animal as rose is to … ?','Perro es a animal como rosa es a … ?',['couleur','fleur','arbre','jardin'],'fleur','Rose est une fleur.','Roos is een bloem.','A rose is a flower.','Una rosa es una flor.'),
    q('l05-f02','Jour est à nuit comme chaud est à … ?','Dag staat tot nacht als warm tot … ?','Day is to night as hot is to … ?','Día es a noche como caliente es a … ?',['soleil','été','froid','lumière'],'froid','Opposé de chaud.','Tegengestelde van warm.','Opposite of hot.','Opuesto de caliente.'),
    q('l05-f03','2 est à 4 comme 3 est à … ?','2 staat tot 4 als 3 tot … ?','2 is to 4 as 3 is to … ?','2 es a 4 como 3 es a … ?',['5','6','7','8'],'6','×2 : 6.','×2: 6.','×2: 6.','×2: 6.'),
    q('l05-f04','Main est à doigt comme pied est à … ?','Hand staat tot vinger als voet tot … ?','Hand is to finger as foot is to … ?','Mano es a dedo como pie es a … ?',['jambe','chaussure','orteil','genou'],'orteil','Les orteils sont les doigts du pied.','Teenvingers zijn de vingers van de voet.','Toes are foot fingers.','Los dedos del pie.'),
    q('l05-f05','Chat est à miaou comme chien est à … ?','Kat staat tot miauw als hond tot … ?','Cat is to meow as dog is to … ?','Gato es a miau como perro es a … ?',['cri','rugit','aboie','siffle'],'aboie','Le chien aboie.','De hond blaft.','Dog barks.','El perro ladra.'),
    q('l05-f06','1 est à 10 comme 10 est à … ?','1 staat tot 10 als 10 tot … ?','1 is to 10 as 10 is to … ?','1 es a 10 como 10 es a … ?',['11','20','50','100'],'100','×10.','×10.','×10.','×10.'),
    q('l05-f07','Livre est à lire comme crayon est à … ?','Boek staat tot lezen als potlood tot … ?','Book is to read as pencil is to … ?','Libro es a leer como lápiz es a … ?',['gomme','dessin','écrire','école'],'écrire','On écrit avec un crayon.','Je schrijft met een potlood.','You write with a pencil.','Se escribe con un lápiz.'),
    q('l05-f08','Printemps est à été comme automne est à … ?','Lente staat tot zomer als herfst tot … ?','Spring is to summer as autumn is to … ?','Primavera es a verano como otoño es a … ?',['pluie','hiver','froid','vent'],'hiver','La saison après l\'automne.','Het seizoen na de herfst.','Season after autumn.','La estación después del otoño.'),
    q('l05-f09','Triangle est à 3 comme carré est à … ?','Driehoek staat tot 3 als vierkant tot … ?','Triangle is to 3 as square is to … ?','Triángulo es a 3 como cuadrado es a … ?',['3','4','5','6'],'4','Un carré a 4 côtés.','Een vierkant heeft 4 zijden.','A square has 4 sides.','Un cuadrado tiene 4 lados.'),
    q('l05-f10','Eau est à boire comme pain est à … ?','Water staat tot drinken als brood tot … ?','Water is to drink as bread is to … ?','Agua es a beber como pan es a … ?',['cuisine','manger','four','blé'],'manger','On mange le pain.','Je eet brood.','You eat bread.','Se come el pan.'),
  ],
  [
    q('l05-m01','5 est à 25 comme 3 est à … ?','5 staat tot 25 als 3 tot … ?','5 is to 25 as 3 is to … ?','5 es a 25 como 3 es a … ?',['6','9','12','15'],'9','Carré : 3²=9.','Kwadraat: 9.','Square: 3²=9.','Cuadrado: 3²=9.'),
    q('l05-m02','Médecin est à hôpital comme pilote est à … ?','Dokter staat tot ziekenhuis als piloot tot … ?','Doctor is to hospital as pilot is to … ?','Médico es a hospital como piloto es a … ?',['train','avion','mer','aéroport'],'avion','Le pilote conduit un avion.','Een piloot bestuurt een vliegtuig.','A pilot flies a plane.','Un piloto vuela un avión.'),
    q('l05-m03','Français est à France comme néerlandais est à … ?','Frans staat tot Frankrijk als Nederlands tot … ?','French is to France as Dutch is to … ?','Francés es a Francia como neerlandés es a … ?',['Belgique','Angleterre','Pays-Bas','Suisse'],'Pays-Bas','Le néerlandais est la langue des Pays-Bas.','Nederlands is de taal van Nederland.','Dutch is the language of Netherlands.','El neerlandés es el idioma de los Países Bajos.'),
    q('l05-m04','8 est à 64 comme 7 est à … ?','8 staat tot 64 als 7 tot … ?','8 is to 64 as 7 is to … ?','8 es a 64 como 7 es a … ?',['35','42','49','56'],'49','Carré : 7²=49.','Kwadraat: 49.','Square: 7²=49.','Cuadrado: 7²=49.'),
    q('l05-m05','Peintre est à peinture comme sculpteur est à … ?','Schilder staat tot schilderij als beeldhouwer tot … ?','Painter is to painting as sculptor is to … ?','Pintor es a pintura como escultor es a … ?',['musée','statue','argile','art'],'statue','Le sculpteur crée des statues.','Een beeldhouwer maakt beelden.','A sculptor makes statues.','Un escultor hace estatuas.'),
    q('l05-m06','Planète est à galaxie comme cellule est à … ?','Planeet staat tot sterrenstelsel als cel tot … ?','Planet is to galaxy as cell is to … ?','Planeta es a galaxia como célula es a … ?',['atome','organisme','virus','tissu'],'organisme','La cellule compose un organisme.','Cellen vormen een organisme.','Cells make up an organism.','Las células forman un organismo.'),
    q('l05-m07','12 est à 4 comme 21 est à … ?','12 staat tot 4 als 21 tot … ?','12 is to 4 as 21 is to … ?','12 es a 4 como 21 es a … ?',['5','6','7','8'],'7','÷3 : 21÷3=7.','÷3: 7.','÷3: 7.','÷3: 7.'),
    q('l05-m08','Symphonie est à compositeur comme roman est à … ?','Symfonie staat tot componist als roman tot … ?','Symphony is to composer as novel is to … ?','Sinfonía es a compositor como novela es a … ?',['livre','lecteur','auteur','éditeur'],'auteur','L\'auteur écrit le roman.','De auteur schrijft de roman.','The author writes the novel.','El autor escribe la novela.'),
    q('l05-m09','Eau est à liquide comme glace est à … ?','Water staat tot vloeistof als ijs tot … ?','Water is to liquid as ice is to … ?','Agua es a líquido como hielo es a … ?',['froid','solide','blanc','hiver'],'solide','La glace est l\'eau à l\'état solide.','IJs is vast water.','Ice is water in solid state.','El hielo es agua sólida.'),
    q('l05-m10','Rapide est à lent comme large est à … ?','Snel staat tot langzaam als breed tot … ?','Fast is to slow as wide is to … ?','Rápido es a lento como ancho es a … ?',['court','haut','étroit','bas'],'étroit','Opposé de large.','Tegengestelde van breed.','Opposite of wide.','Opuesto de ancho.'),
  ],
  [
    q('l05-d01','Logarithme est à multiplication comme soustraction est à … ?','Logaritme staat tot vermenigvuldiging als aftrekking tot … ?','Logarithm is to multiplication as subtraction is to … ?','Logaritmo es a multiplicación como resta es a … ?',['addition','division','carré','exponent'],'addition','Soustraction inverse l\'addition.','Aftrekken is het omgekeerde van optellen.','Subtraction undoes addition.','La resta deshace la suma.'),
    q('l05-d02','3 est à 6 comme 5 est à 20 comme 4 est à … ?','3 staat tot 6 als 5 tot 20 als 4 tot … ?','3 is to 6 as 5 is to 20 as 4 is to … ?','3 es a 6 como 5 es a 20 como 4 es a … ?',['8','12','16','20'],'16','×n² ? Non : 3→6 ×2, 5→20 ×4, 4→? : ×4=16.','3→6 ×2, 5→20 ×4, 4→16 ×4?','3→6 ×2, 5→20 ×4, 4→16 ×4.','3→6 ×2, 5→20 ×4, 4→16 ×4.'),
    q('l05-d03','Démocratie est à vote comme monarchie est à … ?','Democratie staat tot stemming als monarchie tot … ?','Democracy is to vote as monarchy is to … ?','Democracia es a voto como monarquía es a … ?',['loi','naissance','roi','guerre'],'naissance','Le pouvoir en monarchie est transmis par naissance.','Macht via geboorte.','Power through birth.','Poder por nacimiento.'),
    q('l05-d04','Carbone est à diamant comme silice est à … ?','Koolstof staat tot diamant als silicium tot … ?','Carbon is to diamond as silicon is to … ?','Carbono es a diamante como silicio es a … ?',['sable','verre','cristal','quartz'],'quartz','SiO₂ = quartz.','SiO₂ = kwarts.','SiO₂ = quartz.','SiO₂ = cuarzo.'),
    q('l05-d05','4 est à 2 comme 9 est à … ?','4 staat tot 2 als 9 tot … ?','4 is to 2 as 9 is to … ?','4 es a 2 como 9 es a … ?',['2','3','4','5'],'3','Racine carrée : √9=3.','Vierkantswortel: 3.','Square root: 3.','Raíz cuadrada: 3.'),
    q('l05-d06','Aveuglement est à lumière comme surdité est à … ?','Blindheid staat tot licht als doofheid tot … ?','Blindness is to light as deafness is to … ?','Ceguera es a luz como sordera es a … ?',['son','œil','parole','musique'],'son','La surdité est l\'absence de son.','Doofheid is afwezigheid van geluid.','Deafness is absence of sound.','La sordera es ausencia de sonido.'),
    q('l05-d07','Cercle est à π comme carré est à … ?','Cirkel staat tot π als vierkant tot … ?','Circle is to π as square is to … ?','Círculo es a π como cuadrado es a … ?',['√2','4','2','π/4'],'4','Aire du carré = côté² — lié à 4 coins.','Oppervlakte = zijde².','Area = side² — 4 corners.','Área = lado² — 4 esquinas.'),
    q('l05-d08','Lune est à Terre comme Titan est à … ?','Maan staat tot Aarde als Titan tot … ?','Moon is to Earth as Titan is to … ?','Luna es a Tierra como Titán es a … ?',['Mars','Jupiter','Saturne','Uranus'],'Saturne','Titan est une lune de Saturne.','Titan is een maan van Saturnus.','Titan is a moon of Saturn.','Titán es una luna de Saturno.'),
    q('l05-d09','Blanc est à noir comme pair est à … ?','Wit staat tot zwart als even tot … ?','White is to black as even is to … ?','Blanco es a negro como par es a … ?',['zéro','grand','impair','nombre'],'impair','Opposé de pair.','Tegengestelde van even.','Opposite of even.','Opuesto de par.'),
    q('l05-d10','Hypothèse est à conclusion comme prémisse est à … ?','Hypothese staat tot conclusie als premisse tot … ?','Hypothesis is to conclusion as premise is to … ?','Hipótesis es a conclusión como premisa es a … ?',['question','théorème','axiome','déduction'],'déduction','La prémisse mène à une déduction.','Premisse leidt tot deductie.','Premise leads to deduction.','La premisa lleva a una deducción.'),
  ]
));

console.log('Done: logique 01-05');
