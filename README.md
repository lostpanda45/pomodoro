# Pomodoro Timer

A simple, mobile-first Pomodoro timer that works as a Progressive Web App (PWA). Runs entirely in your browser with no accounts, no backend, and no build step.

## Features

- Focus & breaks – 25 min work / 5 min short break by default, with a 15 min long break every 4 sessions
- Custom durations – Edit work, short break, long break, or how often the long break comes. Your choices are saved automatically
- Start, pause, reset – Easy to use on any phone
- Session counter – Tracks how many focus sessions you've completed
- Sound & vibration – Gentle alerts when it's time to switch
- Screen stays awake – Uses the Wake Lock API while the timer is running
- Installs like an app – Add to your home screen from your browser
- Works offline – Caches with a service worker once loaded
- Resilient to reloads – Refresh mid-session and it'll pick up right where you left off
- Material Design 3 – Clean layout, easy to read at arm's length
- Light & dark – Follows your system theme

## Try it

- Live demo: [https://lostpanda45.github.io/pomodoro/](https://lostpanda45.github.io/pomodoro/)
- Repo: [https://github.com/lostpanda45/pomodoro](https://github.com/lostpanda45/pomodoro)

## Run locally

```bash
cd pomodoro
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

## Built with

Plain HTML, CSS and JavaScript. Uses `localStorage`, a Web App Manifest, a Service Worker and the Screen Wake Lock API.

## Tests

```bash
npm install
npx playwright test
```
