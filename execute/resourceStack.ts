import {Construct} from "constructs";
import {ValSettings} from "../settings/valSettings";
import {VpcStack} from "../lib/network/vpc";
import {ResourceSettings} from "../settings/resourceSettings";
import {InternetGatewayStack} from "../lib/network/internetGateway";
import {RouteTableStack} from "../lib/network/routeTable";
import {SubnetStack} from "../lib/network/subnet";
import {RouteTableSubnetAttach} from "../lib/network/routeTableSubnetAttach";
import {InternetGatewayEngOnlyStack} from "../lib/network/internetGatewayEngOnly";
import {RouteStack} from "../lib/network/route";
import {SecurityGroupStack} from "../lib/network/securityGroup";
import {Ec2Stack} from "../lib/ec2/ec2Stack";
import {RdsStack} from "../lib/rds/rds";

/**
 * @description リソーススタックを作成する
 */
export class ResourceStack {
    // CDKTFの設定情報
    private readonly scope: Construct;

    // CDKTFの環境情報
    private readonly valSettings: ValSettings;

    private resourceSettings: ResourceSettings;

    /**
     * @description リソーススタックを作成する
     * @param scope
     * @param valSettings
     */
    constructor(scope: Construct, valSettings: ValSettings) {
        this.scope = scope;
        this.valSettings = valSettings;
        this.resourceSettings = new ResourceSettings();
    }

    /**
     * @description リソーススタックを作成する
     * @returns void
     */
    public createResources(): void {
        // ネットワークスタックを作成する
        this.createNetworkStack();

        // EC2スタックを作成する
        this.createEc2Stack();

        new RdsStack(this.scope, this.valSettings, this.resourceSettings, "rds").createResources();
    }

    /**
     * @description ネットワークスタックを作成する
     * @private
     * @returns void
     */
    private createNetworkStack(): void {

        // VPCを作成する
        new VpcStack(this.scope, this.valSettings, this.resourceSettings, "vpc").createResources();

        // ルートテーブルを作成する
        new RouteTableStack(this.scope, this.valSettings, this.resourceSettings, "rtbl").createResources();

        // Internet Gatewayを作成する
        new InternetGatewayStack(this.scope, this.valSettings, this.resourceSettings, "igw").createResources();

        // Internet Gateway Engress Onlyを作成する
        new InternetGatewayEngOnlyStack(this.scope, this.valSettings, this.resourceSettings, "egress-only-igw").createResources();

        // @todo プライベートサブネットからのipv4 or natが必要になったらリソースを作成する
        // internet gateway engress only の機能でプライベートサブネットのアウトバウンドトラフィックを制御する
        // natgateway用のeipを作成する
        // new ElasticIpStack(this.scope, this.valSettings, this.resourceSettings, "eip").createResourcesEip(this.valSettings.natgatewayEipKey)
        //
        // NatGatewayを作成する
        // new NatGatewayStack(this.scope, this.valSettings, this.resourceSettings).createResources();

        // ルートテーブルとゲートウェイを関連付ける
        new RouteStack(this.scope, this.valSettings, this.resourceSettings, "route").createResources();

        // サブネットを作成する
        new SubnetStack(this.scope, this.valSettings, this.resourceSettings, "subnet").createResources();

        // サブネット、ルートテーブルをアタッチする
        new RouteTableSubnetAttach(this.scope, this.valSettings, this.resourceSettings, "rta").createResources();

        // セキュリティグループを作成する
        new SecurityGroupStack(this.scope, this.valSettings, this.resourceSettings, "sg").createResources();
    }

    private createEc2Stack(): void {
        // ssh用 EC2スタックを作成する
        new Ec2Stack(this.scope, this.valSettings, this.resourceSettings, "ssh")
            .createResourcesEc2(this.valSettings.sshEc2KeyName,
                this.valSettings.sgSshKey,
                this.resourceSettings.subnet.primaryPublicSubnetId,
                true);
    }
}