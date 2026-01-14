---
layout: about
title: About
permalink: /
description: Yoonho Lee - Ph.D. candidate at Stanford CS researching text-based knowledge representation, reward modeling, and learning from direct experience. Advised by Chelsea Finn at IRIS Lab, SAIL, CRFM. Research supported by OpenAI and KFAS fellowships.

profile:
  align: right
  image: prof_pic.jpg

news: false
selected_papers: false # includes a list of papers marked as "selected={true}"
social: true
---

I'm a final-year PhD student at Stanford CS, advised by [Chelsea Finn](https://ai.stanford.edu/~cbfinn/). My research focuses on building systems that learn from text directly and continually.

Scalar rewards collapse feedback into a single number. A score gives a verdict, not a diagnosis.
What went wrong, why, and what to change is often better expressed in text.

In many settings, we already have access to this kind of feedback: natural-language corrections, pairwise comparisons with explanations, stack traces, and reflections on what worked.
Now that models can read text well enough to use it for decision-making, I believe we can do better than learning from scalar rewards alone.
My research develops methods that leverage such structured feedback to enable models to continually improve.

The best way to learn more about the technical side of these ideas is to read my [blog post](https://ai.stanford.edu/blog/feedback-descent/) or the selected papers below.

<div class="selected-papers">
<div class="paper" itemscope itemtype="https://schema.org/ScholarlyArticle" data-year="2025">
<span class="paper-year">2025</span>
<div class="paper-content">
<a main-paper-link href="https://arxiv.org/abs/2511.07919" itemprop="url">
<span itemprop="name">Feedback Descent: Open-Ended Text Optimization via Pairwise Comparison</span>
</a>
<p class="authors" itemprop="author">
Yoonho Lee, Joseph Boen, Chelsea Finn
</p>
<p class="venue" itemprop="publisher">
preprint
</p>
<div class="paper-tooltip">
Operationalizes the core text optimization loop, accumulating "why better" signals from pairwise comparisons across up to a thousand iterations.
</div>
</div>
{% include paper_schema.html title="Feedback Descent: Open-Ended Text Optimization via Pairwise Comparison" authors="Yoonho Lee, Joseph Boen, Chelsea Finn" year="2025" url="https://arxiv.org/abs/2511.07919" venue="preprint" %}
</div>

<div class="paper" itemscope itemtype="https://schema.org/ScholarlyArticle" data-year="2025">
<span class="paper-year">2025</span>
<div class="paper-content">
<a main-paper-link href="https://arxiv.org/abs/2510.02263" itemprop="url">
<span itemprop="name">RLAD: Training LLMs to Discover Abstractions for Solving Reasoning Problems</span>
</a>
<p class="authors" itemprop="author">
Yuxiao Qu*, Anikait Singh*, Yoonho Lee*, Amrith Setlur, Ruslan Salakhutdinov, Chelsea Finn, Aviral Kumar
</p>
<p class="venue" itemprop="publisher">
ICML 2025 workshops: AI for Math, PRAL, ES-FoMo
</p>
<div class="paper-tooltip">
A hierarchical RL framework for training LLMs to discover and use textual abstractions for solving complex reasoning problems. Demonstrates that useful information for solving reasoning problems can be represented in pure text form.
</div>
</div>
{% include paper_schema.html title="RLAD: Training LLMs to Discover Abstractions for Solving Reasoning Problems" authors="Yuxiao Qu, Anikait Singh, Yoonho Lee, Amrith Setlur, Ruslan Salakhutdinov, Chelsea Finn, Aviral Kumar" year="2025" url="https://arxiv.org/abs/2510.02263" venue="ICML 2025 workshops" %}
</div>

<div class="paper" itemscope itemtype="https://schema.org/ScholarlyArticle" data-year="2025">
<span class="paper-year">2025</span>
<div class="paper-content">
<a main-paper-link href="https://arxiv.org/abs/2412.08812" itemprop="url">
<span itemprop="name">Test-Time Alignment via Hypothesis Reweighting</span>
</a>
<p class="authors" itemprop="author">
Yoonho Lee, Jonathan Williams, Henrik Marklund, Archit Sharma, Eric Mitchell, Anikait Singh, Chelsea Finn
</p>
<p class="venue" itemprop="publisher">
ICML 2025 Workshop PUT
</p>
<div class="paper-tooltip">
Test-time alignment by reweighting ensemble members using a small set of labeled examples from the target distribution. Adaptation without retraining weights.
</div>
</div>
{% include paper_schema.html title="Test-Time Alignment via Hypothesis Reweighting" authors="Yoonho Lee, Jonathan Williams, Henrik Marklund, Archit Sharma, Eric Mitchell, Anikait Singh, Chelsea Finn" year="2025" url="https://arxiv.org/abs/2412.08812" venue="ICML 2025 Workshop PUT" %}
</div>

<div class="paper" itemscope itemtype="https://schema.org/ScholarlyArticle" data-year="2024">
<span class="paper-year">2024</span>
<div class="paper-content">
<a main-paper-link href="https://arxiv.org/abs/2402.03715" itemprop="url">
<span itemprop="name">Clarify: Improving Model Robustness with Natural Language Corrections</span>
</a>
<p class="authors" itemprop="author">
Yoonho Lee, Michelle Lam, Helena Vasconcelos, Michael S. Bernstein, Chelsea Finn
</p>
<p class="venue" itemprop="publisher">
UIST 2024, NeurIPS 2023 workshops XAIA and ICBINB
</p>
<div class="paper-tooltip">
Built a natural language interface for humans to teach vision models using natural language corrections instead of manual labels. Demonstrates how natural language can provide higher-bandwidth feedback that communicates what went wrong.
</div>
</div>
{% include paper_schema.html title="Clarify: Improving Model Robustness with Natural Language Corrections" authors="Yoonho Lee, Michelle Lam, Helena Vasconcelos, Michael S. Bernstein, Chelsea Finn" year="2024" url="https://arxiv.org/abs/2402.03715" venue="UIST 2024" %}
</div>

<div class="paper" itemscope itemtype="https://schema.org/ScholarlyArticle" data-year="2023">
<span class="paper-year">2023</span>
<div class="paper-content">
<a main-paper-link href="https://arxiv.org/abs/2202.03418" itemprop="url">
<span itemprop="name">Diversify and Disambiguate: Out-of-Distribution Robustness via Disagreement</span>
</a>
<p class="authors" itemprop="author">
Yoonho Lee, Huaxiu Yao, Chelsea Finn
</p>
<p class="venue" itemprop="publisher">
ICLR 2023
</p>
<div class="paper-tooltip">
Learns from structured disagreement signals between diverse models; working at a higher level of abstraction than datapoints by "choosing the best model" among different functions that fit the training data.
</div>
</div>
{% include paper_schema.html title="Diversify and Disambiguate: Out-of-Distribution Robustness via Disagreement" authors="Yoonho Lee, Huaxiu Yao, Chelsea Finn" year="2023" url="https://arxiv.org/abs/2202.03418" venue="ICLR 2023" %}
</div>

</div>

<div class="contact-section" markdown="1">

My name (윤호) is pronounced like 'you-know' said quickly (with stress on 'you').
[This](https://ipa-reader.com/?text=%2Fju%3Ano%CA%8A%2F) is a good approximation.

Feel free to reach out via [email](mailto:yoonho@cs.stanford.edu) if you'd like to chat. I'm on the 2026-27 academic and industry job markets, and open to collaborations that align with my research interests.

</div>
