---
sidebar_position: 8
title: "Module 07: Databases"
---

# Module 7：Databases（資料庫）

> 資料庫選擇的核心問題是：**結構化還是非結構化？需要關聯式還是 NoSQL？**本模組介紹 AWS 提供的各種受管資料庫服務，以及如何在不同情境下做出正確選擇。

---

## 1. 自建 DB on EC2 vs AWS 受管資料庫

| | **EC2 上自建 DB** | **AWS Managed DB（RDS、DynamoDB 等）** |
|---|---|---|
| 你負責 | 安裝、修補、備份、HA 設定、全部 | 只負責資料與 schema |
| AWS 負責 | 底層硬體 | 硬體、OS、安裝、修補、備份、HA |
| 彈性 | 最高（什麼都能裝）| 較低（依服務限制）|
| 管理負擔 | 高 | 低 |

> **考試提示**：AWS 推薦使用 Managed DB，除非你有特殊需求（例如：DB 引擎 AWS 不支援）。

---

## 2. Amazon RDS（Relational Database Service）⭐⭐⭐

### 是什麼？

**Amazon RDS** 是 AWS 的**受管關聯式資料庫（Relational Database）**服務，讓你不需要管理伺服器，直接使用熟悉的 SQL 資料庫。

### 支援的資料庫引擎

- Amazon Aurora（AWS 自家，最佳化）
- PostgreSQL
- MySQL
- MariaDB
- Oracle
- Microsoft SQL Server

### RDS 自動幫你處理的事

- 硬體佈建
- DB 安裝與設定
- 自動備份（Automated Backups）
- 軟體修補（Patching）
- 高可用性設定（Multi-AZ）

### RDS Multi-AZ Deployment ⭐⭐

- **Primary DB** 在一個 AZ 接收讀寫
- **Standby DB** 在另一個 AZ 自動同步
- Primary 故障時，自動 **Failover** 到 Standby（通常在 1-2 分鐘內）
- Standby 不接受讀取請求，純粹是備援

> 類比：主廚上班，替補廚師在旁邊待命，主廚倒下時立刻頂上，廚房不停擺。

### Read Replicas（讀取副本）

- 用來分散**讀取**流量（Standby 是備援，Read Replica 才是分流讀取用的）
- 可以在不同 AZ 或不同 Region 建立
- 資料是非同步（Async）複製過去的

---

## 3. Amazon Aurora ⭐⭐⭐

### 是什麼？

**Amazon Aurora** 是 AWS 自行開發、**完全相容 MySQL 和 PostgreSQL** 的雲端原生資料庫。

### 為什麼選 Aurora？

- **效能**：比標準 MySQL 快最多 **5 倍**，比 PostgreSQL 快最多 **3 倍**
- **高可用性**：資料自動在 **3 個 AZ** 各複製 2 份（共 6 份副本）
- **容量**：自動擴展，最高 **128 TB**
- **成本**：比 Oracle 或 SQL Server 便宜，但比 RDS MySQL 貴

> **考試提示**：題目若強調「高效能」、「高可用性」、「企業級關聯式資料庫」且不考慮成本 → **Aurora**

---

## 4. Amazon DynamoDB（NoSQL）⭐⭐⭐

### 是什麼？

**Amazon DynamoDB** 是 AWS 的 **Serverless NoSQL 鍵值對資料庫（Key-Value & Document）**。

### 核心特性

- **Serverless**：完全不需要管理伺服器或 cluster
- **自動擴展**：可在幾毫秒內擴展到數千萬筆請求/秒
- **低延遲**：回應時間穩定在**個位數毫秒（single-digit milliseconds）**
- **高可用性**：資料自動跨多個 AZ 複製

### 何時用 DynamoDB 而非 RDS？

| 選 **RDS / Aurora** | 選 **DynamoDB** |
|---|---|
| 資料有複雜的關聯（JOIN、外鍵）| 資料結構簡單，以 key 查詢 |
| 需要複雜的 SQL 查詢 | 需要超高吞吐量、超低延遲 |
| 現有應用程式用 SQL | 無固定 Schema（彈性資料結構）|
| 財務、訂單、人事系統 | 用戶偏好、購物車、遊戲排行榜、IoT |

> 類比：RDS 是 Excel 試算表（有固定欄位、可以 VLOOKUP）；DynamoDB 是 JSON 的便利貼牆（每張便利貼格式可以不同，但找起來靠固定的 Key）。

---

## 5. Amazon Redshift（Data Warehouse）⭐⭐

### 是什麼？

**Amazon Redshift** 是 AWS 的**受管資料倉儲（Data Warehouse）**服務，專為**大規模分析查詢**設計。

- 使用**Column-based（欄位式）**儲存，適合聚合查詢（SUM、AVG、GROUP BY）
- 可查詢 PB 等級的資料
- 與 S3 整合（可直接查詢 S3 資料）
- **不適合** OLTP（頻繁的單筆資料新增、修改）

> **考試提示**：題目出現「Business Intelligence（BI）」、「Historical data analysis」、「Data warehouse」→ **Redshift**

---

## 6. Amazon ElastiCache⭐⭐

### 是什麼？

**Amazon ElastiCache** 是 AWS 的**受管記憶體內快取（In-Memory Cache）**服務，用來加速資料庫查詢。

- 支援 **Redis** 和 **Memcached** 兩種引擎
- 常見用途：把熱門的資料庫查詢結果快取在記憶體中，下次直接從記憶體回傳，跳過資料庫

> 類比：餐廳的外場服務生，把點菜最多的菜預先備好放在出菜台，客人一點立刻端出去，不用每次都跑去廚房。

---

## 7. Amazon DynamoDB Accelerator（DAX）

- 專為 **DynamoDB** 設計的**記憶體快取層**
- 把 DynamoDB 的個位數毫秒回應，進一步加速到**微秒（microseconds）**
- 適合：極端高讀取量的場景

> 差別記憶：**ElastiCache** = 給 RDS 等 SQL 資料庫的快取；**DAX** = 專屬 DynamoDB 的快取。

---

## 8. 其他資料庫服務

| 服務 | 類型 | 適合情境 |
|---|---|---|
| **Amazon DocumentDB** | Document DB（相容 MongoDB）| JSON 文件儲存、內容管理 |
| **Amazon Neptune** | Graph DB（圖資料庫）| 社交網絡、知識圖譜、詐欺偵測 |
| **Amazon QLDB** | Ledger DB（不可竄改帳本）| 金融交易記錄、供應鏈稽核 |
| **Amazon Timestream** | Time-series DB（時間序列）| IoT 感測器數據、監控指標 |
| **Amazon Keyspaces** | Wide-column（相容 Cassandra）| 高吞吐量時間序列應用 |

> **考試提示**：這些服務考試較少出現細節，但若題目描述「圖關係」→ Neptune；「不可竄改記錄」→ QLDB；「MongoDB 相容」→ DocumentDB。

---

## 9. Amazon DMS（Database Migration Service）⭐⭐

### 是什麼？

**AWS DMS** 協助你將資料庫**遷移到 AWS**，過程中原有的來源資料庫仍可持續運作（最小化停機時間）。

### 兩種遷移模式

- **Homogeneous Migration（同質遷移）**：來源和目標是同樣的資料庫引擎（如 MySQL → RDS MySQL），直接遷移
- **Heterogeneous Migration（異質遷移）**：不同引擎（如 Oracle → Aurora PostgreSQL），需先用 **AWS Schema Conversion Tool（SCT）** 轉換 Schema，再用 DMS 遷移資料

### 其他用途

- 開發與測試時複製正式環境資料到測試環境
- 將資料持續複製到 Redshift 做分析（CDC，Change Data Capture）
- 合併多個資料庫

---

## 10. 資料庫選擇決策指南

```
你的需求是...

├─ 關聯式資料庫（SQL，有 JOIN、外鍵）？
│   ├─ 需要最高效能與高可用性，預算充足？
│   │   → Amazon Aurora
│   └─ 標準關聯式 DB，熟悉 MySQL / PostgreSQL / Oracle？
│       → Amazon RDS
│
├─ 需要極低延遲、超高吞吐量、無固定 Schema？
│   → Amazon DynamoDB
│       ├─ 需要更快（微秒）？→ DAX
│
├─ 分析大量歷史資料、BI 報表、Data Warehouse？
│   → Amazon Redshift
│
├─ 加速現有資料庫的讀取查詢？
│   → Amazon ElastiCache（Redis / Memcached）
│
├─ JSON 文件 / MongoDB 相容？
│   → Amazon DocumentDB
│
└─ 圖關係（社交、詐欺偵測）？
    → Amazon Neptune
```

---

## 11. 考試重點整理 Exam Tips

- **RDS** = 受管關聯式 DB，支援 MySQL、PostgreSQL、Aurora、Oracle 等 6 種引擎
- **RDS Multi-AZ** = 高可用性（HA）備援，Standby 不提供讀取；**Read Replica** 才是分散讀取流量
- **Aurora** = 比 RDS 更快、自動 6 份副本、最高 128 TB、相容 MySQL / PostgreSQL
- **DynamoDB** = Serverless NoSQL，個位數毫秒延遲，無需管理伺服器
- **Redshift** = 資料倉儲，PB 等級分析，Column-based，不是 OLTP
- **ElastiCache** = 記憶體快取，加速 SQL 資料庫；**DAX** = 專屬 DynamoDB 的快取
- **DMS** = 資料庫遷移服務，來源 DB 可持續運作，最小化停機

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 7 | CLF-C02*
