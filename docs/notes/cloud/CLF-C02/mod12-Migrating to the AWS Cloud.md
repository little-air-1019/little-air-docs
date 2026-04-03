---
sidebar_position: 13
title: "Module 12: Migrating to the AWS Cloud"
---

# Module 12：Migrating to the AWS Cloud（遷移至 AWS）

> 本模組圍繞兩個核心框架：**AWS CAF**（遷移的規劃角度）和 **6 R's of Migration**（遷移策略選擇）。這兩個架構是考試的必考項目，需要能在情境中辨識對應的策略。

---

## 1. AWS Cloud Adoption Framework（AWS CAF）⭐⭐⭐

### 是什麼？

**AWS CAF** 是 AWS 提供的雲端遷移規劃框架，幫助組織從不同角度評估、規劃雲端遷移。框架分為**六個 Perspectives（視角）**，涵蓋技術與業務兩大面向。

### 六大 Perspectives

分為兩組：**Business Capabilities（業務能力）** 和 **Technical Capabilities（技術能力）**

#### 業務能力面

| Perspective | 關注對象 | 主要問題 |
|---|---|---|
| **Business** | 業務主管、財務長、事業負責人 | 雲端如何讓業務更好？ROI 是什麼？|
| **People** | 人力資源、人才發展 | 員工需要哪些訓練？組織文化如何轉型？|
| **Governance** | CIO、計劃管理、企業架構師 | 如何管理 IT 治理？風險如何控制？|

#### 技術能力面

| Perspective | 關注對象 | 主要問題 |
|---|---|---|
| **Platform** | CTO、IT 架構師、工程師 | 如何設計雲端架構？使用哪些 AWS 服務？|
| **Security** | CISO、安全架構師 | 如何確保雲端環境的安全合規？|
| **Operations** | IT 維運、支援團隊 | 如何監控、管理日常雲端營運？|

> 記憶口訣：**B**usiness、**P**eople、**G**overnance（業務面）+ **P**latform、**S**ecurity、**O**perations（技術面）= **BPGPSO**

> **考試提示**：題目描述某個部門的遷移挑戰，問屬於 CAF 的哪個 Perspective → 對應表格中的「關注對象」來選答案

---

## 2. 六種遷移策略：6 R's of Migration ⭐⭐⭐

遷移策略不是「一刀切」，每個應用程式都可能適合不同的方法。

### 2.1 Rehost（Lift and Shift，搬家）⭐
- **做什麼**：把應用程式原封不動地從 On-Premises 搬到 EC2，幾乎不做任何修改
- **速度**：最快
- **優點**：快速完成遷移，立刻離開本地資料中心
- **缺點**：無法充分利用雲端特性
- **適合**：需要快速遷移、技術能力有限、不想改動舊系統

> 類比：搬家時把所有家具原封不動搬進新家，不整理不丟棄。

### 2.2 Replatform（Lift, Tinker, and Shift，小升級再搬家）
- **做什麼**：遷移時做一些小幅優化，但不改變應用程式的核心架構
- **範例**：把自管 MySQL 換成 Amazon RDS（省掉 OS 管理），但應用程式程式碼不動
- **適合**：想要一些雲端好處，但不想大幅改寫程式

> 類比：搬家時順便換掉舊冰箱，其他家具還是原封不動。

### 2.3 Refactor / Re-architect（重新架構）⭐
- **做什麼**：**重新設計**應用程式架構，充分利用雲端原生功能
- **範例**：把 Monolithic 應用程式拆解成 Microservices，改用 Lambda + DynamoDB
- **速度**：最慢、最複雜
- **優點**：最大化雲端效益（Scalability、Resilience、Agility）
- **適合**：有強烈的雲端轉型需求，且技術能力充足

> 類比：不是搬家，是整棟房子拆掉重建，採用最現代的格局和建材。

### 2.4 Repurchase（Drop and Shop，換產品）
- **做什麼**：放棄舊有的應用程式，改用雲端上的 SaaS 產品
- **範例**：放棄自建的 CRM 系統，改用 Salesforce；放棄自建 HR 系統，改用 Workday
- **適合**：現有系統老舊、維護成本高，且市面上有對應的 SaaS 可替代

> 類比：不帶舊家具搬家，直接到 IKEA 買新的一套。

### 2.5 Retain（保留）
- **做什麼**：決定**暫時不遷移**，保留在本地
- **原因**：系統太老舊（Legacy）、遷移成本太高、近期有重大改版計劃、法規限制
- **不是放棄**：通常是「現在不動，以後再說」

> 類比：有些家具真的太大不好搬，就先放在原來的地方。

### 2.6 Retire（退役）
- **做什麼**：評估後發現某個應用程式**不再需要**，直接關閉不遷移
- **效果**：節省維護成本，讓團隊專注在真正有價值的系統上
- **通常**：企業盤點後，約 10-20% 的應用程式可以直接退役

> 類比：搬家前整理發現有些東西根本不用了，直接丟掉不搬。

### 6 R's 快速記憶表

| 策略 | 關鍵字 | 修改幅度 |
|---|---|---|
| **Rehost** | Lift & Shift，不改動 | 無 |
| **Replatform** | 小調整（如換成 RDS）| 小 |
| **Refactor** | 重新架構，雲端原生 | 最大 |
| **Repurchase** | 換 SaaS 產品 | 全換 |
| **Retain** | 暫時保留本地 | 無需遷移 |
| **Retire** | 直接關閉 | 無需遷移 |

---

## 3. AWS Snow Family（大型資料遷移）⭐⭐

（詳細規格見 Module 6，這裡著重**遷移場景**的應用）

當資料量太大、網路太慢，直接線上傳輸不切實際時，選用 Snow Family 實體裝置：

| 設備 | 容量 | 何時選用 |
|---|---|---|
| **Snowcone** | 8-14 TB | 邊緣環境、小量資料 |
| **Snowball Edge** | 80 TB | 主流大量資料遷移 |
| **Snowmobile** | 100 PB | 資料中心整體搬遷 |

**判斷該用網路還是 Snow Family 的公式**：
> 如果用你的網路頻寬傳輸資料要超過一週，考慮用 Snow Family。

---

## 4. AWS Migration Hub

**AWS Migration Hub** 提供統一的儀表板，追蹤遷移進度——不論你用哪個遷移工具，都能在這裡看到整體狀況。

---

## 5. AWS Application Discovery Service

在遷移前，協助你**盤點本地資料中心的應用程式與相依性**：
- 探索執行中的應用程式
- 收集效能資料（CPU、Memory 使用率）
- 建立應用程式之間的相依圖，避免遷移時遺漏

---

## 6. AWS Application Migration Service（MGN）

**AWS MGN** 是 AWS 的主要 **Rehost（Lift and Shift）** 遷移工具：
- 在來源伺服器安裝 Replication Agent
- 持續將資料複製到 AWS（不中斷業務）
- 切換時間窗口極短（分鐘級）

---

## 7. AWS Database Migration Service（DMS）

（詳細內容見 Module 7，這裡補充遷移情境）

- **同質遷移**：MySQL → RDS MySQL（直接搬）
- **異質遷移**：Oracle → Aurora PostgreSQL（需先用 Schema Conversion Tool 轉換）
- 遷移期間**來源資料庫持續運作**，最小化停機時間

---

## 8. VMware Cloud on AWS

若公司現有環境大量使用 **VMware**，可以透過 **VMware Cloud on AWS** 直接把 VMware 工作負載遷移到 AWS，不需要修改 VMware 的管理工具和流程。

---

## 9. 考試重點整理 Exam Tips

- **AWS CAF 六個 Perspectives**：Business、People、Governance（業務面）+ Platform、Security、Operations（技術面）
- **6 R's** 各自的關鍵字與適用情境要能辨識：
  - 不動直接搬 → **Rehost**
  - 小幅優化（換成受管服務）→ **Replatform**
  - 重新設計雲端原生架構 → **Refactor**
  - 換 SaaS 產品 → **Repurchase**
  - 暫時不遷移 → **Retain**
  - 直接關閉不要了 → **Retire**
- **Rehost** 是最快速的遷移方式；**Refactor** 是最能發揮雲端優勢但最費時的
- **Snow Family**：網路傳輸太慢時用實體裝置，資料中心整體搬遷選 **Snowmobile**
- **DMS**：資料庫遷移，來源 DB 可持續運作

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 12 | CLF-C02*
