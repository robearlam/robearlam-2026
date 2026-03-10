# tasks/tasks.py
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
        8. Content requirements
        9. Acceptance criteria for every requirement — written as testable assertions
        10. Out of scope — what we are explicitly NOT building in this version

        Be thorough. Identify requirements the client hasn't explicitly stated but 
        clearly needs. Every acceptance criterion must be specific and measurable.
        """,
        expected_output="""
        A structured markdown document with clearly headed sections.
        Acceptance criteria must be numbered and written as:
        'Given [context], When [action], Then [outcome]'
        or as clear measurable assertions (e.g. 'Page loads in under 2 seconds').
        """,
        agent=spec_agent,
        output_file="outputs/specification.md"
    )

def create_ui_design_task(ui_designer_agent, spec_task):
    return Task(
        description="""
        Using the product specification, create a complete visual design 
        specification for the personal website.

        Your design specification must include:
        1. Aesthetic direction — describe the overall visual personality 
           (e.g. minimal and editorial, bold and expressive, warm and approachable)
        2. Colour palette — primary, secondary, accent, background and text colours 
           as exact hex codes with usage rules for each
        3. Typography — heading font, body font, code font (Google Fonts names), 
           with size scale, weights and line heights for each text style
        4. Spacing system — base unit and scale (e.g. 4px base, scale: 4, 8, 16, 24, 32...)
        5. Layout structure — describe the layout of each page with enough detail 
           to understand visual hierarchy and content placement
        6. Component styling — how key components look: navigation, buttons, cards, 
           forms, footer, hero section, any other recurring elements
        7. Responsive behaviour — how the layout adapts at mobile, tablet and desktop
        8. Imagery and iconography direction — style of any icons or images used
        9. Micro-interactions — any hover states, transitions or animations

        Every value must be specific and implementable. No vague directions like 
        'clean' or 'modern' without concrete design decisions to back them up.
        """,
        expected_output="""
        A structured markdown design specification document.
        All colours as hex codes. All fonts as exact names.
        All sizes as pixel or rem values. Layout descriptions 
        detailed enough that no visual decisions are left to the developer.
        """,
        agent=ui_designer_agent,
        context=[spec_task],
        output_file="outputs/ui_design.md"
    )

def create_architecture_task(architect_agent, spec_task, ui_design_task):
    return Task(
        description="""
        Using the product specification and the visual design specification, 
        create the complete technical architecture for the Next.js 16 personal website.

        Your architecture must include:
        1. Project folder structure — every directory and key file as an ASCII tree
        2. Component breakdown — every React component, its purpose, props, and 
           which design system elements from the UI spec it implements
        3. Page breakdown — which components each page uses and how they compose
        4. Data structures — any TypeScript interfaces or types needed
        5. Routing plan — all routes, whether static or dynamic
        6. Styling approach — how Tailwind will be configured to match the UI spec 
           (colours, fonts, spacing scale mapped to Tailwind config)
        7. Third-party packages required beyond Next.js core
        8. Environment variables needed
        9. Build and run instructions

        For every significant decision, briefly state why you chose it 
        over the alternative. Your architecture must make the UI design 
        fully implementable — if something in the design is technically 
        complex, call it out and propose how to handle it.
        """,
        expected_output="""
        A structured markdown document with the full technical architecture.
        Folder structure as an ASCII tree. Each component with a clear 
        description of its responsibility and its visual design relationship.
        Tailwind config values mapped directly from the UI design spec.
        """,
        agent=architect_agent,
        context=[spec_task, ui_design_task],
        output_file="outputs/architecture.md"
    )


def create_tdd_task(qa_agent, spec_task, design_task):
    return Task(
        description="""
        Using the specification and technical design, write a comprehensive 
        Jest test suite for the personal website BEFORE any code is written.

        This is Test-Driven Development. The tests define what correct behaviour 
        looks like. The developer will then write code to make these tests pass.

        Your test suite must:
        1. Cover every acceptance criterion in the specification
        2. Test each React component in isolation (unit tests)
        3. Test key user journeys end to end (integration tests)
        4. Test edge cases and error states
        5. Use React Testing Library for component tests
        6. Be organised to mirror the component structure in the design

        Write the complete test file contents. Each test must have a clear 
        description that explains what behaviour it is verifying.
        """,
        expected_output="""
        A markdown document containing:
        1. A test plan summarising what is being tested and why
        2. The complete Jest test code, organised by component/page
        3. Setup instructions (jest.config.js, required packages)
        Each test must have a descriptive name that reads as a plain English 
        statement of expected behaviour.
        """,
        agent=qa_agent,
        context=[spec_task, design_task],
        output_file="outputs/test_suite.md"
    )


def create_dev_task(developer_agent, spec_task, ui_design_task, architecture_task, tdd_task):
    return Task(
        description="""
        Using the specification, technical design, and test suite, build the 
        complete Next.js 16 personal website.

        Your goal is to write code that passes every test in the test suite.
        Follow the technical design exactly — do not deviate from the agreed 
        architecture without documenting your reason.

        You must produce:
        1. All Next.js pages and components as defined in the design
        2. All supporting files (layouts, config, styles)
        3. A package.json with all required dependencies
        4. A jest.config.js configured for Next.js 16
        5. Clear inline comments on any non-obvious logic

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

        End with a summary of all files created and the command to 
        install dependencies and run the development server.
        """,
        agent=developer_agent,
        context=[spec_task, ui_design_task, architecture_task, tdd_task],
        output_file="outputs/codebase.md"
    )


def create_security_task(security_agent, dev_task):
    return Task(
        description="""
        Perform a security review of the Next.js codebase that has been built.

        Run a thorough analysis covering:
        1. Any hardcoded secrets or credentials
        2. Injection vulnerabilities (XSS, SQL injection patterns)
        3. Insecure dependencies or import patterns
        4. Missing security headers
        5. Exposed environment variables or sensitive data
        6. Authentication and authorisation issues (if applicable)
        7. Any OWASP Top 10 concerns relevant to this codebase

        For every finding, provide:
        - Severity: Critical / High / Medium / Low / Informational
        - Location: specific file and line reference
        - Description: what the vulnerability is
        - Recommendation: exactly how to fix it
        """,
        expected_output="""
        A structured markdown security report with:
        1. Executive summary (overall risk rating, finding counts by severity)
        2. Detailed findings in descending severity order
        3. A remediation checklist the developer can work through
        """,
        agent=security_agent,
        context=[dev_task],
        output_file="outputs/security_report.md"
    )