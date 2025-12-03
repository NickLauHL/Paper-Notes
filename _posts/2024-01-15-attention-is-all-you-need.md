---
title: "Attention Is All You Need - Transformer架构详解"
date: 2024-01-15
categories: [深度学习]
tags: [Transformer, 注意力机制, NLP]
paper_info:
  authors: "Vaswani et al."
  venue: "NeurIPS 2017"
  year: 2017
  link: "https://arxiv.org/abs/1706.03762"
---

这篇论文提出了 Transformer 架构，彻底改变了自然语言处理领域。

## 核心贡献

论文的核心贡献是提出了一种完全基于注意力机制的序列转换模型，摒弃了传统的循环和卷积结构。

## 关键技术

### 自注意力机制 (Self-Attention)

自注意力允许模型在处理序列时，直接建立任意两个位置之间的依赖关系。计算公式如下：

```
Attention(Q, K, V) = softmax(QK^T / √d_k) V
```

### 多头注意力 (Multi-Head Attention)

通过并行运行多个注意力函数，模型可以同时关注不同表示子空间的信息。

### 位置编码 (Positional Encoding)

由于模型不包含循环或卷积，需要注入位置信息。论文使用正弦和余弦函数生成位置编码。

## 实验结果

- 在 WMT 2014 英德翻译任务上达到 28.4 BLEU
- 在 WMT 2014 英法翻译任务上达到 41.0 BLEU
- 训练时间比之前的模型大幅减少

## 我的思考

1. Transformer 的并行化能力使其非常适合 GPU 训练
2. 自注意力的计算复杂度是 O(n²)，对于长序列可能是瓶颈
3. 这篇论文为后续的 BERT、GPT 等模型奠定了基础

## 相关论文

- BERT: Pre-training of Deep Bidirectional Transformers
- GPT: Improving Language Understanding by Generative Pre-Training
