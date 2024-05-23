/**
 *  @description SecurityGroupSettings セキュリティグループ設定情報を保持する
 */
export class SecurityGroupSettings {

    /**
     * @description eip.array {name:id}：ex.{eip-a: eipId}
     */
    public idArray: { [key: string]: string } = {};
}