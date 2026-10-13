// Workshop timeline, in order. Times are minutes from the start (0 to 240).
// tests/basic.test.js checks that the blocks add up to 240 minutes with no gaps.
const MISSIONS = [
  {
    id: 'lobby', type: 'lobby', tag: 'LOBBY', name: 'WELCOME TO GITHUB LAB',
    ar: 'نتعرف على بعض، نكوّن الفرق، ونستلم البنرات',
    start: 0, end: 10, lvl: 'LVL 00', pct: 0,
  },
  {
    id: 'm1', type: 'mission', tag: 'MISSION 01 / 08', name: 'ENTER GITHUB',
    ar: 'نتعرف على GitHub ونفهم الفرق بينه وبين Git',
    start: 10, end: 25, lvl: 'LVL 01', pct: 7,
    topics: ['What is GitHub', 'Git vs GitHub', 'Repo tour'], demo: 'LIVE DEMO 01.3',
  },
  {
    id: 'm2', type: 'mission', tag: 'MISSION 02 / 08', name: 'BUILD YOUR REPOSITORY',
    ar: 'نفهم وش داخل الـRepository ونتعلم أهم المصطلحات',
    start: 25, end: 50, lvl: 'LVL 02', pct: 18,
    topics: ['README.md', '.gitignore', '.env', 'Branch', 'Commit'],
  },
  {
    id: 'b1', type: 'boss', tag: 'BOSS BATTLE 01', name: 'GITHUB SPEED CHALLENGE',
    ar: 'تحدي فردي: أنشئ أول Repository لك في 5 دقائق',
    start: 50, end: 57, lvl: 'LVL 02', pct: 26, color: 'orange', link: '#boss-b1',
  },
  {
    id: 'm3', type: 'mission', tag: 'MISSION 03 / 08', name: 'CONTROL YOUR CODE',
    ar: 'نتعلم كيف ننزّل الـRepository لجهازنا… ونفرّق بين Clone و Fork',
    start: 57, end: 75, lvl: 'LVL 03', pct: 33,
    topics: ['git clone', 'Fork', 'Fork vs Clone', 'LAB 01'],
  },
  {
    id: 'break1', type: 'break', tag: 'BREAK', name: 'SAVING PROGRESS',
    ar: 'استراحة 10 دقائق',
    start: 75, end: 85, lvl: 'LVL 03', pct: 40,
  },
  {
    id: 'm4', type: 'mission', tag: 'MISSION 04 / 08', name: 'COLLABORATE',
    ar: 'نتعلم الطريقة الصح للشغل الجماعي: Branch و Pull Request و Merge',
    start: 85, end: 110, lvl: 'LVL 04', pct: 46,
    topics: ['git switch -c', 'Pull Request', 'Merge', 'Spot the Mistake', 'LAB 02'], demo: 'LIVE DEMO 04.5',
  },
  {
    id: 'm5', type: 'mission', tag: 'MISSION 05 / 08', name: 'RESOLVE CONFLICTS',
    ar: 'نفهم الـMerge Conflict… ونتعلم نحلّه بهدوء',
    start: 110, end: 123, lvl: 'LVL 05', pct: 56,
    topics: ['Conflict markers', 'Resolve', 'Prevent'],
  },
  {
    id: 'b2', type: 'boss', tag: 'BOSS BATTLE 02', name: 'CONFLICT RESOLVER',
    ar: 'تحدي فرق: أول فريقين يتنافسون على حل conflict حقيقي',
    start: 123, end: 140, lvl: 'LVL 05', pct: 63, color: 'teal', link: '#boss-b2',
  },
  {
    id: 'm6', type: 'mission', tag: 'MISSION 06 / 08', name: "DON'T BREAK THE REPO",
    ar: 'نتعلم العادات اللي تحمي المشروع وتسهّل الشغل الجماعي',
    start: 140, end: 155, lvl: 'LVL 06', pct: 70,
    topics: ['6 Rules', 'git revert', 'Integrity check'],
  },
  {
    id: 'break2', type: 'break', tag: 'BREAK', name: 'SAVING PROGRESS',
    ar: 'استراحة 10 دقائق',
    start: 155, end: 165, lvl: 'LVL 06', pct: 76,
  },
  {
    id: 'm7', type: 'mission', tag: 'MISSION 07 / 08', name: 'MANAGE THE PROJECT',
    ar: 'نستخدم Issues و GitHub Projects عشان ننظّم شغل الفريق',
    start: 165, end: 180, lvl: 'LVL 07', pct: 81,
    topics: ['Issues', 'Labels', 'Assignees', 'GitHub Projects'], demo: 'LIVE DEMO 07.1',
  },
  {
    id: 'final', type: 'boss', tag: 'FINAL BOSS', name: 'PROJECT MANAGEMENT CHALLENGE',
    ar: 'فرق من 3: حوّلوا الـRepository لمساحة شغل جماعية',
    start: 180, end: 197, lvl: 'LVL 07', pct: 85, color: 'red', link: '#boss-final',
  },
  {
    id: 'm8', type: 'mission', tag: 'MISSION 08 / 08', name: 'AUTOMATE IT',
    ar: 'نخلي GitHub يشتغل عنّا تلقائياً: يختبر الكود مع كل Pull Request',
    start: 197, end: 207, lvl: 'LVL 08', pct: 92,
    topics: ['GitHub Actions', 'Workflow YAML', 'CI check'], demo: 'LIVE DEMO 08.3',
  },
  {
    id: 'bonus', type: 'bonus', tag: 'BONUS LEVEL', name: 'GO LIVE',
    ar: 'نحوّل الـRepository لموقع حقيقي بـGitHub Pages',
    start: 207, end: 217, lvl: 'LVL MAX', pct: 96,
    topics: ['GitHub Pages'], demo: 'LIVE DEMO',
  },
  {
    id: 'break3', type: 'break', tag: 'BREAK', name: 'SAVING PROGRESS',
    ar: 'استراحة 15 دقيقة… نجمع النقاط',
    start: 217, end: 232, lvl: 'LVL MAX', pct: 98,
  },
  {
    id: 'end', type: 'end', tag: 'RESULTS', name: 'LEADERBOARD & Q&A',
    ar: 'نعلن الفائزين… وبعدها أسئلتكم',
    start: 232, end: 240, lvl: 'LVL MAX', pct: 100, link: '#leaderboard',
  },
];

if (typeof module !== 'undefined') module.exports = { MISSIONS };
