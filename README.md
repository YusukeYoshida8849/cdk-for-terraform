# インフラ設定
※ 現在作成中

## 1. インフラ構成図
- 作成中・・・

## 2. 使用Iac
- CDK for Terraform
  - [help](help) 参照

## 3. 管理しないこと
- Route53
  - ドメイン取得はAWSの管理外で行う
  - メインのドメインはAWSコンソールで設定する
- Certificate Manager
  - SSL証明書の取得はAWSで行う
  - メインのSSL証明書はAWSコンソールで設定する
- EC2
  - SSH用のキーペアはAWSコンソールで作成する