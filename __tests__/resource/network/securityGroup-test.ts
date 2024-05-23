import "cdktf/lib/testing/adapters/jest";
import {ValSettings} from "../../../settings/valSettings";
import {SecurityGroup} from "@cdktf/provider-aws/lib/security-group";

/**
 * @description セキュリティグループのテスト
 */
export class SecurityGroupTest {

    /**
     * @description セキュリティグループのテストを実行する
     * @param synthesized
     * @param resourcesObj
     * @param valSettings
     */
    static doTest(synthesized: string, resourcesObj: any, valSettings: ValSettings) {

        expect(synthesized).toHaveResource(SecurityGroup);
        expect(resourcesObj).toHaveProperty("aws_security_group");
        expect(Object.keys(resourcesObj["aws_security_group"]).length).toBe(1);

        this.sgSshTest(resourcesObj, valSettings);
    }

    /**
     * @description sshセキュリティグループのテストを実行する
     * @param resourcesObj
     * @param valSettings
     * @private
     */
    private static sgSshTest(resourcesObj: any, valSettings: ValSettings) {
        const sgObj = resourcesObj["aws_security_group"];
        const sgSshId: string = `${valSettings.id}-sg-forSshServer`;
        expect(sgObj).toHaveProperty(sgSshId);
        expect(sgObj[sgSshId]).toHaveProperty("ingress");
        expect(sgObj[sgSshId]).toHaveProperty("egress");

        const sgSshIngressObj: [any] = sgObj[sgSshId]["ingress"];
        expect(sgSshIngressObj.length).toBe(1);

        const sgSshEgressObj: [any] = sgObj[sgSshId]["egress"];
        expect(sgSshEgressObj.length).toBe(1);

        expect(sgSshIngressObj[0]["cidr_blocks"].length).toBe(1);
        expect(sgSshIngressObj[0]["cidr_blocks"][0]).toBe(valSettings.allowMyIp);
        expect(sgSshIngressObj[0]["from_port"]).toBe(22);
        expect(sgSshIngressObj[0]["to_port"]).toBe(22);
        expect(sgSshIngressObj[0]["protocol"]).toBe("TCP");

        expect(sgSshEgressObj[0]["cidr_blocks"].length).toBe(1);
        expect(sgSshEgressObj[0]["cidr_blocks"][0]).toBe(valSettings.cidrIpv4PublicAll);
        expect(sgSshEgressObj[0]["from_port"]).toBe(0);
        expect(sgSshEgressObj[0]["to_port"]).toBe(0);
        expect(sgSshEgressObj[0]["protocol"]).toBe("-1");

        expect(sgObj[sgSshId]["name"]).toBe(sgSshId);
        expect(sgObj[sgSshId]["vpc_id"]).toBe("${aws_vpc." + valSettings.id + "-vpc.id}");
    }
}