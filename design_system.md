# DESIGN SYSTEM — TS-BRAND MANUAL (PREMIUM GLASS)

O TS-BRAND MANUAL evoluiu de uma interface flat para uma estetica **Glassmorphism Premium**, focada em profundidade, transparencia e interacoes snappy. Este sistema define as regras para manter a autenticidade e o padrao visual da plataforma.

---

## 1 — Design Philosophy: Glassmorphism

A interface deve parecer composta por camadas de vidro fosco sobrepostas. 
- **Transparência**: `rgba(20, 20, 20, 0.4)` para containers principais.
- **Desfoque (Blur)**: `backdrop-filter: blur(20px)` é o padrão para profundidade.
- **Bordas Reflexivas**: Bordas finas (`1px`) com baixa opacidade e `inset box-shadow` para simular o brilho da borda do vidro.

---

## 2 — Identidade Visual & Cores

### Paleta de Interface (Dark-Only)
```css
:root {
  --bg-base:      #0c0c0c; /* Fundo absoluto */
  --accent:       #ffa300; /* Laranja Oficial TS */
  --accent-hover: #ffb833;
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  
  /* Glass Tokens */
  --glass-bg:     rgba(20, 20, 20, 0.4);
  --glass-border: rgba(255, 255, 255, 0.08);
}
```

### Contextos de Alerta
Popups e Toasts utilizam cores semânticas para feedback imediato:
- **Sucesso**: `#10b981` (Emerald)
- **Erro**: `#f43f5e` (Rose)
- **Aviso/Confirm**: `#f59e0b` (Amber)
- **Info**: `#3b82f6` (Blue)

---

## 3 — Animações e Coreografia

O feeling da interface deve ser "snappy" e elegante.
- **Curva de Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` (Saída rápida, desaceleração suave).
- **Entrada em Escadinha (Stagger)**: Telas principais (como a Home) devem animar os elementos em sequência:
  1. Logo / Header
  2. Textos Hero
  3. Cards de ação
- **Hover Responsivo**: Transições de hover devem ser rápidas (`0.1s` ou `0.15s`) para feedback tátil instantâneo.

---

## 4 — Componentes Padronizados

### Home Cards
- **Estrutura**: Sem tags ou badges redundantes. 
- **Ações**: Botão de seta (`ArrowRight`) posicionado obrigatoriamente no **canto inferior direito**, com tamanho de container `40px` e ícone `20px`.

### Sistema de Alertas (Híbrido)
- **Notificações (Sonner)**: Toasts no canto inferior direito. Devem ter fundo glass e bordas coloridas translúcidas baseadas no contexto.
- **Escolhas (GlobalAlert)**: Popups centralizados com backdrop blur intenso. Usados exclusivamente para decisões críticas (Ex: Resetar projeto, Fechar sem salvar).

### Sidebar & Context Drawer
- **Drawer Lateral**: Trilho ultra-fino com ícone de configurações posicionado ao final (`flex-end`) para uma estética minimalista.
- **Preenchimento**: Uso de `glass-style` em todos os painéis expansíveis.

---

## 5 — Regras de Impressão (@media print)

O sistema de editor deve ser completamente ocultado durante a impressão, mantendo apenas o Canvas A4.
- **Margem**: Zero.
- **Cores**: `-webkit-print-color-adjust: exact`.
- **Quebras**: `page-break-after: always` em cada seção do manual.