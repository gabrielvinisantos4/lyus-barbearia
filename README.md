# LYU'S · Unisingle Academy · Lóbbus

Landing page única com as três marcas. Site estático — não precisa de build.

## Publicar

**Arrastar (mais rápido):** abra https://vercel.com/new e arraste esta pasta.

**CLI:** `npx vercel` (preview) · `npx vercel --prod` (produção)

**GitHub:**
```bash
git init && git add . && git commit -m "Site LYU'S"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/lyus.git
git push -u origin main
```
Depois conecte o repositório em vercel.com/new — cada push republica.

## Falta preencher — procure `[TROCAR]` no index.html

- horários de funcionamento
- @ do Instagram (das três marcas)
- linha real de produtos Lóbbus (hoje tem 5 categorias de exemplo)
- link/destino do botão "Falar sobre as turmas" da Academy

## Já está correto

- endereço: R. Pernambuco, 392 — Colorado, PR, 86690-000
- WhatsApp: (44) 99830-6449
- textos da Academy (quem somos, missão, visão, 8 valores, manifesto) — transcritos dos seus cards

## Vídeos

`VIDEOS-quais-usei.jpg` é a folha de contato dos 8 vídeos que você mandou, na ordem v1…v8.
Estão em uso:

| onde | vídeo |
|---|---|
| hero da barbearia | v6 (salão, 9s) |
| abertura da Academy | v2 (trecho de 9s) |
| abertura da Lóbbus | v8 (o de tom azul) |

Se algum estiver na seção errada, me diga o número certo — a troca é só regerar o arquivo.

## Estrutura

```
index.html    página inteira (HTML, CSS e JS num arquivo)
vercel.json   cache dos assets
assets/       logos, vídeos e fotos otimizadas
```
