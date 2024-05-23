import "cdktf/lib/testing/adapters/jest";
import {Eip} from "@cdktf/provider-aws/lib/eip";
import {ValSettings} from "../../../settings/valSettings";

/**
 * @description eipのテスト
 */
export class EipTest {

    /**
     * @description eipのテスト実行
     * @param synthesized
     * @param resourcesObj
     * @param valSettings
     */
    static doTest(synthesized: string, resourcesObj: any, valSettings: ValSettings) {

        expect(synthesized).toHaveResource(Eip);
        expect(resourcesObj).toHaveProperty("aws_eip");
        expect(Object.keys(resourcesObj["aws_eip"]).length).toBe(1);

        const eipObj = resourcesObj["aws_eip"];
        const eipId: string = `${valSettings.id}-natgw-eip`;
        expect(eipObj).toHaveProperty(eipId);
        expect(eipObj[eipId]["domain"]).toBe("vpc");
    }
}