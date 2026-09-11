export interface Verset {
    texte: string;
    reference: string;
  }
  
  export const VERSETS: Verset[] = [
    { texte: "Tout ce que ta main trouve à faire avec ta force, fais-le.", reference: "Ecclésiaste 9:10" },
    { texte: "Quel que soit votre travail, faites-le de bon cœur, comme pour le Seigneur et non pour des hommes.", reference: "Colossiens 3:23" },
    { texte: "Je puis tout par celui qui me fortifie.", reference: "Philippiens 4:13" },
    { texte: "La main des diligents s'enrichit.", reference: "Proverbes 10:4" },
    { texte: "Dans tout travail il y a du profit, mais les paroles en l'air ne mènent qu'à la disette.", reference: "Proverbes 14:23" },
    { texte: "Ne nous lassons pas de faire le bien, car nous moissonnerons au temps convenable, si nous ne nous relâchons pas.", reference: "Galates 6:9" },
    { texte: "Fortifie-toi et prends courage, ne t'effraie point et ne t'épouvante point.", reference: "Josué 1:9" },
    { texte: "Ceux qui se confient en l'Éternel renouvellent leur force.", reference: "Ésaïe 40:31" },
    { texte: "Recommande à l'Éternel tes œuvres, et tes projets réussiront.", reference: "Proverbes 16:3" },
    { texte: "L'âme des diligents sera rassasiée.", reference: "Proverbes 13:4" },
    { texte: "Que tout ce que vous faites se fasse avec amour.", reference: "1 Corinthiens 16:14" },
    { texte: "Va vers la fourmi, paresseux ; considère ses voies, et deviens sage.", reference: "Proverbes 6:6" },
    { texte: "Celui qui cultive son champ est rassasié de pain.", reference: "Proverbes 12:11" },
    { texte: "Sois fort et prends courage, ne crains point et ne t'effraie point.", reference: "Deutéronome 31:6" },
    { texte: "Je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur.", reference: "Jérémie 29:11" },
    { texte: "As-tu vu un homme habile dans son travail ? Il se tiendra devant les rois.", reference: "Proverbes 22:29" },
    { texte: "Affermis l'ouvrage de nos mains, oui, affermis l'ouvrage de nos mains.", reference: "Psaume 90:17" },
    { texte: "Les projets de l'homme diligent ne mènent qu'à l'abondance.", reference: "Proverbes 21:5" },
    { texte: "Ayez du zèle, et non de la paresse. Soyez fervents d'esprit. Servez le Seigneur.", reference: "Romains 12:11" },
    { texte: "Recommande ton sort à l'Éternel, mets en lui ta confiance, et il agira.", reference: "Psaume 37:5" },
    { texte: "Confie-toi en l'Éternel de tout ton cœur, et il aplanira tes sentiers.", reference: "Proverbes 3:5-6" },
    { texte: "Ne t'ai-je pas donné cet ordre : Fortifie-toi et prends courage ?", reference: "Josué 1:9" },
    { texte: "L'Éternel est ma force et le sujet de mes louanges.", reference: "Exode 15:2" },
  ];
  
  export function getDailyVerse(date: Date = new Date()): Verset {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / 86400000);
    return VERSETS[dayOfYear % VERSETS.length];
  }