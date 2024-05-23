import {BaseStack} from "../BaseStack";
import {Instance} from "@cdktf/provider-aws/lib/instance";
import {DataAwsAmi} from "@cdktf/provider-aws/lib/data-aws-ami";
import {IamInstanceProfile} from "@cdktf/provider-aws/lib/iam-instance-profile";
import {IamRole} from "@cdktf/provider-aws/lib/iam-role";
import {CommonTagsUtils} from "../../utils/CommonTagsUtils";
import {Eip} from "@cdktf/provider-aws/lib/eip";
import {Construct} from "constructs";
import {ValSettings} from "../../settings/valSettings";
import {ResourceSettings} from "../../settings/resourceSettings";

/**
 * @description ssh Ec2を作成する
 * @param ec2KeyName Ec2のキーペア名
 * @param ec2SgKeyName Ec2のセキュリティグループキー名
 * @param ec2SubnetId Ec2のサブネットキー名
 * @param attachEipFlg EIPをアタッチするかどうか
 * @returns void
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_instance_profile
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami
 */
export class Ec2Stack extends BaseStack {

    constructor(scope: Construct,
                valSettings: ValSettings,
                resourceSettings: ResourceSettings,
                resourceName: string,
                id: string = "") {

        super(scope, valSettings, resourceSettings, resourceName, id);

        const wId = (id === "" ? this.valSettings.id : id);
        this.baseResourcesId = `${wId}-ec2-${resourceName}`;
    }

    /**
     * @description Ec2を作成する
     * @param ec2KeyName Ec2のキーペア名
     * @param ec2SgKeyName Ec2のセキュリティグループキー名
     * @param ec2SubnetId Ec2のサブネットキー名
     * @param attachEipFlg EIPをアタッチするかどうか
     * @returns void
     */
    public createResourcesEc2(ec2KeyName: string,
                              ec2SgKeyName: string,
                              ec2SubnetId: string,
                              attachEipFlg: boolean = false): void {
        const iamInstanceProfile: IamInstanceProfile = this.createIamInstanceProfile();

        const ec2Ami: DataAwsAmi = this.getAmi();

        const ec2Instance: Instance = this.createEc2Server(
            ec2KeyName, ec2SgKeyName, ec2SubnetId, ec2Ami, iamInstanceProfile);

        if (attachEipFlg) {
            this.attachEip(ec2Instance);
        }
    }

    /**
     * @description インスタンスプロファイルを作成する
     * @protected
     */
    protected createIamInstanceProfile(): IamInstanceProfile {
        const roleName: string = `${this.baseResourcesId}-role`;
        const profileName: string = `${this.baseResourcesId}-profile`;

        const ec2Role: IamRole = new IamRole(this.scope, roleName, {
            name: `${this.baseResourcesId}-role`,
            assumeRolePolicy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "sts:AssumeRole",
                        Effect: "Allow",
                        Principal: {
                            Service: "ec2.amazonaws.com",
                        },
                    },
                ],
            }),
            tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: roleName}),
            managedPolicyArns: [
                "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
            ]
        });

        return new IamInstanceProfile(this.scope, profileName, {
            name: profileName,
            role: ec2Role.name,
            tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: profileName})
        });
    }

    /**
     * @description Amiを取得する
     * @protected
     */
    protected getAmi(mostResentFlg: boolean = true): DataAwsAmi {
        return new DataAwsAmi(this.scope, `${this.baseResourcesId}-ami`, {
            mostRecent: mostResentFlg,
            owners: ["amazon"],
            filter: [
                {
                    name: "name",
                    values: ["amzn2023-ami-hvm-*-x86_64-gp2"]
                },
            ],
        });
    }

    /**
     * @description Ec2を作成する
     * @protected
     * @param ec2KeyName Ec2のキーペア名
     * @param ec2SgKeyName Ec2のセキュリティグループキー名
     * @param ec2SubnetId Ec2のサブネットキー名
     * @param ec2Ami Ec2のAmi
     * @param iamInstanceProfile インスタンスプロファイル
     * @returns Instance Ec2
     */
    protected createEc2Server(ec2KeyName: string,
                              ec2SgKeyName: string,
                              ec2SubnetId: string,
                              ec2Ami: DataAwsAmi,
                              iamInstanceProfile: IamInstanceProfile): Instance {

        return new Instance(this.scope, this.baseResourcesId, {
            ami: ec2Ami.id,
            instanceType: "t2.micro",
            iamInstanceProfile: iamInstanceProfile.name,
            vpcSecurityGroupIds: [
                this.resourceSettings.securityGroupSettings.idArray[ec2SgKeyName]
            ],
            disableApiStop: this.valSettings.environment === "dev",
            disableApiTermination: this.valSettings.environment === "dev",
            subnetId: ec2SubnetId,
            keyName: ec2KeyName,
            tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: this.baseResourcesId})
        });
    }

    /**
     * @description EIPをアタッチする
     * @param instance
     * @protected
     */
    protected attachEip(instance: Instance): void {

        const eipName: string = `${this.baseResourcesId}-eip`;
        new Eip(this.scope, eipName, {
            domain: "vpc",
            instance: instance.id,
            tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: eipName})
        });
    }
}