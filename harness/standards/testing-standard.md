# Testing Standard

## Purpose

Define the testing strategy for the project.

The goal is to maintain long-term stability while keeping tests maintainable.

---

## Testing Philosophy

Testing should prioritize:

- behavior over implementation details
- meaningful coverage over high coverage numbers
- stability over test quantity

---

## Test Types

### Unit Tests

Used for:

- utility functions
- content parsing
- data transformation
- validation logic

These should follow TDD where practical.

---

### Integration Tests

Used for:

- multi-component flows
- content loading pipelines
- route-level logic

---

### End-to-End Tests

Used for:

- verifying important user journeys
- confirming the application runs correctly in a browser

Examples:

- homepage loads
- navigation works
- contact page loads

---

## TDD Rules

TDD should be used for:

- domain logic
- utility functions
- parsers
- validators

The process should follow:

1. write failing test
2. implement behavior
3. refactor

---

## UI Testing Rules

UI tests should verify:

- visible behavior
- accessibility roles
- interactive outcomes

Avoid testing:

- CSS classes
- internal component structure

---

## Regression Testing

When a bug is discovered:

1. write a failing regression test
2. implement the fix
3. confirm the test passes

---

## Test Requirements

A feature should not be considered complete if:

- critical logic lacks tests
- tests fail
- the test suite becomes unstable