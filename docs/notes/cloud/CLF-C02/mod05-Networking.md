---
sidebar_position: 6
title: "Module 05: Networking"
---

# Module 5：Networking（網路）

> 本模組的核心是 **Amazon VPC**——你在 AWS 上的私有隔離網路空間。理解 VPC 的結構，以及流量進出的各種「閘道」，是 CLF-C02 的高頻考點。

---

## 1. Amazon VPC（Virtual Private Cloud）⭐⭐⭐

### 是什麼？

**Amazon VPC** 讓你在 AWS 雲端中建立一個**邏輯隔離的私有網路**，就像你在自己的資料中心裡建立一段私有網路一樣。

> 類比：AWS 的全部資源是一棟大樓，VPC 是你在這棟大樓裡租下的一整層樓，其他人進不來，你自己決定裡面的隔間與門禁規則。

- 每個 AWS 帳號在每個 Region 都會有一個預設的 **Default VPC**
- 你可以自行建立多個 VPC，並自定義 IP 範圍（CIDR block）
- VPC 存在於單一 Region，但可以跨越該 Region 內的多個 AZ

---

## 2. Subnets（子網路）⭐⭐⭐

### 什麼是 Subnet？

**Subnet** 是 VPC 內部的**分區**，讓你把資源分類放置在不同的網路區段。每個 Subnet 存在於單一個 AZ 內。

### Public Subnet vs Private Subnet

| | **Public Subnet** | **Private Subnet** |
|---|---|---|
| 是否可從 Internet 存取 | ✅ 是 | ❌ 否 |
| 適合放的資源 | Web servers、Load Balancer | Databases、Application servers、Backend |
| 需要的閘道 | Internet Gateway | NAT Gateway（如需對外）|

> 類比：Public Subnet 是辦公室的前台，任何人都能進來；Private Subnet 是後台機房，只有內部人員能進入。

### 典型的三層架構（Three-Tier Architecture）

```
Internet
    ↓
[Public Subnet]   → Load Balancer（ELB）
    ↓
[Private Subnet]  → Application servers（EC2）
    ↓
[Private Subnet]  → Databases（RDS）
```

只有最前面的 Load Balancer 暴露在外，其餘層都藏在 Private Subnet 裡，大幅降低攻擊面。

---

## 3. 網路閘道 Network Gateways

### 3.1 Internet Gateway（IGW）⭐⭐⭐

- 讓 **VPC 內的資源可以存取公開的 Internet**（雙向）
- 類比：VPC 這棟樓的**大門**，連接外面的街道（Internet）
- 沒有 IGW，Public Subnet 裡的 EC2 也無法對外通訊

### 3.2 NAT Gateway（Network Address Translation）

- 讓 **Private Subnet 內的資源可以主動發出請求到 Internet**，但 Internet 無法主動連進來
- 用途：讓 Private Subnet 的 EC2 可以下載軟體更新，但外部無法直接存取這台機器
- 類比：單向的旋轉門——你可以從裡面推出去，但外面的人推不進來
- NAT Gateway 本身放在 **Public Subnet** 中

```
Private EC2 → NAT Gateway（Public Subnet）→ Internet Gateway → Internet
                                         ↑
                          外部 Internet 無法反向連回 Private EC2
```

### 3.3 Virtual Private Gateway（VGW）⭐⭐

- 建立從企業本地網路（On-Premises）到 VPC 的 **VPN 加密通道**
- 流量走的仍是公共 Internet，但透過加密保護
- 適合：中小型企業、預算有限、可接受一定程度的 Internet 延遲與頻寬限制

### 3.4 AWS Direct Connect⭐⭐

- 建立從企業本地網路到 AWS 的**專用實體私有光纖連線**，完全不走公共 Internet
- 優點：更低延遲、更穩定頻寬、更高安全性
- 缺點：建置時間長（需要向電信業者申請）、費用較高
- 適合：金融業、大型企業、有嚴格頻寬與安全要求的組織

### VGW vs Direct Connect 比較

| | **Virtual Private Gateway（VPN）** | **AWS Direct Connect** |
|---|---|---|
| 走的網路 | 公共 Internet（加密）| 專用私有線路 |
| 延遲 | 較高（受 Internet 影響）| 低且穩定 |
| 頻寬 | 受 Internet 限制 | 高且一致 |
| 建置速度 | 快（幾小時內）| 慢（需數週～數月）|
| 費用 | 較低 | 較高 |
| 適合 | 一般混合雲連線 | 高流量、低延遲、合規需求 |

> **考試提示**：題目出現「穩定頻寬」、「低延遲」、「不走 Internet」→ **Direct Connect**；「快速建立 VPN」→ **Virtual Private Gateway**

---

## 4. 網路安全 Network Security ⭐⭐⭐

這是 CLF-C02 最容易失分的考點，因為 Security Groups 與 Network ACLs 非常相似但關鍵不同。

### 4.1 Security Groups（安全群組）

- 作用在 **EC2 instance 層級**（或更精確說：ENI 網路介面層級）
- **Stateful（有狀態）**：如果某個 inbound 請求被允許進來，其 response 流量自動被允許出去，不需額外設規則
- 預設行為：
  - **Inbound**：全部 Deny（預設拒絕所有進入流量）
  - **Outbound**：全部 Allow（預設允許所有出去流量）
- 只能設定 **Allow** 規則，無法設定 Deny 規則
- 一個 EC2 可以套用多個 Security Group

> 類比：EC2 門口的**保全人員**，主動核對名單，只讓名單上的人進來；有人進去後，他也會讓同一個人出來（有記憶）。

### 4.2 Network ACLs（NACL，網路存取控制清單）⭐⭐⭐

- 作用在 **Subnet 層級**，是 Subnet 的邊界防火牆
- **Stateless（無狀態）**：Inbound 和 Outbound 規則完全獨立，即使 Inbound 允許進來，Outbound 也要單獨設規則才能出去
- 預設行為：
  - Default NACL：允許所有 Inbound 和 Outbound 流量
  - Custom NACL：預設拒絕所有流量，需逐條設定
- 可以設定 **Allow 和 Deny** 規則
- 規則有**編號順序**，從小到大依序比對，第一條符合即套用

> 類比：Subnet 入口的**旋轉柵門**，不認人只看通行證規則，而且進門和出門各有一套規則，彼此不互通（沒有記憶）。

### Security Group vs NACL 比較 ⭐⭐⭐

| 比較項目 | **Security Group** | **Network ACL（NACL）** |
|---|---|---|
| 作用層級 | EC2 instance 層級 | Subnet 層級 |
| 狀態 | **Stateful**（有狀態）| **Stateless**（無狀態）|
| 規則類型 | 只有 Allow | Allow 和 **Deny** |
| 預設（新建）| Inbound 全拒，Outbound 全允 | 全拒（Custom）/ 全允（Default）|
| 規則評估 | 所有規則一起評估 | 按編號順序，第一符合即套用 |
| 適用資源 | 單一 EC2（或 ENI）| 整個 Subnet |

> **記憶技巧**：
> - Security Group = **SG = Stateful Guard**（有狀態的保全）
> - NACL = **無記憶的柵門**（進出要分開放行）

---

## 5. 流量路徑完整圖

一個 HTTP 請求從 Internet 到 Private Subnet 資料庫，沿途要通過哪些關卡：

```
Internet
    ↓
Internet Gateway（IGW）
    ↓
Network ACL（Subnet 邊界，Stateless）
    ↓
[Public Subnet] Load Balancer
    ↓  Security Group（ELB 的 SG，Stateful）
    ↓
Network ACL（Private Subnet 邊界，Stateless）
    ↓
[Private Subnet] EC2 Application Server
    ↓  Security Group（EC2 的 SG，Stateful）
    ↓
[Private Subnet] RDS Database
       Security Group（RDS 的 SG，Stateful）
```

> **重點**：NACL 是 Subnet 的圍牆，Security Group 是每棟建築的門鎖，兩道防線互補。

---

## 6. VPC Peering

### 是什麼？

**VPC Peering** 讓兩個 VPC 之間可以用**私有 IP 直接通訊**，彷彿在同一個網路裡。

- 可以是同帳號內的兩個 VPC，也可以跨不同 AWS 帳號或不同 Region
- 流量不走 Internet，走 AWS 私有骨幹
- **不具傳遞性（Non-transitive）**：A peering B、B peering C，但 A 不能透過 B 直接連到 C，需要另外建立 A-C 的 peering

---

## 7. AWS PrivateLink

### 是什麼？

**AWS PrivateLink** 讓你透過 VPC 的私有 IP 安全地存取 AWS 服務或其他 AWS 帳號的服務，**完全不需要 Internet Gateway、NAT Gateway 或公開 IP**。

- 類比：不用走大馬路，直接從地下通道連到目的地
- 適合：需要高安全性、不希望流量暴露在 Internet 的場景

---

## 8. 考試重點整理 Exam Tips

- **VPC** = AWS 上你的私有隔離網路，跨越一個 Region 但可跨多個 AZ
- **Public Subnet** 有 Internet Gateway → 可被 Internet 存取；**Private Subnet** 沒有
- **NAT Gateway** = 讓 Private Subnet 主動對外，但外部無法主動進來（放在 Public Subnet）
- **Internet Gateway vs Virtual Private Gateway**：前者連 Internet，後者連 On-Premises（VPN）
- **Direct Connect** = 專用私有線路，不走 Internet，低延遲高穩定，適合高流量企業
- **Security Group = Stateful**（有記憶，response 自動放行）；**NACL = Stateless**（進出各自設規則）
- Security Group 只能 Allow；NACL 可以 Allow **和 Deny**
- Security Group 作用於 **instance 層級**；NACL 作用於 **subnet 層級**

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 5 | CLF-C02*
