# side project : imageBoard

這是一個仿造4chan的圖文討論站，旨在技術展示。

# 功能簡介
- 討論版 > 討論串 > 貼文
- 不須登入即可開討論串、發文(匿名)
- 貼文可以有文字內容與多張圖片
- 發文者的ip會被紀錄，管理員可以查看ip並禁止特定ip發文
- 貼文不可以被編輯、但可以被自己或管理者刪除
- 所有討論串若7天無回應會被自動刪除(硬刪除)
- 使用者可以舉報不當內容，管理員可以查看舉報列表並處理舉報。若舉報數超過10次，該貼文會自動被隱藏。
- 導入cloudflare的機器人驗證。
- 每個ip一分鐘只能發一篇貼文，以防灌水，也避免被機器人攻擊。
- 不提供編輯貼文功能
- 舉報功能，每個id只能對一個貼文舉報一次，舉報理由有預設選項也可以自訂。當貼文被舉報超過10次會自動被隱藏。

- 角色分為Admin與版主，有幾個討論版就有幾個版主角色
- 一個帳號可以有多個版主角色，管理多個討論版
- Admin有所有權限包括建立討論版、建立版主帳號、任命版主、管理所有討論串與貼文
- 版主只能管理自己負責的討論版，權限包括置頂/取消置頂、冷凍/取消冷凍、軟刪除討論串、軟刪除貼文、禁止特定ip發文、編輯討論版描述
- 軟刪除的討論串與貼文會被隱藏，但仍保留在資料庫中以供管理員查看與復原。

- 前端會有一組管理者專用的UI，方便管理所有版主與討論串

- redis用於快取每個討論版的第一頁討論串列表(TTL:5分鐘)，以減少資料庫讀取次數。與紀錄使用者的登入狀態。




# 技術棧
- 框架 : nestjs
- 主資料庫 : mongoDB(mongoose + atlas)
- 快取資料庫 : redis(ioredis + upstash)
- 圖床 : cloudflare R2
- 登入 : passport
- 密碼雜湊 : bcrypt
- 驗證 : jwt
- API文件 : swagger(並用plugin以用註解的方式定義API文件)
- 圖片處理 : sharp(圖片縮圖)
- 部署 : Render
- CI/CD : GitHub Actions

# 資料庫設計 (Schema Design)

  ## moderator
  - `email`: string (唯一索引)
  - `password`: string (bcrypt 雜湊後的密碼)
  - `nickname`: string
  - `role`: string[] // ['Admin', 'Animal', 'drama'] Admin為超級管理員，其他為各討論版的版主，隨討論版增加而增加
  
  ## board
  - `name`: string (版名)
  - `description`: string
  - `role`: string (對應 moderator 的 role 欄位，決定哪些版主可以管理這個版)
  
  ## thread
  - `board`: Types.ObjectId | Board;
  - `title`: string
  - `isPinned`: boolean (置頂)
  - `isLocked`: boolean (冷凍)
  - `lastReplyAt`: Date (排序用，也用來判斷討論串是否7天無回應以自動刪除)
  - `softDeleted`: boolean (軟刪除)
  
  ## threadPost
  - `board` : Types.ObjectId | Board;
  - `thread` : Types.ObjectId | Thread;
  - `r2`:{
    img: Types.ObjectId | R2
    thumbnail: Types.ObjectId | R2
    }[];
  - `r2Keys` : {
    img: string; // 原圖的key
    thumbnail: string; // 縮圖的key
    }[] (圖片在R2的key)

  ## R2
  - `key`: string (圖片在R2的key)
  - `originalName`: string (上傳圖片的原始檔名)
  - `mimetype`: string (圖片的MIME類型)
  - `fileSize`: number (圖片的檔案大小)


# 模組大綱 (Module Breakdown)
  ## auth
  * 功能: 處理註冊、登入、JWT 簽發。
  * 技術: 使用 `Bcrypt` 處理密碼。
  ## r2
  * 功能: 封裝 AWS SDK (S3)，處理 R2 的上傳、刪除操作。
  ## image
  * 功能: 圖片管理與縮圖處理，調用 `Sharp` 將圖片壓縮至 200px 寬度的縮圖，統一轉換格式為 WebP 以節省流量，串接 R2 Module 將「原圖」與「縮圖」同步上傳。
  ## board
  * 功能: 提供管理者建立看板，並列出所有看板清單。
  ## thread
  * 功能: 建立、管理討論串。建立時需同步建立第一篇 Post (OP)。
  ## threadPost
  * 功能: 處理建立貼文、刪除貼文。成功回覆後需更新 `Thread` 的 `lastReplyAt` 欄位以便推文。
  ## manage
  * 功能: 管理員專屬。只有用來管理版主帳號

# 部署與效能優化
 * **環境變數**: 透過 `.env` 嚴格區分開發與生產環境的資料庫金鑰。
 * **自動化文件**: 使用 `@nestjs/swagger` 插件，透過 DTO 與 Controller 註解自動生成互動式 API 文檔。
 * **CI/CD**: 專案完成時設定 GitHub Actions，推送到 main 分支時自動部署至 **Render**。




# 開發階段規劃 (MoSCoW)

## MVP (第 1 階段)
- **Must**: 
  - 看板清單
  - 討論串列表(分頁)
  - 建立討論串(含首貼)
  - 回覆討論串(文字+圖片)
  - 必要驗證與錯誤回應
- **Should**:
  - 圖片縮圖處理
  - 圖片轉 WebP
  - R2 上傳與刪除
  - 更新 `Thread.lastReplyAt`
  - 基本 Swagger 文件
- **Could**: 

- **Won't**:
  - 舉報
  - 角色/版主權限
  - Redis 快取
  - 排程清理
  - Cloudflare 驗證
  - 軟刪除與還原
  - 完整管理 UI

## v1 (第 2 階段)
- **Must**: 
  - 管理員登入功能(先只做admin)
  - 管理員建立/管理看板
  - 討論串置頂/冷凍
  - 軟刪除討論串/貼文
  - 基本防濫用(每 IP 發文頻率限制)
  - IP 禁止發文
  - 舉報功能(含自動隱藏規則)
  - 後台管理 API
- **Should**: 
  - Redis 快取看板第一頁
  - 簡單後台 UI
  - 管理員可檢視舉報與 IP
- **Could**: 
  - 基本稽核紀錄(管理操作)
- **Won't**: 
  - 多版主角色與權限
  - 排程硬刪
  - Cloudflare 驗證

## v2 (第 3 階段)
- **Must**: 
  - 多版主角色與權限
  - 版主僅管理自己的看板
  - 排程自動清理 7 天無回應討論串
  - Cloudflare 機器人驗證
- **Should**: 
  - 更完整的管理 UI
  - 可還原軟刪內容
  - 完整 Swagger 文件 // 基本與完整差在哪裡?
- **Could**: 
  - 進階稽核/統計
- **Won't**: 
  - 跨資料庫服務拆分(PostgreSQL 第二套)


# 其他
未來可能會用postgresql再做一整組的service，作為練習





