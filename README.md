# Push Your Limits

[![CI](https://github.com/mq0gg/UJ_Tuwaiq_Github_Workshop/actions/workflows/ci.yml/badge.svg)](https://github.com/mq0gg/UJ_Tuwaiq_Github_Workshop/actions/workflows/ci.yml)

A hands-on GitHub workshop by **Tuwaiq Club — Programming Track**, University of Jeddah.
This repository is the workshop's own website, and every live demo in the workshop happens right here.

ورشة عملية عن GitHub من مسار البرمجة في نادي طويق، جامعة جدة. هذا الـRepository هو موقع الورشة نفسه، وكل الـLive Demos تصير عليه.

- **Date:** 19 October 2026
- **Format:** In person, 4 hours (240 minutes)
- **Presented by:** Marwa Ali Haddadi

## Live site

After the **GO LIVE** bonus level, the site is published with GitHub Pages:
https://mq0gg.github.io/UJ_Tuwaiq_Github_Workshop/

## Technologies

- HTML
- CSS
- JavaScript
- GitHub Actions (CI)
- GitHub Pages

## How to run

No build step. Clone the repo and open `index.html` in your browser.

```bash
git clone https://github.com/mq0gg/UJ_Tuwaiq_Github_Workshop.git
cd UJ_Tuwaiq_Github_Workshop
```

Run the tests (Node.js 20 or newer):

```bash
npm ci
npm test
```

## Project structure

```
UJ_Tuwaiq_Github_Workshop/
├── index.html              # the workshop website
├── src/
│   ├── style.css           # theme: dark HUD, Tuwaiq Club colors
│   └── script.js           # HUD, mission map, timers, copy buttons
├── data/
│   ├── missions.js         # the 240-minute timeline
│   └── leaderboard.js      # top 3 individuals and teams
├── arena/
│   ├── team-1.html         # Boss Battle 02 arena for team 1
│   └── team-2.html         # Boss Battle 02 arena for team 2
├── tests/
│   └── basic.test.js       # checks the timeline adds up
├── .github/workflows/
│   └── ci.yml              # runs the tests on every push and PR
├── .gitignore
├── .env.example
└── package.json
```

## Workshop map

| Level | Mission | Time |
| --- | --- | --- |
| Mission 01 | Enter GitHub | 15 min |
| Mission 02 | Build Your Repository | 25 min |
| Boss Battle 01 | GitHub Speed Challenge | 5 min |
| Mission 03 | Control Your Code | 18 min |
| Mission 04 | Collaborate | 25 min |
| Mission 05 | Resolve Conflicts | 13 min |
| Boss Battle 02 | Conflict Resolver | 15 min |
| Mission 06 | Don't Break the Repo | 15 min |
| Mission 07 | Manage the Project | 15 min |
| Final Boss | Project Management Challenge | 15 min |
| Mission 08 | Automate It | 10 min |

## Contributing

Never push straight to `main`. Use the workflow from Mission 04:

```bash
git switch -c <branch-name>
# make your changes
git add .
git commit -m "Clear message about what changed"
git push -u origin <branch-name>
```

Then open a Pull Request, ask a teammate for a review, and merge after the CI check passes.

## License

MIT
