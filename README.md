# Skill Management System
> This project is an ERP-style application for automating the management of employee skills and talent using **Large Language Models**. The backend is built with **Spring Boot** and **PostgreSQL**, with **Qdrant** used as a vector database for semantic similarity search. The frontend is built with **Angular** and **Angular Material**. AI features are powered by **LangChain4j** integrated with **OpenAI** models, using a multi-agent pipeline to extract, structure, and match skills from unstructured text such as CVs and job descriptions. Real-time updates are delivered via **Server-Sent Events (SSE)** built on **Spring WebFlux**.


https://github.com/user-attachments/assets/45477a86-948e-4d6f-8ac6-7274c16983f9


## Made By
> :man_student: **Dejan Ristovski**

## Mentor
> :woman_technologist: **Prof. Dr. Ana Madevska Bogdanova**

## Features

> ### Skill Extraction Pipeline
> **Text-to-Skill Extraction:** Paste any unstructured text (job description, CV excerpt, etc.) and the system automatically detects relevant skills, assigns proficiency levels, and flags which ones already exist in the system to prevent duplicates.

> ### Skill Management
> **Skills Dashboard:** A centralized view of every skill in the system, each shown with a description and a visual Beginner → Intermediate → Advanced progress indicator.
>
> **Assign / Unassign Skills:** Managers can add or remove skills from an employee's profile through a drawer interface, selecting from existing skills and levels.

> ### CV Processing & Talent Development
> **Resume Upload & Analysis:** Managers upload an employee's CV, and the system compares detected skills against the employee's existing profile — classifying each as `Existing`, `Upskill`, `Downskill`, or `New` before the manager confirms which changes to save.

> ### Job Postings
> **Generate Job Posting:** Select a set of required skills and levels, and an LLM agent generates a full, professional job posting — including responsibilities and qualifications — constrained strictly to the selected requirements.
>
> **Browse & Edit Postings:** View all open postings and edit their descriptions using a rich text editor.

> ### Applicant Screening
> **Apply to a Posting:** Unregistered users can apply to a job posting by submitting basic details and uploading their CV.
>
> **Automatic Match Scoring:** Uploaded CVs are processed automatically, and each applicant is scored by percentage match against the posting's required skills — scores can exceed 100% for overqualified candidates.

> ### User Roles & Authentication
> **Login & Register:** Secure authentication for employees and managers.
>
> **Role-Based Access:** Three access tiers — **unregistered users** (browse/apply to postings), **employees** (view profiles, skills, and postings), and **managers** (full access, including skill generation, CV processing, and posting management).
>
> **User Directory & Profiles:** Browse all registered users and view individual profiles showing name, position, contact info, and their full skill set with levels.

## Architecture Highlights

> **Multi-Agent Design:** Instead of one monolithic model, the pipeline is split across specialized agents — skill name extraction, level generation, similarity matching, level matching, and skill extension — each with a narrowly scoped prompt for higher accuracy and easier maintenance.
>
> **RAG-Backed Deduplication:** New skills are embedded and compared against existing entries in Qdrant; matches above a 0.9 similarity threshold reuse the existing skill instead of creating a duplicate.
>
> **Streaming Results:** Generated skills are streamed to the frontend via SSE as they're produced, rather than waiting for the entire batch to finish processing.
