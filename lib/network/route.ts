import {BaseStack} from "../BaseStack";
import {Route} from "@cdktf/provider-aws/lib/route";

/**
 * @description RouteStackを作成する
 */
export class RouteStack extends BaseStack {

    /**
     * @description RouteStackを作成する
     * @returns void
     */
    public createResources(): void {

        // ルートテーブルをinternet gatewayに関連付ける
        Object.keys(this.resourceSettings.routeTable.idArray).forEach((key: string) => {
            if (key.indexOf("public") === 0) {
                this.createRoutePublic(this.baseResourcesId, key, this.resourceSettings.routeTable.idArray[key]);

            } else if (key.indexOf("private") === 0) {
                this.createRoutePrivate(this.baseResourcesId, key, this.resourceSettings.routeTable.idArray[key]);
            }
        });
    }

    /**
     * @description public ルートテーブルをinternet gatewayに関連付ける
     * @param routeTableName
     * @param nameSuffix
     * @param routeTblId
     * @private
     */
    private createRoutePublic(routeTableName: string, nameSuffix: string, routeTblId: string): void {

        const routeTableNameFull: string = `${routeTableName}-${nameSuffix}`;

        new Route(this.scope, `${routeTableNameFull}-ipv4`, {
            routeTableId: routeTblId,
            destinationCidrBlock: this.valSettings.cidrIpv4PublicAll,
            gatewayId: this.resourceSettings.igw.id,
        });

        new Route(this.scope, `${routeTableNameFull}-ipv6`, {
            routeTableId: routeTblId,
            destinationIpv6CidrBlock: this.valSettings.cidrIpv6Public,
            gatewayId: this.resourceSettings.igw.id,
        });
    }

    /**
     * @description private ルートテーブルをinternet gatewayに関連付ける
     * @param routeTableName
     * @param nameSuffix
     * @param routeTblId
     * @private
     */
    private createRoutePrivate(routeTableName: string, nameSuffix: string, routeTblId: string): void {

        const routeTableNameFull: string = `${routeTableName}-${nameSuffix}`;

        new Route(this.scope, routeTableNameFull, {
            routeTableId: routeTblId,
            destinationIpv6CidrBlock: this.valSettings.cidrIpv6Private,
            gatewayId: this.resourceSettings.igwEngOnly.id,
        });
    }
}