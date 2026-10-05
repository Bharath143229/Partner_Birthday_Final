/* ==========================================
   BIRTHDAY SURPRISE
   ========================================== */


/* ================= SETTINGS ================= */

/*
   Password:
   Partner
*/

const SECRET_PASSWORD = "partner";


/*
   Birthday:
   October 12, 2026

   Change the year later if necessary.
*/

const BIRTHDAY =
    new Date("October 12, 2026 00:00:00");


/* ================= WISH STORAGE ================= */

/* Paste your Google Apps Script Web App URL here.
   It must end with /exec */
const WISH_API_URL =
    "https://script.google.com/macros/s/AKfycbyRyiPVkOfqeuOB8vgj3742N2IRT6qjFUFOqWK75urhLCVcZccW9NkmfcCmDKW9dQC0sw/exec";



/* ================= SCREEN CONTROL ================= */

function showScreen(screenID) {

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(screen => {

        screen.classList.remove("active");

    });

    const target =
        document.getElementById(screenID);

    if (target) {

        target.classList.add("active");

        if (screenID === "cakeScreen") {
            initBirthdayCake();
        }

        if (screenID === "balloonScreen") {
            resetBalloonSurprise();
        }

        if (screenID !== "letterScreen") {
            cancelLetterReveal();
        }

        if (screenID === "envelopeScreen") {
            resetEnvelope();
        }

        if (screenID === "letterScreen") {
            startLetterSequence();
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


/* ================= ENVELOPE & GIFT ================= */

function openGift() {
    const button = document.getElementById("giftButton");
    const hint = document.getElementById("giftHint");
    const reveal = document.getElementById("giftReveal");

    if (!button || button.classList.contains("opened")) return;

    button.classList.add("opened");

    if (hint) {
        hint.textContent = "A little something, just for you... 💌";
    }

    if (reveal) {
        reveal.classList.add("show");
    }
}


/* ================= BALLOON SURPRISE ================= */

const balloonMessages = [
    "You are one of the most special people in my life. ❤️",
    "I hope you always have countless reasons to smile. 😊",
    "Some memories become precious simply because they are shared with you. ✨",
    "I hope we get to create many more beautiful memories together someday. 🫶",
    "This little surprise took time, but making it for you was worth every minute. ❤️",
    "No matter how much time passes, I hope you always remember how special you are. 🎂❤️"
];


let openedBalloons = 0;
let balloonTypingTimer = null;

function typeBalloonMessage(text, element) {
    if (!element) return;
    clearInterval(balloonTypingTimer);
    element.textContent = "";
    let i = 0;
    balloonTypingTimer = setInterval(() => {
        element.textContent += text.charAt(i++);
        if (i >= text.length) clearInterval(balloonTypingTimer);
    }, 24);
}

function openBalloon(index) {
    const balloons = document.querySelectorAll(".surprise-balloon");
    const balloon = balloons[index];
    const messageBox = document.getElementById("balloonMessage");
    const progress = document.getElementById("balloonProgress");
    const continueButton = document.getElementById("balloonContinueButton");

    if (!balloon || balloon.classList.contains("popped")) return;

    balloon.classList.add("popped");
    openedBalloons += 1;

    createHeartBurst();
    createBalloonSparkles(balloon);

    if (messageBox) {
        messageBox.classList.remove("message-pop");
        void messageBox.offsetWidth;
        messageBox.innerHTML = `
            <span class="balloon-message-icon">💗</span>
            <p id="activeBalloonMessage"></p>
        `;
        messageBox.classList.add("message-pop");
        typeBalloonMessage(balloonMessages[index], document.getElementById("activeBalloonMessage"));
    }


    if (progress) {
        progress.textContent = `${openedBalloons} / ${balloons.length} surprises opened`;
    }

    if (openedBalloons === balloons.length && continueButton) {
        setTimeout(() => {
            continueButton.classList.add("show");
            continueButton.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 800);
    }
}

function createBalloonSparkles(balloon) {
    const rect = balloon.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
        const spark = document.createElement("span");
        spark.className = "balloon-spark";
        spark.textContent = i % 2 ? "✦" : "♥";
        spark.style.left = `${rect.left + rect.width / 2}px`;
        spark.style.top = `${rect.top + rect.height / 3}px`;
        spark.style.setProperty("--sx", `${(Math.random() - .5) * 150}px`);
        spark.style.setProperty("--sy", `${(Math.random() - .5) * 130}px`);
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 850);
    }
}

function resetBalloonSurprise() {
    openedBalloons = 0;
    clearInterval(balloonTypingTimer);

    document.querySelectorAll(".surprise-balloon").forEach(balloon => {
        balloon.classList.remove("popped");
    });

    const progress = document.getElementById("balloonProgress");
    if (progress) progress.textContent = "0 / 6 surprises opened";

    const messageBox = document.getElementById("balloonMessage");
    if (messageBox) {
        messageBox.classList.remove("message-pop");
        messageBox.innerHTML = `
            <span class="balloon-message-icon">✨</span>
            <p>Pick a balloon... one of them might make you smile. ❤️</p>
        `;
    }


    const continueButton = document.getElementById("balloonContinueButton");
    if (continueButton) continueButton.classList.remove("show");
}

function replaySurprise() {
    window.location.reload();
}


/* =====================================================
   SINGLE-TAP TOUCH SUPPORT
   Some mobile browsers delay/suppress the normal click
   event after a touch. Trigger the button action once on
   pointerdown and suppress the duplicate native click.
   ===================================================== */
(function enableSingleTapSupport() {
    let suppressNextClick = false;

    document.addEventListener("pointerdown", function (event) {
        if (event.pointerType !== "touch" && event.pointerType !== "pen") {
            return;
        }

        const button = event.target.closest("button");
        if (!button || button.disabled) return;

        if (button.dataset.singleTapHandled === "1") return;

        button.dataset.singleTapHandled = "1";

        // Run the existing onclick/event-listener logic immediately.
        // Set the suppression flag only AFTER this synthetic click so
        // that the synthetic click itself is not blocked.
        button.click();
        suppressNextClick = true;

        window.setTimeout(() => {
            delete button.dataset.singleTapHandled;
        }, 700);

        window.setTimeout(() => {
            suppressNextClick = false;
        }, 700);
    }, { passive: true });

    document.addEventListener("click", function (event) {
        if (!suppressNextClick) return;

        const button = event.target.closest("button");
        if (!button) return;

        // Ignore the delayed browser-generated click after our
        // single-tap action has already run.
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);
})();

/* ================= PASSWORD ================= */

function checkPassword() {

    const input =
        document
        .getElementById("passwordInput")
        .value
        .trim()
        .toLowerCase();

    const error =
        document.getElementById("passwordError");


    if (input === SECRET_PASSWORD) {

        error.innerText = "";

        showScreen("countdownScreen");

        createHeartBurst();

    } else {

        error.innerText =
            "Hmm... think about what I always call you. 😏";

        shakePassword();

    }
}


function shakePassword() {

    const input =
        document.getElementById("passwordInput");

    input.animate(
        [
            { transform: "translateX(-8px)" },
            { transform: "translateX(8px)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(0)" }
        ],
        {
            duration: 400
        }
    );
}


/* ================= COUNTDOWN ================= */

function updateCountdown() {

    const now =
        new Date().getTime();

    const target =
        BIRTHDAY.getTime();

    let difference =
        target - now;


    if (difference <= 0) {

        difference = 0;
    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (difference /
            (1000 * 60 * 60)) % 24
        );


    const minutes =
        Math.floor(
            (difference /
            (1000 * 60)) % 60
        );


    const seconds =
        Math.floor(
            (difference / 1000) % 60
        );


    document.getElementById("days")
        .innerText =
        String(days).padStart(2, "0");


    document.getElementById("hours")
        .innerText =
        String(hours).padStart(2, "0");


    document.getElementById("minutes")
        .innerText =
        String(minutes).padStart(2, "0");


    document.getElementById("seconds")
        .innerText =
        String(seconds).padStart(2, "0");
}


setInterval(updateCountdown, 1000);

updateCountdown();


/* ================= MUSIC ================= */

const music =
    document.getElementById("birthdayMusic");

const musicButton =
    document.getElementById("musicButton");


function startMusic() {

    music.volume = 0.45;

    music.play()
        .then(() => {

            musicButton.innerText =
                "🔊 Music On";

        })
        .catch(() => {

            musicButton.innerText =
                "🎵 Tap Music";

        });
}


function toggleMusic() {

    if (music.paused) {

        music.play();

        musicButton.innerText =
            "🔊 Music On";

    } else {

        music.pause();

        musicButton.innerText =
            "🔇 Music Off";
    }
}


/* ================= HEARTS ================= */

function createHeart() {

    const heart =
        document.createElement("div");

    heart.className =
        "floating-heart";

    const symbols = [
        "❤️",
        "💕",
        "💗",
        "💖",
        "🌸",
        "✨"
    ];

    heart.innerText =
        symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ];

    heart.style.left =
        Math.random() * 100 + "vw";

    heart.style.fontSize =
        (15 + Math.random() * 20) + "px";

    heart.style.animationDuration =
        (4 + Math.random() * 4) + "s";

    document.body.appendChild(heart);


    setTimeout(() => {

        heart.remove();

    }, 8000);
}


setInterval(createHeart, 700);


/* Add floating-heart CSS dynamically */

const floatingCSS = document.createElement("style");

floatingCSS.innerHTML = `

.floating-heart {

    position: fixed;

    bottom: -40px;

    z-index: 999;

    pointer-events: none;

    animation:
        floatingUp linear forwards;

}

@keyframes floatingUp {

    from {

        transform:
            translateY(0)
            rotate(0deg);

        opacity: 1;
    }

    to {

        transform:
            translateY(-110vh)
            rotate(360deg);

        opacity: 0;
    }
}

`;

document.head.appendChild(floatingCSS);


/* ================= HEART BURST ================= */

function createHeartBurst() {

    for (let i = 0; i < 20; i++) {

        setTimeout(() => {

            createHeart();

        }, i * 100);
    }
}


/* ================= MEMORY SLIDESHOW ================= */

const memoryPhotos = [
    "photos/photo01.jpg",
    "photos/photo02.jpg",
    "photos/photo03.jpg",
    "photos/photo04.jpg",
    "photos/photo05.jpg",
    "photos/photo06.jpg",
    "photos/photo07.jpg",
    "photos/photo08.jpg",
    "photos/photo09.jpg",
    "photos/photo10.jpg"
];

const memoryQuotes = [
    "Some smiles are impossible to forget. ❤️",
    "Some moments become beautiful memories without even trying.",
    "Years may pass, but certain memories never really grow old.",
    "Some people make ordinary moments feel a little more special.",
    "Your smile has a way of making simple moments memorable.",
    "The smallest moments can become the ones we remember most.",
    "Some memories need no words; they simply stay in the heart.",
    "Life keeps moving, but beautiful moments stay with us.",
    "Keep smiling. Some smiles are worth remembering forever.",
    "And after all these little moments, one thing remains — you are special. ❤️"
];

let currentMemory = 0;
const memoryImage = document.getElementById("memoryImage");
const memoryQuote = document.getElementById("memoryQuote");
const memoryNumber = document.getElementById("memoryNumber");
const memoryProgress = document.getElementById("memoryProgress");
const nextMemoryButton = document.getElementById("nextMemoryButton");

function updateMemory(index, animate = true) {

    if (!memoryImage || !memoryQuote) return;

    const change = () => {
        memoryImage.src = memoryPhotos[index];
        memoryImage.alt = `Prasanna memory ${index + 1}`;
        memoryQuote.textContent = memoryQuotes[index];
        memoryNumber.textContent = String(index + 1).padStart(2, "0");
        memoryProgress.style.width = `${((index + 1) / memoryPhotos.length) * 100}%`;
    };

    if (!animate) {
        change();
        return;
    }

    memoryImage.classList.add("memory-fade-out");
    memoryQuote.classList.add("memory-quote-out");

    setTimeout(() => {
        change();
        memoryImage.classList.remove("memory-fade-out");
        memoryQuote.classList.remove("memory-quote-out");
    }, 450);
}

if (nextMemoryButton) {
    nextMemoryButton.addEventListener("click", () => {
        if (currentMemory < memoryPhotos.length - 1) {
            currentMemory++;
            updateMemory(currentMemory);
        } else {
            showScreen("cakeScreen");
        }
    });
}

updateMemory(0, false);




/* ================= WISH ================= */

async function makeWish() {

    const input = document.getElementById("wishInput");
    const button = document.querySelector('#wishScreen button');
    const wish = input.value.trim();

    if (!wish) {
        alert("Make your wish first... ✨");
        return;
    }

    if (wish.length > 500) {
        alert("Your wish is too long. Please keep it under 500 characters.");
        return;
    }

    if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
    }

    let saved = false;

    if (!WISH_API_URL.includes("PASTE_YOUR")) {
        try {
            await fetch(WISH_API_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({ wish })
            });
            saved = true;
        } catch (error) {
            console.error("Wish save error:", error);
        }
    }

    document.getElementById("wishText").innerText =
        saved
            ? "Your wish has been made. ✨"
            : "Your wish has been made. ✨";

    input.value = "";

    if (button) {
        button.disabled = false;
        button.textContent = "Make My Wish ✨";
    }

    showScreen("fireworksScreen");
    launchFireworks();
}


/* ================= DOWNLOAD GREETING ================= */

function downloadGreetingFile() {

    const greeting = `Dear Partner,

Happy Birthday, Prasanna. ❤️🎂

I honestly don't know how to put everything I feel into words, but on your special day, I still wanted to try and write something from my heart.

We've known each other since our school days, and somehow, even after all these years, you're still someone very special to me.

Life changed, time passed, and we ended up far away from those school days… but some connections don't disappear just because time passes.

We've shared so many conversations, memories, laughs, and little moments over the years. Even though we still haven't been able to meet after all this time, I'm genuinely grateful that you're still a part of my life.

I've always wanted to hear your voice, have a real conversation with you, and finally meet you after all these years. I really hope that day comes soon. ❤️

I don't know what the future holds, but I hope we continue to create more beautiful memories, have more conversations, and finally get that chance to meet someday.

I hope this new year of your life brings you countless reasons to smile, beautiful memories, good health, success, and everything you've been wishing for.

Stay the same wonderful person you are.

Happy Birthday once again, Partner. ❤️🎂

— From your Partner ❤️`;

    try {
        const blob = new Blob(["\uFEFF", greeting], {
            type: "text/plain;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "Birthday_Greeting_Prasanna.txt";
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            link.remove();
            URL.revokeObjectURL(url);
        }, 1000);

        const status = document.getElementById("downloadStatus");

        if (status) {
            status.textContent = "Greeting downloaded ❤️";
        }

    } catch (error) {
        console.error("Greeting download error:", error);

        const status = document.getElementById("downloadStatus");

        if (status) {
            status.textContent = "Download failed. Please try again.";
        }
    }
}

/* ================= FIREWORKS ================= */


const canvas =
    document.getElementById(
        "fireworksCanvas"
    );

const ctx =
    canvas.getContext("2d");

let fireworks = [];

let particles = [];


function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;
}


window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


/* ================= FIREWORK CLASS ================= */

class Firework {

    constructor(
        startX,
        startY,
        targetX,
        targetY
    ) {

        this.x = startX;

        this.y = startY;

        this.targetX = targetX;

        this.targetY = targetY;

        this.speed = 7;

        this.angle =
            Math.atan2(
                targetY - startY,
                targetX - startX
            );

        this.distance =
            Math.hypot(
                targetX - startX,
                targetY - startY
            );

        this.travelled = 0;

        this.trail = [];
    }


    update() {

        this.trail.push({
            x: this.x,
            y: this.y
        });


        if (this.trail.length > 8) {

            this.trail.shift();
        }


        this.x +=
            Math.cos(this.angle) *
            this.speed;

        this.y +=
            Math.sin(this.angle) *
            this.speed;


        this.travelled +=
            this.speed;


        if (
            this.travelled >=
            this.distance
        ) {

            explode(
                this.targetX,
                this.targetY
            );

            return false;
        }


        return true;
    }


    draw() {

        ctx.beginPath();

        ctx.moveTo(
            this.x,
            this.y
        );

        ctx.lineTo(
            this.x -
            Math.cos(this.angle) * 15,
            this.y -
            Math.sin(this.angle) * 15
        );

        ctx.strokeStyle =
            "rgba(255,220,180,.9)";

        ctx.lineWidth = 2;

        ctx.stroke();
    }
}


/* ================= PARTICLES ================= */

class Particle {

    constructor(
        x,
        y,
        angle,
        speed
    ) {

        this.x = x;

        this.y = y;

        this.angle = angle;

        this.speed = speed;

        this.life = 1;

        this.gravity = 0.035;

        this.friction = 0.985;

        this.size =
            Math.random() * 2.5 + 1;
    }


    update() {

        this.speed *=
            this.friction;


        this.x +=
            Math.cos(this.angle) *
            this.speed;


        this.y +=
            Math.sin(this.angle) *
            this.speed;


        this.speed *=
            this.friction;


        this.y +=
            this.gravity;


        this.life -= 0.012;


        return this.life > 0;
    }


    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,${150 + Math.random()*80},${190 + Math.random()*60},${this.life})`;

        ctx.fill();
    }
}


/* ================= EXPLOSION ================= */

function explode(x, y) {

    const particleCount = 90;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            Math.random() * 6 + 2;


        particles.push(
            new Particle(
                x,
                y,
                angle,
                speed
            )
        );
    }
}


/* ================= FIREWORK LOOP ================= */

function fireworkLoop() {

    ctx.fillStyle =
        "rgba(2,0,8,.18)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    fireworks =
        fireworks.filter(
            firework => {

                const alive =
                    firework.update();

                firework.draw();

                return alive;
            }
        );


    particles =
        particles.filter(
            particle => {

                const alive =
                    particle.update();

                particle.draw();

                return alive;
            }
        );


    requestAnimationFrame(
        fireworkLoop
    );
}


fireworkLoop();


/* ================= LAUNCH ================= */

function launchFireworks() {

    /*
       First burst
    */

    createFirework();


    /*
       Multiple realistic-looking
       bursts at different positions.
    */

    const interval =
        setInterval(
            createFirework,
            750
        );


    setTimeout(
        () => clearInterval(interval),
        12000
    );
}


function createFirework() {

    const startX =
        Math.random() *
        canvas.width;


    const targetX =
        80 +
        Math.random() *
        (canvas.width - 160);


    const targetY =
        100 +
        Math.random() *
        (canvas.height * .45);


    fireworks.push(
        new Firework(
            startX,
            canvas.height + 10,
            targetX,
            targetY
        )
    );
}


/* ================= BIRTHDAY EFFECT ================= */

document.addEventListener(
    "click",
    function(event) {

        /*
           Small sparkle burst around
           buttons.
        */

        if (
            event.target.tagName ===
            "BUTTON"
        ) {

            for (
                let i = 0;
                i < 5;
                i++
            ) {

                createHeart();
            }
        }

    }
);


/* =====================================================================
   BIRTHDAY CAKE — SINGLE AUTHORITATIVE IMPLEMENTATION
   Pure HTML/CSS cake. States:
   idle -> candles-lit -> candles-blowing -> candles-blown ->
   ready-to-cut -> cutting -> cut -> complete
   ===================================================================== */

const CAKE_CANDLE_COUNT = 22;
const CAKE_ART_LEFT = 20;   /* art offset inside the stage */
const CAKE_ART_TOP = 90;

let cakeState = "idle";
let cakeTimers = [];

function cakeSetState(state) {
    cakeState = state;
    const stage = document.getElementById("cakeStage");
    if (stage) stage.dataset.state = state;
}

function cakeLater(fn, ms) {
    const id = setTimeout(() => {
        cakeTimers = cakeTimers.filter(t => t !== id);
        fn();
    }, ms);
    cakeTimers.push(id);
    return id;
}

function cakeClearTimers() {
    cakeTimers.forEach(clearTimeout);
    cakeTimers = [];
}

function cakeRand(min, max) {
    return min + Math.random() * (max - min);
}

/* ---------- build decorations once ---------- */

function buildCakeDecor() {
    const holder = document.getElementById("candleHolder");
    const orn = document.getElementById("cakeOrnaments");
    if (!holder || !orn || holder.dataset.built === "1") return;

    holder.innerHTML = "";
    orn.innerHTML = "";

    const CX = 170;
    const add = (parent, cls, css, text) => {
        const el = document.createElement("span");
        el.className = cls;
        Object.assign(el.style, css);
        if (text) el.textContent = text;
        parent.appendChild(el);
        return el;
    };

    /* 22 candles — two staggered arcs on the top-tier surface */
    const rx = 104, ry = 8, baseCy = 95, candleH = 36;
    for (let i = 0; i < CAKE_CANDLE_COUNT; i++) {
        const dx = -rx + (i * 2 * rx) / (CAKE_CANDLE_COUNT - 1);
        const side = i % 2 === 0 ? -1 : 1;
        const dy = side * ry * Math.sqrt(Math.max(0, 1 - (dx / rx) * (dx / rx)));
        const baseY = baseCy + dy + 4;
        const candle = document.createElement("div");
        candle.className = "candle";
        candle.dataset.x = String(CX + dx);
        candle.dataset.y = String(baseY);
        candle.style.left = `${CX + dx}px`;
        candle.style.top = `${baseY - candleH}px`;
        candle.style.zIndex = String(10 + Math.round(baseY));
        const flame = document.createElement("div");
        flame.className = "flame";
        flame.style.setProperty("--fd", `${(0.85 + Math.random() * 0.6).toFixed(2)}s`);
        flame.style.setProperty("--fdl", `${(-Math.random() * 1.2).toFixed(2)}s`);
        candle.appendChild(flame);
        holder.appendChild(candle);
    }

    /* drips under the top-tier rim */
    const upDrips = [[-91, 24, 12], [-65, 34, 13], [-39, 20, 12], [-13, 30, 14], [13, 22, 12], [39, 36, 13], [65, 26, 12], [91, 32, 13]];
    upDrips.forEach(([dx, h, w]) => {
        const y = 95 + 18 * Math.sqrt(1 - (dx / 115) * (dx / 115));
        add(orn, "drip up", { left: `${CX + dx - w / 2}px`, top: `${y - 2}px`, width: `${w}px`, height: `${h}px` });
    });

    /* drips under the lower-tier rim (kept clear of the 22) */
    const lowDrips = [[-127, 24, 13], [-104, 32, 12], [-81, 20, 13], [-58, 28, 12], [58, 26, 12], [81, 34, 13], [104, 22, 12], [127, 30, 13]];
    lowDrips.forEach(([dx, h, w]) => {
        const y = 170 + 22 * Math.sqrt(1 - (dx / 150) * (dx / 150));
        add(orn, "drip low", { left: `${CX + dx - w / 2}px`, top: `${y - 2}px`, width: `${w}px`, height: `${h}px` });
    });

    /* cream rosettes along both rims */
    for (let dx = -104; dx <= 104; dx += 26) {
        const y = 95 + 18 * Math.sqrt(1 - (dx / 115) * (dx / 115));
        add(orn, "rosette", { left: `${CX + dx - 6.5}px`, top: `${y - 6.5}px`, width: "13px", height: "13px" });
    }
    for (let dx = -138; dx <= 138; dx += 23) {
        const y = 170 + 22 * Math.sqrt(1 - (dx / 150) * (dx / 150));
        add(orn, "rosette", { left: `${CX + dx - 8}px`, top: `${y - 8}px`, width: "16px", height: "16px" });
    }

    /* pearl border at the base */
    for (let dx = -140; dx <= 140; dx += 10) {
        const y = 268 + 22 * Math.sqrt(1 - (dx / 150) * (dx / 150)) - 7;
        add(orn, "pearl", { left: `${CX + dx - 2.5}px`, top: `${y}px` });
    }

    /* flowers and hearts */
    [[-120, 236], [120, 236], [-80, 152], [80, 152]].forEach(([dx, y]) => {
        const f = document.createElement("span");
        f.className = "flower";
        f.style.left = `${CX + dx - 11}px`;
        f.style.top = `${y - 11}px`;
        for (let i = 0; i < 5; i++) f.appendChild(document.createElement("i"));
        orn.appendChild(f);
    });
    [[-48, 134], [48, 134], [-76, 242], [76, 242], [-100, 262], [100, 262]].forEach(([dx, y]) => {
        add(orn, "heart-orn", { left: `${CX + dx}px`, top: `${y}px` }, "♥");
    });

    holder.dataset.built = "1";
}

/* ---------- reset (runs every time the cake screen opens) ---------- */

function resetCakeState() {
    cakeClearTimers();

    const stage = document.getElementById("cakeStage");
    const slot = document.getElementById("cakeArtSlot");
    const whole = document.getElementById("birthdayCake");
    const knife = document.getElementById("cakeKnife");
    const line = document.getElementById("cakeCutLine");
    const smoke = document.getElementById("cakeSmokeLayer");
    const fx = document.getElementById("cakeCutGlow");
    const blow = document.getElementById("wishBlowButton");
    const cut = document.getElementById("cutCakeButton");
    const cont = document.getElementById("cakeContinueButton");
    const status = document.getElementById("cakeStatus");

    if (slot) {
        slot.classList.remove("shake", "impact");
        slot.querySelectorAll(".cake-half").forEach(h => h.remove());
    }
    if (whole) whole.classList.remove("is-hidden");
    if (stage) stage.classList.remove("is-blown");

    document.querySelectorAll("#candleHolder .candle").forEach(c => c.classList.remove("out"));

    if (knife) knife.classList.remove("go", "out");
    if (line) line.classList.remove("go", "fade");
    if (smoke) smoke.innerHTML = "";
    if (fx) fx.innerHTML = "";

    if (blow) { blow.hidden = false; blow.disabled = false; }
    if (cut) { cut.hidden = true; cut.disabled = false; }
    if (cont) { cont.hidden = true; cont.disabled = false; }
    if (status) status.textContent = "Make a wish, then blow out all 22 candles. ✨";

    cakeSetState("candles-lit");
}

function initBirthdayCake() {
    cakeSetState("idle");
    buildCakeDecor();
    resetCakeState();
}

/* ---------- blow the candles ---------- */

function cakeSpawnSmoke(candle, delaySec) {
    const layer = document.getElementById("cakeSmokeLayer");
    if (!layer) return;
    const x = CAKE_ART_LEFT + parseFloat(candle.dataset.x);
    const y = CAKE_ART_TOP + parseFloat(candle.dataset.y) - 36 - 14;
    for (let n = 0; n < 2; n++) {
        const puff = document.createElement("span");
        puff.className = "smoke-wisp";
        puff.style.left = `${x - 6 + cakeRand(-2, 2)}px`;
        puff.style.top = `${y + n * 4}px`;
        puff.style.setProperty("--sx", `${cakeRand(-14, 14).toFixed(1)}px`);
        puff.style.setProperty("--sd", `${(delaySec + n * 0.18).toFixed(2)}s`);
        layer.appendChild(puff);
    }
}

function blowCandles() {
    if (cakeState !== "candles-lit") return;          /* cannot blow twice */
    cakeSetState("candles-blowing");

    const blow = document.getElementById("wishBlowButton");
    const cut = document.getElementById("cutCakeButton");
    const stage = document.getElementById("cakeStage");
    const status = document.getElementById("cakeStatus");

    if (blow) { blow.disabled = true; }
    if (status) status.textContent = "Make your wish... 💫";

    const candles = [...document.querySelectorAll("#candleHolder .candle")];
    let lastDelay = 0;

    candles.forEach((candle, i) => {
        /* sweep across the cake with a little natural jitter */
        const delay = Math.round(i * 22 + cakeRand(0, 120));
        lastDelay = Math.max(lastDelay, delay);
        cakeLater(() => {
            candle.classList.add("out");
            cakeSpawnSmoke(candle, 0);
        }, delay);
    });

    cakeLater(() => { if (stage) stage.classList.add("is-blown"); }, 250);

    cakeLater(() => {
        if (blow) blow.hidden = true;
        if (status) status.textContent = "Your wish has been made. ❤️ Now let's cut the cake!";
        cakeSetState("candles-blown");
    }, lastDelay + 600);

    /* reveal the cut button only after smoke and flames are finished */
    cakeLater(() => {
        if (cut) { cut.hidden = false; cut.disabled = false; }
        cakeSetState("ready-to-cut");
    }, lastDelay + 1500);
}

/* ---------- cut the cake ---------- */

function cakeCrumb(x, y, burst) {
    const layer = document.getElementById("cakeCutGlow");
    if (!layer) return;
    const crumb = document.createElement("span");
    const sparkle = Math.random() < 0.28;
    if (sparkle) {
        crumb.className = "cake-spark";
        crumb.textContent = "✦";
    } else {
        crumb.className = "cake-crumb";
        const size = cakeRand(3, 6);
        crumb.style.width = `${size}px`;
        crumb.style.height = `${size}px`;
        crumb.style.background = ["#ffd2e3", "#ff9fc4", "#fff1d6", "#ffe3a3"][Math.floor(Math.random() * 4)];
    }
    crumb.style.left = `${x}px`;
    crumb.style.top = `${y}px`;
    const spread = burst ? 70 : 34;
    const dx = cakeRand(-spread, spread);
    crumb.style.setProperty("--dx", `${dx.toFixed(1)}px`);
    crumb.style.setProperty("--uy", `${(-cakeRand(burst ? 20 : 6, burst ? 46 : 18)).toFixed(1)}px`);
    crumb.style.setProperty("--dy", `${cakeRand(24, 58).toFixed(1)}px`);
    crumb.style.setProperty("--rot", `${cakeRand(-200, 200).toFixed(0)}deg`);
    layer.appendChild(crumb);
    setTimeout(() => crumb.remove(), 1100);
}

function cakeSplitIntoHalves() {
    const slot = document.getElementById("cakeArtSlot");
    const whole = document.getElementById("birthdayCake");
    if (!slot || !whole) return;

    const makeHalf = side => {
        const half = document.createElement("div");
        half.className = `cake-half ${side}`;
        half.setAttribute("aria-hidden", "true");
        const copy = whole.cloneNode(true);
        copy.removeAttribute("id");
        copy.querySelectorAll("[id]").forEach(n => n.removeAttribute("id"));
        const face = document.createElement("div");
        face.className = "cut-face";
        copy.appendChild(face);
        half.appendChild(copy);
        slot.appendChild(half);
        return half;
    };

    const left = makeHalf("left");
    const right = makeHalf("right");
    whole.classList.add("is-hidden");

    void slot.offsetWidth;                          /* commit start positions */
    left.classList.add("split");
    right.classList.add("split");
}

function cutCake() {
    if (cakeState !== "ready-to-cut") return;       /* cannot cut early or twice */
    cakeSetState("cutting");

    const cut = document.getElementById("cutCakeButton");
    const slot = document.getElementById("cakeArtSlot");
    const knife = document.getElementById("cakeKnife");
    const line = document.getElementById("cakeCutLine");
    const status = document.getElementById("cakeStatus");
    const cont = document.getElementById("cakeContinueButton");

    if (cut) { cut.disabled = true; cut.hidden = true; }
    if (status) status.textContent = "Cutting the cake... 🔪";

    /* 1) slight shake */
    if (slot) { slot.classList.remove("shake"); void slot.offsetWidth; slot.classList.add("shake"); }

    /* 2) knife appears above the cake and moves down through the centre */
    cakeLater(() => {
        if (knife) { knife.classList.remove("out"); void knife.offsetWidth; knife.classList.add("go"); }
        if (line) { void line.offsetWidth; line.classList.add("go"); }

        /* crumbs follow the tip once it reaches the cake */
        const steps = 12;
        for (let s = 0; s < steps; s++) {
            const t = 0.24 + (0.76 * s) / (steps - 1);
            const y = 100 + 280 * t;
            cakeLater(() => {
                cakeCrumb(190 + cakeRand(-4, 4), y, false);
                cakeCrumb(190 + cakeRand(-4, 4), y, false);
            }, Math.round(t * 1100));
        }
    }, 480);

    /* 3) impact at the bottom */
    cakeLater(() => {
        if (slot) { slot.classList.remove("shake"); void slot.offsetWidth; slot.classList.add("impact"); }
        for (let i = 0; i < 14; i++) cakeCrumb(190 + cakeRand(-6, 6), 372, true);
    }, 480 + 1100);

    /* 4) the cake separates */
    cakeLater(() => {
        cakeSplitIntoHalves();
        if (knife) { knife.classList.remove("go"); void knife.offsetWidth; knife.classList.add("out"); }
        if (line) { line.classList.remove("go"); void line.offsetWidth; line.classList.add("fade"); }
    }, 480 + 1100 + 200);

    /* 5) split finished */
    cakeLater(() => {
        cakeSetState("cut");
        if (status) status.textContent = "❤️ Cake cut successfully!";
    }, 480 + 1100 + 200 + 1100);

    /* 6) only now does Continue appear */
    cakeLater(() => {
        if (cont) { cont.hidden = false; cont.disabled = false; }
        cakeSetState("complete");
    }, 480 + 1100 + 200 + 1100 + 600);
}

function cakeContinue() {
    if (cakeState !== "complete") return;           /* cannot continue early */
    showScreen("envelopeScreen");
}

(function wireCakeButtons() {
    const bind = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", fn);
    };
    bind("wishBlowButton", blowCandles);
    bind("cutCakeButton", cutCake);
    bind("cakeContinueButton", cakeContinue);
})();


/* =====================================================================
   ENVELOPE — opens with one tap, paper rises, then the letter screen
   ===================================================================== */

let envelopeState = "closed";            /* closed | opening | opened */
let envelopeTimers = [];

function envelopeLater(fn, ms) {
    const id = setTimeout(fn, ms);
    envelopeTimers.push(id);
}

function resetEnvelope() {
    envelopeTimers.forEach(clearTimeout);
    envelopeTimers = [];
    envelopeState = "closed";

    const button = document.getElementById("envelopeButton");
    const screen = document.getElementById("envelopeScreen");
    const hint = document.getElementById("envelopeHint");

    if (button) button.classList.remove("is-settling", "is-open", "paper-out", "is-leaving");
    if (screen) screen.classList.remove("env-busy");
    if (hint) hint.textContent = "Tap the envelope to open it ✨";
}

function openEnvelope() {
    if (envelopeState !== "closed") return;          /* one tap only */
    envelopeState = "opening";

    const button = document.getElementById("envelopeButton");
    const screen = document.getElementById("envelopeScreen");
    const hint = document.getElementById("envelopeHint");
    if (!button) return;

    if (screen) screen.classList.add("env-busy");
    if (hint) hint.textContent = "Opening your little letter... 💌";

    button.classList.add("is-settling");                          /* envelope settles   */
    envelopeLater(() => button.classList.add("is-open"), 350);     /* flap opens         */
    envelopeLater(() => button.classList.add("paper-out"), 1100);  /* paper rises        */
    envelopeLater(() => button.classList.add("is-leaving"), 2300); /* envelope fades     */
    envelopeLater(() => {
        envelopeState = "opened";
        showScreen("letterScreen");
    }, 2800);
}


/* =====================================================================
   LETTER — progressive line-by-line reveal (wording is never changed)
   ===================================================================== */

let letterBuilt = false;
let letterChunks = [];
let letterTimers = [];

function letterLater(fn, ms) {
    letterTimers.push(setTimeout(fn, ms));
}

function cancelLetterReveal() {
    letterTimers.forEach(clearTimeout);
    letterTimers = [];
}

/* Split each existing paragraph on its original source line breaks and wrap
   words in spans. The text content itself is untouched. */
function buildLetterChunks() {
    if (letterBuilt) return;
    const letter = document.querySelector("#letterScreen .letter");
    if (!letter) return;

    letter.querySelectorAll(".letter-title, p, .signature").forEach((block, blockIndex) => {
        const single = block.classList.contains("letter-title") || block.classList.contains("signature");
        const raw = block.textContent;
        const lines = single
            ? [raw.replace(/\s+/g, " ").trim()]
            : raw.split("\n").map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean);

        block.textContent = "";

        lines.forEach((line, li) => {
            const chunk = document.createElement("span");
            chunk.className = "lr-chunk";
            const words = line.split(" ");
            words.forEach((word, wi) => {
                const w = document.createElement("span");
                w.className = "lr-w";
                w.textContent = word;
                chunk.appendChild(w);
                if (wi < words.length - 1) chunk.appendChild(document.createTextNode(" "));
            });
            block.appendChild(chunk);
            if (li < lines.length - 1) block.appendChild(document.createTextNode(" "));

            letterChunks.push({
                el: chunk,
                block: blockIndex,
                len: line.length,
                words: chunk.querySelectorAll(".lr-w"),
                signature: block.classList.contains("signature")
            });
        });
    });

    letterBuilt = true;
}

function resetLetterVisuals() {
    const letter = document.querySelector("#letterScreen .letter");
    const next = document.getElementById("letterNextButton");
    if (letter) {
        letter.classList.add("lr-noanim");
        letterChunks.forEach(c => c.el.classList.remove("is-in"));
        letter.style.scrollBehavior = "auto";       /* jump, don't glide, back to the top */
        letter.scrollTop = 0;
        void letter.offsetWidth;
        letter.classList.remove("lr-noanim");
        letter.style.scrollBehavior = "";
    }
    if (next) next.classList.remove("show");
}

function keepLetterInView(el) {
    const letter = document.querySelector("#letterScreen .letter");
    if (!letter || !el) return;
    const rects = el.getClientRects();
    if (!rects.length) return;
    const last = rects[rects.length - 1];
    const box = letter.getBoundingClientRect();
    const over = last.bottom - (box.bottom - 52);
    if (over > 0) letter.scrollBy({ top: over + 8, behavior: "smooth" });
}

function revealLetterChunk(chunk, duration) {
    const n = chunk.words.length;
    chunk.words.forEach((w, i) => {
        w.style.transitionDelay = `${Math.round((i / n) * duration * 0.85)}ms`;
    });
    chunk.el.classList.add("is-in");
    keepLetterInView(chunk.el);
    letterLater(() => keepLetterInView(chunk.el), 350);
}

function startLetterSequence() {
    buildLetterChunks();
    cancelLetterReveal();
    resetLetterVisuals();

    const letter = document.querySelector("#letterScreen .letter");
    if (letter) {
        letter.classList.remove("paper-in");
        void letter.offsetWidth;
        letter.classList.add("paper-in");
    }

    let t = 900;                                     /* let the paper settle first */

    letterChunks.forEach((chunk, i) => {
        const duration = Math.max(500, Math.min(1400, 380 + chunk.len * 10));
        const next = letterChunks[i + 1];

        letterLater(() => revealLetterChunk(chunk, duration), t);

        if (!next) {
            t += duration;
        } else if (next.block !== chunk.block) {
            const pause = next.signature ? 650 : 300 + Math.min(300, chunk.len * 5);
            t += duration + pause;                   /* pause between sections */
        } else {
            t += Math.round(duration * 0.72);        /* lines flow within a paragraph */
        }
    });

    letterLater(() => {
        const nextBtn = document.getElementById("letterNextButton");
        if (nextBtn) nextBtn.classList.add("show");
    }, t + 450);
}
