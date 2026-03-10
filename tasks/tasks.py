# tasks/tasks.py
# Single source of truth for all task descriptions.
# Both main.py and all runner scripts import from here.

from crewai import Task


# ═══════════════════════════════════════════════════════
#  INITIAL PIPELINE TASKS (run once at project start)
# ═══════════════════════════════════════════════════════

def create_spec_task(agent, user_brief):
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
        8. Content requirements — blog posts and speaking engagements
           must be organised by year and month
        9. Acceptance criteria for every requirement — written as testable
           assertions in Given/When/Then format
        10. Out of scope — what is explicitly NOT being built in this version

        Be thorough. Identify requirements the client hasn't stated but
        clearly needs. Every acceptance criterion must be measurable.
        """,
        expected_output="""
        A structured markdown document with clearly headed sections.
        Acceptance criteria numbered and written as:
        'Given [context], When [action], Then [outcome]'
        """,
        agent=agent,
        output_file="outputs/specification.md"
    )


def create_ui_design_task(agent, specification):
    return Task(
        description=f"""
        Using the product specification below, create a complete visual design
        specification for the personal website.

        PRODUCT SPECIFICATION:
        ---
        {specification}
        ---

        Your design specification must include:
        1. Aesthetic direction — the overall visual personality
        2. Colour palette — primary accent MUST be dark red (firm client
           requirement). Build the full palette around dark red.
           All colours as exact hex codes with usage rules.
        3. Typography — heading, body and code fonts as exact Google Fonts
           names, with size scale, weights and line heights
        4. Spacing system — base unit and full scale as pixel values
        5. Layout structure — each page described in enough detail to
           understand visual hierarchy and content placement
        6. Component styling — navigation, buttons, cards, hero, blog list,
           speaking cards, contact section, footer
        7. Responsive behaviour — mobile, tablet, desktop
        8. Imagery and iconography direction
        9. Micro-interactions — hover states, transitions, animations

        Every value must be specific and implementable. No vague directions.
        """,
        expected_output="""
        A structured markdown design specification.
        All colours as hex codes. All fonts as exact names.
        All sizes as px or rem. No visual decision left to the developer.
        """,
        agent=agent,
        output_file="outputs/ui_design.md"
    )


def create_architecture_task(agent, specification, ui_design):
    return Task(
        description=f"""
        Using the specification and visual design below, create the complete
        technical architecture for a Next.js 16 personal website.

        PRODUCT SPECIFICATION:
        ---
        {specification}
        ---

        VISUAL DESIGN SPECIFICATION:
        ---
        {ui_design}
        ---

        Your architecture must include:
        1. Project folder structure as an ASCII tree
        2. Component breakdown — every React component, its purpose,
           props, and which design elements it implements
        3. Page breakdown — which components each page composes
        4. TypeScript interfaces and types
        5. Routing plan — all routes, static vs dynamic.
           Blog: /blog/[year]/[month]/[slug]
           Speaking: /speaking/[year]/[month]/[slug]
           Content files must mirror this in the file system.
        6. Tailwind config — every colour, font and spacing value from
           the UI design mapped to tailwind.config.ts values
        7. Third-party packages required (exact npm names)
        8. Environment variables and where they are used
        9. Build and run instructions

        State your reasoning for every significant decision.
        """,
        expected_output="""
        A structured markdown document. Folder structure as ASCII tree.
        Components with props defined. Tailwind config values mapped
        directly from the UI design spec.
        """,
        agent=agent,
        output_file="outputs/architecture.md"
    )


# ═══════════════════════════════════════════════════════
#  FEATURE ANALYSIS TASK
# ═══════════════════════════════════════════════════════

def create_feature_analysis_task(agent, feature_request,
                                  specification, ui_design,
                                  architecture, feature_history):
    return Task(
        description=f"""
        A new feature has been requested. Your job is to assess it against
        the existing project documentation and determine what is needed
        before development can begin.

        FEATURE REQUEST:
        ---
        {feature_request}
        ---

        EXISTING SPECIFICATION:
        ---
        {specification}
        ---

        EXISTING UI DESIGN:
        ---
        {ui_design}
        ---

        EXISTING ARCHITECTURE:
        ---
        {architecture}
        ---

        PREVIOUSLY IMPLEMENTED FEATURES:
        ---
        {feature_history}
        ---

        Assess the feature request against all existing documentation.
        Reference specific sections by name when supporting your reasoning.

        Your assessment must conclude with one of two verdicts:

        TIER 1 — The feature is fully covered by existing documentation.
        Development can begin immediately with no upstream changes needed.

        TIER 2 — The feature requires upstream planning before development.
        List exactly which documents need updating and what must be added.

        Be decisive. If in doubt, lean toward TIER 2 — it is always better
        to plan properly than to build on an incomplete foundation.
        """,
        expected_output="""
        A structured markdown assessment:

        ## Feature Analysis: [Feature Name]

        **Verdict: TIER 1 / TIER 2**

        ### What is already covered
        [Referenced sections from existing docs]

        ### What is missing or needs updating
        [Specific gaps — or 'Nothing' for TIER 1]

        ### Recommended next steps
        [Exactly what to run before development, or 'Proceed to development']
        """,
        agent=agent
    )


# ═══════════════════════════════════════════════════════
#  SCAFFOLD TASK
# ═══════════════════════════════════════════════════════

def create_scaffold_task(agent, specification, ui_design, architecture):
    return Task(
        description=f"""
        Build the foundational scaffold for the Next.js 16 personal website.
        This is the starting point — empty pages, configuration and layout
        only. No feature-specific content yet.

        SPECIFICATION:
        ---
        {specification}
        ---

        UI DESIGN:
        ---
        {ui_design}
        ---

        ARCHITECTURE:
        ---
        {architecture}
        ---

        Produce ONLY the scaffold — these files and nothing more:
        1. package.json — all dependencies from the architecture
        2. next.config.ts — Next.js 16 configuration
        3. tailwind.config.ts — all colours, fonts and spacing from UI design
        4. tsconfig.json — TypeScript configuration
        5. jest.config.ts — Jest configured for Next.js 16
        6. jest.setup.ts — testing library setup
        7. src/app/layout.tsx — root layout with Header and Footer
        8. src/app/page.tsx — homepage shell (empty sections, no content)
        9. src/app/globals.css — global styles and font imports
        10. src/components/layout/Header.tsx — navigation component
        11. src/components/layout/Footer.tsx — footer component
        12. src/components/layout/Navigation.tsx — nav links component
        13. public/ — placeholder favicon

        Every file must be complete and production-ready.
        No placeholder comments. No TODOs. No truncated code.
        """,
        expected_output="""
        A markdown document containing every scaffold file in this format:

        ### filepath/filename.ext
```language
        [complete file contents]
```

        Followed by: install command, dev server command, test command.
        """,
        agent=agent,
        output_file="outputs/scaffold.md"
    )


# ═══════════════════════════════════════════════════════
#  FEATURE DEVELOPMENT TASKS
# ═══════════════════════════════════════════════════════

def create_feature_dev_task(agent, feature_request,
                             specification, ui_design,
                             architecture, codebase_index):
    return Task(
        description=f"""
        Implement the following feature for the Next.js 16 personal website.

        FEATURE REQUEST:
        ---
        {feature_request}
        ---

        SPECIFICATION:
        ---
        {specification}
        ---

        UI DESIGN:
        ---
        {ui_design}
        ---

        ARCHITECTURE:
        ---
        {architecture}
        ---

        FILES ALREADY BUILT:
        ---
        {codebase_index}
        ---

        Implement only what is needed for this feature.
        Do not recreate files that already exist unless modifying them.
        If modifying an existing file, output the complete updated file —
        never a partial diff or snippet.

        Every file must be complete and production-ready.
        No placeholder comments. No TODOs. No truncated code.
        """,
        expected_output="""
        A markdown document with every new or modified file:

        ### filepath/filename.ext
        *(new)* or *(modified)*
```language
        [complete file contents]
```

        Followed by a summary listing all files created or modified.
        """,
        agent=agent,
        output_file="outputs/feature_output.md"
    )


def create_feature_qa_task(agent, feature_request,
                            specification, feature_output):
    return Task(
        description=f"""
        Write and evaluate tests for the following feature.

        FEATURE REQUEST:
        ---
        {feature_request}
        ---

        SPECIFICATION (for acceptance criteria):
        ---
        {specification}
        ---

        FEATURE CODE:
        ---
        {feature_output}
        ---

        Write a focused Jest test suite that covers:
        1. Every acceptance criterion related to this feature
        2. Component behaviour for all new components
        3. Route resolution for any new routes
        4. Edge cases and error states specific to this feature

        Then evaluate the feature code against your tests and report
        every failure with:
        - The exact test that failed
        - Expected vs actual behaviour
        - The specific file and function causing the failure
        """,
        expected_output="""
        A markdown document with:
        1. Complete test suite for this feature
        2. Test results — PASSED or FAILED with details
        3. Bug report — one entry per failure with exact reproduction steps
        4. Overall verdict: PASS (ready for security review) or
           FAIL (must return to developer)
        """,
        agent=agent,
        output_file="outputs/feature_qa.md"
    )


# ═══════════════════════════════════════════════════════
#  MINI PLANNING TASKS (Tier 2 features only)
# ═══════════════════════════════════════════════════════

def create_mini_spec_task(agent, feature_request, existing_spec):
    return Task(
        description=f"""
        The following feature requires additions to the project specification.

        FEATURE REQUEST:
        ---
        {feature_request}
        ---

        EXISTING SPECIFICATION:
        ---
        {existing_spec}
        ---

        Add only what is needed for this feature. Do not rewrite or
        restructure existing content. Append new requirements, acceptance
        criteria and page definitions that the feature introduces.
        Maintain the exact style and formatting of the existing document.
        """,
        expected_output="""
        A complete updated specification.md with new content clearly
        integrated — not appended as a separate section at the bottom,
        but woven into the correct existing sections.
        """,
        agent=agent,
        output_file="outputs/specification.md"
    )


def create_mini_ui_task(agent, feature_request,
                         existing_ui_design, existing_spec):
    return Task(
        description=f"""
        The following feature requires additions to the UI design specification.

        FEATURE REQUEST:
        ---
        {feature_request}
        ---

        EXISTING UI DESIGN:
        ---
        {existing_ui_design}
        ---

        UPDATED SPECIFICATION:
        ---
        {existing_spec}
        ---

        Add only the visual design decisions this feature introduces.
        New components, layout patterns or interaction styles only.
        Maintain perfect consistency with the existing design system —
        reuse established colours, fonts, spacing and patterns wherever
        possible rather than introducing new ones.
        """,
        expected_output="""
        A complete updated ui_design.md with new design decisions
        integrated consistently into the existing document.
        """,
        agent=agent,
        output_file="outputs/ui_design.md"
    )


def create_mini_architecture_task(agent, feature_request,
                                   existing_architecture,
                                   existing_spec, existing_ui_design):
    return Task(
        description=f"""
        The following feature requires additions to the technical architecture.

        FEATURE REQUEST:
        ---
        {feature_request}
        ---

        EXISTING ARCHITECTURE:
        ---
        {existing_architecture}
        ---

        UPDATED SPECIFICATION:
        ---
        {existing_spec}
        ---

        UPDATED UI DESIGN:
        ---
        {existing_ui_design}
        ---

        Add only the architectural decisions this feature introduces —
        new components, routes, data structures or packages.
        Do not restructure or rewrite existing architectural decisions.
        Integrate new additions as if they were always part of the design.
        """,
        expected_output="""
        A complete updated architecture.md with new technical decisions
        integrated cleanly into the existing document.
        """,
        agent=agent,
        output_file="outputs/architecture.md"
    )


# ═══════════════════════════════════════════════════════
#  SECURITY TASK
# ═══════════════════════════════════════════════════════

def create_security_task(agent, feature_output):
    return Task(
        description=f"""
        Perform a security review of the following code.

        CODE:
        ---
        {feature_output}
        ---

        Review for:
        1. Hardcoded secrets or credentials
        2. XSS and injection vulnerabilities
        3. Insecure import patterns
        4. Missing security headers
        5. Exposed environment variables
        6. OWASP Top 10 concerns

        For every finding:
        - Severity: Critical / High / Medium / Low / Informational
        - Location: file and line reference
        - Description: what the vulnerability is
        - Recommendation: exactly how to fix it
        """,
        expected_output="""
        A markdown security report:
        1. Executive summary — risk rating and finding counts by severity
        2. Detailed findings in descending severity order
        3. Remediation checklist
        """,
        agent=agent,
        output_file="outputs/security_report.md"
    )