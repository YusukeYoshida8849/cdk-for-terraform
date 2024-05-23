import {BaseStack} from "../BaseStack";
import {RouteTableAssociation} from "@cdktf/provider-aws/lib/route-table-association";

/**
 * @description サブネットとルートテーブルを紐付ける
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table_association
 */
export class RouteTableSubnetAttach extends BaseStack {

    /**
     * @description サブネットとルートテーブルを紐付ける
     * @protected
     * @returns void
     * @override
     */
    protected doCreate(): any {
        Object.keys(this.resourceSettings.subnet.idArray).forEach((key) => {
            new RouteTableAssociation(this.scope, `${this.baseResourcesId}-${key}`, {
                routeTableId: this.resourceSettings.routeTable.idArray[key],
                subnetId: this.resourceSettings.subnet.idArray[key]
            });
        });
    }
}