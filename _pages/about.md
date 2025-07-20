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

I'm developing a new machine learning paradigm where **text serves as a primary substrate for storing and updating knowledge**.
Instead of encoding knowledge solely in neural network weights, I build systems that store and update knowledge directly in text form, modified through mutations based on rich experiential feedback.
The vision is to enable models to extract [massive amounts of information](https://youtu.be/Ount2Y4qxQo?si=LFsjABD1OT6QLZgU&t=1205) from [direct experience (e.g. raw observations, expert feedback, experiment results)](https://storage.googleapis.com/deepmind-media/Era-of-Experience%20/The%20Era%20of%20Experience%20Paper.pdf).

To this end, I have developed methods for encoding and selecting among a small set of hypotheses about the world [1,2,3] and efficiently fine-tuning model weights [4,5].
I created an interface that enables non-experts to teach vision models via natural language feedback [6].
Most recently, I developed a hierarchical RL framework LLMs discover and leverage textual "abstractions" to solve complex reasoning tasks [7].

My name (윤호) is pronounced like ‘you-know’ said quickly (stress on 'you').
[This](https://ipa-reader.com/?text=%2Fju%3Ano%CA%8A%2F) is a good approximation.

<div class="selected-papers">
<h3>Selected Papers</h3>

<div class="paper">
[1]
<a main-paper-link href="https://arxiv.org/abs/2412.08812">
Test-Time Alignment via Hypothesis Reweighting
</a>
<p class="authors">
Yoonho Lee, Jonathan Williams, Henrik Marklund, Archit Sharma, Eric Mitchell, Anikait Singh, Chelsea Finn
</p>
<p class="venue">
ICML 2025 Workshop PUT
</p>
</div>

<div class="paper">
[2]
<a main-paper-link href="https://arxiv.org/abs/2302.05441">
Project and Probe: Sample-Efficient Domain Adaptation by Interpolating Orthogonal Features
</a>
<p class="authors">
Annie S. Chen*, Yoonho Lee*, Amrith Setlur, Sergey Levine, Chelsea Finn
</p>
<p class="venue">
ICLR 2024 (spotlight)
</p>
</div>

<div class="paper">
[3]
<a main-paper-link href="https://arxiv.org/abs/2202.03418">
Diversify and Disambiguate: Out-of-Distribution Robustness via Disagreement
</a>
<p class="authors">
Yoonho Lee, Huaxiu Yao, Chelsea Finn
</p>
<p class="venue">
ICLR 2023
</p>
</div>

<div class="paper">
[4]
<a main-paper-link href="https://arxiv.org/abs/2401.10220">
AutoFT: Learning an Objective for Robust Fine-Tuning
</a>
<p class="authors">
Caroline Choi*, Yoonho Lee*, Annie S. Chen, Allan Zhou, Aditi Raghunathan, Chelsea Finn
</p>
<p class="venue">
NeurIPS 2023 workshop DistShift
</p>
</div>

<div class="paper">
[5]
<a main-paper-link href="https://arxiv.org/abs/2210.11466">
Surgical Fine-Tuning Improves Adaptation to Distribution Shifts
</a>
<p class="authors">
Yoonho Lee*, Annie S. Chen*, Fahim Tajwar, Ananya Kumar, Huaxiu Yao, Percy Liang, Chelsea Finn
</p>
<p class="venue">
ICLR 2023
</p>
</div>

<div class="paper">
[6]
<a main-paper-link href="https://arxiv.org/abs/2402.03715">
Clarify: Improving Model Robustness with Natural Language Corrections
</a>
<p class="authors">
Yoonho Lee, Michelle Lam, Helena Vasconcelos, Michael S. Bernstein, Chelsea Finn
</p>
<p class="venue">
UIST 2024, NeurIPS 2023 workshops XAIA and ICBINB
</p>
</div>

<div class="paper">
[7]
<a main-paper-link href="https://drive.google.com/file/d/1SfafrkhAuAtITnVPIWLPGRp07VyAaosw/view">
Learning to Discover Abstractions for LLM Reasoning
</a>
<p class="authors">
Yuxiao Qu*, Anikait Singh*, Yoonho Lee*, Amrith Setlur, Ruslan Salakhutdinov, Chelsea Finn, Aviral Kumar
</p>
<p class="venue">
ICML 2025 workshops AI for Math, PRAL, ES-FoMo
</p>
</div>

</div>
