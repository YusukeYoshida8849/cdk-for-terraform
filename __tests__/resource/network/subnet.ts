import "cdktf/lib/testing/adapters/jest";
import {ValSettings} from "../../../settings/valSettings";
import {Subnet} from "@cdktf/provider-aws/lib/subnet";

/**
 * @description subnetのテスト
 */
export class SubnetTest {

    /**
     * @description subnetのテスト実行
     * @param synthesized
     * @param resourcesObj
     * @param valSettings
     */
    static doTest(synthesized: string, resourcesObj: any, valSettings: ValSettings) {

        expect(synthesized).toHaveResource(Subnet);
        expect(resourcesObj).toHaveProperty("aws_subnet");
        expect(Object.keys(resourcesObj["aws_subnet"]).length).toBe(4);

        const subnetObj = resourcesObj["aws_subnet"];
        const subnetIdArray: [string, string, string, string] = [
            `${valSettings.id}-subnet-public-a`,
            `${valSettings.id}-subnet-private-a`,
            `${valSettings.id}-subnet-public-c`,
            `${valSettings.id}-subnet-private-c`
        ];

        let i:number = 0;
        subnetIdArray.forEach((subnetId: string) => {
            expect(subnetObj).toHaveProperty(subnetId);
            expect(subnetObj[subnetId]["vpc_id"]).toBe("${aws_vpc." + valSettings.id + "-vpc.id}");
            expect(subnetObj[subnetId]["assign_ipv6_address_on_creation"]).toBe(true);
            expect(subnetObj[subnetId]["map_public_ip_on_launch"]).toBe(false);
            expect(subnetObj[subnetId]["cidr_block"])
                .toBe("${cidrsubnet(aws_vpc." + valSettings.id + "-vpc.cidr_block, 8, " + i + ")}");
            expect(subnetObj[subnetId]["ipv6_cidr_block"])
                .toBe("${cidrsubnet(aws_vpc." + valSettings.id + "-vpc.ipv6_cidr_block, 8, " + i + ")}");

            i++;
        });
    }
}