import {BaseStack} from "../BaseStack";
import {RouteTable} from "@cdktf/provider-aws/lib/route-table";
import {PublicPrivateUtils} from "../../utils/PublicPrivateUtils";
import {CommonTagsUtils} from "../../utils/CommonTagsUtils";

/**
 * @description ルートテーブルを作成する
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table
 */
export class RouteTableStack extends BaseStack {

    /**
     * @description ルートテーブルを作成する
     * @returns void
     * @override
     */
    protected doCreate(): any {

        // cdktf.jsonのavailabilityZoneの数だけルートテーブルを作成する
        Object.values(this.valSettings.availabilityZone).forEach((availabilityZone: { [key: string]: string }) => {

            const publicSuffix: string = PublicPrivateUtils.getPublicPrivate(availabilityZone, true);
            const privateSuffix: string = PublicPrivateUtils.getPublicPrivate(availabilityZone, false);

            this.setResourceSettingsCustom(
                this.createRouteTable(this.baseResourcesId, publicSuffix),
                {keyname: publicSuffix});

            this.setResourceSettingsCustom(
                this.createRouteTable(this.baseResourcesId, privateSuffix),
                {keyname: privateSuffix});
        });
    }

    /**
     * @description ルートテーブルリソースを作成する
     * @param routeTableName
     * @param nameSuffix
     * @private
     */
    private createRouteTable(routeTableName: string,
                             nameSuffix: string): RouteTable {

        const routeTableNameFull: string = `${routeTableName}-${nameSuffix}`;

        return new RouteTable(this.scope, routeTableNameFull, {
            vpcId: this.resourceSettings.vpc.id,
            tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: routeTableNameFull})
        });
    }

    /**
     * @description ルートテーブルの設定情報を設定する
     * @param routeTable
     * @param keyNameMap
     * @protected
     * @returns void
     */
    protected setResourceSettingsCustom(routeTable: RouteTable, keyNameMap: { [key: string]: string }): void {

        this.resourceSettings.routeTable.idArray[keyNameMap["keyname"]] = routeTable.id;
    }
}