#### Arquivo 2: `data_schema.md`
```md
# Estrutura do Estado (JSON para Import/Export)

O estado principal da aplicação deve seguir esta estrutura. Este é o objeto que será transformado em string JSON para download e parseado de volta no upload.

```json
{
  "projeto": {
    "nome_marca": "",
    "conceito": ""
  },
  "tipografia": {
    "principal_nome": "",
    "principal_estilos": "",
    "secundaria_nome": "",
    "secundaria_estilos": ""
  },
  "cores": [
    { "id": 1, "hex": "#ffffff", "rgb": "", "cmyk": "" },
    { "id": 2, "hex": "#000000", "rgb": "", "cmyk": "" }
  ],
  "assets_base64": {
    "logo_principal": null,
    "logo_monocromatica": null,
    "logo_simbolo": null,
    "fundo_padrao": null,
    "mockups": []
  }
}