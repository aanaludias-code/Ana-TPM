# Herdeiro Genético: A Linhagem Perdida 🧬

Jogo educativo de **Genética** para estudantes de graduação em Biologia, Biomedicina,
Medicina, Medicina Veterinária e áreas da saúde. Uma criança enjeitada aparece em
circunstâncias misteriosas — você é um jovem investigador genético e precisa descobrir
sua verdadeira linhagem biológica através de **heredogramas, exames de sangue, cariótipos,
análise de mutações e cálculo de probabilidades**.

> Estética: livro de histórias de fantasia sombria e aconchegante — pergaminho, vinhas,
> retratos ilustrados e menus de jogo de tabuleiro, tudo em CSS/SVG (sem imagens externas).

## Como jogar

O jogo é **HTML/CSS/JS puro** (módulos ES), sem etapa de build. Os módulos ES exigem
ser servidos por HTTP (não funcionam abrindo o arquivo via `file://`):

```bash
cd Ana-TPM
python3 -m http.server 8000
# abra http://localhost:8000
```

Ou `npm start` (atalho para o mesmo servidor).

1. **Nova Investigação** → escolha um dos três investigadores (forças diferentes em
   análise, dedução e interação social).
2. Viaje pelo **mapa** entre os cinco locais. Cada capítulo é um desafio real de genética.
3. Resolva o caso construindo heredogramas, preenchendo genótipos, eliminando casais por
   tipo sanguíneo, lendo cariótipos, classificando mutações e calculando probabilidades.
4. Cada vitória desbloqueia uma **ferramenta de laboratório** e o próximo local.
5. No **Diário** consulte as evidências coletadas e o **Códice da Genética** (referência
   dos conceitos, revelada conforme você os encontra).

O progresso é salvo automaticamente no navegador (`localStorage`).

## Aprender investigando

O jogo **não usa quiz**: cada conceito vira uma tarefa de resolução de problemas, com
feedback científico para respostas erradas (ex.: *"pais O × O não podem gerar filho B"*).

| Capítulo | Local | Mecânica | Conceitos de genética |
|---|---|---|---|
| 1 · O Heredograma Esquecido | Sótão da Mansão | Classificar padrão de herança + atribuir genótipos | Leis de Mendel, dominante/recessivo, autossômico × ligado ao sexo (X/Y), análise de heredograma, genótipo × fenótipo |
| 2 · Laços de Sangue | Hematologia | Eliminar casais impossíveis | Alelos múltiplos, sistema ABO, **codominância**, fator Rh |
| 3 · Detetive Cromossômico | Citogenética | Sinalizar anomalia + marcador de pigmento | Cariótipo e mapeamento cromossômico, ligação gênica, **dominância incompleta** |
| 4 · O Mistério da Mutação | Banco de Mutações | Coletar pistas e classificar a origem | Mutações, germinativa × somática, espontânea (de novo), reparo de DNA |
| 5 · A Linhagem Final | Salão dos Retratos | Combinar provas + probabilidade + acusação | Probabilidade (regra do "e"/"ou"), aconselhamento genético, reconstrução da árvore |

**Todos os 17 conceitos do escopo** estão cobertos entre os capítulos acima.

## Estrutura do projeto

```
index.html              # entrada; carrega js/main.js como módulo ES
css/                    # theme.css (paleta/pergaminho), components.css, game.css
js/
  main.js               # bootstrap: registra telas, carrega save, renderiza
  state.js              # store central + persistência em localStorage
  router.js             # roteador de telas
  ui.js                 # helpers de DOM (toast, modal, nota, feedback...)
  genetics/             # NÚCLEO CIENTÍFICO (puro, testável):
    punnett.js          #   cruzamentos (dominância, incompleta, codominância)
    blood.js            #   ABO + Rh (compatibilidade de pais)
    pedigree.js         #   heredograma: genótipos, consistência, SVG
    probability.js      #   frações exatas + combinação de eventos
    mutation.js         #   classificação da origem de mutações
    selftest.js         #   asserções dos módulos (ver abaixo)
  data/                 # protagonists, characters (famílias), chapters, codex, svg
  screens/              # title, protagonist, map, journal, chapter1..5, ending
```

## Testes

A lógica genética é independente da interface e tem testes automatizados:

```bash
npm test            # ou: node js/genetics/run-selftest.js
```

No navegador, abra `http://localhost:8000/?selftest` e veja o resultado no console.

---

Conteúdo em **Português (Brasil)**. Projeto educativo — a compatibilidade sanguínea, por
exemplo, é apresentada corretamente como ferramenta de **exclusão** de paternidade, não de
prova absoluta.
