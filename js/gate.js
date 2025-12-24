// Audio handler - define first so it's accessible globally
const audio = document.getElementById("bgAudio");
const toggle = document.getElementById("audioToggle");
const AUDIO_STATE = "audio-muted";

// Restore mute state from localStorage on load
const isMuted = localStorage.getItem(AUDIO_STATE) === "true";
if(isMuted) {
  audio.muted = true;
  toggle.classList.add("muted");
  toggle.textContent = "🔇";
}

function playAudio(){
  // Browser autoplay policy: play only if user has interacted with page
  const playPromise = audio.play();
  if(playPromise !== undefined){
    playPromise.catch(err => {
      // Autoplay may be blocked; user will manually unmute
      console.log("Audio autoplay blocked, user can unmute manually");
    });
  }
}

toggle.addEventListener("click", function(){
  audio.muted = !audio.muted;
  localStorage.setItem(AUDIO_STATE, audio.muted ? "true" : "false");
  
  if(audio.muted){
    toggle.classList.add("muted");
    toggle.textContent = "🔇";
  } else {
    toggle.classList.remove("muted");
    toggle.textContent = "🔊";
    playAudio();
  }
});

// Allow audio to play after any user interaction
document.addEventListener("click", function(){
  if(!audio.muted && audio.paused){
    playAudio();
  }
}, { once: true });

// Gate/Password handler
(function(){
  const gate = document.getElementById("gate");
  const site = document.getElementById("site");
  const input = document.getElementById("pw");
  const btn = document.getElementById("enter");
  const msg = document.getElementById("msg");

  const PASSWORD = "yournickname"; // TODO: set to the private nickname
  const KEY = "access-granted";

  function unlock(){
    gate.classList.add("hidden");
    site.classList.remove("hidden");
    sessionStorage.setItem(KEY, "1");
    playAudio(); // Start playing music after unlock
  }

  function tryUnlock(value){
    const v = (value || "").trim();
    if(!v){ msg.textContent = ""; return; }
    if(v === PASSWORD){ unlock(); }
    else { msg.textContent = "That doesn’t feel right. Try again?"; }
  }

  if(sessionStorage.getItem(KEY) === "1"){
    unlock();
  }

  btn.addEventListener("click", function(){ tryUnlock(input.value); });
  input.addEventListener("keydown", function(e){ if(e.key === "Enter") { tryUnlock(input.value); } });

  const params = new URLSearchParams(window.location.search);
  const code = params.get("p");
  if(code){ tryUnlock(code); }
})();

// Adventure book page turns with cover and flip animation
(function(){
  const pages = [
    { type: "cover", cover: "assets/images/cover.jpg", title: "Our Adventure Book", subtitle: "(Inspired by UP)" },
    { photo: "assets/images/photo1.jpg", date: "01 Jan 2024", text: "asdasd" },
    { photo: "assets/images/photo2.jpg", date: "11 Jan 2024", text: "Write-up abasdadasdy." },
    { photo: "assets/images/photo3.jpg", date: "12 Jan 2024", text: "asdasdasd" }
  ];

  let index = 0; // current page index (cover is 0)
  const pageLeft = document.getElementById("pageLeft");
  const pageRight = document.getElementById("pageRight");
  const indicatorEl = document.getElementById("pageIndicator");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const spread = document.getElementById("spread");
  const viewport = document.getElementById("bookViewport");

  if(!pageLeft || !pageRight || !indicatorEl || !prevBtn || !nextBtn || !spread || !viewport) return;

  function renderPagePair(page){
    // Cover page: left blank, right cover
    if(page.type === "cover"){
      pageLeft.innerHTML = "";
      pageLeft.classList.remove("cover");
      pageRight.classList.add("cover");
      pageRight.innerHTML = `
        <div class="cover-img" style="background-image:url('${page.cover}')"></div>
        <div class="cover-title">${page.title || ""}</div>
        <div class="cover-sub">${page.subtitle || ""}</div>
      `;
      return;
    }

    // Normal page: left = photo/date, right = text
    pageLeft.classList.remove("cover");
    pageRight.classList.remove("cover");

    pageLeft.innerHTML = `
      <div class="photo-frame">
        <img src="${page.photo}" alt="Memory photo" />
      </div>
      <div class="photo-date">${page.date || ""}</div>
    `;

    pageRight.innerHTML = `
      <div class="page-doodles">✿ ✦ ✿</div>
      <div class="page-text">${page.text || ""}</div>
    `;
  }

  function render(){
    const current = pages[index];
    renderPagePair(current);
    indicatorEl.textContent = (index + 1) + " / " + pages.length;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pages.length - 1;
  }

  function turn(direction){
    const nextIndex = index + direction;
    if(nextIndex < 0 || nextIndex > pages.length - 1) return;
    index = nextIndex;
    spread.classList.remove("flip-left", "flip-right");
    void spread.offsetWidth;
    spread.classList.add(direction > 0 ? "flip-right" : "flip-left");
    render();
  }

  prevBtn.addEventListener("click", function(){ turn(-1); });
  nextBtn.addEventListener("click", function(){ turn(1); });

  // Touch swipe for mobile
  let startX = null;
  viewport.addEventListener("touchstart", function(e){
    if(!e.touches || !e.touches.length) return;
    startX = e.touches[0].clientX;
  });
  viewport.addEventListener("touchend", function(e){
    if(startX === null) return;
    const dx = (e.changedTouches && e.changedTouches[0].clientX) - startX;
    startX = null;
    if(Math.abs(dx) < 40) return;
    if(dx < 0) turn(1); else turn(-1);
  });

  render();
})();


