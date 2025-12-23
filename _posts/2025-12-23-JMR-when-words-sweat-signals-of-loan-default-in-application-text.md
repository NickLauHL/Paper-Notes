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
## TF-IDF（词权重）

### 1）TF（Term Frequency）：控制文档长度
$$
tf_{mj}=\frac{X_{mj}}{N_j}
$$

- $`X_{mj}`$：词 $`m`$ 在贷款申请 $`j`$ 中出现的次数  
- $`N_j`$：贷款申请 $`j`$ 的总词数  
- 直觉：用“出现比例”而不是“出现次数”，控制不同申请长度带来的影响。

### 2）IDF（Inverse Document Frequency）：惩罚全库常见词
$$
idf_m=\log\left(\frac{D}{M_m}\right)
$$

- $`D`$：贷款申请总数（文档总数）  
- $`M_m`$：包含词 $`m`$ 的贷款申请数量  
- 直觉：词越常见（$`M_m`$ 越大），$`idf_m`$ 越小；越少见则越大。

### 3）TF-IDF：综合权重（本文写法）
$$
tfidf_{mj}=tf_{mj}\,(idf_m+1)
$$

**解释（beyond chance）**：TF-IDF 让“在某篇申请里相对更突出、但在全库不常见”的词得到更高权重，从而同时控制文本长度差异与常见词的干扰。

## Findings

**[1]** Loan requests written by defaulting borrowers are more likely to include words (or themes) related to the borrower’s family, financial and general hardship, mentions of God, mentions of the near future, pleading lenders for help, and using verbs in present and future tenses. 

**[2]** Our results suggest that defaulting loan requests are written in a manner consistent with the writing styles of extroverts and liars. 
