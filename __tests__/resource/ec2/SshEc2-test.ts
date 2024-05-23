import "cdktf/lib/testing/adapters/jest";
import {ValSettings} from "../../../settings/valSettings";
import {Instance} from "@cdktf/provider-aws/lib/instance";
import {Eip} from "@cdktf/provider-aws/lib/eip";
import {DataAwsAmi} from "@cdktf/provider-aws/lib/data-aws-ami";
import {IamRole} from "@cdktf/provider-aws/lib/iam-role";
import {IamInstanceProfile} from "@cdktf/provider-aws/lib/iam-instance-profile";

/**
 * @description VPCのテスト
 */
export class SshEc2Test {

    /**
     * @description VPCのテスト実行
     * @param synthesized
     * @param resourcesObj
     * @param dataObj
     * @param valSettings
     */
    static doTest(synthesized: string, resourcesObj: any, dataObj: any, valSettings: ValSettings) {

        const sshBaseName: string = `${valSettings.id}-ec2-ssh`;

        this.doEc2RoleTest(sshBaseName, synthesized, resourcesObj);

        this.doEc2ProfileTest(sshBaseName, synthesized, resourcesObj);

        this.doRecentAmiTest(sshBaseName, synthesized, dataObj);

        this.doEc2Test(sshBaseName, synthesized, resourcesObj, valSettings);

        this.doEipTest(sshBaseName, synthesized, resourcesObj);
    }

    /**
     * @description Ec2Roleのテスト
     * @param sshBaseName
     * @param synthesized
     * @param resourcesObj
     * @private
     */
    private static doEc2RoleTest(sshBaseName: string, synthesized: string, resourcesObj: any) {

        const policy: string = JSON.stringify({
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
        });

        expect(synthesized).toHaveResource(IamRole);
        expect(resourcesObj).toHaveProperty("aws_iam_role");
        expect(Object.keys(resourcesObj["aws_iam_role"]).length).toBe(1);

        const roleObj = resourcesObj["aws_iam_role"];
        const roleName: string = `${sshBaseName}-role`;
        expect(roleObj).toHaveProperty(roleName);
        expect(roleObj[roleName]["name"]).toBe(roleName);
        expect(roleObj[roleName]["assume_role_policy"]).toBe(policy);
        expect(roleObj[roleName]["managed_policy_arns"][0]).toBe("arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore");
    }

    /**
     * @description Ec2Profileのテスト
     * @param sshBaseName
     * @param synthesized
     * @param resourcesObj
     * @private
     */
    private static doEc2ProfileTest(sshBaseName: string, synthesized: string, resourcesObj: any) {

        expect(synthesized).toHaveResource(IamInstanceProfile);
        expect(resourcesObj).toHaveProperty("aws_iam_instance_profile");
        expect(Object.keys(resourcesObj["aws_iam_instance_profile"]).length).toBe(1);

        const profileObj = resourcesObj["aws_iam_instance_profile"];
        const profileName: string = `${sshBaseName}-profile`;
        expect(profileObj).toHaveProperty(profileName);
        expect(profileObj[profileName]["name"]).toBe(profileName);
        expect(profileObj[profileName]["role"]).toBe("${aws_iam_role." + sshBaseName + "-role.name}");

    }

    /**
     * @description 最新のAMIのテスト
     * @param sshBaseName
     * @param synthesized
     * @param dataObj
     */
    private static doRecentAmiTest(sshBaseName: string, synthesized: string, dataObj: any) {
        expect(synthesized).toHaveDataSource(DataAwsAmi);
        expect(dataObj).toHaveProperty("aws_ami");
        expect(Object.keys(dataObj["aws_ami"]).length).toBe(1);

        const amiObj = dataObj["aws_ami"];
        const amiId: string = `${sshBaseName}-ami`;
        expect(amiObj).toHaveProperty(amiId);
        expect(amiObj[amiId]["most_recent"]).toBeTruthy();
        expect(amiObj[amiId]["owners"]).toStrictEqual(["amazon"]);
        expect(amiObj[amiId]["filter"]).toStrictEqual([{
            name: "name",
            values: ["amzn2023-ami-hvm-*-x86_64-gp2"]
        }]);

    }

    /**
     * @description Ec2のテスト
     * @param sshBaseName
     * @param synthesized
     * @param resourcesObj
     * @param valSettings
     * @private
     */
    private static doEc2Test(sshBaseName: string, synthesized: string, resourcesObj: any, valSettings: ValSettings) {
        expect(synthesized).toHaveResource(Instance);
        expect(resourcesObj).toHaveProperty("aws_instance");
        expect(Object.keys(resourcesObj["aws_instance"]).length).toBe(1);
        const instanceObj = resourcesObj["aws_instance"];

        expect(instanceObj).toHaveProperty(sshBaseName);

        if (valSettings.environment === "dev") {

            expect(instanceObj[sshBaseName]["disable_api_stop"]).toBeTruthy();
            expect(instanceObj[sshBaseName]["disable_api_termination"]).toBeTruthy();
        } else {
            expect(instanceObj[sshBaseName]["disable_api_stop"]).toBeFalsy();
            expect(instanceObj[sshBaseName]["disable_api_termination"]).toBeFalsy();
        }

        expect(instanceObj[sshBaseName]["ami"]).toBe("${data.aws_ami." + sshBaseName + "-ami.id}");
        expect(instanceObj[sshBaseName]["instance_type"]).toBe("t2.micro");
        expect(instanceObj[sshBaseName]["key_name"]).toBe(valSettings.sshEc2KeyName);
        expect(instanceObj[sshBaseName]["subnet_id"]).toBe("${aws_subnet." + valSettings.id + "-subnet-public-a.id}");
        expect(instanceObj[sshBaseName]["vpc_security_group_ids"]).toStrictEqual(["${aws_security_group." + valSettings.id + "-sg-forSshServer.id}"]);
    }

    /**
     * @description EIPのテスト
     * @param sshBaseName
     * @param synthesized
     * @param resourcesObj
     * @private
     */
    private static doEipTest(sshBaseName: string,
                             synthesized: string,
                             resourcesObj: any) {

        expect(synthesized).toHaveResource(Eip);
        expect(resourcesObj).toHaveProperty("aws_eip");
        expect(Object.keys(resourcesObj["aws_eip"]).length).toBe(1);

        const eipObj = resourcesObj["aws_eip"];
        const eipId: string = `${sshBaseName}-eip`;
        expect(eipObj).toHaveProperty(eipId);
        expect(eipObj[eipId]["domain"]).toBe("vpc");
        expect(eipObj[eipId]["instance"]).toBe("${aws_instance." + sshBaseName + ".id}");
    }
}