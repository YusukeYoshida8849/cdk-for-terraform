import {BaseStack} from "../BaseStack";
import {SecurityGroup} from "@cdktf/provider-aws/lib/security-group";
import {CommonTagsUtils} from "../../utils/CommonTagsUtils";
import {SecurityGroupRule} from "@cdktf/provider-aws/lib/security-group-rule";

/**
 * @description セキュリティグループを作成する
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule
 */
export class SecurityGroupStack extends BaseStack {

    /**
     * @description セキュリティグループを作成する
     * @override
     * @returns void
     */
    public createResources(): void {
        // sshセキュリティグループを作成する
        this.setResourceSettings(
            this.createSshSgGroup(`${this.baseResourcesId}-${this.valSettings.sgSshKey}`)
            , this.valSettings.sgSshKey);

        // Rdsセキュリティグループを作成する
        this.setResourceSettings(
            this.createRdsSgGroup(`${this.baseResourcesId}-${this.valSettings.sgRdsKey}`)
            , this.valSettings.sgRdsKey);

        // sshサーバーのアウトバウンド
        // sshサーバーからrdsへのセキュリティグループルールを作成する
        this.createSgGroupRule(
            `${this.baseResourcesId}-${this.valSettings.sgSshKey}-to-${this.valSettings.sgRdsKey}`,
            this.resourceSettings.securityGroupSettings.idArray[this.valSettings.sgSshKey],
            "egress",
            "TCP",
            3306,
            3306,
            this.resourceSettings.securityGroupSettings.idArray[this.valSettings.sgRdsKey]);

        // rdsのインバウンド
        // rdsからsshサーバーへのセキュリティグループルールを作成する
        this.createSgGroupRule(
            `${this.baseResourcesId}-${this.valSettings.sgRdsKey}-to-${this.valSettings.sgSshKey}`,
            this.resourceSettings.securityGroupSettings.idArray[this.valSettings.sgRdsKey],
            "ingress",
            "TCP",
            3306,
            3306,
            this.resourceSettings.securityGroupSettings.idArray[this.valSettings.sgSshKey]);
    }

    /**
     * @description リソース設定情報を保持する
     * @param securityGroup
     * @param keyName
     * @protected
     * @override
     */
    protected setResourceSettings(securityGroup: SecurityGroup, keyName: string): void {
        this.resourceSettings.securityGroupSettings.idArray[keyName] = securityGroup.id;
    }

    /**
     * @description sshセキュリティグループを作成する
     * @param id
     * @returns SecurityGroup
     * @private
     */
    private createSshSgGroup(id: string): SecurityGroup {

        return new SecurityGroup(this.scope, id, {
            name: id,
            description: "for ssh connection only my ip",
            vpcId: this.resourceSettings.vpc.id,

            // インバウンド：sshのみ許可
            ingress: [{
                description: "allow ssh connection",
                fromPort: 22,
                toPort: 22,
                protocol: 'TCP',
                cidrBlocks: [
                    this.valSettings.allowMyIp
                ]
            }],
            egress: [{
                fromPort: 0,
                toPort: 0,
                protocol: "-1",
                cidrBlocks: [this.valSettings.cidrIpv4PublicAll]
            }],
            tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: id}),
        });
    }

    private createRdsSgGroup(id: string): SecurityGroup {

        return new SecurityGroup(this.scope, id, {
            name: id,
            description: "for rds connection",
            vpcId: this.resourceSettings.vpc.id,
            tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: id}),
        });
    }

    /**
     * @description セキュリティグループルールを作成する
     * @param sgGroupIdName
     * @param sgGroupId
     * @param type
     * @param protocol
     * @param fromPort
     * @param toPort
     * @param sourceSgGroupId
     * @private
     */
    private createSgGroupRule(sgGroupIdName: string,
                              sgGroupId: string,
                              type: string,
                              protocol: string,
                              fromPort: number,
                              toPort: number,
                              sourceSgGroupId: string): void {

        new SecurityGroupRule(this.scope, sgGroupIdName, {
            type: type,
            securityGroupId: sgGroupId,
            protocol: protocol,
            fromPort: fromPort,
            toPort: toPort,
            sourceSecurityGroupId: sourceSgGroupId
        });
    }
}