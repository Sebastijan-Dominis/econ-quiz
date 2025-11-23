# Econ Quiz

A playful, educational quiz web app that helps users test and improve their knowledge of global economics — GDP, population, and other country-level data.

Econ Quiz is built with modern web tooling and designed to be fast, responsive, and easy to extend. It includes a study mode, multiple quiz difficulties, user accounts (via Firebase), and an admin interface for adding or editing questions.

**Contents of this README**
- **Overview**: What this project is and who it's for.
- **Features**: What the app currently provides.
- **Tech Stack**: Libraries and tools used.
- **Quick Start**: Install, run, and build instructions.
- **Project Structure**: Where to find the important files.
- **Design & Assets**: Notes about design resources included in the repo.
- **Contributing**: How to help or submit changes.

## Overview

Econ Quiz provides an approachable way for learners to test their knowledge of economic facts about countries. It packages quiz gameplay, study materials, and leaderboards into a single Vue 3 application with persistent user accounts powered by Firebase.

## Features

- Study mode with topic and difficulty selection.
- Fun quizzes with scoring and results screens.
- Leaderboard and user accounts (Firebase Authentication + Firestore).
- Admin interface to add, edit, or remove questions.
- Responsive UI built with Tailwind CSS and Vite for fast developer feedback.

## Tech Stack

- Frontend: `Vue 3`, `Pinia`, `Vue Router`
- Tooling: `Vite`, `Tailwind CSS`, `PostCSS`
- Backend / Hosting: `Firebase` (Authentication, Firestore, Hosting)
- Languages: `JavaScript` (ES modules)

## Quick Start (local development)

Prerequisites: install `Node.js` (recommended v16+), and `npm`.

Clone the repo:
```bash
git clone https://github.com/Sebastijan-Dominis/econ-quiz
```

Open PowerShell and run:

```powershell
cd econ_quiz
npm install
npm run dev
# Visit http://localhost:5173 in your browser
```

Available scripts (from `econ_quiz/package.json`):

- `npm run dev` — run the dev server with Vite
- `npm run build` — build the production bundle
- `npm run preview` — locally preview the production build
- `npm run deploy` — installs deps, builds, and runs `firebase deploy` (requires Firebase CLI and project configured)

## Build & Deploy

To create a production build:

```powershell
cd econ_quiz
npm run build
```

To preview the production build locally:

```powershell
npm run preview
```

This repository includes a `firebase.json` configuration (inside `econ_quiz/`) and a `deploy` script that runs `firebase deploy`. Ensure you have the Firebase CLI installed and are logged in before running `npm run deploy`.

## Project Structure (high level)

- `econ_quiz/` — main application folder
	- `src/` — application source
		- `components/` — Vue components
		- `views/` — route views (Home, Quiz, Study, Admin, etc.)
		- `stores/` — Pinia stores
		- `js/firebase.js` — Firebase initialization
	- `public/` — static assets
	- `package.json` — project scripts & deps
	- `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
- `FIGMA/`, `UML_diagrams_new/` — design and UML exports (reference only)

For more details about design decisions, refer to `econ_quiz/design.md`.

## Screenshots

![First page - logged out](screenshots/econ-quiz-1.png)

![First page - logged in](screenshots/econ-quiz-2.png)

![Study section](screenshots/econ-quiz-3.png)

![Results section](screenshots/econ-quiz-4.png)

![Leaderboard section](screenshots/econ-quiz-12.png)

![Quiz choice](screenshots/econ-quiz-5.png)

![Quiz topic choice](screenshots/econ-quiz-11.png)

![Difficulty choice](screenshots/econ-quiz-6.png)

![Timed quiz question](screenshots/econ-quiz-7.png)

![Difficulty choice 2](screenshots/econ-quiz-8.png)

![Multiple choice quiz question](screenshots/econ-quiz-9.png)

![Manual input quiz question](screenshots/econ-quiz-13.png)

![Add quiz section](screenshots/econ-quiz-10.png)

![Edit or delete quiz section](screenshots/econ-quiz-14.png)

## Design & Assets

The repo includes Figma exports and UML diagrams used during design. These are reference materials and can be large — you can ignore or exclude `FIGMA/` and `UML_diagrams_new/` when cloning if you don't need them.

Design guidelines and inspiration are stored in `econ_quiz/design.md` and include color palettes, typography, and UX notes.

## License

- This repository includes a `LICENSE` file — please review it for terms of reuse.

## Contributing

- Found a bug or have a feature idea? Open an issue.
- Want to contribute code? Fork the repo, create a feature branch, then open a pull request.
- Follow existing code style (Vue 3 + Composition API, Pinia for state), and keep changes focused and well-documented.

**Contact / Author**
- Author: repository owner (see repository metadata).
