Project Execution Guidelines

Important: Please treat the following instructions as mandatory project standards and keep them in context throughout the workflow.

1. Environment Configuration
   - Do not hardcode anything, including database credentials, API URLs, ports, or connection details.
   - All configuration values must be managed centrally through the .env file.

2. Task Completion
   - Do not stop work until the assigned task is fully completed.
   - Avoid delivering partial, unfinished, or unverified work.

3. Documentation Updates
   - Keep @Readme.md and @changelog.md fully updated.
   - Every completed workflow, task, or TODO must be recorded with the correct date and time.
   - If any new Markdown documentation is created, it must be placed only inside the docs folder, never in the project root or other directories.

4. Preserve Existing Functionality
   - Do not modify, break, or interfere with any currently working API, feature, workflow, or logic.
   - If additional functionality is required, create new APIs or modules instead of altering stable existing ones, unless absolutely necessary.

5. Development Logic Protection
   - Maintain the existing development structure and logic with great care.
   - Do not make unapproved architectural, functional, or behavioral changes.

6. Database Safety
   - Do not migrate, flash, truncate, delete, or alter any database table without explicit permission.
   - If migration is required and approved, always take a complete backup first.
   - Follow the guidance in @prisma_docs_without_flashing.md to ensure no data loss.

7. API Documentation
   - If any new API is created, update the API documentation accordingly.
   - Include all new endpoints clearly in the API documentation.

8. Author Information
   - Add the following author details in a clean and properly commented format where appropriate:

   Developer by: Muhammad Kalim
   Phone/WhatsApp: +92 333 3836851
   Product of LogixInventor (PVT) Ltd.
   Email: info@logixinventor.com
   Website: www.logixinventor.com

9. Code Quality Standards
   - Code must be clean, readable, maintainable, and properly commented.
   - Include robust error handling using appropriate try, catch, and throw patterns where needed.

10. Frontend and API Compatibility
   - The frontend is already consuming the existing APIs.
   - Do not change API ports, response structures, or behaviors in ways that may break the frontend.
   - Be especially careful with any changes affecting frontend integration.

11. Testing and Verification
   - After completing all tasks, perform thorough testing and deep verification.
   - Ensure everything is fully functional before delivery.
   - If any issue is found, fix it before marking the work as complete.

12. System Environment Constraints
   - Do not change the MySQL port. It must remain on 3306.
   - Existing authentication is:
     - Username: root
     - Password: Testtest123!
   - The project runs on localhost, not Docker.
   - Use the @start.sh script for execution.

13. Project Knowledge Requirement
   - Always read and follow the contents of the @docs folder for project requirements, workflows, and completed tasks.
   - Treat the @docs folder as a core source of truth for implementation context.

14. Performance Requirements
   - Optimize the system to be as fast and efficient as possible.
   - Use asynchronous operations wherever appropriate to reduce load time.
   - Ensure image loading is handled asynchronously for better performance.
   - Improve database sync and load operations with efficient, scalable techniques.
   - Where technically appropriate and safe, apply multithreading or parallel processing strategies to improve performance.

15. CRUD and Full-Stack Quality
   - All CRUD operations must be implemented professionally with a modern, corporate-quality standard.
   - Frontend, backend, and database design must be aligned and relational.
   - Use proper database practices where required, including:
     - Stored Procedures
     - Views
     - Functions
     - Triggers
   - Where suitable, include AJAX, async processing, multitasking, and optimized concurrent handling.

16. UI/UX Standards
   - The interface should be modern, professional, responsive, user-friendly, and polished.
   - Use clean, corporate, and visually appealing UI/UX.
   - Add smooth and meaningful animations where appropriate without affecting performance.

17. Security Requirements
   - The web application must be secure.
   - Apply proper authentication and authorization practices.
   - Ensure error handling and validation are implemented carefully across frontend, backend, and database interactions.

18. Change Control
   - Do not change any existing functionality, feature, code, database structure, port, or logic without explicit permission.
   - Only implement approved changes and preserve the stability of the current system.

19. Implementation Methodology
   - Follow the Waterfall methodology for implementation.
   - Keep all stages organized, sequential, and well-documented.

20. Git Workflow
   - After completing all tasks and verification, run the following Git commands:

   git add .
   git commit -m "What so far you done message"
   git push origin main -f


Admin panel Port : localhost:4000
Frontand port : localhost:3000
My Database port : localhost:8080/phpmyadmin 
Database user name root and password 12345

Please this website create a Table of Database 