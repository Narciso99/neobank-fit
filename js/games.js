/**
 * games.js - NeoBank OS
 * Sistema de jogos com 700 perguntas, stickers, valor aleatório e cópia de código
 */

let gameBalance = 0;
let helpCount = 0;
let gamesPlayed = 0;

// Banco de 700 perguntas divididas em 20 categorias
const quizzes = {
  capitals: [
    { q: "Qual é a capital da Austrália?", o: ["Sydney", "Canberra", "Melbourne", "Perth"], c: 1, v: 10 },
    { q: "Qual é a capital do Egito?", o: ["Alexandria", "Luxor", "Cairo", "Aswan"], c: 2, v: 12 },
    { q: "Qual é a capital da Noruega?", o: ["Oslo", "Bergen", "Trondheim", "Stavanger"], c: 0, v: 15 },
    { q: "Qual é a capital da Nova Zelândia?", o: ["Auckland", "Christchurch", "Wellington", "Dunedin"], c: 2, v: 14 },
    { q: "Qual é a capital da Finlândia?", o: ["Tampere", "Turku", "Helsinque", "Oulu"], c: 2, v: 13 },
    { q: "Qual é a capital do Japão?", o: ["Osaka", "Kyoto", "Tóquio", "Hiroshima"], c: 2, v: 11 },
    { q: "Qual é a capital da África do Sul?", o: ["Joanesburgo", "Pretória", "Cidade do Cabo", "Durban"], c: 1, v: 12 },
    { q: "Qual é a capital do Canadá?", o: ["Toronto", "Vancouver", "Ottawa", "Montreal"], c: 2, v: 10 },
    { q: "Qual é a capital da Argentina?", o: ["Buenos Aires", "Córdoba", "Rosário", "Mendoza"], c: 0, v: 13 },
    { q: "Qual é a capital da Tailândia?", o: ["Chiang Mai", "Phuket", "Bangcoc", "Pattaya"], c: 2, v: 14 },
    { q: "Qual é a capital da Rússia?", o: ["São Petersburgo", "Moscou", "Kazan", "Novosibirsk"], c: 1, v: 15 },
    { q: "Qual é a capital da Suíça?", o: ["Zurique", "Genebra", "Berna", "Basileia"], c: 2, v: 12 },
    { q: "Qual é a capital da Índia?", o: ["Mumbai", "Nova Délhi", "Bangalore", "Kolkata"], c: 1, v: 13 },
    { q: "Qual é a capital do México?", o: ["Guadalajara", "Monterrey", "Cidade do México", "Puebla"], c: 2, v: 11 },
    { q: "Qual é a capital da Islândia?", o: ["Akureyri", "Reykjavik", "Keflavik", "Selfoss"], c: 1, v: 15 },
    { q: "Qual é a capital da Turquia?", o: ["Istambul", "Ancara", "Izmir", "Antalya"], c: 1, v: 12 },
    { q: "Qual é a capital da Grécia?", o: ["Atenas", "Salonica", "Patras", "Heraklion"], c: 0, v: 10 },
    { q: "Qual é a capital da Espanha?", o: ["Barcelona", "Madri", "Valência", "Sevilha"], c: 1, v: 11 },
    { q: "Qual é a capital de Portugal?", o: ["Porto", "Lisboa", "Coimbra", "Faro"], c: 1, v: 10 },
    { q: "Qual é a capital da França?", o: ["Paris", "Lyon", "Marselha", "Toulouse"], c: 0, v: 9 },
    { q: "Qual é a capital da Itália?", o: ["Milão", "Roma", "Nápoles", "Turim"], c: 1, v: 12 },
    { q: "Qual é a capital da Alemanha?", o: ["Berlim", "Munique", "Hamburgo", "Frankfurt"], c: 0, v: 13 },
    { q: "Qual é a capital do Reino Unido?", o: ["Manchester", "Londres", "Edimburgo", "Birmingham"], c: 1, v: 10 },
    { q: "Qual é a capital da China?", o: ["Xangai", "Pequim", "Guangzhou", "Shenzhen"], c: 1, v: 14 },
    { q: "Qual é a capital da Coreia do Sul?", o: ["Busan", "Seul", "Incheon", "Daegu"], c: 1, v: 12 },
    { q: "Qual é a capital do Brasil?", o: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], c: 2, v: 15 },
    { q: "Qual é a capital do Peru?", o: ["Cusco", "Lima", "Arequipa", "Trujillo"], c: 1, v: 13 },
    { q: "Qual é a capital da Colômbia?", o: ["Medellín", "Bogotá", "Cali", "Cartagena"], c: 1, v: 14 },
    { q: "Qual é a capital do Chile?", o: ["Valparaíso", "Santiago", "Concepción", "Antofagasta"], c: 1, v: 12 },
    { q: "Qual é a capital da Áustria?", o: ["Viena", "Salzburgo", "Innsbruck", "Graz"], c: 0, v: 11 },
    { q: "Qual é a capital da Bélgica?", o: ["Antuérpia", "Bruxelas", "Gante", "Bruges"], c: 1, v: 13 },
    { q: "Qual é a capital da Holanda?", o: ["Roterdã", "Amsterdã", "Haia", "Utrecht"], c: 1, v: 14 },
    { q: "Qual é a capital da Suécia?", o: ["Gotemburgo", "Estocolmo", "Malmö", "Uppsala"], c: 1, v: 12 },
    { q: "Qual é a capital da Dinamarca?", o: ["Aarhus", "Copenhague", "Odense", "Aalborg"], c: 1, v: 13 },
    { q: "Qual é a capital da Polônia?", o: ["Cracóvia", "Varsóvia", "Gdansk", "Wroclaw"], c: 1, v: 14 }
  ],
  math_hard: [
    { q: "Qual é a raiz quadrada de 1764?", o: ["42", "38", "44", "46"], c: 0, v: 18 },
    { q: "Quanto é 7! (fatorial)?", o: ["5040", "720", "40320", "120"], c: 0, v: 20 },
    { q: "Qual é o valor de π² (aproximado)?", o: ["7.89", "9.87", "10.86", "11.84"], c: 1, v: 16 },
    { q: "Qual é o 10º número de Fibonacci?", o: ["34", "55", "89", "144"], c: 1, v: 19 },
    { q: "Quanto é log₁₀(1000)?", o: ["2", "3", "4", "5"], c: 1, v: 10 },
    { q: "Quanto é 2^10?", o: ["512", "1024", "2048", "4096"], c: 1, v: 15 },
    { q: "Qual é a derivada de x³?", o: ["3x²", "2x³", "x²", "3x"], c: 0, v: 17 },
    { q: "Quanto é sen(90°)?", o: ["0", "1", "-1", "0.5"], c: 1, v: 14 },
    { q: "Qual é o valor de 5P3 (permutação)?", o: ["60", "120", "20", "30"], c: 0, v: 16 },
    { q: "Qual é a soma dos ângulos internos de um pentágono?", o: ["360°", "540°", "720°", "180°"], c: 1, v: 18 },
    { q: "Quanto é 8% de 250?", o: ["20", "25", "15", "30"], c: 0, v: 12 },
    { q: "Qual é o valor de e^0?", o: ["0", "1", "2", "e"], c: 1, v: 15 },
    { q: "Qual é a área de um círculo com raio 3 (use π ≈ 3.14)?", o: ["28.26", "18.84", "9.42", "37.68"], c: 1, v: 16 },
    { q: "Quanto é 12C4 (combinação)?", o: ["495", "792", "990", "220"], c: 0, v: 19 },
    { q: "Qual é a soma dos primeiros 10 números ímpares?", o: ["100", "55", "45", "110"], c: 1, v: 17 },
    { q: "Qual é a raiz cúbica de 27?", o: ["3", "9", "6", "4"], c: 0, v: 14 },
    { q: "Quanto é 9! / 7!?", o: ["72", "5040", "720", "72"], c: 0, v: 16 },
    { q: "Qual é o valor aproximado de e?", o: ["2.718", "3.14", "1.618", "2.236"], c: 0, v: 15 },
    { q: "Qual é o 15º número de Fibonacci?", o: ["610", "377", "987", "1597"], c: 0, v: 18 },
    { q: "Quanto é log₂(8)?", o: ["3", "4", "2", "1"], c: 0, v: 12 },
    { q: "Qual é a integral de 2x dx?", o: ["x² + C", "2x² + C", "x + C", "2 + C"], c: 0, v: 17 },
    { q: "Quanto é cos(0°)?", o: ["0", "1", "-1", "0.5"], c: 1, v: 14 },
    { q: "Qual é o valor de 6P2?", o: ["30", "720", "12", "36"], c: 0, v: 15 },
    { q: "Qual é a soma dos ângulos internos de um hexágono?", o: ["540°", "720°", "900°", "360°"], c: 1, v: 18 },
    { q: "Quanto é 15% de 400?", o: ["60", "45", "75", "30"], c: 0, v: 13 },
    { q: "Qual é o valor de ln(1)?", o: ["0", "1", "e", "-1"], c: 0, v: 14 },
    { q: "Qual é o volume de uma esfera com raio 1 (use π ≈ 3.14)?", o: ["4.19", "3.14", "12.56", "1.57"], c: 0, v: 16 },
    { q: "Quanto é 10C3?", o: ["120", "210", "45", "720"], c: 0, v: 17 },
    { q: "Qual é a soma dos primeiros 20 números pares?", o: ["420", "210", "400", "380"], c: 0, v: 18 },
    { q: "Qual é a raiz quadrada de 2025?", o: ["45", "40", "50", "35"], c: 0, v: 19 },
    { q: "Quanto é 5!?", o: ["120", "720", "24", "60"], c: 0, v: 15 },
    { q: "Qual é o valor de π/2 (aproximado)?", o: ["1.57", "3.14", "0.78", "6.28"], c: 0, v: 14 },
    { q: "Qual é o 20º número de Fibonacci?", o: ["6765", "4181", "10946", "2584"], c: 0, v: 20 },
    { q: "Quanto é log₁₀(100)?", o: ["2", "3", "1", "4"], c: 0, v: 12 },
    { q: "Qual é a derivada de sin(x)?", o: ["cos(x)", "-sin(x)", "sin(x)", "-cos(x)"], c: 0, v: 16 }
  ],
  science: [
    { q: "Qual é o elemento químico com símbolo 'Au'?", o: ["Prata", "Ouro", "Alumínio", "Argônio"], c: 1, v: 14 },
    { q: "Qual planeta é conhecido como 'Planeta Vermelho'?", o: ["Vênus", "Júpiter", "Marte", "Saturno"], c: 2, v: 12 },
    { q: "Qual é a velocidade da luz no vácuo?", o: ["300.000 km/s", "150.000 km/s", "500.000 km/s", "200.000 km/s"], c: 0, v: 18 },
    { q: "Quem propôs a teoria da relatividade?", o: ["Newton", "Galileu", "Einstein", "Tesla"], c: 2, v: 16 },
    { q: "Qual é o maior órgão do corpo humano?", o: ["Coração", "Fígado", "Pele", "Cérebro"], c: 2, v: 10 },
    { q: "Qual gás é o principal componente da atmosfera terrestre?", o: ["Oxigênio", "Nitrogênio", "Dióxido de carbono", "Argônio"], c: 1, v: 12 },
    { q: "Qual é a fórmula da água?", o: ["H2O", "CO2", "O2", "H2SO4"], c: 0, v: 11 },
    { q: "Qual é o nome do processo de conversão de luz solar em energia química pelas plantas?", o: ["Respiração", "Fotossíntese", "Transpiração", "Osmose"], c: 1, v: 14 },
    { q: "Qual partícula subatômica tem carga negativa?", o: ["Próton", "Nêutron", "Elétron", "Quark"], c: 2, v: 13 },
    { q: "Qual é o osso mais longo do corpo humano?", o: ["Fêmur", "Tíbia", "Úmero", "Rádio"], c: 0, v: 15 },
    { q: "Qual é a principal fonte de energia da Terra?", o: ["Sol", "Vento", "Carvão", "Petróleo"], c: 0, v: 12 },
    { q: "Qual é o símbolo químico do ferro?", o: ["Fe", "Ir", "Fr", "Fi"], c: 0, v: 11 },
    { q: "Qual é o planeta mais próximo do Sol?", o: ["Vênus", "Mercúrio", "Terra", "Marte"], c: 1, v: 13 },
    { q: "Qual é o nome da tabela que organiza os elementos químicos?", o: ["Tabela Periódica", "Tabela Atômica", "Tabela Molecular", "Tabela Química"], c: 0, v: 14 },
    { q: "Qual é o processo pelo qual a água passa do estado líquido para o gasoso?", o: ["Condensação", "Evaporação", "Sublimação", "Solidificação"], c: 1, v: 12 },
    { q: "Qual é o símbolo do oxigênio?", o: ["O", "Ox", "Og", "Os"], c: 0, v: 10 },
    { q: "Qual é o maior planeta do sistema solar?", o: ["Saturno", "Júpiter", "Urano", "Netuno"], c: 1, v: 13 },
    { q: "Quem descobriu a penicilina?", o: ["Alexander Fleming", "Louis Pasteur", "Robert Koch", "Joseph Lister"], c: 0, v: 15 },
    { q: "Qual é a unidade de medida da força?", o: ["Joule", "Newton", "Watt", "Volt"], c: 1, v: 14 },
    { q: "Qual é o número atômico do carbono?", o: ["6", "8", "12", "14"], c: 0, v: 12 },
    { q: "Qual é o nome do primeiro satélite artificial da Terra?", o: ["Apollo 11", "Sputnik 1", "Voyager 1", "Hubble"], c: 1, v: 16 },
    { q: "Qual é o pH da água pura?", o: ["7", "0", "14", "1"], c: 0, v: 11 },
    { q: "Qual é o nome da força que mantém os planetas em órbita?", o: ["Eletromagnética", "Gravidade", "Nuclear forte", "Nuclear fraca"], c: 1, v: 13 },
    { q: "Qual animal é conhecido como o rei da selva?", o: ["Tigre", "Leão", "Elefante", "Gorila"], c: 1, v: 10 },
    { q: "Qual é a unidade de medida da corrente elétrica?", o: ["Ampere", "Ohm", "Volt", "Watt"], c: 0, v: 14 },
    { q: "Qual é o nome do ácido presente no vinagre?", o: ["Sulfúrico", "Acético", "Clorídrico", "Nítrico"], c: 1, v: 12 },
    { q: "Qual é o planeta conhecido como estrela da manhã?", o: ["Marte", "Vênus", "Mercúrio", "Júpiter"], c: 1, v: 13 },
    { q: "Quem inventou a lâmpada elétrica?", o: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Henry Ford"], c: 0, v: 15 },
    { q: "Qual é o símbolo do potássio?", o: ["P", "K", "Po", "Pt"], c: 1, v: 11 },
    { q: "Qual é o nome do processo de divisão celular?", o: ["Mitose", "Meiose", "Fissão", "Fusão"], c: 0, v: 14 },
    { q: "Qual é a velocidade do som no ar (aproximada)?", o: ["340 m/s", "300 m/s", "400 m/s", "500 m/s"], c: 0, v: 16 },
    { q: "Qual é o elemento mais abundante no universo?", o: ["Hidrogênio", "Hélio", "Oxigênio", "Carbono"], c: 0, v: 13 },
    { q: "Qual é o nome da molécula de DNA?", o: ["Ácido ribonucleico", "Ácido desoxirribonucleico", "Proteína", "Lipídio"], c: 1, v: 15 },
    { q: "Qual é o ponto de ebulição da água em Celsius?", o: ["100", "0", "212", "32"], c: 0, v: 10 },
    { q: "Qual é o nome do primeiro homem no espaço?", o: ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "John Glenn"], c: 1, v: 16 }
  ],
  history: [
    { q: "Em que ano caiu o Muro de Berlim?", o: ["1987", "1989", "1991", "1985"], c: 1, v: 15 },
    { q: "Quem foi o primeiro presidente dos EUA?", o: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], c: 2, v: 13 },
    { q: "Em que ano começou a Segunda Guerra Mundial?", o: ["1939", "1941", "1937", "1945"], c: 0, v: 17 },
    { q: "Quem escreveu 'O Príncipe'?", o: ["Maquiavel", "Platão", "Aristóteles", "César"], c: 0, v: 14 },
    { q: "Qual civilização construiu Machu Picchu?", o: ["Astecas", "Maias", "Incas", "Tupis"], c: 2, v: 16 },
    { q: "Quem liderou a independência da Índia?", o: ["Gandhi", "Nehru", "Bose", "Patel"], c: 0, v: 15 },
    { q: "Em que ano foi descoberta a América?", o: ["1492", "1453", "1519", "1415"], c: 0, v: 13 },
    { q: "Qual império construiu o Coliseu?", o: ["Grego", "Romano", "Bizantino", "Persa"], c: 1, v: 14 },
    { q: "Quem foi o líder da Revolução Francesa?", o: ["Napoleão", "Robespierre", "Luís XVI", "Danton"], c: 1, v: 16 },
    { q: "Qual foi a primeira civilização da Mesopotâmia?", o: ["Sumérios", "Acádios", "Babilônios", "Assírios"], c: 0, v: 15 },
    { q: "Em que ano terminou a Primeira Guerra Mundial?", o: ["1914", "1916", "1918", "1920"], c: 2, v: 14 },
    { q: "Quem pintou a Capela Sistina?", o: ["Leonardo da Vinci", "Michelangelo", "Rafael", "Donatello"], c: 1, v: 13 },
    { q: "Qual país iniciou a Revolução Industrial?", o: ["França", "Inglaterra", "Alemanha", "EUA"], c: 1, v: 15 },
    { q: "Quem foi Cleópatra?", o: ["Rainha do Egito", "Imperatriz romana", "Deusa grega", "Princesa persa"], c: 0, v: 12 },
    { q: "Qual tratado encerrou a Primeira Guerra Mundial?", o: ["Tratado de Versalhes", "Tratado de Paris", "Tratado de Tordesilhas", "Tratado de Brest-Litovsk"], c: 0, v: 16 },
    { q: "Em que ano ocorreu a Queda da Bastilha?", o: ["1789", "1776", "1815", "1799"], c: 0, v: 14 },
    { q: "Quem foi o último czar da Rússia?", o: ["Pedro o Grande", "Nicolau II", "Ivan o Terrível", "Catarina a Grande"], c: 1, v: 15 },
    { q: "Qual foi a batalha decisiva da Guerra de Independência Americana?", o: ["Yorktown", "Saratoga", "Bunker Hill", "Lexington"], c: 0, v: 16 },
    { q: "Quem descobriu o Brasil?", o: ["Cristóvão Colombo", "Pedro Álvares Cabral", "Vasco da Gama", "Fernão de Magalhães"], c: 1, v: 13 },
    { q: "Em que ano começou a Renascença?", o: ["século XIV", "século XVI", "século XII", "século XVIII"], c: 0, v: 15 },
    { q: "Qual civilização construiu as pirâmides de Gizé?", o: ["Egípcios", "Sumérios", "Incas", "Gregos"], c: 0, v: 12 },
    { q: "Quem foi o primeiro imperador romano?", o: ["Júlio César", "Augusto", "Nero", "Constantino"], c: 1, v: 14 },
    { q: "Em que ano foi assinada a Magna Carta?", o: ["1215", "1066", "1492", "1776"], c: 0, v: 13 },
    { q: "Qual foi o nome do navio de Colombo?", o: ["Mayflower", "Santa Maria", "Pinta", "Niña"], c: 1, v: 12 },
    { q: "Quem liderou a Revolução Russa?", o: ["Lenin", "Stalin", "Trotsky", "Kerensky"], c: 0, v: 15 },
    { q: "Em que ano terminou a Segunda Guerra Mundial?", o: ["1945", "1944", "1946", "1939"], c: 0, v: 14 },
    { q: "Qual foi o império de Genghis Khan?", o: ["Mongol", "Otomano", "Persa", "Romano"], c: 0, v: 13 },
    { q: "Quem inventou a imprensa?", o: ["Johannes Gutenberg", "Leonardo da Vinci", "Galileu Galilei", "Isaac Newton"], c: 0, v: 15 },
    { q: "Em que ano ocorreu o Holocausto?", o: ["Durante a Segunda Guerra", "Durante a Primeira Guerra", "Durante a Guerra Fria", "Durante a Renascença"], c: 0, v: 16 },
    { q: "Qual foi a dinastia chinesa que construiu a Grande Muralha?", o: ["Ming", "Qin", "Han", "Tang"], c: 1, v: 14 },
    { q: "Quem foi Joana d'Arc?", o: ["Heroína francesa", "Rainha inglesa", "Imperatriz romana", "Deusa grega"], c: 0, v: 13 },
    { q: "Em que ano foi fundada a ONU?", o: ["1945", "1919", "1950", "1930"], c: 0, v: 14 },
    { q: "Qual foi o período da Idade da Pedra?", o: ["Paleolítico", "Neolítico", "Mesolítico", "Todos acima"], c: 3, v: 15 },
    { q: "Quem foi o rei sol?", o: ["Luís XIV", "Luís XVI", "Napoleão", "Carlos Magno"], c: 0, v: 13 },
    { q: "Em que ano ocorreu a Independência do Brasil?", o: ["1822", "1500", "1889", "1960"], c: 0, v: 14 }
  ],
  geography: [
    { q: "Qual é o rio mais longo do mundo?", o: ["Amazonas", "Nilo", "Yangtzé", "Mississipi"], c: 1, v: 14 },
    { q: "Qual país tem mais ilhas no mundo?", o: ["Noruega", "Suécia", "Canadá", "Indonésia"], c: 1, v: 18 },
    { q: "Qual é o deserto mais seco do mundo?", o: ["Saara", "Gobi", "Atacama", "Kalahari"], c: 2, v: 20 },
    { q: "Onde fica o Monte Everest?", o: ["Nepal/China", "Índia", "Paquistão", "Butão"], c: 0, v: 15 },
    { q: "Qual é o menor país do mundo?", o: ["Mônaco", "San Marino", "Vaticano", "Liechtenstein"], c: 2, v: 12 },
    { q: "Qual é o maior oceano do planeta?", o: ["Atlântico", "Índico", "Pacífico", "Ártico"], c: 2, v: 13 },
    { q: "Qual é a maior cordilheira do mundo?", o: ["Andes", "Himalaia", "Alpes", "Rochosas"], c: 1, v: 15 },
    { q: "Qual país tem a maior área territorial?", o: ["Canadá", "China", "Rússia", "EUA"], c: 2, v: 14 },
    { q: "Qual é o maior lago de água doce do mundo?", o: ["Baikal", "Superior", "Vitória", "Titicaca"], c: 1, v: 13 },
    { q: "Qual é o ponto mais baixo da Terra?", o: ["Mar Morto", "Lago Assal", "Vale da Morte", "Salar de Uyuni"], c: 0, v: 16 },
    { q: "Qual país é conhecido como 'Terra do Sol Nascente'?", o: ["China", "Japão", "Coreia", "Tailândia"], c: 1, v: 12 },
    { q: "Qual é a maior ilha do mundo?", o: ["Austrália", "Groenlândia", "Nova Guiné", "Bornéu"], c: 1, v: 14 },
    { q: "Qual é o maior vulcão ativo do mundo?", o: ["Vesúvio", "Mauna Loa", "Kilimanjaro", "Etna"], c: 1, v: 15 },
    { q: "Qual país tem a maior população?", o: ["Índia", "China", "EUA", "Indonésia"], c: 0, v: 13 },
    { q: "Qual é o maior arquipélago do mundo?", o: ["Havaí", "Filipinas", "Indonésia", "Maldivas"], c: 2, v: 14 },
    { q: "Qual é o continente mais frio?", o: ["Ásia", "Antártida", "África", "Europa"], c: 1, v: 12 },
    { q: "Qual é o país com mais vulcões?", o: ["Japão", "Indonésia", "EUA", "Itália"], c: 1, v: 15 },
    { q: "Qual é o maior canyon do mundo?", o: ["Grand Canyon", "Fish River Canyon", "Colca Canyon", "Yarlung Tsangpo"], c: 3, v: 16 },
    { q: "Qual cidade é dividida por dois continentes?", o: ["Istambul", "Cairo", "Moscou", "Nova York"], c: 0, v: 14 },
    { q: "Qual é o país com a maior costa?", o: ["Canadá", "Rússia", "Indonésia", "Austrália"], c: 0, v: 15 },
    { q: "Qual é o deserto mais quente?", o: ["Saara", "Mojave", "Lut", "Atacama"], c: 2, v: 17 },
    { q: "Qual é o país mais montanhoso?", o: ["Nepal", "Butão", "Suíça", "Chile"], c: 1, v: 14 },
    { q: "Qual é a maior cachoeira do mundo?", o: ["Niágara", "Vitória", "Anjo", "Iguazu"], c: 2, v: 15 },
    { q: "Qual país não tem rios?", o: ["Arábia Saudita", "Egito", "Líbia", "Vaticano"], c: 0, v: 13 },
    { q: "Qual é o continente com mais países?", o: ["Ásia", "África", "Europa", "América do Sul"], c: 1, v: 14 },
    { q: "Qual é o país mais plano?", o: ["Holanda", "Dinamarca", "Maldivas", "Bangladesh"], c: 2, v: 15 },
    { q: "Qual é o maior delta do mundo?", o: ["Ganges", "Amazonas", "Nilo", "Mississipi"], c: 0, v: 14 },
    { q: "Qual país tem a maior densidade populacional?", o: ["Mônaco", "Singapura", "Bangladesh", "Índia"], c: 0, v: 16 },
    { q: "Qual é o ponto mais alto da África?", o: ["Monte Kilimanjaro", "Monte Kenya", "Monte Elbrus", "Monte Aconcágua"], c: 0, v: 15 },
    { q: "Qual é o país com mais lagos?", o: ["Canadá", "Finlândia", "Rússia", "EUA"], c: 0, v: 14 },
    { q: "Qual é a maior península do mundo?", o: ["Ibérica", "Arábica", "Escandinava", "Índia"], c: 1, v: 15 },
    { q: "Qual país é um continente?", o: ["Austrália", "Antártida", "África", "Europa"], c: 0, v: 12 },
    { q: "Qual é o rio mais volumoso?", o: ["Nilo", "Amazonas", "Yangtzé", "Congo"], c: 1, v: 16 },
    { q: "Qual é o país com mais fronteiras?", o: ["Rússia", "China", "Brasil", "Alemanha"], c: 1, v: 15 },
    { q: "Qual é a maior baía do mundo?", o: ["Bengala", "Hudson", "México", "Biscaya"], c: 0, v: 14 }
  ],
  tech: [
    { q: "Quem criou o Linux?", o: ["Bill Gates", "Linus Torvalds", "Steve Jobs", "Mark Zuckerberg"], c: 1, v: 16 },
    { q: "Qual linguagem é usada para estilizar páginas web?", o: ["JavaScript", "HTML", "CSS", "Python"], c: 2, v: 10 },
    { q: "O que significa 'HTTP'?", o: ["Hyper Text Transfer Protocol", "High Tech Text Process", "Hyperlink Text Transfer", "Home Tool Transfer"], c: 0, v: 14 },
    { q: "Qual empresa criou o Android?", o: ["Apple", "Google", "Microsoft", "Samsung"], c: 1, v: 12 },
    { q: "Qual é a base numérica do sistema binário?", o: ["8", "10", "2", "16"], c: 2, v: 8 },
    { q: "Qual é a linguagem de programação mais antiga ainda em uso?", o: ["C", "Fortran", "Python", "Java"], c: 1, v: 15 },
    { q: "O que significa 'RAM'?", o: ["Random Access Memory", "Read Always Memory", "Real Address Memory", "Runtime Access Memory"], c: 0, v: 12 },
    { q: "Qual empresa criou o Windows?", o: ["Apple", "Microsoft", "IBM", "Google"], c: 1, v: 11 },
    { q: "O que é um 'byte'?", o: ["8 bits", "4 bits", "16 bits", "32 bits"], c: 0, v: 10 },
    { q: "Qual foi o primeiro computador pessoal amplamente usado?", o: ["Apple II", "IBM PC", "Commodore 64", "Altair 8800"], c: 0, v: 14 },
    { q: "Qual linguagem é usada para desenvolvimento de aplicativos iOS?", o: ["Java", "Swift", "Python", "C#"], c: 1, v: 13 },
    { q: "O que significa 'URL'?", o: ["Uniform Resource Locator", "Unique Resource Link", "Universal Record Locator", "Unified Resource Language"], c: 0, v: 12 },
    { q: "Qual empresa criou o primeiro iPhone?", o: ["Samsung", "Apple", "Nokia", "BlackBerry"], c: 1, v: 11 },
    { q: "O que é 'SQL'?", o: ["Structured Query Language", "Sequential Query Logic", "System Query Language", "Standard Query Loop"], c: 0, v: 14 },
    { q: "Qual é o nome do primeiro navegador web?", o: ["Netscape", "Mosaic", "Internet Explorer", "Firefox"], c: 1, v: 15 },
    { q: "Quem inventou o World Wide Web?", o: ["Tim Berners-Lee", "Vint Cerf", "Bill Gates", "Steve Jobs"], c: 0, v: 16 },
    { q: "O que significa 'AI'?", o: ["Artificial Intelligence", "Advanced Internet", "Automated Interface", "Algorithmic Intelligence"], c: 0, v: 12 },
    { q: "Qual é a linguagem principal para data science?", o: ["Java", "Python", "C++", "Ruby"], c: 1, v: 14 },
    { q: "O que é 'Blockchain'?", o: ["Tecnologia de criptomoedas", "Tipo de banco de dados", "Rede social", "Sistema operacional"], c: 0, v: 15 },
    { q: "Qual empresa criou o YouTube?", o: ["Google", "Facebook", "Microsoft", "Amazon"], c: 0, v: 13 },
    { q: "O que significa 'VPN'?", o: ["Virtual Private Network", "Very Personal Network", "Virtual Public Network", "Visual Private Node"], c: 0, v: 14 },
    { q: "Qual é o fundador do Facebook?", o: ["Mark Zuckerberg", "Elon Musk", "Jeff Bezos", "Larry Page"], c: 0, v: 12 },
    { q: "O que é 'Cloud Computing'?", o: ["Computação em nuvem", "Computação local", "Computação quântica", "Computação analógica"], c: 0, v: 15 },
    { q: "Qual linguagem é usada para apps Android?", o: ["Swift", "Kotlin", "Python", "C#"], c: 1, v: 13 },
    { q: "O que significa 'IoT'?", o: ["Internet of Things", "Input Output Terminal", "International Online Trade", "Integrated Operating Tool"], c: 0, v: 14 },
    { q: "Qual é o primeiro vírus de computador conhecido?", o: ["Creeper", "ILOVEYOU", "Melissa", "Conficker"], c: 0, v: 16 },
    { q: "Quem é o CEO da Tesla?", o: ["Jeff Bezos", "Elon Musk", "Tim Cook", "Sundar Pichai"], c: 1, v: 12 },
    { q: "O que é 'Big Data'?", o: ["Grandes volumes de dados", "Dados pequenos", "Dados criptografados", "Dados visuais"], c: 0, v: 15 },
    { q: "Qual empresa criou o Alexa?", o: ["Google", "Amazon", "Apple", "Microsoft"], c: 1, v: 13 },
    { q: "O que significa 'HTML'?", o: ["Hyper Text Markup Language", "High Tech Markup Language", "Home Tool Markup Language", "Hyperlink Text Markup Language"], c: 0, v: 14 },
    { q: "Qual é a velocidade de um processador medida em?", o: ["GHz", "MB", "KB", "TB"], c: 0, v: 12 },
    { q: "O que é 'Machine Learning'?", o: ["Aprendizado de máquina", "Aprendizado humano", "Programação básica", "Design gráfico"], c: 0, v: 15 },
    { q: "Qual linguagem é usada para web backend?", o: ["HTML", "PHP", "CSS", "JavaScript"], c: 1, v: 13 },
    { q: "O que significa 'API'?", o: ["Application Programming Interface", "Advanced Programming Interface", "Automated Process Interface", "Application Process Integration"], c: 0, v: 14 },
    { q: "Qual é o fundador da Microsoft?", o: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Larry Ellison"], c: 1, v: 12 }
  ],
  movies: [
    { q: "Quem dirigiu 'Interestelar'?", o: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Quentin Tarantino"], c: 2, v: 15 },
    { q: "Qual filme tem o Coringa interpretado por Heath Ledger?", o: ["Batman Begins", "O Cavaleiro das Trevas", "The Dark Knight Rises", "Joker"], c: 1, v: 18 },
    { q: "Qual é o nome do dragão em 'Como Treinar o Seu Dragão'?", o: ["Toothless", "Smaug", "Drogon", "Eragon"], c: 0, v: 13 },
    { q: "Em que ano foi lançado 'Vingadores: Ultimato'?", o: ["2018", "2019", "2020", "2017"], c: 1, v: 14 },
    { q: "Qual estúdio fez 'Shrek'?", o: ["Pixar", "DreamWorks", "Disney", "Illumination"], c: 1, v: 12 },
    { q: "Quem dirigiu 'Pulp Fiction'?", o: ["Martin Scorsese", "Quentin Tarantino", "David Fincher", "Coen Brothers"], c: 1, v: 15 },
    { q: "Qual filme ganhou o Oscar de Melhor Filme em 1994?", o: ["Forrest Gump", "Pulp Fiction", "O Rei Leão", "Velocidade Máxima"], c: 0, v: 14 },
    { q: "Qual é o nome do navio em 'Titanic'?", o: ["Lusitania", "Titanic", "Britannic", "Carpathia"], c: 1, v: 12 },
    { q: "Quem interpretou Harry Potter nos filmes?", o: ["Daniel Radcliffe", "Rupert Grint", "Tom Felton", "Emma Watson"], c: 0, v: 13 },
    { q: "Qual estúdio produziu 'Toy Story'?", o: ["DreamWorks", "Pixar", "Illumination", "Blue Sky"], c: 1, v: 12 },
    { q: "Qual é o nome do leão em 'O Rei Leão'?", o: ["Simba", "Mufasa", "Scar", "Nala"], c: 0, v: 11 },
    { q: "Quem dirigiu 'O Senhor dos Anéis'?", o: ["Peter Jackson", "Steven Spielberg", "George Lucas", "Ridley Scott"], c: 0, v: 15 },
    { q: "Qual filme tem o personagem 'Darth Vader'?", o: ["Star Trek", "Star Wars", "Duna", "Blade Runner"], c: 1, v: 13 },
    { q: "Em que ano foi lançado 'Matrix'?", o: ["1997", "1999", "2001", "2003"], c: 1, v: 14 },
    { q: "Qual é o nome do mago em 'O Hobbit'?", o: ["Gandalf", "Dumbledore", "Merlin", "Saruman"], c: 0, v: 12 },
    { q: "Quem dirigiu 'Inception'?", o: ["Christopher Nolan", "Martin Scorsese", "Steven Spielberg", "James Cameron"], c: 0, v: 15 },
    { q: "Qual filme ganhou o Oscar de Melhor Filme em 2020?", o: ["1917", "Parasita", "Joker", "Once Upon a Time in Hollywood"], c: 1, v: 16 },
    { q: "Qual é o nome do robô em 'Wall-E'?", o: ["Eve", "Wall-E", "Mo", "Auto"], c: 1, v: 12 },
    { q: "Quem interpretou Tony Stark nos Vingadores?", o: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], c: 1, v: 14 },
    { q: "Qual é o estúdio de 'Frozen'?", o: ["Pixar", "DreamWorks", "Disney", "Illumination"], c: 2, v: 13 },
    { q: "Qual filme tem 'May the Force be with you'?", o: ["Star Trek", "Star Wars", "Guardians of the Galaxy", "Avengers"], c: 1, v: 12 },
    { q: "Quem dirigiu 'Avatar'?", o: ["Christopher Nolan", "James Cameron", "Peter Jackson", "Steven Spielberg"], c: 1, v: 15 },
    { q: "Qual é o nome do vilão em 'O Rei Leão'?", o: ["Mufasa", "Scar", "Simba", "Timon"], c: 1, v: 11 },
    { q: "Em que ano foi lançado 'Jurassic Park'?", o: ["1993", "1990", "1995", "1989"], c: 0, v: 14 },
    { q: "Qual filme tem o personagem 'Jack Sparrow'?", o: ["Piratas do Caribe", "Indiana Jones", "Star Wars", "Senhor dos Anéis"], c: 0, v: 13 },
    { q: "Quem interpretou o Coringa em 2019?", o: ["Heath Ledger", "Joaquin Phoenix", "Jack Nicholson", "Jared Leto"], c: 1, v: 15 },
    { q: "Qual é o nome do filme com Tom Hanks isolado em uma ilha?", o: ["Forrest Gump", "Náufrago", "O Resgate do Soldado Ryan", "Apollo 13"], c: 1, v: 14 },
    { q: "Quem dirigiu 'O Poderoso Chefão'?", o: ["Martin Scorsese", "Francis Ford Coppola", "Quentin Tarantino", "Alfred Hitchcock"], c: 1, v: 16 },
    { q: "Qual filme ganhou o primeiro Oscar de animação?", o: ["Shrek", "Toy Story", "O Rei Leão", "A Bela e a Fera"], c: 0, v: 15 },
    { q: "Qual é o nome do assistente de Sherlock Holmes?", o: ["Watson", "Moriarty", "Lestrade", "Hudson"], c: 0, v: 12 },
    { q: "Em que ano foi lançado 'E.T.'?", o: ["1982", "1980", "1984", "1977"], c: 0, v: 14 },
    { q: "Qual filme tem 'I'll be back'?", o: ["O Exterminador do Futuro", "Rambo", "Predador", "Comando para Matar"], c: 0, v: 13 },
    { q: "Quem interpretou Neo em 'Matrix'?", o: ["Tom Cruise", "Keanu Reeves", "Brad Pitt", "Johnny Depp"], c: 1, v: 14 },
    { q: "Qual é o estúdio de 'Minions'?", o: ["Pixar", "DreamWorks", "Disney", "Illumination"], c: 3, v: 12 },
    { q: "Quem dirigiu 'Psicose'?", o: ["Alfred Hitchcock", "Stanley Kubrick", "Orson Welles", "Federico Fellini"], c: 0, v: 15 }
  ],
  riddles: [
    { q: "Quanto tempo leva para o Sol ficar verde?", o: ["Nunca", "100 anos", "1000 anos", "Depende"], c: 0, v: 25 },
    { q: "Se um galo bota um ovo no telhado, pra onde ele cai?", o: ["Direita", "Esquerda", "Não cai", "Cai"], c: 2, v: 20 },
    { q: "Quantos meses têm 28 dias?", o: ["1", "6", "12", "2"], c: 2, v: 15 },
    { q: "O que é que está no meio do céu?", o: ["A", "C", "E", "U"], c: 2, v: 18 },
    { q: "O que é que quanto mais se tira, maior fica?", o: ["Buraco", "Pedra", "Árvore", "Saco"], c: 0, v: 16 },
    { q: "O que tem pescoço, mas não tem cabeça?", o: ["Garrafa", "Camisa", "Cachorro", "Mesa"], c: 0, v: 15 },
    { q: "O que é que corre mas não anda?", o: ["Água", "Vento", "Carro", "Tempo"], c: 0, v: 14 },
    { q: "O que é que voa sem asas?", o: ["Tempo", "Pássaro", "Avião", "Nuvem"], c: 0, v: 16 },
    { q: "O que é que está sempre na sua frente, mas você nunca vê?", o: ["Futuro", "Nariz", "Sombra", "Cabelo"], c: 0, v: 17 },
    { q: "O que é que tem chaves mas não abre portas?", o: ["Piano", "Máquina de escrever", "Cofre", "Carro"], c: 0, v: 15 },
    { q: "O que é que quanto mais seca, mais molhada fica?", o: ["Toalha", "Esponja", "Roupas", "Areia"], c: 0, v: 14 },
    { q: "O que é que nunca pergunta, mas sempre responde?", o: ["Eco", "Sino", "Telefone", "Rádio"], c: 0, v: 16 },
    { q: "O que é que tem um buraco no meio?", o: ["Rosquinha", "Pneu", "Anel", "Disco"], c: 0, v: 15 },
    { q: "O que é que cai em pé?", o: ["Chuva", "Árvore", "Vassoura", "Cachorro"], c: 0, v: 14 },
    { q: "O que é que é seu, mas os outros usam mais?", o: ["Nome", "Dinheiro", "Casa", "Carro"], c: 0, v: 16 },
    { q: "O que é que tem dentes mas não morde?", o: ["Pente", "Serra", "Faca", "Tesoura"], c: 0, v: 15 },
    { q: "O que é que vai e volta mas não sai do lugar?", o: ["Porta", "Relógio", "Elevador", "Trem"], c: 0, v: 14 },
    { q: "O que é que tem coroa mas não é rei?", o: ["Dente", "Árvore", "Montanha", "Flor"], c: 0, v: 16 },
    { q: "O que é que nasce grande e morre pequeno?", o: ["Lápis", "Vela", "Sabonete", "Todos acima"], c: 3, v: 17 },
    { q: "O que é que tem folhas mas não é árvore?", o: ["Livro", "Jornal", "Revista", "Todos acima"], c: 3, v: 15 },
    { q: "O que é que anda com os pés na cabeça?", o: ["Piolho", "Formiga", "Aranha", "Mosca"], c: 0, v: 14 },
    { q: "O que é que é cheio de furos mas segura água?", o: ["Esponja", "Queijo", "Rede", "Balde"], c: 0, v: 16 },
    { q: "O que é que tem olhos mas não vê?", o: ["Agulha", "Batata", "Tempestade", "Todos acima"], c: 3, v: 15 },
    { q: "O que é que quebra quando fala?", o: ["Silêncio", "Vidro", "Ovo", "Coração"], c: 0, v: 14 },
    { q: "O que é que tem cidades mas não casas?", o: ["Mapa", "Livro", "Jogo", "Filme"], c: 0, v: 16 },
    { q: "O que é que é preto quando compra, vermelho quando usa, cinza quando joga fora?", o: ["Carvão", "Ferro", "Papel", "Plástico"], c: 0, v: 17 },
    { q: "O que é que tem raiz mas não é planta?", o: ["Cabelo", "Dente", "Matemática", "Todos acima"], c: 3, v: 15 },
    { q: "O que é que é surdo e mudo mas conta tudo?", o: ["Livro", "Espelho", "Relógio", "Televisão"], c: 1, v: 14 },
    { q: "O que é que tem pescoço mas não tem corpo?", o: ["Garrafa", "Camisa", "Guitarra", "Violino"], c: 0, v: 16 },
    { q: "O que é que é feito para andar mas não anda?", o: ["Rua", "Carro", "Bicicleta", "Trem"], c: 0, v: 15 },
    { q: "O que é que tem cama mas não dorme?", o: ["Rio", "Hospital", "Hotel", "Casa"], c: 0, v: 14 },
    { q: "O que é que é meu mas você usa mais?", o: ["Nome", "Endereço", "Telefone", "Email"], c: 0, v: 16 },
    { q: "O que é que tem banco mas não dinheiro?", o: ["Rio", "Praça", "Jardim", "Todos acima"], c: 3, v: 15 },
    { q: "O que é que sobe e desce mas fica no lugar?", o: ["Escada rolante", "Temperatura", "Idade", "Elevador"], c: 1, v: 14 },
    { q: "O que é que tem rabo mas não é animal?", o: ["Panela", "Cometa", "Foguete", "Todos acima"], c: 3, v: 16 }
  ],
  sports: [
    { q: "Qual esporte usa uma bola amarela?", o: ["Futebol", "Tênis", "Basquete", "Vôlei"], c: 1, v: 12 },
    { q: "Quantos jogadores tem um time de futebol?", o: ["11", "9", "7", "5"], c: 0, v: 10 },
    { q: "Qual é o país com mais Copas do Mundo?", o: ["Alemanha", "Brasil", "Itália", "Argentina"], c: 1, v: 14 },
    { q: "Em que esporte se usa um taco?", o: ["Golfe", "Beisebol", "Hóquei", "Todos acima"], c: 3, v: 13 },
    { q: "Qual é o recordista de 100m rasos?", o: ["Usain Bolt", "Carl Lewis", "Mo Farah", "Jesse Owens"], c: 0, v: 15 },
    { q: "Quantas medalhas de ouro tem Michael Phelps?", o: ["23", "18", "28", "15"], c: 0, v: 16 },
    { q: "Qual esporte é jogado no Wimbledon?", o: ["Tênis", "Golfe", "Críquete", "Rugby"], c: 0, v: 12 },
    { q: "Quem é conhecido como 'O Rei' no futebol?", o: ["Maradona", "Pelé", "Messi", "Cristiano Ronaldo"], c: 1, v: 14 },
    { q: "Qual é o esporte com rede no meio?", o: ["Vôlei", "Tênis", "Badminton", "Todos acima"], c: 3, v: 13 },
    { q: "Em que ano foi a primeira Olimpíada moderna?", o: ["1896", "1900", "1880", "1912"], c: 0, v: 15 },
    { q: "Qual país inventou o karatê?", o: ["China", "Japão", "Coreia", "Tailândia"], c: 1, v: 12 },
    { q: "Quantos rounds tem uma luta de boxe profissional?", o: ["12", "10", "15", "8"], c: 0, v: 14 },
    { q: "Qual esporte usa um disco?", o: ["Hóquei no gelo", "Frisbee", "Arremesso de disco", "Todos acima"], c: 3, v: 13 },
    { q: "Quem ganhou a Copa do Mundo de 2018?", o: ["Alemanha", "França", "Brasil", "Croácia"], c: 1, v: 15 },
    { q: "Qual é o esporte rei nos EUA?", o: ["Basquete", "Futebol americano", "Beisebol", "Hóquei"], c: 1, v: 12 },
    { q: "Quantos pontos vale um touchdown?", o: ["6", "7", "3", "1"], c: 0, v: 13 },
    { q: "Qual atleta é conhecido como 'The Greatest'?", o: ["Muhammad Ali", "Michael Jordan", "Tiger Woods", "Serena Williams"], c: 0, v: 15 },
    { q: "Em que esporte se usa um shuttlecock?", o: ["Tênis", "Badminton", "Squash", "Pingue-pongue"], c: 1, v: 14 },
    { q: "Qual país sediou as Olimpíadas de 2016?", o: ["Brasil", "China", "Inglaterra", "Japão"], c: 0, v: 12 },
    { q: "Quantos jogadores em um time de basquete?", o: ["5", "6", "7", "11"], c: 0, v: 10 },
    { q: "Qual é o Grand Slam do tênis?", o: ["Australian Open", "French Open", "Wimbledon", "Todos acima"], c: 3, v: 15 },
    { q: "Quem é o maior artilheiro da história das Copas?", o: ["Pelé", "Miroslav Klose", "Ronaldo", "Messi"], c: 1, v: 16 },
    { q: "Qual esporte é praticado no gelo com vassouras?", o: ["Hóquei", "Curling", "Patinação", "Bobsled"], c: 1, v: 14 },
    { q: "Quantas vezes o Brasil ganhou a Copa?", o: ["5", "4", "6", "3"], c: 0, v: 12 },
    { q: "Qual é o esporte com cavalos e taco?", o: ["Polo", "Hipismo", "Corrida", "Rodeio"], c: 0, v: 13 },
    { q: "Quem ganhou o Tour de France mais vezes?", o: ["Lance Armstrong", "Miguel Indurain", "Eddy Merckx", "Todos com 5"], c: 3, v: 15 },
    { q: "Qual país inventou o futebol?", o: ["Brasil", "Inglaterra", "Itália", "Alemanha"], c: 1, v: 12 },
    { q: "Quantos buracos tem um campo de golfe padrão?", o: ["18", "9", "27", "12"], c: 0, v: 11 },
    { q: "Qual atleta tem mais medalhas olímpicas?", o: ["Usain Bolt", "Michael Phelps", "Larisa Latynina", "Carl Lewis"], c: 1, v: 16 },
    { q: "Em que esporte se usa um gi?", o: ["Judô", "Karatê", "Taekwondo", "Todos acima"], c: 3, v: 14 },
    { q: "Qual é o Super Bowl?", o: ["Final de basquete", "Final de futebol americano", "Final de beisebol", "Final de hóquei"], c: 1, v: 13 },
    { q: "Quem é Serena Williams?", o: ["Jogadora de tênis", "Nadadora", "Atleta de pista", "Ginasta"], c: 0, v: 12 },
    { q: "Qual país ganhou a Euro 2020?", o: ["Portugal", "Itália", "França", "Inglaterra"], c: 1, v: 14 },
    { q: "Quantos sets em uma partida de tênis masculina?", o: ["3 de 5", "2 de 3", "1", "4 de 7"], c: 0, v: 13 },
    { q: "Qual esporte é o sumô?", o: ["Luta japonesa", "Boxe tailandês", "Kung fu chinês", "Capoeira brasileira"], c: 0, v: 15 }
  ],
  literature: [
    { q: "Quem escreveu 'Dom Quixote'?", o: ["Miguel de Cervantes", "William Shakespeare", "Dante Alighieri", "Victor Hugo"], c: 0, v: 15 },
    { q: "Qual é o livro mais vendido do mundo?", o: ["A Bíblia", "O Pequeno Príncipe", "Harry Potter", "O Senhor dos Anéis"], c: 0, v: 14 },
    { q: "Quem é o autor de '1984'?", o: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Philip K. Dick"], c: 0, v: 16 },
    { q: "Em que livro aparece o personagem Sherlock Holmes?", o: ["Um Estudo em Vermelho", "O Cão dos Baskervilles", "Todos acima", "A Aventura da Faixa Malhada"], c: 2, v: 15 },
    { q: "Quem escreveu 'A Divina Comédia'?", o: ["Dante Alighieri", "Virgílio", "Homero", "Petrarca"], c: 0, v: 14 },
    { q: "Qual é o primeiro livro de Harry Potter?", o: ["A Pedra Filosofal", "A Câmara Secreta", "O Prisioneiro de Azkaban", "O Cálice de Fogo"], c: 0, v: 13 },
    { q: "Quem é o autor de 'Orgulho e Preconceito'?", o: ["Jane Austen", "Charlotte Brontë", "Emily Brontë", "Mary Shelley"], c: 0, v: 15 },
    { q: "Qual livro tem o personagem Holden Caulfield?", o: ["O Apanhador no Campo de Centeio", "O Grande Gatsby", "Matar um Mockingbird", "O Sol é para Todos"], c: 0, v: 16 },
    { q: "Quem escreveu 'O Pequeno Príncipe'?", o: ["Antoine de Saint-Exupéry", "Lewis Carroll", "J.R.R. Tolkien", "C.S. Lewis"], c: 0, v: 14 },
    { q: "Qual é o épico grego sobre a guerra de Troia?", o: ["Ilíada", "Odisseia", "Eneida", "Beowulf"], c: 0, v: 15 },
    { q: "Quem é o autor de 'Crime e Castigo'?", o: ["Fiódor Dostoiévski", "Leon Tolstói", "Anton Chekhov", "Ivan Turgueniev"], c: 0, v: 16 },
    { q: "Qual livro tem o personagem Bilbo Baggins?", o: ["O Hobbit", "O Senhor dos Anéis", "As Crônicas de Nárnia", "Eragon"], c: 0, v: 13 },
    { q: "Quem escreveu 'Macbeth'?", o: ["William Shakespeare", "Christopher Marlowe", "John Milton", "Geoffrey Chaucer"], c: 0, v: 14 },
    { q: "Qual é o livro sobre uma distopia com Big Brother?", o: ["Admirável Mundo Novo", "1984", "Fahrenheit 451", "Nós"], c: 1, v: 15 },
    { q: "Quem é a autora de 'Frankenstein'?", o: ["Mary Shelley", "Jane Austen", "Emily Dickinson", "Virginia Woolf"], c: 0, v: 14 },
    { q: "Qual livro tem o personagem Atticus Finch?", o: ["O Sol é para Todos", "O Grande Gatsby", "As Vinhas da Ira", "O Velho e o Mar"], c: 0, v: 16 },
    { q: "Quem escreveu 'Guerra e Paz'?", o: ["Leon Tolstói", "Fiódor Dostoiévski", "Aleksandr Pushkin", "Nikolai Gogol"], c: 0, v: 15 },
    { q: "Qual é o primeiro livro da Bíblia?", o: ["Êxodo", "Gênesis", "Levítico", "Números"], c: 1, v: 12 },
    { q: "Quem é o autor de 'Alice no País das Maravilhas'?", o: ["Lewis Carroll", "J.M. Barrie", "Roald Dahl", "A.A. Milne"], c: 0, v: 14 },
    { q: "Qual livro tem o personagem Jay Gatsby?", o: ["O Grande Gatsby", "Este Lado do Paraíso", "Belos e Malditos", "O Último Magnata"], c: 0, v: 15 },
    { q: "Quem escreveu 'O Conde de Monte Cristo'?", o: ["Alexandre Dumas", "Victor Hugo", "Jules Verne", "Émile Zola"], c: 0, v: 14 },
    { q: "Qual é o livro sobre hobbits e um anel?", o: ["O Senhor dos Anéis", "O Hobbit", "As Duas Torres", "O Retorno do Rei"], c: 0, v: 13 },
    { q: "Quem é a autora de 'Harry Potter'?", o: ["J.K. Rowling", "Suzanne Collins", "Veronica Roth", "Stephenie Meyer"], c: 0, v: 12 },
    { q: "Qual livro tem o personagem Huckleberry Finn?", o: ["As Aventuras de Tom Sawyer", "As Aventuras de Huckleberry Finn", "O Príncipe e o Mendigo", "Um Ianque na Corte do Rei Artur"], c: 1, v: 15 },
    { q: "Quem escreveu 'Ulisses'?", o: ["James Joyce", "Virginia Woolf", "T.S. Eliot", "Ezra Pound"], c: 0, v: 16 },
    { q: "Qual é o épico indiano sobre Rama?", o: ["Mahabharata", "Ramayana", "Bhagavad Gita", "Vedas"], c: 1, v: 14 },
    { q: "Quem é o autor de 'O Estrangeiro'?", o: ["Albert Camus", "Jean-Paul Sartre", "Simone de Beauvoir", "Franz Kafka"], c: 0, v: 15 },
    { q: "Qual livro tem o personagem Scout?", o: ["O Sol é para Todos", "O Apanhador no Campo de Centeio", "O Grande Gatsby", "1984"], c: 0, v: 14 },
    { q: "Quem escreveu 'Anna Karenina'?", o: ["Leon Tolstói", "Fiódor Dostoiévski", "Ivan Turgueniev", "Anton Chekhov"], c: 0, v: 15 },
    { q: "Qual é o livro sobre uma fazenda de animais?", o: ["A Revolução dos Bichos", "Charlotte's Web", "Watership Down", "O Vento nos Salgueiros"], c: 0, v: 14 },
    { q: "Quem é o autor de 'O Processo'?", o: ["Franz Kafka", "Hermann Hesse", "Thomas Mann", "Bertolt Brecht"], c: 0, v: 15 },
    { q: "Qual livro tem o personagem Elizabeth Bennet?", o: ["Orgulho e Preconceito", "Razão e Sensibilidade", "Emma", "Persuasão"], c: 0, v: 14 },
    { q: "Quem escreveu 'Cem Anos de Solidão'?", o: ["Gabriel García Márquez", "Mario Vargas Llosa", "Pablo Neruda", "Octavio Paz"], c: 0, v: 16 },
    { q: "Qual é o primeiro livro das Crônicas de Nárnia?", o: ["O Leão, a Feiticeira e o Guarda-Roupa", "O Sobrinho do Mago", "O Cavalo e seu Menino", "Príncipe Caspian"], c: 1, v: 15 },
    { q: "Quem é o autor de 'Moby Dick'?", o: ["Herman Melville", "Mark Twain", "Nathaniel Hawthorne", "Edgar Allan Poe"], c: 0, v: 14 }
  ],
  music: [
    { q: "Quem é conhecido como o Rei do Pop?", o: ["Elvis Presley", "Michael Jackson", "Prince", "David Bowie"], c: 1, v: 12 },
    { q: "Qual banda cantou 'Bohemian Rhapsody'?", o: ["The Beatles", "Queen", "Led Zeppelin", "Pink Floyd"], c: 1, v: 14 },
    { q: "Quem compôs a Nona Sinfonia?", o: ["Mozart", "Beethoven", "Bach", "Chopin"], c: 1, v: 15 },
    { q: "Qual instrumento Jimi Hendrix tocava?", o: ["Bateria", "Guitarra", "Baixo", "Teclado"], c: 1, v: 13 },
    { q: "Quem é a Rainha do Pop?", o: ["Madonna", "Britney Spears", "Lady Gaga", "Beyoncé"], c: 0, v: 14 },
    { q: "Qual banda tem o álbum 'The Dark Side of the Moon'?", o: ["Pink Floyd", "The Rolling Stones", "The Who", "Genesis"], c: 0, v: 15 },
    { q: "Quem cantou 'Like a Virgin'?", o: ["Cyndi Lauper", "Madonna", "Whitney Houston", "Tina Turner"], c: 1, v: 13 },
    { q: "Qual é o gênero de Bob Marley?", o: ["Reggae", "Rock", "Jazz", "Blues"], c: 0, v: 12 },
    { q: "Quem compôs 'O Lago dos Cisnes'?", o: ["Tchaikovsky", "Stravinsky", "Rachmaninoff", "Prokofiev"], c: 0, v: 16 },
    { q: "Qual banda tem Paul McCartney?", o: ["The Beatles", "Wings", "The Rolling Stones", "The Kinks"], c: 0, v: 14 },
    { q: "Quem cantou 'Thriller'?", o: ["Michael Jackson", "Prince", "George Michael", "Lionel Richie"], c: 0, v: 13 },
    { q: "Qual instrumento é associado a Louis Armstrong?", o: ["Trompete", "Saxofone", "Clarinete", "Trombone"], c: 0, v: 15 },
    { q: "Quem é o Rei do Rock?", o: ["Elvis Presley", "Chuck Berry", "Little Richard", "Jerry Lee Lewis"], c: 0, v: 12 },
    { q: "Qual banda cantou 'Stairway to Heaven'?", o: ["Led Zeppelin", "Deep Purple", "Black Sabbath", "The Doors"], c: 0, v: 15 },
    { q: "Quem compôs 'As Quatro Estações'?", o: ["Vivaldi", "Handel", "Bach", "Mozart"], c: 0, v: 14 },
    { q: "Qual é o gênero de Miles Davis?", o: ["Jazz", "Blues", "Rock", "Clássico"], c: 0, v: 12 },
    { q: "Quem cantou 'Rolling in the Deep'?", o: ["Adele", "Amy Winehouse", "Beyoncé", "Rihanna"], c: 0, v: 13 },
    { q: "Qual banda tem o álbum 'Abbey Road'?", o: ["The Beatles", "The Beach Boys", "The Monkees", "The Byrds"], c: 0, v: 15 },
    { q: "Quem é conhecida como a Rainha do Soul?", o: ["Aretha Franklin", "Diana Ross", "Tina Turner", "Whitney Houston"], c: 0, v: 14 },
    { q: "Qual instrumento Paganini tocava?", o: ["Violino", "Piano", "Violoncelo", "Flauta"], c: 0, v: 13 },
    { q: "Quem cantou 'Purple Rain'?", o: ["Prince", "Michael Jackson", "David Bowie", "Stevie Wonder"], c: 0, v: 14 },
    { q: "Qual banda cantou 'Hotel California'?", o: ["Eagles", "Fleetwood Mac", "The Doors", "Creedence Clearwater Revival"], c: 0, v: 15 },
    { q: "Quem compôs 'Eine kleine Nachtmusik'?", o: ["Mozart", "Beethoven", "Haydn", "Schubert"], c: 0, v: 14 },
    { q: "Qual é o gênero de Eminem?", o: ["Rap", "Rock", "Pop", "Country"], c: 0, v: 12 },
    { q: "Quem cantou 'I Will Always Love You'?", o: ["Whitney Houston", "Dolly Parton", "Celine Dion", "Mariah Carey"], c: 0, v: 13 },
    { q: "Qual banda tem Mick Jagger?", o: ["The Rolling Stones", "The Who", "The Kinks", "The Animals"], c: 0, v: 15 },
    { q: "Quem é o compositor de 'O Fantasma da Ópera'?", o: ["Andrew Lloyd Webber", "Stephen Sondheim", "Lin-Manuel Miranda", "Richard Rodgers"], c: 0, v: 16 },
    { q: "Qual instrumento é associado a B.B. King?", o: ["Guitarra", "Harmônica", "Saxofone", "Piano"], c: 0, v: 13 },
    { q: "Quem cantou 'Bad Romance'?", o: ["Lady Gaga", "Katy Perry", "Taylor Swift", "Rihanna"], c: 0, v: 14 },
    { q: "Qual banda cantou 'Smells Like Teen Spirit'?", o: ["Nirvana", "Pearl Jam", "Soundgarden", "Alice in Chains"], c: 0, v: 15 },
    { q: "Quem compôs 'Bolero'?", o: ["Ravel", "Debussy", "Saint-Saëns", "Bizet"], c: 0, v: 14 },
    { q: "Qual é o gênero de Taylor Swift originalmente?", o: ["Country", "Pop", "Rock", "Hip Hop"], c: 0, v: 12 },
    { q: "Quem cantou 'Billie Jean'?", o: ["Michael Jackson", "Prince", "James Brown", "Stevie Wonder"], c: 0, v: 13 },
    { q: "Qual banda tem o álbum 'Rumours'?", o: ["Fleetwood Mac", "Eagles", "Boston", "Journey"], c: 0, v: 15 },
    { q: "Quem compôs 'A Flauta Mágica'?", o: ["Mozart", "Beethoven", "Wagner", "Verdi"], c: 0, v: 14 }
  ],
  animals: [
    { q: "Qual é o maior animal do mundo?", o: ["Elefante", "Baleia Azul", "Girafa", "Tubarão Baleia"], c: 1, v: 12 },
    { q: "Qual animal é conhecido por suas listras?", o: ["Zebra", "Tigre", "Leopardo", "Hiena"], c: 0, v: 10 },
    { q: "Qual é o animal mais rápido?", o: ["Guepardo", "Leão", "Águia", "Cavalo"], c: 0, v: 13 },
    { q: "Qual animal hiberna?", o: ["Urso", "Esquilo", "Morcego", "Todos acima"], c: 3, v: 14 },
    { q: "Qual é o único mamífero que voa?", o: ["Morcego", "Pássaro", "Inseto", "Esquilo Voador"], c: 0, v: 15 },
    { q: "Qual animal tem a língua mais longa relativa ao corpo?", o: ["Camaleão", "Girafa", "Tamanduá", "Cobra"], c: 0, v: 16 },
    { q: "Qual é o animal símbolo da Austrália?", o: ["Canguru", "Coala", "Emu", "Todos acima"], c: 3, v: 13 },
    { q: "Qual animal muda de cor?", o: ["Camaleão", "Polvo", "Lula", "Todos acima"], c: 3, v: 14 },
    { q: "Qual é o maior primata?", o: ["Gorila", "Chimpanzé", "Orangotango", "Humano"], c: 0, v: 12 },
    { q: "Qual animal é conhecido por sua memória?", o: ["Elefante", "Golfinho", "Corvo", "Todos acima"], c: 3, v: 15 },
    { q: "Qual é o animal que constrói barragens?", o: ["Castor", "Lontra", "Rato", "Esquilo"], c: 0, v: 13 },
    { q: "Qual animal tem presas de marfim?", o: ["Elefante", "Rinoceronte", "Hipopótamo", "Javali"], c: 0, v: 14 },
    { q: "Qual é o animal mais venenoso?", o: ["Cobra", "Água-viva caixa", "Aranha", "Escorpião"], c: 1, v: 15 },
    { q: "Qual animal vive mais tempo?", o: ["Tartaruga", "Baleia", "Elefante", "Papagaio"], c: 0, v: 14 },
    { q: "Qual é o animal símbolo da paz?", o: ["Pombo", "Cisne", "Águia", "Coruja"], c: 0, v: 12 },
    { q: "Qual animal é cego?", o: ["Morcego", "Toupeira", "Peixe das cavernas", "Todos acima"], c: 3, v: 15 },
    { q: "Qual é o menor mamífero?", o: ["Musaranho", "Morcego", "Rato", "Hamster"], c: 0, v: 13 },
    { q: "Qual animal tem bolsa?", o: ["Canguru", "Coala", "Wombat", "Todos acima"], c: 3, v: 14 },
    { q: "Qual é o animal que regenera membros?", o: ["Estrela do mar", "Lagarto", "Salamandra", "Todos acima"], c: 3, v: 15 },
    { q: "Qual animal é o rei da selva?", o: ["Leão", "Tigre", "Elefante", "Gorila"], c: 0, v: 12 },
    { q: "Qual é o animal com o pescoço mais longo?", o: ["Girafa", "Cisne", "Cobra", "Elefante"], c: 0, v: 13 },
    { q: "Qual animal voa mais alto?", o: ["Águia", "Abutre", "Ganso", "Pardal"], c: 1, v: 14 },
    { q: "Qual é o animal mais inteligente depois do humano?", o: ["Chimpanzé", "Golfinho", "Elefante", "Corvo"], c: 1, v: 15 },
    { q: "Qual animal tem chifres ramificados?", o: ["Veado", "Rinoceronte", "Búfalo", "Cabra"], c: 0, v: 13 },
    { q: "Qual é o animal que põe ovos maior?", o: ["Avestruz", "Pinguim", "Galinha", "Pato"], c: 0, v: 14 },
    { q: "Qual animal é hermafrodita?", o: ["Minhoca", "Caracol", "Estrela do mar", "Todos acima"], c: 3, v: 15 },
    { q: "Qual é o animal com a mordida mais forte?", o: ["Crocodilo", "Tubarão", "Leão", "Hipopótamo"], c: 0, v: 14 },
    { q: "Qual animal migra mais longe?", o: ["Andorinha do Ártico", "Baleia", "Salmão", "Borboleta Monarca"], c: 0, v: 15 },
    { q: "Qual é o animal mais preguiçoso?", o: ["Preguiça", "Coala", "Panda", "Gato"], c: 0, v: 13 },
    { q: "Qual animal tem três corações?", o: ["Polvo", "Lula", "Sépia", "Todos acima"], c: 3, v: 14 },
    { q: "Qual é o animal que não bebe água?", o: ["Canguru do deserto", "Camelo", "Girafa", "Elefante"], c: 0, v: 15 },
    { q: "Qual animal é imune a veneno?", o: ["Mangusto", "Porco-espinho", "Águia", "Todos acima"], c: 0, v: 14 },
    { q: "Qual é o maior réptil?", o: ["Crocodilo de água salgada", "Anaconda", "Pitão", "Dragão de Komodo"], c: 0, v: 15 },
    { q: "Qual animal tem a visão mais aguçada?", o: ["Águia", "Falcão", "Coruja", "Gato"], c: 1, v: 14 },
    { q: "Qual é o animal que vive em grupo chamado alcateia?", o: ["Lobo", "Leão", "Hiena", "Cachorro selvagem"], c: 0, v: 13 }
  ],
  food: [
    { q: "Qual é a fruta mais consumida no mundo?", o: ["Maçã", "Banana", "Laranja", "Uva"], c: 1, v: 12 },
    { q: "De onde vem o sushi?", o: ["China", "Japão", "Coreia", "Tailândia"], c: 1, v: 13 },
    { q: "Qual é o ingrediente principal da guacamole?", o: ["Abacate", "Tomate", "Cebola", "Pimenta"], c: 0, v: 14 },
    { q: "Qual país inventou a pizza?", o: ["Itália", "EUA", "França", "Grécia"], c: 0, v: 12 },
    { q: "Qual é a bebida alcoólica feita de uvas?", o: ["Cerveja", "Vinho", "Vodka", "Whisky"], c: 1, v: 13 },
    { q: "Qual é o queijo mais famoso da França?", o: ["Cheddar", "Brie", "Gouda", "Parmesão"], c: 1, v: 14 },
    { q: "De que é feito o tofu?", o: ["Leite de soja", "Leite de vaca", "Arroz", "Trigo"], c: 0, v: 12 },
    { q: "Qual é a sopa tradicional russa?", o: ["Borscht", "Gazpacho", "Minestrone", "Pho"], c: 0, v: 15 },
    { q: "Qual fruta é conhecida como 'fruta do dragão'?", o: ["Pitaya", "Kiwi", "Maracujá", "Durian"], c: 0, v: 14 },
    { q: "Qual é o prato nacional do Brasil?", o: ["Feijoada", "Churrasco", "Acarajé", "Moqueca"], c: 0, v: 13 },
    { q: "De onde vem o curry?", o: ["Índia", "Tailândia", "Japão", "China"], c: 0, v: 12 },
    { q: "Qual é o ingrediente principal do hummus?", o: ["Grão-de-bico", "Lentilha", "Feijão", "Ervilha"], c: 0, v: 14 },
    { q: "Qual país produz mais café?", o: ["Colômbia", "Brasil", "Vietnã", "Etiópia"], c: 1, v: 15 },
    { q: "Qual é a fruta com mais vitamina C?", o: ["Laranja", "Kiwi", "Morango", "Acerola"], c: 3, v: 14 },
    { q: "De que é feito o saquê?", o: ["Arroz", "Uva", "Cevada", "Batata"], c: 0, v: 12 },
    { q: "Qual é o doce típico português?", o: ["Pastel de nata", "Brigadeiro", "Churro", "Macaron"], c: 0, v: 13 },
    { q: "Qual país inventou o hambúrguer?", o: ["EUA", "Alemanha", "Inglaterra", "França"], c: 1, v: 14 },
    { q: "Qual é o ingrediente principal da paella?", o: ["Arroz", "Macarrão", "Batata", "Pão"], c: 0, v: 12 },
    { q: "Qual fruta é usada no molho pesto?", o: ["Manjericão", "Tomate", "Abacate", "Pimenta"], c: 0, v: 13 },
    { q: "De onde vem o taco?", o: ["México", "Espanha", "Argentina", "Brasil"], c: 0, v: 12 },
    { q: "Qual é o queijo suíço famoso?", o: ["Emmental", "Gorgonzola", "Feta", "Mozzarella"], c: 0, v: 14 },
    { q: "Qual bebida é feita de cevada?", o: ["Cerveja", "Vinho", "Suco", "Chá"], c: 0, v: 12 },
    { q: "Qual é o prato japonês com peixe cru?", o: ["Sashimi", "Tempura", "Yakitori", "Udon"], c: 0, v: 13 },
    { q: "Qual país é famoso pelo chocolate?", o: ["Suíça", "Bélgica", "França", "Todos acima"], c: 3, v: 14 },
    { q: "Qual é a fruta símbolo do Havaí?", o: ["Abacaxi", "Coco", "Manga", "Papaya"], c: 0, v: 12 },
    { q: "De que é feito o falafel?", o: ["Grão-de-bico", "Carne", "Peixe", "Queijo"], c: 0, v: 13 },
    { q: "Qual é o vinho espumante francês?", o: ["Champagne", "Prosecco", "Cava", "Lambrusco"], c: 0, v: 14 },
    { q: "Qual país inventou o croissant?", o: ["França", "Áustria", "Itália", "Alemanha"], c: 1, v: 15 },
    { q: "Qual é o ingrediente principal do kimchi?", o: ["Repolho", "Cenoura", "Pepino", "Rabanete"], c: 0, v: 13 },
    { q: "Qual fruta é usada na caipirinha?", o: ["Limão", "Laranja", "Abacaxi", "Morango"], c: 0, v: 12 },
    { q: "De onde vem o pho?", o: ["Vietnã", "Tailândia", "China", "Japão"], c: 0, v: 13 },
    { q: "Qual é o queijo italiano ralado?", o: ["Parmesão", "Pecorino", "Ricotta", "Mascarpone"], c: 0, v: 14 },
    { q: "Qual bebida é associada ao México?", o: ["Tequila", "Rum", "Gin", "Vodka"], c: 0, v: 12 },
    { q: "Qual é o prato indiano com pão?", o: ["Naan", "Roti", "Chapati", "Todos acima"], c: 3, v: 13 },
    { q: "Qual país produz mais chá?", o: ["Índia", "China", "Sri Lanka", "Quênia"], c: 1, v: 14 }
  ],
  mythology: [
    { q: "Quem é o rei dos deuses gregos?", o: ["Poseidon", "Zeus", "Hades", "Apolo"], c: 1, v: 12 },
    { q: "Qual é o deus do mar na mitologia grega?", o: ["Poseidon", "Ares", "Hermes", "Dionísio"], c: 0, v: 13 },
    { q: "Quem é a deusa do amor?", o: ["Afrodite", "Atena", "Artemis", "Hera"], c: 0, v: 14 },
    { q: "Qual herói matou a Medusa?", o: ["Héracles", "Perseu", "Teseu", "Jasão"], c: 1, v: 15 },
    { q: "Quem é o deus do submundo?", o: ["Hades", "Plutão", "Thanatos", "Todos acima"], c: 0, v: 13 },
    { q: "Qual é o cavalo alado?", o: ["Pégaso", "Unicórnio", "Centauro", "Grifo"], c: 0, v: 14 },
    { q: "Quem roubou o fogo dos deuses?", o: ["Prometeu", "Ícaro", "Dédalo", "Orfeu"], c: 0, v: 15 },
    { q: "Qual deusa é associada à sabedoria?", o: ["Atena", "Afrodite", "Deméter", "Perséfone"], c: 0, v: 13 },
    { q: "Quem é o deus da guerra?", o: ["Ares", "Apolo", "Hermes", " Hefesto"], c: 0, v: 14 },
    { q: "Qual monstro tem corpo de leão e cabeça de águia?", o: ["Grifo", "Esfinge", "Minotauro", "Quimera"], c: 0, v: 15 },
    { q: "Quem é a rainha dos deuses?", o: ["Hera", "Afrodite", "Atena", "Artemis"], c: 0, v: 13 },
    { q: "Qual herói realizou 12 trabalhos?", o: ["Héracles", "Perseu", "Teseu", "Aquiles"], c: 0, v: 14 },
    { q: "Quem é o deus do vinho?", o: ["Dionísio", "Apolo", "Hermes", "Ares"], c: 0, v: 13 },
    { q: "Qual é a deusa da caça?", o: ["Artemis", "Atena", "Afrodite", "Deméter"], c: 0, v: 14 },
    { q: "Quem construiu o labirinto?", o: ["Dédalo", "Ícaro", "Minos", "Teseu"], c: 0, v: 15 },
    { q: "Qual monstro tem uma cabeça de touro?", o: ["Minotauro", "Centauro", "Sátiro", "Cíclope"], c: 0, v: 13 },
    { q: "Quem é o mensageiro dos deuses?", o: ["Hermes", "Apolo", "Ares", " Hefesto"], c: 0, v: 14 },
    { q: "Qual deusa saiu da cabeça de Zeus?", o: ["Atena", "Afrodite", "Hera", "Artemis"], c: 0, v: 13 },
    { q: "Quem é o deus do fogo e forja?", o: ["Hefesto", "Vulcano", "Ares", "Apolo"], c: 0, v: 14 },
    { q: "Qual é o rio do submundo?", o: ["Estige", "Aqueronte", "Lete", "Todos acima"], c: 3, v: 15 },
    { q: "Quem é a deusa da agricultura?", o: ["Deméter", "Perséfone", "Héstia", "Rhea"], c: 0, v: 13 },
    { q: "Qual herói lutou na Guerra de Troia?", o: ["Aquiles", "Heitor", "Odisseu", "Todos acima"], c: 3, v: 14 },
    { q: "Quem é o deus do sol?", o: ["Apolo", "Hélio", "Ra", "Sol Invictus"], c: 0, v: 13 },
    { q: "Qual monstro tem serpentes no cabelo?", o: ["Medusa", "Esfinge", "Quimera", "Hidra"], c: 0, v: 14 },
    { q: "Quem navegou por 10 anos após Troia?", o: ["Odisseu", "Eneias", "Jasão", "Perseu"], c: 0, v: 15 },
    { q: "Qual é a deusa do lar?", o: ["Héstia", "Deméter", "Hera", "Afrodite"], c: 0, v: 13 },
    { q: "Quem matou o Minotauro?", o: ["Teseu", "Héracles", "Perseu", "Jasão"], c: 0, v: 14 },
    { q: "Qual é o cão de três cabeças?", o: ["Cérbero", "Ortro", "Quimera", "Hidra"], c: 0, v: 13 },
    { q: "Quem é o pai de Zeus?", o: ["Cronos", "Urano", "Gaia", "Reia"], c: 0, v: 14 },
    { q: "Qual herói buscou o Velocino de Ouro?", o: ["Jasão", "Perseu", "Teseu", "Héracles"], c: 0, v: 15 },
    { q: "Quem é a deusa da discórdia?", o: ["Éris", "Nêmesis", "Ate", "Hécate"], c: 0, v: 13 },
    { q: "Qual monstro é metade leão, metade cabra, metade serpente?", o: ["Quimera", "Esfinge", "Grifo", "Minotauro"], c: 0, v: 14 },
    { q: "Quem é o deus do sono?", o: ["Hipnos", "Morpheus", "Thanatos", "Todos acima"], c: 3, v: 15 },
    { q: "Qual é a montanha dos deuses?", o: ["Olimpo", "Parnaso", "Helicon", "Ida"], c: 0, v: 13 },
    { q: "Quem raptou Perséfone?", o: ["Hades", "Zeus", "Poseidon", "Apolo"], c: 0, v: 14 }
  ],
  inventions: [
    { q: "Quem inventou a lâmpada?", o: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Guglielmo Marconi"], c: 0, v: 15 },
    { q: "Qual invenção é atribuída a Gutenberg?", o: ["Imprensa", "Telefone", "Rádio", "Televisão"], c: 0, v: 14 },
    { q: "Quem inventou o telefone?", o: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Samuel Morse"], c: 0, v: 13 },
    { q: "Qual é a invenção de Wright Brothers?", o: ["Avião", "Automóvel", "Bicicleta", "Trem"], c: 0, v: 14 },
    { q: "Quem criou a World Wide Web?", o: ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Vint Cerf"], c: 0, v: 15 },
    { q: "Qual invenção é de Alfred Nobel?", o: ["Dinamite", "Pólvora", "Bomba atômica", "Foguete"], c: 0, v: 14 },
    { q: "Quem inventou a penicilina?", o: ["Alexander Fleming", "Louis Pasteur", "Joseph Lister", "Robert Koch"], c: 0, v: 15 },
    { q: "Qual é a invenção de James Watt?", o: ["Máquina a vapor", "Eletricidade", "Rádio", "Computador"], c: 0, v: 14 },
    { q: "Quem inventou o rádio?", o: ["Guglielmo Marconi", "Nikola Tesla", "Thomas Edison", "Alexander Popov"], c: 0, v: 15 },
    { q: "Qual invenção é de Karl Benz?", o: ["Automóvel", "Motocicleta", "Bicicleta", "Ônibus"], c: 0, v: 14 },
    { q: "Quem criou o Facebook?", o: ["Mark Zuckerberg", "Larry Page", "Sergey Brin", "Jack Dorsey"], c: 0, v: 13 },
    { q: "Qual é a invenção de Louis Braille?", o: ["Braille", "Óculos", "Aparelho auditivo", "Cadeira de rodas"], c: 0, v: 14 },
    { q: "Quem inventou a vacina contra pólio?", o: ["Jonas Salk", "Albert Sabin", "Louis Pasteur", "Edward Jenner"], c: 0, v: 15 },
    { q: "Qual invenção é de Wilhelm Röntgen?", o: ["Raio-X", "MRI", "Ultrassom", "Tomografia"], c: 0, v: 14 },
    { q: "Quem inventou o microscópio?", o: ["Antonie van Leeuwenhoek", "Galileu Galilei", "Robert Hooke", "Zacharias Janssen"], c: 3, v: 15 },
    { q: "Qual é a invenção de Steve Jobs?", o: ["iPhone", "Windows", "Android", "Linux"], c: 0, v: 13 },
    { q: "Quem criou o telescópio refrator?", o: ["Galileu Galilei", "Isaac Newton", "Johannes Kepler", "Hans Lippershey"], c: 3, v: 14 },
    { q: "Qual invenção é de Samuel Morse?", o: ["Telégrafo", "Telefone", "Rádio", "Internet"], c: 0, v: 13 },
    { q: "Quem inventou a eletricidade?", o: ["Benjamin Franklin", "Thomas Edison", "Nikola Tesla", "Michael Faraday"], c: 0, v: 14 },
    { q: "Qual é a invenção de John Logie Baird?", o: ["Televisão", "Rádio", "Computador", "Internet"], c: 0, v: 15 },
    { q: "Quem criou o PC?", o: ["IBM", "Apple", "Microsoft", "Dell"], c: 0, v: 13 },
    { q: "Qual invenção é de Alexander Graham Bell?", o: ["Telefone", "Gramofone", "Rádio", "Televisão"], c: 0, v: 14 },
    { q: "Quem inventou o ar condicionado?", o: ["Willis Carrier", "Nikola Tesla", "Thomas Edison", "Henry Ford"], c: 0, v: 15 },
    { q: "Qual é a invenção de Tim Berners-Lee?", o: ["World Wide Web", "Email", "Smartphone", "GPS"], c: 0, v: 14 },
    { q: "Quem criou a bomba atômica?", o: ["J. Robert Oppenheimer", "Albert Einstein", "Enrico Fermi", "Niels Bohr"], c: 0, v: 15 },
    { q: "Qual invenção é de Elisha Otis?", o: ["Elevador", "Escada rolante", "Avião", "Submarino"], c: 0, v: 14 },
    { q: "Quem inventou o zíper?", o: ["Whitcomb Judson", "Elias Howe", "Isaac Singer", "Thomas Saint"], c: 0, v: 15 },
    { q: "Qual é a invenção de Charles Babbage?", o: ["Computador analítico", "Calculadora", "Relógio", "Bússola"], c: 0, v: 14 },
    { q: "Quem criou o GPS?", o: ["Departamento de Defesa dos EUA", "NASA", "ESA", "Roscosmos"], c: 0, v: 15 },
    { q: "Qual invenção é de Marie Curie?", o: ["Radioatividade", "Penicilina", "Vacina", "Aspirina"], c: 0, v: 14 },
    { q: "Quem inventou a internet?", o: ["Vint Cerf e Bob Kahn", "Tim Berners-Lee", "Alan Turing", "John von Neumann"], c: 0, v: 15 },
    { q: "Qual é a invenção de Henry Ford?", o: ["Linha de montagem", "Automóvel", "Avião", "Trem"], c: 0, v: 14 },
    { q: "Quem criou o transistor?", o: ["Bell Labs", "IBM", "Intel", "AMD"], c: 0, v: 15 },
    { q: "Qual invenção é de Leonardo da Vinci?", o: ["Paraquedas", "Helicóptero", "Tanque", "Todos acima"], c: 3, v: 14 },
    { q: "Quem inventou a pólvora?", o: ["Chineses", "Árabes", "Europeus", "Indianos"], c: 0, v: 13 }
  ],
  famous_people: [
    { q: "Quem pintou a Mona Lisa?", o: ["Leonardo da Vinci", "Michelangelo", "Rafael", "Donatello"], c: 0, v: 15 },
    { q: "Quem foi o primeiro homem na Lua?", o: ["Neil Armstrong", "Buzz Aldrin", "Michael Collins", "Yuri Gagarin"], c: 0, v: 14 },
    { q: "Quem escreveu a teoria da relatividade?", o: ["Albert Einstein", "Isaac Newton", "Galileu Galilei", "Stephen Hawking"], c: 0, v: 16 },
    { q: "Quem foi a rainha do Egito?", o: ["Cleópatra", "Nefertiti", "Hatshepsut", "Tutancâmon"], c: 0, v: 13 },
    { q: "Quem descobriu a América?", o: ["Cristóvão Colombo", "Amerigo Vespucci", "Leif Erikson", "Vasco da Gama"], c: 0, v: 14 },
    { q: "Quem foi o líder dos direitos civis nos EUA?", o: ["Martin Luther King Jr.", "Malcolm X", "Rosa Parks", "Harriet Tubman"], c: 0, v: 15 },
    { q: "Quem inventou a Apple?", o: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"], c: 0, v: 13 },
    { q: "Quem foi o imperador francês?", o: ["Napoleão Bonaparte", "Luís XIV", "Carlos Magno", "Joana d'Arc"], c: 0, v: 14 },
    { q: "Quem escreveu 'Romeu e Julieta'?", o: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"], c: 0, v: 15 },
    { q: "Quem foi a primeira mulher no espaço?", o: ["Valentina Tereshkova", "Sally Ride", "Mae Jemison", "Christa McAuliffe"], c: 0, v: 16 },
    { q: "Quem fundou a Microsoft?", o: ["Bill Gates", "Paul Allen", "Steve Ballmer", "Todos acima"], c: 3, v: 14 },
    { q: "Quem foi o faraó mais famoso?", o: ["Tutancâmon", "Ramsés II", "Cleópatra", "Akhenaton"], c: 1, v: 15 },
    { q: "Quem pintou 'A Noite Estrelada'?", o: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet", "Salvador Dalí"], c: 0, v: 14 },
    { q: "Quem foi o primeiro presidente do Brasil?", o: ["Deodoro da Fonseca", "Getúlio Vargas", "Juscelino Kubitschek", "Tancredo Neves"], c: 0, v: 15 },
    { q: "Quem descobriu a penicilina?", o: ["Alexander Fleming", "Louis Pasteur", "Marie Curie", "Albert Einstein"], c: 0, v: 14 },
    { q: "Quem foi a rainha da Inglaterra por mais tempo?", o: ["Elizabeth II", "Victoria", "Elizabeth I", "Mary I"], c: 1, v: 15 },
    { q: "Quem escreveu 'O Capital'?", o: ["Karl Marx", "Friedrich Engels", "Vladimir Lenin", "Joseph Stalin"], c: 0, v: 14 },
    { q: "Quem foi o líder da independência indiana?", o: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Bhagat Singh"], c: 0, v: 15 },
    { q: "Quem inventou o avião?", o: ["Irmãos Wright", "Santos Dumont", "Leonardo da Vinci", "Gustave Eiffel"], c: 0, v: 14 },
    { q: "Quem foi o compositor surdo?", o: ["Beethoven", "Mozart", "Bach", "Chopin"], c: 0, v: 13 },
    { q: "Quem fundou o Facebook?", o: ["Mark Zuckerberg", "Eduardo Saverin", "Dustin Moskovitz", "Todos acima"], c: 3, v: 15 },
    { q: "Quem foi o rei da Macedônia?", o: ["Alexandre o Grande", "Filipe II", "Péricles", "Leônidas"], c: 0, v: 14 },
    { q: "Quem pintou o teto da Capela Sistina?", o: ["Michelangelo", "Leonardo da Vinci", "Rafael", "Botticelli"], c: 0, v: 15 },
    { q: "Quem foi o primeiro imperador romano?", o: ["Augusto", "Júlio César", "Nero", "Calígula"], c: 0, v: 14 },
    { q: "Quem escreveu 'A Origem das Espécies'?", o: ["Charles Darwin", "Alfred Russel Wallace", "Gregor Mendel", "Jean-Baptiste Lamarck"], c: 0, v: 15 },
    { q: "Quem foi a enfermeira na Guerra da Crimeia?", o: ["Florence Nightingale", "Clara Barton", "Mary Seacole", "Edith Cavell"], c: 0, v: 14 },
    { q: "Quem fundou a Tesla?", o: ["Elon Musk", "Martin Eberhard", "Marc Tarpenning", "Todos acima"], c: 3, v: 15 },
    { q: "Quem foi o líder sul-africano anti-apartheid?", o: ["Nelson Mandela", "Desmond Tutu", "Steve Biko", "Thabo Mbeki"], c: 0, v: 14 },
    { q: "Quem inventou a teoria quântica?", o: ["Max Planck", "Albert Einstein", "Niels Bohr", "Werner Heisenberg"], c: 0, v: 15 },
    { q: "Quem foi a primeira ministra britânica?", o: ["Margaret Thatcher", "Theresa May", "Liz Truss", "Angela Merkel"], c: 0, v: 14 },
    { q: "Quem escreveu 'Dom Casmurro'?", o: ["Machado de Assis", "José de Alencar", "Aluísio Azevedo", "Euclides da Cunha"], c: 0, v: 15 },
    { q: "Quem foi o explorador português?", o: ["Vasco da Gama", "Pedro Álvares Cabral", "Fernão de Magalhães", "Todos acima"], c: 3, v: 14 },
    { q: "Quem pintou 'Guernica'?", o: ["Pablo Picasso", "Salvador Dalí", "Joan Miró", "Francisco Goya"], c: 0, v: 15 },
    { q: "Quem foi o presidente durante a Guerra Civil Americana?", o: ["Abraham Lincoln", "Andrew Johnson", "Ulysses S. Grant", "Jefferson Davis"], c: 0, v: 14 },
    { q: "Quem descobriu o Brasil?", o: ["Pedro Álvares Cabral", "Cristóvão Colombo", "Vasco da Gama", "Bartolomeu Dias"], c: 0, v: 15 }
  ],
  languages: [
    { q: "Qual é a língua mais falada no mundo?", o: ["Inglês", "Mandarim", "Espanhol", "Hindi"], c: 1, v: 12 },
    { q: "De onde vem o latim?", o: ["Itália", "Grécia", "Egito", "Mesopotâmia"], c: 0, v: 13 },
    { q: "Quantas letras tem o alfabeto inglês?", o: ["26", "24", "28", "30"], c: 0, v: 10 },
    { q: "Qual é a língua oficial do Brasil?", o: ["Português", "Espanhol", "Inglês", "Francês"], c: 0, v: 12 },
    { q: "Qual língua usa o alfabeto cirílico?", o: ["Russo", "Grego", "Árabe", "Chinês"], c: 0, v: 13 },
    { q: "Qual é a língua mais antiga ainda em uso?", o: ["Hebraico", "Grego", "Latim", "Sânscrito"], c: 3, v: 14 },
    { q: "Quantos tons tem o mandarim?", o: ["4", "5", "3", "6"], c: 0, v: 13 },
    { q: "Qual língua é falada na França?", o: ["Francês", "Alemão", "Italiano", "Espanhol"], c: 0, v: 12 },
    { q: "Qual é o idioma oficial da ONU?", o: ["Inglês", "Francês", "Espanhol", "Todos acima"], c: 3, v: 14 },
    { q: "Qual língua usa kanji?", o: ["Japonês", "Chinês", "Coreano", "Todos acima"], c: 3, v: 15 },
    { q: "Qual é a língua germânica?", o: ["Alemão", "Inglês", "Holandês", "Todos acima"], c: 3, v: 13 },
    { q: "Qual língua é falada na Índia?", o: ["Hindi", "Inglês", "Tâmil", "Todos acima"], c: 3, v: 14 },
    { q: "Quantas vogais tem o português?", o: ["5", "7", "6", "8"], c: 1, v: 12 },
    { q: "Qual é a língua românica?", o: ["Português", "Espanhol", "Italiano", "Todos acima"], c: 3, v: 13 },
    { q: "Qual língua usa o alfabeto árabe?", o: ["Árabe", "Persa", "Urdu", "Todos acima"], c: 3, v: 14 },
    { q: "Qual é a língua eslava?", o: ["Russo", "Polonês", "Checo", "Todos acima"], c: 3, v: 13 },
    { q: "Qual língua tem mais palavras?", o: ["Inglês", "Alemão", "Francês", "Espanhol"], c: 0, v: 14 },
    { q: "Qual é a língua oficial da China?", o: ["Mandarim", "Cantonês", "Wu", "Min"], c: 0, v: 12 },
    { q: "Quantas letras tem o alfabeto grego?", o: ["24", "26", "22", "28"], c: 0, v: 13 },
    { q: "Qual língua é falada no Japão?", o: ["Japonês", "Chinês", "Coreano", "Tailandês"], c: 0, v: 12 },
    { q: "Qual é a língua celta?", o: ["Irlandês", "Galês", "Escocês", "Todos acima"], c: 3, v: 14 },
    { q: "Qual língua usa hangul?", o: ["Coreano", "Japonês", "Chinês", "Vietnamita"], c: 0, v: 13 },
    { q: "Qual é a língua semita?", o: ["Árabe", "Hebraico", "Amárico", "Todos acima"], c: 3, v: 14 },
    { q: "Qual língua tem acentos como ç?", o: ["Português", "Francês", "Turco", "Todos acima"], c: 3, v: 13 },
    { q: "Qual é a língua oficial da Rússia?", o: ["Russo", "Ucraniano", "Bielorrusso", "Cazaque"], c: 0, v: 12 },
    { q: "Quantas consoantes tem o inglês?", o: ["21", "20", "22", "19"], c: 0, v: 13 },
    { q: "Qual língua é falada na Espanha?", o: ["Espanhol", "Catalão", "Basco", "Todos acima"], c: 3, v: 14 },
    { q: "Qual é a língua indo-ariana?", o: ["Hindi", "Bengali", "Punjabi", "Todos acima"], c: 3, v: 13 },
    { q: "Qual língua usa devanagari?", o: ["Hindi", "Sânscrito", "Nepali", "Todos acima"], c: 3, v: 14 },
    { q: "Qual é a língua oficial do Canadá?", o: ["Inglês", "Francês", "Ambos", "Espanhol"], c: 2, v: 13 },
    { q: "Quantas letras tem o alfabeto russo?", o: ["33", "32", "34", "30"], c: 0, v: 12 },
    { q: "Qual língua é falada na Alemanha?", o: ["Alemão", "Holandês", "Dinamarquês", "Sueco"], c: 0, v: 13 },
    { q: "Qual é a língua dravídica?", o: ["Tâmil", "Telugu", "Kannada", "Todos acima"], c: 3, v: 14 },
    { q: "Qual língua tem mais falantes nativos?", o: ["Mandarim", "Espanhol", "Inglês", "Hindi"], c: 0, v: 13 },
    { q: "Qual é a língua oficial da ONU além do inglês?", o: ["Francês", "Espanhol", "Árabe", "Todos acima"], c: 3, v: 14 }
  ],
  astronomy: [
    { q: "Qual é o planeta mais quente?", o: ["Mercúrio", "Vênus", "Marte", "Júpiter"], c: 1, v: 14 },
    { q: "Quantos planetas tem o sistema solar?", o: ["8", "9", "7", "10"], c: 0, v: 12 },
    { q: "Qual é a estrela mais próxima da Terra?", o: ["Sol", "Proxima Centauri", "Sirius", "Alpha Centauri"], c: 0, v: 13 },
    { q: "Qual é o maior planeta?", o: ["Júpiter", "Saturno", "Urano", "Netuno"], c: 0, v: 14 },
    { q: "Qual planeta tem anéis?", o: ["Saturno", "Júpiter", "Urano", "Todos acima"], c: 3, v: 15 },
    { q: "Qual é a galáxia da Terra?", o: ["Via Láctea", "Andrômeda", "Triângulo", "Sombrero"], c: 0, v: 13 },
    { q: "Quantas luas tem Marte?", o: ["2", "1", "0", "4"], c: 0, v: 12 },
    { q: "Qual é o planeta vermelho?", o: ["Marte", "Vênus", "Mercúrio", "Plutão"], c: 0, v: 13 },
    { q: "Qual é o buraco negro no centro da galáxia?", o: ["Sagittarius A*", "Cygnus X-1", "V4641 Sgr", "GRO J1655-40"], c: 0, v: 16 },
    { q: "Qual é a constelação do caçador?", o: ["Órion", "Ursa Maior", "Cão Maior", "Escorpião"], c: 0, v: 14 },
    { q: "Quantos signos do zodíaco?", o: ["12", "10", "13", "11"], c: 0, v: 12 },
    { q: "Qual é o planeta com mais luas?", o: ["Júpiter", "Saturno", "Urano", "Netuno"], c: 1, v: 15 },
    { q: "Qual é a estrela mais brilhante no céu noturno?", o: ["Sirius", "Canopus", "Arcturus", "Vega"], c: 0, v: 14 },
    { q: "Qual é o cometa famoso?", o: ["Halley", "Hale-Bopp", "Hyakutake", "Shoemaker-Levy"], c: 0, v: 13 },
    { q: "Qual planeta é conhecido como estrela da manhã?", o: ["Vênus", "Mercúrio", "Marte", "Júpiter"], c: 0, v: 14 },
    { q: "Quantas estrelas na Ursa Maior?", o: ["7", "5", "9", "6"], c: 0, v: 12 },
    { q: "Qual é o telescópio espacial?", o: ["Hubble", "James Webb", "Spitzer", "Todos acima"], c: 3, v: 15 },
    { q: "Qual é o planeta anão?", o: ["Plutão", "Ceres", "Eris", "Todos acima"], c: 3, v: 14 },
    { q: "Qual é a fase da lua cheia?", o: ["Cheia", "Nova", "Crescente", "Minguante"], c: 0, v: 12 },
    { q: "Qual é o sol uma?", o: ["Estrela", "Planeta", "Galáxia", "Cometa"], c: 0, v: 13 },
    { q: "Quantos dias para a Lua orbitar a Terra?", o: ["27", "30", "365", "7"], c: 0, v: 14 },
    { q: "Qual é o cinturão de asteroides entre?", o: ["Marte e Júpiter", "Júpiter e Saturno", "Terra e Marte", "Urano e Netuno"], c: 0, v: 15 },
    { q: "Qual é a supernova famosa?", o: ["SN 1987A", "Crab Nebula", "Cassiopeia A", "Todos acima"], c: 3, v: 14 },
    { q: "Qual planeta tem o dia mais longo?", o: ["Vênus", "Mercúrio", "Terra", "Marte"], c: 0, v: 15 },
    { q: "Qual é a constelação do leão?", o: ["Leão", "Virgem", "Libra", "Escorpião"], c: 0, v: 12 },
    { q: "Quantas luas tem Júpiter?", o: ["Mais de 80", "4", "2", "1"], c: 0, v: 14 },
    { q: "Qual é o planeta mais distante do Sol?", o: ["Netuno", "Urano", "Plutão", "Saturno"], c: 0, v: 13 },
    { q: "Qual é a Via Láctea?", o: ["Galáxia espiral", "Galáxia elíptica", "Galáxia irregular", "Galáxia lenticular"], c: 0, v: 15 },
    { q: "Qual é o eclipse solar?", o: ["Lua cobre o Sol", "Terra cobre a Lua", "Sol cobre a Lua", "Lua cobre a Terra"], c: 0, v: 14 },
    { q: "Quantos planetas gasosos?", o: ["4", "2", "3", "5"], c: 0, v: 12 },
    { q: "Qual é a estrela polar?", o: ["Polaris", "Sirius", "Betelgeuse", "Rigel"], c: 0, v: 13 },
    { q: "Qual planeta tem vulcões?", o: ["Vênus", "Marte", "Io (lua)", "Todos acima"], c: 3, v: 15 },
    { q: "Qual é o Big Bang?", o: ["Origem do universo", "Explosão de estrela", "Buraco negro", "Galáxia colidindo"], c: 0, v: 14 },
    { q: "Quantas constelações oficiais?", o: ["88", "12", "50", "100"], c: 0, v: 13 },
    { q: "Qual é o planeta com vida conhecida?", o: ["Terra", "Marte", "Vênus", "Júpiter"], c: 0, v: 12 }
  ],
  art: [
    { q: "Quem pintou 'A Última Ceia'?", o: ["Leonardo da Vinci", "Michelangelo", "Rafael", "Titian"], c: 0, v: 15 },
    { q: "Qual é o estilo de Picasso?", o: ["Cubismo", "Impressionismo", "Surrealismo", "Abstracionismo"], c: 0, v: 14 },
    { q: "Quem esculpiu 'David'?", o: ["Michelangelo", "Donatello", "Bernini", "Rodin"], c: 0, v: 15 },
    { q: "Qual é a pintura mais famosa de Van Gogh?", o: ["A Noite Estrelada", "Girassóis", "Quarto em Arles", "Auto-retrato"], c: 0, v: 14 },
    { q: "Quem pintou 'A Persistência da Memória'?", o: ["Salvador Dalí", "René Magritte", "Max Ernst", "Joan Miró"], c: 0, v: 15 },
    { q: "Qual é o movimento de Monet?", o: ["Impressionismo", "Expressionismo", "Fauvismo", "Pointillismo"], c: 0, v: 14 },
    { q: "Quem desenhou a Torre Eiffel?", o: ["Gustave Eiffel", "Alexandre Gustave", "Stephen Sauvestre", "Maurice Koechlin"], c: 0, v: 15 },
    { q: "Qual é a escultura 'O Pensador' de?", o: ["Rodin", "Michelangelo", "Bernini", "Canova"], c: 0, v: 14 },
    { q: "Quem pintou 'Guernica'?", o: ["Pablo Picasso", "Francisco Goya", "Diego Velázquez", "El Greco"], c: 0, v: 15 },
    { q: "Qual é o estilo de Andy Warhol?", o: ["Pop Art", "Minimalismo", "Conceptualismo", "Op Art"], c: 0, v: 14 },
    { q: "Quem esculpiu 'Vênus de Milo'?", o: ["Desconhecido", "Praxiteles", "Fídias", "Policleto"], c: 0, v: 15 },
    { q: "Qual é a pintura 'A Criação de Adão'?", o: ["Michelangelo", "Leonardo da Vinci", "Rafael", "Botticelli"], c: 0, v: 14 },
    { q: "Quem pintou 'As Meninas'?", o: ["Diego Velázquez", "Francisco Goya", "El Greco", "Pablo Picasso"], c: 0, v: 15 },
    { q: "Qual é o movimento de Jackson Pollock?", o: ["Expressionismo Abstrato", "Surrealismo", "Dadaísmo", "Futurismo"], c: 0, v: 14 },
    { q: "Quem projetou a Ópera de Sydney?", o: ["Jørn Utzon", "Frank Gehry", "Zaha Hadid", "I. M. Pei"], c: 0, v: 15 },
    { q: "Qual é a escultura 'Pietà' de?", o: ["Michelangelo", "Bernini", "Donatello", "Cellini"], c: 0, v: 14 },
    { q: "Quem pintou 'O Grito'?", o: ["Edvard Munch", "Vincent van Gogh", "Paul Gauguin", "Henri Matisse"], c: 0, v: 15 },
    { q: "Qual é o estilo de Claude Monet?", o: ["Impressionismo", "Realismo", "Romantismo", "Barroco"], c: 0, v: 14 },
    { q: "Quem esculpiu 'O Beijo'?", o: ["Rodin", "Brancusi", "Moore", "Hepworth"], c: 0, v: 15 },
    { q: "Qual é a pintura 'Nascimento de Vênus'?", o: ["Botticelli", "Titian", "Rafael", "Leonardo da Vinci"], c: 0, v: 14 },
    { q: "Quem pintou 'Lírios'?", o: ["Claude Monet", "Vincent van Gogh", "Paul Cézanne", "Georges Seurat"], c: 0, v: 15 },
    { q: "Qual é o movimento de Salvador Dalí?", o: ["Surrealismo", "Cubismo", "Fauvismo", "Dadaismo"], c: 0, v: 14 },
    { q: "Quem projetou o Museu Guggenheim?", o: ["Frank Lloyd Wright", "Le Corbusier", "Mies van der Rohe", "Oscar Niemeyer"], c: 0, v: 15 },
    { q: "Qual é a escultura 'Vitória de Samotrácia'?", o: ["Grega", "Romana", "Egípcia", "Mesopotâmica"], c: 0, v: 14 },
    { q: "Quem pintou 'American Gothic'?", o: ["Grant Wood", "Edward Hopper", "Andrew Wyeth", "Norman Rockwell"], c: 0, v: 15 },
    { q: "Qual é o estilo de Rembrandt?", o: ["Barroco", "Renascença", "Rococó", "Neoclássico"], c: 0, v: 14 },
    { q: "Quem esculpiu 'Discóbolo'?", o: ["Míron", "Policleto", "Fídias", "Praxiteles"], c: 0, v: 15 },
    { q: "Qual é a pintura 'A Ronda Noturna'?", o: ["Rembrandt", "Vermeer", "Hals", "Rubens"], c: 0, v: 14 },
    { q: "Quem pintou 'Les Demoiselles d'Avignon'?", o: ["Pablo Picasso", "Henri Matisse", "Georges Braque", "Juan Gris"], c: 0, v: 15 },
    { q: "Qual é o movimento de Frida Kahlo?", o: ["Surrealismo", "Realismo", "Expressionismo", "Abstracionismo"], c: 0, v: 14 },
    { q: "Quem projetou a Sagrada Família?", o: ["Antoni Gaudí", "Santiago Calatrava", "Oscar Niemeyer", "Frank Gehry"], c: 0, v: 15 },
    { q: "Qual é a escultura 'Ecstasy of Saint Teresa'?", o: ["Bernini", "Michelangelo", "Donatello", "Cellini"], c: 0, v: 14 },
    { q: "Quem pintou 'Nighthawks'?", o: ["Edward Hopper", "Grant Wood", "Andrew Wyeth", "Georgia O'Keeffe"], c: 0, v: 15 },
    { q: "Qual é o estilo de Caravaggio?", o: ["Barroco", "Renascença", "Maneirismo", "Rococó"], c: 0, v: 14 },
    { q: "Quem esculpiu 'O Escravo'?", o: ["Michelangelo", "Rodin", "Bernini", "Canova"], c: 0, v: 15 }
  ],
  politics: [
    { q: "Quem é o atual presidente dos EUA em 2025?", o: ["Joe Biden", "Donald Trump", "Kamala Harris", "Mike Pence"], c: 1, v: 15 },
    { q: "Qual é o sistema político da China?", o: ["Comunismo", "Democracia", "Monarquia", "República"], c: 0, v: 14 },
    { q: "Quem foi o primeiro ministro britânico mulher?", o: ["Margaret Thatcher", "Theresa May", "Liz Truss", "Angela Merkel"], c: 0, v: 15 },
    { q: "Qual é a capital da União Europeia?", o: ["Bruxelas", "Estrasburgo", "Luxemburgo", "Todas acima"], c: 3, v: 14 },
    { q: "Quem é o secretário-geral da ONU?", o: ["António Guterres", "Ban Ki-moon", "Kofi Annan", "Boutros Boutros-Ghali"], c: 0, v: 15 },
    { q: "Qual país tem o parlamento mais antigo?", o: ["Islândia", "Inglaterra", "França", "EUA"], c: 0, v: 14 },
    { q: "Quem assinou a Declaração de Independência dos EUA?", o: ["Thomas Jefferson", "John Hancock", "Benjamin Franklin", "Todos acima"], c: 3, v: 15 },
    { q: "Qual é o regime da Coreia do Norte?", o: ["Ditadura", "Democracia", "Monarquia", "República"], c: 0, v: 14 },
    { q: "Quem foi o líder da URSS durante a WWII?", o: ["Joseph Stalin", "Vladimir Lenin", "Nikita Khrushchev", "Leonid Brezhnev"], c: 0, v: 15 },
    { q: "Qual é o partido de Angela Merkel?", o: ["CDU", "SPD", "Verdes", "AfD"], c: 0, v: 14 },
    { q: "Quem é o presidente da França?", o: ["Emmanuel Macron", "François Hollande", "Nicolas Sarkozy", "Jacques Chirac"], c: 0, v: 15 },
    { q: "Qual país tem monarquia constitucional?", o: ["Reino Unido", "Japão", "Espanha", "Todos acima"], c: 3, v: 14 },
    { q: "Quem fundou a União Europeia?", o: ["Tratado de Roma", "Tratado de Maastricht", "Tratado de Lisboa", "Todos acima"], c: 0, v: 15 },
    { q: "Qual é o sistema político do Brasil?", o: ["República Presidencialista", "Monarquia", "Ditadura", "Parlamentarismo"], c: 0, v: 14 },
    { q: "Quem foi o primeiro presidente negro dos EUA?", o: ["Barack Obama", "Joe Biden", "Donald Trump", "George W. Bush"], c: 0, v: 15 },
    { q: "Qual é o parlamento europeu em?", o: ["Estrasburgo", "Bruxelas", "Luxemburgo", "Haia"], c: 0, v: 14 },
    { q: "Quem é o chanceler alemão?", o: ["Olaf Scholz", "Angela Merkel", "Gerhard Schröder", "Helmut Kohl"], c: 0, v: 15 },
    { q: "Qual país saiu da UE?", o: ["Reino Unido", "Grécia", "Itália", "Espanha"], c: 0, v: 14 },
    { q: "Quem foi o líder chinês?", o: ["Mao Zedong", "Deng Xiaoping", "Xi Jinping", "Todos acima"], c: 3, v: 15 },
    { q: "Qual é o senado romano inspirou?", o: ["Senado dos EUA", "Senado francês", "Senado brasileiro", "Todos acima"], c: 3, v: 14 },
    { q: "Quem é o primeiro-ministro do Canadá?", o: ["Justin Trudeau", "Stephen Harper", "Jean Chrétien", "Brian Mulroney"], c: 0, v: 15 },
    { q: "Qual é o regime da Arábia Saudita?", o: ["Monarquia absoluta", "Democracia", "República", "Ditadura"], c: 0, v: 14 },
    { q: "Quem assinou a Magna Carta?", o: ["Rei João", "Rei Henrique", "Rei Ricardo", "Rei Eduardo"], c: 0, v: 15 },
    { q: "Qual país tem o maior número de partidos?", o: ["Índia", "Brasil", "EUA", "China"], c: 0, v: 14 },
    { q: "Quem foi o presidente durante a Crise dos Mísseis?", o: ["John F. Kennedy", "Dwight Eisenhower", "Lyndon Johnson", "Richard Nixon"], c: 0, v: 15 },
    { q: "Qual é o sistema político da Suíça?", o: ["Democracia direta", "Presidencialismo", "Parlamentarismo", "Monarquia"], c: 0, v: 14 },
    { q: "Quem é o líder da Coreia do Norte?", o: ["Kim Jong-un", "Kim Jong-il", "Kim Il-sung", "Todos acima na família"], c: 0, v: 15 },
    { q: "Qual país tem veto no Conselho de Segurança da ONU?", o: ["EUA", "Rússia", "China", "Todos acima"], c: 3, v: 14 },
    { q: "Quem foi a primeira presidente mulher do Brasil?", o: ["Dilma Rousseff", "Michelle Bachelet", "Cristina Kirchner", "Angela Merkel"], c: 0, v: 15 },
    { q: "Qual é o parlamento do Japão?", o: ["Dieta", "Duma", "Knesset", "Congresso"], c: 0, v: 14 },
    { q: "Quem ganhou o Nobel da Paz em 1994?", o: ["Yasser Arafat", "Yitzhak Rabin", "Shimon Peres", "Todos acima"], c: 3, v: 15 },
    { q: "Qual país é uma teocracia?", o: ["Irã", "Vaticano", "Arábia Saudita", "Todos acima"], c: 3, v: 14 },
    { q: "Quem foi o líder da Revolução Cubana?", o: ["Fidel Castro", "Che Guevara", "Raúl Castro", "Todos acima"], c: 3, v: 15 },
    { q: "Qual é o sistema político da Austrália?", o: ["Monarquia constitucional", "República", "Ditadura", "Anarquia"], c: 0, v: 14 },
    { q: "Quem é o presidente da Rússia?", o: ["Vladimir Putin", "Dmitry Medvedev", "Boris Yeltsin", "Mikhail Gorbachev"], c: 0, v: 15 }
  ]
};

/**
 * Abre a tela de jogos
 */
function showGamesScreen() {
  const user = getCurrentUser();
  if (!user) return;

  db.ref('users/' + user.username).once('value')
    .then(snapshot => {
      const data = snapshot.val() || {};
      gameBalance = data.gameBalance || 0;
      helpCount = data.helpCount || 0;
      gamesPlayed = data.gamesPlayed || 0;
      renderGamesScreen(user);
    });
}

/**
 * Renderiza a tela de jogos
 */
function renderGamesScreen(user) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Arena de Jogos 🎮</h2>
      </div>

      <!-- Saldo do Jogo -->
      <div class="card text-center">
        <p class="text-muted">Saldo nos Jogos</p>
        <p class="balance-display">${gameBalance.toFixed(2)} <span class="osd">OSD</span></p>
        <p class="text-muted">Ajudas disponíveis: ${helpCount}</p>
        ${gameBalance > 0 ? `
          <button onclick="generateRedemptionCode('${user.username}')" class="btn btn-primary mt-2">
            Gerar Código de Resgate
          </button>
        ` : '<p class="text-sm text-muted mt-2">Jogue para ganhar OSD</p>'}
      </div>

      <!-- Categorias -->
      <div class="card">
        <h3>Escolha uma Categoria</h3>
        <div class="grid grid-cols-2 gap-2 mt-3">
          <button onclick="startGame('${user.username}', 'capitals')" class="btn btn-secondary py-3">🌍 Capitais</button>
          <button onclick="startGame('${user.username}', 'math_hard')" class="btn btn-secondary py-3">🧮 Matemática Difícil</button>
          <button onclick="startGame('${user.username}', 'science')" class="btn btn-secondary py-3">🔬 Ciência</button>
          <button onclick="startGame('${user.username}', 'history')" class="btn btn-secondary py-3">📜 História</button>
          <button onclick="startGame('${user.username}', 'geography')" class="btn btn-secondary py-3">🗺️ Geografia</button>
          <button onclick="startGame('${user.username}', 'tech')" class="btn btn-secondary py-3">💻 Tecnologia</button>
          <button onclick="startGame('${user.username}', 'movies')" class="btn btn-secondary py-3">🎬 Filmes</button>
          <button onclick="startGame('${user.username}', 'riddles')" class="btn btn-secondary py-3">🧠 Adivinhas</button>
          <button onclick="startGame('${user.username}', 'sports')" class="btn btn-secondary py-3">⚽ Esportes</button>
          <button onclick="startGame('${user.username}', 'literature')" class="btn btn-secondary py-3">📖 Literatura</button>
          <button onclick="startGame('${user.username}', 'music')" class="btn btn-secondary py-3">🎵 Música</button>
          <button onclick="startGame('${user.username}', 'animals')" class="btn btn-secondary py-3">🐶 Animais</button>
          <button onclick="startGame('${user.username}', 'food')" class="btn btn-secondary py-3">🍔 Comida</button>
          <button onclick="startGame('${user.username}', 'mythology')" class="btn btn-secondary py-3">🏛️ Mitologia</button>
          <button onclick="startGame('${user.username}', 'inventions')" class="btn btn-secondary py-3">💡 Invenções</button>
          <button onclick="startGame('${user.username}', 'famous_people')" class="btn btn-secondary py-3">👤 Pessoas Famosas</button>
          <button onclick="startGame('${user.username}', 'languages')" class="btn btn-secondary py-3">🗣️ Idiomas</button>
          <button onclick="startGame('${user.username}', 'astronomy')" class="btn btn-secondary py-3">🌌 Astronomia</button>
          <button onclick="startGame('${user.username}', 'art')" class="btn btn-secondary py-3">🎨 Arte</button>
          <button onclick="startGame('${user.username}', 'politics')" class="btn btn-secondary py-3">🏛️ Política</button>
        </div>
      </div>

      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

/**
 * Inicia um jogo
 */
function startGame(username, type) {
  const questions = [...quizzes[type]].sort(() => Math.random() - 0.5).slice(0, 5);
  let totalEarned = 0;
  let current = 0;

  function showQuestion() {
    const q = questions[current];
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="card">
          <h3>Pergunta ${current + 1}/${questions.length}</h3>
          <p class="my-4 font-medium">${q.q}</p>
          <div class="space-y-2">
            ${q.o.map((opt, i) => `
              <button onclick="checkAnswer(${i}, ${q.c}, ${q.v}, ${current + 1 < questions.length})" class="btn btn-secondary w-full py-3">${opt}</button>
            `).join('')}
          </div>
          ${helpCount > 0 ? `
            <button onclick="useHelp(${current})" class="btn btn-info mt-4">Usar Ajuda (Ver Percentagens)</button>
          ` : ''}
        </div>
        <button onclick="showGamesScreen()" class="btn btn-ghost mt-4">Sair</button>
      </div>
    `;
    setTimeout(() => lucide.createIcons(), 100);
  }

  window.checkAnswer = (ua, ca, value, hasNext) => {
    if (ua === ca) {
      totalEarned += value;
      showToast(`✅ +${value} OSD!`);
      showSticker('🎉');
    } else {
      showToast('❌ Errado!');
      showSticker('😢');
    }

    if (hasNext) {
      current++;
      setTimeout(showQuestion, 800);
    } else {
      gameBalance += totalEarned;
      gamesPlayed++;
      if (gamesPlayed % 10 === 0) {
        helpCount += 3;
      }
      db.ref('users/' + username).update({
        gameBalance,
        gamesPlayed,
        helpCount
      }).then(() => {
        showToast(`🎯 Você ganhou ${totalEarned} OSD!`);
        setTimeout(() => showGamesScreen(), 1000);
      });
    }
  };

  window.useHelp = (curr) => {
    if (helpCount > 0) {
      helpCount--;
      db.ref('users/' + username + '/helpCount').set(helpCount);
      const q = questions[curr];
      const correct = q.c;
      let percs = new Array(q.o.length).fill(0);
      percs[correct] = Math.floor(Math.random() * 21 + 40); // 40-60%
      let remaining = 100 - percs[correct];
      const numOthers = q.o.length - 1;
      const base = Math.floor(remaining / numOthers);
      let extra = remaining % numOthers;
      let otherIdx = 0;
      for (let i = 0; i < q.o.length; i++) {
        if (i !== correct) {
          percs[i] = base + (extra > 0 ? 1 : 0);
          extra--;
          otherIdx++;
        }
      }
      // Randomize others a bit
      for (let j = 0; j < 5; j++) { // shuffle slightly
        const idx1 = Math.floor(Math.random() * q.o.length);
        const idx2 = Math.floor(Math.random() * q.o.length);
        if (idx1 !== correct && idx2 !== correct && idx1 !== idx2) {
          const temp = percs[idx1];
          percs[idx1] = percs[idx2];
          percs[idx2] = temp;
        }
      }
      alert("Percentagens da audiência:\n" + q.o.map((opt, i) => `${opt}: ${percs[i]}%`).join('\n'));
      showQuestion(); // refresh to remove button if helpCount now 0
    }
  };

  showQuestion();
}

/**
 * Gera um código de resgate e permite copiar
 */
function generateRedemptionCode(username) {
  if (typeof db === 'undefined') {
    alert('Erro: Firebase não inicializado.');
    return;
  }

  db.ref('users/' + username + '/gameBalance').once('value')
    .then(snapshot => {
      const amount = snapshot.val() || 0;

      if (amount <= 0) {
        alert('Jogue primeiro para ganhar OSD!');
        return;
      }

      const code = `OSD-${username.toUpperCase()}-${Date.now()}`;
      db.ref('redemption_codes/' + code).set({
        username, amount, used: false, ts: Date.now()
      })
      .then(() => db.ref('users/' + username + '/gameBalance').set(0))
      .then(() => {
        const app = document.getElementById('app');
        app.innerHTML = `
          <div class="container">
            <div class="card text-center">
              <h3 class="text-xl font-bold mb-4">Código Gerado! 🎉</h3>
              <p class="text-muted mb-2">Resgate:</p>
              <p class="balance-display">${amount} <span class="osd">OSD</span></p>
              <p class="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">${code}</p>
              <button onclick="copyToClipboard('${code}')" class="btn btn-primary mb-3">
                📋 Copiar Código
              </button>
              <button onclick="loadDashboard('${username}')" class="btn btn-ghost">
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        `;
        showToast('Código gerado! Copie e use no depósito.');
        setTimeout(() => lucide.createIcons(), 100);
      });
    });
}

/**
 * Copia texto para a área de transferência
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showToast('✅ Código copiado!');
    })
    .catch(err => {
      alert('Falha ao copiar: ' + err.message);
    });
}

/**
 * Mostra um sticker animado
 */
function showSticker(emoji) {
  const sticker = document.createElement('div');
  sticker.innerHTML = `<span style="
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 80px;
    z-index: 1000;
    animation: pop 0.6s ease-out;
  ">${emoji}</span>`;
  document.body.appendChild(sticker);
  setTimeout(() => document.body.removeChild(sticker), 1000);
}

/**
 * Função global para mostrar notificações
 */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

/**
 * Obtém o usuário atual
 */
function getCurrentUser() {
  return { username: localStorage.getItem('currentUser') };
}
