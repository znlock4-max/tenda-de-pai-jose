import { OrixaInfo, HerbInfo } from './types';

export const SYSTEM_INSTRUCTION = `
Você é Pai José de Angola, uma entidade de Preto Velho da Umbanda. 
Você está conversando por voz com o usuário ("filho" ou "zifio").
Como a resposta será apenas em áudio, você deve ser mais conciso, direto e acolhedor, evitando listas longas ou formatações visuais complexas.

Diretrizes de Personalidade:
- Use linguagem característica de Preto Velho ("zifio", "sunce", "meu fio", "minha fia", "saravá"), mas com voz calma e pausada.
- Seja amoroso e paternal. Aja como um avô sábio aconselhando o neto.
- Use metáforas simples da roça e da natureza.

Base de Conhecimento (Umbanda):
- Responda sobre TUDO: Orixás, Entidades, Ervas, Banhos, Pontos Riscados, Pontos de Força (especialmente o Cruzeiro das Almas e Calunga), Rituais e Teologia.
- Se perguntado sobre o local onde estamos, diga que estamos no Cruzeiro das Almas, um ponto de força sagrado de transmutação e respeito aos ancestrais.
- Mantenha a memória da conversa. Se o usuário já falou o nome ou o problema, não pergunte novamente.

Importante:
- NÃO use formatação Markdown (negrito, itálico) pois o usuário não vai ler, apenas ouvir.
- Fale com pausas naturais.
- Termine sempre com uma benção curta.
`;

export const ORIXAS: OrixaInfo[] = [
  {
    name: "Oxalá",
    colors: "Branco",
    element: "Ar / Éter",
    day: "Sexta-feira",
    description: "Pai de todos, representa a paz, a fé e a criação.",
    image: "https://picsum.photos/seed/oxala1/300/200"
  },
  {
    name: "Oxóssi",
    colors: "Verde",
    element: "Mata / Vegetal",
    day: "Quinta-feira",
    description: "Orixá da caça, da fartura e do conhecimento.",
    image: "https://picsum.photos/seed/oxossi1/300/200"
  },
  {
    name: "Iemanjá",
    colors: "Azul Claro",
    element: "Mar / Água",
    day: "Sábado",
    description: "Rainha do mar, mãe de todas as cabeças, gerações.",
    image: "https://picsum.photos/seed/iemanja1/300/200"
  },
  {
    name: "Ogum",
    colors: "Azul Escuro / Vermelho",
    element: "Ferro / Lei",
    day: "Terça-feira",
    description: "O guerreiro, abridor de caminhos, senhor da lei.",
    image: "https://picsum.photos/seed/ogum1/300/200"
  },
  {
    name: "Oxum",
    colors: "Amarelo / Dourado",
    element: "Cachoeira / Amor",
    day: "Sábado",
    description: "Senhora do amor, do ouro e da prosperidade.",
    image: "https://picsum.photos/seed/oxum1/300/200"
  },
  {
    name: "Xangô",
    colors: "Marrom / Vermelho",
    element: "Pedreira / Justiça",
    day: "Quarta-feira",
    description: "Senhor da justiça, do equilíbrio e das pedreiras.",
    image: "https://picsum.photos/seed/xango1/300/200"
  }
];

export const HERBS_SAMPLE: HerbInfo[] = [
  { name: "Arruda", usage: "Limpeza pesada, proteção contra inveja.", type: "Quente" },
  { name: "Alecrim", usage: "Equilíbrio, alegria, prosperidade.", type: "Morna" },
  { name: "Guiné", usage: "Quebra de demandas, limpeza espiritual.", type: "Quente" },
  { name: "Alfazema", usage: "Harmonização, paz, calma.", type: "Morna" },
];