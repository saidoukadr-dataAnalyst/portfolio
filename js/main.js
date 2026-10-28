"use strict";

// Public visits always read the published data file. Only ?edit=1 loads a local draft.
const STORAGE_KEY = "said_portfolio_draft_v3";
const LEGACY_KEY = "bd_portfolio_data_v2";
const $ = (id) => document.getElementById(id);
const clone = (value) => JSON.parse(JSON.stringify(value));
const escapeHTML = (value = "") => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const normalize = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const categories = {security:"Cybersécurité",bigdata:"Data Engineering",analysis:"Data Analysis",genai:"GenAI", "vision-nlp":"Vision & NLP",machinelearning:"Machine Learning"};
const state = {data:clone(defaultPortfolioData), editor:new URLSearchParams(location.search).get("edit") === "1", filter:"all", query:"", step:0};
let toastTimer;

function safeURL(value, local = false) {
  if (typeof value !== "string" || !value.trim() || /votre-pseudo|votre-profil|votre-demo/i.test(value)) return "";
  const text = value.trim();
  if (/^https?:\/\//i.test(text)) { try { const url = new URL(text); return url.username || url.password ? "" : url.href; } catch { return ""; } }
  if (local && /^(?:\.\/)?assets\/[a-zA-Z0-9_./ -]+\.pdf$/i.test(text) && !text.includes("..")) return text;
  return "";
}
function externalLink(url, label, className = "") {
  const safe = safeURL(url);
  return safe ? `<a href="${escapeHTML(safe)}" target="_blank" rel="noopener noreferrer" class="${className}">${escapeHTML(label)} <span aria-hidden="true">↗</span></a>` : "";
}
function tags(items = []) { return `<div class="tags">${items.map(item => `<span class="tag">${escapeHTML(item)}</span>`).join("")}</div>`; }
function exampleBadge(item) { return item.isExample ? '<span class="example-tag">Exemple</span>' : ""; }
function notify(message) { clearTimeout(toastTimer); $("toast").textContent = message; $("toast").hidden = false; toastTimer = setTimeout(() => { $("toast").hidden = true; }, 5500); }

// Validate data before using imported or locally stored content in the renderer.
function validateData(data) {
  const object = v => v && typeof v === "object" && !Array.isArray(v);
  const text = v => typeof v === "string";
  const strings = v => Array.isArray(v) && v.every(text);
  const fail = msg => { throw new Error(msg); };
  if (!object(data) || !object(data.profile) || !text(data.profile.name) || !data.profile.name.trim()) fail("Le profil doit contenir un nom.");
  for (const [key,value] of Object.entries(data.profile)) if (!["reportedInternships"].includes(key) && !text(value) && typeof value !== "boolean") fail(`Champ de profil invalide : ${key}.`);
  for (const list of ["projects","internships","education","certifications"]) if (!Array.isArray(data[list])) fail(`La section ${list} doit être une liste.`);
  for (const list of ["projects","internships"]) {
    const ids = new Set();
    for (const item of data[list]) {
      if (!object(item) || !text(item.id) || !item.id || ids.has(item.id)) fail(`Chaque élément de ${list} doit avoir un identifiant unique.`);
      ids.add(item.id);
      if (item.isExample !== undefined && typeof item.isExample !== "boolean") fail("Le statut Exemple doit être un booléen.");
      const required = list === "projects" ? ["title","category","summary"] : ["role","company","summary"];
      for (const key of required) if (!text(item[key])) fail(`Champ manquant ou invalide : ${key}.`);
      if (!object(item.fullDetails)) fail("Les détails doivent être un objet.");
      if (list === "projects") {
        if (!strings(item.technologies)) fail("Les technologies doivent être une liste de textes.");
        if (!Object.values(item.fullDetails).every(text)) fail("Les détails d’un projet doivent être des textes.");
      } else {
        for (const key of ["responsibilities","results","techStack"]) if (!strings(item.fullDetails[key])) fail(`Détail de stage invalide : ${key}.`);
        if (!Array.isArray(item.fullDetails.architecture) || !item.fullDetails.architecture.every(v=>object(v)&&text(v.step)&&text(v.desc))) fail("Architecture de stage invalide.");
        for (const key of ["context","objective"]) if (item.fullDetails[key] !== undefined && !text(item.fullDetails[key])) fail(`Détail invalide : ${key}.`);
      }
      for (const [key,value] of Object.entries(item)) if (key !== "fullDetails" && key !== "technologies" && key !== "isExample" && !text(value)) fail(`Champ invalide : ${key}.`);
    }
  }
  if (!object(data.skills)) fail("Les compétences doivent être regroupées dans un objet.");
  for (const item of Object.values(data.skills)) if (!object(item) || !text(item.title) || !text(item.description) || !strings(item.items)) fail("Chaque groupe de compétences nécessite un titre, une description et une liste de technologies.");
  for (const item of data.education) if (!object(item) || !text(item.degree) || !text(item.school) || !strings(item.details)) fail("Chaque formation nécessite un diplôme, un établissement et une liste de détails.");
  for (const item of data.certifications) if (!object(item) || !text(item.name) || !text(item.issuer)) fail("Chaque certification nécessite un nom et un organisme.");
  return data;
}
function loadDraft() {
  if (!state.editor) return;
  try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) state.data = validateData(JSON.parse(saved)); }
  catch { notify("Brouillon illisible ou stockage indisponible : le fichier publié est affiché. Le brouillon n’a pas été supprimé."); }
}
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); notify("Brouillon enregistré ici. Exportez data.js pour publier les changements."); }
  catch { notify("Stockage indisponible. Exportez data.js maintenant pour conserver vos modifications."); }
}
function editControls(kind, id) {
  return state.editor ? `<div class="edit-controls"><button data-action="edit-${kind}" data-id="${escapeHTML(id)}">Modifier</button><button class="danger" data-action="delete-${kind}" data-id="${escapeHTML(id)}">Supprimer</button></div>` : "";
}

async function renderProfile() {
  const p = state.data.profile;
  for (const [id,value] of Object.entries({"nav-name":p.name,"hero-name":p.name.toLocaleUpperCase("fr"),"footer-name":p.name,"hero-status":p.statusBadge,"hero-bio":p.shortBio,"hero-location":p.location,"hero-study":p.studyLabel,"about-description":p.aboutDescription,"target-role":p.targetRole,"contact-intro":p.contactIntro,"experience-intro":p.experienceIntro})) $(id).textContent = value || "";
  $("year").textContent = new Date().getFullYear();
  document.title = `${p.name} — Portfolio Data Engineering & Data Analysis`;
  document.querySelector('meta[name="description"]').content = p.shortBio || "Portfolio Data & IA";
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = p.shortBio || "Portfolio Data & IA";
  const realProjects = state.data.projects.filter(p => !p.isExample).length;
  const actualStages = state.data.internships.filter(p => !p.isExample).length;
  const stageCount = Math.max(actualStages, Number(p.reportedInternships) || 0);
  const facts = [[p.studyYear || "5e","année d’études","Big Data & IA"],[String(stageCount),"stages réalisés",actualStages ? "Expériences documentées" : "Détails à renseigner"],["UIR","Université Internationale","de Rabat"],["PFE","Prochaine étape","Data Engineering / Analysis"]];
  if (realProjects) facts[1] = [String(realProjects),"projets documentés",`${stageCount} stages réalisés`];
  $("facts").innerHTML = facts.map(([value,label,detail])=>`<div class="fact"><strong>${escapeHTML(value)}</strong><span>${escapeHTML(label)}<small>${escapeHTML(detail)}</small></span></div>`).join("");
  const contact = [];
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(p.email || "") ? p.email : "";
  if (email) contact.push(`<a class="button primary" href="mailto:${escapeHTML(email)}">${escapeHTML(email)} <span aria-hidden="true">↗</span></a><button class="text-link" style="background:none" data-action="copy-email">Copier l’adresse e-mail ⧉</button>`);
  if (p.phone && /^[+\d\s().-]{7,25}$/.test(p.phone)) contact.push(`<a class="text-link" href="tel:${escapeHTML(p.phone.replace(/[^+\d]/g,""))}">${escapeHTML(p.phone)} ↗</a>`);
  contact.push(externalLink(p.linkedin,"LinkedIn","text-link"),externalLink(p.github,"GitHub","text-link"));
  $("contact-actions").innerHTML = contact.filter(Boolean).join("") || '<p class="contact-placeholder">Coordonnées à venir.<br>Le portfolio est en cours de personnalisation.</p>';
  if (state.editor) $("contact-actions").insertAdjacentHTML("beforeend",'<button class="button small" data-action="profile">Renseigner mes coordonnées</button>');
  const cv = $("hero-cv"); cv.hidden = true; cv.removeAttribute("href");
  const cvURL = safeURL(p.cvPdfUrl,true);
  if (cvURL) {
    // Do not offer a broken download for a PDF that has not been added yet.
    let available = /^https?:/i.test(cvURL) || location.protocol === "file:";
    if (!available) { try { const response = await fetch(cvURL,{method:"HEAD"}); available = response.ok && /pdf/i.test(response.headers.get("content-type") || ""); } catch { available = false; } }
    if (available && state.data.profile.cvPdfUrl === p.cvPdfUrl) { cv.href = cvURL; cv.target = "_blank"; cv.rel = "noopener"; cv.hidden = false; }
  }
}
function renderProjects() {
  const counts = {};
  for (const p of state.data.projects) counts[p.category] = (counts[p.category] || 0) + 1;
  if (state.filter !== "all" && !counts[state.filter]) state.filter = "all";
  $("filters").innerHTML = [["all","Tous",state.data.projects.length],...Object.keys(counts).map(key=>[key,categories[key] || key,counts[key]])].map(([key,label,count])=>`<button class="filter ${state.filter===key?"active":""}" data-filter="${escapeHTML(key)}" aria-pressed="${state.filter===key}">${escapeHTML(label)}<span>${count}</span></button>`).join("");
  const search = normalize(state.query.trim());
  const list = state.data.projects.filter(p => (state.filter === "all" || p.category === state.filter) && normalize([p.title,p.summary,p.categoryLabel,...p.technologies,...Object.values(p.fullDetails)].join(" ")).includes(search));
  $("result-count").textContent = `${list.length} projet${list.length>1?"s":""} affiché${list.length>1?"s":""} sur ${state.data.projects.length}`;
  $("projects-grid").innerHTML = list.map((p,i)=>{
    const art = p.category === "security" ? ["violet","PDF","SIGNATURE","CONTRÔLE"] : p.category === "bigdata" ? ["blue","SOURCE","PIPELINE","DATA"] : p.category === "genai" ? ["","DOCS","RAG","RÉPONSE"] : p.category === "analysis" ? ["","DATA","ANALYSE","INSIGHT"] : ["violet","DATA","MODÈLE","OUTPUT"];
    return `<article class="project-card"><div class="project-art ${art[0]}" aria-hidden="true"><span class="art-label">${escapeHTML(categories[p.category] || p.categoryLabel)}</span><div class="diagram"><span class="diagram-node">${art[1]}</span><span class="diagram-link"></span><span class="diagram-node center">${art[2]}</span><span class="diagram-link"></span><span class="diagram-node">${art[3]}</span></div><span class="art-number">${String(i+1).padStart(2,"0")} / PROJECT</span></div><div class="project-body"><div class="card-category"><span>${escapeHTML(p.categoryLabel || categories[p.category] || p.category)}</span>${exampleBadge(p)}</div><h3>${escapeHTML(p.title)}</h3><p class="project-summary">${escapeHTML(p.summary)}</p>${tags(p.technologies.slice(0,4))}<div class="card-bottom"><button class="detail-button" data-action="detail-project" data-id="${escapeHTML(p.id)}" aria-label="Voir le projet : ${escapeHTML(p.title)}">Voir le projet <span aria-hidden="true">↗</span></button><div class="card-links">${externalLink(p.github,"Code")}${externalLink(p.demo,"Démo")}</div></div>${editControls("project",p.id)}</div></article>`;
  }).join("") || `<div class="empty-state"><p>${state.data.projects.length ? "Aucun projet ne correspond à votre recherche." : "Les projets seront ajoutés prochainement."}</p>${state.data.projects.length?'<button class="button small" data-action="reset-filters">Réinitialiser les filtres</button>':""}</div>`;
}
function renderStages() {
  $("stages-list").innerHTML = state.data.internships.map(s=>`<article class="stage"><div class="stage-meta"><span>${escapeHTML(s.duration || "Dates à préciser")}</span>${exampleBadge(s)}</div><h3>${escapeHTML(s.role)}</h3><p class="stage-company">${escapeHTML(s.company)}${s.location ? ` · ${escapeHTML(s.location)}` : ""}</p><p class="stage-summary">${escapeHTML(s.summary)}</p>${tags(s.fullDetails.techStack.slice(0,5))}<button class="detail-button" data-action="detail-stage" data-id="${escapeHTML(s.id)}" aria-label="Voir l’expérience : ${escapeHTML(s.role)}">Explorer la mission <span aria-hidden="true">↗</span></button>${editControls("stage",s.id)}</article>`).join("") || '<p class="muted">Les détails des expériences seront ajoutés prochainement.</p>';
}
function renderSkills() {
  $("skills-grid").innerHTML = Object.values(state.data.skills).map((s,i)=>`<article class="skill-group"><div class="card-category"><span class="skill-number">${String(i+1).padStart(2,"0")} /</span>${exampleBadge(s)}</div><h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.description)}</p>${tags(s.items)}</article>`).join("") || '<p class="skill-group muted">Technologies à renseigner.</p>';
}
function renderEducation() {
  $("education-list").innerHTML = state.data.education.map(e=>`<article class="education-item"><p class="eyebrow">${escapeHTML(e.period || "Formation")}</p><h3>${escapeHTML(e.degree)}</h3><p>${escapeHTML(e.school)}${e.location?` · ${escapeHTML(e.location)}`:""}</p>${e.details.length?`<ul>${e.details.map(d=>`<li>${escapeHTML(d)}</li>`).join("")}</ul>`:""}${exampleBadge(e)}</article>`).join("");
  $("certifications-list").innerHTML = state.data.certifications.map(c=>`<div class="certification"><span aria-hidden="true">◇</span><div>${safeURL(c.credentialUrl)?externalLink(c.credentialUrl,c.name):escapeHTML(c.name)}<small>${escapeHTML(c.issuer)} · ${escapeHTML(c.date || "")}</small></div>${exampleBadge(c)}</div>`).join("");
}
function renderAll() {
  renderProfile(); renderProjects(); renderStages(); renderSkills(); renderEducation();
  $("sample-notice").hidden = ![...state.data.projects,...state.data.internships,...Object.values(state.data.skills),...state.data.certifications].some(p=>p.isExample);
  $("editor-bar").hidden = !state.editor;
  document.querySelectorAll(".editor-only").forEach(el=>{ el.hidden = !state.editor; });
}
function setStep(index) {
  const steps = [{description:"Collecter les données, comprendre leurs sources et construire des flux d’ingestion exploitables.",filter:"bigdata"},{description:"Nettoyer, organiser et transformer les données pour les rendre fiables et faciles à utiliser.",filter:"bigdata"},{description:"Explorer les données, expliquer les résultats et construire des analyses utiles à la décision.",filter:"analysis"}];
  state.step = index; $("lab-description").textContent = steps[index].description;
  const hasProjects = state.data.projects.some(p=>p.category===steps[index].filter);
  $("lab-link").dataset.category = hasProjects ? steps[index].filter : 'all';
  $("lab-link").innerHTML = `${hasProjects?'Explorer les projets associés':'Explorer tous les projets'} <span aria-hidden="true">→</span>`;
  document.querySelectorAll("[data-step]").forEach(el=>{const selected=Number(el.dataset.step)===index;el.classList.toggle("active",selected);el.setAttribute("aria-pressed",String(selected));});
}
function detailSection(title, value) {
  if (!value || (Array.isArray(value) && !value.length)) return "";
  return `<section class="detail-section"><h3>${escapeHTML(title)}</h3>${Array.isArray(value)?`<ul>${value.map(v=>`<li>${escapeHTML(v)}</li>`).join("")}</ul>`:`<p>${escapeHTML(value)}</p>`}</section>`;
}
function openDetail(kind,id) {
  const item = (kind === "project" ? state.data.projects : state.data.internships).find(p=>p.id===id); if (!item) return;
  const d = item.fullDetails;
  const sections = kind === "project" ? [["Le problème",d.problem],["Les données",d.dataset],["La démarche",d.methodology],["L’architecture",d.architecture],["Résultats et évaluation",d.metrics],["Ce que j’en retiens",d.keyLearnings]] : [["Le contexte",d.context],["L’objectif",d.objective],["Mes contributions",d.responsibilities],["L’architecture",d.architecture.map(a=>`${a.step} — ${a.desc}`)],["Les résultats",d.results]];
  $("detail-content").innerHTML = `${exampleBadge(item)}<h2 id="detail-title" class="detail-title">${escapeHTML(item.title || item.role)}</h2>${item.isExample?'<p class="sample-notice">Fiche d’exemple : les entreprises, missions et résultats ci-dessous ne constituent pas des réalisations vérifiées de Saïd.</p>':""}<p class="form-note">${escapeHTML(item.academicYear || [item.company,item.duration].filter(Boolean).join(" · "))}</p>${tags(item.technologies || d.techStack)}${sections.map(s=>detailSection(...s)).join("")}<div class="detail-actions">${externalLink(item.github,"Consulter le code","button small")}${externalLink(item.demo,"Ouvrir la démo","button primary small")}</div>`;
  $("detail-dialog").showModal(); $("detail-dialog").scrollTop = 0;
}

// Editor forms: text is escaped on input and output; URLs have a separate allowlist.
function field(name,label,value="",options={}) {
  const attrs = `name="${escapeHTML(name)}" id="field-${escapeHTML(name)}" ${options.required?"required":""} ${options.type==='url'?'placeholder="https://…"':""}`;
  return `<label class="field ${options.wide || options.area ? "full":""}" for="field-${escapeHTML(name)}"><span>${escapeHTML(label)}</span>${options.area?`<textarea ${attrs}>${escapeHTML(value)}</textarea>`:`<input ${attrs} type="${options.type || "text"}" value="${escapeHTML(value)}">`}${options.hint?`<small>${escapeHTML(options.hint)}</small>`:""}</label>`;
}
function showForm(title,body,onSave,note="") {
  $("edit-title").textContent = title;
  $("edit-content").innerHTML = `<form id="editor-form">${note?`<p class="form-note">${escapeHTML(note)}</p>`:""}${body}<p id="form-error" class="form-error" role="alert"></p><div class="form-actions"><button type="button" class="button small" data-action="close-edit">Annuler</button><button class="button primary small" type="submit">Enregistrer</button></div></form>`;
  $("editor-form").addEventListener("submit",event=>{
    event.preventDefault();
    try { const next = clone(state.data); onSave(new FormData(event.currentTarget),next); validateData(next); state.data=next; persist(); renderAll(); $("edit-dialog").close(); }
    catch(error) { $("form-error").textContent=error.message; }
  });
  $("edit-dialog").showModal(); $("edit-dialog").scrollTop=0;
}
function openProfile() {
  const p=state.data.profile;
  const fields=[['name','Prénom et nom'],['statusBadge','Disponibilité / recherche'],['location','Localisation et mobilité'],['studyLabel','Formation courte (ex. 5e année · UIR)'],['studyYear','Année d’études (ex. 5e)'],['reportedInternships','Nombre total de stages réalisés'],['email','Adresse e-mail'],['phone','Téléphone'],['github','Lien GitHub'],['linkedin','Lien LinkedIn'],['cvPdfUrl','Chemin ou lien vers le CV PDF'],['targetRole','Objectif professionnel'],['shortBio','Présentation courte'],['aboutDescription','À propos'],['experienceIntro','Introduction des expériences'],['contactIntro','Texte de contact']];
  showForm("Mon profil",`<div class="form-grid">${fields.map(([key,label])=>field(key,label,p[key],{required:key==='name',area:['shortBio','aboutDescription','experienceIntro','contactIntro'].includes(key),type:key==='email'?'email':key==='reportedInternships'?'number':['github','linkedin'].includes(key)?'url':'text',hint:key==='cvPdfUrl'?'Ajoutez le PDF dans assets/, puis indiquez son chemin. Exemple : assets/CV_Said.pdf.':""})).join("")}</div>`,(form,next)=>{
    for(const [key] of fields) next.profile[key]=String(form.get(key) || "").trim();
    const count=Number(next.profile.reportedInternships); if(!Number.isInteger(count)||count<0) throw new Error("Le nombre de stages doit être un entier positif ou nul."); next.profile.reportedInternships=count;
    for(const key of ['github','linkedin']) if(next.profile[key]&&!safeURL(next.profile[key])) throw new Error(`Le lien ${key} doit être une URL HTTP(S) valide.`);
    if(next.profile.cvPdfUrl&&!safeURL(next.profile.cvPdfUrl,true)) throw new Error("Le CV doit être une URL HTTP(S) ou un fichier PDF dans assets/.");
  },"Ne remplissez que les informations que vous souhaitez partager publiquement. Les champs de contact vides ne sont pas affichés.");
}
function openProject(id) {
  const existing=state.data.projects.find(p=>p.id===id);
  const p=existing || {id:crypto.randomUUID(),title:"",category:"bigdata",summary:"",technologies:[],fullDetails:{}};
  const d=p.fullDetails;
  let body=`<div class="form-grid">${field('title','Titre du projet',p.title,{required:true,wide:true})}<label class="field"><span>Catégorie</span><select name="category">${Object.entries(categories).map(([key,label])=>`<option value="${key}" ${p.category===key?'selected':''}>${label}</option>`).join("")}</select></label>${field('academicYear','Période / contexte',p.academicYear)}${field('summary','Résumé en deux phrases',p.summary,{area:true,required:true})}${field('technologies','Technologies, séparées par des virgules',p.technologies.join(', '),{wide:true})}${field('github','Lien vers le code',p.github,{type:'url'})}${field('demo','Lien de démonstration',p.demo,{type:'url'})}${[['problem','Problème à résoudre'],['dataset','Données utilisées et source'],['methodology','Démarche et contribution personnelle'],['architecture','Architecture / étapes du pipeline'],['metrics','Résultats mesurés et conditions de mesure'],['keyLearnings','Apprentissages et limites']].map(([key,label])=>field(key,label,d[key],{area:true})).join('')}</div><label class="checkbox-field"><input type="checkbox" name="isExample" ${p.isExample?'checked':''}> Fiche d’exemple (ne représente pas encore mon travail)</label>`;
  showForm(existing?"Modifier le projet":"Ajouter un projet",body,(form,next)=>{
    const item={...p,fullDetails:{...d}};
    for(const key of ['title','summary','academicYear','github','demo','category']) item[key]=String(form.get(key)||'').trim();
    for(const key of ['github','demo']) if(item[key]&&!safeURL(item[key])) throw new Error(`Le lien ${key} doit être une URL HTTP(S) valide, sans texte d’exemple.`);
    item.categoryLabel=categories[item.category]; item.technologies=splitList(form.get('technologies'),','); item.isExample=form.has('isExample');
    for(const key of ['problem','dataset','methodology','architecture','metrics','keyLearnings']) item.fullDetails[key]=String(form.get(key)||'').trim();
    const index=next.projects.findIndex(v=>v.id===id); if(index<0) next.projects.push(item); else next.projects[index]=item;
  },"Présentez votre contribution réelle. Si vous n’avez pas mesuré de résultat chiffré, expliquez ce que vous avez obtenu et les limites du projet.");
}
const splitList = (value,separator='\n') => String(value || '').split(separator).map(v=>v.trim()).filter(Boolean);
function openStage(id) {
  const existing=state.data.internships.find(s=>s.id===id);
  const s=existing || {id:crypto.randomUUID(),role:'',company:'',summary:'',fullDetails:{techStack:[],responsibilities:[],results:[],architecture:[]}};
  const d=s.fullDetails;
  const body=`<div class="form-grid">${field('role','Intitulé du stage',s.role,{required:true})}${field('company','Entreprise',s.company,{required:true})}${field('duration','Dates et durée',s.duration)}${field('location','Lieu / télétravail',s.location)}${field('summary','Résumé de la mission',s.summary,{area:true,required:true})}${field('techStack','Technologies, séparées par des virgules',d.techStack.join(', '),{wide:true})}${field('context','Contexte',d.context,{area:true})}${field('objective','Objectif',d.objective,{area:true})}${field('responsibilities','Mes contributions — une par ligne',d.responsibilities.join('\n'),{area:true})}${field('architecture','Architecture — une étape par ligne, au format Étape : description',d.architecture.map(a=>`${a.step} : ${a.desc}`).join('\n'),{area:true})}${field('results','Résultats vérifiés — un par ligne',d.results.join('\n'),{area:true})}</div><label class="checkbox-field"><input type="checkbox" name="isExample" ${s.isExample?'checked':''}> Fiche d’exemple (ne représente pas encore mon expérience)</label>`;
  showForm(existing?"Modifier le stage":"Ajouter un stage",body,(form,next)=>{
    const item={...s,fullDetails:{...d}};
    for(const key of ['role','company','duration','location','summary']) item[key]=String(form.get(key)||'').trim();
    for(const key of ['context','objective']) item.fullDetails[key]=String(form.get(key)||'').trim();
    for(const key of ['responsibilities','results']) item.fullDetails[key]=splitList(form.get(key));
    item.fullDetails.techStack=splitList(form.get('techStack'),',');
    item.fullDetails.architecture=splitList(form.get('architecture')).map((line,index)=>{const split=line.indexOf(':');return split<0?{step:`Étape ${index+1}`,desc:line}:{step:line.slice(0,split).trim(),desc:line.slice(split+1).trim()};});
    item.isExample=form.has('isExample');const index=next.internships.findIndex(v=>v.id===id);if(index<0)next.internships.push(item);else next.internships[index]=item;
  },"Décrivez ce que vous avez personnellement réalisé pendant le stage. Vous pourrez compléter cette fiche plus tard.");
}
function openSkills() {
  const groups=Object.entries(state.data.skills);
  const body=groups.map(([key,s],i)=>`<fieldset class="detail-section"><legend>${escapeHTML(s.title)}</legend><div class="form-grid">${field(`title-${i}`,'Nom du groupe',s.title,{required:true})}${field(`description-${i}`,'Contexte / niveau',s.description)}${field(`items-${i}`,'Technologies séparées par des virgules',s.items.join(', '),{wide:true,hint:'Vous pouvez indiquer « en apprentissage » ou « à approfondir » dans le contexte.'})}</div><label class="checkbox-field"><input type="checkbox" name="example-${i}" ${s.isExample?'checked':''}> Liste d’exemple à personnaliser</label><label class="checkbox-field"><input type="checkbox" name="remove-${i}"> Retirer ce groupe</label></fieldset>`).join('')+`<div class="form-grid">${field('new-title','Ajouter un groupe (facultatif)')}${field('new-items','Technologies du nouveau groupe')}</div>`;
  showForm("Mes technologies",body,(form,next)=>{
    next.skills={};groups.forEach(([key,s],i)=>{if(!form.has(`remove-${i}`))next.skills[key]={...s,title:String(form.get(`title-${i}`)).trim(),description:String(form.get(`description-${i}`)).trim(),items:splitList(form.get(`items-${i}`),','),isExample:form.has(`example-${i}`)};});
    const title=String(form.get('new-title')||'').trim();if(title)next.skills[`group-${Date.now()}`]={title,description:'',items:splitList(form.get('new-items'),','),isExample:false};
  },"Gardez les technologies que vous utilisez réellement ou que vous souhaitez apprendre, en précisant votre niveau. Aucun pourcentage de maîtrise n’est nécessaire.");
}
function openListEditor(kind) {
  const education=kind==='education';
  const list=state.data[kind];
  const fields=education?[['degree','Formation / diplôme'],['school','Établissement'],['period','Période'],['location','Lieu'],['details','Détails — un par ligne']]:[['name','Certification'],['issuer','Organisme'],['date','Date'],['credentialUrl','Lien du certificat']];
  const rows=[...list,{}];
  const body=rows.map((item,i)=>`<fieldset class="detail-section"><legend>${i===list.length?'Ajouter (facultatif)':`${education?'Formation':'Certification'} ${i+1}`}</legend><div class="form-grid">${fields.map(([key,label])=>field(`${key}-${i}`,label,key==='details'?(item[key]||[]).join('\n'):item[key],{area:key==='details',type:key==='credentialUrl'?'url':'text'})).join('')}</div>${i<list.length?`<label class="checkbox-field"><input type="checkbox" name="remove-${i}"> Retirer cet élément</label>`:''}<label class="checkbox-field"><input type="checkbox" name="example-${i}" ${item.isExample?'checked':''}> Exemple à personnaliser</label></fieldset>`).join('');
  showForm(education?"Ma formation":"Mes certifications",body,(form,next)=>{
    next[kind]=rows.flatMap((item,i)=>{
      if(form.has(`remove-${i}`))return [];
      const record={...item}; for(const [key] of fields)record[key]=key==='details'?splitList(form.get(`${key}-${i}`)):String(form.get(`${key}-${i}`)||'').trim();
      if(i===list.length&&!record[fields[0][0]])return [];
      if(!record[fields[0][0]]||!record[fields[1][0]])throw new Error('Renseignez le titre et l’établissement / organisme, ou retirez cet élément.');
      if(record.credentialUrl&&!safeURL(record.credentialUrl))throw new Error('Le certificat doit avoir un lien HTTP(S) valide.');
      record.isExample=form.has(`example-${i}`);return [record];
    });
  },education?"Renseignez votre parcours réel, avec les dates exactes quand vous les connaissez.":"Ajoutez uniquement les certifications obtenues. Un lien vers votre attestation permet de les vérifier.");
}
function deleteItem(kind,id) {
  const key=kind==='project'?'projects':'internships';const item=state.data[key].find(v=>v.id===id);if(!item)return;
  showForm("Supprimer cette fiche",`<p>Retirer « ${escapeHTML(item.title||item.role)} » du brouillon ? Le fichier publié restera inchangé jusqu’au prochain export.</p>`,(_,next)=>{next[key]=next[key].filter(v=>v.id!==id);});
  $("editor-form").querySelector('[type="submit"]').textContent='Supprimer';
}
function exportData() {
  validateData(state.data);
  const text=`/** Portfolio — données publiées. Généré par l’éditeur local. */\nconst defaultPortfolioData = ${JSON.stringify(state.data,null,2)};\nvar portfolioData = defaultPortfolioData;\n`;
  const url=URL.createObjectURL(new Blob([text],{type:'text/javascript;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='data.js';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  notify('Export prêt. Remplacez js/data.js dans votre dépôt GitHub pour publier ces changements.');
}
async function copyEmail() {
  try { await navigator.clipboard.writeText(state.data.profile.email); notify('Adresse e-mail copiée.'); }
  catch { notify('Copie indisponible. Sélectionnez l’adresse e-mail affichée pour la copier.'); }
}
function setupEvents() {
  $("search").addEventListener('input',event=>{state.query=event.target.value;renderProjects();});
  $("mobile-menu-btn").addEventListener('click',()=>{const open=$("navigation").classList.toggle('open');$("mobile-menu-btn").setAttribute('aria-expanded',String(open));$("mobile-menu-btn").setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');});
  $("navigation").addEventListener('click',event=>{if(event.target.closest('a')){$("navigation").classList.remove('open');$("mobile-menu-btn").setAttribute('aria-expanded','false');$("mobile-menu-btn").setAttribute('aria-label','Ouvrir le menu');}});
  $("lab-link").addEventListener('click',()=>{state.filter=$("lab-link").dataset.category;state.query='';$("search").value='';renderProjects();});
  document.addEventListener('click',event=>{
    const button=event.target.closest('button[data-action],button[data-filter],button[data-step]');if(!button)return;
    if(button.dataset.filter!==undefined){state.filter=button.dataset.filter;renderProjects();return;}
    if(button.dataset.step!==undefined){setStep(Number(button.dataset.step));return;}
    const {action,id}=button.dataset;
    if(action==='close-detail')return $("detail-dialog").close();
    if(action==='close-edit')return $("edit-dialog").close();
    if(action==='detail-project')return openDetail('project',id);
    if(action==='detail-stage')return openDetail('stage',id);
    if(action==='copy-email')return copyEmail();
    if(action==='reset-filters'){state.query='';state.filter='all';$("search").value='';return renderProjects();}
    if(!state.editor)return;
    if(action==='profile')openProfile();
    if(action==='skills')openSkills();
    if(action==='education'||action==='certifications')openListEditor(action);
    if(action==='add-project'||action==='edit-project')openProject(id);
    if(action==='add-stage'||action==='edit-stage')openStage(id);
    if(action==='delete-project')deleteItem('project',id);
    if(action==='delete-stage')deleteItem('stage',id);
    if(action==='export')exportData();
    if(action==='exit-editor'){const url=new URL(location.href);url.searchParams.delete('edit');location.href=url.href;}
    if(action==='import-legacy')importLegacy();
  });
  // Native dialogs provide Escape handling, focus containment and focus restoration.
  for(const id of ['detail-dialog','edit-dialog']) $(id).addEventListener('click',event=>{if(event.target===$(id)){const r=$(id).getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)$(id).close();}});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)document.querySelectorAll('#navigation a').forEach(a=>a.classList.toggle('active',a.hash===`#${e.target.id}`));},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main section[id]').forEach(s=>observer.observe(s));}
}
function importLegacy() {
  try {
    const legacy=JSON.parse(localStorage.getItem(LEGACY_KEY));
    showForm('Récupérer l’ancien brouillon','<p>Les projets et stages de l’ancienne version remplaceront ceux du brouillon actuel. Ils seront marqués comme exemples à vérifier ; votre profil actuel sera conservé.</p>',(_,next)=>{
      for(const key of ['projects','internships'])next[key]=legacy[key].map(item=>({...item,isExample:true}));
    });
  } catch { notify('Impossible de lire l’ancien brouillon. Il n’a pas été supprimé.'); }
}
document.addEventListener('DOMContentLoaded',()=>{
  loadDraft(); setupEvents(); renderAll(); setStep(0);
  if(state.editor){try{if(localStorage.getItem(LEGACY_KEY))$("editor-bar").querySelector('.actions').insertAdjacentHTML('beforeend','<button data-action="import-legacy">Récupérer l’ancien brouillon</button>');}catch{/* Draft storage is optional. */}}
});
