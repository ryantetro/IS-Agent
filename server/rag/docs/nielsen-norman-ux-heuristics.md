# Nielsen Norman Group — 10 Usability Heuristics for UI Design
**Source:** Nielsen Norman Group — https://www.nngroup.com/articles/ten-usability-heuristics/
**Author:** Jakob Nielsen (originally 1994, updated 2024)
**Relevance:** Core UX principles for designing intuitive, user-friendly interfaces — navigation, feedback, error handling, consistency, and more.

---

## Overview

These 10 heuristics are broad rules of thumb for interaction design. They are called "heuristics" because they are general principles, not specific usability guidelines. They apply to virtually every type of digital interface — chat UIs, dashboards, forms, navigation, and more.

---

## Heuristic 1: Visibility of System Status

**The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time.**

When users know the current system status, they learn the outcome of their prior interactions and can determine next steps. Predictable interactions create trust in the product and the brand.

**Key principles:**
- Communicate clearly what the system's state is — no consequential action should be taken without informing the user
- Present feedback as quickly as possible (ideally, immediately)
- Build trust through open and continuous communication

**Chat UI applications:**
- Show a typing indicator when the AI is generating a response
- Display tool-use badges ("Searching docs...", "Generating CSS...") so users know what's happening
- Show message delivery/sent states
- Display loading states when fetching search results

---

## Heuristic 2: Match Between System and the Real World

**The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon. Follow real-world conventions, making information appear in a natural and logical order.**

The way you should design depends very much on your specific users. Terms, icons, and concepts that seem clear to you may be unfamiliar to your users. When a design's controls follow real-world conventions and map to desired outcomes (natural mapping), it's easier to learn and remember.

**Key principles:**
- Ensure users can understand meaning without needing to look up definitions
- Never assume your understanding of words matches your users'
- User research uncovers familiar terminology and mental models

**Design system applications:**
- Use familiar design terminology (palette, contrast, hierarchy, typeface) when talking to designers
- Use developer-friendly terms (CSS, tokens, variables, breakpoints) when talking to developers
- Color swatches should look like real color swatches, not abstract data
- Code blocks should look like code editors, not generic text

---

## Heuristic 3: User Control and Freedom

**Users often perform actions by mistake. They need a clearly marked "emergency exit" to leave unwanted actions without going through an extended process.**

When it's easy for people to back out of a process or undo an action, it fosters a sense of freedom and confidence. Exits allow users to remain in control and avoid getting stuck or frustrated.

**Key principles:**
- Support Undo and Redo wherever possible
- Show a clear way to exit the current interaction (Cancel button)
- Make the exit clearly labeled and discoverable

**Chat UI applications:**
- Allow users to stop a streaming response mid-generation
- Let users edit or delete their previous messages
- Provide a "Clear chat" or "New conversation" option that's easy to find
- Don't lock users into irreversible flows without warning

---

## Heuristic 4: Consistency and Standards

**Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.**

Jakob's Law states that people spend most of their time using digital products other than yours. Users' experiences with those products set their expectations. Failing to maintain consistency increases cognitive load by forcing users to learn something new.

**Key principles:**
- Maintain both internal consistency (within your product) and external consistency (with industry standards)
- Follow established industry conventions for common patterns
- Use the same language, icons, and interaction patterns throughout

**Design system applications:**
- Use the same button styles for the same button types throughout
- If a blue color means "primary action," use it consistently — don't use blue for warnings too
- Sidebar navigation should behave the same on every page
- Code blocks should always render the same way

---

## Heuristic 5: Error Prevention

**Good error messages are important, but the best designs prevent problems from occurring in the first place. Either eliminate error-prone conditions, or check for them and present a confirmation option before the user commits to the action.**

There are two types of errors:
- **Slips** — Unconscious errors caused by inattention
- **Mistakes** — Conscious errors based on a mismatch between the user's mental model and the design

**Key principles:**
- Prevent high-cost errors first, then address minor frustrations
- Avoid slips by providing helpful constraints and good defaults
- Prevent mistakes by removing memory burdens, supporting undo, and warning users

**Chat UI applications:**
- Warn before clearing a conversation ("Are you sure? This cannot be undone")
- Prevent submitting empty messages
- Auto-save conversation history so nothing is accidentally lost

---

## Heuristic 6: Recognition Rather Than Recall

**Minimize the user's memory load by making elements, actions, and options visible. The user should not have to remember information from one part of the interface to another. Information required to use the design should be visible or easily retrievable when needed.**

Humans have limited short-term memory. Interfaces that promote recognition reduce the amount of cognitive effort required from users.

**Key principles:**
- Let people recognize information in the interface rather than forcing recall
- Offer help in context, not just in a long tutorial to memorize
- Reduce information users have to remember

**Chat UI applications:**
- Show conversation history in the sidebar so users can recognize past topics
- Surface suggestion chips with example prompts so users know what the agent can do
- Display source attribution directly in the message (not just in a tooltip)
- Show recent tool outputs (color palettes, CSS) in an artifact panel for easy reference

---

## Heuristic 7: Flexibility and Efficiency of Use

**Shortcuts — hidden from novice users — may speed up the interaction for expert users. Allow users to tailor frequent actions.**

Flexible processes can be carried out in different ways, so people can pick whichever method works for them.

**Key principles:**
- Provide accelerators like keyboard shortcuts
- Provide personalization — tailor content and functionality for individual users
- Allow customization so users can configure how the product works

**Chat UI applications:**
- Quick-action buttons below the input ("🎨 Palette", "✨ CSS") for common requests
- Keyboard shortcut (Cmd/Ctrl + Enter) to send messages
- Allow users to click on a suggestion chip to auto-populate the input
- Copy-to-clipboard on code blocks is a power-user shortcut that saves time

---

## Heuristic 8: Aesthetic and Minimalist Design

**Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information competes with the relevant units and diminishes their relative visibility.**

This heuristic doesn't mean flat design — it means keeping content and visual design focused on the essentials. Every visual element should support the user's primary goals.

**Key principles:**
- Keep content and visual design focused on what matters
- Don't let unnecessary elements distract users from needed information
- Prioritize features and content that support primary goals

**Design applications:**
- Remove decorative elements that don't serve a function
- In a chat interface, the conversation should dominate — the UI chrome should step back
- Limit the color palette — too many colors create visual noise
- White space (negative space) is not wasted space — it gives content room to breathe
- One font family + one accent font is almost always better than three

---

## Heuristic 9: Help Users Recognize, Diagnose, and Recover from Errors

**Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.**

Users need to understand what went wrong and how to fix it. Error messages that are vague ("Something went wrong") or technical ("Error 503") frustrate users and undermine trust.

**Key principles:**
- Use plain language — no error codes or jargon
- Precisely indicate what the problem is
- Constructively suggest a solution

**Chat UI applications:**
- If the AI fails to respond: "I couldn't complete that request. Try rephrasing or asking something else."
- If a tool call fails: "Web search is unavailable right now — I'll try to answer from memory"
- Never show a raw API error to the user

---

## Heuristic 10: Help and Documentation

**Even if the system can be used without documentation, it may be necessary to provide help. Any such help should be easy to search, focused on the user's task, list concrete steps to carry out, and not be too large.**

**Key principles:**
- Help should be easy to find, not buried
- Focused on the user's task, not system features
- Provide concrete steps, not abstract explanations

**Chat UI applications:**
- Empty state in chat with example prompts is a form of built-in documentation
- Quick-action buttons serve as discoverable "help" for what the agent can do
- Tooltip on tool badges explains what the tool is doing

---

## Supplementary UX Principles from NNG

### Visual Design Principles (from NNG's Visual Design article)

**Scale:** Use relative size to signal importance and establish visual hierarchy. Larger elements draw attention first.

**Visual Hierarchy:** Not all elements are equally important. Guide the user's eye to the most important information first using size, weight, color, and position.

**Contrast:** Differences between elements that make them stand out. Contrast should be used purposefully — too much contrast everywhere creates visual chaos.

**Alignment:** Elements should be visually connected through consistent alignment. Invisible alignment lines create order.

**Proximity:** Related items should be grouped close together. Unrelated items should be separated. Space communicates relationships.

**Color:** Use color purposefully to reinforce meaning, not just for decoration. Use a limited palette. Never rely on color alone to convey information.

**Repetition:** Repeating visual elements (fonts, colors, shapes) creates consistency and cohesion. Design systems are built on repetition.

### Cognitive Load Principles

- **Chunking:** Group related information together so users can process it in meaningful units rather than individual pieces
- **Progressive Disclosure:** Show only the most important information initially; reveal details progressively as the user needs them
- **Defaults:** Well-chosen defaults reduce decision fatigue. Users should not have to configure everything from scratch
- **Affordances:** Visual cues that communicate how an element is used (a button looks "pressable"; a link looks "clickable")

### Form Design Best Practices (NNG)

- Use one column layouts for forms — multiple columns break the natural reading flow
- Place labels above input fields, not beside them
- Inline validation is better than post-submission validation
- Required fields should be marked clearly, but it's better to only ask for required information
- Error messages should appear adjacent to the field with the error
- Placeholder text should NOT replace labels — placeholders disappear on input

### Navigation Principles (NNG)

- Navigation should be consistent across all pages
- The current location should always be visible ("You are here" state)
- Breadcrumbs help users understand hierarchy and backtrack
- Limit top-level navigation items — 5-7 maximum before cognitive load becomes a problem
- Mobile navigation patterns (hamburger menus, bottom tabs) have specific UX tradeoffs
