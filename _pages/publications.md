---
layout: page
permalink: /papers/
title: Papers
nav: true
---

{% assign current_year = "now" | date: "%Y" | plus: 0 %}
{% assign start_year = 2018 %}

<div class="publications">

{% for y in (start_year..current_year) reversed %}
  <div class="year">{{y}}</div>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>
