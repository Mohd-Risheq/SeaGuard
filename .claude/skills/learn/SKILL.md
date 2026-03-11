---
name: learn
description: Research a topic online and create a skill from it
argument-hint: <topic-or-url> [skill-name]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion, mcp__hyperbrowser__scrape_webpage, mcp__hyperbrowser__crawl_webpages, mcp__hyperbrowser__extract_structured_data, mcp__hyperbrowser__browser_use_agent, mcp__hyperbrowser__claude_computer_use_agent, mcp__hyperbrowser__search_with_bing
---

## Context

User skills directory: ~/.claude/skills/
Existing skills: !`ls -d ~/.claude/skills/*/SKILL.md 2>/dev/null || echo "No user skills found"`

## Task

Research "$ARGUMENTS" using web browsing, then distill the knowledge into a reusable Claude Code skill.

### Phase 1: Research

Determine if the input is a URL or a topic:

**If it looks like a URL** (starts with http, https, or contains .com/.org/.io/etc):
1. Scrape the page using `mcp__hyperbrowser__scrape_webpage` with outputFormat ["markdown"]
2. If the page references important sub-pages, crawl them with `mcp__hyperbrowser__crawl_webpages` (maxPages: 10)
3. Extract the key concepts, workflows, APIs, patterns, and best practices

**If it's a topic/keyword**:
1. Search for it using `mcp__hyperbrowser__search_with_bing` with relevant queries like:
   - "$ARGUMENTS documentation"
   - "$ARGUMENTS tutorial best practices"
   - "$ARGUMENTS API reference"
2. Scrape the top 3-5 most relevant results using `mcp__hyperbrowser__scrape_webpage`
3. If official docs are found, crawl them with `mcp__hyperbrowser__crawl_webpages` (maxPages: 15)
4. Synthesize the knowledge from all sources

### Phase 2: Organize Knowledge

After researching, organize findings into:

1. **Core concepts** - Essential knowledge needed for most tasks
2. **Workflows** - Step-by-step procedures for common operations
3. **API/Reference** - Commands, functions, configuration options
4. **Patterns & best practices** - Recommended approaches, common pitfalls
5. **Examples** - Working code snippets or configurations

Ask the user:
- Confirm the skill name (suggest one based on the topic)
- Whether the scope looks right or if they want to focus on specific areas
- Any additional context or preferences to include

### Phase 3: Create the Skill

Create the skill at `~/.claude/skills/<skill-name>/`

**Directory structure:**
```
~/.claude/skills/<skill-name>/
├── SKILL.md              (core knowledge, workflows, quick reference)
├── references/           (detailed docs, API reference, advanced topics)
│   ├── api-reference.md  (if applicable)
│   ├── patterns.md       (if applicable)
│   └── advanced.md       (if applicable)
└── examples/             (working code examples, if applicable)
    └── example.md
```

**SKILL.md rules - follow strictly:**

Frontmatter:
```yaml
---
name: <skill-name>
description: This skill should be used when the user asks to "trigger phrase 1", "trigger phrase 2", "trigger phrase 3", or needs guidance on <topic areas>. Provides knowledge about <what was learned>.
version: 0.1.0
---
```

Body rules:
- Write in imperative/infinitive form (verb-first), NEVER second person
- Keep SKILL.md body under 2,500 words - move detailed content to references/
- Include a "Quick Reference" section with the most common commands/patterns
- Include an "Additional Resources" section pointing to references/ files
- Cite the source URLs at the bottom under a "Sources" section
- Focus on procedural knowledge that helps Claude execute tasks, not just facts

**Writing style examples:**

Correct: "Configure the server by editing config.yaml"
Correct: "To deploy, run `npm run build` then `npm run deploy`"
Wrong: "You should configure the server..."
Wrong: "You can deploy by running..."

### Phase 4: Validate

After creating all files, verify:
- [ ] SKILL.md has valid YAML frontmatter with `name` and `description`
- [ ] Description uses third person with specific trigger phrases in quotes
- [ ] Body uses imperative form throughout
- [ ] SKILL.md body is under 2,500 words
- [ ] Detailed content is in references/ (not bloating SKILL.md)
- [ ] All referenced files actually exist
- [ ] Source URLs are documented
- [ ] Examples are complete and accurate

Report what was learned, what was created, and how to trigger the skill.

## Important Guidelines

- Prioritize official documentation over blog posts or tutorials
- Cross-reference multiple sources for accuracy
- Focus on actionable, procedural knowledge over theoretical background
- If the topic is too broad, ask the user to narrow scope before researching
- Always attribute sources - include URLs where knowledge came from
- Create only directories that contain files (skip empty references/ or examples/)
- If research yields thin results, tell the user honestly rather than padding with generic content
