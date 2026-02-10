# side project : imageboard

這是一個仿造4chan的圖文討論站，旨在技術展示。

# 功能簡介
- 使用者可以註冊帳號、登入、登出
- 第三方登入
- 使用者可以設定自己的個人資料，包括暱稱、簡介等
- 使用者可以開串、回覆貼文、編輯、刪除自己的貼文
- 貼文內容可以是純文字，也可以包含圖片
- 管理者可以刪除任何貼文，水桶使用者
- 管理者可以冷凍、置頂討論串
- 管理者可以建立討論版，並設定討論版的名稱與描述
- 前端會有一組管理者專用的UI，方便管理所有使用者與討論串
- 所有討論串若7天無回應會被自動刪除

# 技術棧
- 框架 : nestjs
- 主資料庫 : mongoDB(mongoose + atlas)
- 快取資料庫 : redis(ioredis + upstash)
- 圖床 : cloudflare R2
- 登入 : passport
- 密碼雜湊 : bcrypt
- 驗證 : jwt
- 資料驗證 : zod
- API文件 : swagger(並用plugin以用註解的方式定義API文件)
- 圖片處理 : sharp(圖片縮圖)
- 部署 : Render
- CI/CD : GitHub Actions

# 資料庫設計 (Schema Design)

  ## user
  - `email`: String (唯一索引)
  - `password`: String (bcrypt 雜湊後的密碼)
  - `nickname`: String
  - `role`: Enum ['Admin', 'User']
  - `bannedUntil`: Date (用於暫時停權)
  ## board
  - `name`: String (版名)
  - `description`: String
  ## thread
  - `boardId`: ObjectId (Ref: Board)
  - `title`: String
  - `isPinned`: Boolean (置頂)
  - `isLocked`: Boolean (冷凍)
  - `lastReplyAt`: Date (排序用)
  ## post
  - `threadId`: ObjectId (Ref: Thread)
  - `userId`: ObjectId (Ref: User)
  - `content`: Text
  - `images`: Array (R2圖片的key)
  - `index`: Number (同一討論串內貼文的順序，OP為0，第一則回覆為1，以此類推)

# 模組化大綱 (Module Breakdown)
  ## auth
  * 功能: 處理註冊、登入、JWT 簽發。
  * 技術: 使用 `Bcrypt` 處理密碼，`Passport-JWT` 驗證請求。
  ## user
  * 功能: 個人資料維護。
  ## file
  * 功能: 封裝 AWS SDK (S3)，處理 R2 的上傳、刪除操作。
  ## image
  * 功能: 圖片管理與縮圖處理，調用 `Sharp` 將圖片壓縮至 200px 寬度的縮圖，統一轉換格式為 WebP 以節省流量，串接 File Module 將「原圖」與「縮圖」同步上傳。
  ## board
  * 功能: 提供管理員建立看板，並列出所有看板清單。
  ## thread
  * 功能: 建立、管理討論串。建立時需同步建立第一篇 Post (OP)。
  ## post
  * 功能: 處理回覆貼文、編輯內容、刪除貼文。成功回覆後需更新 `Thread` 的 `lastReplyAt` 欄位以便推文。
  ## manage
  * 功能: 管理員專屬 UI API。列出所有使用者與狀態，執行水桶或停權，置頂/取消置頂，冷凍/取消冷凍。

# 🚀 部署與效能優化
 * **環境變數**: 透過 `.env` 嚴格區分開發與生產環境的資料庫金鑰。
 * **自動化文件**: 使用 `@nestjs/swagger` 插件，透過 DTO 與 Controller 註解自動生成互動式 API 文檔。
 * **CI/CD**: 專案完成時設定 GitHub Actions，推送到 main 分支時自動部署至 **Render**。







