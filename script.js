// 1. EVENT CONFIGURATION DATA
const bodaDataJSON = `
{
  "pareja": "Emma & James",
  "fecha_boda": "2027-10-10T18:00:00",
  "fecha_legible": "October 10, 2027",
  "padres": {
    "james": ["Robert Smith", "Mary Johnson"],
    "emma": ["John Doe", "Jane Davis"]
  },
  "ubicacion": {
    "lugar": "Grand Plaza Hotel, New York City",
    "google_maps": "https://www.google.com/maps",
    "apple_maps": "https://maps.apple.com/"
  },
  "itinerario": [
    {"hora": "6:00 pm", "evento": "Civil Ceremony", "icono": "fa-solid fa-ring"},
    {"hora": "7:00 pm", "evento": "Welcome Reception", "icono": "fa-solid fa-champagne-glasses"},
    {"hora": "7:30 pm", "evento": "First Dance", "icono": "fa-solid fa-heart"},
    {"hora": "8:00 pm", "evento": "Celebration Banquet", "icono": "fa-solid fa-utensils"},
    {"hora": "9:00 pm", "evento": "Dance Floor Opens", "icono": "fa-solid fa-music"},
    {"hora": "10:30 pm", "evento": "Late Night Snacks", "icono": "fa-solid fa-burger"},
    {"hora": "11:00 pm", "evento": "Live Music Band", "icono": "fa-solid fa-guitar"},
    {"hora": "11:30 pm", "evento": "Coffee Bar", "icono": "fa-solid fa-mug-hot"},
    {"hora": "01:00 am", "evento": "Farewell", "icono": "fa-solid fa-moon"}
  ],
  "codigo_vestimenta": {
    "etiqueta": "Formal Attire (Clean, casual white sneakers are permitted for comfort).",
    "nota_estricta": "Important note: By protocol, access to the event will be denied to anyone wearing denim."
  },
  "restricciones": "We love your little ones, but to ensure everyone can fully enjoy the evening, we have chosen to have an ADULTS ONLY reception.",
  "mesa_regalos": "https://www.liverpool.com.mx/tienda/home"
}`;

const data = JSON.parse(bodaDataJSON);

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. DOM DATA INJECTION
    try {
        document.getElementById("couple-names").innerHTML = data.pareja.replace(' & ', '<span class="ampersand">&</span>');
        document.getElementById("wedding-date").innerText = data.fecha_legible;
        document.getElementById("wedding-location").innerText = data.ubicacion.lugar;
        document.getElementById("google-map").href = data.ubicacion.google_maps;
        document.getElementById("apple-map").href = data.ubicacion.apple_maps;
        document.getElementById("dress-code").innerText = data.codigo_vestimenta.etiqueta;
        document.getElementById("dress-warning").innerText = data.codigo_vestimenta.nota_estricta;
        document.getElementById("restrictions").innerText = data.restricciones;
        document.getElementById("registry-link").href = data.mesa_regalos;
    } catch(e) { console.warn("Missing DOM elements for general data."); }

    // 3. DYNAMIC RENDERING (PARENTS & ITINERARY)
    try {
        const parentsContainer = document.getElementById("parents-container");
        parentsContainer.innerHTML = `
            <div class="parent-card"><div class="card-honor-line"></div><h3>James's Parents</h3><div class="parent-names"><p>${data.padres.james[0]}</p><p>${data.padres.james[1]}</p></div></div>
            <div class="parent-card"><div class="card-honor-line"></div><h3>Emma's Parents</h3><div class="parent-names"><p>${data.padres.emma[0]}</p><p>${data.padres.emma[1]}</p></div></div>
        `;

        const itineraryList = document.getElementById("itinerary-list");
        data.itinerario.forEach(item => {
            const li = document.createElement("li");
            li.className = "timeline-item";
            li.innerHTML = `
                <div class="timeline-icon"><i class="${item.icono}"></i></div>
                <div class="timeline-content"><span class="timeline-time">${item.hora}</span><h4 class="timeline-event">${item.evento}</h4></div>
            `;
            itineraryList.appendChild(li);
        });
    } catch(e) { console.warn("Error rendering parents or itinerary."); }

    // 4. COUNTDOWN INITIALIZATION
    startCountdown(data.fecha_boda);

    // 5. RSVP SYSTEM (MOCKED FOR PORTFOLIO)
    const urlParams = new URLSearchParams(window.location.search);
    const pasesParam = urlParams.get('pases');
    const pases = parseInt(pasesParam);
    const familia = urlParams.get('familia') || 'Friends';

    const form = document.getElementById('rsvp-form');
    const passesContainer = document.getElementById('guest-passes-container');
    const dynamicGuestsContainer = document.getElementById('dynamic-guests-container');
    const errorMessage = document.getElementById('error-message');
    const successBox = document.getElementById('success-message');

    let yaRespondio = null;
    try {
        yaRespondio = localStorage.getItem('wedding_rsvp_status');
    } catch(e) {
        console.warn("LocalStorage unavailable.");
    }

    if(form) form.classList.add('hidden');
    if(passesContainer) passesContainer.classList.add('hidden');
    if(successBox) successBox.classList.add('hidden');
    if(errorMessage) errorMessage.classList.add('hidden');

    if (yaRespondio) {
        if(successBox) {
            successBox.classList.remove('hidden');
            if (yaRespondio === 'confirmed') {
                successBox.querySelector('h3').innerText = "Attendance Registered";
                document.getElementById('success-text').innerText = "We have already received your confirmation. See you at the wedding!";
            } else {
                successBox.querySelector('i').className = "fa-solid fa-envelope-open-text";
                successBox.querySelector('h3').innerText = "Response Registered";
                document.getElementById('success-text').innerText = "We have registered that you cannot attend. Thank you for letting us know!";
            }
        }
    } 
    else if (pasesParam !== null && !isNaN(pases) && pases > 0) {
        if(passesContainer) passesContainer.classList.remove('hidden');
        if(form) form.classList.remove('hidden');

        const passInstructions = document.getElementById('pass-instructions');
        if (pases > 1 && passInstructions) {
            passInstructions.classList.remove('hidden');
        }
        
        let textoFamilia = familia !== 'Friends' ? ` (${familia} Family)` : '';
        const guestPassesText = document.getElementById('guest-passes-text');
        if(guestPassesText) guestPassesText.innerText = `Passes reserved in your honor: ${pases}${textoFamilia}`;

        if(dynamicGuestsContainer) {
            dynamicGuestsContainer.innerHTML = ''; 
        
        const isMobile = window.innerWidth < 600;

        for(let i = 1; i <= pases; i++) {
            let etiqueta = i === 1 ? "(Primary)" : `(Guest ${i-1})`;
            let placeholderText = isMobile 
                ? `First & Last Name - Guest ${i}` 
                : `First & Last Name of Guest ${i} ${etiqueta}`;

            const wrapper = document.createElement('div');
            wrapper.className = 'guest-input-wrapper';
            wrapper.style.marginBottom = '15px';
            
            let btnEliminar = i > 1 ? `<button type="button" class="remove-guest-btn" title="Remove this pass"><i class="fa-solid fa-xmark"></i></button>` : '';

            wrapper.innerHTML = `
                <div class="input-group" style="flex-grow: 1;">
                    <input type="text" class="guest-name-input" placeholder="${placeholderText}" required>
                </div>
                ${btnEliminar}
            `;
            dynamicGuestsContainer.appendChild(wrapper);
        }

            dynamicGuestsContainer.addEventListener('click', (e) => {
                if (e.target.closest('.remove-guest-btn')) {
                    const row = e.target.closest('.guest-input-wrapper');
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        row.remove();
                    }, 300);
                }
            });
        }
    } 
    else {
        if(errorMessage) {
            errorMessage.classList.remove('hidden');
        }
    }

    // --- FORM SUBMISSION (Mocked API) ---
    if(form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); 
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SENDING...';
            submitBtn.disabled = true;

            let inputsActivos = document.querySelectorAll('.guest-name-input');
            let nombresRegistrados = [];
            inputsActivos.forEach(input => {
                nombresRegistrados.push(input.value);
            });
            
            const pasesFinales = nombresRegistrados.length;

            // Simulated Fetch Request for GitHub Pages Demo
            new Promise(resolve => setTimeout(resolve, 1500))
            .then(() => {
                try { localStorage.setItem('wedding_rsvp_status', 'confirmed'); } catch(e){}
                form.classList.add('hidden');
                passesContainer.classList.add('hidden');
                successBox.classList.remove('hidden');
                let nombreTitular = nombresRegistrados[0].split(' ')[0]; 
                document.getElementById('success-text').innerText = `All set, ${nombreTitular}! We have registered the ${pasesFinales} passes for your party.`;
            })
            .catch(error => {
                console.error('Error!', error);
                submitBtn.innerHTML = 'There was an error, please try again';
                submitBtn.disabled = false;
            });
        });
    }

    const declineBtn = document.getElementById('decline-btn');
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            const titularInput = document.querySelector('.guest-name-input');
            if (!titularInput || !titularInput.value) {
                alert("Please enter at least your name in the first field so we know who is declining.");
                titularInput.focus();
                return;
            }

            declineBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> NOTIFYING...';
            declineBtn.disabled = true;
            document.getElementById('submit-btn').disabled = true;

            // Simulated Fetch Request for GitHub Pages Demo
            new Promise(resolve => setTimeout(resolve, 1500))
            .then(() => {
                try { localStorage.setItem('wedding_rsvp_status', 'declined'); } catch(e){}
                form.classList.add('hidden');
                passesContainer.classList.add('hidden');
                successBox.classList.remove('hidden');
                successBox.querySelector('i').className = "fa-solid fa-envelope-open-text";
                successBox.querySelector('h3').innerText = "Message Sent";
                let nombreTitular = titularInput.value.split(' ')[0]; 
                document.getElementById('success-text').innerText = `Thank you for letting us know, ${nombreTitular}. You will be missed at the celebration!`;
            })
            .catch(error => {
                console.error('Error!', error);
                declineBtn.innerHTML = 'There was an error, please try again';
                declineBtn.disabled = false;
            });
        });
    }

    // 6. CALENDAR MODAL
    try {
        const btnCalendar = document.getElementById("btn-calendar");
        const calendarModal = document.getElementById("calendar-modal");
        const closeModal = document.getElementById("close-calendar");
        const btnGoogleCal = document.getElementById("btn-google-cal");
        const btnAppleCal = document.getElementById("btn-apple-cal");

        const eventTitle = "Emma & James Wedding";
        const eventDetails = "Join us on our big day! Remember to arrive early.";
        const eventLocation = "Grand Plaza Hotel, New York City";

        const dateStart = "20271010T180000"; 
        const dateEnd = "20271011T010000";

        if(btnCalendar) btnCalendar.addEventListener("click", () => calendarModal.classList.remove("hidden"));
        if(closeModal) closeModal.addEventListener("click", () => calendarModal.classList.add("hidden"));
        if(calendarModal) calendarModal.addEventListener("click", (e) => {
            if (e.target === calendarModal) calendarModal.classList.add("hidden");
        });

        if(btnGoogleCal) btnGoogleCal.addEventListener("click", () => {
            const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${dateStart}/${dateEnd}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}`;
            window.open(googleUrl, '_blank');
            calendarModal.classList.add("hidden");
        });

        if(btnAppleCal) btnAppleCal.addEventListener("click", () => {
            const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Emma and James Wedding//EN\nBEGIN:VEVENT\nUID:${new Date().getTime()}@wedding\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nDTSTART:${dateStart}\nDTEND:${dateEnd}\nSUMMARY:${eventTitle}\nDESCRIPTION:${eventDetails}\nLOCATION:${eventLocation}\nEND:VEVENT\nEND:VCALENDAR`;
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a'); 
            link.href = window.URL.createObjectURL(blob); 
            link.setAttribute('download', 'Wedding_E&J.ics'); 
            document.body.appendChild(link); 
            link.click(); 
            document.body.removeChild(link);
            calendarModal.classList.add("hidden");
        });
    } catch(e) { console.warn("Calendar modal error."); }

});

// 7. HELPER FUNCTIONS (COUNTDOWN)
function startCountdown(targetDate) {
    try {
        const countDownDate = new Date(targetDate).getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;
            if (distance < 0) { 
                clearInterval(timer); 
                document.querySelector(".countdown-container").innerHTML = "<h3>The big day is here!</h3>"; 
                return; 
            }
            document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
            document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
        }, 1000);
    } catch(e) { console.warn("Countdown error."); }
}

// 8. PHOTO CAROUSEL (INFINITE SCROLL iOS SAFE)
try {
    const carrusel = document.getElementById('carrusel');
    if(carrusel) {
        const imagenesOriginales = Array.from(carrusel.children);

        imagenesOriginales.forEach(img => {
            carrusel.appendChild(img.cloneNode(true));
        });
        imagenesOriginales.forEach(img => {
            carrusel.appendChild(img.cloneNode(true));
        });

        let intervalo = null;
        let isUserInteracting = false;

        const siguienteSlide = () => {
            if (isUserInteracting) return;
            
            const imgWidth = carrusel.querySelector('img').getBoundingClientRect().width;
            const slideWidth = imgWidth + 15; 
            
            const bloqueOriginalWidth = slideWidth * imagenesOriginales.length;

            if (carrusel.scrollLeft >= bloqueOriginalWidth) {
                carrusel.style.scrollSnapType = 'none'; 
                carrusel.scrollLeft = 0; 
                carrusel.offsetHeight; 
                carrusel.style.scrollSnapType = 'x mandatory'; 
            }
            
            setTimeout(() => {
                if (!isUserInteracting) {
                    carrusel.scrollBy({ left: slideWidth, behavior: 'smooth' });
                }
            }, 20);
        };

        const startAutoplay = () => { intervalo = setInterval(siguienteSlide, 3000); };
        const stopAutoplay = () => { clearInterval(intervalo); };

        const pausarCarrusel = () => { isUserInteracting = true; stopAutoplay(); };
        const reanudarCarrusel = () => { isUserInteracting = false; stopAutoplay(); startAutoplay(); };

        carrusel.addEventListener('touchstart', pausarCarrusel, { passive: true });
        carrusel.addEventListener('touchend', reanudarCarrusel);
        carrusel.addEventListener('mousedown', pausarCarrusel);
        carrusel.addEventListener('mouseup', reanudarCarrusel);
        carrusel.addEventListener('mouseleave', () => { if (isUserInteracting) reanudarCarrusel(); });

        setTimeout(startAutoplay, 1000);
    }
} catch(e) { console.warn("Carousel error."); }