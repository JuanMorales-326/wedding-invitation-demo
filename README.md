# 💍 Interactive Wedding Invitation Demo

This repository contains a fully responsive, front-end web application designed as a premium wedding invitation. The project demonstrates core web development skills including semantic HTML, modern CSS styling, and dynamic DOM manipulation using Vanilla JavaScript.

## 🚀 Live Demo & Interactive Features

This project uses URL Query Parameters (`?pases=` and `&family=`) to dynamically generate the RSVP form, personalizing the experience for each guest. 

If a user accesses the root URL without parameters, the system blocks the form to prevent unauthorized RSVPs. To test the functionality, please use the pre-configured demo links below:

* 🔗 **View as a Regular Guest (No parameters):** [Live Demo - Blocked RSVP](https://juanmorales-326.github.io/wedding-invitation-demo/)
* 🔗 **View as a Couple (2 Passes):** [Live Demo - 2 Passes](https://juanmorales-326.github.io/wedding-invitation-demo/?pases=2)
* 🔗 **View as a Family (4 Passes, Morales Family):** [Live Demo - Family Mode](https://juanmorales-326.github.io/wedding-invitation-demo/?pases=4&family=Morales)

> **⚠️ Note on Backend Simulation:** > For this public portfolio version, the original `fetch` requests to a live Google Sheets database have been replaced with a mocked asynchronous `Promise`. This allows you to test the full RSVP submission flow (including loading states, success animations, and `localStorage` caching) without interacting with a live backend endpoint.

## 🛠️ Built With

* **HTML5:** Semantic structure and accessibility.
* **CSS3:** Custom properties (variables), Flexbox/Grid layouts, and responsive design (mobile-first approach).
* **Vanilla JavaScript (ES6+):** * Dynamic DOM Injection (parsing JSON configuration data).
    * URL Query Parameter parsing (`URLSearchParams`).
    * Asynchronous Mock API (`Promises`, `setTimeout`).
    * Event Delegation and Form Handling.
    * State Management (`localStorage`).
* **FontAwesome:** Iconography.
* **Google Fonts:** Typography integration.

## ✨ Key Features

* **Dynamic Content Loading:** All event details (names, dates, itinerary, dress code) are loaded from a centralized JSON object, making the template easily reusable.
* **Smart RSVP System:** Generates exact input fields based on the number of passes assigned in the URL.
* **"Save the Date" Integration:** Generates dynamic `.ics` files for Apple Calendar and pre-filled URLs for Google Calendar.
* **Infinite Scroll Carousel:** A custom, dependency-free image carousel optimized for touch devices.
* **Responsive Design:** Fully optimized for desktop, tablet, and mobile viewing.

---
*Designed and developed by [Juan Morales](https://github.com/JuanMorales-326)*
