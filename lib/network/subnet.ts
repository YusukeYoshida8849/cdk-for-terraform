import {BaseStack} from "../BaseStack";
import {Subnet} from "@cdktf/provider-aws/lib/subnet";
import {Fn} from "cdktf";
import {PublicPrivateUtils} from "../../utils/PublicPrivateUtils";
import {CommonTagsUtils} from "../../utils/CommonTagsUtils";

/**
 * @description サブネットを作成する
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/subnet
 */
export class SubnetStack extends BaseStack {

    // サブネットip作成のためのカウンタ
    private netnum: number = 0

    /**
     * @description サブネットリソースを作成する
     * @protected
     * @override
     */
    protected doCreate(): void {

        // cdktf.jsonのavailabilityZoneの数だけサブネットを作成する
        Object.keys(this.valSettings.availabilityZone).forEach((key: string) => {

            const availabilityZone: { [key: string]: string } = this.valSettings.availabilityZone[key];
            const publicSuffix: string = PublicPrivateUtils.getPublicPrivate(availabilityZone, true);
            const privateSuffix: string = PublicPrivateUtils.getPublicPrivate(availabilityZone, false);

            const publicAddInfoMap:{ [key: string]: any } = {
                "keyName": publicSuffix,
                "primaryFlg": (key === "primary")
            };
            this.setResourceSettingsCustom(
                this.createSubnet(this.baseResourcesId, publicSuffix, availabilityZone["zone"]),
                publicAddInfoMap);
            this.netnum++;

            const privateAddInfoMap:{ [key: string]: any } = {
                "keyName": privateSuffix,
                "primaryFlg": false
            };
            this.setResourceSettingsCustom(
                this.createSubnet(this.baseResourcesId, privateSuffix, availabilityZone["zone"]),
                privateAddInfoMap);
            this.netnum++;
        });
    }

    /**
     * @description サブネットリソースを作成する
     * @param subnetName
     * @param nameSuffix
     * @param availabilityZoneName
     * @returns Subnet
     * @private
     */
    private createSubnet(subnetName: string, nameSuffix: string, availabilityZoneName: string): Subnet {

        const subnetNameFull: string = `${subnetName}-${nameSuffix}`;

        return new Subnet(this.scope, subnetNameFull, {
            vpcId: this.resourceSettings.vpc.id,
            assignIpv6AddressOnCreation: true,
            cidrBlock: Fn.cidrsubnet(this.resourceSettings.vpc.cidrBlockIpv4, 8, this.netnum),
            ipv6CidrBlock: Fn.cidrsubnet(this.resourceSettings.vpc.cidrBlockIpv6, 8, this.netnum),
            availabilityZone: availabilityZoneName,

            // # サブネットに配置されたインスタンスにパブリックIPアドレスを付与しない
            mapPublicIpOnLaunch: false,

            tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: subnetNameFull})
        });
    }

    /**
     * @description サブネットの設定情報を設定する
     * @param subnet
     * @param addInfoMap
     * @protected
     * @returns void
     */
    protected setResourceSettingsCustom(subnet: Subnet, addInfoMap: { [key: string]: any }): void {

        this.resourceSettings.subnet.idArray[addInfoMap["keyName"]] = subnet.id;

        if (addInfoMap["primaryFlg"]) {
            this.resourceSettings.subnet.primaryPublicSubnetId = subnet.id;
        }
    }
}