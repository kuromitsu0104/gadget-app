# ポートフォリオ紹介

[https://gadget-community.com](https://gadget-community.com)

『ガジェコミ！』はガジェット好きが集まれるSNS型のWebアプリケーションです。

簡単に言ってしまえば『Twitterクローン』に近いものなので、SNSに必要な機能を重点的に実装済み。

スマホ利用を想定しているのでモバイルからも気軽にお試し下さい！（ゲストログイン有ります） 

#### トップページ
![toppage.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/290888/d49a4b2d-00dc-3492-0b07-f61d540f7586.png)

#### レスポンシブ対応

スマホ利用も想定したUI設計。

![responsive.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/290888/ad9c516a-6424-d08c-37c5-e565d33861b3.gif)

#### Ajax処理

ネストした要素でもAjaxに動作します。

例） 『コメントアイコンをタップ → コメント欄を表示 → 既にあるコメントに返信』

![post_comment_reply.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/290888/bf395ffa-3d25-6d3e-a842-9a3414a1a138.gif)

例） 『コメントを削除』

![post_comment_delete.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/290888/541375a5-43db-2963-673f-c2e448cf90cf.gif)

# ポートフォリオに使用した技術

#### 各バージョン

- Ruby 2.7.1
- Rails 6.0.3.4
- nuxt 2.14.6
- @nuxtjs/vuetify 1.11.2
- Docker 19.03.13
- docker-compose 1.27.4
- Terraform 0.14.3

#### フロントエンド
| 名称 | 説明 |
| ---- | ---- |
| Nuxt.js (SSR mode) | フロントエンドフレームワーク |
| Vuetify | UIコンポーネント |
| Firebase Authentication | JWTを用いたログイン・ログアウト |

- Vuetifyコンポーネントを導入することで、スマホ利用を想定したレスポンシブデザインを実現。

- Vuexストアでステート管理。

- 個人情報（パスワード）は、外部API（Firebase Authentication）に保存する仕組みで、外部APIで発行されるJWTをCookieに保存してログイン・ログアウト機能を実装しました。

- 未ログイン状態でアクセスして欲しくないページ（ /users/editなど ）へのアクセス対策には、Nuxt.jsのmiddlewareを活用することで自動的にリダイレクトするようにしました。

- ログイン状態でアクセスして欲しくないページ （ログインページ, 新規作成ページ） へのアクセスも同じくリダイレクトします。

#### バックエンド
| 名称 | 説明 |
| ---- | ---- |
| Rails (API mode) | APIサーバーとして利用 |
| PostgreSQL | データベース |

- RailsはAPIサーバーとして利用しており、フロントエンドコンテナからのリクエストに対してJSONデータを返しています。

- 画像データはActiveStorage経由でS3バケットに保存。

- その他のデータはRDSに保存。

- 個人情報（ログインパスワード）は外部API（Firebase Authentication）にのみ保存しており、バックエンド（Rails）には保存されません。

#### テストコード
| 名称 | 説明 |
| ---- | ---- |
| Jest | フロントエンドテスト, Vuexストアの動作を少しだけ |
| RSpec | バックエンドテスト, バリデーションとアソシエーションのテストのみ |

- CodePipelineのTestステージで実行するテストコードです。

#### インフラ
| 名称 | 説明 |
| ---- | ---- |
| ECS Fargate | サーバーレスな本番環境, オートスケール |
| CodePipeline | CI/CD環境 |
| RDS | 本番用DB（PostgreSQL） |
| Docker, Docker-compose | コンテナ環境 |
| Github | バージョン管理 |
| Terraform | 本番用インフラをコード管理 |

- ローカル開発環境からデプロイまで一貫してDockerを使用。

- ALBを通すことで常時SSL通信化。

- CodePipelineは、 『Sourceステージ => Testステージ => Buildステージ => Deployステージ』の順で実行され、Testステージで問題が発生した場合は当該ソースでのDeployは実行されません。

- 本番環境の環境変数については SSM で管理。『システム環境変数 => Terraform => SSM => 各AWSサービス』というフローで環境変数を受け渡しています。 

#### インフラ構成図

インフラの全体像をまとめたものがこちら。
RDSにはPostgreSQLを採用し、画像を除いたデータを保管。
画像データはS3に保管しています。

![スクリーンショット 2021-01-26 19.28.33.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/290888/4b873df7-3103-702f-2db7-273f6bd43149.png)

#### ER図

一貫性のあるテーブル名称を意識しました。

![ER_latest.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/290888/5e990b5c-9302-9d78-26f0-c3de6a09ae25.png)

# アプリの機能紹介

### 0. 機能一覧
| 機能名 | 説明 |
| ---- | ---- |
| ユーザー機能 | 新規登録、登録内容変更、アバター登録、ログイン、ログアウト、フォロー |
| つぶやき機能 | 投稿、編集、削除、画像複数枚登録 |
| つぶやきコメント機能 | つぶやきに対してコメント投稿、コメントへのリプライ投稿、削除、画像複数枚登録 |
| つぶやきいいね機能 | つぶやきをいいねできる、マイページのいいねタブにいいねしたつぶやきを一覧表示 |
| 掲示板機能 | 質問掲示板、雑談掲示板の作成、編集、削除、画像複数枚登録 |
| 掲示板コメント機能 | 掲示板に対してコメント投稿、コメントへのリプライ投稿、削除、画像複数枚登録 |
| 私物ガジェット機能 | 登録、編集、削除、画像複数枚登録 |
| フィード機能 | つぶやき新着表示、タイムライン表示、タグフィード表示 |
| タグ管理機能 | つぶやき・掲示板・私物ガジェットにはタグを登録可能、タグをタップしてタグ詳細ページを表示、タグ詳細ページではタグを含むコンテンツを表示 |
| 検索機能 | 各コンテンツを検索可能 |
| 通知機能 | つぶやきにいいね・コメント、掲示板にコメント、他ユーザーからフォローされると通知を表示 |
| 管理者モード | Godmode のトグルスイッチをONにすると、一時的に管理者権限が有効化、各コンテンツの削除メニューが表示される |