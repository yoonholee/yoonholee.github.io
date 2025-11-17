---
title: Markdown Reference
---

# Markdown Reference

This demonstrates all major markdown features for quick reference and testing.

## Text Formatting

**Bold text** conveys emphasis, _italic text_ suggests nuance, and **_bold italic_** combines both. Use ~~strikethrough~~ for corrections or deprecated content. Inline `code` highlights technical terms like `torch.nn.Module` or `transformers.AutoModel`.

## Lists and Structure

### Unordered Lists

- First-level items establish context
- Nested organization follows:
  - Second-level details
  - Additional specifications
    - Third-level refinements maintain clarity
- Asymmetric depth is natural—match structure to content

## Code Examples

### Inline Code

Use `torch.optim.AdamW` for optimizer configuration or `model.generate(max_length=512)` for generation parameters.

### Code Blocks

```python
def train_step(model, batch, optimizer):
    """Single training iteration with gradient accumulation."""
    outputs = model(**batch)
    loss = outputs.loss / gradient_accumulation_steps
    loss.backward()
    return loss.item()
```

```bash
# Launch distributed training on SLURM cluster
srun --gres=gpu:8 --nodes=4 python train.py \
  --model_name meta-llama/Llama-2-7b \
  --batch_size 32 --gradient_accumulation_steps 4
```

## Blockquotes

> Single-level quotes emphasize key insights or external content.

> Multi-paragraph blockquotes maintain coherent extended passages.
>
> Each paragraph preserves formatting and structure within the quote block.

> Nested quotes show attribution levels:
>
> > Inner quotes distinguish sources or meta-commentary.
> > Depth indicates relationship between statements.

> **Formatted text** and _emphasis_ work within quotes. Include `inline code` or even links: [[Writing Principles]]
