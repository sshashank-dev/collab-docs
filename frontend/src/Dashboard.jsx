import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";



import api from "./api";

import Footer from "./Footer";



const TEMPLATE_CATALOG = [
    {
        id: "blank",
        name: "Blank document",
        subtitle: "Start from scratch",
        category: "Recently used",
        previewType: "blank",
        accent: "#2563eb",
        title: "Blank document",
        content: "",
    },
    {
        id: "resume-serif",
        name: "Resume",
        subtitle: "Professional",
        category: "Recently used",
        previewType: "resume",
        accent: "#2563eb",
        title: "Resume — Professional",
        content: `<h1>Your Name</h1>
            <p><strong>FULL STACK DEVELOPER</strong> · Jaipur, India · email@example.com · +91 00000 00000</p>
            <hr>
            <h2>Profile</h2>
            <blockquote>A product-minded developer who turns ideas into clean, reliable digital experiences.</blockquote>
            <p>Full stack developer experienced in React, Node.js, REST APIs and MongoDB. Replace this summary with two or three sentences that explain your strongest skills and career direction.</p>
            <h2>Experience</h2>
            <p><strong>Software Developer Intern</strong><br>Company Name · 2025–2026</p>
            <ul><li>Built responsive product interfaces and reusable components used across the application.</li><li>Integrated APIs, authentication and database-backed workflows.</li><li>Worked with designers and engineers through Git-based development.</li></ul>
            <p><strong>Web Developer</strong><br>Company Name · 2024–2025</p>
            <ul><li>Delivered production-ready pages and improved usability across key user journeys.</li><li>Debugged frontend and backend issues across development environments.</li></ul>
            <h2>Selected Projects</h2>
            <p><strong>CollabDocs</strong> — A real-time collaborative document platform with shared editing, authentication and document management.</p>
            <p><strong>Project Name</strong> — Describe the problem, solution, technology and measurable result.</p>
            <h2>Education</h2>
            <p><strong>Bachelor's Degree</strong> · University Name · 2022–2026</p>
            <h2>Skills</h2>
            <p>JavaScript · React · Node.js · Express · MongoDB · Git · REST APIs · UI Development</p>
        `,
    },
    {
        id: "resume-swiss",
        name: "Resume",
        subtitle: "Swiss minimal",
        category: "CVs",
        previewType: "resume-swiss",
        accent: "#111827",
        title: "Resume — Swiss Minimal",
        content: `<h1>Your Name</h1>
            <p><strong>PRODUCT ENGINEER</strong> · Jaipur, India · email@example.com</p>
            <hr>
            <h2>01 / EXPERIENCE</h2>
            <p><strong>Software Engineer</strong> — Company Name · 2024–Present</p>
            <ul><li>Owned features from requirements through implementation and release.</li><li>Worked across frontend interfaces, APIs and data models.</li></ul>
            <p><strong>Developer Intern</strong> — Company Name · 2023–2024</p>
            <ul><li>Implemented product features and API integrations.</li><li>Worked with code reviews, Git and agile delivery.</li></ul>
            <h2>02 / SELECTED WORK</h2>
            <p><strong>Project Name</strong> — Product description, contribution and measurable outcome.</p>
            <p><strong>Second Project</strong> — A short case-study style description of your strongest work.</p>
            <h2>03 / EDUCATION</h2>
            <p>University Name — Bachelor's Degree · 2022–2026</p>
            <h2>04 / SKILLS</h2>
            <p>React · Node.js · MongoDB · TypeScript · Git · REST APIs · Product Development</p>
        `,
    },
    {
        id: "resume-modern-writer",
        name: "Resume",
        subtitle: "Creative",
        category: "CVs",
        previewType: "resume-modern",
        accent: "#ec4899",
        title: "Resume — Creative",
        content: `<h1>YOUR NAME</h1>
            <p><strong>FULL STACK DEVELOPER</strong></p>
            <hr>
            <h2>ABOUT</h2>
            <blockquote>Creative developer focused on turning complex ideas into simple, useful digital products.</blockquote>
            <p>Write a concise personal introduction here. Mention your strongest technologies, the kind of products you enjoy building and the direction you want your career to take.</p>
            <h2>EXPERIENCE</h2>
            <p><strong>Developer Intern</strong> — Company Name</p>
            <p>Describe your strongest contribution, the technology you used and the impact of your work.</p>
            <p><strong>Freelance / Personal Projects</strong></p>
            <p>Highlight work that demonstrates ownership, design thinking and practical problem solving.</p>
            <h2>FEATURED PROJECTS</h2>
            <p><strong>Project One</strong> — Problem → solution → technology → result.</p>
            <p><strong>Project Two</strong> — A second project that demonstrates a different capability.</p>
            <h2>CAPABILITIES</h2>
            <p>Frontend · Backend · Databases · Product Design · APIs · Collaboration</p>
        `,
    },
    {
        id: "cover-letter",
        name: "Cover letter",
        subtitle: "Job application",
        category: "Letters",
        previewType: "cover",
        accent: "#2563eb",
        title: "Cover Letter",
        content: `<p><strong>Your Name</strong><br>Jaipur, Rajasthan · email@example.com · +91 00000 00000</p>
            <hr>
            <p>October 1, 2026</p>
            <p><strong>Hiring Manager</strong><br>Company Name<br>City, Country</p>
            <h1>Application for [Role Title]</h1>
            <p>Dear Hiring Manager,</p>
            <blockquote>I am excited to apply for the [Role Title] position and contribute my experience building thoughtful, reliable digital products.</blockquote>
            <p>I am particularly interested in [Company Name] because of its work in [product, industry or mission]. My background in [relevant area] has taught me how to move from an idea to a working product while collaborating across technical and creative teams.</p>
            <h2>Why I can contribute</h2>
            <ul><li><strong>Technical:</strong> React, Node.js, APIs, databases and modern web development.</li><li><strong>Product:</strong> Strong attention to usability, detail and practical outcomes.</li><li><strong>Ownership:</strong> Comfortable taking a feature from concept through implementation and refinement.</li></ul>
            <p>One project I am especially proud of involved [project or achievement]. I [specific contribution] and achieved [result].</p>
            <p>I would welcome the opportunity to discuss how I could contribute to your team. Thank you for your time and consideration.</p>
            <p>Sincerely,<br><strong>Your Name</strong></p>
        `,
    },
    {
        id: "business-letter",
        name: "Business letter",
        subtitle: "Formal communication",
        category: "Letters",
        previewType: "letter",
        accent: "#10b981",
        title: "Business Letter",
        content: `<p><strong>YOUR COMPANY</strong><br>Your Name · Your Title<br>Address Line 1 · City, State, PIN<br>email@example.com · +91 00000 00000</p>
            <hr>
            <p>October 1, 2026</p>
            <p><strong>Recipient Name</strong><br>Recipient Company<br>Recipient Address<br>City, State, PIN</p>
            <h1>Subject: [Letter subject]</h1>
            <p>Dear [Recipient Name],</p>
            <p>Use the opening paragraph to clearly explain why you are writing and provide the essential context.</p>
            <h2>Background</h2>
            <p>Use this section for supporting information, relevant details and the situation that led to the request.</p>
            <h2>Requested action</h2>
            <p>Clearly state the action, decision or response you are requesting and include any important dates.</p>
            <blockquote>Thank you for your attention. We appreciate your time and look forward to your response.</blockquote>
            <p>Sincerely,<br><strong>Your Name</strong><br>Your Title</p>
        `,
    },
    {
        id: "meeting-notes",
        name: "Meeting notes",
        subtitle: "Agenda & actions",
        category: "Work",
        previewType: "notes",
        accent: "#0f766e",
        title: "Meeting Notes",
        content: `<p style="color:#0f766e; font-size:0.9em; letter-spacing:.08em;">TEAM SESSION · PRODUCT REVIEW</p><h1>Meeting Notes</h1>
            <p><strong>PRODUCT REVIEW</strong> · October 1, 2026 · 10:00 AM</p>
            <hr>
            <p><strong>Participants:</strong> [Names] · <strong>Owner:</strong> [Name] · <strong>Duration:</strong> 45 min</p>
            <h2>Agenda</h2>
            <ol><li>Review progress since the last meeting.</li><li>Discuss current priorities and blockers.</li><li>Agree on decisions and next actions.</li></ol>
            <h2>Discussion</h2>
            <p><strong>01 — Product progress</strong></p>
            <p>Capture the important discussion points, context and alternatives considered.</p>
            <p><strong>02 — Open questions</strong></p>
            <p>Record unresolved questions that need follow-up.</p>
            <h2>Decisions</h2>
            <ul><li><strong>Decision:</strong> [Decision] — Owner: [Name]</li><li><strong>Decision:</strong> [Decision] — Owner: [Name]</li></ul>
            <h2>Action Items</h2>
            <ul><li>☐ [Action] — Owner: [Name] — Due: [Date]</li><li>☐ [Action] — Owner: [Name] — Due: [Date]</li><li>☐ [Action] — Owner: [Name] — Due: [Date]</li></ul>
            <hr>
            <p><strong>Next meeting:</strong> [Date and time] · [Primary objective]</p>
        `,
    },
    {
        id: "project-brief",
        name: "Project brief",
        subtitle: "Plan a project",
        category: "Work",
        previewType: "brief",
        accent: "#2563eb",
        title: "Project Brief",
        content: `<p style="color:#2563eb; font-size:0.9em; letter-spacing:.08em;">PROJECT / BRIEF</p><h1>Project Brief</h1>
            <p><strong>PROJECT:</strong> [Project name] · <strong>OWNER:</strong> [Name] · <strong>STATUS:</strong> Planning</p>
            <hr>
            <blockquote>A one-page snapshot of what we are building, why it matters and how we will measure success.</blockquote>
            <h2>01 — Overview</h2>
            <p>Summarize the project, the problem it addresses and why it matters.</p>
            <h2>02 — Goals</h2>
            <ul><li>[Measurable goal one]</li><li>[Measurable goal two]</li><li>[Measurable goal three]</li></ul>
            <h2>03 — Scope</h2>
            <p><strong>In scope:</strong> List the work this project will deliver.</p>
            <p><strong>Out of scope:</strong> List related work intentionally excluded.</p>
            <h2>04 — Audience</h2>
            <p>Describe the users, customers or internal teams this project serves.</p>
            <h2>05 — Milestones</h2>
            <p><strong>Discovery</strong> — [Date] → <strong>Design</strong> — [Date] → <strong>Build</strong> — [Date] → <strong>Launch</strong> — [Date]</p>
            <h2>06 — Risks</h2>
            <p>Record known risks, dependencies and decisions that could affect delivery.</p>
        `,
    },
    {
        id: "project-proposal",
        name: "Project proposal",
        subtitle: "Client-ready",
        category: "Work",
        previewType: "project",
        accent: "#7c3aed",
        title: "Project Proposal",
        content: `<div style="text-align:center; margin-bottom:18px;"><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80" alt="Modern workspace" /></div>
            <p style="text-align:center; color:#5f6368;"><strong style="color:#6b5cff;">PROJECT PROPOSAL</strong><br>[PROJECT NAME] · Prepared for [Client / Team]</p>
            <hr>
            <blockquote>From the current challenge to a measurable solution — this proposal outlines the opportunity, approach, timeline and next steps.</blockquote>
            <p><strong>[PROJECT NAME]</strong><br>Prepared for [Client / Team] · Prepared by [Your Name] · October 2026</p>
            <hr>
            <h2><span style="color:#6b5cff;">01</span> — Executive Summary</h2>
            <p>Provide a concise overview of the opportunity, proposed solution, expected outcomes and investment required.</p>
            <h2>02 — The Opportunity</h2>
            <p>Describe the existing challenge or opportunity and its impact on the organization or customer.</p>
            <h2>03 — Proposed Solution</h2>
            <p>Explain the proposed approach, major deliverables and how the solution addresses the identified needs.</p>
            <h2>04 — Objectives</h2>
            <ul><li>Improve [metric or outcome].</li><li>Deliver [specific capability].</li><li>Create a measurable improvement in [area].</li></ul>
            <h2>05 — Timeline</h2>
            <p><strong>Phase 1</strong> Discovery · [Dates]<br><strong>Phase 2</strong> Design & Development · [Dates]<br><strong>Phase 3</strong> Testing & Launch · [Dates]</p>
            <h2>06 — Success Metrics</h2>
            <p>Define the measurable indicators that will determine whether the project achieved its objectives.</p>
            <h2>07 — Investment</h2>
            <p>Estimated project investment: <strong>[Amount]</strong></p>
            <h2>08 — Next Steps</h2>
            <ol><li>Review proposal and confirm scope.</li><li>Assign project owners.</li><li>Schedule project kickoff.</li></ol>
        `,
    },
    {
        id: "weekly-report",
        name: "Weekly report",
        subtitle: "Progress update",
        category: "Work",
        previewType: "report",
        accent: "#d97706",
        title: "Weekly Project Report",
        content: `<p style="color:#d97706; font-size:0.9em; letter-spacing:.08em;">WEEKLY UPDATE · PROJECT STATUS</p><h1>Weekly Project Report</h1>
            <p><strong>PROJECT:</strong> [Project name] · <strong>WEEK:</strong> [Date range] · <strong>STATUS:</strong> On track</p>
            <hr>
            <blockquote>Weekly snapshot: what changed, what shipped, what is blocked and what happens next.</blockquote>
            <h2>Executive Summary</h2>
            <p>Summarize the week's most important progress, changes and decisions in three to five sentences.</p>
            <h2>Completed This Week</h2>
            <ul><li><strong>Milestone:</strong> [Completed deliverable]</li><li><strong>Milestone:</strong> [Completed deliverable]</li><li><strong>Milestone:</strong> [Completed deliverable]</li></ul>
            <h2>Key Metrics</h2>
            <p><strong>Progress:</strong> [XX%] · <strong>Open tasks:</strong> [XX] · <strong>Blockers:</strong> [XX]</p>
            <h2>Challenges & Decisions</h2>
            <p>Document important blockers, decisions and changes to scope or timeline.</p>
            <h2>Next Week</h2>
            <ol><li>[Priority one]</li><li>[Priority two]</li><li>[Priority three]</li></ol>
        `,
    },
    {
        id: "software-development-proposal",
        name: "Software proposal",
        subtitle: "Technical plan",
        category: "Work",
        previewType: "project",
        accent: "#0891b2",
        title: "Software Development Proposal",
        content: `<h1>Software Development Proposal</h1>
            <p><strong>CLIENT:</strong> [Client Name] · <strong>TEAM:</strong> [Delivery Team] · <strong>VERSION:</strong> 1.0</p>
            <hr>
            <blockquote>A practical delivery plan for designing, building, testing and launching a reliable software product.</blockquote>
            <h2>01 — Product Vision</h2>
            <p>Describe the product, the users it serves and the outcome the team is expected to create.</p>
            <h2>02 — Scope</h2>
            <ul><li>Frontend application and responsive interfaces.</li><li>Backend APIs, authentication and data persistence.</li><li>Testing, deployment and documentation.</li></ul>
            <h2>03 — Technology</h2>
            <p><strong>Frontend:</strong> React / TypeScript<br><strong>Backend:</strong> Node.js / Express<br><strong>Database:</strong> MongoDB<br><strong>Deployment:</strong> Cloud hosting + managed database</p>
            <h2>04 — Delivery Plan</h2>
            <p><strong>Discovery</strong> → <strong>Design</strong> → <strong>Build</strong> → <strong>QA</strong> → <strong>Launch</strong></p>
            <h2>05 — Quality & Security</h2>
            <p>Cover testing strategy, authentication, validation, error handling, backups and monitoring.</p>
            <h2>06 — Acceptance Criteria</h2>
            <ul><li>Core user journeys function end-to-end.</li><li>Responsive behavior is verified across target devices.</li><li>Production deployment and documentation are complete.</li></ul>
        `,
    },
    {
        id: "sales-quote",
        name: "Sales quote",
        subtitle: "Client estimate",
        category: "Sales",
        previewType: "brochure",
        accent: "#db2777",
        title: "Sales Quote",
        content: `<div style="text-align:center; margin-bottom:16px;"><img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80" alt="Business meeting" /></div>
            <p style="color:#be185d; letter-spacing:.08em;">CLIENT ESTIMATE</p><h1>Sales Quote</h1>
            <p><strong>YOUR COMPANY</strong><br>Quote #1042 · October 1, 2026<br>email@example.com · +91 00000 00000</p>
            <hr>
            <h2>Prepared for</h2>
            <p><strong>Client Name</strong><br>Client Company<br>client@example.com</p>
            <h2>Project</h2>
            <p>[Project or service name] — concise description of the engagement.</p>
            <h2>Services</h2>
            <ul><li><strong>Discovery & Strategy</strong> — $800</li><li><strong>Design & Development</strong> — $2,400</li><li><strong>Testing & Launch</strong> — $600</li></ul>
            <hr>
            <p><strong>Subtotal:</strong> $3,800<br><strong>Discount:</strong> $600<br><strong>Total:</strong> $3,200</p>
            <blockquote>This quote is valid for 30 days. Final scope and delivery dates will be confirmed at kickoff.</blockquote>
            <h2>Acceptance</h2>
            <p>Client name: ____________________ &nbsp;&nbsp; Date: ____________________</p>
        `,
    },
    {
        id: "course-notes",
        name: "Course notes",
        subtitle: "Study organizer",
        category: "Education",
        previewType: "notes",
        accent: "#7c3aed",
        title: "Course Notes",
        content: `<h1>Course Notes</h1>
            <p><strong>COURSE:</strong> [Course name] · <strong>MODULE:</strong> [Module] · <strong>DATE:</strong> [Date]</p>
            <hr>
            <blockquote>Key ideas, definitions and examples — organized for fast revision.</blockquote>
            <h2>01 — Core Concepts</h2>
            <ul><li><strong>Concept:</strong> Short explanation in your own words.</li><li><strong>Concept:</strong> Short explanation and why it matters.</li></ul>
            <h2>02 — Definitions</h2>
            <p><strong>Term 01</strong> — Definition and example.<br><strong>Term 02</strong> — Definition and example.<br><strong>Term 03</strong> — Definition and example.</p>
            <h2>03 — Worked Example</h2>
            <p>Describe the problem, show the important steps and record the final answer.</p>
            <h2>04 — Key Takeaways</h2>
            <ul><li>[Takeaway]</li><li>[Takeaway]</li><li>[Takeaway]</li></ul>
            <h2>05 — Questions to Review</h2>
            <ol><li>[Question]</li><li>[Question]</li><li>[Question]</li></ol>
        `,
    },
    {
        id: "essay",
        name: "Essay",
        subtitle: "Academic writing",
        category: "Education",
        previewType: "report",
        accent: "#475569",
        title: "Academic Essay",
        content: `<p style="text-align:center"><strong>ESSAY</strong></p>
            <h1>[Essay Title]</h1>
            <p style="text-align:center">Your Name · Course Name · October 1, 2026</p>
            <hr>
            <h2>Introduction</h2>
            <p>Introduce the topic, provide context and finish with a clear thesis statement.</p>
            <h2>Argument I</h2>
            <p>Present the first major argument with evidence, explanation and a connection to the thesis.</p>
            <blockquote>“Insert a short quotation or key idea from a credible source.”</blockquote>
            <h2>Argument II</h2>
            <p>Develop the second argument and compare it with an alternative interpretation where relevant.</p>
            <h2>Counterargument</h2>
            <p>Present a reasonable opposing view and explain why the evidence supports your position.</p>
            <h2>Conclusion</h2>
            <p>Return to the central argument, summarize the strongest evidence and explain the broader significance.</p>
            <h2>References</h2>
            <p>Author. <em>Title of Source.</em> Publisher, Year.<br>Author. “Article Title.” Publication, Year.</p>
        `,
    },
    {
        id: "science-lab-report",
        name: "Lab report",
        subtitle: "Research format",
        category: "Education",
        previewType: "report",
        accent: "#059669",
        title: "Science Lab Report",
        content: `<h1>Science Lab Report</h1>
            <p><strong>Experiment:</strong> [Experiment title]<br><strong>Name:</strong> [Student name] · <strong>Date:</strong> [Date]</p>
            <hr>
            <h2>Abstract</h2>
            <p>Summarize the purpose, method, major result and conclusion in a short paragraph.</p>
            <h2>Question & Hypothesis</h2>
            <p><strong>Question:</strong> [What are you investigating?]</p>
            <p><strong>Hypothesis:</strong> If [condition], then [expected outcome] because [reason].</p>
            <h2>Materials</h2>
            <ul><li>[Material]</li><li>[Material]</li><li>[Material]</li></ul>
            <h2>Method</h2>
            <ol><li>Describe the first experimental step.</li><li>Describe the second step.</li><li>Record controls and variables.</li></ol>
            <h2>Results</h2>
            <p>Insert observations, measurements, charts or images of the experiment here.</p>
            <h2>Analysis</h2>
            <p>Explain the pattern in the results and whether the evidence supports the hypothesis.</p>
            <h2>Conclusion</h2>
            <p>State the conclusion and identify limitations or possible improvements.</p>
            <h2>References</h2>
            <p>[Source 1]<br>[Source 2]</p>
        `,
    },
    {
        id: "onboarding-notes",
        name: "Onboarding guide",
        subtitle: "New team member",
        category: "Work",
        previewType: "brief",
        accent: "#ea580c",
        title: "New Team Member Onboarding",
        content: `<h1>New Hire Onboarding</h1>
            <p><strong>WELCOME, [NAME]</strong> · [TEAM] · Week 01</p>
            <hr>
            <blockquote>Welcome to the team. Use this guide to understand the people, tools, priorities and first-week goals that will help you get started.</blockquote>
            <h2>01 — Welcome</h2>
            <p>Short introduction to the company, team mission and what success looks like in the first 30 days.</p>
            <h2>02 — People</h2>
            <ul><li><strong>Manager:</strong> [Name]</li><li><strong>Buddy:</strong> [Name]</li><li><strong>Team:</strong> [Names / roles]</li></ul>
            <h2>03 — Tools & Access</h2>
            <ul><li>☐ Email and calendar</li><li>☐ Source control</li><li>☐ Project management</li><li>☐ Development environment</li></ul>
            <h2>04 — First Week</h2>
            <ol><li>Meet the team and understand responsibilities.</li><li>Set up tools and development access.</li><li>Read the product and engineering documentation.</li><li>Complete a small first contribution.</li></ol>
            <h2>05 — 30 / 60 / 90 Days</h2>
            <p><strong>30 days:</strong> Understand the product and workflows.<br><strong>60 days:</strong> Own meaningful tasks independently.<br><strong>90 days:</strong> Deliver measurable impact in the role.</p>
        `,
    },
    {
        id: "travel-planner",
        name: "Travel planner",
        subtitle: "Trip organizer",
        category: "Personal",
        previewType: "notes",
        accent: "#0891b2",
        title: "Travel Planner",
        content: `<div style="text-align:center; margin-bottom:16px;"><img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80" alt="Travel landscape" /></div>
            <p style="color:#0f766e; letter-spacing:.08em;">TRIP PLAN · 2026</p><h1>Weekend in Jaipur</h1>
            <p><strong>TRIP PLAN</strong> · October 10–12, 2026 · 3 days</p>
            <hr>
            <blockquote>Slow mornings, local food, architecture and enough open time to explore without rushing.</blockquote>
            <h2>Trip Snapshot</h2>
            <p><strong>Stay:</strong> [Hotel] · <strong>Budget:</strong> ₹[Amount] · <strong>Travel:</strong> [Mode]</p>
            <h2>Day 01 — Old City</h2>
            <ol><li>Morning: Breakfast and city walk.</li><li>Afternoon: Palace / museum visit.</li><li>Evening: Local market and dinner.</li></ol>
            <h2>Day 02 — Explore</h2>
            <ol><li>Morning: Landmark visit.</li><li>Afternoon: Café / shopping.</li><li>Evening: Sunset viewpoint.</li></ol>
            <h2>Day 03 — Slow Morning</h2>
            <ol><li>Breakfast and checkout.</li><li>One final local experience.</li><li>Departure.</li></ol>
            <h2>Packing List</h2>
            <ul><li>☐ ID / tickets</li><li>☐ Comfortable shoes</li><li>☐ Chargers / power bank</li><li>☐ Water bottle</li></ul>
        `,
    },
    {
        id: "to-do-list",
        name: "To-do list",
        subtitle: "Personal productivity",
        category: "Personal",
        previewType: "notes",
        accent: "#2563eb",
        title: "Weekly To-Do List",
        content: `<h1>Weekly Priorities</h1>
            <p><strong>WEEK OF:</strong> October 1, 2026 · <strong>FOCUS:</strong> Ship meaningful work</p>
            <hr>
            <h2>Top 3</h2>
            <ul><li>☐ Finish the highest-priority feature.</li><li>☐ Review and resolve open issues.</li><li>☐ Prepare the next release.</li></ul>
            <h2>Work</h2>
            <ul><li>☐ [Task] — Due [Date]</li><li>☐ [Task] — Due [Date]</li><li>☐ [Task] — Due [Date]</li></ul>
            <h2>Personal</h2>
            <ul><li>☐ [Task]</li><li>☐ [Task]</li></ul>
            <h2>Notes</h2>
            <blockquote>Keep this section for reminders, ideas and anything that should not get lost.</blockquote>
            <h2>Done This Week</h2>
            <p>✓ [Completed item]<br>✓ [Completed item]</p>
        `,
    },
    {
        id: "modern-resume",
        name: "Resume",
        subtitle: "Modern professional",
        category: "CVs",
        previewType: "resume-modern",
        accent: "#1a73e8",
        title: "Resume — Modern Professional",
        content: `<h1>Your Name</h1>
            <p><strong>PRODUCT DESIGNER / DEVELOPER</strong> · City, Country · email@example.com · +91 00000 00000</p>
            <hr>
            <h2>Summary</h2>
            <p>Write a focused two-to-three sentence summary highlighting your experience, strongest skills and the kind of role you are looking for.</p>
            <h2>Experience</h2>
            <p><strong>Senior Role</strong><br>Company Name · 2024–Present</p>
            <ul><li>Describe a measurable contribution and the result it created.</li><li>Highlight ownership, collaboration and the tools you used.</li></ul>
            <p><strong>Previous Role</strong><br>Company Name · 2022–2024</p>
            <ul><li>Describe an important project or responsibility.</li><li>Include a measurable outcome where possible.</li></ul>
            <h2>Projects</h2>
            <p><strong>Project Name</strong> — Problem, solution, technology and result.</p>
            <h2>Education</h2>
            <p><strong>Degree / Program</strong> · University Name · 2022–2026</p>
            <h2>Skills</h2>
            <p>React · JavaScript · Node.js · MongoDB · APIs · Git · Product Design</p>
        `,
    },
    {
        id: "one-page-resume",
        name: "Resume",
        subtitle: "One page",
        category: "CVs",
        previewType: "resume-swiss",
        accent: "#202124",
        title: "Resume — One Page",
        content: `<h1>Your Name</h1>
            <p><strong>ROLE TITLE</strong> · City, Country · email@example.com · portfolio.example</p>
            <hr>
            <h2>Experience</h2>
            <p><strong>Company Name</strong> — Role · 2024–Present</p>
            <ul><li>Impact statement with a clear result or metric.</li><li>Second contribution showing ownership and collaboration.</li></ul>
            <p><strong>Company Name</strong> — Role · 2022–2024</p>
            <ul><li>Delivered a meaningful product or process improvement.</li><li>Worked with cross-functional teams to ship reliable work.</li></ul>
            <h2>Education</h2>
            <p>University Name — Bachelor's Degree · 2022–2026</p>
            <h2>Skills</h2>
            <p>Technology · Product · Communication · Leadership · Research</p>
        `,
    },
    {
        id: "meeting-agenda",
        name: "Meeting agenda",
        subtitle: "Plan a discussion",
        category: "Work",
        previewType: "notes",
        accent: "#0f766e",
        title: "Meeting Agenda",
        content: `<h1>Meeting Agenda</h1>
            <p><strong>MEETING:</strong> [Meeting name] · <strong>DATE:</strong> [Date] · <strong>TIME:</strong> [Time]</p>
            <hr>
            <p><strong>Participants:</strong> [Names] · <strong>Facilitator:</strong> [Name] · <strong>Notes:</strong> [Name]</p>
            <h2>Objectives</h2>
            <ul><li>Align on the most important decision.</li><li>Review progress and blockers.</li><li>Leave with clear owners and next steps.</li></ul>
            <h2>Agenda</h2>
            <ol><li><strong>Welcome & context</strong> — 5 min</li><li><strong>Progress update</strong> — 10 min</li><li><strong>Discussion</strong> — 20 min</li><li><strong>Decisions & actions</strong> — 10 min</li></ol>
            <h2>Decisions</h2>
            <p>Record decisions made during the meeting and who owns each follow-up.</p>
            <h2>Action items</h2>
            <ul><li>☐ [Action] — [Owner] — [Due date]</li><li>☐ [Action] — [Owner] — [Due date]</li></ul>
        `,
    },
    {
        id: "business-memo",
        name: "Business memo",
        subtitle: "Internal update",
        category: "Work",
        previewType: "letter",
        accent: "#2563eb",
        title: "Business Memo",
        content: `<p><strong>MEMORANDUM</strong></p>
            <p><strong>TO:</strong> [Team / Recipient]<br><strong>FROM:</strong> [Your Name]<br><strong>DATE:</strong> [Date]<br><strong>SUBJECT:</strong> [Subject]</p>
            <hr>
            <h1>[Memo title]</h1>
            <p>Use the opening paragraph to state the purpose of the memo and the most important information the reader needs to know.</p>
            <h2>Background</h2>
            <p>Provide the context, relevant facts and current situation.</p>
            <h2>Key points</h2>
            <ul><li><strong>Point one:</strong> Supporting detail.</li><li><strong>Point two:</strong> Supporting detail.</li><li><strong>Point three:</strong> Supporting detail.</li></ul>
            <h2>Next steps</h2>
            <ol><li>Confirm the decision.</li><li>Assign owners.</li><li>Share the timeline with stakeholders.</li></ol>
        `,
    },
    {
        id: "business-plan",
        name: "Business plan",
        subtitle: "Strategy document",
        category: "Work",
        previewType: "project",
        accent: "#7c3aed",
        title: "Business Plan",
        content: `<h1>Business Plan</h1>
            <p><strong>BUSINESS:</strong> [Company Name] · <strong>VERSION:</strong> 1.0 · <strong>DATE:</strong> [Date]</p>
            <hr>
            <h2>Executive Summary</h2>
            <p>Summarize the business, the customer problem, the proposed solution and the opportunity in one concise section.</p>
            <h2>Mission</h2>
            <p>State the mission and the long-term outcome the business wants to create.</p>
            <h2>Market & Customers</h2>
            <p>Describe the target customer, market context, alternatives and the problem you solve.</p>
            <h2>Product or Service</h2>
            <p>Explain the offering, key differentiators and how customers experience it.</p>
            <h2>Go-to-Market</h2>
            <ul><li>Positioning and messaging</li><li>Acquisition channels</li><li>Sales and retention strategy</li></ul>
            <h2>Goals & Metrics</h2>
            <p><strong>Goal:</strong> [Metric] · <strong>Target:</strong> [Target] · <strong>Timeline:</strong> [Date]</p>
        `,
    },
    {
        id: "newsletter",
        name: "Newsletter",
        subtitle: "Monthly update",
        category: "Work",
        previewType: "brochure",
        accent: "#db2777",
        title: "Monthly Newsletter",
        content: `<p style="text-align:center; color:#db2777; letter-spacing:.12em;"><strong>THE MONTHLY EDIT</strong></p>
            <h1 style="text-align:center;">Company Newsletter</h1>
            <p style="text-align:center;">October 2026 · Issue 08</p>
            <hr>
            <h2>Editor's note</h2>
            <p>A short introduction to this month's most useful stories, launches and updates.</p>
            <h2>Featured story</h2>
            <p><strong>[Story headline]</strong></p>
            <p>Summarize the most important story in a few engaging paragraphs and include a clear takeaway for readers.</p>
            <h2>What's new</h2>
            <ul><li><strong>Launch:</strong> [Product or feature]</li><li><strong>Update:</strong> [Team or company news]</li><li><strong>Milestone:</strong> [Result]</li></ul>
            <h2>Coming next</h2>
            <p>Share upcoming dates, events or releases that readers should know about.</p>
        `,
    },
    {
        id: "book-report",
        name: "Book report",
        subtitle: "Reading summary",
        category: "Education",
        previewType: "report",
        accent: "#475569",
        title: "Book Report",
        content: `<h1>[Book Title]</h1>
            <p><strong>AUTHOR:</strong> [Author] · <strong>STUDENT:</strong> [Name] · <strong>DATE:</strong> [Date]</p>
            <hr>
            <h2>Overview</h2>
            <p>Introduce the book, its genre, central idea and the reason it is significant.</p>
            <h2>Summary</h2>
            <p>Summarize the main events or ideas without giving away unnecessary detail.</p>
            <h2>Main Characters / Ideas</h2>
            <ul><li><strong>[Character or idea]</strong> — Role, traits and importance.</li><li><strong>[Character or idea]</strong> — Role, traits and importance.</li></ul>
            <h2>Theme</h2>
            <p>Explain the central theme and how the author develops it through the book.</p>
            <h2>Personal Response</h2>
            <p>Explain what you found effective, surprising or memorable and support your response with examples.</p>
        `,
    },
    {
        id: "lesson-plan",
        name: "Lesson plan",
        subtitle: "Classroom organizer",
        category: "Education",
        previewType: "notes",
        accent: "#7c3aed",
        title: "Lesson Plan",
        content: `<h1>Lesson Plan</h1>
            <p><strong>SUBJECT:</strong> [Subject] · <strong>GRADE:</strong> [Grade] · <strong>DATE:</strong> [Date]</p>
            <hr>
            <h2>Learning objectives</h2>
            <ul><li>Students will understand [concept].</li><li>Students will be able to apply [skill].</li><li>Students will explain [outcome].</li></ul>
            <h2>Materials</h2>
            <ul><li>[Material]</li><li>[Worksheet / presentation]</li><li>[Technology or resource]</li></ul>
            <h2>Lesson sequence</h2>
            <ol><li><strong>Warm-up</strong> — 5 min</li><li><strong>Instruction</strong> — 15 min</li><li><strong>Practice</strong> — 20 min</li><li><strong>Review</strong> — 10 min</li></ol>
            <h2>Assessment</h2>
            <p>Describe how learning will be checked and what evidence will demonstrate understanding.</p>
            <h2>Reflection</h2>
            <p>What worked? What should change for the next lesson?</p>
        `,
    },
    {
        id: "class-notes",
        name: "Class notes",
        subtitle: "Structured study notes",
        category: "Education",
        previewType: "notes",
        accent: "#2563eb",
        title: "Class Notes",
        content: `<h1>[Class / Topic]</h1>
            <p><strong>DATE:</strong> [Date] · <strong>LECTURER:</strong> [Name] · <strong>MODULE:</strong> [Module]</p>
            <hr>
            <h2>Key question</h2>
            <p>What is the main question this class is helping you answer?</p>
            <h2>Main ideas</h2>
            <ol><li><strong>Idea one</strong> — Explanation and example.</li><li><strong>Idea two</strong> — Explanation and example.</li><li><strong>Idea three</strong> — Explanation and example.</li></ol>
            <h2>Important terms</h2>
            <p><strong>Term</strong> — Definition.<br><strong>Term</strong> — Definition.<br><strong>Term</strong> — Definition.</p>
            <h2>Questions</h2>
            <ul><li>[Question to revisit]</li><li>[Question to ask in class]</li></ul>
            <h2>Summary</h2>
            <p>Write three to five sentences explaining the lesson in your own words.</p>
        `,
    },
    {
        id: "event-plan",
        name: "Event plan",
        subtitle: "Plan an event",
        category: "Personal",
        previewType: "brief",
        accent: "#ea580c",
        title: "Event Plan",
        content: `<h1>Event Plan</h1>
            <p><strong>EVENT:</strong> [Event name] · <strong>DATE:</strong> [Date] · <strong>LOCATION:</strong> [Location]</p>
            <hr>
            <h2>Event overview</h2>
            <p>Describe the purpose, audience and experience you want guests to have.</p>
            <h2>Schedule</h2>
            <ol><li>[Time] — Arrival</li><li>[Time] — Opening</li><li>[Time] — Main activity</li><li>[Time] — Closing</li></ol>
            <h2>Checklist</h2>
            <ul><li>☐ Venue confirmed</li><li>☐ Guest list finalized</li><li>☐ Food / catering arranged</li><li>☐ Equipment tested</li><li>☐ Invitations sent</li></ul>
            <h2>Budget</h2>
            <p><strong>Venue:</strong> ₹[Amount] · <strong>Food:</strong> ₹[Amount] · <strong>Other:</strong> ₹[Amount]</p>
            <h2>Contacts</h2>
            <p>[Vendor / organizer] — [Phone / email]</p>
        `,
    },
    {
        id: "monthly-budget",
        name: "Monthly budget",
        subtitle: "Personal finance",
        category: "Personal",
        previewType: "report",
        accent: "#059669",
        title: "Monthly Budget",
        content: `<h1>Monthly Budget</h1>
            <p><strong>MONTH:</strong> October 2026 · <strong>INCOME:</strong> ₹[Amount]</p>
            <hr>
            <h2>Income</h2>
            <ul><li>Salary — ₹[Amount]</li><li>Freelance — ₹[Amount]</li><li>Other — ₹[Amount]</li></ul>
            <h2>Fixed expenses</h2>
            <ul><li>Rent / housing — ₹[Amount]</li><li>Utilities — ₹[Amount]</li><li>Subscriptions — ₹[Amount]</li></ul>
            <h2>Flexible expenses</h2>
            <ul><li>Food — ₹[Amount]</li><li>Transport — ₹[Amount]</li><li>Shopping — ₹[Amount]</li></ul>
            <h2>Savings</h2>
            <p><strong>Emergency fund:</strong> ₹[Amount]<br><strong>Investments:</strong> ₹[Amount]</p>
            <h2>Monthly review</h2>
            <p>What went well? Where did spending exceed the plan? What will change next month?</p>
        `,
    },
    {
        id: "simple-invoice",
        name: "Invoice",
        subtitle: "Simple business invoice",
        category: "Sales",
        previewType: "brochure",
        accent: "#1a73e8",
        title: "Invoice",
        content: `<p style="text-align:right; color:#1a73e8; letter-spacing:.08em;"><strong>INVOICE</strong></p>
            <h1>Invoice #1042</h1>
            <p><strong>YOUR COMPANY</strong><br>Address line · City · PIN<br>email@example.com · +91 00000 00000</p>
            <hr>
            <p><strong>BILL TO</strong><br>Client Name<br>Client Company<br>client@example.com</p>
            <h2>Services</h2>
            <table><tr><th>Description</th><th>Qty</th><th>Amount</th></tr><tr><td>Service / deliverable</td><td>1</td><td>₹[Amount]</td></tr><tr><td>Additional work</td><td>1</td><td>₹[Amount]</td></tr></table>
            <p style="text-align:right;"><strong>Subtotal:</strong> ₹[Amount]<br><strong>Tax:</strong> ₹[Amount]<br><strong>Total:</strong> ₹[Amount]</p>
            <blockquote>Thank you for your business. Payment is due by [Date].</blockquote>
        `,
    },
    {
        id: "project-timeline",
        name: "Project timeline",
        subtitle: "Milestones & dates",
        category: "Work",
        previewType: "project",
        accent: "#0891b2",
        title: "Project Timeline",
        content: `<h1>Project Timeline</h1>
            <p><strong>PROJECT:</strong> [Project name] · <strong>OWNER:</strong> [Name] · <strong>LAUNCH:</strong> [Date]</p>
            <hr>
            <h2>Milestones</h2>
            <p><strong>01 — Discovery</strong><br>[Start date] → [End date]<br>Research, requirements and success criteria.</p>
            <p><strong>02 — Design</strong><br>[Start date] → [End date]<br>Flows, visual design and prototype.</p>
            <p><strong>03 — Build</strong><br>[Start date] → [End date]<br>Implementation, integration and review.</p>
            <p><strong>04 — Launch</strong><br>[Start date] → [End date]<br>QA, release and post-launch monitoring.</p>
            <h2>Dependencies</h2>
            <ul><li>[Dependency] — Owner: [Name]</li><li>[Dependency] — Owner: [Name]</li></ul>
            <h2>Risks</h2>
            <p>List risks that could affect timing and the mitigation for each.</p>
        `,
    },
    {
        id: "weekly-meal-plan",
        name: "Weekly meal plan",
        subtitle: "Plan your week",
        category: "Personal",
        previewType: "notes",
        accent: "#dc2626",
        title: "Weekly Meal Plan",
        content: `<h1>Weekly Meal Plan</h1>
            <p><strong>WEEK:</strong> October 5–11, 2026 · <strong>FOCUS:</strong> Simple, balanced meals</p>
            <hr>
            <h2>Monday</h2><p>Breakfast: [Meal]<br>Lunch: [Meal]<br>Dinner: [Meal]</p>
            <h2>Tuesday</h2><p>Breakfast: [Meal]<br>Lunch: [Meal]<br>Dinner: [Meal]</p>
            <h2>Wednesday</h2><p>Breakfast: [Meal]<br>Lunch: [Meal]<br>Dinner: [Meal]</p>
            <h2>Thursday</h2><p>Breakfast: [Meal]<br>Lunch: [Meal]<br>Dinner: [Meal]</p>
            <h2>Friday</h2><p>Breakfast: [Meal]<br>Lunch: [Meal]<br>Dinner: [Meal]</p>
            <h2>Shopping list</h2>
            <ul><li>☐ Vegetables</li><li>☐ Fruit</li><li>☐ Grains / pasta</li><li>☐ Protein</li><li>☐ Pantry essentials</li></ul>
        `,
    },
    {
        id: "recipe",
        name: "Recipe",
        subtitle: "Kitchen notes",
        category: "Personal",
        previewType: "brochure",
        accent: "#dc2626",
        title: "Recipe",
        content: `<div style="text-align:center; margin-bottom:16px;"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80" alt="Recipe dish" /></div>
            <p style="color:#b45309; letter-spacing:.08em;">KITCHEN NOTE</p><h1>Classic Pasta</h1>
            <p><strong>QUICK DINNER</strong> · Serves 4 · 30 minutes</p>
            <hr>
            <blockquote>A simple weeknight recipe with a bright, creamy finish.</blockquote>
            <h2>Ingredients</h2>
            <ul><li>300 g pasta</li><li>2 tbsp olive oil</li><li>3 garlic cloves</li><li>1 cup grated parmesan</li><li>Fresh herbs, salt and pepper</li></ul>
            <h2>Method</h2>
            <ol><li>Bring a large pot of salted water to a boil and cook the pasta until al dente.</li><li>Warm olive oil and garlic in a pan until fragrant.</li><li>Add pasta and a splash of cooking water, then toss.</li><li>Finish with parmesan, herbs and black pepper.</li></ol>
            <h2>Chef's Notes</h2>
            <p>Add vegetables, grilled chicken or roasted mushrooms for a fuller meal. Reserve extra pasta water before draining.</p>
            <h2>Serving</h2>
            <p>Serve immediately with parmesan and fresh herbs.</p>
        `,
    },
];

const DEFAULT_RECENT_TEMPLATE_IDS = [
    "blank",
    "resume-serif",
    "cover-letter",
    "meeting-notes",
    "project-proposal",
    "weekly-report",
    "course-notes",
];

function TemplatePreview({ template }) {
    const imageMap = {
        "project-proposal": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82",
        "sales-quote": "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=82",
        "weekly-report": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=82",
        "software-development-proposal": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=82",
        "newsletter": "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=82",
        "book-report": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=82",
        "travel-planner": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=82",
        "recipe": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=82",
    };

    const imageUrl = imageMap[template.id];

    const line = (width = "90%", color = "#d1d5db") => (
        <div
            style={{
                width,
                height: "4px",
                background: color,
                borderRadius: "2px",
                marginBottom: "5px",
            }}
        />
    );

    const imageHeader = (height = "58px") => imageUrl ? (
        <div
            style={{
                height,
                borderRadius: "2px",
                marginBottom: "9px",
                overflow: "hidden",
                background: "#e5e7eb",
                position: "relative",
            }}
        >
            <img
                src={imageUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{ position: "absolute", inset: "auto 0 0", height: "5px", background: template.accent, opacity: 0.92 }} />
        </div>
    ) : null;

    if (template.previewType === "blank") {
        return (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "white",
                }}
            >
                <div style={{ position: "relative", width: "44px", height: "44px" }}>
                    <span style={{ position: "absolute", left: "19px", top: 0, width: "7px", height: "44px", background: "#fbbc04", borderRadius: "2px" }} />
                    <span style={{ position: "absolute", left: 0, top: "19px", width: "44px", height: "7px", background: "#4285f4", borderRadius: "2px" }} />
                    <span style={{ position: "absolute", left: "19px", top: "19px", width: "7px", height: "7px", background: "#34a853" }} />
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                height: "100%",
                background: "white",
                padding: "16px 15px",
                boxSizing: "border-box",
                color: "#111827",
                overflow: "hidden",
            }}
        >
            {template.previewType === "report" && (
                <div>
                    <div style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.08em", marginBottom: "4px" }}>REPORT TITLE</div>
                    <div style={{ fontSize: "5px", color: "#6b7280", marginBottom: "8px" }}>LOREM IPSUM DOLOR SIT AMET</div>
                    {imageHeader("62px")}
                    <div style={{ width: "54%", height: "3px", background: template.accent, marginBottom: "7px" }} />
                    <div style={{ fontSize: "6px", fontWeight: 800, marginBottom: "5px" }}>Introduction</div>
                    {line("95%")}
                    {line("88%")}
                    {line("92%")}
                    <div style={{ marginTop: "8px", fontSize: "6px", fontWeight: 800 }}>Key findings</div>
                    {line("90%", template.accent)}
                    {line("76%")}
                </div>
            )}

            {(template.previewType === "resume" || template.previewType === "resume-coral" || template.previewType === "resume-swiss" || template.previewType === "resume-modern") && (
                <div>
                    <div style={{ borderTop: `3px solid ${template.accent}`, paddingTop: "6px", marginBottom: "7px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700 }}>Your Name</div>
                        <div style={{ fontSize: "5px", color: "#6b7280" }}>Software Engineer · Jaipur, India</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 0.75fr", gap: "9px" }}>
                        <div>
                            <div style={{ fontSize: "6px", color: template.accent, fontWeight: 800, marginBottom: "4px" }}>EXPERIENCE</div>
                            {line("100%")}
                            {line("92%")}
                            {line("82%")}
                            <div style={{ height: "7px" }} />
                            <div style={{ fontSize: "6px", color: template.accent, fontWeight: 800, marginBottom: "4px" }}>EDUCATION</div>
                            {line("95%")}
                            {line("80%")}
                            <div style={{ height: "7px" }} />
                            <div style={{ fontSize: "6px", color: template.accent, fontWeight: 800, marginBottom: "4px" }}>PROJECTS</div>
                            {line("94%")}
                            {line("82%")}
                        </div>
                        <div>
                            <div style={{ fontSize: "6px", color: template.accent, fontWeight: 800, marginBottom: "4px" }}>SKILLS</div>
                            {line("90%")}
                            {line("75%")}
                            {line("82%")}
                            <div style={{ height: "7px" }} />
                            <div style={{ fontSize: "6px", color: template.accent, fontWeight: 800, marginBottom: "4px" }}>CONTACT</div>
                            {line("94%")}
                            {line("72%")}
                        </div>
                    </div>
                </div>
            )}

            {(template.previewType === "letter" || template.previewType === "cover") && (
                <div>
                    <div style={{ width: "72%", height: "3px", background: template.accent, marginBottom: "8px" }} />
                    <div style={{ fontSize: "8px", fontWeight: 700 }}>Your Name</div>
                    {line("48%")}
                    {line("55%")}
                    <div style={{ height: "8px" }} />
                    <div style={{ fontSize: "6px", fontWeight: 700, color: template.accent }}>Subject: Letter subject</div>
                    <div style={{ height: "7px" }} />
                    {line("95%")}
                    {line("90%")}
                    {line("92%")}
                    {line("83%")}
                    <div style={{ height: "9px" }} />
                    {line("88%")}
                    {line("91%")}
                    {line("75%")}
                    <div style={{ height: "11px" }} />
                    <div style={{ fontSize: "6px", fontWeight: 700 }}>Your Name</div>
                </div>
            )}

            {template.previewType === "project" && (
                <div>
                    {imageHeader("48px")}
                    <div style={{ width: "68%", height: "3px", background: template.accent, marginBottom: "6px" }} />
                    <div style={{ fontSize: "11px", fontWeight: 700 }}>Project Name</div>
                    <div style={{ fontSize: "5px", color: "#6b7280", marginBottom: "9px" }}>09.30.2026</div>
                    <div style={{ fontSize: "6px", color: template.accent, fontWeight: 800 }}>OVERVIEW</div>
                    {line("93%")}
                    {line("78%")}
                    <div style={{ height: "8px" }} />
                    <div style={{ fontSize: "6px", color: template.accent, fontWeight: 800 }}>OBJECTIVES</div>
                    {line("88%")}
                    {line("81%")}
                </div>
            )}

            {template.previewType === "brochure" && (
                <div>
                    <div style={{ fontSize: "7px", color: template.accent, fontWeight: 800 }}>YOUR COMPANY</div>
                    <div style={{ fontSize: "12px", color: template.accent, fontWeight: 800, margin: "4px 0 7px" }}>Product Brochure</div>
                    {imageHeader("58px")}
                    <div style={{ width: "72%", height: "3px", background: template.accent, marginBottom: "6px" }} />
                    <div style={{ fontSize: "6px", fontWeight: 800 }}>Product Overview</div>
                    {line("94%")}
                    {line("82%", template.accent)}
                    <div style={{ height: "6px" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                        {line("100%")}
                        {line("100%")}
                    </div>
                </div>
            )}

            {(template.previewType === "notes" || template.previewType === "brief") && (
                <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                        {template.previewType === "notes" ? "Meeting Notes" : "Project Brief"}
                    </div>
                    <div style={{ width: "100%", height: "3px", background: template.accent, marginBottom: "8px" }} />
                    {imageUrl && imageHeader("42px")}
                    <div style={{ fontSize: "6px", color: template.accent, fontWeight: 800, marginBottom: "4px" }}>OVERVIEW</div>
                    {line("93%")}
                    {line("85%")}
                    <div style={{ height: "8px" }} />
                    <div style={{ fontSize: "6px", color: template.accent, fontWeight: 800, marginBottom: "4px" }}>ACTION ITEMS</div>
                    {line("90%")}
                    {line("78%")}
                    {line("84%")}
                    <div style={{ height: "8px" }} />
                    <div style={{ fontSize: "6px", color: template.accent, fontWeight: 800, marginBottom: "4px" }}>NEXT STEPS</div>
                    {line("88%")}
                    {line("70%")}
                </div>
            )}
        </div>
    );
}


function DocumentThumbnail({ document }) {
    const rawContent = typeof document?.content === "string" ? document.content : "";
    const safeContent = rawContent
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
        .replace(/<object[\s\S]*?<\/object>/gi, "")
        .replace(/<embed[\s\S]*?>/gi, "");

    const hasContent = safeContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().length > 0;

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                background: "#f8f9fa",
                overflow: "hidden",
                padding: "10px 12px",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#fff",
                    border: "1px solid #e0e3e7",
                    boxShadow: "0 1px 4px rgba(60,64,67,.14)",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <style>{`
                    .collabdocs-real-thumb {
                        color: #202124;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 8px;
                        line-height: 1.45;
                    }
                    .collabdocs-real-thumb h1 {
                        font-size: 20px;
                        line-height: 1.15;
                        margin: 0 0 10px;
                        font-weight: 700;
                    }
                    .collabdocs-real-thumb h2 {
                        font-size: 12px;
                        line-height: 1.2;
                        margin: 12px 0 6px;
                        font-weight: 700;
                    }
                    .collabdocs-real-thumb h3 {
                        font-size: 10px;
                        line-height: 1.2;
                        margin: 9px 0 5px;
                        font-weight: 700;
                    }
                    .collabdocs-real-thumb p {
                        margin: 0 0 7px;
                    }
                    .collabdocs-real-thumb ul,
                    .collabdocs-real-thumb ol {
                        margin: 0 0 8px;
                        padding-left: 18px;
                    }
                    .collabdocs-real-thumb li {
                        margin: 0 0 3px;
                    }
                    .collabdocs-real-thumb blockquote {
                        border-left: 3px solid #dadce0;
                        margin: 8px 0;
                        padding-left: 8px;
                        color: #5f6368;
                    }
                    .collabdocs-real-thumb table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 8px 0;
                        font-size: 7px;
                    }
                    .collabdocs-real-thumb th,
                    .collabdocs-real-thumb td {
                        border: 1px solid #dadce0;
                        padding: 4px;
                        text-align: left;
                    }
                    .collabdocs-real-thumb img {
                        max-width: 100%;
                        height: auto;
                    }
                    .collabdocs-real-thumb hr {
                        border: 0;
                        border-top: 1px solid #dadce0;
                        margin: 9px 0;
                    }
                    .collabdocs-real-thumb a {
                        color: #1a73e8;
                    }
                `}</style>

                {hasContent ? (
                    <div
                        className="collabdocs-real-thumb"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "161%",
                            minHeight: "161%",
                            padding: "24px 27px",
                            boxSizing: "border-box",
                            transform: "scale(.62)",
                            transformOrigin: "top left",
                            overflow: "hidden",
                            background: "#fff",
                        }}
                        dangerouslySetInnerHTML={{ __html: safeContent }}
                    />
                ) : (
                    <div
                        style={{
                            padding: "18px",
                            color: "#202124",
                            fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                    >
                        <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>
                            {document?.title || "Untitled document"}
                        </div>
                        <div style={{ width: "42%", height: "4px", background: "#dfe1e5", borderRadius: 2, marginBottom: 9 }} />
                        {["92%", "84%", "96%", "78%", "89%", "71%", "94%", "81%"].map((width, index) => (
                            <div
                                key={index}
                                style={{
                                    width,
                                    height: "4px",
                                    background: index === 3 ? "#eceff1" : "#dfe1e5",
                                    borderRadius: 2,
                                    marginBottom: 7,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Dashboard() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [creatingTemplate, setCreatingTemplate] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [showTrash, setShowTrash] = useState(false);
    const [showAllDocuments, setShowAllDocuments] = useState(false);
    const [showTemplateGallery, setShowTemplateGallery] = useState(false);
    const [galleryMounted, setGalleryMounted] = useState(false);
    const [galleryTransition, setGalleryTransition] = useState("closed");
    const [documentsViewTransition, setDocumentsViewTransition] = useState("idle");
    const [viewMode, setViewMode] = useState("grid");
    const [trashDocuments, setTrashDocuments] = useState([]);
    const [trashLoading, setTrashLoading] = useState(false);
    const [restoring, setRestoring] = useState(null);
    const [permanentlyDeleting, setPermanentlyDeleting] = useState(null);
    const templateCarouselRef = useRef(null);
    const mainScrollRef = useRef(null);
    const galleryScrollRef = useRef(null);
    const carouselRafRef = useRef(0);
    const carouselTargetRef = useRef(0);
    const carouselSmoothRafRef = useRef(0);
    const carouselSelectedRef = useRef(-1);
    const carouselAudioRef = useRef(null);
    const carouselOscillatorsRef = useRef(new Set());
    const carouselAudioUnlockedRef = useRef(false);
    const [recentTemplateIds, setRecentTemplateIds] = useState(() => {
        try {
            const stored = localStorage.getItem("collabdocs-recent-templates");
            const parsed = stored ? JSON.parse(stored) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, []);

    // Lenis is attached to the dashboard's actual scroll container (not window)
    // so the fixed dashboard layout keeps the same slow, buttery feel as the portfolio.
    useEffect(() => {
        const wrapper = mainScrollRef.current;
        if (!wrapper) return;

        const content = wrapper.firstElementChild || wrapper;
        const lenis = new Lenis({
            wrapper,
            content,
            duration: 1.2,
            smoothWheel: true,
            wheelMultiplier: 0.8,
            touchMultiplier: 1,
            syncTouch: true,
            autoRaf: false,
            lerp: 0.08,
        });

        let rafId = 0;
        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await api.get("/documents");
            setDocuments(response.data.documents || []);
        } catch (error) {
            console.error("Failed to fetch documents:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchTrashDocuments = async () => {
        try {
            setTrashLoading(true);
            const response = await api.get("/documents/trash");
            setTrashDocuments(response.data.documents || []);
        } catch (error) {
            console.error("Failed to fetch trash:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to load trash.");
        } finally {
            setTrashLoading(false);
        }
    };

    const createBlankDocument = async () => {
        if (creating || creatingTemplate) return;

        try {
            setCreating(true);
            const response = await api.post("/documents", {
                title: "Untitled document",
            });

            const createdDocument = response.data.document;
            setDocuments((current) => [createdDocument, ...current]);
            window.location.href = `/document/${createdDocument._id}`;
        } catch (error) {
            console.error("Failed to create document:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to create document.");
        } finally {
            setCreating(false);
        }
    };

    const createTemplateDocument = async (templateId) => {
        const template = TEMPLATE_CATALOG.find((item) => item.id === templateId);
        if (!template || creating || creatingTemplate) return;

        try {
            setCreatingTemplate(templateId);

            const createResponse = await api.post("/documents", {
                title: template.title,
            });

            const createdDocument = createResponse.data.document;

            if (template.content) {
                await api.put(`/documents/${createdDocument._id}`, {
                    title: template.title,
                    content: template.content,
                });
            }

            const nextRecentIds = [
                templateId,
                ...recentTemplateIds.filter((id) => id !== templateId),
            ].slice(0, 7);

            setRecentTemplateIds(nextRecentIds);
            localStorage.setItem("collabdocs-recent-templates", JSON.stringify(nextRecentIds));
            window.location.href = `/document/${createdDocument._id}`;
        } catch (error) {
            console.error("Failed to create template document:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to create document from template.");
        } finally {
            setCreatingTemplate(null);
        }
    };

    const deleteDocument = async (documentId) => {
        if (!window.confirm("Move this document to Trash?")) return;

        try {
            setDeleting(documentId);
            await api.delete(`/documents/${documentId}`);
            setDocuments((current) => current.filter((document) => document._id !== documentId));
        } catch (error) {
            console.error("Failed to move document to trash:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to move document to Trash.");
        } finally {
            setDeleting(null);
        }
    };

    const restoreDocument = async (documentId) => {
        try {
            setRestoring(documentId);
            const response = await api.patch(`/documents/${documentId}/restore`);
            setTrashDocuments((current) => current.filter((document) => document._id !== documentId));
            setDocuments((current) => [response.data.document, ...current]);
        } catch (error) {
            console.error("Failed to restore document:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to restore document.");
        } finally {
            setRestoring(null);
        }
    };

    const permanentlyDeleteDocument = async (documentId) => {
        if (!window.confirm("This will permanently delete the document. This cannot be undone. Continue?")) return;

        try {
            setPermanentlyDeleting(documentId);
            await api.delete(`/documents/${documentId}/permanent`);
            setTrashDocuments((current) => current.filter((document) => document._id !== documentId));
        } catch (error) {
            console.error("Failed to permanently delete document:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to permanently delete document.");
        } finally {
            setPermanentlyDeleting(null);
        }
    };

    const toggleStar = async (documentId) => {
        try {
            const response = await api.patch(`/documents/${documentId}/star`);
            setDocuments((current) =>
                current.map((document) =>
                    document._id === documentId ? response.data.document : document
                )
            );
        } catch (error) {
            console.error("Failed to update star:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to update star.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    };

    const openTrash = () => {
        setShowTrash(true);
        setShowAllDocuments(false);
        closeTemplateGallery();
        setShowStarredOnly(false);
        setSearchQuery("");
        fetchTrashDocuments();
    };

    const transitionDocumentsView = (update) => {
        setDocumentsViewTransition("leaving");

        const applyUpdate = () => {
            update();
            requestAnimationFrame(() => {
                setDocumentsViewTransition("entering");
            });
        };

        if (typeof document !== "undefined" && document.startViewTransition) {
            document.startViewTransition(() => {
                applyUpdate();
            });
            return;
        }

        applyUpdate();
    };

    const backToDocuments = () => {
        transitionDocumentsView(() => {
            setShowTrash(false);
            setShowAllDocuments(false);
            closeTemplateGallery();
            setSearchQuery("");
            setShowStarredOnly(false);
        });
    };

    const openAllDocuments = () => {
        transitionDocumentsView(() => {
            setShowAllDocuments(true);
            setShowTrash(false);
            closeTemplateGallery();
            setSearchQuery("");
            setShowStarredOnly(false);
        });
    };

    const openTemplateGallery = () => {
        if (showTemplateGallery || galleryMounted) return;

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        setGalleryMounted(true);
        setGalleryTransition("opening");
        setShowTemplateGallery(true);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setGalleryTransition("open");
            });
        });
    };

    const closeTemplateGallery = () => {
        if (!galleryMounted) return;

        setGalleryTransition("closing");
        setShowTemplateGallery(false);

        window.setTimeout(() => {
            setGalleryMounted(false);
            setGalleryTransition("closed");
        }, 430);
    };

    useEffect(() => {
        if (!galleryMounted) return;

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [galleryMounted]);

    // Give the full template gallery its own Lenis instance so its vertical
    // scrolling stays buttery without fighting the dashboard's main Lenis.
    useEffect(() => {
        const wrapper = galleryScrollRef.current;
        if (!galleryMounted || !wrapper) return;

        const content = wrapper.firstElementChild || wrapper;
        const lenis = new Lenis({
            wrapper,
            content,
            duration: 1.15,
            smoothWheel: true,
            wheelMultiplier: 0.82,
            touchMultiplier: 1,
            syncTouch: true,
            autoRaf: false,
            lerp: 0.075,
        });

        let rafId = 0;
        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, [galleryMounted]);

    const stopCarouselSound = () => {
        carouselOscillatorsRef.current.forEach((oscillator) => {
            try {
                oscillator.stop();
            } catch {
                // already stopped
            }
            try {
                oscillator.disconnect();
            } catch {
                // decorative cleanup
            }
        });
        carouselOscillatorsRef.current.clear();
    };

    const unlockCarouselAudio = () => {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;

            if (!carouselAudioRef.current) {
                carouselAudioRef.current = new AudioContextClass();
            }

            const audio = carouselAudioRef.current;
            carouselAudioUnlockedRef.current = true;

            if (audio.state === "suspended") {
                audio.resume().catch(() => { });
            }

            return audio;
        } catch {
            return null;
        }
    };

    const playCarouselTick = () => {
        try {
            const audio = unlockCarouselAudio();
            if (!audio) return;

            const scheduleTick = () => {
                if (!carouselAudioUnlockedRef.current || audio.state !== "running") return;

                const now = audio.currentTime;
                const oscillator = audio.createOscillator();
                const gain = audio.createGain();

                oscillator.type = "sine";
                oscillator.frequency.setValueAtTime(720, now);
                oscillator.frequency.exponentialRampToValueAtTime(560, now + 0.055);

                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.exponentialRampToValueAtTime(0.045, now + 0.008);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

                oscillator.connect(gain);
                gain.connect(audio.destination);
                carouselOscillatorsRef.current.add(oscillator);

                oscillator.onended = () => {
                    carouselOscillatorsRef.current.delete(oscillator);
                    try {
                        oscillator.disconnect();
                        gain.disconnect();
                    } catch {
                        // decorative cleanup
                    }
                };

                oscillator.start(now);
                oscillator.stop(now + 0.08);
            };

            if (audio.state === "running") {
                scheduleTick();
            } else {
                audio.resume().then(scheduleTick).catch(() => { });
            }
        } catch {
            // Audio is decorative; scrolling must continue even if the browser blocks it.
        }
    };

    // Lightweight horizontal smoothing for the dashboard carousel.
    // This stays separate from the page/gallery Lenis instances.
    useEffect(() => {
        const container = templateCarouselRef.current;
        if (!container) return;

        carouselTargetRef.current = container.scrollLeft;
        let rafId = 0;

        const smooth = () => {
            const target = Math.max(
                0,
                Math.min(
                    carouselTargetRef.current,
                    Math.max(0, container.scrollWidth - container.clientWidth)
                )
            );
            const current = container.scrollLeft;
            const distance = target - current;

            if (Math.abs(distance) > 0.35) {
                container.scrollLeft = current + distance * 0.13;
            } else if (Math.abs(distance) > 0) {
                container.scrollLeft = target;
            }

            rafId = requestAnimationFrame(smooth);
        };

        rafId = requestAnimationFrame(smooth);

        return () => cancelAnimationFrame(rafId);
    }, []);

    const handleTemplateCarouselWheel = (event) => {
        const container = templateCarouselRef.current;
        if (!container) return;

        const vertical = event.deltaY;
        const horizontal = event.deltaX;
        const delta = Math.abs(horizontal) > Math.abs(vertical) ? horizontal : vertical;
        if (!delta) return;

        // Normal mouse wheel -> horizontal carousel. Trackpad deltaX stays natural.
        if (Math.abs(vertical) >= Math.abs(horizontal)) {
            event.preventDefault();
        }

        const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
        const current = container.scrollLeft;
        const target = Math.max(0, Math.min(carouselTargetRef.current, maxScroll));

        if (Math.abs(current - target) > 2) {
            carouselTargetRef.current = current;
        }

        carouselTargetRef.current = Math.max(
            0,
            Math.min(carouselTargetRef.current + delta * 0.72, maxScroll)
        );

        // A real wheel/touchpad gesture also counts as the user's audio gesture.
        unlockCarouselAudio();
    };

    const handleTemplateCarouselScroll = () => {
        const container = templateCarouselRef.current;
        if (!container || carouselRafRef.current) return;

        carouselRafRef.current = requestAnimationFrame(() => {
            const bounds = container.getBoundingClientRect();
            const center = bounds.left + bounds.width / 2;
            const falloff = Math.max(420, bounds.width * 0.58);
            const children = Array.from(container.children);
            let closestIndex = 0;
            let closestDistance = Infinity;

            children.forEach((child, index) => {
                const rect = child.getBoundingClientRect();
                const childCenter = rect.left + rect.width / 2;
                const pixelDistance = Math.abs(childCenter - center);
                const distance = Math.min(pixelDistance / falloff, 1);

                if (pixelDistance < closestDistance) {
                    closestDistance = pixelDistance;
                    closestIndex = index;
                }

                child.style.setProperty("--carousel-scale", (1.05 - distance * 0.105).toFixed(3));
                child.style.setProperty("--carousel-opacity", (1 - distance * 0.20).toFixed(3));
                child.style.setProperty("--carousel-y", `${distance * 5}px`);
                child.style.setProperty("--carousel-selected", index === closestIndex ? "1" : "0");
            });

            if (carouselSelectedRef.current !== -1 && carouselSelectedRef.current !== closestIndex) {
                playCarouselTick();
            }
            carouselSelectedRef.current = closestIndex;

            carouselRafRef.current = 0;
        });
    };

    useEffect(() => {
        const stopAll = () => {
            stopCarouselSound();
            if (carouselAudioRef.current) {
                carouselAudioRef.current.suspend().catch(() => { });
            }
        };

        const unlockFromGesture = () => {
            unlockCarouselAudio();
        };

        window.addEventListener("pagehide", stopAll);
        window.addEventListener("blur", stopAll);
        window.addEventListener("pointerdown", unlockFromGesture, { passive: true });
        window.addEventListener("touchstart", unlockFromGesture, { passive: true });
        window.addEventListener("keydown", unlockFromGesture, { passive: true });

        return () => {
            window.removeEventListener("pagehide", stopAll);
            window.removeEventListener("blur", stopAll);
            window.removeEventListener("pointerdown", unlockFromGesture);
            window.removeEventListener("touchstart", unlockFromGesture);
            window.removeEventListener("keydown", unlockFromGesture);
            if (carouselRafRef.current) cancelAnimationFrame(carouselRafRef.current);
            stopCarouselSound();
            if (carouselAudioRef.current) {
                carouselAudioRef.current.close().catch(() => { });
                carouselAudioRef.current = null;
            }
            carouselAudioUnlockedRef.current = false;
        };
    }, []);

    const sortedDocuments = [...documents].sort(
        (a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
    );

    const query = searchQuery.trim().toLowerCase();

    const filteredDocuments = sortedDocuments.filter((document) => {
        const matchesSearch =
            !query ||
            document.title?.toLowerCase().includes(query) ||
            document.content?.toLowerCase().includes(query);

        const matchesStarred = !showStarredOnly || document.starred === true;
        return matchesSearch && matchesStarred;
    });

    const recentDocuments = filteredDocuments.slice(0, 6);

    const scrollTemplates = (direction) => {
        const container = templateCarouselRef.current;
        if (!container) return;

        const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
        const current = container.scrollLeft;
        const target = Math.max(0, Math.min(carouselTargetRef.current, maxScroll));
        const base = Math.abs(current - target) > 2 ? current : target;
        const amount = direction === "right" ? 430 : -430;

        carouselTargetRef.current = Math.max(0, Math.min(base + amount, maxScroll));
        playCarouselTick();
    };

    const openDocument = (documentId) => {
        window.location.href = `/document/${documentId}`;
    };

    const documentCard = (document, compact = false) => {
        if (viewMode === "list" && !compact) {
            return (
                <div
                    key={document._id}
                    className="collabdocs-document-card collabdocs-document-list-card"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(280px, 1fr) 180px 150px 90px",
                        alignItems: "center",
                        gap: "16px",
                        padding: "12px 14px",
                        borderBottom: "1px solid rgba(255,255,255,.08)",
                        background: "rgba(255,255,255,.045)",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => openDocument(document._id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            border: 0,
                            background: "transparent",
                            cursor: "pointer",
                            textAlign: "left",
                            minWidth: 0,
                        }}
                    >
                        <div
                            style={{
                                width: "34px",
                                height: "42px",
                                border: "1px solid rgba(255,255,255,.10)",
                                borderRadius: "4px",
                                background: "rgba(255,255,255,.045)",
                                boxShadow: "0 1px 2px rgba(60,64,67,.12)",
                                flexShrink: 0,
                                overflow: "hidden",
                                pointerEvents: "none",
                            }}
                        >
                            <div style={{ transform: "scale(.18)", transformOrigin: "top left", width: "555%", height: "555%" }}>
                                <DocumentThumbnail document={document} />
                            </div>
                        </div>
                        <span
                            style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontSize: "14px",
                                color: "#eef2f7",
                            }}
                        >
                            {document.title || "Untitled document"}
                        </span>
                    </button>
                    <span style={{ color: "#9aa4b2", fontSize: "13px" }}>Me</span>
                    <span style={{ color: "#9aa4b2", fontSize: "13px" }}>
                        {new Date(document.updatedAt || document.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
                        <button
                            type="button"
                            onClick={() => toggleStar(document._id)}
                            title={document.starred ? "Unstar" : "Star"}
                            style={{ border: 0, background: "transparent", color: document.starred ? "#fbbc04" : "#9aa0a6", cursor: "pointer", fontSize: "18px" }}
                        >
                            {document.starred ? "★" : "☆"}
                        </button>
                        <button
                            type="button"
                            disabled={deleting === document._id}
                            onClick={() => deleteDocument(document._id)}
                            title="Move to trash"
                            style={{ border: 0, background: "transparent", color: "#9aa4b2", cursor: "pointer", fontSize: "15px" }}
                        >
                            ⋮
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div
                key={document._id}
                className="collabdocs-document-card"
                style={{
                    background: "rgba(255,255,255,.045)",
                    border: "1px solid rgba(255,255,255,.10)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    width: "245px",
                }}
            >
                <button
                    type="button"
                    onClick={() => openDocument(document._id)}
                    style={{
                        display: "block",
                        width: "100%",
                        border: 0,
                        background: "rgba(255,255,255,.045)",
                        padding: 0,
                        cursor: "pointer",
                        textAlign: "left",
                    }}
                >
                    <div
                        style={{
                            height: "205px",
                            borderBottom: "1px solid #e5e7eb",
                        }}
                    >
                        <DocumentThumbnail document={document} />
                    </div>
                </button>

                <div style={{ padding: "11px 12px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <button
                            type="button"
                            onClick={() => openDocument(document._id)}
                            style={{ border: 0, background: "transparent", padding: 0, cursor: "pointer", fontSize: "14px", color: "#eef2f7", fontWeight: 500, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "left" }}
                        >
                            {document.title || "Untitled document"}
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleStar(document._id)}
                            title={document.starred ? "Unstar" : "Star"}
                            style={{ border: 0, background: "transparent", color: document.starred ? "#fbbc04" : "#9aa0a6", fontSize: "20px", cursor: "pointer", lineHeight: 1, padding: "2px 4px" }}
                        >
                            {document.starred ? "★" : "☆"}
                        </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px", color: "#9aa4b2", fontSize: "12px" }}>
                        <span>
                            Opened {new Date(document.updatedAt || document.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                        <button
                            type="button"
                            disabled={deleting === document._id}
                            onClick={() => deleteDocument(document._id)}
                            style={{ border: 0, background: "transparent", color: "#9aa4b2", cursor: "pointer", fontSize: "12px", padding: "2px 0" }}
                        >
                            {deleting === document._id ? "Moving…" : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const templateCard = (template) => (
        <button
            key={template.id}
            className="collabdocs-template-card"
            type="button"
            disabled={Boolean(creating || creatingTemplate)}
            onClick={() => createTemplateDocument(template.id)}
            style={{
                border: 0,
                background: "transparent",
                padding: 0,
                textAlign: "left",
                cursor: creating || creatingTemplate ? "not-allowed" : "pointer",
                opacity: creatingTemplate && creatingTemplate !== template.id ? 0.55 : 1,
                width: "184px",
                minWidth: "184px",
                flex: "0 0 184px",
            }}
        >
            <div style={{ height: "222px", background: "rgba(255,255,255,.035)", border: "1px solid rgba(255,255,255,.10)", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
                <TemplatePreview template={template} />
                {creatingTemplate === template.id && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.82)", display: "flex", alignItems: "center", justifyContent: "center", color: "#eef2f7", fontSize: "13px", fontWeight: 600 }}>
                        Creating document…
                    </div>
                )}
            </div>
            <div style={{ padding: "9px 4px 0" }}>
                <div style={{ color: "#eef2f7", fontSize: "14px", fontWeight: 500 }}>{template.name}</div>
                {template.subtitle && <div style={{ color: "#9aa4b2", fontSize: "13px", marginTop: "2px" }}>{template.subtitle}</div>}
            </div>
        </button>
    );

    const normalTemplates = (recentTemplateIds.length
        ? recentTemplateIds.map((id) => TEMPLATE_CATALOG.find((template) => template.id === id)).filter(Boolean)
        : DEFAULT_RECENT_TEMPLATE_IDS.map((id) => TEMPLATE_CATALOG.find((template) => template.id === id)).filter(Boolean)
    );

    const galleryCategories = ["CVs", "Sales", "Education", "Work", "Letters", "Personal"];

    return (
        <div className="collabdocs-dashboard" style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", overflow: "hidden", background: "#07080b", color: "#f5f7fa", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" }}>
            <style>{`
                html, body, #root { scrollbar-width: none; }
                html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar { display: none; width: 0; height: 0; }
                .collabdocs-dashboard * { scrollbar-width: none; }
                .collabdocs-dashboard *::-webkit-scrollbar { display: none; width: 0; height: 0; }
                html {
                    scroll-behavior: smooth;
                }

                html, body {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                html::-webkit-scrollbar,
                body::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }

                /* Global smooth motion for dashboard interactions */
                @keyframes collabdocsViewEnter {
                    0% { opacity: 0; transform: translate3d(0, 14px, 0) scale(.988); filter: blur(4px); }
                    45% { opacity: .72; filter: blur(1.5px); }
                    100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
                }

                @keyframes collabdocsViewLeave {
                    0% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
                    100% { opacity: 0; transform: translate3d(0, -8px, 0) scale(.996); filter: blur(2px); }
                }

                .collabdocs-documents-view-transition {
                    animation: collabdocsViewEnter 720ms cubic-bezier(.16,1,.3,1) both;
                    will-change: opacity, transform, filter;
                    transform-origin: 50% 20%;
                }

                ::view-transition-old(collabdocs-documents-view),
                ::view-transition-new(collabdocs-documents-view) {
                    animation-duration: 650ms;
                    animation-timing-function: cubic-bezier(.16,1,.3,1);
                }

                ::view-transition-old(collabdocs-documents-view) {
                    animation-name: collabdocsViewOld;
                }

                ::view-transition-new(collabdocs-documents-view) {
                    animation-name: collabdocsViewNew;
                }

                @keyframes collabdocsViewOld {
                    from { opacity: 1; transform: scale(1); filter: blur(0); }
                    to { opacity: 0; transform: scale(.992); filter: blur(2px); }
                }

                @keyframes collabdocsViewNew {
                    from { opacity: 0; transform: scale(1.008); filter: blur(2px); }
                    to { opacity: 1; transform: scale(1); filter: blur(0); }
                }

                .collabdocs-document-section-title {
                    transition: opacity 500ms cubic-bezier(.16,1,.3,1), transform 650ms cubic-bezier(.16,1,.3,1);
                }

                .collabdocs-dashboard button,
                .collabdocs-dashboard a,
                .collabdocs-dashboard input,
                .collabdocs-dashboard [role="button"],
                .collabdocs-dashboard select,
                .collabdocs-dashboard textarea {
                    transition: transform 320ms cubic-bezier(.22,1,.36,1),
                                opacity 320ms ease,
                                background-color 320ms ease,
                                border-color 320ms ease,
                                box-shadow 320ms cubic-bezier(.22,1,.36,1),
                                color 260ms ease,
                                filter 320ms ease;
                }

                .collabdocs-dashboard input:focus,
                .collabdocs-dashboard textarea:focus,
                .collabdocs-dashboard select:focus {
                    transform: translateY(-1px);
                }

                .collabdocs-dashboard .collabdocs-document-grid,
                .collabdocs-dashboard .collabdocs-empty-state,
                .collabdocs-dashboard .collabdocs-list-view {
                    animation: collabdocsContentIn 420ms cubic-bezier(.22,1,.36,1) both;
                }

                .collabdocs-dashboard .collabdocs-document-card {
                    animation: collabdocsCardIn 460ms cubic-bezier(.22,1,.36,1) both;
                }

                .collabdocs-dashboard .collabdocs-document-card:nth-child(2) { animation-delay: 35ms; }
                .collabdocs-dashboard .collabdocs-document-card:nth-child(3) { animation-delay: 70ms; }
                .collabdocs-dashboard .collabdocs-document-card:nth-child(4) { animation-delay: 105ms; }
                .collabdocs-dashboard .collabdocs-document-card:nth-child(5) { animation-delay: 140ms; }
                .collabdocs-dashboard .collabdocs-document-card:nth-child(6) { animation-delay: 175ms; }

                .collabdocs-dashboard .collabdocs-template-card {
                    animation: collabdocsCardIn 500ms cubic-bezier(.22,1,.36,1) both;
                }

                @keyframes collabdocsContentIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes collabdocsCardIn {
                    from { opacity: 0; transform: translateY(14px) scale(.985); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .collabdocs-dashboard button:not(:disabled):hover,
                .collabdocs-dashboard [role="button"]:hover {
                    transform: translateY(-1px);
                }

                .collabdocs-dashboard button:not(:disabled):active,
                .collabdocs-dashboard [role="button"]:active {
                    transform: translateY(0) scale(.985);
                    transition-duration: 120ms;
                }

                .collabdocs-document-card,
                .collabdocs-template-card {
                    transition: transform 360ms cubic-bezier(.22,1,.36,1),
                                opacity 280ms ease,
                                box-shadow 360ms cubic-bezier(.22,1,.36,1),
                                border-color 280ms ease,
                                background-color 280ms ease;
                    will-change: transform;
                }

                .collabdocs-document-card:hover,
                .collabdocs-template-card:hover {
                    transform: translateY(-5px);
                }

                .collabdocs-template-card:active {
                    transform: translateY(-1px) scale(.985);
                }

                @media (prefers-reduced-motion: reduce) {
                    .collabdocs-dashboard *,
                    .collabdocs-dashboard *::before,
                    .collabdocs-dashboard *::after {
                        animation-duration: 1ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: 1ms !important;
                    }
                }

                .collabdocs-gallery-row {
                    scroll-behavior: smooth;
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior-x: contain;
                }

                html,
                body,
                #root {
                    overscroll-behavior-x: none !important;
                    touch-action: pan-y;
                }

                .collabdocs-dashboard {
                    overscroll-behavior-x: none !important;
                    background:
                        radial-gradient(circle at 15% 0%, rgba(74, 99, 255, .10), transparent 30%),
                        radial-gradient(circle at 85% 10%, rgba(168, 85, 247, .08), transparent 28%),
                        #07080b !important;
                    min-height: 100vh;
                    height: 100vh;
                    overflow: hidden;
                    background-attachment: fixed;
                    scroll-behavior: smooth;
                }

                .collabdocs-dashboard main {
                    overscroll-behavior-x: none !important;
                    scroll-behavior: auto !important;
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior-y: contain;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .collabdocs-dashboard main::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }

                .collabdocs-template-carousel {
                    scroll-behavior: auto !important;
                    -webkit-overflow-scrolling: touch;
                    scroll-snap-type: none;
                    overscroll-behavior-x: contain;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .collabdocs-template-carousel::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }

                .collabdocs-template-carousel > button {
                    scroll-snap-align: center;
                    transform: translate3d(0, var(--carousel-y, 0px), 0) scale(var(--carousel-scale, 1));
                    opacity: var(--carousel-opacity, 1);
                    transition: transform 180ms linear, opacity 180ms linear, box-shadow 420ms ease;
                    will-change: transform, opacity;
                }

                .collabdocs-template-carousel > button:hover {
                    transform: translate3d(0, -7px, 0) scale(calc(var(--carousel-scale, 1) + .015));
                    opacity: 1;
                }

                .collabdocs-template-carousel > button > div:first-child {
                    box-shadow: 0 18px 42px rgba(0,0,0,.28);
                    transition: box-shadow 520ms cubic-bezier(.16,1,.3,1), border-color 420ms ease;
                }

                .collabdocs-template-carousel > button:hover > div:first-child {
                    box-shadow: 0 26px 54px rgba(0,0,0,.40), 0 0 0 1px rgba(255,255,255,.08);
                    border-color: rgba(255,255,255,.22) !important;
                }

                /* The dashboard carousel is intentionally wider than the gallery rows. */
                .collabdocs-template-carousel > button {
                    width: 228px !important;
                    min-width: 228px !important;
                    flex-basis: 228px !important;
                }

                .collabdocs-template-carousel > button > div:first-child {
                    height: 272px !important;
                    border-radius: 6px !important;
                }
                .collabdocs-glass-nav {
                    box-shadow: 0 10px 35px rgba(0,0,0,.30), inset 0 1px 0 rgba(255,255,255,.06);
                }
                .collabdocs-glass-nav input::placeholder { color: #8993a1; }
                .collabdocs-glass-nav input:focus {
                    background: rgba(255,255,255,.10) !important;
                    border-color: rgba(120,145,255,.45) !important;
                    box-shadow: 0 0 0 4px rgba(91,112,255,.10);
                }
                .collabdocs-document-card {
                    transition: transform .32s cubic-bezier(.22,1,.36,1), box-shadow .32s cubic-bezier(.22,1,.36,1), border-color .25s ease, background .25s ease;
                    box-shadow: 0 8px 24px rgba(0,0,0,.18);
                }
                .collabdocs-document-card:hover {
                    transform: translateY(-7px) scale(1.012);
                    border-color: rgba(255,255,255,.20) !important;
                    background: rgba(255,255,255,.07) !important;
                    box-shadow: 0 18px 42px rgba(0,0,0,.34), 0 0 0 1px rgba(255,255,255,.04);
                }
                .collabdocs-document-card button:hover { opacity: .88; }
                .collabdocs-template-card > div:first-of-type {
                    transition: transform .38s cubic-bezier(.22,1,.36,1), box-shadow .38s cubic-bezier(.22,1,.36,1), border-color .28s ease;
                    box-shadow: 0 10px 28px rgba(0,0,0,.22);
                }
                .collabdocs-template-card:hover > div:first-of-type {
                    transform: translateY(-8px) scale(1.025);
                    border-color: rgba(255,255,255,.28) !important;
                    box-shadow: 0 20px 38px rgba(0,0,0,.36);
                }
                .collabdocs-template-carousel::-webkit-scrollbar { display:none; }
                .collabdocs-document-list-card { transition: background .18s ease, border-color .18s ease; }
                .collabdocs-document-list-card:hover { background: rgba(255,255,255,.055) !important; }
                .collabdocs-template-gallery-overlay h1,
                .collabdocs-template-gallery-overlay h2 { color: #f3f5f8 !important; }
                .collabdocs-template-gallery-overlay .collabdocs-template-card > div:last-child div { color: #eef2f7 !important; }
                @media (max-width: 760px) {
                    .collabdocs-glass-nav { width: calc(100% - 20px) !important; top: 10px !important; }
                    .collabdocs-glass-nav > button:first-child span { display:none; }
                    .collabdocs-glass-nav > div:nth-child(2) { max-width: none !important; }
                    .collabdocs-glass-nav input { height: 42px !important; }
                    .collabdocs-dashboard main { padding-left: 12px !important; padding-right: 12px !important; }
                }
            `}</style>
            <header
                className="collabdocs-header"
                style={{
                    width: "100%",
                    height: "60px",
                    background: "linear-gradient(90deg, rgba(255, 255, 255, 0.14) 0%, rgba(15, 15, 15, 0.75) 25%, rgba(5, 5, 5, 0.85) 100%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    boxSizing: "border-box",
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                }}
            >
                {/* Left: Brand Logo & Title */}
                <button
                    type="button"
                    onClick={backToDocuments}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        border: 0,
                        background: "transparent",
                        cursor: "pointer",
                        padding: 0,
                        color: "#ffffff",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", color: "#ffffff" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
                            <line x1="9.69" y1="8" x2="21.17" y2="8" />
                            <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
                            <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
                            <line x1="14.31" y1="16" x2="2.83" y2="16" />
                            <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
                        </svg>
                    </div>
                    <span
                        style={{
                            fontSize: "17px",
                            fontWeight: 600,
                            letterSpacing: "-0.2px",
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                            color: "#ffffff",
                        }}
                    >
                        CollabDocs
                    </span>
                </button>

                {/* Center: Search Bar */}
                <div style={{ flex: "0 1 420px", position: "relative", margin: "0 20px" }}>
                    <span
                        style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "rgba(255, 255, 255, 0.4)",
                            fontSize: "14px",
                            pointerEvents: "none",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        type="search"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(event) => {
                            setSearchQuery(event.target.value);
                            setShowAllDocuments(false);
                            closeTemplateGallery();
                        }}
                        style={{
                            width: "100%",
                            height: "36px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            outline: "none",
                            borderRadius: "20px",
                            background: "rgba(255, 255, 255, 0.06)",
                            padding: "0 16px 0 38px",
                            boxSizing: "border-box",
                            fontSize: "13px",
                            color: "#ffffff",
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        }}
                    />
                </div>

                {/* Right: Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <button
                        type="button"
                        onClick={openTrash}
                        title="Trash"
                        style={{
                            border: 0,
                            background: "transparent",
                            cursor: "pointer",
                            color: "rgba(255, 255, 255, 0.6)",
                            padding: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "6px",
                            transition: "color 0.15s ease",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>

                    {/* White Pill CTA */}
                    <button
                        type="button"
                        onClick={logout}
                        style={{
                            height: "34px",
                            padding: "0 18px",
                            border: "none",
                            borderRadius: "9999px",
                            background: "#ffffff",
                            color: "#000000",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "13.5px",
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        <span
                            style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                background: "#000000",
                                color: "#ffffff",
                                fontSize: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                            }}
                        >
                            {(user?.name || "U").charAt(0).toUpperCase()}
                        </span>
                        <span>Sign out</span>
                    </button>
                </div>
            </header>

            <main ref={mainScrollRef} style={{ position: "absolute", inset: "86px 0 0", overflowY: "auto", overflowX: "hidden", maxWidth: "none", margin: 0, padding: "0 16px 70px", boxSizing: "border-box", overscrollBehavior: "contain", scrollbarGutter: "stable" }}>
                <div style={{ maxWidth: "1120px", margin: "0 auto", paddingTop: "24px" }}>
                    {showTrash ? (
                        <section>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "26px" }}>
                                <div>
                                    <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 400 }}>Trash</h1>
                                    <p style={{ margin: "7px 0 0", color: "#9aa4b2" }}>Documents you deleted.</p>
                                </div>
                                <button type="button" onClick={backToDocuments} style={{ border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.045)", borderRadius: "6px", padding: "9px 14px", cursor: "pointer", color: "#d5dbe3" }}>← Back to documents</button>
                            </div>

                            {trashLoading ? (
                                <div style={{ padding: "40px 0", color: "#9aa4b2" }}>Loading trash…</div>
                            ) : trashDocuments.length === 0 ? (
                                <div style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: "8px", padding: "50px", textAlign: "center", color: "#9aa4b2" }}>Trash is empty.</div>
                            ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,245px)", gap: "24px" }}>
                                    {trashDocuments.map((document) => (
                                        <div key={document._id} style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: "8px", padding: "16px", background: "rgba(255,255,255,.045)" }}>
                                            <div style={{ fontWeight: 500, marginBottom: "7px" }}>{document.title || "Untitled document"}</div>
                                            <p style={{ margin: 0, color: "#9aa4b2", fontSize: "13px" }}>Moved to trash.</p>
                                            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                                                <button type="button" disabled={restoring === document._id} onClick={() => restoreDocument(document._id)} style={{ flex: 1, border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.045)", borderRadius: "6px", padding: "8px", cursor: "pointer" }}>{restoring === document._id ? "Restoring…" : "Restore"}</button>
                                                <button type="button" disabled={permanentlyDeleting === document._id} onClick={() => permanentlyDeleteDocument(document._id)} style={{ flex: 1, border: "1px solid #f5c2c7", background: "#fff5f5", color: "#c5221f", borderRadius: "6px", padding: "8px", cursor: "pointer" }}>{permanentlyDeleting === document._id ? "Deleting…" : "Delete forever"}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ) : (
                        <>
                            {!showAllDocuments && !query && (
                                <section
                                    style={{
                                        margin: "-28px -200px 0",
                                        padding: "28px 40px 30px",
                                        background: "transparent",
                                        borderBottom: "1px solid #f1f3f4",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                                        <h1 style={{ margin: 0, fontSize: "20px", lineHeight: 1.2, fontWeight: 400 }}>Start a new document</h1>
                                        <button
                                            type="button"
                                            onClick={openTemplateGallery}
                                            style={{ border: 0, background: "transparent", color: "#d5dbe3", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
                                        >
                                            Template gallery <span style={{ fontSize: "17px" }}>⌄</span>
                                        </button>
                                    </div>

                                    <div style={{ position: "relative" }}>
                                        <button type="button" onClick={() => scrollTemplates("left")} aria-label="Previous templates" style={{ position: "absolute", left: "-18px", top: "112px", zIndex: 3, width: "38px", height: "38px", border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.045)", borderRadius: "50%", boxShadow: "0 1px 3px rgba(60,64,67,.18)", cursor: "pointer", color: "#9aa4b2", fontSize: "22px" }}>‹</button>
                                        <button type="button" onClick={() => scrollTemplates("right")} aria-label="Next templates" style={{ position: "absolute", right: "-18px", top: "112px", zIndex: 3, width: "38px", height: "38px", border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.045)", borderRadius: "50%", boxShadow: "0 1px 3px rgba(60,64,67,.18)", cursor: "pointer", color: "#9aa4b2", fontSize: "22px" }}>›</button>

                                        <div ref={templateCarouselRef} className="collabdocs-template-carousel" onWheel={handleTemplateCarouselWheel} onScroll={handleTemplateCarouselScroll} style={{ display: "flex", gap: "28px", overflowX: "auto", overflowY: "hidden", scrollBehavior: "auto", scrollSnapType: "none", overscrollBehaviorX: "contain", scrollbarWidth: "none", msOverflowStyle: "none", padding: "6px 20px 18px", margin: "0 -20px", }}>
                                            <button type="button" disabled={creating || Boolean(creatingTemplate)} onClick={createBlankDocument} style={{ width: "184px", minWidth: "184px", flex: "0 0 184px", border: 0, background: "transparent", padding: 0, textAlign: "left", cursor: creating || creatingTemplate ? "not-allowed" : "pointer" }}>
                                                <div style={{ height: "222px", background: "rgba(255,255,255,.045)", border: "1px solid rgba(255,255,255,.10)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                                                    <div style={{ width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a73e8", fontSize: "48px", fontWeight: 300, lineHeight: 1 }}>+</div>
                                                    {creating && <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.86)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#d5dbe3" }}>Creating…</div>}
                                                </div>
                                                <div style={{ padding: "10px 4px 0", fontSize: "14px", fontWeight: 500, color: "#eef2f7" }}>Blank document</div>
                                            </button>
                                            {normalTemplates.filter((template) => template.id !== "blank").map(templateCard)}
                                            {TEMPLATE_CATALOG.filter((template) => !normalTemplates.some((recent) => recent.id === template.id) && template.id !== "blank").map(templateCard)}
                                        </div>
                                    </div>
                                </section>
                            )}

                            <section
                                key={`${showAllDocuments ? "all" : query ? "search" : showStarredOnly ? "starred" : "recent"}-${documentsViewTransition}`}
                                className="collabdocs-documents-view-transition"
                                style={{
                                    marginTop: showAllDocuments || query ? 0 : "34px",
                                    viewTransitionName: "collabdocs-documents-view",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 500 }}>
                                            {query ? "Search results" : showStarredOnly ? "Starred documents" : showAllDocuments ? "All documents" : "Recent documents"}
                                        </h2>
                                        {!query && !showAllDocuments && !showStarredOnly && (
                                            <p style={{ margin: "5px 0 0", color: "#9aa4b2", fontSize: "13px" }}>Your latest documents</p>
                                        )}
                                    </div>

                                    {!query && !showAllDocuments && !showStarredOnly && (
                                        <button type="button" onClick={openAllDocuments} style={{ border: 0, background: "transparent", color: "#1a73e8", cursor: "pointer", fontSize: "14px", padding: "7px 8px" }}>
                                            View all documents
                                        </button>
                                    )}

                                    {showAllDocuments && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <button type="button" onClick={backToDocuments} style={{ border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.045)", borderRadius: "6px", padding: "7px 12px", cursor: "pointer", color: "#d5dbe3" }}>← Recent</button>
                                            <button type="button" onClick={() => setViewMode("grid")} title="Grid view" style={{ width: "36px", height: "36px", border: "1px solid rgba(255,255,255,.10)", background: viewMode === "grid" ? "#e8f0fe" : "white", borderRadius: "6px", cursor: "pointer", color: viewMode === "grid" ? "#1a73e8" : "#5f6368" }}>▦</button>
                                            <button type="button" onClick={() => setViewMode("list")} title="List view" style={{ width: "36px", height: "36px", border: "1px solid rgba(255,255,255,.10)", background: viewMode === "list" ? "#e8f0fe" : "white", borderRadius: "6px", cursor: "pointer", color: viewMode === "list" ? "#1a73e8" : "#5f6368" }}>☷</button>
                                        </div>
                                    )}
                                </div>

                                {loading ? (
                                    <div style={{ padding: "50px 0", color: "#9aa4b2" }}>Loading documents…</div>
                                ) : filteredDocuments.length === 0 ? (
                                    <div style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: "8px", padding: "45px 25px", textAlign: "center", color: "#9aa4b2" }}>
                                        <h3 style={{ margin: "0 0 8px", color: "#eef2f7", fontWeight: 500 }}>{query ? "No documents found" : "No documents yet"}</h3>
                                        <p style={{ margin: 0 }}>{query ? `Nothing matches “${searchQuery}”.` : "Choose Blank document above to get started."}</p>
                                    </div>
                                ) : showAllDocuments && viewMode === "list" ? (
                                    <div style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,.045)" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 1fr) 180px 150px 90px", gap: "16px", padding: "10px 14px", background: "rgba(255,255,255,.035)", color: "#9aa4b2", fontSize: "12px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                                            <span>Name</span><span>Owner</span><span>Last modified</span><span />
                                        </div>
                                        {filteredDocuments.map((document) => documentCard(document))}
                                    </div>
                                ) : (
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,245px)", gap: "24px", justifyContent: "start" }}>
                                        {(query || showAllDocuments ? filteredDocuments : recentDocuments).map((document) => documentCard(document, !showAllDocuments && !query))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}

                    {galleryMounted && (
                        <div
                            className="collabdocs-template-gallery-overlay"
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 1000,
                                background: "#080a0f",
                                transform:
                                    galleryTransition === "open"
                                        ? "translate3d(0, 0, 0)"
                                        : "translate3d(0, 100%, 0)",
                                opacity: galleryTransition === "closed" ? 0 : 1,
                                transition:
                                    galleryTransition === "open" || galleryTransition === "closing"
                                        ? "transform 430ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease"
                                        : "none",
                                willChange: "transform",
                                overflow: "hidden",
                                pointerEvents: "auto",
                                height: "100dvh",
                                maxHeight: "100dvh",
                            }}
                        >
                            <style>{`
                            .collabdocs-template-gallery-overlay {
                                overscroll-behavior-x: none !important;
                                touch-action: pan-y;
                                animation: collabdocsGalleryContentIn 480ms cubic-bezier(.22,1,.36,1) both;
                                scrollbar-width: none;
                                -ms-overflow-style: none;
                            }

                            .collabdocs-template-gallery-overlay [data-gallery-content] {
                                min-height: 100%;
                            }

                            @keyframes collabdocsGalleryContentIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                            }

                            .collabdocs-template-gallery-overlay header,
                            .collabdocs-template-gallery-overlay main {
                                animation: collabdocsGallerySlideIn 520ms cubic-bezier(.22,1,.36,1) both;
                            }

                            @keyframes collabdocsGallerySlideIn {
                                from { opacity: 0; transform: translateY(12px); }
                                to { opacity: 1; transform: translateY(0); }
                            }

                            .collabdocs-template-gallery-overlay::-webkit-scrollbar {
                                display: none;
                                width: 0;
                                height: 0;
                            }

                            .collabdocs-template-gallery-overlay::-webkit-scrollbar-thumb {
                                background: rgba(95, 99, 104, 0.28);
                                border-radius: 8px;
                            }

                            .collabdocs-template-gallery-overlay::-webkit-scrollbar-track {
                                background: transparent;
                            }

                            .collabdocs-gallery-row::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>

                            <div ref={galleryScrollRef} style={{ height: "100%", overflow: "hidden" }}>
                                <div data-gallery-scroll-content style={{ minHeight: "100%" }}>
                                    <header
                                        style={{
                                            height: "72px",
                                            minHeight: "72px",
                                            background: "rgba(18,20,25,.72)",
                                            border: "1px solid rgba(255,255,255,.10)",
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "0 32px",
                                            boxSizing: "border-box",
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 2,
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={closeTemplateGallery}
                                            aria-label="Back to documents"
                                            style={{
                                                width: "42px",
                                                height: "42px",
                                                border: 0,
                                                background: "transparent",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                                color: "#9aa4b2",
                                                fontSize: "29px",
                                                lineHeight: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            ←
                                        </button>

                                        <h1
                                            style={{
                                                margin: "0 0 0 16px",
                                                fontSize: "20px",
                                                lineHeight: 1,
                                                fontWeight: 400,
                                                color: "#eef2f7",
                                            }}
                                        >
                                            Template gallery
                                        </h1>
                                    </header>

                                    <div
                                        data-gallery-content
                                        style={{
                                            maxWidth: "1120px",
                                            margin: "0 auto",
                                            padding: "34px 16px 80px",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        <section style={{ marginBottom: "42px" }}>
                                            <h2
                                                style={{
                                                    margin: "0 0 22px",
                                                    fontSize: "20px",
                                                    fontWeight: 400,
                                                    color: "#eef2f7",
                                                }}
                                            >
                                                Recently used templates
                                            </h2>

                                            <div
                                                className="collabdocs-gallery-row"
                                                style={{
                                                    display: "flex",
                                                    gap: "24px",
                                                    overflowX: "auto",
                                                    paddingBottom: "4px",
                                                    scrollbarWidth: "none",
                                                }}
                                            >
                                                {normalTemplates.map(templateCard)}
                                            </div>
                                        </section>

                                        {galleryCategories.map((category) => {
                                            const categoryTemplates =
                                                TEMPLATE_CATALOG.filter(
                                                    (template) =>
                                                        template.category === category
                                                );

                                            return (
                                                <section
                                                    key={category}
                                                    style={{ marginBottom: "42px" }}
                                                >
                                                    <h2
                                                        style={{
                                                            margin: "0 0 22px",
                                                            fontSize: "20px",
                                                            fontWeight: 400,
                                                            color: "#eef2f7",
                                                        }}
                                                    >
                                                        {category}
                                                    </h2>

                                                    <div
                                                        className="collabdocs-gallery-row"
                                                        style={{
                                                            display: "flex",
                                                            gap: "24px",
                                                            overflowX: "auto",
                                                            overflowY: "hidden",
                                                            paddingBottom: "4px",
                                                            scrollbarWidth: "none",
                                                            touchAction: "pan-x",
                                                            overscrollBehaviorX: "contain",
                                                        }}
                                                    >
                                                        {categoryTemplates.map(
                                                            templateCard
                                                        )}
                                                    </div>
                                                </section>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <Footer
                        onHome={() => {
                            setShowAllDocuments(false);
                            setShowTemplateGallery(false);
                            setSearchQuery("");
                            setShowStarredOnly(false);
                        }}
                    />
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
