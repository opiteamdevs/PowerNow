# PowerNow — Cloudflare Edition

Este projeto transforma o PowerNow em um sistema real de registro de **subdomínios** dentro de `docedleite.com.br`.

## Configuração

1. No Cloudflare, abra `docedleite.com.br`.
2. Crie um API Token com permissão de editar DNS da zona.
3. Copie o Zone ID.
4. Crie `.env.local`:

CLOUDFLARE_API_TOKEN=seu_token
CLOUDFLARE_ZONE_ID=seu_zone_id
POWERNow_BASE_DOMAIN=docedleite.com.br
POWERNow_TARGET=SEU_IP_OU_DESTINO

5. `npm install`
6. `npm run dev`

IMPORTANTE: o projeto NÃO coloca o token no navegador.

O `POWERNow_TARGET` é o destino DNS que os subdomínios vão apontar. O valor padrão `192.0.2.1` é apenas documentação/teste e não hospeda seu site. Para produção, use o IP/serviço real que você controla.

Este projeto registra subdomínios reais no DNS da Cloudflare; ele não registra novos domínios `.com`/`.com.br` no Registro.br.
