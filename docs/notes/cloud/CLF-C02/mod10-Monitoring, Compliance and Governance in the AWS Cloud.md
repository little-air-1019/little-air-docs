---
sidebar_position: 11
title: "Module 10: Monitoring, Compliance and Governance in the AWS Cloud"
---

# Module 10：Monitoring, Compliance and Governance

> 這章的服務讓你「看得見」AWS 上發生了什麼事。三條主線：**CloudWatch（監控效能）、CloudTrail（稽核操作記錄）、Config（設定合規）**。記清楚這三個的差異是考試重點。

---

## 1. 三大核心服務一眼看懂

| 服務 | 問的問題 | 類比 |
|---|---|---|
| **CloudWatch** | 系統現在**健不健康**？CPU 用了多少？| 病患的監控儀器 |
| **CloudTrail** | **誰**在什麼時間做了什麼 API 操作？| 大樓的門禁刷卡記錄 |
| **AWS Config** | 我的資源設定**有沒有違規**？有沒有被改過？| 品管稽核員 |

---

## 2. Amazon CloudWatch ⭐⭐⭐

### 是什麼？

**Amazon CloudWatch** 是 AWS 的**監控與觀察性（Observability）**服務，收集和追蹤 AWS 資源的 Metrics（指標）、Logs（日誌）和 Events（事件）。

### 核心功能

#### Metrics（指標）
- 收集 AWS 服務的效能數據，例如：
  - EC2 的 CPU Utilization、Network In/Out
  - RDS 的 DatabaseConnections、FreeStorageSpace
  - S3 的 BucketSizeBytes
- 每個指標預設保留 15 個月

#### CloudWatch Alarms（警報）⭐⭐⭐
- 設定閾值，當指標超過或低於某個值時觸發動作
- 可以觸發：**SNS 通知**、**Auto Scaling 動作**、**EC2 動作**（重啟、停止）

```
範例：EC2 的 CPU 使用率 > 80% 持續 5 分鐘
→ 觸發 SNS 通知傳送 Email 給管理員
→ 同時觸發 Auto Scaling 加新的 EC2
```

#### CloudWatch Logs（日誌）
- 集中收集和儲存來自 EC2、Lambda、CloudTrail 等服務的 Log
- 可以設定 **Metric Filters** 從 Log 中提取指標（例如：計算 Error 出現次數）
- **CloudWatch Logs Insights**：用 SQL-like 語法查詢 Log

#### CloudWatch Dashboard（儀表板）
- 自訂儀表板，把多個 Metrics 圖表放在同一個畫面
- 可以跨帳號、跨 Region 顯示

### CloudWatch Events / Amazon EventBridge

**Amazon EventBridge**（原 CloudWatch Events）是事件驅動的自動化工具：
- 根據 AWS 服務的事件（如 EC2 狀態變更）觸發自動化流程
- 可以排程任務（Cron-like）
- 整合 SaaS 服務事件

---

## 3. AWS CloudTrail ⭐⭐⭐

### 是什麼？

**AWS CloudTrail** 記錄**所有對 AWS 的 API 呼叫（API Calls）**，包括誰操作、何時操作、從哪裡操作、做了什麼。

### CloudTrail 記錄什麼？

幾乎所有 AWS 操作都是 API Call，所以 CloudTrail 記錄了：
- 從 Console 登入後點了什麼按鈕
- 從 CLI 執行了什麼指令
- 程式碼透過 SDK 呼叫了什麼 API
- 哪個 IAM User 在幾點建立或刪除了某個資源

### 典型應用

- **安全稽核**：「是誰在昨晚 3 點刪除了那個 S3 Bucket？」
- **合規檢查**：確認所有操作都有記錄可查
- **事件調查**：追查異常操作的來源

### CloudTrail 的重要設定

- 預設記錄保留 **90 天**
- 若需要更長期保存，設定 **Trail** 將記錄自動存到 **S3**
- 可搭配 **CloudWatch Logs** 設定警報（例如：有人呼叫了 DeleteBucket API 就立刻通知）

> **考試提示**：題目出現「who made the change」、「audit API calls」、「compliance logging」→ **CloudTrail**

---

## 4. AWS Config ⭐⭐⭐

### 是什麼？

**AWS Config** 持續記錄 AWS 資源的**設定歷史（Configuration History）**，並評估設定是否符合你定義的規則（Compliance Rules）。

### 核心功能

- **持續追蹤**：每次資源設定變更，Config 都會記錄「之前是什麼，現在是什麼」
- **Compliance Rules**：定義規則，例如「所有 S3 Bucket 不得公開」、「所有 EC2 必須啟用 EBS 加密」
- **不合規警示**：若資源設定違反規則，Config 標記為 Non-compliant 並可觸發通知

### CloudTrail vs AWS Config 的區別

| | **CloudTrail** | **AWS Config** |
|---|---|---|
| 記錄什麼 | API 操作（誰做了什麼）| 資源設定狀態（設定是什麼）|
| 問的問題 | **Who** did what, **when**? | Is my config **compliant**? What did it **look like** before? |
| 類比 | 門禁刷卡記錄 | 品管稽核員的檢查表 |

> **記憶技巧**：CloudTrail = 人的行為記錄；Config = 資源設定的狀態快照。

---

## 5. AWS Trusted Advisor ⭐⭐⭐

### 是什麼？

**AWS Trusted Advisor** 是 AWS 的**最佳實踐顧問**，自動掃描你的 AWS 帳號，提供五個面向的優化建議：

| 檢查面向 | 範例建議 |
|---|---|
| **Cost Optimization** | 有閒置的 EC2 或未使用的 EBS，可以刪除節省費用 |
| **Performance** | EC2 的 EBS IOPS 使用率過高，建議升級 |
| **Security** | Root User 沒有開啟 MFA、S3 Bucket 設為公開 |
| **Fault Tolerance** | RDS 沒有啟用 Multi-AZ、EC2 沒有分散在多個 AZ |
| **Service Limits** | 某個服務快要達到使用上限 |

### 免費 vs 付費檢查

- **所有客戶免費**：7 項核心安全和服務限制檢查
- **Business / Enterprise 支援方案**：解鎖所有 100+ 項檢查

---

## 6. AWS Systems Manager（SSM）

### 是什麼？

**AWS Systems Manager** 是一套統一管理 AWS 資源（主要是 EC2）的工具集合。

### 常用功能

- **Session Manager**⭐：透過 Console 或 CLI 直接連線到 EC2，**不需要開 SSH Port（22）**、不需要 Bastion Host
- **Patch Manager**：自動批次更新 EC2 的 OS 和應用程式
- **Parameter Store**：安全儲存設定值和機密（比 Secrets Manager 輕量）
- **Run Command**：不需要 SSH，直接對多台 EC2 同時執行命令

> **考試提示**：「連接 EC2 但不想開 SSH Port」→ **Session Manager**

---

## 7. AWS Control Tower

### 是什麼？

**AWS Control Tower** 用來建立和管理**安全、合規的多帳號 AWS 環境（Landing Zone）**。

- 自動化設定多帳號結構（整合 AWS Organizations）
- 預建的 **Guardrails（護欄）**：強制執行的安全政策（如「禁止公開 S3 Bucket」）
- 提供儀表板，讓你看到所有帳號的合規狀態

> 比喻：Control Tower 是蓋新城市時的都市計劃規範——在大家開始各自蓋房子之前，先把道路、分區規定、電力管線等基礎設施和規則都定好。

---

## 8. Amazon CloudWatch vs CloudTrail vs Config 整合應用

一個完整的監控與合規體系通常三者並用：

```
情境：有人把 S3 Bucket 改成公開存取

CloudTrail → 記錄是誰（哪個 IAM User）在幾點做了 PutBucketPolicy 這個 API Call
AWS Config  → 偵測 S3 Bucket 設定變更，標記為 Non-compliant，觸發 SNS 通知
CloudWatch  → 如果有設定 Metric Filter，可以監控 Config Non-compliant 事件數量
```

---

## 9. 考試重點整理 Exam Tips

- **CloudWatch** = 監控效能指標（Metrics）和日誌（Logs），設定 Alarms 觸發動作
- **CloudTrail** = 記錄所有 API 操作，回答「誰、何時、做了什麼」，預設保留 90 天
- **AWS Config** = 記錄資源設定歷史，評估合規性，回答「設定有沒有違規、之前是什麼」
- **Trusted Advisor** = 五面向最佳實踐建議（Cost、Performance、Security、Fault Tolerance、Service Limits）
- **Session Manager** = 不需要 SSH Port 就能連 EC2
- **Control Tower** = 快速建立多帳號安全架構（Landing Zone）
- CloudTrail 與 Config 的差異是高頻考點：前者追**行為**，後者追**設定狀態**

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 10 | CLF-C02*
