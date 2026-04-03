---
sidebar_position: 3
title: "Module 02: Compute in the Cloud"
---

# Module 2：Compute in the Cloud

> 本模組聚焦 AWS 最核心的運算服務：**Amazon EC2**，涵蓋執行個體類型、定價模型、Auto Scaling 與負載平衡。

---

## 1. 什麼是 Amazon EC2？

**Amazon EC2（Elastic Compute Cloud）** = 雲端上的虛擬伺服器（Virtual Machine）。

### 它如何運作？

傳統買實體伺服器的問題：採購 → 等待到貨 → 安裝 → 設定，可能要數週甚至數月。EC2 透過**虛擬化（Virtualization）**在幾分鐘內啟動一台完整的伺服器。

底層概念：
- 一台實體主機（Host）上運行多個 **EC2 instances**（虛擬機器）
- 每個 instance 有自己的 OS、CPU、RAM、Storage
- **Hypervisor** 負責在各 instance 之間共享硬體資源，並確保彼此隔離

EC2 的 "Elastic" 代表什麼？
→ 容量可以彈性調整：需要更多就加，不需要就關掉，按用量計費。

---

## 2. EC2 Instance Types（執行個體類型）⭐⭐⭐

這是 CLF-C02 的必考題型。題目常給一個**工作情境**，要你選出最適合的 instance type。

記憶方法：先問自己「這個工作負載最需要的資源是什麼？」

### 2.1 General purpose（通用型）
- **特色**：Compute、Memory、Networking 資源均衡分配，沒有特別突出的一項
- **適合情境**：
  - Web servers（網頁伺服器）
  - Application servers（應用程式伺服器）
  - Small / medium databases
  - Code repositories（程式碼儲存庫）
  - Gaming servers（小型）
- **類比**：瑞士刀，什麼都能做，但沒有哪個特別強

### 2.2 Compute optimized（運算最佳化）
- **特色**：搭載高效能處理器，CPU 能力遠優於 Memory
- **適合情境**：
  - Batch processing workloads（批次處理）
  - High-performance web servers
  - High-performance computing（HPC）
  - Scientific modeling（科學模型計算）
  - Dedicated gaming servers（高負載遊戲）
- **類比**：只練手臂的健身狂，處理器超強

### 2.3 Memory optimized（記憶體最佳化）
- **特色**：超大 RAM，可在記憶體中處理大型資料集
- **適合情境**：
  - High-performance databases（高效能資料庫）
  - Real-time processing of large unstructured data（即時處理大型非結構化資料）
  - In-memory caches（如 Redis、Memcached）
  - Distributed memory caches
- **類比**：工作桌超大，可以同時攤開很多文件，不需要一直翻資料夾

### 2.4 Accelerated computing（加速運算）
- **特色**：使用硬體加速器（GPU、FPGA）處理特定計算任務
- **適合情境**：
  - Floating-point number calculations（浮點數運算）
  - Graphics processing（圖形處理）
  - Data pattern matching（資料模式比對）
  - Machine learning inference（機器學習推論）
  - Video streaming / encoding
- **類比**：請了一個專業繪圖師，某些事他做得比任何人都快，但換個任務他就沒優勢了

### 2.5 Storage optimized（儲存最佳化）
- **特色**：針對本地端儲存的高序列讀寫（High sequential read/write）設計，提供極高 IOPS（I/O operations per second）
- **適合情境**：
  - Data warehousing（資料倉儲）
  - High-frequency online transaction processing（OLTP）
  - Distributed file systems（分散式檔案系統）
  - Elasticsearch
- **類比**：一個速記員，手速極快，就是用來大量讀寫資料的

### 快速判斷卡 ⚡

| 工作情境關鍵字 | 對應 Type |
|---|---|
| balanced / web server / app server | **General purpose** |
| batch / HPC / gaming / CPU-intensive | **Compute optimized** |
| large dataset in memory / real-time / cache | **Memory optimized** |
| GPU / ML / graphics / floating-point | **Accelerated computing** |
| IOPS / data warehouse / OLTP / read-write | **Storage optimized** |

---

## 3. EC2 Pricing（定價選項）⭐⭐⭐

同樣是高頻考題。題目常描述一個**使用情境**，問哪種定價方式最省錢或最合適。

### 3.1 On-Demand
- 按用量計費，無需任何預付或長期承諾
- 按小時或秒計費（依 instance 類型而定）
- **適合情境**：
  - 無法預測的不規律工作負載
  - 短期測試、開發、實驗
  - 應用程式首次部署，尚不清楚用量

### 3.2 Reserved Instances（預留執行個體）
- 承諾使用 **1 年或 3 年**，換取最高 **72% 折扣**
- 付費方式三種：All Upfront（全額預付）、Partial Upfront、No Upfront
- 兩種類型：
  - **Standard Reserved Instances**：折扣高，但不能更改 instance 屬性
  - **Convertible Reserved Instances**：折扣稍低，但可以換不同的 instance family / OS
- **適合情境**：穩定、可預測的工作負載（如長期運行的資料庫、生產環境）

### 3.3 EC2 Instance Savings Plans
- 承諾特定**每小時費用**（以美元計），換取最高 **72% 折扣**
- 比 Reserved Instances 更靈活（不鎖定特定 instance type 或 Region）
- **適合情境**：有穩定用量但想要更彈性換機器的情境

### 3.4 Spot Instances
- 競標 AWS 未使用的 EC2 容量，最高享 **90% 折扣**
- 重要風險：**AWS 隨時可能中斷**（2 分鐘前會發出通知）
- **適合情境**：
  - 可容忍中斷的 Batch processing（批次處理）
  - Background jobs（背景工作）
  - Big data analytics
  - 不適合需要持續可用的工作負載

### 3.5 Dedicated Hosts（專用主機）
- 租用一台完全給你專用的**實體伺服器**，不與其他 AWS 客戶共享硬體
- 費用最高
- **適合情境**：有軟體授權（license）限制或法規合規（compliance）要求

### 定價選項快速比較

| 定價方式 | 承諾 | 折扣 | 適合情境 |
|---|---|---|---|
| **On-Demand** | 無 | 無 | 不規律、測試 |
| **Reserved** | 1 or 3 yr | 最高 72% | 穩定長期工作負載 |
| **Savings Plans** | 每小時費用承諾 | 最高 72% | 彈性的長期用量 |
| **Spot** | 無（隨時被中斷）| 最高 90% | 可容忍中斷的批次工作 |
| **Dedicated Hosts** | 按需或 1/3 yr | — | License 合規需求 |

> **記憶技巧**：Spot = 最便宜 but 不穩定，像跳蚤市場搶便宜貨，隨時可能被搶走。

---

## 4. Amazon EC2 Auto Scaling

### 為什麼需要 Auto Scaling？

想像一個電商網站：平日流量正常，但雙 11 購物節流量暴增 10 倍。靠人工手動加伺服器太慢，關了又浪費錢——**Auto Scaling** 就是解法。

### 兩種 Scaling 方向

- **Vertical scaling（垂直擴展 / Scale up & down）**：換更大或更小的 instance（換機器規格）
- **Horizontal scaling（水平擴展 / Scale out & in）**：增加或減少 instance 數量（加機器）

AWS 推薦優先考慮 **Horizontal scaling**，因為它不需要停機。

### Auto Scaling Group 設定

每個 Auto Scaling Group 有三個容量設定：

```
Minimum capacity  →  最少要保持幾台（確保基本可用性）
Desired capacity  →  正常情況下維持的台數
Maximum capacity  →  最多允許擴展到幾台（避免費用失控）
```

### 兩種 Auto Scaling 策略

- **Dynamic scaling**：根據即時需求自動回應（例如 CPU 使用率超過 70% 就自動加機器）
- **Predictive scaling**：根據歷史資料預測未來流量，提前預備（例如每天早上 9 點流量會高，提前 scale out）

---

## 5. Elastic Load Balancing（ELB）

### 為什麼需要 Load Balancer？

Auto Scaling 加了很多台機器，但流量要怎麼平均分配？靠 **Elastic Load Balancing（ELB）** 來當「交通指揮員」。

- 自動將 incoming 流量分散到多個 EC2 instances
- 如果某台 instance 掛掉，ELB 會停止把流量導過去
- 與 Auto Scaling 配合：新加入的 instance 自動被 ELB 納入流量分配

### ELB 的三種類型

| 類型 | 適合情境 |
|---|---|
| **Application Load Balancer（ALB）** | HTTP/HTTPS 流量，Layer 7，支援路徑路由（最常用） |
| **Network Load Balancer（NLB）** | TCP/UDP 流量，Layer 4，超低延遲、高效能 |
| **Gateway Load Balancer** | 第三方虛擬網路設備（防火牆、IDS 等） |

> **考試常考**：ELB 是 **Regional** 的服務，在同一個 Region 內自動實現 High Availability。

---

## 6. 訊息傳遞服務 Messaging Services

（支撐 Loosely Coupled 架構的關鍵）

### 為什麼要 Loosely Coupled？

Tightly coupled（緊耦合）架構：A 服務直接呼叫 B 服務，B 掛掉就整個崩潰。
Loosely coupled（鬆耦合）架構：A 服務把訊息丟到中間的佇列，B 慢慢處理，互不影響。

### Amazon SQS（Simple Queue Service）

- **Queue（佇列）模型**：訊息放入 Queue，由 Consumer 拉取並處理
- 訊息可暫存（預設保留 4 天，最多 14 天）
- **一個訊息只會被一個 Consumer 處理**（點對點）
- **適合情境**：訂單處理、任務排程、解耦微服務

### Amazon SNS（Simple Notification Service）

- **Pub/Sub（發布/訂閱）模型**：一個 Publisher 發布訊息，多個 Subscriber 同時收到
- 支援傳送到：SQS、Lambda、HTTP endpoint、Email、SMS
- **適合情境**：廣播通知、事件驅動架構、告警推送

### SQS vs SNS 比較

| | **SQS** | **SNS** |
|---|---|---|
| 模型 | Queue（佇列）| Pub/Sub（廣播）|
| 接收者 | 單一 Consumer | 多個 Subscribers |
| 訊息儲存 | 是（等待被拉取）| 否（即時推送）|
| 類比 | 收件匣 | 廣播電台 |

---

## 7. 考試重點整理 Exam Tips

- **Instance Type 判斷**：先找關鍵字（CPU密集？記憶體大？大量IOPS？GPU？），再對應類型
- **Spot Instances** 最便宜，但可被中斷，不適合要求持續可用的應用
- **Reserved Instances** 適合穩定長期工作負載，承諾 1 或 3 年換取折扣
- **Auto Scaling** 的核心是 Min / Desired / Max 三個容量參數
- **ELB + Auto Scaling** 是實現 High Availability 與 Fault Tolerance 的標準組合
- **SQS** = 佇列（一對一），**SNS** = 廣播（一對多）
- **Horizontal scaling** 比 Vertical scaling 更受 AWS 推薦（不需停機）

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 2 | CLF-C02*
