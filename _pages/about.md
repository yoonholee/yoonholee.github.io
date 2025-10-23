---
layout: about
title: About
permalink: /
# description: <a href="#">Affiliations</a>. Address. Contacts. Moto. Etc.

profile:
  align: right
  image: prof_pic.jpg

news: false
selected_papers: false # includes a list of papers marked as "selected={true}"
social: true
---

I'm a Ph.D. candidate at Stanford CS, advised by [Chelsea Finn](https://ai.stanford.edu/~cbfinn/) and part of the [IRIS lab](https://irislab.stanford.edu/).
I am affiliated with [SAIL](https://ai.stanford.edu/), [CRFM](https://crfm.stanford.edu/), and the [ML Group](http://ml.stanford.edu/) at Stanford.
My research is generously supported through grants and fellowships from [OpenAI](https://openai.com/index/superalignment-fast-grants/) and [KFAS](https://eng.kfas.or.kr/theme/kfaschanel/intl_scholarship_5.php).

My research focuses on establishing text as an explicit and editable substrate for knowledge, complementing the implicit information stored in neural network weights. Instead of relying solely on weights, we can store and update knowledge directly in discrete text form, modified through mutations guided by rich experiential feedback.

The core vision is towards enabling models to extract _[massive amounts of information](https://youtu.be/Ount2Y4qxQo?si=LFsjABD1OT6QLZgU&t=1205)_ from _[direct experience](https://storage.googleapis.com/deepmind-media/Era-of-Experience%20/The%20Era%20of%20Experience%20Paper.pdf)_ (e.g. raw observations, expert feedback, experiment results).
As we deploy models on increasingly complex, long-horizon tasks, the scalar reward bottleneck of reinforcement learning will prove increasingly limiting. Learning through text offers a way forward by allowing models to learn from richer signals that scale naturally with task complexity.

My name (윤호) is pronounced like ‘you-know’ said quickly (stress on 'you').
[This](https://ipa-reader.com/?text=%2Fju%3Ano%CA%8A%2F) is a good approximation.

<!--
To this end, I have developed methods for encoding and selecting among a small set of hypotheses about the world [1,2,3] and efficiently fine-tuning model weights [4,5].
I created an interface that enables non-experts to teach vision models via natural language feedback [6].
Most recently, I developed a hierarchical RL framework LLMs discover and leverage textual "abstractions" to solve complex reasoning tasks [7]. -->

<div class="selected-papers">
<h3>Selected Papers</h3>

<div class="paper" itemscope itemtype="https://schema.org/ScholarlyArticle" data-year="2025" data-venue="ICML 2025" data-topics="reinforcement-learning,abstractions,reasoning,llm">
[1]
<a main-paper-link href="https://arxiv.org/abs/2510.02263" itemprop="url">
<span itemprop="name">RLAD: Training LLMs to Discover Abstractions for Solving Reasoning Problems</span>
</a>
<p class="authors" itemprop="author">
Yuxiao Qu*, Anikait Singh*, Yoonho Lee*, Amrith Setlur, Ruslan Salakhutdinov, Chelsea Finn, Aviral Kumar
</p>
<p class="venue" itemprop="publisher">
ICML 2025 workshops: AI for Math, PRAL, ES-FoMo
</p>
</div>

<div class="paper" itemscope itemtype="https://schema.org/ScholarlyArticle" data-year="2025" data-venue="ICML 2025" data-topics="test-time-alignment,hypothesis-reweighting,llm">
[2]
<a main-paper-link href="https://arxiv.org/abs/2412.08812" itemprop="url">
<span itemprop="name">Test-Time Alignment via Hypothesis Reweighting</span>
</a>
<p class="authors" itemprop="author">
Yoonho Lee, Jonathan Williams, Henrik Marklund, Archit Sharma, Eric Mitchell, Anikait Singh, Chelsea Finn
</p>
<p class="venue" itemprop="publisher">
ICML 2025 Workshop PUT
</p>
</div>

<div class="paper" itemscope itemtype="https://schema.org/ScholarlyArticle" data-year="2024" data-venue="UIST 2024" data-topics="robustness,natural-language-feedback,human-ai-interaction">
[3]
<a main-paper-link href="https://arxiv.org/abs/2402.03715" itemprop="url">
<span itemprop="name">Clarify: Improving Model Robustness with Natural Language Corrections</span>
</a>
<p class="authors" itemprop="author">
Yoonho Lee, Michelle Lam, Helena Vasconcelos, Michael S. Bernstein, Chelsea Finn
</p>
<p class="venue" itemprop="publisher">
UIST 2024, NeurIPS 2023 workshops XAIA and ICBINB
</p>
</div>

<div class="paper" itemscope itemtype="https://schema.org/ScholarlyArticle" data-year="2024" data-venue="ICLR 2024" data-topics="domain-adaptation,transfer-learning,sample-efficiency">
[4]
<a main-paper-link href="https://arxiv.org/abs/2302.05441" itemprop="url">
<span itemprop="name">Project and Probe: Sample-Efficient Domain Adaptation by Interpolating Orthogonal Features</span>
</a>
<p class="authors" itemprop="author">
Annie S. Chen*, Yoonho Lee*, Amrith Setlur, Sergey Levine, Chelsea Finn
</p>
<p class="venue" itemprop="publisher">
ICLR 2024 (spotlight)
</p>
</div>

<div class="paper" itemscope itemtype="https://schema.org/ScholarlyArticle" data-year="2023" data-venue="ICLR 2023" data-topics="fine-tuning,distribution-shift,robustness">
[5]
<a main-paper-link href="https://arxiv.org/abs/2210.11466" itemprop="url">
<span itemprop="name">Surgical Fine-Tuning Improves Adaptation to Distribution Shifts</span>
</a>
<p class="authors" itemprop="author">
Yoonho Lee*, Annie S. Chen*, Fahim Tajwar, Ananya Kumar, Huaxiu Yao, Percy Liang, Chelsea Finn
</p>
<p class="venue" itemprop="publisher">
ICLR 2023
</p>
</div>

<div class="paper" itemscope itemtype="https://schema.org/ScholarlyArticle" data-year="2023" data-venue="ICLR 2023" data-topics="out-of-distribution,robustness,disagreement,ensemble">
[6]
<a main-paper-link href="https://arxiv.org/abs/2202.03418" itemprop="url">
<span itemprop="name">Diversify and Disambiguate: Out-of-Distribution Robustness via Disagreement</span>
</a>
<p class="authors" itemprop="author">
Yoonho Lee, Huaxiu Yao, Chelsea Finn
</p>
<p class="venue" itemprop="publisher">
ICLR 2023
</p>
</div>

</div>
