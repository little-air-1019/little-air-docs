---
sidebar_position: 10
title: "Module 09: Security"
---

# Module 9：Security（安全性）

> Security 是 CLF-C02 佔比最高的領域（30%）。本模組涵蓋 IAM、Shared Responsibility Model、以及 AWS 各種安全服務。這章的考題多是「情境判斷」：給你一個安全需求，選出正確的服務。

---

## 1. Shared Responsibility Model（共同責任模型）⭐⭐⭐

### 核心概念

AWS 和客戶**共同**負責安全，各自負責不同的範疇：

| 責任方 | 負責範圍 | 記憶關鍵字 |
|---|---|---|
| **AWS** | Security **OF** the Cloud | 硬體、資料中心、全球網路、Hypervisor |
| **Customer（你）** | Security **IN** the Cloud | OS 設定、應用程式、網路設定（Security Group）、資料加密、IAM |

### 各服務類型的責任劃分

| 服務類型 | AWS 負責 | 客戶負責 |
|---|---|---|
| **IaaS**（EC2）| 硬體、Hypervisor | OS patch、防火牆設定、應用程式 |
| **PaaS**（RDS）| 硬體、OS、DB 安裝與修補 | DB Schema、存取控制、資料加密 |
| **SaaS**（Amazon Chime）| 幾乎全部 | 帳號管理、資料 |

> **考試陷阱**：EC2 上 OS 的修補（patching）是**客戶**的責任，不是 AWS 的。RDS 的 OS 修補才是 AWS 負責的。

---

## 2. AWS IAM（Identity and Access Management）⭐⭐⭐

### 是什麼？

**AWS IAM** 是管理「誰可以對 AWS 做什麼」的核心服務。完全免費，且是 **Global** 服務。

### IAM 的四個核心元件

#### ① IAM Users（使用者）
- 代表**一個真實的人**或應用程式
- 有自己的登入憑證（密碼、Access Key）
- **Root User**（根使用者）= 建立 AWS 帳號時的最高權限帳號，不建議日常使用

> **Best Practice**：Root User 只用來建立第一個 IAM Admin User，之後鎖起來，永遠開啟 MFA。

#### ② IAM Groups（群組）
- 一組 IAM Users 的集合
- 把 Policy 套用到 Group，Group 裡的所有 User 都繼承那些權限
- 適合：「所有開發人員都有 EC2 讀取權限」

> 類比：公司部門——把「工程部」群組加上「可以查看伺服器」的權限，工程師一加入就自動獲得。

#### ③ IAM Roles（角色）⭐⭐⭐
- **臨時**授予特定權限，不是給某個固定的 User，而是給 **AWS 服務或臨時身分**
- 沒有固定的密碼或 Access Key，每次使用都產生臨時憑證
- **適合情境**：
  - EC2 需要存取 S3 → 給 EC2 掛上一個有 S3 存取權限的 Role
  - Lambda 需要寫入 DynamoDB → 給 Lambda 掛上 Role
  - 跨帳號存取

> 類比：公司的訪客證，進來後可以去特定區域，出去後訪客證自動失效。不像員工證（User）是永久的。

#### ④ IAM Policies（政策）⭐⭐⭐
- 定義**允許（Allow）或拒絕（Deny）哪些 Action** 對 **哪些 Resource**
- JSON 格式
- 套用到 User、Group 或 Role 上
- **Principle of Least Privilege（最小權限原則）**：只給必要的最小權限

```json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::my-bucket/*"
}
```

### IAM 的 Best Practices 清單 ⭐

1. **鎖住 Root User**，開啟 MFA
2. 遵守 **Least Privilege** 原則
3. 使用 **Groups** 管理權限，不要直接給 User 附加 Policy
4. AWS 服務之間的權限用 **Roles**，不要用 Access Key 硬寫在程式碼裡
5. 定期 **Rotate Access Keys**（定期更換存取金鑰）
6. 啟用 **MFA**（Multi-Factor Authentication）

---

## 3. MFA（Multi-Factor Authentication）⭐⭐

- **多因素驗證**：除了密碼，還需要第二個驗證因素（如手機 APP 產生的一次性驗證碼）
- 大幅降低帳號被盜的風險，即使密碼外洩也無法登入
- **Root User 一定要開啟 MFA**

---

## 4. AWS Organizations⭐⭐⭐

### 是什麼？

**AWS Organizations** 讓你統一管理**多個 AWS 帳號**，適合企業需要為不同部門、環境（開發/測試/生產）建立獨立帳號的情境。

### 核心功能

- **合併帳單（Consolidated Billing）**：所有帳號的費用匯到一個主帳號，方便管理，還能享受**量折（Volume Discount）**
- **帳號分組（Organizational Units, OU）**：把帳號分組，例如「工程 OU」、「財務 OU」
- **Service Control Policies（SCP）**⭐⭐⭐：設定整個 OU 或帳號層級的**最大權限邊界**

### SCP 的重要特性

- SCP 是帳號層級的「天花板」，即使 IAM Policy 給了某個 User 很高的權限，SCP 不允許的話一樣不能做
- **SCP 不影響 Management Account（主帳號）**本身
- **SCP 只限制，不授予**：SCP Allow 不等於真的有權限，IAM 也要 Allow 才行

> 類比：SCP 是公司的總規定手冊，IAM Policy 是各部門的工作說明。就算你的部門說「你可以帶東西出去」，如果公司總規定說「不可以帶走任何東西」，還是不行。

---

## 5. 威脅偵測與防護服務

### 5.1 Amazon GuardDuty（威脅偵測）⭐⭐⭐
- **功能**：持續監控 AWS 帳號的惡意活動和異常行為，利用 ML 分析 CloudTrail、VPC Flow Logs、DNS Logs
- 啟用方式：一鍵開啟，**不需要安裝 Agent**
- **適合情境**：「我想知道我的帳號有沒有被入侵或有異常 API 呼叫」

> **考試提示**：題目出現「detect threats」、「identify malicious activity」→ **GuardDuty**

### 5.2 Amazon Inspector（安全弱點掃描）⭐⭐
- **功能**：自動掃描 EC2、Lambda、Container Image 的**安全漏洞（CVE）**和**網路存取問題**
- 持續自動掃描，不是一次性的
- **適合情境**：「我想知道我的 EC2 有沒有未修補的安全漏洞」

> 差別記憶：**GuardDuty** = 偵測外部攻擊行為（like 入侵警報）；**Inspector** = 掃描你自己的漏洞（like 健康檢查）。

### 5.3 Amazon Macie（S3 敏感資料偵測）⭐⭐
- **功能**：用 ML 自動探索、分類和保護 **S3** 中的**敏感資料**（如個人識別資訊 PII、信用卡號）
- **適合情境**：「確認我的 S3 Bucket 裡沒有不該存在的個人資料」

> **一句話**：Macie 是 S3 的個資守門員。

---

## 6. DDoS 防護

### 6.1 AWS Shield ⭐⭐⭐

| | **AWS Shield Standard** | **AWS Shield Advanced** |
|---|---|---|
| 費用 | **免費**，自動啟用 | 每月 $3,000 起 |
| 防護等級 | 常見的 L3/L4 DDoS 攻擊 | 更複雜的 L3/L4/L7 攻擊 |
| 支援 | 無 | 24/7 AWS DDoS 回應團隊（DRT）|
| 額外功能 | 無 | 攻擊期間費用保護、詳細攻擊分析 |

> **考試提示**：大多數情況下 Shield Standard 就夠了，它是免費自動啟用的。想要「24/7 DDoS 專業支援」才選 Advanced。

### 6.2 AWS WAF（Web Application Firewall）⭐⭐
- 保護 Web 應用程式不受常見的 Web 攻擊（SQL Injection、XSS 等）
- 作用在 **Layer 7（Application Layer）**
- 可搭配 CloudFront、ALB、API Gateway 使用
- 你可以設定**規則**：封鎖特定 IP、特定國家、特定請求模式

> 類比：WAF 是網站的保鑣，拿著黑名單，看到可疑請求就擋下來。

---

## 7. 加密與金鑰管理

### 7.1 AWS KMS（Key Management Service）⭐⭐⭐
- 建立和管理**加密金鑰（Encryption Keys）**，用於加密 AWS 服務的資料
- 整合幾乎所有 AWS 服務（S3、EBS、RDS、DynamoDB...）
- **Customer Managed Keys（CMK）**：你建立和控制的金鑰
- **AWS Managed Keys**：AWS 幫你管理的金鑰

> **考試提示**：題目出現「資料加密」、「管理加密金鑰」→ **KMS**

### 7.2 AWS Secrets Manager⭐⭐
- 安全儲存和自動輪換（rotate）**機密資訊**，如資料庫密碼、API 金鑰
- 應用程式透過 API 取得機密，不需要把密碼硬寫在程式碼裡
- **自動 Rotation**：定期自動更換密碼，不需人工介入

> 類比：公司的密碼保險箱，程式想要密碼就來這裡領，而且保險箱會定期自動換新密碼。

### 7.3 AWS CloudHSM（Hardware Security Module）
- 提供**專用的硬體安全模組**來產生和管理金鑰
- 比 KMS 更嚴格的合規需求才需要（FIPS 140-2 Level 3）
- **你自己管理金鑰**（AWS 不能存取）

> **差別記憶**：KMS = AWS 幫你管金鑰（共管）；CloudHSM = 你自己管金鑰（完全自主）。

---

## 8. 合規與稽核服務

### 8.1 AWS Artifact⭐⭐
- 免費的**合規報告中心**，提供 AWS 的安全與合規文件
- 包含：ISO 27001、SOC 報告、PCI DSS 等認證文件
- **用途**：給稽核人員看「AWS 本身符合哪些合規標準」

> 類比：AWS 的「學歷證書大全」，證明 AWS 本身有多安全合規。

### 8.2 AWS Certificate Manager（ACM）
- 免費申請、管理、自動更新 **SSL/TLS 憑證**
- 整合 CloudFront、ALB、API Gateway
- 讓網站可以使用 HTTPS，且不需要手動更新憑證

---

## 9. 帳號安全工具

### 9.1 IAM Access Analyzer
- 分析你的 IAM Policies，找出**對外暴露的資源**（哪些 S3 Bucket 或 IAM Role 可能被外部存取）

### 9.2 AWS Trusted Advisor（安全檢查）
- 提供帳號安全狀態的即時建議，例如：「你的 Root User 沒有開啟 MFA」、「有 S3 Bucket 是公開的」
- 詳細內容見 Module 11

---

## 10. 考試重點整理 Exam Tips

- **Shared Responsibility**：AWS 管 OF，你管 IN；EC2 的 OS patch 是你的責任
- **IAM Root User**：只用一次建立 Admin，之後鎖住並開啟 MFA
- **IAM Roles** 用於 AWS 服務間的授權（不要用 Access Key 硬寫在程式碼）
- **Least Privilege**：只給最小必要權限，CLF-C02 的核心安全原則
- **SCP**（Service Control Policies）= 帳號的「天花板」，Organizations 層級使用
- **GuardDuty** = 偵測外部威脅（like 警報系統）；**Inspector** = 掃描自身漏洞（like 健康檢查）；**Macie** = 找 S3 裡的敏感資料
- **Shield Standard** = 免費，自動啟用；**Shield Advanced** = 付費，進階 DDoS 防護
- **WAF** = Layer 7 Web 攻擊防護（SQL Injection、XSS）
- **KMS** = 加密金鑰管理（AWS 共管）；**Secrets Manager** = 機密資訊儲存與自動輪換
- **AWS Artifact** = 合規文件下載中心（免費）

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 9 | CLF-C02*
