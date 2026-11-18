# Doctors Odontologia e Saúde

Site institucional em verde-esmeralda, creme e dourado, desenvolvido para apresentação comercial da clínica em Pouso Alegre–MG.

HTML, CSS e JavaScript nativos. Sem dependências de produção, sem banco de dados e sem instalação de pacotes para executar ou compilar. Fontes locais e três fotografias reais em WebP responsivo.

## Visualizar no computador

É necessário Node.js 20 ou superior.

```sh
npm run dev
```

Abra `http://localhost:4173`. Para testar no celular conectado à mesma rede, abra `http://IP-DO-COMPUTADOR:4173`.

## Publicar na Vercel

1. Envie **o conteúdo desta pasta** para um repositório no GitHub, mantendo `index.html` e `package.json` na raiz.
2. Importe o repositório na Vercel.
3. Use o preset **Other**, o comando de build `npm run build` e o diretório de saída `dist`.

O arquivo `vercel.json` já configura o build, a saída estática, o cache de assets e cabeçalhos básicos. Não são necessárias variáveis de ambiente.

## Publicar no GitHub Pages

O site também funciona em subpastas de repositórios, porque os caminhos dos assets são relativos.

Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**. O workflow `.github/workflows/pages.yml` publica a branch `main`. Também pode ser iniciado manualmente em **Actions → Publicar no GitHub Pages → Run workflow**.

Alternativamente, publique diretamente a raiz do repositório usando a opção de publicação por branch do Pages: o `index.html` e os assets já estão prontos, sem precisar de build.

## Gerar a versão estática

```sh
npm run build
npm run preview
```

O build verifica a sintaxe JavaScript e os arquivos referenciados antes de gerar `dist/`.

## Organização

```text
index.html                Conteúdo, metadados e estrutura
assets/css/styles.css     Identidade visual e responsividade
assets/js/main.js         Menu, galeria, calendário e WhatsApp
assets/images/            Fotografias reais otimizadas e card social
assets/fonts/             Fontes locais e licenças SIL OFL
assets/favicon.svg        Símbolo vetorial da apresentação
scripts/                  Servidor local e build, sem dependências
vercel.json               Configuração de publicação
.github/workflows/        Publicação no GitHub Pages
```

## Agendamento

- Nome e sobrenome, telefone com DDD, interesse e data são validados.
- O calendário usa o dia atual no fuso `America/Sao_Paulo` e bloqueia datas passadas.
- O interesse é um campo livre: nenhuma lista de procedimentos é inventada.
- O envio abre `https://wa.me/5535997191553` com a mensagem codificada por `encodeURIComponent`.
- O paciente revisa e envia a mensagem no WhatsApp. O site não confirma consultas nem informa horários disponíveis.
- Se a abertura de nova aba for bloqueada, um link aparece no próprio formulário.
- Os dados não são armazenados no site, em cookies ou no navegador.

## Conteúdo e imagens

As fotos representam, respectivamente: **fachada**, **consultório com mesa e maca** e **sala com cadeira odontológica**. A galeria permite ampliação, navegação por setas, teclado e gestos horizontais de toque. A foto completa é preservada no lightbox.

A nota 5,0, as 7 avaliações e os dois depoimentos são os dados fornecidos para esta demonstração; não há integração de atualização automática com o Google. Não foram adicionados nomes de profissionais, tratamentos, certificações ou horários não confirmados.

O mapa integrado utiliza o endereço informado. Se o visitante bloquear conteúdo externo ou estiver offline, o endereço e os links diretos para o Google Maps continuam acessíveis.

O símbolo dourado é SVG leve, bidimensional. Não há Three.js ou WebGL. As animações respeitam `prefers-reduced-motion`, e o parallax discreto fica restrito ao desktop.

O card de compartilhamento está em `assets/images/compartilhar.jpg`. Os metadados usam caminho relativo para portabilidade; depois de definir o domínio, configure `og:image` com a URL absoluta desse arquivo para melhorar a compatibilidade com prévias no WhatsApp e outras redes.

## Validação realizada

- Build e verificação de sintaxe JavaScript.
- Revisão visual no navegador em 360px, 390px e 1440px.
- Largura do documento sem overflow horizontal nos tamanhos verificados.
- Fotos reais, lightbox, navegação e fechamento por Escape.
- Campos obrigatórios, máscara do telefone, calendário e URL final do WhatsApp com dados de demonstração.

As verificações responsivas foram feitas em navegador de desktop com viewport reduzida; não substituem um teste em aparelho físico.
