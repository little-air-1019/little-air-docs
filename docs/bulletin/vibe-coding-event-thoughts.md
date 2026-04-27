---
sidebar_position: 2
---

# Thoughts On Vibe Coding Event

> 從一場 Copilot 實作活動，看 Prompt 前置作業如何決定產出品質

這次活動最值得記錄的觀察是：**在使用同一個 GitHub Copilot、同一份 API 規格書的條件下，開發人員之間的產出品質與耗時差異，主要不是來自工具使用熟練度，而是來自「下第一句 Prompt 之前的準備工夫」**。其中一位匿名同仁(以下以「小空氣」代稱)的做法是先用 DTO 產生器與 JPA Buddy 鎖定資料模型、再把規格轉為結構化 Markdown，等於在送入 LLM 之前已經把 context 收斂到較低的不確定性；這當然不是唯一解。其他幾種模式從不同角度切入，有的善用跨工具協作、有的偏好分段控制節奏，各有合理性。本文以同儕分享的角度，把當天的觀察與 GitHub、Microsoft 官方說明對照，整理出可複用的 Prompt Pattern，提供日後同仁在開發 Spring Boot RESTful API 時參考。

## 一、前言

本次活動讓開發同仁依現有 API 規格書，以 GitHub Copilot 輔助開發 Spring Boot RESTful API，工具與操作方式不限，目的是觀察「實際工作習慣」而非比賽完成速度。觀察重點放在開發人員如何切入規格、如何下 Prompt、以及遇到偏差時的修正策略，從中歸納出可在團隊內部交流的工作流。本文不打算把任何一種做法當成「標準答案」，而是把每個模式背後的 prompt engineering 思維拆開來看。

## 二、八種操作模式的橫向比較

下表把當天觀察到的八種做法，以「Prompt engineering 思維」為軸線並列比較。每個模式都有它的合理性，讀者可以從「context 是否前置」這一欄，看到差異的根源。

| 模式   | 工具與切入點                                                     | Prompt engineering 思維                                             | 主要痛點                                |
| ------ | ---------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------- |
| 小空氣 | IntelliJ + Copilot，先建立 DTO/Entity，規格轉 Markdown           | **先以工具固化 context，再以結構化文件作為 single source of truth** | 前置工序需要紀律，但後續迭代成本較低    |
| A      | 讓 AI「理解」DTO 後再寫程式                                      | 期待模型自行推論 schema                                             | DTO 結構推論不穩，反覆貼錯誤訊息修正    |
| B      | 先讓 AI 寫 SqlAction、再手改為 JPA                               | 第一句 Prompt 缺少查詢策略限制                                      | 多一道人工改寫工序                      |
| C      | ChatGPT 萃取業務邏輯 → 產出給 Copilot 的 Prompt → Copilot 寫程式 | **以另一個 LLM 做 context 預處理，人工居中校驗**                    | 跨工具切換有理解落差風險                |
| D      | 依個人理解分段請 AI 撰寫                                         | 人工控節奏的 chain-of-thought                                       | 整體一致性仰賴人工把關                  |
| E      | 讓 AI 自行產生 Entity                                            | 信任模型推論 schema                                                 | Entity 欄位易遺漏                       |
| F      | VS Code 寫、IntelliJ 驗證                                        | 利用 VS Code 對 Copilot 較完整的整合                                | 兩個 IDE 之間的切換成本                 |
| G      | 網頁版 Copilot 或 M365 Copilot                                   | 對話式介面、無 IDE 上下文                                           | 失去 neighboring tabs 與 workspace 索引 |

幾個值得展開的對比。**小空氣這個做法**之所以打回頭路較少，原因不只是「規格轉成 Markdown」這個動作本身，而是這個動作把 API 路徑、HTTP method、入出參、驗證規則、錯誤碼從 Word 的視覺結構，改寫成 LLM 容易切片(snippeting)與排序(prioritization)的層級結構。對照 GitHub 開發人員 Berryman 與 Ziegler 在 [GitHub Blog 揭露的 Copilot prompt pipeline](https://github.blog/ai-and-ml/generative-ai/prompt-engineering-guide-generative-ai-llms/)，這正是 Copilot 在送出 LLM 之前，內部會做的「context gathering → snippeting → context injection → prioritization」流程，等於把第一步的雜訊先濾掉了。

**模式 A 與 E** 的痛點是同一個：把 schema 推論工作交給模型。Spring Boot 的 Entity/DTO 涉及 JPA 標註、欄位精度、null 約束等強型別語意，LLM 在沒有看到資料庫 DDL 或現成類別檔的情況下，只能從規格文字裡「猜」型別，常見遺漏屬可預期的失敗模式。先用 JPA Buddy 從資料庫產生 Entity、再用 DTO 產生器產出上下行 DTO，等於把這部分從「機率輸出」改回「確定性輸出」。

**模式 B** 提醒我們，coding standard(JPA 還是手寫 SQL、Repository 還是 SqlAction)若不在第一句 Prompt 講清楚，模型會選一條它「最常見」的路，通常不是團隊的選擇。這在 GitHub Docs 的 [Best practices for using GitHub Copilot](https://docs.github.com/en/copilot/get-started/best-practices) 中被列為四個關鍵要點之一：**Be specific about your requirements**。

**模式 C** 是當天很有創意的做法，本質是用 ChatGPT 做 context 預處理(類似把規格書「編譯」成 Copilot 看得懂的指令)。學理上這對應到 Vanderbilt 大學 White 等人在 [A Prompt Pattern Catalog](https://arxiv.org/abs/2302.11382) 中提出的 Meta Language Creation 與 Recipe Pattern。這個做法在規格極度龐大或業務邏輯複雜時有效，但缺點是中間多了一層人工確認，若兩個 AI 對同一段業務描述的理解出現偏差，bug 會被「翻譯」過去。

**模式 D** 屬於 Barke 等人在 OOPSLA 2023 [Grounded Copilot](https://arxiv.org/abs/2206.15000) 中觀察到的 **exploration mode**：程式設計師對下一步不完全確定，以分段對話的方式探索。這在功能不熟悉時是合理的；對於規格已明確的 RESTful API 而言，則通常會比一次到位的 acceleration mode 慢一些。值得注意的是，這個模式在開發人員對某段業務邏輯仍有疑慮時，反而比直接整段塞給 AI 安全。

**模式 F 與 G** 反映的是工具差異。根據 [GitHub Docs 的 Chat cheat sheet](https://docs.github.com/en/copilot/reference/chat-cheat-sheet)，VS Code 平台目前公開記錄了 5 個 chat participants(`@workspace`、`@vscode`、`@terminal`、`@github`、`@azure`)與 11 個以上的 chat variables(`#file`、`#selection`、`#codebase` 等);JetBrains 平台原本只列出 4 個 slash commands，直到 [2025 年 2 月](https://github.blog/changelog/2025-02-19-boost-your-productivity-with-github-copilot-in-jetbrains-ides-introducing-project-context-ai-generated-commit-messages-and-other-updates/) 才補上等同於 `@workspace` 的 `@project`。**模式 F 開發人員選擇在 VS Code 撰寫，實際上是繞道取得更完整的 Copilot 工具鏈**，合理但要注意 IDE 切換成本。**模式 G 的網頁版 Copilot** 雖然 context window 較大，但失去了 IDE 端的 neighboring tabs 與 workspace 索引，對於需要參考既有專案結構的任務反而不利。

## 三、為什麼 Prompt 的前置資訊品質決定輸出品質

要理解為什麼前置作業會直接影響輸出品質，必須回到 Copilot 的工作機制。VS Code 官方文件在 [Context concepts](https://code.visualstudio.com/docs/copilot/concepts/context) 一頁直接給了結論：**「The model has no memory of previous sessions and no access to files it hasn't been given. Everything it knows about your task comes from the context assembled for the current request.」** 這句話是整份報告所有建議的理論起點。

### Context window 是有上限的工作記憶

依據 [GitHub Changelog](https://github.blog/changelog/2024-12-06-copilot-chat-now-has-a-64k-context-window-with-openai-gpt-4o/)，Copilot Chat 目前在官方支援的 IDE 上以 GPT-4o 提供 64K token，VS Code Insiders 上提供 128K。**這個視窗要塞下 system prompt、custom instructions、開啟的檔案、選取片段、歷史對話與當前問題**，所以「給愈多檔案愈好」是錯的觀念。學界研究(arXiv 2312.14231 對微軟產品 Copilot 開發者的訪談)記錄了實務開發人員描述的瓶頸：「constantly juggle what to selectively truncate because it won't all fit into the prompt」。前置作業的價值，正是讓送進 context window 的每一個 token 都帶最高密度的資訊。

### Inline suggestion 與 Chat mode 用的是不同的 context 來源

這是當天活動值得釐清的一點。根據 [GitHub Docs 對 inline suggestion 的說明](https://docs.github.com/en/copilot/responsible-use/copilot-code-completion)，**inline suggestion 是 Fill-in-the-Middle 模型，以游標為中心，context 主要來自當前檔案的 prefix/suffix 與 neighboring tabs**;[GitHub Blog 揭露](https://github.blog/ai-and-ml/github-copilot/how-github-copilot-is-getting-better-at-understanding-your-code/) 加入 neighboring tabs 後使用者接受率相對提升 5%，引述 Principal ML Engineer Albert Ziegler:「By including every little bit of context， neighboring tabs helped to relatively increase user acceptance of GitHub Copilot's suggestions by 5%.」**Chat mode 則使用較大的模型，並可透過 `@workspace` 或 `#codebase` 主動觸發整個 codebase 的 semantic search**。這意味著模式 A 反覆貼錯誤訊息給 Chat 修正，其實是用「最貴的工具」處理「IDE 端打開檔案就能解決」的問題。

### 檔案感知不是讀取整個專案

開發人員常誤以為 Copilot「會自己看整個專案」，但 [GitHub Blog](https://github.blog/developer-skills/github/how-to-write-better-prompts-for-github-copilot/) 明確說明:Copilot 使用 neighboring tabs 機制，只會讀「IDE 中當前開啟的所有 tab」。換句話說，**事先把 DTO 與 Entity 檔案開好、不相關的檔案關掉，等於主動為模型布置場景**;反之，如果同時開了五份不同模組的 Service，Copilot 會被無關 context 干擾。Microsoft Learn 在 [Visual Studio Copilot context overview](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-context-overview) 把組裝順序講得非常清楚:system prompt + custom instructions + implicit context(對話歷史、開啟檔案)+ explicit content(`#-mention`)。

### 小結：三個前置動作的價值

把上述機制與當天觀察對照，可以解釋為什麼「下 prompt 之前的準備」會直接影響後續迭代次數。具體來說有三件事：**用工具產生確定性的 DTO/Entity(消除 schema 不確定性)、用 Markdown 結構化規格(消除文字結構雜訊)、用 IDE 開啟相關檔案(讓 neighboring tabs 抓到正確 context)**。這三件事都發生在按下 Enter 之前，但決定了之後迭代的次數。值得提醒的是，這不是唯一的最佳實踐——對於探索型任務或業務邏輯不確定的場景，模式 D 那種分段推進反而比較安全。

## 四、可複用的 Prompt Pattern 建議

下面三個 Pattern 是針對 Spring Boot RESTful API 開發場景整理，可以直接放進團隊的 wiki。命名沿用學界的 prompt pattern 慣例，讓日後跨團隊溝通時有共同語彙。

### Pattern 1: Schema-First Stage Setting

**適用情境**：從規格書開始開發新的 RESTful API 端點，且資料表結構已存在或可由 DDL 產生時。這個 Pattern 直接針對模式 A、E 的痛點——把 schema 推論的不確定性從 LLM 端移除。

**為何有效**：把模型最容易出錯的「型別推論」從 LLM 移交給確定性工具(JPA Buddy、DTO 產生器)，Copilot 在生成 Controller / Service 時只需要做樣板組合，而不是猜 schema。GitHub 官方 [awesome-copilot 的 Spring Boot instructions](https://github.com/github/awesome-copilot/blob/main/instructions/springboot.instructions.md) 也明確要求「不要把 JPA Entity 直接暴露給 API，改用 DTO」，前置確定 DTO 等於同步落實這條規範。

**範例 Prompt 片段**:
```
# 任務
依下方規格實作一個 Spring Boot 3.2 的 REST endpoint。

# Coding 規範
- 參考 OrderController.java 的風格(已開啟在 tab 中)
- Controller 放在 com.bank.api.order.controller
- 資料存取一律使用 Spring Data JPA Repository，不使用原生 SqlAction
- 單表查詢使用 JPA，跨表查詢使用 JDBC (SqlAction)
- 使用 constructor injection，所有依賴宣告 private final
- 例外由 @RestControllerAdvice 統一處理，不在 Controller 內 try/catch

# 既有資源(已開啟在 tab 中)
- OrderEntity.java(由 JPA Buddy 從 DDL 產出)
- OrderRequestDto.java、OrderResponseDto.java(由 DTO 產生器產出)

# 規格(Markdown)
[此處貼入轉換後的 Markdown 規格全文]
```

### Pattern 2: Style Anchor by Reference File

**適用情境**：團隊已有風格成熟的 reference 程式檔，但專案沒有完整的 `.github/copilot-instructions.md`，或需要針對單一模組指定不同風格時。

**為何有效**：利用 [VS Code 的 `#file` chat variable](https://code.visualstudio.com/docs/copilot/reference/workspace-context) 把整個檔案明確注入 context，模型會把「風格樣本」視為強訊號優先參考。比起用文字描述「請寫出乾淨的 Spring Boot 程式」，**直接指向一個檔案的成本更低、輸出更穩定**。GitHub Docs 在 [Your first custom instructions](https://docs.github.com/en/copilot/tutorials/customization-library/custom-instructions/your-first-custom-instructions) 也建議「Show preferred and avoided patterns with concrete code examples. The AI responds more effectively to examples than to abstract rules.」

**範例 Prompt 片段**:
```
請參考 #file:CustomerController.java 的命名、套件、註解、驗證、
回傳結構與例外處理風格,實作以下端點。

要求:
1. 命名一致(包括變數、方法、Logger 命名規則)
2. 使用 SLF4J + parameterized logging,例如 logger.info("User {} ...", id)
3. 入參使用 @Valid,搭配 BindingResult
4. 回傳統一以 `ApiResponse<T>` 包裝(同 reference 檔)

規格如下:[Markdown 規格]
```

### Pattern 3: Repository-Wide Custom Instructions

**適用情境**：團隊或專案需要長期固化 coding standard，避免每位開發人員各自下 prompt，造成風格漂移。這是**模式 B 痛點的根本解**——把「使用 JPA、不用 SqlAction」這類團隊決策，寫一次套用所有人。

**為何有效**：[GitHub Docs](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) 支援在 repo 根目錄建立 `.github/copilot-instructions.md`，Copilot 會自動把內容附加到每次的 system prompt。官方建議「Keep your instructions short and self-contained. Each instruction should be a single, simple statement... Include the reasoning behind rules.」加上理由能讓模型在邊緣情況下仍做出符合團隊偏好的決策。

**範例 `.github/copilot-instructions.md` 片段**:
```markdown
# API 服務 Copilot 指南

## 框架版本
- 使用 Spring Boot 3.2.x、Java 21,jakarta.* 命名空間。

## 資料存取
- 一律使用 Spring Data JPA。單表查詢以 derived query method 為主，跨表或彙總查詢使用 @Query 並標註原因(避免 N+1)。
- 禁止直接拼接 SQL 字串;若需動態查詢使用 Specification 或 Querydsl。

## 例外與日誌
- 不在 Controller 使用 try/catch，改由 @RestControllerAdvice 統一處理。
- 一律使用 SLF4J，參數化日誌:logger.info("Processed order {}", id)。
- 不可使用 System.out.println 或直接呼叫 Logback/Log4j2 API。

## DTO 與 Entity
- API 邊界一律使用 DTO，Entity 不暴露於 Controller 與 OpenAPI 文件。
- DTO 使用 record(不可變)，驗證以 JSR-380 標註(@NotBlank、@Size)。

## 測試
- Service 層用 JUnit 5 + Mockito，Repository 用 @DataJpaTest，Controller 用 @WebMvcTest。複雜整合測試使用 Testcontainers。
```

## 五、把 Copilot 的 Context 機制用得更深

熟悉了基本 Pattern 後，這幾個進階技巧能進一步壓縮迭代次數。

**用對 chat participant 與 chat variable**。VS Code 平台上，`#codebase` 比 `@workspace` 更彈性，根據 [VS Code 官方文件](https://code.visualstudio.com/docs/copilot/reference/workspace-context)，`@workspace` 只能在 ask mode 使用，而 `#codebase` 在 ask、edit、agent 三個 mode 都能呼叫，並會觸發語意搜尋把相關片段拉進 prompt。JetBrains 上若需要全 codebase 索引，使用 [`@project`](https://github.blog/changelog/2025-02-19-boost-your-productivity-with-github-copilot-in-jetbrains-ides-introducing-project-context-ai-generated-commit-messages-and-other-updates/)，功能等同 `@workspace`。

**主動管理 neighboring tabs**。在開始撰寫某個 endpoint 前，用幾秒鐘把無關的檔案關掉、把 reference Controller、目標 DTO、Entity 開到 tab。這個動作直接影響 inline suggestion 的品質——因為 neighboring tabs 是它最主要的 context 來源。

**Single, Short, Specific 三原則**。Microsoft Tech Community 在 [Single, Short, Specific 一文](https://techcommunity.microsoft.com/blog/azuredevcommunityblog/single-short-specific---prompting-github-copilot-for-visual-studio/4117226) 提出這個易記口訣：一個 prompt 一個目標、不冗長、夠具體。當天觀察到模式 D 的開發人員其實天然遵循這個原則(分段請 AI 寫),只是沒有搭配 Pattern 3 的長期規範,導致一致性靠人工維持。

**避免歧義詞**。GitHub Docs 提醒不要在 prompt 中寫「修一下這個」，而是明確指出「請修改 OrderService 的 createOrder 方法，讓它在收到重複 orderNo 時拋出 DuplicateOrderException」。當天若干模式因為這類歧義，Copilot 動到了不該動的部分。

**Coding style 範例提供方法的優先順序**：從低到高依序為「文字描述」&lt;「`#file:範例檔.java`」&lt;「`.github/copilot-instructions.md`」&lt;「`copilot-instructions.md` + path-specific `.instructions.md`」。團隊長期推行建議直接從第三層開始。

## 六、延伸學習資源

- [How GitHub Copilot is getting better at understanding your code – GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-github-copilot-is-getting-better-at-understanding-your-code/):由 GitHub Principal ML Engineer 撰寫，完整解釋 prompt 組裝、neighboring tabs、Fill-in-the-Middle，是理解 Copilot 內部最核心的一篇。
- [Prompt engineering for GitHub Copilot Chat – GitHub Docs](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering):官方四項策略(廣泛目標→具體需求、提供範例、任務拆分、避免歧義)，是團隊內訓最直接可用的教材。
- [Adding repository custom instructions – GitHub Docs](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot):`.github/copilot-instructions.md` 的官方設定指南，連同 [Your first custom instructions](https://docs.github.com/en/copilot/tutorials/customization-library/custom-instructions/your-first-custom-instructions) 一起閱讀效果最佳。
- [awesome-copilot Spring Boot instructions – GitHub](https://github.com/github/awesome-copilot/blob/main/instructions/springboot.instructions.md):GitHub 官方 organization 維護的 Spring Boot 風格指令範本，可作為銀行內部 `copilot-instructions.md` 的起點。
- [A developer's guide to prompt engineering and LLMs – GitHub Blog](https://github.blog/ai-and-ml/generative-ai/prompt-engineering-guide-generative-ai-llms/):GitHub 內部 prompt engineering pipeline(context gathering → snippeting → injection → prioritization)的完整描述，讀完後對「為什麼前置作業重要」會有結構化理解。
- [Grounded Copilot: How Programmers Interact with Code-Generating Models (Barke et al., OOPSLA 2023)](https://arxiv.org/abs/2206.15000):學界對 Copilot 使用模式最有代表性的論文，解釋 acceleration mode 與 exploration mode 雙模態，有助於理解團隊成員的不同操作習慣。

## 七、結語：把 Copilot 當成需要被供給 context 的同事

這次活動的心得是：**Copilot 不會魔法般理解我們的專案，它的所有判斷都來自當下被組裝進 context window 的那幾萬個 token**。八種模式各有各的合理性，小空氣那種「先工具固化、再結構化規格、再開好參照檔案」的做法只是其中一條較順的路徑，並不代表其他做法是錯的——例如模式 C 的跨工具預處理在處理超大規格時會更有韌性，模式 D 的分段推進在業務邏輯仍待釐清時也比較安全。團隊若要把這次活動的經驗落地成日常工作流，**核心動作是把 Schema-First 的前置作業、Reference File 的風格錨定、Custom Instructions 的長期規範這三件事制度化**，讓每個人下 prompt 之前的起跑線拉到同一條，剩下的就讓每位開發人員依場景選擇最適合的模式。
