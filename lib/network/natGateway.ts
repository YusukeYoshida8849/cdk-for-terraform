import {BaseStack} from "../BaseStack";
import {CommonTagsUtils} from "../../utils/CommonTagsUtils";
import {NatGateway} from "@cdktf/provider-aws/lib/nat-gateway";

/**
 * @description NatGatewayを作成する
 */
export class NatGatewayStack extends BaseStack {

    /**
     * @description NatGatewayを作成する
     * @param id string NatGatewayのIDを上書きする場合に指定する
     * @returns void
     */
    public createResources(id: string = this.valSettings.id): void {
        const igwName: string = `${id}-ngw`;
        this.createNatGateway(igwName);
    }

    /**
     * @description NatGatewayリソースを作成する
     * @param id
     * @private
     * @returns NatGateway
     */
    private createNatGateway(id: string): NatGateway {
        return new NatGateway(this.scope, id, {
            subnetId: this.resourceSettings.subnet.primaryPublicSubnetId,
            allocationId: this.resourceSettings.eip.idArray[this.valSettings.natgatewayEipKey],
            tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: id})
        });
    }
}