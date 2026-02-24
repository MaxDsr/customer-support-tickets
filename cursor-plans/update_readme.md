README is outdated in these ways:                                                                                                                                                              
  - POST /api/tickets listed — route doesn't exist in the code                                                                                                                                   
  - Ticket schema: wrong status values (in_progress | resolved → should be pending | closed), missing priority, customer, has createdAt which doesn't exist                                      
  - Stack says "Node.js 20+" but Dockerfiles use 22                                                                                                                                              
  - Project structure missing components/ subfolders and Docker files                                                                                                                            
  - No Docker section at all                                                                                                                                                                   

  Also: TS diagnostic in vite.config.ts — process is not typed because @types/node isn't a direct frontend dependency. Need to install it.

  ---
  Plan:

  1. Fix the TS error — npm install -D @types/node in frontend/
  2. Rewrite README.md to reflect current state:
    - Fix stack table
    - Update project structure (add components, Docker files)
    - Keep local dev steps, add a Docker section with step-by-step spin-up
    - Fix API reference (remove POST, add query params for GET /api/tickets)
    - Fix ticket schema to match db.ts

  No questions — the code is the source of truth. Proceeding.