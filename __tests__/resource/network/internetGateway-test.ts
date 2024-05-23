import "cdktf/lib/testing/adapters/jest";
import {ValSettings} from "../../../settings/valSettings";
import {InternetGateway} from "@cdktf/provider-aws/lib/internet-gateway";

/**
 * @description internet gatewayのテスト
 */
export class InternetGatewayTest {

    /**
     * @description internet gatewayのテスト実行
     * @param synthesized
     * @param resourcesObj
     * @param valSettings
     */
    static doTest(synthesized: string, resourcesObj: any, valSettings: ValSettings) {

        expect(synthesized).toHaveResource(InternetGateway);
        expect(resourcesObj).toHaveProperty("aws_internet_gateway");
        expect(Object.keys(resourcesObj["aws_internet_gateway"]).length).toBe(1);

        const igwObj = resourcesObj["aws_internet_gateway"];
        const igwId: string = `${valSettings.id}-igw`;
        expect(igwObj).toHaveProperty(igwId);
        expect(igwObj[igwId]["vpc_id"]).toBe("${aws_vpc." + valSettings.id + "-vpc.id}");
    }
}