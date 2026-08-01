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

  function initPremiumGallery(){
    var cards = document.querySelectorAll(".galeria--premium .gallery-card");
    if(!cards.length) return;

    if(window.gsap && window.ScrollTrigger){
      window.gsap.registerPlugin(window.ScrollTrigger);

      cards.forEach(function(card, index){
        window.gsap.fromTo(card, {
          opacity: 0,
          y: 42,
          scale: 0.94,
          filter: "blur(16px)"
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true
          },
          delay: index * 0.08
        });
      });
    }

    cards.forEach(function(card){
      var img = card.querySelector("img");
      if(!img) return;
      card.addEventListener("mousemove", function(e){
        if(reduz) return;
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "translate3d(0,0,0) rotateX(" + (-y * 4).toFixed(2) + "deg) rotateY(" + (x * 7).toFixed(2) + "deg)";
      });
      card.addEventListener("mouseleave", function(){
        card.style.transform = "";
      });
    });

    var viewer = document.getElementById("viewer");
    var viewerImg = viewer ? viewer.querySelector(".viewer__img") : null;
    var viewerClose = viewer ? viewer.querySelector(".viewer__close") : null;
    var openers = document.querySelectorAll(".gallery-open");

    function openViewer(src){
      if(!viewer || !viewerImg) return;
      viewerImg.src = src;
      viewer.classList.add("is-open");
      viewer.setAttribute("aria-hidden", "false");
    }
    function closeViewer(){
      if(!viewer) return;
      viewer.classList.remove("is-open");
      viewer.setAttribute("aria-hidden", "true");
    }

    openers.forEach(function(opener){
      opener.addEventListener("click", function(){
        openViewer(opener.dataset.full || opener.getAttribute("src"));
      });
    });

    if(viewerClose){ viewerClose.addEventListener("click", closeViewer); }
    if(viewer){ viewer.addEventListener("click", function(e){ if(e.target === viewer) closeViewer(); }); }
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeViewer(); });
  }

  initPremiumGallery();

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
