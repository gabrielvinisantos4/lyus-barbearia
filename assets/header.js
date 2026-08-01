/* ═══════════════════════════════════════════════════════════
   HEADER — comportamento compartilhado por todas as páginas
   · deixa a barra sólida ao rolar
   · abre e fecha o painel de navegação nas telas menores
   O destaque do item ativo por seção fica na própria página.
   ═══════════════════════════════════════════════════════════ */
(function(){
  "use strict";

  var nav    = document.querySelector(".nav");
  var abre   = document.querySelector(".nav__abre");
  var painel = document.getElementById("painel");

  /* ── barra sólida ao sair do topo ── */
  if(nav){
    var travado = false;
    function pinta(){
      nav.classList.toggle("solto", (window.scrollY || window.pageYOffset) > 80);
      travado = false;
    }
    window.addEventListener("scroll", function(){
      if(!travado){ travado = true; requestAnimationFrame(pinta); }
    }, { passive:true });
    pinta();
  }

  /* ── painel ── */
  if(abre && painel){
    function alterna(estado){
      var aberto = estado !== undefined ? estado : !painel.classList.contains("aberto");
      painel.classList.toggle("aberto", aberto);
      abre.setAttribute("aria-expanded", aberto ? "true" : "false");
      abre.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("travado", aberto);
    }

    abre.addEventListener("click", function(){ alterna(); });

    /* fecha ao escolher um destino */
    painel.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ alterna(false); });
    });

    /* fecha no Esc */
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && painel.classList.contains("aberto")) alterna(false);
    });

    /* se a tela crescer e a barra completa aparecer, some com o painel */
    window.addEventListener("resize", function(){
      if(window.innerWidth >= 1120 && painel.classList.contains("aberto")) alterna(false);
    });
  }
})();
