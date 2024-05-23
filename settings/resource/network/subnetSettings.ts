/**
 * @description サブネットリソース設定情報を保持する
 */
export class SubnetSettings {

    /**
     * @description subnet.array {name:id}：ex.{public-a: subnetId}
     */
    public idArray: { [key: string]: string } = {};

    /**
     * @description public subnet id primary
     */
    public primaryPublicSubnetId: string = '';
}