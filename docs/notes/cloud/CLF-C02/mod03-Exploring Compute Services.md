---
sidebar_position: 4
title: "Module 03: Exploring Compute Services"
---

# Module 3：Exploring Compute Services

> EC2 是「租一台虛擬機器，你負責裡面所有的事」。本模組探索其他運算服務——從容器到 Serverless，讓你用更少的管理負擔，完成更多的事。

---

## 1. 運算服務全景

在選擇運算服務之前，先理解一個光譜：

```
你管得越多 ←————————————————————————→ AWS 管得越多
   EC2          ECS / EKS         Lambda
（自己管 OS）  （管容器）       （只管程式碼）
```

越往右走，你負責的基礎設施越少，但相對地彈性也會受到一些限制。

---

## 2. Serverless 無伺服器運算

### 什麼是 Serverless？

**Serverless** 並不是真的沒有伺服器，而是「**你不需要管伺服器**」。
伺服器的佈建、擴展、維護全部交給 AWS，你只需要專注在寫程式碼。

> 類比：你去餐廳點餐，廚房存在，但你不需要管廚房的設備、瓦斯費、清潔——那都是餐廳的事。

---

## 3. AWS Lambda ⭐⭐⭐

### 是什麼？

**AWS Lambda** 是 AWS 的 Serverless 運算服務，讓你執行程式碼**而不需要佈建或管理伺服器**。

### 運作方式

1. 你上傳程式碼到 Lambda（稱為 **Lambda function**）
2. 設定一個 **Trigger（觸發器）**（例如：HTTP 請求、S3 檔案上傳、DynamoDB 資料變更）
3. 當 Trigger 被觸發，Lambda 自動執行程式碼
4. 執行完畢後資源自動釋放

### 計費方式

- **只為實際執行的時間付費**（以毫秒計算）
- 沒有執行就不收錢，不像 EC2 開著就一直計費

### 限制

- 最長執行時間：**15 分鐘**（適合短暫、事件驅動的工作）
- 不適合長時間運行的任務（那就用 EC2 或 ECS）

### 適合情境

- 上傳圖片後自動產生縮圖
- API backend（搭配 API Gateway）
- 定時執行的排程任務（如每天備份）
- 回應 IoT 感測器事件
- 資料串流處理

> **考試提示**：題目出現「不需要管理伺服器」、「事件驅動」、「只在被觸發時才執行」→ **Lambda**

---

## 4. 容器服務 Container Services

### 先理解：什麼是 Container？

**Container（容器）**是一種打包程式碼及其所有相依套件的方式，確保應用程式在任何環境下都能一致地執行。

- **VM（虛擬機器）**：模擬整台電腦，包含 OS（較重）
- **Container**：共享主機 OS，只打包應用程式與相依套件（較輕量）

> 類比：VM 是把整個廚房搬走，Container 是只帶食材和食譜——到哪裡都能煮出一樣的菜。

容器的代表工具：**Docker**（最流行的容器化平台）

### 容器化的優點

- **Portability**（可攜性）：在任何環境執行結果一致（dev、staging、production）
- **Efficiency**（效率）：比 VM 更輕量，啟動更快
- **Scalability**（可擴展）：可快速複製多個 container 來應對流量

---

## 5. Amazon ECS（Elastic Container Service）⭐⭐

### 是什麼？

**Amazon ECS** 是 AWS 自家的 Container Orchestration（容器編排）服務，幫你管理多個 Docker container 的部署、擴展與運行。

- 你定義「Task Definition」（要跑哪個 container image、需要多少 CPU/Memory）
- ECS 負責在背後排程與管理這些 container

### 適合情境

- 你的應用程式已容器化（Dockerized）
- 需要管理多個 container 的生命週期
- 想用 AWS 原生工具，不想學 Kubernetes

---

## 6. Amazon EKS（Elastic Kubernetes Service）⭐⭐

### 是什麼？

**Amazon EKS** 是 AWS 的 Managed Kubernetes 服務。

**Kubernetes（K8s）** 是一個開源的 container orchestration 平台，功能強大但複雜。EKS 幫你管理 Kubernetes 的 Control Plane，省去自行架設維護的麻煩。

### ECS vs EKS

| | **Amazon ECS** | **Amazon EKS** |
|---|---|---|
| 底層技術 | AWS 自家 | Kubernetes（開源標準）|
| 學習曲線 | 較低 | 較高 |
| 跨雲可攜性 | 無（AWS 專屬）| 高（K8s 各雲通用）|
| 適合 | 中小型、AWS 原生團隊 | 大型、已有 K8s 經驗的團隊 |

> **考試提示**：兩者都是 container orchestration，差別在底層是 AWS 自家 vs Kubernetes。

---

## 7. AWS Fargate ⭐⭐⭐

### 是什麼？

**AWS Fargate** 是用於 ECS 和 EKS 的 **Serverless 運算引擎**。

用白話說：ECS / EKS 需要你選擇並管理「跑在哪些 EC2 上」，Fargate 幫你把這件事也省掉——你只要告訴 AWS「我要跑這個 container」，底層機器的事完全不用管。

### Fargate 解決的問題

```
沒有 Fargate：你 → 定義 container → 還要管底層 EC2 cluster
有了 Fargate：你 → 定義 container → AWS 自動處理底層一切
```

### 適合情境

- 想用 container 但不想管 EC2
- 工作負載不固定，想要 Serverless 的彈性計費

> **記憶口訣**：Fargate = Container 的 Serverless 版本

---

## 8. AWS Elastic Beanstalk

### 是什麼？

**AWS Elastic Beanstalk** 是一個 **PaaS（Platform as a Service）** 服務，讓你只需上傳程式碼，AWS 自動處理：
- EC2 佈建
- Load balancing 設定
- Auto Scaling 設定
- 應用程式健康監控

### 特色

- 支援多種語言與框架：Java、Python、Node.js、PHP、Ruby、Go、.NET、Docker
- 你仍然可以看到並控制底層的 EC2、ELB 等資源（只是 AWS 幫你自動設定）
- 適合「想快速部署，但又不想學太多 AWS 細節」的情境

### 與 Lambda 的比較

| | **Lambda** | **Elastic Beanstalk** |
|---|---|---|
| 模型 | Function（函式）| Application（應用程式）|
| 執行時間 | 最長 15 分鐘 | 無限制 |
| 管理負擔 | 最低 | 中等 |
| 適合 | 事件驅動、短暫任務 | Web 應用程式、API |

---

## 9. Amazon Lightsail

### 是什麼？

**Amazon Lightsail** 是 AWS 的簡化版 VPS（Virtual Private Server）服務，提供固定月費、預設配置的虛擬機器，主打**簡單易用**。

- 適合：個人網站、部落格（WordPress）、小型應用程式
- 不適合：需要高度客製化或大規模擴展的生產環境
- 可視為「EC2 的入門版」，不需要了解 AWS 複雜的設定

---

## 10. AWS Batch

### 是什麼？

**AWS Batch** 讓你在 AWS 上高效執行大規模 **Batch computing（批次運算）** 工作。

- 自動佈建最佳數量與類型的運算資源
- 把大量的 Batch jobs 排入佇列，按優先順序執行
- 適合：基因分析、影像渲染、財務模型、大規模資料轉換

> **與 Lambda 的差異**：Lambda 適合快速、短暫的任務（最長 15 分鐘）；Batch 適合長時間、大量的運算工作（無時間限制）。

---

## 11. 服務選擇決策樹 How to Choose

考試常見的情境判斷邏輯：

```
你的工作負載是...

├─ 事件驅動、執行時間短（< 15 min）、不想管伺服器？
│   → AWS Lambda

├─ 容器化應用程式？
│   ├─ 不想管底層 EC2？
│   │   → AWS Fargate（搭配 ECS 或 EKS）
│   ├─ 想用 AWS 原生方案管理 container cluster？
│   │   → Amazon ECS
│   └─ 已有 Kubernetes 經驗或需要跨雲可攜？
│       → Amazon EKS
│
├─ Web 應用程式，想快速部署不管底層細節？
│   → AWS Elastic Beanstalk
│
├─ 長時間、大量的批次運算？
│   → AWS Batch
│
├─ 需要完整控制 OS、網路、自訂配置？
│   → Amazon EC2（回 Module 2）
│
└─ 簡單的個人網站 / 部落格，固定月費？
    → Amazon Lightsail
```

---

## 12. 考試重點整理 Exam Tips

- **Lambda** 的關鍵詞：Serverless、event-driven（事件驅動）、no server management、最長 15 分鐘
- **Fargate** = 讓你執行 container 而**不需要管理底層 EC2**，可搭配 ECS 或 EKS
- **ECS vs EKS**：功能類似，差別在 ECS 是 AWS 自家、EKS 是 Kubernetes（開源）
- **Elastic Beanstalk** = PaaS，上傳程式碼就好，底層 AWS 幫你搞定，但你仍然擁有底層資源
- **Lightsail** = 簡化的 EC2，固定月費，適合初學者與小型網站
- **Batch** = 專為長時間批次運算設計，不受 15 分鐘限制

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 3 | CLF-C02*
