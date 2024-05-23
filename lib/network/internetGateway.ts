import {InternetGateway} from '@cdktf/provider-aws/lib/internet-gateway';
import {BaseStack} from "../BaseStack";
import {CommonTagsUtils} from "../../utils/CommonTagsUtils";

/**
 * @description InternetGatewayを作成する
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/internet_gateway
 */
export class InternetGatewayStack extends BaseStack {

    /**
     * @description InternetGatewayリソースを作成する
     * @private
     * @returns InternetGateway
     * @protected
     * @override
     */
    protected doCreate(): InternetGateway {
        return new InternetGateway(this.scope, this.baseResourcesId, {
            vpcId: this.resourceSettings.vpc.id,
            tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: this.baseResourcesId})
        });
    }

    /**
     * @description InternetGatewayの設定情報を設定する
     * @param internetGateway InternetGateway
     * @protected
     * @override
     * @returns void
     */
    protected setResourceSettings(internetGateway: InternetGateway): void {
        this.resourceSettings.igw.id = internetGateway.id;
    }
}