import "cdktf/lib/testing/adapters/jest";
import {ValSettings} from "../../../settings/valSettings";
import {RouteTable} from "@cdktf/provider-aws/lib/route-table";

/**
 * @description route tableのテスト
 */
export class RouteTableTest {

    /**
     * @description route tableのテスト実行
     * @param synthesized
     * @param resourcesObj
     * @param valSettings
     */
    static doTest(synthesized: string, resourcesObj: any, valSettings: ValSettings) {

        expect(synthesized).toHaveResource(RouteTable);
        expect(resourcesObj).toHaveProperty("aws_route_table");
        expect(Object.keys(resourcesObj["aws_route_table"]).length).toBe(4);

        const routeTableObj = resourcesObj["aws_route_table"];
        const routeTableIdArray: [string, string, string, string] = [
            `${valSettings.id}-rtbl-public-a`,
            `${valSettings.id}-rtbl-public-c`,
            `${valSettings.id}-rtbl-private-a`,
            `${valSettings.id}-rtbl-private-c`
        ];

        routeTableIdArray.forEach((routeTableId: string) => {
            expect(routeTableObj).toHaveProperty(routeTableId);
            expect(routeTableObj[routeTableId]["vpc_id"]).toBe("${aws_vpc." + valSettings.id + "-vpc.id}");
        });
    }
}