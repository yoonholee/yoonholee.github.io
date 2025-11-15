# Academic Website Writing Guide

A comprehensive guide for writing effective "About Me" sections and research descriptions for academic personal websites, based on analysis of top-tier CS/ML researchers.

## Core Principles

### 1. **Lead with Clarity, Not Credentials**

Your first sentence should tell readers what you do, not where you are. Compare:

**❌ Weak:**

> I'm a Ph.D. candidate at Stanford CS, advised by Chelsea Finn and part of the IRIS lab. I am affiliated with SAIL, CRFM, and the ML Group at Stanford.

**✅ Strong:**

> I'm a Ph.D. candidate at Stanford CS working on [clear research problem]. I'm advised by Chelsea Finn in the IRIS lab.

**Why:** Visitors already know you're at Stanford (from context). They want to know what you _do_.

### 2. **Problem → Solution → Impact**

Structure your research description to answer three questions in order:

1. **What problem are you solving?** (accessible to educated non-experts)
2. **How are you solving it?** (your approach/methods)
3. **Why does it matter?** (broader impact or vision)

### 3. **Concrete Before Abstract**

Give specific examples before philosophical vision. Readers need anchors.

**❌ Too abstract:**

> My research focuses on establishing text as an explicit and editable substrate for knowledge, complementing the implicit information stored in neural network weights.

**✅ Concrete first:**

> I work on helping AI systems learn from rich, structured feedback rather than scalar rewards. For example, [Clarify](link) enables non-experts to teach vision models using natural language corrections instead of manual labels.

---

## Structure Templates

### Template A: Problem-Driven (Best for applied work)

```markdown
I'm a [position] at [institution], advised by [advisor] in the [lab].

I work on [clear problem statement in accessible language]. Current approaches
[limitation], but [your insight/approach]. My research [your solution approach]
by [mechanism].

Recent work includes:

- [**Project 1**](link): One-sentence description emphasizing contribution
- [**Project 2**](link): One-sentence description emphasizing contribution
- [**Project 3**](link): One-sentence description emphasizing contribution

[Optional: Broader vision paragraph]
```

### Template B: Vision-Driven (For theoretical/foundational work)

```markdown
I'm a [position] at [institution], advised by [advisor].

My research asks: [fundamental question]? I develop [approach] to [goal],
with applications in [domains].

This includes work on:

- **[Area 1]**: Brief description ([paper link])
- **[Area 2]**: Brief description ([paper link])
- **[Area 3]**: Brief description ([paper link])

More broadly, I'm interested in [larger vision or future directions].
```

### Template C: Methods-Driven (For ML systems/tools)

```markdown
I'm a [position] at [institution] working on [technical area] for [application].

I build [type of systems/methods] that enable [capability]. My work spans
[area 1], [area 2], and [area 3], with focus on [distinguishing feature].

Recent projects: [**Name**](link) (venue), [**Name**](link) (venue), [**Name**](link) (venue).

[Optional: Teaching, collaboration, or broader interests]
```

---

## Writing Style Guidelines

### Voice and Tone

1. **Use active voice and first person**
   - ✅ "I develop algorithms for..."
   - ❌ "Algorithms are developed for..."

2. **Be confident but not arrogant**
   - ✅ "My research enables..."
   - ❌ "My groundbreaking work revolutionizes..."
   - ❌ "I'm interested in possibly exploring..."

3. **Accessible but precise**
   - ✅ "scalar reward signals" (technical but clear)
   - ❌ "establishing text as an explicit and editable substrate for knowledge" (jargon-heavy)
   - ❌ "making AI better" (too vague)

### Sentence Structure

1. **Keep paragraphs short** (2-4 sentences max for web reading)
2. **One idea per sentence** (avoid compound-complex sentences)
3. **Front-load important information** (don't bury the lede)

**❌ Buried lede:**

> As we deploy models on increasingly complex, long-horizon tasks, the scalar reward bottleneck of reinforcement learning will prove increasingly limiting, which is why learning through text offers a way forward.

**✅ Front-loaded:**

> Learning through text offers a way forward for complex AI tasks. Current reinforcement learning relies on scalar rewards, which become a bottleneck as tasks grow more complex and long-horizon.

### Word Choice

1. **Prefer Anglo-Saxon to Latinate words**
   - ✅ "help" vs ❌ "facilitate"
   - ✅ "use" vs ❌ "utilize"
   - ✅ "show" vs ❌ "demonstrate"

2. **Avoid hedge words** (unless genuinely uncertain)
   - ❌ "potentially, possibly, might, could, somewhat, relatively"
   - ✅ Be direct: "enables" not "can potentially enable"

3. **Cut filler phrases**
   - ❌ "In order to" → ✅ "To"
   - ❌ "Due to the fact that" → ✅ "Because"
   - ❌ "It is important to note that" → ✅ [Delete, then state the point]

---

## Common Pitfalls

### 1. **Affiliation Overload**

**❌ Too much:**

> I'm a Ph.D. candidate at Stanford CS, advised by Chelsea Finn and part of the IRIS lab. I am affiliated with SAIL, CRFM, and the ML Group at Stanford. My research is generously supported through grants and fellowships from OpenAI and KFAS.

**✅ Streamlined:**

> I'm a Ph.D. candidate at Stanford CS, advised by Chelsea Finn in the IRIS lab. My research is supported by OpenAI and KFAS fellowships.

**Why:** Three sentences of credentials before any research content loses readers. Condense to 1-2 sentences max.

### 2. **Jargon Without Translation**

**❌ Unclear:**

> My research focuses on establishing text as an explicit and editable substrate for knowledge.

**✅ Clear:**

> My research explores how text can serve as an explicit, editable substrate for knowledge—enabling models to learn from natural language corrections and reasoning traces.

**Why:** The dash provides immediate translation. Never use technical terms without context.

### 3. **Abstract Vision Without Examples**

**❌ No grounding:**

> I work on enabling models to extract massive amounts of information from direct experience.

**✅ Grounded:**

> I work on enabling models to learn from rich experiential feedback. For example, [Clarify](link) lets non-experts teach vision models using natural language corrections instead of manual labels.

**Why:** Abstract claims need concrete proof points. Always give examples.

### 4. **Passive Voice and Weak Verbs**

**❌ Passive/weak:**

> My research is focused on problems related to...

**✅ Active/strong:**

> I develop methods for... / I work on...

**Why:** Active voice is more engaging and direct.

### 5. **Burying Your Contribution**

**❌ Method-focused:**

> I use reinforcement learning, transformers, and meta-learning to improve model performance.

**✅ Impact-focused:**

> I develop methods that enable models to learn from natural language feedback rather than scalar rewards, using techniques from RL, meta-learning, and language models.

**Why:** Lead with the contribution (what's new/better), not the tools (what's standard).

---

## Length Guidelines

- **Total "About Me":** 150-300 words (3-4 paragraphs)
- **Opening paragraph:** 1-2 sentences (affiliations only)
- **Research description:** 2-3 paragraphs
- **Selected papers list:** 3-6 papers with one-sentence descriptions

**General rule:** If it's longer than one scroll on a laptop screen, it's too long.

---

## Examples: Before & After

### Example 1: Too Abstract → Concrete

**Before:**

> My research focuses on establishing text as an explicit and editable substrate for knowledge, complementing the implicit information stored in neural network weights. Instead of relying solely on weights, we can store and update knowledge directly in discrete text form.

**After:**

> I work on enabling AI systems to learn from rich, structured feedback rather than scalar rewards. Instead of relying solely on neural network weights, my research explores how text can serve as an editable substrate for knowledge—allowing models to learn from natural language corrections, expert demonstrations, and reasoning traces.

**Changes:**

- More accessible opening ("AI systems learn from rich feedback")
- Technical terms now contextualized ("editable substrate for knowledge" comes with examples)
- Active voice ("I work on" vs "My research focuses on")

### Example 2: Method-First → Problem-First

**Before:**

> I develop algorithms using meta-learning, reinforcement learning, and transformers to improve model adaptation and generalization in low-data regimes.

**After:**

> I work on helping models adapt to new tasks with limited data. Current approaches require extensive retraining, but my research uses meta-learning and few-shot adaptation to enable rapid generalization from just a few examples.

**Changes:**

- Starts with problem (limited data) not methods (meta-learning)
- Explains why it matters (avoid retraining)
- Methods mentioned as tools, not the story

### Example 3: Credential-Heavy → Research-Forward

**Before:**

> I'm a Ph.D. candidate at Stanford CS, advised by Chelsea Finn and part of the IRIS lab. I am affiliated with SAIL, CRFM, and the ML Group at Stanford. My research is generously supported through grants and fellowships from OpenAI and KFAS. I work on machine learning.

**After:**

> I'm a Ph.D. candidate at Stanford CS working on text-based learning for AI systems. I'm advised by Chelsea Finn in the IRIS lab, with support from OpenAI and KFAS fellowships.

**Changes:**

- Research topic in first sentence
- Condensed affiliations from 3 sentences to 1
- Removed generic "I work on machine learning" (obvious from context)

---

## Checklist Before Publishing

- [ ] **First sentence includes your research area** (not just credentials)
- [ ] **No paragraph longer than 4 sentences**
- [ ] **At least one concrete example** (paper, system, or result)
- [ ] **Accessible to adjacent fields** (could a biologist/physicist understand the problem?)
- [ ] **Active voice dominates** (ratio of active:passive > 3:1)
- [ ] **No unexplained jargon** (every technical term has context)
- [ ] **Clear hierarchy:** Problem → Solution → Impact
- [ ] **Total length under 300 words** (excluding paper list)
- [ ] **Specific projects linked** (with one-sentence summaries)

---

## Resources and Examples

### Excellent Academic Websites to Study

- Yijia Shao: https://cs.stanford.edu/~shaoyj/ (concise, problem-focused)
- Andrej Karpathy: https://karpathy.ai/ (clear, personal, engaging)

- Dorsa Sadigh: https://dorsa.fyi/ (clean problem statement + examples)
- Sergey Levine: https://people.eecs.berkeley.edu/~svlevine/ (clear research focus)
- Tatsunori Hashimoto: https://thashim.github.io/ (well-organized, scannable)
- Tengyu Ma: https://ai.stanford.edu/~tengyuma/ (theory done accessibly)

- Christopher Re: https://cs.stanford.edu/~chrismre/ (impact-focused)
- Jure Leskovec: https://cs.stanford.edu/people/jure/ (broad but clear)

### Additional Reading

- MIT EECS Rising Stars: https://risingstars-eecs.mit.edu/
- Berkeley Writing Guide: https://townsendcenter.berkeley.edu/blog/personal-academic-webpages-how-tos-and-tips-better-site
- Faculty.bio Examples: https://www.faculty.bio/page/example-academic-websites/

---

## Final Thoughts

**The goal of your academic website is not to impress—it's to communicate clearly.**

Your research is complex. Your website should make it accessible. When in doubt:

1. Be concrete over abstract
2. Be clear over clever
3. Be brief over comprehensive

Most visitors spend 10-30 seconds on your page. Make those seconds count.
