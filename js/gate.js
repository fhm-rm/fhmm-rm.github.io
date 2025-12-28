// Audio handler - define first so it's accessible globally
const audio = document.getElementById("bgAudio");
const toggle = document.getElementById("audioToggle");
const AUDIO_STATE = "audio-muted";

// Day counter from July 27, 2023 4 PM
function updateDayCount(){
  const startDate = new Date(2023, 6, 27, 16, 0, 0); // July 27, 2023 4 PM
  const now = new Date();
  const diff = now - startDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1; // +1 to include day 1
  const dayCountEl = document.getElementById("dayCount");
  if(dayCountEl) {
    dayCountEl.textContent = days;
  }
}

// Update on page load
updateDayCount();

// Schedule update every day at 4 PM
function scheduleNextUpdate(){
  const now = new Date();
  const next4PM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0);
  
  // If 4 PM has already passed today, schedule for tomorrow
  if(now > next4PM){
    next4PM.setDate(next4PM.getDate() + 1);
  }
  
  const timeUntilNext = next4PM - now;
  setTimeout(function(){
    updateDayCount();
    scheduleNextUpdate();
  }, timeUntilNext);
}

scheduleNextUpdate();

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

  const PASSWORD = "sillybird"; // TODO: set to the private nickname
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
    { photo: "assets/images/27JUL2023.jpg", date: "27 Jul 2023", text: "We met the first time on this day. It was raining earlier but the time we met there was no rain. We went to Glazed to have donuts and later coffee from 'Cafelystic'. I had to feed you xD hehe. I dropped you in Banasree and you gave me a hug. That changed everything. It felt like the picture. You felt like the picture." },
    { photo: "assets/images/1AUG2023.jpg", date: "1 Aug 2023", text: "This was the first time ever I came to the Uni inbetween my office to met you. I dropped you till Hatirjheel. The first time I held your hands. We dont have a picture but welp" },
    { photo: "assets/images/15AUG2023.jpg", date: "15 Aug 2023", text: "Our First Date! I asked you out on a date on 27 July, after a few days you said Yes *-*. What happened in the lift still gives me goosebumps till this day. It was kind of the start of the journey for me..." },
    { photo: "assets/images/20AUG2023.jpg", date: "20 Aug 2023", text: "Another date to Cafelystic. Became our favourite place. Probably the first time I saw you in Salwar Kamiz. I lost it totally. You looked so beautiful in that satin dress <3 My all time favourite outfit of yours" },
    { photo: "assets/images/24AUG2023.jpg", date: "24 Aug 2023", text: "First Chillox Date!!!!!! *-*, I did your nails that day. Very amateurly yes but it was fun." },
    { photo: "assets/images/31AUG2023.jpg", date: "31 Aug 2023 ", text: "First BFC Date. I remember this day very well in my memory ^-^ We went to a different BFC but there was no seating arrangement so in the end we ended up going Dhanmondi 19. This is one of my favourite picture of ours. You said 'Husbando' seeing this :3" },
    { photo: "assets/images/14SEP2023.jpg", date: "14 Sep 2023", text: "It was one of those calm soothing long date. We went to chillox first, then we went to Cafelystic. from 10 AM to 4.30AM we were together" },
    { photo: "assets/images/21SEP2023.jpg", date: "21 Sep 2023", text: "2 Calicos. Do you remember this day? It was raining. We strolled through Dhanmondi Lake. Befriended some cats. Went to Cafelystic (again), We even went to Moms and Kids shop *-*" },
    { photo: "assets/images/28SEP2023.jpg", date: "28 Sep 2023", text: "Cat Cafe Dateeeeeeeeeeeeeeeeeeeeeeeee.🐱 I cherish this day very fondly. Took a lot of pictures with you. You seemed genuinly happy that day seeing cats. I was too seeing you. You looked v v v v v v v v hot that day " },
    { photo: "assets/images/9OCT2023.jpg", date: "9 Oct 2023", text: "A Short Khanas de tour from Univeristy <3" },
    { photo: "assets/images/", date: "", text: "" },
    { photo: "assets/images/", date: "", text: "" },
    { photo: "assets/images/", date: "", text: "" },
    { photo: "assets/images/", date: "", text: "" },
    { photo: "assets/images/", date: "", text: "" },
    { photo: "assets/images/", date: "", text: "" },
    { photo: "assets/images/", date: "", text: "" },
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
    // Cover page: left blank, right cover (book closed) - image only, no text
    if(page.type === "cover"){
      pageLeft.innerHTML = "";
      pageLeft.classList.remove("cover");
      pageLeft.style.visibility = "hidden";
      pageRight.classList.add("cover");
      pageRight.style.visibility = "visible";
      pageRight.innerHTML = `
        <div class="cover-img" style="background-image:url('${page.cover}')"></div>
      `;
      return;
    }

    // Normal page: left = photo/date, right = text (book open)
    pageLeft.classList.remove("cover");
    pageRight.classList.remove("cover");
    pageLeft.style.visibility = "visible";
    pageRight.style.visibility = "visible";

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


