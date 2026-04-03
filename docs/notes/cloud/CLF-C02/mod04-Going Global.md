---
sidebar_position: 5
title: "Module 04: Going Global"
---

# Module 4：Going Global（全球基礎設施）

> Module 1 的「Six Advantages」最後一條是「Go global in minutes」。本模組解釋 AWS 如何辦到這件事：靠的是遍布全球的 **Regions、Availability Zones、Edge Locations** 三層架構。

---

## 1. AWS 全球基礎設施三層架構

由大到小，三個層級：

```
┌─────────────────────────────┐
│         Region              │  ← 地理區域（如：東京、首爾、維吉尼亞）
│  ┌────────┐  ┌────────┐     │
│  │   AZ   │  │   AZ   │ ... │  ← 一個 Region 內有多個獨立資料中心群
│  └────────┘  └────────┘     │
└─────────────────────────────┘
        ↕  (透過高速私有網路連接)
  Edge Locations               ← 散佈全球，用於快取與加速內容傳遞
```

---

## 2. Regions（地理區域）⭐⭐⭐

### 什麼是 Region？

**Region** 是 AWS 在全球部署資料中心的**地理區域單位**，例如：
- `us-east-1`（美國東部，維吉尼亞）
- `ap-northeast-1`（亞太區東北，東京）
- `ap-northeast-3`（亞太區，大阪）

每個 Region 彼此**完全獨立**，資料不會自動跨 Region 複製。

### 如何選擇 Region？四大考量因素 ⭐⭐⭐

這是必考的選擇題，記住這四個因素與其優先順序：

#### ① Compliance（法規合規）— 優先順序最高
- 某些國家或產業法規要求資料必須存放在特定地理區域內
- 例如：歐盟 GDPR 要求歐洲用戶資料不得離開歐盟，就必須選歐洲的 Region
- **這個因素沒得商量，法規說在哪就在哪**

#### ② Proximity to customers（地理接近性）
- 選擇距離主要用戶最近的 Region，降低 **Latency（延遲）**
- 例如：用戶主要在台灣、日本，選 `ap-northeast-1`（東京）通常比選美東快

#### ③ Available services（服務可用性）
- 不是每個 Region 都有所有的 AWS 服務，新服務通常先在美東上線，再陸續推到其他 Region
- 若你要用某個特定服務，要先確認該 Region 是否支援

#### ④ Pricing（定價）
- 同樣的 EC2 instance，在不同 Region 的費用可能不同（受當地稅率、電力成本影響）
- 例如：巴西的 Region 費用通常比美東貴
- **優先順序最低**，通常只有在其他因素相同時才參考

> **記憶口訣**：**C-P-A-P**（Compliance → Proximity → Availability → Pricing）優先順序由高到低

---

## 3. Availability Zones（AZ，可用區域）⭐⭐⭐

### 什麼是 AZ？

**Availability Zone（AZ）** 是一個 Region 內**一個或多個獨立的實體資料中心**。

關鍵特性：
- 每個 Region 通常包含 **3 個以上**的 AZ（最少 2 個）
- 各 AZ 之間有足夠的**物理距離**（隔離自然災害），但又夠近到可以**低延遲互連**
- 各 AZ 有獨立的電力、冷卻、實體安全設施

### 為什麼 AZ 重要？High Availability

> 類比：不要把雞蛋放在同一個籃子裡。

如果你的 EC2 只跑在一個 AZ 裡，那個資料中心發生火災或淹水，服務就全停了。
將服務**部署到多個 AZ**，一個 AZ 故障，其他 AZ 繼續運作——這就是 **High Availability（高可用性）** 的基礎。

```
✗ 差的架構：全部 EC2 在同一個 AZ
            → 單點故障（Single Point of Failure）

✓ 好的架構：EC2 分散在 AZ-1a、AZ-1b、AZ-1c
            + ELB 分配流量 + Auto Scaling
            → Multi-AZ deployment，任一 AZ 故障不影響服務
```

> **考試提示**：AWS 的 Best Practice 是「**至少部署在兩個 AZ**」，許多 AWS 受管服務（如 RDS Multi-AZ）預設就是跨 AZ 的。

---

## 4. Edge Locations（邊緣節點）⭐⭐

### 什麼是 Edge Location？

**Edge Locations** 是分散在全球各城市的**內容快取節點**，數量遠多於 Region（目前超過 400+ 個 PoP），地點包含許多 Region 所沒有覆蓋的城市。

用途：把內容（圖片、影片、靜態檔案）快取到離用戶最近的地方，讓用戶不必每次都連回原始 Region，大幅降低延遲。

### 與 AZ 的差異

| | **Availability Zone** | **Edge Location** |
|---|---|---|
| 目的 | 執行 Workloads（運算、資料庫）| 快取與加速內容傳遞 |
| 數量 | 少（數十個 Region × 3+ AZ）| 多（400+ 個 PoP 遍布全球）|
| 主要服務 | EC2、RDS、Lambda... | CloudFront、Route 53 |

---

## 5. Amazon CloudFront（CDN）⭐⭐⭐

### 是什麼？

**Amazon CloudFront** 是 AWS 的 **CDN（Content Delivery Network，內容傳遞網路）**，利用全球的 Edge Locations 快取並加速內容傳遞。

### 運作方式

1. 用戶請求某個檔案（例如網頁圖片）
2. 請求被導向**最近的 Edge Location**
3. 若該 Edge Location 有快取 → 直接回傳（**Cache Hit**，速度極快）
4. 若沒有快取 → 從 **Origin**（S3、EC2、自訂伺服器）取得並快取 → 回傳給用戶
5. 下次有人從同一 Edge Location 要同樣檔案，直接從快取給

```
用戶（台灣）→ 東京 Edge Location（快取命中）→ 幾毫秒回應
     vs
用戶（台灣）→ 直接連美東 Origin → 幾百毫秒回應
```

### CloudFront 的好處

- 降低延遲（Reduce Latency）
- 降低 Origin Server 的負載
- 內建 DDoS 防護（整合 **AWS Shield Standard**）
- 支援動態與靜態內容

> **考試提示**：題目出現「降低全球用戶的延遲」、「加速靜態內容傳遞」→ **CloudFront**

---

## 6. Amazon Route 53（DNS 服務）⭐⭐

### 是什麼？

**Amazon Route 53** 是 AWS 的 **Managed DNS（Domain Name System）服務**。

DNS 的工作：把人類看得懂的網址（`www.example.com`）翻譯成電腦用的 IP 位址（`203.0.113.1`）。

> 類比：DNS 就像電話簿，你查「王小明」，電話簿告訴你他的電話號碼。

### Route 53 的路由策略

Route 53 不只是翻譯網址，還能根據策略智慧地導流量：

| 路由策略 | 說明 |
|---|---|
| **Latency-based routing** | 把用戶導向延遲最低的 Region |
| **Geolocation routing** | 根據用戶地理位置導流（如：台灣用戶 → 東京）|
| **Failover routing** | 主要端點故障時自動切換到備援端點 |
| **Weighted routing** | 按比例分配流量（如：90% 導到 v1，10% 導到 v2）|

> **為什麼叫 Route "53"？** DNS 使用的標準 port 號是 53。

---

## 7. AWS Outposts

### 是什麼？

**AWS Outposts** 是 AWS 將其硬體機架（rack）**直接安裝在你的本地資料中心**，讓你在自己的機房裡使用 AWS 的服務與 API。

- 適合：有嚴格法規要求資料不能離開特定物理地點的企業
- 你用的是跟 AWS 雲端一樣的 API，但資料留在你的機房
- 這是 **Hybrid Cloud** 架構的具體實現方式之一

> 類比：AWS 把一個「迷你雲端」搬到你家，但還是用 AWS 的介面操作。

---

## 8. AWS Local Zones

### 是什麼？

**AWS Local Zones** 是 AWS 在大都市區部署的**延伸基礎設施**，提供個位數毫秒的超低延遲。

- 不是完整的 Region，但提供部分 AWS 服務（EC2、EBS、RDS 等）
- 適合：需要超低延遲的應用，如即時遊戲、影片串流製作、AR/VR

> **與 Edge Locations 的差異**：Local Zones 可以直接運行 compute/storage workloads；Edge Locations 主要用於快取。

---

## 9. 全球服務 vs 區域服務

考試需要知道哪些服務是 **Global**（全球唯一），哪些是 **Regional**（每個 Region 各自獨立）：

| 範疇 | 代表服務 |
|---|---|
| **Global** | IAM、Route 53、CloudFront、AWS WAF |
| **Regional** | EC2、S3、RDS、VPC、Lambda |
| **AZ 層級** | EC2 instance、EBS Volume、Subnet |

> **記憶要點**：IAM 是 Global 的！你建立一個 IAM user，在所有 Region 都能用。S3 雖然顯示在某個 Region，但 bucket name 是全球唯一的。

---

## 10. 考試重點整理 Exam Tips

- **Region 選擇四因素**：Compliance（最優先）→ Proximity → Available services → Pricing（最低）
- **AZ**：每個 Region 至少 2 個（通常 3 個以上），各自實體獨立，Low-latency 互連
- **Best Practice**：服務部署在多個 AZ，避免 Single Point of Failure
- **Edge Locations**：數量遠多於 AZ，用於 CloudFront 快取，不是用來跑 EC2 的
- **CloudFront**：CDN 服務，利用 Edge Locations 快取內容，降低延遲
- **Route 53**：AWS 的 DNS 服務，支援多種路由策略（Latency、Geolocation、Failover 等）
- **Outposts**：AWS 把硬體搬進你的機房，實現 Hybrid Cloud
- **IAM、Route 53、CloudFront** 是 Global 服務，**EC2、RDS、VPC** 是 Regional 服務

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 4 | CLF-C02*
