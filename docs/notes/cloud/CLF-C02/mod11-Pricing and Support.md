---
sidebar_position: 12
title: "Module 11: Pricing and Support"
---

# Module 11：Pricing and Support（定價與支援）

> 本模組涵蓋 AWS 的收費邏輯、成本管理工具，以及五個支援方案（Support Plans）。**Support Plans 的比較**是這章的必考主題，需要能對照不同方案的差異。

---

## 1. AWS 定價的三大核心原則

### 1.1 Pay for what you use（用多少付多少）
- 沒有前期固定費用，按實際使用量計費
- 不用了就關掉，立刻停止計費

### 1.2 Pay less when you reserve（承諾用量有折扣）
- 對 EC2、RDS 等服務做長期承諾，可享折扣
- Reserved Instances、Savings Plans（見 Module 2）

### 1.3 Pay less with volume-based discounts（用得越多越便宜）
- S3 等服務隨用量增加而單價遞減
- AWS Organizations 的 Consolidated Billing 可合併用量享量折

---

## 2. AWS Free Tier（免費方案）⭐⭐⭐

AWS 提供三種免費方案，考試常考你能辨識哪個服務屬於哪種類型：

### 2.1 Always Free（永久免費）
- 不會過期，永遠可以免費使用（有用量上限）
- 範例：
  - **AWS Lambda**：每月前 100 萬次請求免費
  - **Amazon DynamoDB**：每月 25 GB 儲存免費
  - **Amazon CloudFront**：每月前 1 TB 流量免費

### 2.2 12 Months Free（首年免費）
- 從建立 AWS 帳號起算 **12 個月**內免費（有用量上限）
- 範例：
  - **EC2 t2.micro / t3.micro**：每月 750 小時免費
  - **S3**：5 GB 標準儲存免費
  - **RDS db.t2.micro**：每月 750 小時免費

### 2.3 Trials（短期試用）
- 特定服務的短期試用，從啟用服務起算
- 範例：
  - **Amazon SageMaker**：2 個月試用
  - **Amazon Inspector**：90 天試用

---

## 3. AWS 計費與成本管理工具

### 3.1 AWS Pricing Calculator ⭐⭐
- **用途**：建立 AWS 架構前，**預估費用**
- 無需 AWS 帳號即可使用
- 可以選服務、輸入用量，產生費用估算報告

> **考試提示**：題目出現「estimate cost before deploying」→ **Pricing Calculator**

### 3.2 AWS Billing Dashboard
- 查看當月帳單、歷史費用，以及下月預估費用
- 可以查看 Free Tier 使用量是否快要超標

### 3.3 AWS Budgets ⭐⭐⭐
- **設定預算警報**：當實際費用（或預測費用）超過你設定的閾值，自動發出通知
- 支援四種 Budget 類型：Cost Budget、Usage Budget、Reservation Budget、Savings Plans Budget
- 可以觸發 **SNS 通知**或自動執行動作

```
範例：設定每月預算上限 $500
→ 當費用預測將超過 80%（$400）時 Email 通知
→ 當費用實際超過 100%（$500）時再次通知
```

> **考試提示**：題目出現「notify when cost exceeds threshold」→ **AWS Budgets**

### 3.4 AWS Cost Explorer ⭐⭐⭐
- **視覺化分析歷史費用**：查看過去 13 個月的費用趨勢
- 可以按服務、帳號、Tag、Region 等維度過濾分析
- **預測功能**：根據歷史趨勢預測未來 12 個月費用
- 識別節省機會（例如：建議購買 Reserved Instances）

> **差別記憶**：
> - **Pricing Calculator** = 部署前預估（沒有帳號也能用）
> - **Cost Explorer** = 部署後分析歷史費用
> - **Budgets** = 設定上限警報

### 3.5 AWS Cost and Usage Report（CUR）
- 最詳細的費用明細報告，每小時精確到每個資源
- 存到 S3，可搭配 Athena、QuickSight 做進階分析
- 適合需要深度分析的大型企業

### 3.6 Consolidated Billing（合併帳單）⭐⭐
- AWS Organizations 功能之一
- 所有帳號費用彙總到 **Management Account（主帳號）** 一張帳單
- **好處**：合併用量計算折扣（如 S3 的量折）、方便財務部門統一管理
- 各子帳號的資源仍然互相隔離，只是帳單合在一起

---

## 4. AWS Support Plans（支援方案）⭐⭐⭐

這是本章最重要的考點。五個方案的差異需要能在情境題中做出選擇。

### 四個方案概覽

| | **Basic** | **Developer** | **Business** | **Enterprise On-Ramp** | **Enterprise** |
|---|---|---|---|---|---|
| 費用 | 免費 | $29/月起 | $100/月起 | $5,500/月起 | $15,000/月起 |
| Technical Support | ❌ | ✅ 工作時間（Email）| ✅ 24/7（Email、Chat、Phone）| ✅ 24/7 | ✅ 24/7 |
| Trusted Advisor 全功能 | ❌（7 項）| ❌（7 項）| ✅ | ✅ | ✅ |
| TAM（技術客戶經理）| ❌ | ❌ | ❌ | ✅ 共享池 TAM | ✅ 專屬 TAM |
| 重大事件回應時間 | — | 12 小時 | **1 小時**（生產環境停擺）| **30 分鐘**（業務嚴重影響）| **15 分鐘**（業務嚴重影響）|

### 各方案適合對象

- **Basic**：所有 AWS 帳號預設包含，適合個人學習和實驗
- **Developer**：開發測試環境，可接受較長回應時間
- **Business**：生產工作負載，需要 24/7 支援和電話服務
- **Enterprise On-Ramp**：多個生產工作負載，需要共享 TAM 和更快回應
- **Enterprise**：任務關鍵型工作負載，需要專屬 TAM 和最快回應

### TAM（Technical Account Manager）⭐⭐
- **Enterprise On-Ramp**：共享池的 TAM（不是專屬）
- **Enterprise**：**專屬 TAM**，主動協助規劃、最佳化、架構建議

> **考試提示**：題目出現「dedicated TAM」→ **Enterprise**；「shared TAM」→ **Enterprise On-Ramp**；「1-hour response time for production down」→ **Business** 以上

---

## 5. AWS Marketplace ⭐⭐

### 是什麼？

**AWS Marketplace** 是一個數位市集，讓你找到、購買並部署第三方軟體，直接在 AWS 上運行。

- 超過 10,000 個軟體產品，涵蓋安全、資料庫、機器學習、DevOps 等類別
- 購買後直接部署到你的 AWS 帳號，費用整合到 AWS 帳單
- 範例：Fortinet 防火牆、MongoDB 企業版、資料分析工具

> 類比：AWS 的 App Store，只不過裡面賣的是企業軟體，買完直接在你的 AWS 環境跑。

---

## 6. 其他費用相關服務

### AWS Cost Anomaly Detection（費用異常偵測）
- 使用 ML 自動偵測費用中的**異常波動**
- 例如：某天 EC2 費用突然暴增 300%，自動發通知
- 適合：不定期查帳單，但又不想手動設每個閾值

### AWS Compute Optimizer
- 根據歷史使用資料，建議**調整 EC2 instance size**（right-sizing）
- 避免過度佈建（over-provisioning）浪費費用

---

## 7. 考試重點整理 Exam Tips

- **Free Tier 三種類型**：Always Free（永久）、12 Months Free（首年）、Trials（短期試用）
- **Pricing Calculator** = 預估未來費用（部署前）；**Cost Explorer** = 分析歷史費用（部署後）
- **AWS Budgets** = 設定費用警報，超過閾值自動通知
- **Consolidated Billing** = 合併帳單，合用量享量折
- **Support Plans 關鍵差異**：
  - Business 才有 24/7 Phone 支援和 Trusted Advisor 全功能
  - Enterprise On-Ramp 有共享 TAM、30 分鐘回應
  - Enterprise 才有**專屬 TAM**、15 分鐘回應
- **AWS Marketplace** = 第三方軟體市集，費用合併到 AWS 帳單

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 11 | CLF-C02*
