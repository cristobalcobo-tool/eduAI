# Resumo executivo: IA e tutoria na educação

A tutoria com IA pode melhorar a aprendizagem, mas o que mais pesa é como ela é implementada: tempo protegido no horário, alguém encarregado de que aconteça e ferramentas que exijam esforço. O acesso aberto a chatbots piora o que se aprende sem eles, e a IA generativa ainda não mostra vantagem clara sobre a prática adaptativa mais barata. A evidência de custo é escassa (8 de 247 estudos verificados informam custo por estudante) e quase não há ensaios rigorosos de países de renda baixa nem da América Latina; por isso convém pilotar com avaliação independente antes de escalar.

Este resumo acompanha o [Laboratório de Impacto da IA Educacional](https://cristobalcobo-tool.github.io/eduAI/artifacts/calculator/), um site exploratório que reúne a EvidencIA, o Stanford SCALE AI Hub e o AI and Human Skill Atlas.

## Cinco conclusões para decidir

1. **A estrutura rende mais que a ferramenta.** Na Índia, o que se sorteou foram encarregados que garantiam duas sessões semanais de Khan Academy, não a plataforma: matemática subiu 0,33 a 0,44 desvios padrão (DP), a USD 14 por estudante em sete meses ([Oreopoulos et al., 2026](https://www.nber.org/papers/w34683)). No Tennessee, com o tutor de IA a um clique, o ganho foi 0,04 DP por trimestre e os autores o atribuem à prática estruturada, não ao chat ([Oreopoulos & Low, 2026](https://www.nber.org/papers/w35620)).
2. **O chatbot aberto não ensina.** Na Turquia, o acesso livre ao GPT 4 melhorou a prática, mas a prova sem IA caiu 17%; com pistas em vez de respostas o dano desapareceu, sem ganho ([Bastani et al., 2025](https://doi.org/10.1073/pnas.2422633122)). A EvidencIA classifica esta lição como consistente.
3. **A IA generativa ainda não supera a prática adaptativa.** Uma meta análise de 14 ensaios encontra 0,125 DP em média para tecnologia adaptativa e com IA, sem vantagem detectável da generativa ([Burneo et al., 2026](https://thedocs.worldbank.org/en/doc/2fba81cd6cd60d2f54532fc7062395fb-0050062026/original/Can-EdTech-Close-Learning-Gaps.pdf), da própria rede da EvidencIA). A tutoria humana alcança 0,37 DP em média e 0,25 em estudos grandes ([Nickow et al., 2020](https://doi.org/10.3386/w27476)).
4. **O custo é pouco conhecido.** Só 8 dos 247 estudos do núcleo verificado informam custo por estudante, e cada um o calcula de um jeito (licenças, piloto total ou projeção). Serve como ordem de grandeza, não como preço.
5. **A evidência vem de poucos lugares, e boa parte é produzida pelos próprios desenvolvedores.** Dos 247 estudos verificados, 161 são de países de renda alta e 3 de renda baixa; o desenvolvedor participou de 110 de 161 avaliações de ferramentas, e só 25 medem a aprendizagem duas semanas ou mais depois.

## As 8 lições

A força da evidência separa o que mostram ensaios causais do que estudos descritivos apenas sugerem ou guias e políticas recomendam. O detalhe e as fontes de cada lição estão na aba Lições do site.

| Tema | Lição | Evidência | O que fazer primeiro |
| --- | --- | --- | --- |
| Desenho e dose | Evite chatbots abertos para aprender: escolha ferramentas que exijam esforço. | Causal consistente | Exija que a ferramenta dê pistas e passos, não a resposta final. |
| Implementação, custo e escala | Pague pela estrutura, não só pela ferramenta. | Causal moderada | Reserve sessões fixas no horário e orçe alguém que as garanta. |
| Docentes | Apoie os docentes para ensinar melhor, não só para preparar mais rápido. | Causal moderada | Forme para julgar as respostas da IA e proteger dados; acompanhe com coaching. |
| Estudantes | Ensine a usar a IA como tutor: pedir explicações e passos, não respostas. | Causal moderada | Dê instruções concretas de uso e peça que tentem antes de consultar. |
| Infraestrutura | Diagnostique primeiro e desenhe para a conectividade que você realmente tem. | Parcial, sobretudo descritiva | Faça um diagnóstico de preparação e orçe dispositivos e suporte técnico. |
| Lugar de uso | Prefira o horário escolar com supervisão: fora da escola a frequência cai. | Parcial, sobretudo descritiva | Integre as sessões ao horário; fora da escola, meça a frequência. |
| Inclusão e equidade | Não suponha que a IA fecha lacunas: meça desde o início quem ganha. | Parcial, sobretudo descritiva | Desagregue resultados por nível inicial, gênero, deficiência, região e língua. |
| Privacidade e governança | Proteja os dados antes de implantar: nenhum estudo testa isso, mas quase todas as políticas exigem. | Só guias e políticas | Faça uma avaliação de impacto em proteção de dados antes de comprar. |

## Efeito e custo

Os programas mais baratos não são os de menor efeito, mas cada custo foi calculado de um jeito; por isso não devem ser ordenados por “efeito por dólar” sem dizer o que cada número cobre. Efeitos com a regra comum da EvidencIA (coeficiente dividido pelo DP do grupo de controle).

| Programa | Efeito (DP) | Custo por estudante | O que considerar |
| --- | --- | --- | --- |
| [Prática supervisionada na Khan Academy, Índia](https://www.nber.org/papers/w34683) | +0,44 | USD 14 em sete meses, sobretudo pessoal | 44,5% sem prova final; não é IA generativa |
| [Rori pelo WhatsApp, Gana](https://doi.org/10.1007/978-3-031-64315-6_34) | +0,37 | USD 5, projeção dos autores | Nível 2: 11 escolas, 25% de perda; não é IA generativa |
| [Gemini Guided Learning, Serra Leoa](https://storage.googleapis.com/deepmind-media/LearnLM/learnLM_sierraleone_may26.pdf) | +0,30 | Não informado | Relatório do desenvolvedor, sem revisão por pares |
| [Copilot como tutor de inglês, Nigéria](https://documents.worldbank.org/curated/en/099548105192529324/pdf/IDU-c09f40d8-9ff8-42dc-b315-591157499be7.pdf) | +0,24 | USD 48, total do piloto | 42,8% sem prova final; soma tempo extra e supervisão |
| [ShaIA para docentes, Bogotá](https://juansmunoz.github.io/AI_Evaluation_Bogota.pdf) | +0,21 | USD 9,14, licenças e acompanhamento | Resultado preliminar em 29 de 158 escolas |
| [Tutoria Saga com software, Chicago e Nova York](https://www.nber.org/papers/w32510) | +0,19 | USD 2.200, tutores humanos incluídos | Teste padronizado externo; sem risco alto de viés |
| [Khanmigo, Tennessee](https://www.nber.org/papers/w35620) | +0,05 | USD 15 por ano, só licenças | Teste externo; os autores atribuem o efeito à prática, não ao chat |

O ensaio de Harvard ([Kestin et al., 2025](https://doi.org/10.1038/s41598-025-97652-6), +0,63) fica fora desta tabela: a EvidencIA toma seu efeito do paper porque faltam dados para aplicar a regra comum, e ele foi medido na mesma sessão após uma única lição.

## Quão sólida é a evidência

Há uma base causal real, mas estreita: serve para orientar decisões, não para prometer um efeito num país concreto. Números da EvidencIA (corte da base 16 out 2026; consultado em 18 nov 2026).

| Indicador | Valor |
| --- | --- |
| Ensaios verificados de nível 1 (randomizados, medem aprendizagem sem IA) | 99 estudos: 70 sobre IA, 29 sem IA; 71 de campo e 28 de laboratório |
| Estudos do núcleo verificado que informam custo por estudante | 8 de 247 |
| Estudos do núcleo que medem duas semanas ou mais depois | 25 de 247 |
| Avaliações de ferramentas com participação do desenvolvedor | 110 de 161 (31 independentes) |
| Estudos do núcleo por renda do país | alta 161, média alta 36, média baixa 15, baixa 3 |
| Estudos do núcleo na América Latina e Caribe | 19 de 247 |

O que falta saber: se os efeitos duram meses depois; que parte do efeito vem da ferramenta e que parte da estrutura que a acompanha; o que acontece em países de renda baixa e em escolas públicas da região; se a IA fecha ou abre lacunas (os ensaios apontam nas duas direções); e se as proteções de dados que as políticas exigem mudam os riscos. Nenhum estudo verificado mediu separadamente o pensamento crítico com um teste.

## Recomendações

Estas recomendações são uma síntese própria a partir da evidência acima; não vêm de um estudo em particular.

**Para ministérios**

1. Financie a estrutura junto com a ferramenta: sessões fixas no horário, uma pessoa responsável por escola e acompanhamento do uso real.
2. Nas compras, exija ferramentas que deem pistas e passos em vez de respostas, com prática adaptada ao nível; evite o chatbot aberto como ferramenta de aprendizagem.
3. Compare com opções mais baratas (prática adaptativa, tutoria em pequenos grupos) e calcule o custo por estudante com tudo incluído: dispositivos, conectividade, pessoal e formação.
4. Pilote antes de escalar, com avaliação randomizada e independente, um teste sem IA e uma medição meses depois, e resultados desagregados por nível inicial, gênero, região e deficiência.
5. Antes de adotar uma ferramenta, faça uma avaliação de impacto em proteção de dados e assine acordos que deixem os dados com a escola.

**Para a pesquisa**

1. Informe o custo por estudante com um método comum e diga o que ele cobre.
2. Meça com testes sem IA, externos e posteriores, não só ao fim da sessão.
3. Separe a contribuição da ferramenta da contribuição da estrutura (tempo extra, supervisão, formação), com braços que o permitam.
4. Aumente as avaliações independentes e os ensaios em países de renda baixa e na América Latina.
5. Informe resultados por subgrupo e meça habilidades que hoje não se medem, como o pensamento crítico.

## Fontes e método

Os números vêm do conector da [EvidencIA](https://mcp.redevidencia.org/) (rede latino americana sobre IA e ciência da aprendizagem; corte da base 16 out 2026, consultado em 18 nov 2026), que inclui a coleção do Stanford SCALE AI Hub, e do [AI and Human Skill Atlas](https://aiskillatlas.org/) (versão 2026-11-11.1), usado com atribuição para fins exploratórios. Os efeitos estão em desvios padrão com a regra comum da EvidencIA; podem diferir do número publicado por cada paper. As lições e recomendações foram destiladas pelo Claude; as lições curadas da EvidencIA são um protótipo (versão 0.2.0) pendente de revisão por seu comitê. São insumos para decidir e devem ser corroborados no contexto local.

Estudos citados: [Oreopoulos et al., 2026](https://www.nber.org/papers/w34683) · [Oreopoulos & Low, 2026](https://www.nber.org/papers/w35620) · [Bastani et al., 2025](https://doi.org/10.1073/pnas.2422633122) · [Burneo et al., 2026](https://thedocs.worldbank.org/en/doc/2fba81cd6cd60d2f54532fc7062395fb-0050062026/original/Can-EdTech-Close-Learning-Gaps.pdf) · [Nickow et al., 2020](https://doi.org/10.3386/w27476) · [Henkel et al., 2024](https://doi.org/10.1007/978-3-031-64315-6_34) · [LearnLM Team & Fab AI, 2026](https://storage.googleapis.com/deepmind-media/LearnLM/learnLM_sierraleone_may26.pdf) · [De Simone et al., 2025](https://documents.worldbank.org/curated/en/099548105192529324/pdf/IDU-c09f40d8-9ff8-42dc-b315-591157499be7.pdf) · [Barrera-Osorio & Muñoz-Morales, 2026](https://juansmunoz.github.io/AI_Evaluation_Bogota.pdf) · [Bhatt et al., 2024](https://www.nber.org/papers/w32510) · [Kestin et al., 2025](https://doi.org/10.1038/s41598-025-97652-6)

Site com o detalhe, o explorador de 99 ensaios e a calculadora: [Laboratório de Impacto da IA Educacional](https://cristobalcobo-tool.github.io/eduAI/artifacts/calculator/).
