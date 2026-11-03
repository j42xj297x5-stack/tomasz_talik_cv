# Tomasz Talik — CV

[Polski](README.md) · **English**

My CV as a small web application. It brings together my experience in IT, electronics, customer-facing work, sound and multimedia production, along with the projects I am currently working on.

It is also one of those projects: an application with its own content model, profiles for individual recipients, a local editor and access to private contact details through Cloudflare.

[Open the CV](https://j42xj297x5-stack.github.io/tomasz_talik_cv/) · [Explore the portfolio](https://j42xj297x5-stack.github.io/tomasz-talik-portfolio/)

## Two perspectives on the same experience

I have prepared two CV variants:

- **Game Dev** — focused on game design, spatial interactions, Three.js, WebXR, and working with visuals and sound.
- **IT / AI** — focused on understanding needs, building applications and tools, API integration, working with data, and using AI in project development.

Both use the same underlying information. They differ in their introduction, selected project descriptions, project order and highlighted skills. The CV is available in Polish and English.

## A profile prepared for each company

I can prepare a separate profile and CV link for each company. In the local editor, I enter the recipient’s name, choose a variant and generate the configuration. The person opening the link receives a version prepared with that particular application in mind.

This is the purpose of the identifiers visible in the URL:

- `#p` identifies the public company profile — its name and the selected CV variant.
- `#k` is used to retrieve private contact details.

The two identifiers serve different purposes. The company profile is public, while access to private contact details requires an active token. A link containing that token can be forwarded, so I treat it as a way to share contact details rather than proof of the recipient’s identity.

## Private contact details and Cloudflare

The public CV is hosted on GitHub Pages. Private contact details are stored outside the repository and retrieved through a Cloudflare Worker after the access token has been checked.

This keeps the public presentation of my projects separate from information shared with the people I send my CV to. The repository contains the website code and the client that communicates with the Worker; the Cloudflare service’s own code is maintained separately.

## What is implemented

The application supports:

- two content variants: Game Dev and IT / AI;
- Polish and English;
- public profiles prepared for individual companies;
- retrieving private contact details through a Cloudflare Worker;
- projects with links to demonstrations, videos and repositories;
- skills displayed in categories and an interactive cloud;
- saving the current CV view as a PDF using the browser’s print function;
- content validation and an automated build before publishing to GitHub Pages.

A local Streamlit editor helps prepare a company profile, activate a contact token, and draft an email and cover letter. Publishing the profile is a separate step — the file needs to be added to the repository and deployed to the website.

## Projects featured in the CV

**Orange Monkey VR** — a narrative browser-based VR game combining exploration, spatial puzzles and building tools. The project includes custom gameplay systems built with Three.js and WebXR, visuals, animation and spatial audio.

**Haiku Cosmos** — a contemplative game bringing together a generated cosmos, a card system and poetry. The player’s actions influence the state and development of the world.

**DIG Engine** — a local application for discovering music and working with data from Spotify, Last.fm and Discogs, developed in Python and PySide6.

**Interactive AI Portfolio** — a presentation of my work through a conventional 2D interface and a 3D space, also including a separate VR game.

**Creative AI — The Tale of R.** — an original short film made with generative tools, storytelling, voice, sound and editing.

## How I work

I use ChatGPT and Codex while developing the CV. I prepare requirements, organise tasks, make design decisions and check the results. AI supports me with analysis, implementation and documentation.

My priorities for this project were clear responsibilities for each part, the ability to update content without rebuilding the interface, and separating public data from private information. The CV variants share the same underlying data, while validation helps catch mistakes before publication.

## Technologies

Frontend: JavaScript, HTML, CSS and Vite.  
Content and validation: JSON, JSON Schema and Ajv.  
Local editor: Python and Streamlit.  
Private contact details: Cloudflare Worker.  
Publishing: GitHub Actions and GitHub Pages.

## Running locally

Node.js 24 is required.

```bash
npm ci
npm run dev
```

Content validation and build:

```bash
npm run validate:content
npm run build
```

Editor setup instructions are in the [local editor documentation](docs/current/technical/LOCAL_EDITOR.md) (in Polish).

## Documentation

The [project documentation](docs/current/README.md) describes the architecture, data, profiles and publishing workflow. [ENTRY_POINT.md](ENTRY_POINT.md) is the starting point for working on the code. These documents are in Polish.
