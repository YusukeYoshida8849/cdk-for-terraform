import {Vpc} from "@cdktf/provider-aws/lib/vpc";
import {BaseStack} from "../BaseStack";
import {CommonTagsUtils} from "../../utils/CommonTagsUtils";

/**
 * @description VPCを作成する
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc
 */
export class VpcStack extends BaseStack {

    /**
     * @description VPCリソースを作成する
     * @returns Vpc
     * @override
     */
    protected doCreate(): Vpc {
        return new Vpc(
            this.scope,
            this.baseResourcesId,
            {
                cidrBlock: this.valSettings.cidrIpv4,
                assignGeneratedIpv6CidrBlock: true,
                enableDnsHostnames: true,
                enableDnsSupport: true,
                tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: this.baseResourcesId})
            });
    }


    /**
     * @description VPCの設定情報を設定する
     * @param vpc Vpc
     * @override
     * @returns void
     */
    protected setResourceSettings(vpc: Vpc): void {
        this.resourceSettings.vpc.id = vpc.id;
        this.resourceSettings.vpc.cidrBlockIpv4 = vpc.cidrBlock;
        this.resourceSettings.vpc.cidrBlockIpv6 = vpc.ipv6CidrBlock;
    }
}