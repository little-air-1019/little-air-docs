---
sidebar_position: 2
title: "Module 01: Introduction to the Cloud"
---

# Module 1：Introduction to the Cloud

---

## 1. 什麼是雲端運算？What is Cloud Computing?

**Cloud Computing** 的官方定義（AWS）：

> On-demand delivery of IT resources over the internet with pay-as-you-go pricing.

三個核心概念：
- **On-demand delivery**：隨需取用，不需要預先購買硬體
- **IT resources over the internet**：透過網際網路存取運算、儲存、資料庫等資源
- **Pay-as-you-go pricing**：用多少付多少，停止使用即停止計費

### 傳統 IT 基礎架構 vs 雲端

| 傳統 On-Premises | AWS Cloud |
|---|---|
| 需要預測容量（over-provision 或 under-provision）| 彈性擴縮，按需取用 |
| 高額前期資本支出（CapEx） | 轉為營運支出（OpEx） |
| 自行管理硬體、機房、電力 | AWS 負責底層基礎設施 |
| 部署週期長（數週～數月）| 幾分鐘內即可部署 |

---

## 2. 雲端部署模型 Cloud Deployment Models

### 2.1 Public Cloud
- 所有資源都在雲端服務商（如 AWS）上運行
- 不需要自建資料中心
- 適合新應用程式、scalable 工作負載

### 2.2 Private Cloud（On-Premises Cloud）
- 雲端基礎設施部署在企業自己的資料中心
- 使用虛擬化技術模擬雲端環境（如 VMware）
- 適合有嚴格法規或資料主權需求的組織

### 2.3 Hybrid Cloud
- Public Cloud + Private Cloud / On-Premises 混合使用
- 常見情境：舊系統留在本地，新服務部署上雲
- AWS 服務：**AWS Outposts**（將 AWS 基礎設施延伸到本地資料中心）

> **考試提示**：題目若問到「公司有既有的本地系統，同時又想用 AWS」→ **Hybrid**

---

## 3. 雲端服務模型 Cloud Service Models

### 3.1 IaaS（Infrastructure as a Service）
- 提供：虛擬機器、網路、儲存等基礎設施
- 你管理：OS、middleware、應用程式
- AWS 例子：**Amazon EC2**
- 類比：租一塊空地，自己蓋房子

### 3.2 PaaS（Platform as a Service）
- 提供：執行環境、資料庫、開發工具
- 你管理：應用程式程式碼與資料
- AWS 例子：**AWS Elastic Beanstalk**、**Amazon RDS**
- 類比：租一個附家具的房間，自己住進去

### 3.3 SaaS（Software as a Service）
- 提供：完整的應用程式
- 你管理：使用者與資料
- AWS 例子：**Amazon Chime**、**Amazon WorkMail**
- 非 AWS 例子：Gmail、Salesforce、Zoom
- 類比：住飯店，什麼都幫你準備好

> **記憶口訣**：IaaS → PaaS → SaaS，你負責管理的東西越來越少

---

## 4. 雲端運算的六大優勢 Six Advantages of Cloud Computing

這是考試高頻考點，需熟悉（以下為官方原文）：

1. **Trade upfront expense for variable expense**
   （以變動支出取代前期固定支出）
   - 不需購買資料中心或伺服器，用多少付多少

2. **Benefit from massive economies of scale**
   （受益於大規模經濟效益）
   - AWS 彙聚數十萬客戶的用量，取得更低的單位成本，並轉讓給客戶

3. **Stop guessing capacity**
   （不再需要猜測容量）
   - 可以隨時 scale up / scale down，不會因為 over-provision 或 under-provision 而浪費或不足

4. **Increase speed and agility**
   （提高速度與靈活性）
   - 取得資源從數週縮短到幾分鐘，大幅提升實驗與創新速度

5. **Stop spending money running and maintaining data centers**
   （不再花錢維運資料中心）
   - 讓你專注在自己的應用與客戶，而非底層基礎設施

6. **Go global in minutes**
   （數分鐘內部署至全球）
   - 輕鬆在全球多個 AWS Regions 部署應用，降低用戶延遲

---

## 5. AWS 共同責任模型（預覽）Shared Responsibility Model

（詳細內容在 Module 9 Security，此處先了解概念）

| 責任方 | 負責範圍 |
|---|---|
| **AWS** | Security **OF** the Cloud（硬體、資料中心、網路基礎設施） |
| **Customer（你）** | Security **IN** the Cloud（OS 設定、應用程式、資料加密、IAM） |

> 類比：AWS 負責建築物本身的安全，你負責自己房間裡面的東西。

---

## 6. AWS 服務類別概覽

AWS 提供超過 200 個服務，以下是 CLF-C02 考試聚焦的主要類別：

| 類別 | 代表服務 |
|---|---|
| **Compute** | EC2, Lambda, Elastic Beanstalk, Fargate |
| **Storage** | S3, EBS, EFS, S3 Glacier |
| **Database** | RDS, DynamoDB, Redshift, ElastiCache |
| **Networking** | VPC, Route 53, CloudFront, Direct Connect |
| **Security** | IAM, Shield, WAF, KMS, GuardDuty |
| **Monitoring** | CloudWatch, CloudTrail, AWS Config |
| **AI / ML** | SageMaker, Rekognition, Comprehend, Bedrock |
| **Migration** | DMS, Snow Family, Migration Hub |

---

## 7. Well-Architected Framework（預覽）

（詳細內容在 Module 13，此處先記住 6 大支柱名稱）

| 支柱 | 關注重點 |
|---|---|
| **Operational Excellence** | 持續改善營運流程 |
| **Security** | 保護資料與系統 |
| **Reliability** | 系統在故障時仍能正常運作 |
| **Performance Efficiency** | 有效率地使用運算資源 |
| **Cost Optimization** | 避免不必要的支出 |
| **Sustainability** | 降低環境影響 |

---

## 8. 考試重點整理 Exam Tips

- **Cloud Computing 定義**：on-demand + internet + pay-as-you-go，三者缺一不可
- **Hybrid Cloud**：本地 + 雲端混合；不要與 Multi-Cloud（多個雲端供應商）混淆
- **六大優勢**需要能辨識，考題常用情境描述讓你選出對應的 advantage
- **IaaS / PaaS / SaaS**：記住「你管多少」的差異，EC2 = IaaS，Elastic Beanstalk = PaaS
- **Shared Responsibility Model**：AWS 管 **OF** the Cloud，你管 **IN** the Cloud
- **CapEx vs OpEx**：傳統 IT 是資本支出（CapEx），雲端是營運支出（OpEx）

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 1 | CLF-C02*
