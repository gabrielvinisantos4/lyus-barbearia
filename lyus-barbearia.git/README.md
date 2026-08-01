# LYU'S · Unisingle Academy · Lóbbus

Três páginas estáticas. Não precisa de build.

```
index.html                    Home (barbearia + as três marcas)
academy/curso/index.html      Landing do curso        → /academy/curso
lobbus/produtos/index.html    Landing dos produtos    → /lobbus/produtos
assets/                       logos, fotos e vídeos compartilhados
  header.css  header.js       A BARRA DE NAVEGAÇÃO DE TODAS AS PÁGINAS
  base.css    base.js         visual e comportamento das páginas internas
vercel.json                   cache dos assets
```

## O header

As três páginas usam a mesma barra: logo, Barbearia, Academy, Lóbbus,
Visita e os dois botões de agendar. O visual e as animações vêm de
`assets/header.css` e `assets/header.js` — mude ali e muda no site inteiro.

O item da página em que você está aparece destacado. Na home, o destaque
acompanha a seção conforme você rola, junto com a cor de acento.

Abaixo de 1120px a barra vira um botão sanduíche que abre um painel em
tela cheia, com os mesmos links e os mesmos dois botões.

Para acrescentar um item de menu, ele precisa entrar em dois lugares de
cada página: no bloco `nav class="nav__meio"` e no bloco `div class="painel"`.

## O funil

```
HOME → botão da Academy  → /academy/curso   → conteúdo → WhatsApp no final
HOME → botão da Lóbbus   → /lobbus/produtos → conteúdo → WhatsApp por produto
```

Os botões de **agendamento** da barbearia continuam indo direto para o app
e para o WhatsApp — ali a conversão é imediata, não tem funil no meio.

## Publicar

Arraste a pasta inteira em https://vercel.com/drop.
As subpastas viram as URLs automaticamente.

## Colocar fotos e vídeos — sem mexer no código

Cada landing tem uma pasta `midia/` com um arquivo `LEIA-ME.txt`
listando os nomes exatos dos arquivos.

Salve o arquivo com o nome indicado e ele aparece sozinho na página.
Enquanto não existir, o espaço mostra um aviso com o nome esperado —
então dá para publicar o site já e ir completando a mídia depois.

Já colocados: o vídeo do topo e o vídeo da pomada, na Lóbbus.
Faltam: mídia do curso, galerias dos dois produtos e o vídeo do balm.

## Textos a revisar

Procure `[TROCAR]` em cada arquivo.

- **Home:** horários, @ do Instagram
- **Curso:** números da turma (semanas, horas, vagas), módulos, depoimentos,
  respostas do FAQ, história de quem ensina
- **Produtos:** descrições, fichas técnicas e conteúdo das embalagens

## Produto novo na Lóbbus

No `lobbus/produtos/index.html`, copie um bloco `<section class="produto">`
inteiro, troque os textos e use um prefixo novo nos nomes dos arquivos
(ex.: `shampoo-video.mp4`, `shampoo-1.jpg`).
