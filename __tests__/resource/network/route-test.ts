import "cdktf/lib/testing/adapters/jest";
import {ValSettings} from "../../../settings/valSettings";
import {RouteTable} from "@cdktf/provider-aws/lib/route-table";

/**
 * @description route tableのテスト
 */
export class RouteTest {

    /**
     * @description route tableのテスト実行
     * @param synthesized
     * @param resourcesObj
     * @param valSettings
     */
    static doTest(synthesized: string, resourcesObj: any, valSettings: ValSettings) {

        expect(synthesized).toHaveResource(RouteTable);
        expect(resourcesObj).toHaveProperty("aws_route");
        expect(Object.keys(resourcesObj["aws_route"]).length).toBe(6);

        const routeTableObj = resourcesObj["aws_route"];
        const routeArray: [string, string, string, string] = [
            'public-a',
            'public-c',
            'private-a',
            'private-c'
        ];

        routeArray.forEach((routeId: string) => {

            const routeName: string = `${valSettings.id}-route-${routeId}`;

            if (routeId.indexOf("public") === 0) {

                let wRouteName = "";

                if (routeId.endsWith("ipv6")) {
                    wRouteName = `${routeName}-ipv6`;
                    expect(routeTableObj).toHaveProperty(wRouteName);
                    expect(routeTableObj[wRouteName]["destination_ipv6_cidr_block"])
                        .toBe(valSettings.cidrIpv6Public);
                    expect(routeTableObj[wRouteName]).not.toHaveProperty("destination_cidr_block");

                } else {

                    wRouteName = `${routeName}-ipv4`;
                    expect(routeTableObj).toHaveProperty(wRouteName);
                    expect(routeTableObj[wRouteName]["destination_cidr_block"])
                        .toBe(valSettings.cidrIpv4PublicAll);
                    expect(routeTableObj[wRouteName]).not.toHaveProperty("destination_ipv6_cidr_block");
                }

                expect(routeTableObj[wRouteName]["route_table_id"])
                    .toBe("${aws_route_table." + valSettings.id + "-rtbl-" + routeId + ".id}");
                expect(routeTableObj[wRouteName]["gateway_id"])
                    .toBe("${aws_internet_gateway." + valSettings.id + "-igw.id}");

            } else {
                expect(routeTableObj[routeName]["destination_ipv6_cidr_block"])
                    .toBe(valSettings.cidrIpv6Private);
                expect(routeTableObj[routeName]["gateway_id"])
                    .toBe("${aws_egress_only_internet_gateway." + valSettings.id + "-egress-only-igw.id}");

            }
        });
    }
}