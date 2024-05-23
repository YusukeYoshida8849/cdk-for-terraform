import {BaseStack} from "../BaseStack";
import {EgressOnlyInternetGateway} from "@cdktf/provider-aws/lib/egress-only-internet-gateway";
import {CommonTagsUtils} from "../../utils/CommonTagsUtils";

/**
 * @description InternetGateway engreee onlyを作成する
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/egress_only_internet_gateway
 */
export class InternetGatewayEngOnlyStack extends BaseStack {

    /**
     * @description InternetGateway engreee onlyリソースを作成する
     * @protected
     * @returns EgressOnlyInternetGateway
     */
    protected doCreate(): EgressOnlyInternetGateway {
        return new EgressOnlyInternetGateway(this.scope, this.baseResourcesId, {
            vpcId: this.resourceSettings.vpc.id,
            tags: CommonTagsUtils.getCommonTags(
                this.valSettings,
                {Name: this.baseResourcesId})
        });
    }

    /**
     * @description InternetGateway engreee onlyの設定情報を設定する
     * @param igwEngOnly EgressOnlyInternetGateway
     * @protected
     * @returns void
     */
    protected setResourceSettings(igwEngOnly: EgressOnlyInternetGateway): void {
        this.resourceSettings.igwEngOnly.id = igwEngOnly.id;
    }
}