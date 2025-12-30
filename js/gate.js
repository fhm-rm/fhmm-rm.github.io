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
    { photo: "assets/images/10OCT2023.jpg", date: "10 Oct 2023", text: "So racist ^-^" },
    { photo: "assets/images/12OCT2023.jpg", date: "12 Oct 2023", text: "it was raining that day. For the first time you sat on my lap and I hugged you all in cafelystic :3 Very fond of this memory" },
    { photo: "assets/images/12.1OCT2023.jpg", date: "12 Oct 2023", text: "Mine 💖 I am willing to do everything to make you mine, My Precious" },
    { photo: "assets/images/18OCT2023.jpg", date: "18 Oct 2023", text: "2 Eepy Cats in a lazy after noon" },
    { photo: "assets/images/19OCT2023.jpg", date: "19 Oct 2023", text: "Waifuuuuuuuuuuuuuuuuuuuuuuuuuuu. Ma Sha Allah <3" },
    { photo: "assets/images/30OCT2023.jpg", date: "30 Oct 2023", text: "Yum Cha 🍜 Date!. One of the perfect date ever. You my Silly Goose🦢 you looked so good that day. So eleganto and classy. We went to emerald after that for coffee. Good Memory *-*" },
    { photo: "assets/images/3NOV2023.jpg", date: "3 Nov 2023", text: "'I've got my mind on you \n I got my mind on you \n Say yes to Heaven \n Say yes to me \n Say yes to Heaven \n Say yes to me \n I've got my eye on you \n I've got my eye on you, mm' \n Flancos, On this day. We were having coffee. Singing along, You were singing. I just loved seeing you" },
    { photo: "assets/images/10NOV2023.jpg", date: "10 Nov 2023", text: "On Winters Eve. It just started to get a bit chilly. We were holding onto each other in Madchef. I gave you some origami dinosaurs that day. It was a post called 'Someone teach me how to make origami dinosaurs so that I can impress her' " },
    { photo: "assets/images/17NOV2023.jpg", date: "17 Nov 2023", text: "Borgir in Chillox and Lucky Strike in Smoking Zone xD" },
    { photo: "assets/images/24NOV2023.jpg", date: "24 Nov 2023", text: "Had pasta for the first time together in Alfresco, Lets not talk about why I am wearing lipstick like a twink" },
    { photo: "assets/images/16DEC2023.jpg", date: "16 Dec 2023", text: "Cafe Mango Date. YOU LOOOOOOOOOOOKED SOOOOOOOOOO FIREEEEE 🔥🔥🔥 that day ON GOD. Had to call fireservice on my mind \n My fit was ass :3 It didnt match the vibe. You gave me gifts that day. My December 3 Sweater ^_^" },
    { photo: "assets/images/25DEC2023.jpg", date: "25 Dec 2023", text: "First Christmas Together🔔 \n You looked so elegantly beautiful that day :') Heart melted. We went to bookworm and got ourselves some books. Our first NorthEnd Coffee and Cinnamon roll together. It wasnt a perfect Christmas. I remember this cause I promised I will take you to more festive places next time." },
    { photo: "assets/images/27DEC2023.jpg", date: "27 Dec 2023", text: " I love you so much in this outfittttttt \n You loook soooooooo cuteeee 😭😭😭 \n OMG my heart. I melt. You look so happy. Went Cafelystic afterwards" },
    { photo: "assets/images/31DEC2023.jpg", date: "31 Dec 2023", text: "Year End Meeeeeeeeeeeet \n Fit wasnt fitting properly that day, Pinewood was shit \n Still we had a lot of adda over coffee and you gave me a cute notepad. We planed how we want our next year to be. Wrote it down. Wrote on each others notebook being honest partners. Good times. Happy New Year Babe. I love you. " },
    // { photo: "assets/images/", date: "", text: "" },
    // { photo: "assets/images/", date: "", text: "" },
    // { photo: "assets/images/", date: "", text: "" },
    // { photo: "assets/images/", date: "", text: "" },
    // { photo: "assets/images/", date: "", text: "" },
    // { photo: "assets/images/", date: "", text: "" },
    // { photo: "assets/images/", date: "", text: "" },
    // { photo: "assets/images/", date: "", text: "" },
    // { photo: "assets/images/", date: "", text: "" },
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
      <div class="page-text">${(page.text || "").replace(/\n/g, '<br>')}</div>
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


