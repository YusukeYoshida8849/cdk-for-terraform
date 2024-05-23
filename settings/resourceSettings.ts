import {VpcSettings} from "./resource/network/vpcSettings";
import {RouteTableSettings} from "./resource/network/routeTableSettings";
import {SubnetSettings} from "./resource/network/subnetSettings";
import {EipSettings} from "./resource/network/eipSettings";
import {IgwSettings} from "./resource/network/igwSettings";
import {IgwEngOnlySettings} from "./resource/network/igwEngOnlySettings";
import {SecurityGroupSettings} from "./resource/network/securityGroupSettings";

/**
 * @description リソース設定情報を保持する
 */
export class ResourceSettings {

    /**
     * @description vpc.id
     */
    public vpc: VpcSettings = new VpcSettings();

    /**
     * @description eip
     */
    public eip: EipSettings = new EipSettings()

    /**
     * @description route table
     */
    public routeTable: RouteTableSettings = new RouteTableSettings();

    /**
     * @description subnet
     */
    public subnet: SubnetSettings = new SubnetSettings();

    /**
     * @description igw
     */
    public igw: IgwSettings = new IgwSettings();

    /**
     * @description igwEngOnly
     */
    public igwEngOnly: IgwEngOnlySettings = new IgwEngOnlySettings();

    /**
     * @description security group
     */
    public securityGroupSettings: SecurityGroupSettings = new SecurityGroupSettings();

}