import "cdktf/lib/testing/adapters/jest";
import {ValSettings} from "../../../settings/valSettings";
import {RouteTableAssociation} from "@cdktf/provider-aws/lib/route-table-association";

/**
 * @description route tableとサブネットアタッチのテスト
 */
export class RoutetableSubnetAtTest {

    /**
     * @description route tableとサブネットアタッチのテスト実行
     * @param synthesized
     * @param resourcesObj
     * @param valSettings
     */
    static doTest(synthesized: string, resourcesObj: any, valSettings: ValSettings) {

        expect(synthesized).toHaveResource(RouteTableAssociation);
        expect(resourcesObj).toHaveProperty("aws_route_table_association");
        expect(Object.keys(resourcesObj["aws_route_table_association"]).length).toBe(4);

        const routeTableObj = resourcesObj["aws_route_table_association"];
        const routeTableArray: [string, string, string, string] = [
            `public-a`,
            `public-c`,
            `private-a`,
            `private-c`
        ];

        routeTableArray.forEach((zone: string) => {

            const routeTableAtId: string = `${valSettings.id}-rta-${zone}`;
            const routeTableId: string = "${aws_route_table." + valSettings.id + "-rtbl-" + zone + ".id}";
            const subnetId: string = "${aws_subnet." + valSettings.id + "-subnet-" + zone + ".id}";

            expect(routeTableObj).toHaveProperty(routeTableAtId);
            expect(routeTableObj[routeTableAtId]["route_table_id"]).toBe(routeTableId);
            expect(routeTableObj[routeTableAtId]["subnet_id"]).toBe(subnetId);
        });
    }
}