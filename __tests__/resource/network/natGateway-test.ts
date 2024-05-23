import "cdktf/lib/testing/adapters/jest";
import {ValSettings} from "../../../settings/valSettings";
import {NatGateway} from "@cdktf/provider-aws/lib/nat-gateway";

/**
 * @description nat gatewayのテスト
 */
export class NatGatewayTest {

    /**
     * @description nat gatewayのテスト実行
     * @param synthesized
     * @param resourcesObj
     * @param valSettings
     */
    static doTest(synthesized: string, resourcesObj: any, valSettings: ValSettings) {

        expect(synthesized).toHaveResource(NatGateway);
        expect(resourcesObj).toHaveProperty("aws_nat_gateway");
        expect(Object.keys(resourcesObj["aws_nat_gateway"]).length).toBe(1);

        const ngwObj = resourcesObj["aws_nat_gateway"];
        const ngwId: string = `${valSettings.id}-ngw`;
        expect(ngwObj).toHaveProperty(ngwId);
        expect(ngwObj[ngwId]["subnet_id"]).toBe("${aws_subnet." + valSettings.id + "-subnet-public-a.id}");
        expect(ngwObj[ngwId]["allocation_id"]).toBe("${aws_eip." + valSettings.id + "-natgw-eip.id}");
    }
}