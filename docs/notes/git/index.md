---
sidebar_position: 3
title: GIT
---

# GIT Notes

記錄 Git 的各項操作技巧與常見工作流。

---

## 1. 遠端倉庫管理 (Remote Management)

當你需要將現有的本地專案切換到新的遠端倉庫（例如從別人的 Repo 改為推送到自己的 Repo）時，可以參考以下操作。

### 1.1 直接更換遠端地址
如果你不需要再追蹤原作者的更新，這是最快速的方法：

1. **查看目前狀態**：
   ```bash
   git remote -v
   ```
2. **重新設定指向**：
   ```bash
   git remote set-url origin <你的個人倉庫網址>
   ```
3. **推送到新倉庫**：
   ```bash
   git push -u origin main
   ```

### 1.2 雙遠端配置 (同步原作者更新)
如果你希望在開發自己版本的同時，還能獲取原作者最新的改動：

1. **重新命名原遠端**：
   ```bash
   git remote rename origin upstream
   ```
2. **新增你的遠端**：
   ```bash
   git remote add origin <你的個人倉庫網址>
   ```
3. **操作邏輯**：
   - `git pull upstream main`：獲取原作者更新。
   - `git push origin main`：推送到你的倉庫。

---

## 2. 分支操作 (Branching)

*(待擴充)*

---

## 3. 提交規範 (Commit Message)

*(待擴充)*

---

## 附錄：常用指令速查表

| 指令                              | 說明                       |
| :-------------------------------- | :------------------------- |
| `git remote -v`                   | 查看遠端清單與網址         |
| `git remote set-url <name> <url>` | 修改指定遠端的網址         |
| `git push -u <name> <branch>`     | 推送並建立本地與遠端的連結 |
