# tasks/tasks.py
# Single source of truth for all task descriptions.
# Both main.py and individual runner scripts import from here.

from crewai import Task


def create_spec_task(spec_agent, user_brief):
    return Task(
        description=f"""
        A client has provided the following brief for their personal website:

        ---
        {user_brief}
        ---

        Transform this brief into a complete specification document.

        Your specification must include:
        1. Project overview and purpose
        2. Target audience
        3. Functional requirements (what the site must do)
        4. Non-functional requirements (performance, accessibility, SEO)
        5. Page inventory — every page the site needs
        6. For each page: purpose, content sections, and user interactions
        7. Navigation structure
        8. Content requirements — including that blog posts and speaking 
           engagements must be organised by year and month
        9. Acceptance criteria for every requirement — written as testable assertions
        10. Out of scope — what we are explicitly NOT building in this version

        Be thorough. Identify requirements the client hasn't explicitly stated 
        but clearly needs. Every acceptance criterion must be specific and measurable.
        """,
        expected_output="""
        A structured markdown document with clearly headed sections.
        Acceptance criteria must be numbered and written as:
        'Given [context], When [action], Then [outcome]'
        or as clear measurable assertions.
        """,
        agent=spec_agent,
        output_file="outputs/specification.md"
    )


def create_ui_design_task(ui_designer_agent, specification):
    return Task(
        description=f"""
        Using the product specification below, create a complete visual design 
        specification for the personal website.

        PRODUCT SPECIFICATION:
        ---
        {specification}
        ---

        Your design specification must include:
        1. Aesthetic direction — the overall visual personality and feeling
        2. Colour palette — the primary accent colour MUST be dark red 
           (this is a firm client requirement, not a suggestion). Build the 
           full palette around dark red as the hero colour. Provide all 
           colours as exact hex codes with a usage rule for each.
        3. Typography — heading font, body font, code font as exact Google Fonts 
           names, with size scale, weights and line heights for each text style
        4. Spacing system — base unit and full scale as pixel values
        5. Layout structure — describe the layout of each page in enough detail 
           to understand visual hierarchy and content placement
        6. Component styling — navigation, buttons, cards, hero section, 
           blog post list, speaking engagement cards, contact section, footer
        7. Responsive behaviour — how the layout adapts at mobile, tablet, desktop
        8. Imagery and iconography direction
        9. Micro-interactions — hover states, transitions and animations

        Every value must be specific and implementable as code.
        No vague directions — back every decision with a concrete value.
        """,
        expected_output="""
        A structured markdown design specification document.
        All colours as hex codes. All fonts as exact Google Fonts names.
        All sizes as px or rem values. Layout descriptions precise enough 
        that no visual decisions are left to the developer.
        """,
        agent=ui_designer_agent,
        output_file="outputs/ui_design.md"
    )


def create_architecture_task(architect_agent, specification, ui_design):
    return Task(
        description=f"""
        Using the product specification and visual design specification below,
        create the complete technical architecture for a Next.js 16 personal website.

        PRODUCT SPECIFICATION:
        ---
        {specification}
        ---

        VISUAL DESIGN SPECIFICATION:
        ---
        {ui_design}
        ---

        Your architecture must include:
        1. Project folder structure — every directory and key file as an ASCII tree
        2. Component breakdown — every React component, its purpose, its props, 
           and which visual design elements from the UI spec it implements
        3. Page breakdown — which components each page composes and how
        4. TypeScript interfaces and types needed
        5. Routing plan — all Next.js 16 routes, static vs dynamic.
           Blog posts must follow /blog/[year]/[month]/[slug].
           Speaking engagements must follow /speaking/[year]/[month]/[slug].
           Content files must mirror this in the file system:
           e.g. content/blog/2024/03/post-title.md
           This must support a large archive of historical content.
        6. Tailwind configuration — map every colour, font and spacing value 
           from the UI design spec into tailwind.config.ts values
        7. Third-party packages required (exact npm package names)
        8. Environment variables needed and where they are used
        9. Build and run instructions

        For every significant architectural decision, briefly state why you 
        chose it over the alternative.
        """,
        expected_output="""
        A structured markdown document with the full technical architecture.
        Folder structure as an ASCII tree. Component breakdown with props 
        clearly defined. Tailwind config values mapped directly from the 
        UI design spec. All package names explicit.
        """,
        agent=architect_agent,
        output_file="outputs/architecture.md"
    )


def create_tdd_task(qa_agent, specification, architecture):
    return Task(
        description=f"""
        Using the specification and architecture below, write a comprehensive 
        Jest test suite for the personal website BEFORE any code is written.

        PRODUCT SPECIFICATION:
        ---
        {specification}
        ---

        TECHNICAL ARCHITECTURE:
        ---
        {architecture}
        ---

        This is Test-Driven Development. The tests define correct behaviour.
        The developer will write code to make these tests pass.

        Your test suite must:
        1. Cover every acceptance criterion in the specification
        2. Test each React component in isolation (unit tests)
        3. Test key user journeys end to end (integration tests)
        4. Test edge cases and error states
        5. Test that blog and speaking content routes resolve correctly 
           for year/month/slug patterns
        6. Use React Testing Library for component tests
        7. Be organised to mirror the component structure in the architecture

        Write complete test file contents. Each test must have a clear 
        description that reads as a plain English statement of behaviour.
        """,
        expected_output="""
        A markdown document containing:
        1. A test plan summarising what is being tested and why
        2. Complete Jest test code organised by component/page
        3. Setup instructions — jest.config.js and required packages
        Each test must have a descriptive name that is a plain English 
        statement of expected behaviour.
        """,
        agent=qa_agent,
        output_file="outputs/test_suite.md"
    )


def create_dev_task(developer_agent, specification, ui_design, architecture, test_suite):
    return Task(
        description=f"""
        Using the documents below, build the complete Next.js 16 personal website.
        Your goal is to write code that passes every test in the test suite.

        PRODUCT SPECIFICATION:
        ---
        {specification}
        ---

        VISUAL DESIGN SPECIFICATION:
        ---
        {ui_design}
        ---

        TECHNICAL ARCHITECTURE:
        ---
        {architecture}
        ---

        TEST SUITE:
        ---
        {test_suite}
        ---

        You must produce:
        1. All Next.js pages and components as defined in the architecture
        2. All supporting files — layouts, config, styles, tailwind config
        3. A package.json with all required dependencies
        4. A jest.config.js configured for Next.js 16
        5. Content folder structure with example markdown files demonstrating 
           the year/month/slug pattern for blog and speaking content
        6. Clear inline comments on any non-obvious logic

        Write complete file contents. Do not abbreviate or use placeholders.
        Every file must be production-ready.
        """,
        expected_output="""
        A markdown document containing every file that needs to be created,
        in this format for each file:

        ### filepath/filename.ext
```language
        [complete file contents]
```

        End with a summary of all files created and the commands to 
        install dependencies and run the development server.
        """,
        agent=developer_agent,
        output_file="outputs/codebase.md"
    )


def create_security_task(security_agent, codebase):
    return Task(
        description=f"""
        Perform a thorough security review of the Next.js codebase below.

        CODEBASE:
        ---
        {codebase}
        ---

        Your review must cover:
        1. Hardcoded secrets or credentials
        2. Injection vulnerabilities (XSS, SQL injection patterns)
        3. Insecure dependencies or import patterns
        4. Missing security headers
        5. Exposed environment variables or sensitive data
        6. Authentication and authorisation issues if applicable
        7. Any OWASP Top 10 concerns relevant to this codebase

        For every finding provide:
        - Severity: Critical / High / Medium / Low / Informational
        - Location: specific file and line reference
        - Description: what the vulnerability is
        - Recommendation: exactly how to fix it
        """,
        expected_output="""
        A structured markdown security report with:
        1. Executive summary — overall risk rating and finding counts by severity
        2. Detailed findings in descending severity order
        3. A remediation checklist the developer can work through
        """,
        agent=security_agent,
        output_file="outputs/security_report.md"
    )