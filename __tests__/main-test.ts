import "cdktf/lib/testing/adapters/jest";
import {CreateStack} from "../main";
import {App, Testing} from "cdktf";
import {ValSettings} from "../settings/valSettings";
import {VpcTest} from "./resource/network/vpc-test";
import {RouteTableTest} from "./resource/network/routetable-test";
import {SubnetTest} from "./resource/network/subnet";
import {RoutetableSubnetAtTest} from "./resource/network/routetableSubnetAt-test";
import {InternetGatewayTest} from "./resource/network/internetGateway-test";
import {RouteTest} from "./resource/network/route-test";
import {InternetGatewayEngOnlyTest} from "./resource/network/internetGatewayEngOnly-test";
import {SecurityGroupTest} from "./resource/network/securityGroup-test";
import {SshEc2Test} from "./resource/ec2/SshEc2-test";

/**
 * @description CDKTF CreateStackのテスト
 * @resource VpcTest
 */

describe("My CDKTF CreateStack", () => {
    // The tests below are example tests, you can find more information at
    // https://cdk.tf/testing
    const app: App = Testing.app();
    const stack: CreateStack = new CreateStack(app, "test", {environment: "dev"});
    const valSettings: ValSettings = new ValSettings("test", {environment: "dev"});

    const synthesized: string = Testing.synth(stack);
    const jsonObject = JSON.parse(synthesized)

    // 共通
    it('common', () => {
        expect(jsonObject).toHaveProperty("provider");
        expect(jsonObject).toHaveProperty("resource");
        expect(jsonObject).toHaveProperty("data");
        expect(jsonObject).toHaveProperty("terraform");

        expect(jsonObject["provider"]).toHaveProperty("aws");
        expect(jsonObject["provider"]["aws"][0]).toHaveProperty("region");
        expect(jsonObject["provider"]["aws"][0]["region"]).toBe(valSettings.region);
    });

    const resourcesObj = jsonObject["resource"];
    const dataObj = jsonObject["data"];

    it("vpc", () => {
        VpcTest.doTest(synthesized, resourcesObj, valSettings);
    });

    it("routeTable", () => {
        RouteTableTest.doTest(synthesized, resourcesObj, valSettings);
    });

    it("internet gateway", () => {
        InternetGatewayTest.doTest(synthesized, resourcesObj, valSettings);
    });

    it("internet gateway engress only", () => {
        InternetGatewayEngOnlyTest.doTest(synthesized, resourcesObj, valSettings);
    });

    // internet gateway engress only の機能でプライベートサブネットのアウトバウンドトラフィックを制御する
    // it("eip", () => {
    //     EipTest.doTest(synthesized, resourcesObj, valSettings);
    // });
    //
    // it("nat gateway", () => {
    //     NatGatewayTest.doTest(synthesized, resourcesObj, valSettings);
    // });

    it("route", () => {
        RouteTest.doTest(synthesized, resourcesObj, valSettings);
    });

    it("subnet", () => {
        SubnetTest.doTest(synthesized, resourcesObj, valSettings);
    });

    it("routetable subnet attach", () => {
        RoutetableSubnetAtTest.doTest(synthesized, resourcesObj, valSettings);
    });

    it("security groups", () => {
        SecurityGroupTest.doTest(synthesized, resourcesObj, valSettings);
    });

    it("ec2 for ssh", () => {
        SshEc2Test.doTest(synthesized, resourcesObj, dataObj, valSettings);
    });
});
