# ARQUIVO: architecture.md
# Arquitetura do Gerador de Manual de Marca

## Stack Recomendada
- Framework: Next.js (App Router) ou Vite (React)
- Estilização: Tailwind CSS v4 + CSS Tradicional para regras estritas de impressão (`@media print`).
- UI Base: shadcn/ui (Radix UI primitives)
- Gerenciamento de Estado: Zustand ou React Context.
- Tratamento de Imagens: Ao fazer upload, as imagens devem ser comprimidas levemente via Canvas HTML5 e convertidas para `Base64` no client-side.

## O Sistema de "HUD" (Overlay Fixo)
O HTML de cada página gerada deve seguir esta hierarquia:
```html
<div class="pagina-pdf relative w-[297mm] h-[210mm] overflow-hidden page-break bg-white shadow-xl print:shadow-none">
  <div class="fundo absolute inset-0 z-0"></div>
  
  <div class="conteudo relative z-10 p-12">...</div>
  
  <div class="hud absolute inset-0 z-50 pointer-events-none p-10 flex flex-col justify-between">
    <h2 class="titulo-secao text-4xl font-black">Nome da Seção</h2>
    <div class="rodape flex items-center gap-4">
      <div class="linha grow h-[2px] bg-black"></div>
      <span class="numero-pagina font-bold text-2xl">{index + 1}</span>
    </div>
  </div>
</div>