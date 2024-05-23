/**
 * @description Vpcリソース設定情報を保持する
 */
export class VpcSettings {

    /**
     * @description vpc.id
     */
    public id: string = "";

    /**
     * @description vpc.cidrBlockIpv4
     */
    public cidrBlockIpv4: string = "";

    /**
     * @description vpc.cidrBlockIpv6
     */
    public cidrBlockIpv6: string = "";
}