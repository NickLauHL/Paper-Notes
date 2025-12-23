---
title: "When Words Sweat: Identifying Signals for Loan Default in the Text of Loan Applications"
date: 2025-12-23
categories: [Text]
tags: [Text mining, ]
paper_info:
  authors: "Oded Netzer.et.al"
  venue: "Journal of Marketing Research"
  year: 2019
  link: "https://doi-org.libezproxy.um.edu.mo/10.1177/0022243719852959"
---

## Borrowers, consciously or not, leave traces of their intentions, circumstances, and personality traits in the text they write when applying for a loan. This textual information has a substantial and significant ability to predict whether borrowers will pay back the loan.

## Research Question

Can the "soft data" (i.e., text borrowers write) in loan applications predict subsequent loan default?

## Literaure Review AND Theoretical Development

Text is indicative of people’s psychological states, traits, opinions, and situations.

The relationship between personality traits, emotional states, and financial behavior. 

## Emperical

(1) Text mining: **tm package in R**

(2) Collapse variations of words into one. For example, “borrower,” “borrowed,”“borrowing,” and “borrowers" become “borrow.”: **Porter’s stemming algorithm**

(3) Two-word combinations (an approach often referred to as n-gram, in which for n=2, we get bigrams (for examnple, I / need / money / quickly; I need, need money, money quickly).

(4）**TF-IDF**
## TF-IDF（词权重：同时控制文本长度与全库常见程度）

**为什么要用 TF-IDF？**  
因为不同贷款申请（loan request/application）的文本长度不一样，而且不同词在整个语料库（corpus）中的出现频率也不一样。若直接用“原始词频”（某词出现了几次）做特征，会让**长文本天然更占优势**，以及让**全库到处都有的常见词**（区分度低）被过度强调。  
因此，作者用信息检索中常用的 **TF-IDF** 来对词在某篇申请中的出现频率进行标准化：**在某篇文本里相对更常出现、但在全库并不常见的词**会得到更高权重。

### 1）TF（Term Frequency）：控制文档长度
```math
tf_{mj}=\frac{X_{mj}}{N_j}
```
- $X_{mj}$：词 $m$ 在贷款申请 $j$ 中出现的次数  
- $N_j$：贷款申请 $j$ 的总词数  
- 直觉：用“出现比例”而不是“出现次数”，从而控制不同申请长度带来的影响。

### 2）IDF（Inverse Document Frequency）：惩罚全库常见词
```math
idf_m=\log\left(\frac{D}{M_m}\right)
```
- $D$：贷款申请总数（文档总数）  
- $M_m$：包含词 $m$ 的贷款申请数量  
- 直觉：如果一个词在很多申请里都出现（$M_m$ 大），区分度低，$idf_m$ 就小；如果只在少数申请里出现（$M_m$ 小），更“独特”，$idf_m$ 就大。

### 3）TF-IDF：综合权重（本文写法）
```math
tfidf_{mj}=tf_{mj}\,(idf_m+1)
```

### 直观解释（beyond chance）
TF-IDF 可以理解为：一个词在某篇申请中出现得“有多突出”，这种突出程度**不是因为文本更长**（TF 已控制），也**不是因为这个词在所有文本里本来就很常见**（IDF 会惩罚）。


## Findings

**[1]** Loan requests written by defaulting borrowers are more likely to include words (or themes) related to the borrower’s family, financial and general hardship, mentions of God, mentions of the near future, pleading lenders for help, and using verbs in present and future tenses. 

**[2]** Our results suggest that defaulting loan requests are written in a manner consistent with the writing styles of extroverts and liars. 
