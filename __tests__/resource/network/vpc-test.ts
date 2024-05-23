import "cdktf/lib/testing/adapters/jest";
import {Vpc} from "@cdktf/provider-aws/lib/vpc";
import {ValSettings} from "../../../settings/valSettings";

/**
 * @description VPCのテスト
 */
export class VpcTest {

    /**
     * @description VPCのテスト実行
     * @param synthesized
     * @param resourcesObj
     * @param valSettings
     */
    static doTest(synthesized: string, resourcesObj: any, valSettings: ValSettings) {

        expect(synthesized).toHaveResource(Vpc);
        expect(resourcesObj).toHaveProperty("aws_vpc");
        expect(Object.keys(resourcesObj["aws_vpc"]).length).toBe(1);

        const vpcObj = resourcesObj["aws_vpc"];
        const vpcId: string = `${valSettings.id}-vpc`;
        expect(vpcObj).toHaveProperty(vpcId);
        expect(vpcObj[vpcId]["assign_generated_ipv6_cidr_block"]).toBe(true);
        expect(vpcObj[vpcId]["enable_dns_hostnames"]).toBe(true);
        expect(vpcObj[vpcId]["enable_dns_support"]).toBe(true);
        expect(vpcObj[vpcId]["cidr_block"]).toBe(valSettings.cidrIpv4);
    }
}