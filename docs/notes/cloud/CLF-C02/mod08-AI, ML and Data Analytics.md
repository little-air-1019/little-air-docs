---
sidebar_position: 9
title: "Module 08: AI, ML and Data Analytics"
---

# Module 8：AI, ML and Data Analytics

> 本模組是課程改版後新增的重點章節。考試對 AI/ML 服務的考法以**「看情境選服務」**為主：給你一個業務需求，選出對應的 AWS AI 服務。把每個服務的「一句話定義」記熟即可。

---

## 1. AI / ML 服務全景

AWS 的 AI/ML 服務分為三層：

```
┌─────────────────────────────────────────────────┐
│  AI Services（預建模型，直接 API 呼叫）            │  ← 最簡單，不需要 ML 知識
│  Rekognition, Comprehend, Polly, Lex...          │
├─────────────────────────────────────────────────┤
│  ML Platform（訓練與部署自己的模型）               │  ← 需要 ML 知識
│  Amazon SageMaker                                │
├─────────────────────────────────────────────────┤
│  Foundation Models / Generative AI               │  ← 最新，生成式 AI
│  Amazon Bedrock, Amazon Q                        │
└─────────────────────────────────────────────────┘
```

---

## 2. AI Services（預建 AI 服務）⭐⭐⭐

這些服務不需要你自己訓練模型，直接呼叫 API 就能使用 AWS 訓練好的模型。

### 2.1 Amazon Rekognition（影像與影片分析）
- **功能**：分析圖片和影片，辨識物件、場景、人臉、文字、不安全內容
- **適合情境**：
  - 身分驗證（人臉辨識）
  - 影片中的物件偵測
  - 自動審查用戶上傳的不適當圖片

> **一句話**：「看圖說話」的 AI。

### 2.2 Amazon Comprehend（自然語言理解）
- **功能**：分析文字，找出情感（Sentiment）、關鍵字、語言、實體（人名、地名、組織）
- **適合情境**：
  - 分析客服對話的情緒
  - 從大量文件中萃取重要資訊
  - 自動分類客戶回饋

> **一句話**：「理解文字情緒和意義」的 AI。

### 2.3 Amazon Translate（語言翻譯）
- **功能**：即時的神經機器翻譯，支援數十種語言
- **適合情境**：多語言網站、翻譯用戶評論、本地化應用程式

> **一句話**：AWS 版的 Google Translate。

### 2.4 Amazon Polly（文字轉語音）
- **功能**：將文字轉換為自然語音（Text-to-Speech）
- **適合情境**：有聲書應用程式、語音助理回應、無障礙功能

> **一句話**：「讓文字開口說話」的 AI。

### 2.5 Amazon Transcribe（語音轉文字）
- **功能**：將音訊或影片中的語音自動轉換為文字（Speech-to-Text）
- **適合情境**：會議記錄自動化、字幕生成、客服電話分析

> **一句話**：「讓語音變成文字」的 AI。記憶：Transcribe ↔ 謄稿。

### 2.6 Amazon Lex（對話式 AI / Chatbot）
- **功能**：建立具有語音和文字互動能力的 Chatbot，使用與 Alexa 相同的技術
- **適合情境**：客服 Bot、語音訂餐系統、FAQ 自動回答

> **一句話**：建 Chatbot 用的服務。

### 2.7 Amazon Kendra（智慧企業搜尋）
- **功能**：AI 驅動的企業內部搜尋引擎，可以用自然語言搜尋文件
- **適合情境**：讓員工用「我的健保卡如何申請？」這樣的問題搜尋公司內部文件

> **一句話**：「讓公司文件變成可以問答的知識庫」。

### 2.8 Amazon Textract（文件文字與資料提取）
- **功能**：從掃描文件（PDF、圖片）中自動提取文字、表格、表單欄位
- **比 OCR 更強**：不只認字，還能理解表格結構和表單欄位名稱

> **一句話**：「把紙本文件數位化並結構化」的 AI。

### 2.9 Amazon Forecast（時間序列預測）
- **功能**：基於歷史資料，預測未來的時間序列數值（如銷售量、需求量）
- **適合情境**：庫存預測、能源用量預測、財務預測

### 2.10 Amazon Personalize（個人化推薦）
- **功能**：即時個人化推薦引擎，使用與 Amazon.com 購物推薦相同的技術
- **適合情境**：「你可能也喜歡」的商品推薦、個人化新聞推送

### AI Services 速查表 ⭐

| 情境關鍵字 | 服務 |
|---|---|
| 圖片 / 影片 辨識、人臉 | **Rekognition** |
| 文字情感分析、關鍵字、實體 | **Comprehend** |
| 語言翻譯 | **Translate** |
| 文字 → 語音 | **Polly** |
| 語音 → 文字 | **Transcribe** |
| Chatbot、對話式 AI | **Lex** |
| 企業內部文件搜尋 | **Kendra** |
| 掃描文件、PDF 資料提取 | **Textract** |
| 需求 / 銷售量預測 | **Forecast** |
| 個人化推薦系統 | **Personalize** |

---

## 3. Amazon SageMaker（ML 平台）⭐⭐

### 是什麼？

**Amazon SageMaker** 是 AWS 的全受管機器學習平台，讓資料科學家和開發者可以**建立、訓練、部署**自訂 ML 模型，而不需要管理底層基礎設施。

### SageMaker 的工作流程

```
準備資料 → 建立模型 → 訓練模型 → 評估模型 → 部署模型（API Endpoint）
```

SageMaker 提供每個步驟的工具：
- **SageMaker Studio**：整合式 ML 開發環境（IDE）
- **SageMaker Ground Truth**：協助建立訓練資料標籤（Data Labeling）
- **SageMaker Autopilot**：自動訓練並調整模型（AutoML）

> 類比：如果 AWS AI Services 是買現成的食品，SageMaker 就是一套完整的廚房設備，讓你從食材開始自己做料理。

---

## 4. 生成式 AI 服務 Generative AI⭐⭐⭐

這是課程改版後的**新增重點**，CLF-C02 近期考試比重增加。

### 4.1 Amazon Bedrock ⭐⭐⭐

**Amazon Bedrock** 是 AWS 的**生成式 AI（Generative AI）全受管服務**，讓你透過 API 存取各種**Foundation Models（基礎模型）**，不需要自己訓練模型。

支援的 Foundation Models 包括：
- **Anthropic Claude**（包含 Claude 3 系列）
- **Amazon Titan**（AWS 自家模型）
- **Meta Llama**
- **Mistral AI**
- **Stability AI**（圖像生成）
- 及其他合作夥伴模型

Bedrock 的特色：
- **Serverless**：無需管理基礎設施
- **私密性**：你的資料不會用來訓練基礎模型
- **客製化**：可以用自己的資料 Fine-tuning 模型
- **RAG 支援**：整合 Knowledge Base，讓模型能查詢你的企業文件

> 類比：Bedrock 是 AI 模型的「App Store」——AWS 把各家最好的 AI 模型集中在一個地方，你挑你喜歡的用，不用自己訓練。

### 4.2 Amazon Q ⭐⭐

**Amazon Q** 是 AWS 的 **AI 助理（AI Assistant）**，有多個版本：

- **Amazon Q Business**：企業版 AI 助理，可連接公司內部資料（SharePoint、S3、資料庫），回答員工問題
- **Amazon Q Developer**：開發者 AI 助理，協助寫程式、除錯、解釋 AWS 服務（類似 GitHub Copilot 但整合 AWS）
- **Amazon Q in QuickSight**：在 BI 工具裡用自然語言問問題，直接生成圖表

> **考試提示**：題目出現「AI-powered assistant」、「natural language queries」、「enterprise knowledge base」→ **Amazon Q**

---

## 5. Data Analytics 資料分析服務

### 5.1 Amazon Kinesis（即時串流資料）⭐⭐

**Amazon Kinesis** 是處理**即時（real-time）串流資料**的服務。

- **Kinesis Data Streams**：收集大量即時資料流（IoT 感測器、應用程式日誌、點擊流）
- **Kinesis Data Firehose**：將串流資料自動傳遞到 S3、Redshift、Elasticsearch 等目的地
- **Kinesis Data Analytics**：用 SQL 即時分析串流資料

> **考試提示**：題目出現「real-time streaming data」、「IoT sensor data」→ **Kinesis**

### 5.2 AWS Glue（ETL 服務）

**AWS Glue** 是 Serverless 的 **ETL（Extract, Transform, Load）**服務，幫你把不同來源的資料整理、轉換格式，載入資料倉儲或資料湖。

- 自動爬取資料來源，建立 **Data Catalog（資料目錄）**
- 適合：把 S3 資料轉換格式後載入 Redshift

### 5.3 Amazon Athena（S3 直接查詢）⭐⭐

**Amazon Athena** 讓你用標準 **SQL** 直接查詢存在 **S3** 的資料，無需先把資料載入資料庫。

- **Serverless**：不需要管理伺服器
- **按查詢量計費**（按掃描的資料量收費）
- 適合：臨時性的資料分析、Log 分析

> 類比：你不用把倉庫的貨搬進辦公室整理，直接在倉庫門口用 SQL 問「給我所有 2024 年的訂單」。

### 5.4 Amazon QuickSight（BI 視覺化）

**Amazon QuickSight** 是 AWS 的 **BI（Business Intelligence）** 工具，用來建立互動式儀表板和圖表。

- 整合 Redshift、Athena、S3、RDS 等資料來源
- 支援 **Amazon Q in QuickSight**，用自然語言生成圖表

### 5.5 AWS Lake Formation（資料湖管理）

**AWS Lake Formation** 協助你快速建立安全的 **Data Lake（資料湖）**，集中管理大量原始資料，並控制存取權限。

### 5.6 Amazon EMR（大規模資料處理）

**Amazon EMR（Elastic MapReduce）** 是受管的 **Apache Hadoop / Spark** 叢集服務，適合大規模資料處理工作（機器學習、ETL、日誌分析）。

---

## 6. 考試重點整理 Exam Tips

- **AI Services**：記住「情境關鍵字 → 服務名稱」的對應，不需要深入技術細節
- **Bedrock** = 生成式 AI，多個 Foundation Models 可選，Serverless，不訓練模型
- **SageMaker** = 自己訓練和部署 ML 模型的平台（需要 ML 知識）
- **Amazon Q** = AI 助理，Q Business 給企業員工，Q Developer 給開發者
- **Kinesis** = 即時串流資料處理
- **Athena** = 用 SQL 直接查 S3，Serverless，按量計費
- **Redshift vs Athena**：Redshift 是資料倉儲（資料要先載入）；Athena 是直接查 S3（不需載入）

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 8 | CLF-C02*
