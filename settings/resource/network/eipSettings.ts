/**
 * @description EipSettings リソース設定情報を保持する
 */
export class EipSettings {

    /**
     * @description eip.array {name:id}：ex.{eip-a: eipId}
     */
    public idArray: { [key: string]: string } = {};
}