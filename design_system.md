DESIGN SYSTEM — TS-BRAND MANUAL
Adaptação do padrão TS TOOLS para o Gerador de Manual de Marca.
Mantém a identidade visual na interface (UI) — dark-only, accent laranja, tipografia Geist — mas introduz uma "Área de Canvas" com fundo neutro para o preview do documento A4.

1 — Identidade Visual & Cores (Interface)
A paleta aplica-se apenas ao painel de controle. O PDF gerado respeita as cores definidas pelo usuário.

:root {
  /* Fundos da Interface (Dark Mode) */
  --bg-base:    #0c0c0c;
  --bg-sidebar: #161616;
  --bg-input:   #1a1a1a;
  --bg-elevated:#202020;

  /* Canvas do PDF */
  --bg-canvas:  #27272a;

  /* Accent — Laranja TS TOOLS */
  --accent:         #f97316;
  --accent-hover:   #fb923c;
  --accent-muted:   #f9731620;
  --accent-border:  #f9731640;

  /* Texto da Interface */
  --text-primary:   #ffffff;
  --text-secondary: #a1a1aa;
  --border:         #27272a;   
}

2 — Layout & Navegação (Split-Screen)
Sidebar de Controle (Esquerda): Fixa, w-[400px], overflow-y-auto. Contém os formulários e botões de ação (Exportar, Importar, Imprimir).

Área de Canvas (Direita): Flex-1, centralizada, com scroll. Fundo --bg-canvas. Contém as folhas A4 renderizadas em tempo real.

3 — Regras de Impressão (@media print)
Obrigatório para o funcionamento do sistema. O navegador deve ignorar a UI escura e imprimir apenas o canvas A4.

@media print {
  @page { size: A4 landscape; margin: 0; }
  aside, .ui-controls, .toast-container { display: none !important; }
  .pagina-pdf {
    box-shadow: none !important;
    page-break-after: always;
    page-break-inside: avoid;
  }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

4 — UX & Feedback
Toast: Sonner em toda ação concluída ou erro.

Alertas: AlertDialog (shadcn) para ações destrutivas (ex: Limpar dados).

Focus ring: ring-2 ring-accent/50 nos inputs da sidebar.