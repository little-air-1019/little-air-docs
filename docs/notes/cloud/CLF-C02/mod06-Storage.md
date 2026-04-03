---
sidebar_position: 7
title: "Module 06: Storage"
---

# Module 6：Storage（儲存）

> 儲存服務分三大類型：**Block Storage（區塊）、Object Storage（物件）、File Storage（檔案）**。選對類型是考試的核心，每種類型的代表服務各有適用情境。

---

## 1. 儲存類型概覽

| 類型 | 類比 | AWS 服務 |
|---|---|---|
| **Block Storage** | 電腦硬碟（每個 block 可獨立修改）| Amazon EBS |
| **Object Storage** | 倉庫裡的箱子（整個物件一起存取）| Amazon S3 |
| **File Storage** | 共享網路磁碟機（多人同時掛載）| Amazon EFS、FSx |

---

## 2. Amazon EBS（Elastic Block Store）⭐⭐⭐

### 是什麼？

**Amazon EBS** 是掛載在 EC2 上的**區塊儲存磁碟**，就像你電腦裡的硬碟。

- EC2 instance 的 OS、應用程式、資料庫檔案通常存在 EBS 上
- **只能掛載到同一個 AZ 的 EC2**（AZ 層級的服務）
- EC2 被終止後，EBS 預設**保留**（不會消失），資料持久存在

### Instance Store vs EBS

| | **Instance Store** | **Amazon EBS** |
|---|---|---|
| 儲存位置 | EC2 主機上的實體硬碟 | 獨立的網路儲存設備 |
| 持久性 | ❌ EC2 停止即消失（Ephemeral）| ✅ 持久保存 |
| 適合 | 暫存快取、Swap | OS、資料庫、應用程式資料 |

> **考試提示**：Instance Store 是「臨時的」，EC2 一關就沒了；EBS 是「持久的」，像外接硬碟。

### EBS Snapshots（快照）⭐⭐

- EBS 可以建立 **Snapshot（快照）**：某個時間點的磁碟備份
- Snapshot 儲存在 **S3**（背後自動處理）
- 可用 Snapshot 在不同 AZ 或 Region 之間複製資料

---

## 3. Amazon S3（Simple Storage Service）⭐⭐⭐

### 是什麼？

**Amazon S3** 是 AWS 的 **Object Storage（物件儲存）**服務。

- 儲存單位是 **Object（物件）**：每個物件 = 資料本身 + Metadata + 唯一的 Key
- 物件存放在 **Bucket（儲存貯體）** 中
- 單一物件最大支援 **5 TB**
- 儲存容量**無上限**
- 預設每個物件和 Bucket 都是**私有**的

### 適合存什麼？

- 靜態網站檔案（HTML、CSS、JS、圖片）
- 備份與封存
- 資料湖（Data Lake）的原始資料
- 影片、圖片等媒體檔案
- 應用程式日誌

> 類比：S3 是一個超大型倉庫，每個 Bucket 是一個房間，每個 Object 是貼了標籤的箱子。你找箱子靠的是標籤（Key），不是位置。

### ⚠️ S3 不適合的情境

- **不適合**當作 EC2 的系統磁碟（那是 EBS 的工作）
- **不適合**頻繁、局部修改的資料（Object Storage 要整個物件重寫）

---

## 4. S3 Storage Classes（儲存類別）⭐⭐⭐

不同的存取頻率，對應不同的儲存類別，費用差異懸殊。**選錯類別就等於浪費錢**，這是考試的高頻情境題。

### 4.1 S3 Standard
- **頻繁存取**的資料
- 99.999999999%（11 個 9）的 Durability（耐久性）
- 資料複製在**至少 3 個 AZ**
- 適合：網站圖片、常用資料、即時分析資料

### 4.2 S3 Standard-IA（Infrequent Access）
- **不常存取**，但需要時要能快速取得
- 存取費用比 Standard 高，但儲存費用更低
- 同樣跨 3 個 AZ 存放
- 適合：30 天以上不常用的備份、災難復原資料

### 4.3 S3 One Zone-IA
- 同 Standard-IA，但只存在**單一 AZ**
- 費用更低，但若該 AZ 故障，資料就消失了
- 適合：可以重新產生的備份、次要備份副本

### 4.4 S3 Intelligent-Tiering
- 不確定資料的存取模式時使用
- AWS **自動**根據存取頻率在 Frequent / Infrequent 之間移動物件
- 收取少量的監控費用，但省去人工管理的麻煩
- 適合：存取模式不固定或未知的資料

### 4.5 S3 Glacier Instant Retrieval
- 封存資料，但需要**毫秒級**取得（和 Standard 一樣快）
- 比 Standard-IA 更低的儲存費用
- 適合：每季才存取一次的醫療影像、新聞媒體資產

### 4.6 S3 Glacier Flexible Retrieval（原 S3 Glacier）
- 封存資料，取回時間：**1 分鐘至 12 小時**（可選擇取回速度）
- 費用極低
- 適合：一年存取 1-2 次的法規合規封存資料

### 4.7 S3 Glacier Deep Archive
- 費用**最低**的儲存類別
- 取回時間：**12 至 48 小時**
- 資料存在**至少 3 個 AZ**
- 適合：7-10 年以上的長期法規封存、幾乎不會再看的歷史資料

### 儲存類別快速比較

| Storage Class | 存取頻率 | 最低保存期 | 取回速度 | 費用趨勢 |
|---|---|---|---|---|
| Standard | 頻繁 | 無 | 即時 | 最高 |
| Standard-IA | 不常 | 30 天 | 即時 | ↓ |
| One Zone-IA | 不常 | 30 天 | 即時 | ↓（單 AZ 風險）|
| Intelligent-Tiering | 不定 | 無 | 即時 | 自動優化 |
| Glacier Instant | 極少 | 90 天 | 毫秒 | ↓ |
| Glacier Flexible | 極少 | 90 天 | 分鐘～小時 | ↓↓ |
| Glacier Deep Archive | 幾乎不 | 180 天 | 12-48 小時 | 最低 |

### S3 Lifecycle Policies（生命週期政策）

可以設定規則讓 S3 **自動**將物件移到更便宜的儲存類別，例如：
- 上傳後 30 天 → 移到 Standard-IA
- 上傳後 90 天 → 移到 Glacier Flexible Retrieval
- 上傳後 365 天 → 刪除

---

## 5. Amazon EFS（Elastic File System）⭐⭐

### 是什麼？

**Amazon EFS** 是 AWS 的 **Managed Network File System（受管網路檔案系統）**。

- 多個 EC2 instances 可以**同時掛載**同一個 EFS（NFS 協定）
- **自動擴展**：不需要預先設定容量，用多少長多少
- **跨 AZ**：一個 EFS 可以被多個 AZ 的 EC2 存取
- Linux-based（不支援 Windows）

> 類比：辦公室的共享磁碟機，所有人的電腦都能同時連上去存取同一批檔案。

### EBS vs EFS

| | **Amazon EBS** | **Amazon EFS** |
|---|---|---|
| 掛載方式 | 一次只掛一台 EC2（單點）| 多台 EC2 同時掛載（共享）|
| AZ 範圍 | 單一 AZ | 跨多個 AZ（Regional）|
| 擴展方式 | 手動調整大小 | 自動彈性擴展 |
| 作業系統 | Linux 和 Windows | Linux only |
| 類比 | 個人電腦的硬碟 | 辦公室共享磁碟機 |

---

## 6. Amazon FSx

### 是什麼？

**Amazon FSx** 是 AWS 的 Managed File System 服務，提供兩種主要選項：

- **FSx for Windows File Server**：完全相容 Windows 的共享檔案系統（SMB 協定），適合 Windows EC2
- **FSx for Lustre**：高效能平行檔案系統，適合機器學習、高效能運算（HPC）

> 簡單記法：EFS = Linux 的共享檔案系統；FSx for Windows = Windows 的共享檔案系統。

---

## 7. AWS Snow Family（實體資料遷移設備）⭐⭐

### 為什麼需要 Snow Family？

當資料量極大（PB 等級），透過網路傳輸需要數週甚至數月。Snow Family 是實體的儲存裝置，AWS 寄給你，你裝好資料後寄回去，AWS 再上傳到 S3。

> 類比：與其用水管把水運過去（網路傳輸），不如用卡車裝水桶（實體運輸）。

### 三種設備

| 設備 | 容量 | 特色 |
|---|---|---|
| **Snowcone** | 8 TB（HDD）/ 14 TB（SSD）| 最小，可放在背包裡，適合邊緣環境 |
| **Snowball Edge** | 80 TB（Storage Optimized）| 主流選擇，可在設備上執行 EC2 和 Lambda |
| **Snowmobile** | 最高 100 PB | 一整輛卡車，適合資料中心整體搬遷 |

> **考試提示**：題目出現「大量資料遷移」、「頻寬有限」、「離線環境」→ **AWS Snow Family**

---

## 8. 儲存服務選擇指南

| 需求 | 推薦服務 |
|---|---|
| EC2 的系統磁碟 / 資料庫 | **EBS** |
| 靜態檔案、備份、媒體、資料湖 | **S3** |
| 多個 EC2 共享的 Linux 檔案系統 | **EFS** |
| 多個 EC2 共享的 Windows 檔案系統 | **FSx for Windows** |
| 封存、長期保存、低存取頻率 | **S3 Glacier** |
| 大量資料離線遷移到 AWS | **Snow Family** |

---

## 9. 考試重點整理 Exam Tips

- **EBS**：單一 EC2 掛載，單一 AZ，持久儲存；Instance Store 才是臨時的
- **S3**：物件儲存，Bucket 全球唯一名稱，單一物件最大 5 TB，11 個 9 的 Durability
- **S3 Storage Classes 選擇邏輯**：存取越少 → 費用越低，但取回越慢、最低保存期越長
- **Intelligent-Tiering**：不確定存取模式時使用，AWS 自動幫你搬
- **Glacier Deep Archive**：最便宜，但等最久（12-48 小時）
- **EFS vs EBS**：共享多台 EC2 → EFS；單台 EC2 → EBS
- **Snow Family**：網路傳輸太慢時用實體設備，Snowmobile 是卡車等級（100 PB）

---

*參考來源：AWS Skill Builder – AWS Cloud Practitioner Essentials, Module 6 | CLF-C02*
