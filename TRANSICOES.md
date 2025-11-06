# 🎨 Sistema de Transições - Eventizen

## 📋 Visão Geral

Este documento explica como o sistema de transições foi implementado e como você pode personalizar as animações entre as páginas do Eventizen.

## 🚀 Como Funciona

### Arquivos Criados

1. **`transitions.css`** - Contém todos os estilos de animação (fade, slide, scale, blur)
2. **`transitions.js`** - Gerencia a navegação entre páginas e aplica as transições

### Tipos de Transições Implementadas

#### 1. **Fade + Scale** (Padrão)
- **Entrada**: Fade in com scale de 0.98 para 1.0 + blur sutil
- **Saída**: Fade out com slide para esquerda
- **Duração**: 500ms (entrada) / 400ms (saída)

#### 2. **Slide** (Direcional)
- **Forward**: Slide da direita para esquerda
- **Back**: Slide da esquerda para direita

#### 3. **Blur Effect**
- Efeito de blur sutil durante a transição para dar sensação de profundidade

#### 4. **Stagger Animation**
- Elementos internos (cards, seções) aparecem com delay crescente (0ms, 100ms, 200ms)

### Características

- ✅ **Respeita preferências de movimento reduzido** (`prefers-reduced-motion`)
- ✅ **Responsivo** - Ajusta animações para mobile (mais rápidas)
- ✅ **Performance otimizada** - Limita animações a 3 elementos principais
- ✅ **Logo automática** - Garante que a logo apareça em todas as páginas

## ⚙️ Como Personalizar

### Alterar Duração das Transições

No arquivo `transitions.js`, você pode alterar a configuração:

```javascript
const TRANSITION_CONFIG = {
    duration: 500, // Altere aqui (entre 300-800ms recomendado)
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    type: 'fade-slide'
};
```

Ou via JavaScript no console do navegador:

```javascript
// Alterar duração para 600ms
PageTransitions.setDuration(600);

// Alterar tipo de transição
PageTransitions.setType('scale'); // ou 'fade-slide', 'blur'
```

### Alterar Tipo de Animação

No arquivo `transitions.css`, você pode modificar as animações:

#### Mudar animação de entrada:

```css
@keyframes pageEnter {
    from {
        opacity: 0;
        transform: scale(0.95); /* Ajuste o scale */
        filter: blur(6px); /* Ajuste o blur */
    }
    to {
        opacity: 1;
        transform: scale(1);
        filter: blur(0);
    }
}
```

#### Mudar animação de saída:

```css
@keyframes pageExit {
    from {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
    to {
        opacity: 0;
        transform: translateX(-30px) scale(0.98); /* Ajuste valores */
    }
}
```

### Easing Functions

Você pode alterar a curva de animação para diferentes sensações:

- **Suave e natural**: `cubic-bezier(0.4, 0, 0.2, 1)` (padrão)
- **Mais rápida**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **Elástica**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`
- **Linear**: `linear`

### Desabilitar Transições

Para desabilitar completamente as transições, remova ou comente os arquivos:

```html
<!-- <link rel="stylesheet" href="transitions.css"> -->
<!-- <script src="transitions.js"></script> -->
```

Ou adicione no CSS:

```css
* {
    animation: none !important;
    transition: none !important;
}
```

## 🎯 Estrutura de Navegação

### Como Funciona

1. **Interceptação de Links**: O JavaScript intercepta todos os cliques em links internos (`.html`)
2. **Animação de Saída**: Aplica animação de saída na página atual
3. **Navegação**: Após 70% da duração, navega para a nova página
4. **Animação de Entrada**: A nova página carrega com animação de entrada

### Links Afetados

- ✅ Links para arquivos `.html`
- ✅ Links relativos (ex: `./pagina.html`, `/pagina.html`)
- ❌ Links externos (`http://`, `https://`)
- ❌ Links de âncora (`#section`)
- ❌ Links especiais (`mailto:`, `tel:`)

## 📱 Responsividade

As animações se ajustam automaticamente para dispositivos móveis:

- **Mobile**: Duração reduzida (400ms entrada / 300ms saída)
- **Desktop**: Duração completa (500ms entrada / 400ms saída)

## 🔧 Troubleshooting

### Transições não funcionam?

1. Verifique se os arquivos `transitions.css` e `transitions.js` estão na mesma pasta das páginas HTML
2. Verifique o console do navegador para erros JavaScript
3. Certifique-se de que os links têm o atributo `href` correto

### Logo não aparece?

1. Verifique se o arquivo `Eventize.png` está na mesma pasta
2. Verifique o console do navegador para erros
3. O script tenta adicionar a logo automaticamente, mas pode não funcionar em layouts muito complexos

### Animação muito lenta/rápida?

Ajuste a duração em `transitions.js`:

```javascript
duration: 600 // Mais lento
duration: 300 // Mais rápido
```

## 📝 Notas Técnicas

- As transições usam `requestAnimationFrame` implicitamente através do CSS
- O sistema respeita `prefers-reduced-motion` para acessibilidade
- Overlay de transição tem z-index alto (99999) para ficar acima de tudo
- A navegação é interceptada antes do comportamento padrão do navegador

## 🎨 Inspiração

As transições foram inspiradas em:
- **Apple** - Transições suaves e elegantes
- **Spotify** - Animações fluidas e modernas
- **Material Design** - Princípios de movimento e timing

---

**Desenvolvido para Eventizen** | Sistema de transições v1.0

