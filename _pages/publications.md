---
layout: page
permalink: /papers/
title: Papers
years: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]
nav: true
---

<div class="publications">

{% for y in page.years %}

  <div class="year">{{y}}</div>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>
