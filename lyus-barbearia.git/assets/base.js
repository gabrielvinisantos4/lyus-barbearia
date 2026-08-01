/* ═══════════════════════════════════════════════════════════
   BASE — comportamento das páginas internas
   Inclui o sistema de SLOTS: se o arquivo de mídia não existir,
   o slot mostra um aviso com o nome do arquivo esperado.
   Para publicar a mídia, basta colocar o arquivo na pasta
   com o nome indicado — nenhum código precisa ser alterado.
   ═══════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── scroll suave (degrada sozinho se o CDN não carregar) ── */
  var lenis = null;
  if(!reduz && window.Lenis){
    lenis = new window.Lenis({ duration:1.15, smoothWheel:true, touchMultiplier:1.6 });
    (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })();
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener("click", function(e){
        var alvo = document.querySelector(a.getAttribute("href"));
        if(alvo){ e.preventDefault(); lenis.scrollTo(alvo); }
      });
    });
  }

  /* ── reveals ── */
  var obs = new IntersectionObserver(function(ent){
    ent.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add("is-in"); obs.unobserve(e.target); }
    });
  }, { threshold:.15, rootMargin:"0px 0px -8% 0px" });
  document.querySelectorAll(".reveal, [data-trilho]").forEach(function(el){ obs.observe(el); });

  /* ── SLOTS de mídia ── */
  document.querySelectorAll(".slot").forEach(function(slot){
    var midia = slot.querySelector("video, img");
    if(!midia) return;

    var caminho = midia.getAttribute("src") ||
                  (midia.querySelector && midia.querySelector("source") ? midia.querySelector("source").getAttribute("src") : "");
    var arquivo = caminho.split("/").pop();

    function vazio(){
      if(slot.classList.contains("vazio")) return;
      slot.classList.add("vazio");
      if(slot.querySelector(".slot__aviso")) return;
      var aviso = document.createElement("div");
      aviso.className = "slot__aviso";
      aviso.innerHTML = '<b>Aguardando material</b><span>' + arquivo + '</span>';
      slot.appendChild(aviso);
    }

    /* só o evento de erro decide — nunca um tempo limite.
       Em conexão lenta o arquivo existe e apenas demora;
       marcar como ausente por demora seria falso alarme. */
    midia.addEventListener("error", vazio, true);
    midia.querySelectorAll && midia.querySelectorAll("source").forEach(function(f){
      f.addEventListener("error", vazio);
    });

    if(midia.tagName === "IMG"){
      /* imagem com carregamento adiado só falha ao entrar na tela,
         então a verificação acompanha o scroll */
      if(midia.complete && midia.naturalWidth === 0) vazio();
      var vigia = new IntersectionObserver(function(ent){
        ent.forEach(function(e){
          if(!e.isIntersecting) return;
          if(midia.complete && midia.naturalWidth === 0) vazio();
          vigia.unobserve(midia);
        });
      }, { rootMargin:"200px" });
      vigia.observe(midia);
    }
  });

  /* ── palavras que acendem no scroll ── */
  var acendiveis = [];
  document.querySelectorAll("[data-acende]").forEach(function(el){
    var destaques = (el.getAttribute("data-destaque") || "").toLowerCase().split(",").map(function(x){ return x.trim(); });
    var palavras = [];
    el.textContent.trim().split(/\s+/).forEach(function(p){
      var s = document.createElement("span");
      var limpo = p.toLowerCase().replace(/[.,—:;!?]/g, "");
      s.className = "p" + (destaques.indexOf(limpo) > -1 ? " destaque" : "");
      s.textContent = p;
      el.appendChild(s);
      palavras.push(s);
    });
    el.removeChild(el.firstChild);
    acendiveis.push({ el: el, palavras: palavras });
  });

  /* ── loop de scroll ── */
  var capa = document.querySelector("[data-parallax]");
  var travado = false;

  function pinta(){
    var y = window.scrollY || window.pageYOffset;
    if(!reduz){
      if(capa){
        var ph = Math.min(1, y / window.innerHeight);
        capa.style.transform = "translate3d(0," + (ph * window.innerHeight * 0.26) + "px,0) scale(" + (1 + ph * 0.07) + ")";
      }
      acendiveis.forEach(function(a){
        var r = a.el.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (window.innerHeight * 0.82 - r.top) / (r.height * 0.85 || 1)));
        var corte = Math.floor(p * a.palavras.length);
        for(var i = 0; i < a.palavras.length; i++){ a.palavras[i].classList.toggle("on", i < corte); }
      });
    }
    travado = false;
  }

  function aoRolar(){ if(!travado){ travado = true; requestAnimationFrame(pinta); } }
  if(lenis) lenis.on("scroll", aoRolar);
  window.addEventListener("scroll", aoRolar, { passive:true });
  window.addEventListener("resize", aoRolar);
  pinta();
})();
