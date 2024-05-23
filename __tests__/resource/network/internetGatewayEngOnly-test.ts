import "cdktf/lib/testing/adapters/jest";
import {ValSettings} from "../../../settings/valSettings";
import {EgressOnlyInternetGateway} from "@cdktf/provider-aws/lib/egress-only-internet-gateway";

/**
 * @description internet gateway engress onlyのテスト
 */
export class InternetGatewayEngOnlyTest {

    /**
     * @description internet gateway engress onlyのテスト実行
     * @param synthesized
     * @param resourcesObj
     * @param valSettings
     */
    static doTest(synthesized: string, resourcesObj: any, valSettings: ValSettings) {

        expect(synthesized).toHaveResource(EgressOnlyInternetGateway);
        expect(resourcesObj).toHaveProperty("aws_egress_only_internet_gateway");
        expect(Object.keys(resourcesObj["aws_egress_only_internet_gateway"]).length).toBe(1);

        const igwObj = resourcesObj["aws_egress_only_internet_gateway"];
        const igwId: string = `${valSettings.id}-egress-only-igw`;
        expect(igwObj).toHaveProperty(igwId);
        expect(igwObj[igwId]["vpc_id"]).toBe("${aws_vpc." + valSettings.id + "-vpc.id}");
    }
}