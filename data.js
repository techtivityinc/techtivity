/* ==========================================================================
   Techtivity — site content
   Edit this file to change company names, products, members and settings.
   No other file needs to change for content updates.
   ========================================================================== */

const SITE = {
  name: 'Techtivity',
  email: 'hello@techtivity.com', // where the contact form sends enquiries
  foundedYear: 2014,
  heroWord: 'TECHTIVITY',        // letters of the large hero wordmark
};

/* Technology names shown in the scrolling strip under the hero */
const STACK = [
  'Rust', 'TypeScript', 'Postgres', 'WebAssembly', 'Kubernetes',
  'PyTorch', 'Go', 'Zero trust', 'Observability', 'Edge compute',
];

/* Companies, each with the products shown inside its accordion panel.
   image: file in /images, tag: short stack label, year: launch year. */
const COMPANIES = [
  {
    name: 'Helix Platform',
    category: 'Developer tools',
    summary: 'Build, deploy and documentation tooling for engineering teams, written in Rust and TypeScript.',
    products: [
      { name: 'Helix CLI', image: 'project-01.jpg', tag: 'Rust / Build', year: 2024,
        text: 'A zero-config build and deploy toolchain with remote caching and incremental compilation.' },
      { name: 'Drift', image: 'project-02.jpg', tag: 'TypeScript / Sync', year: 2023,
        text: 'A real-time sync engine built on CRDTs, for offline-first collaborative apps.' },
      { name: 'Vellum', image: 'project-05.jpg', tag: 'OpenAPI / SDKs', year: 2022,
        text: 'A generator that turns OpenAPI specs into typed SDKs and versioned documentation.' },
    ],
  },
  {
    name: 'Onyx Cloud',
    category: 'Infrastructure',
    summary: 'Managed data and compute infrastructure, designed for high availability across regions.',
    products: [
      { name: 'Onyx DB', image: 'project-03.jpg', tag: 'Postgres / HA', year: 2024,
        text: 'A multi-region Postgres platform with automatic failover and point-in-time recovery.' },
      { name: 'Apex Edge', image: 'project-09.jpg', tag: 'WebAssembly', year: 2025,
        text: 'An edge runtime that runs WebAssembly functions with cold starts under 10 ms.' },
    ],
  },
  {
    name: 'Pulse AI',
    category: 'Machine learning',
    summary: 'Applied machine learning, observability and evaluation for production systems.',
    products: [
      { name: 'Pulse', image: 'project-04.jpg', tag: 'Streaming / Metrics', year: 2023,
        text: 'A streaming observability pipeline that processes two million events per second.' },
      { name: 'Lumen', image: 'project-08.jpg', tag: 'RAG / Evals', year: 2025,
        text: 'A retrieval-augmented search stack with a built-in framework for evaluating LLM output.' },
    ],
  },
  {
    name: 'Forge Security',
    category: 'Security and embedded',
    summary: 'Security software and firmware services for connected devices and distributed teams.',
    products: [
      { name: 'Forge OTA', image: 'project-07.jpg', tag: 'Firmware / Signing', year: 2024,
        text: 'A firmware signing and over-the-air update service for large device fleets.' },
      { name: 'Signal', image: 'project-06.jpg', tag: 'Zero trust', year: 2026,
        text: 'A zero-trust access gateway with hardware-key attestation and audit logs.' },
    ],
  },
];

/* Team members. group: "Group" or a company name; it drives the filter chips.
   Add a photo later by setting `photo: 'name.jpg'` (see renderMembers in main.js). */
const MEMBERS = [
  { name: 'Amara Voss',  role: 'Managing Partner',        group: 'Group' },
  { name: 'Mira Tanaka', role: 'Principal Engineer',      group: 'Helix Platform' },
  { name: 'Leo Brandt',  role: 'Chief Technology Officer', group: 'Onyx Cloud' },
  { name: 'Sana Iyer',   role: 'Head of ML Research',     group: 'Pulse AI' },
];
