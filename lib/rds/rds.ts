import {BaseStack} from "../BaseStack";
import {DbSubnetGroup} from "@cdktf/provider-aws/lib/db-subnet-group";
import {CommonTagsUtils} from "../../utils/CommonTagsUtils";
import {PublicPrivateUtils} from "../../utils/PublicPrivateUtils";

/**
 * @description RDSスタック
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_instance
 * @link https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_subnet_group
 */
export class RdsStack extends BaseStack {

    public createResources(): void {
        this.createDbSubnetGroup();
    }

    private createDbSubnetGroup(): DbSubnetGroup {

        const subnetGrpName = `${this.baseResourcesId}-subnet-group`;
        const subnetList: { [key: string]: any[] }
            = PublicPrivateUtils.getAllPublicPrivate(this.valSettings.availabilityZone);

        let subnetIds: string[] = [];

        Object.keys(subnetList).forEach((key: string) => {
            if (key === "private") {
                const subnetPrivateKeys: any[] = subnetList[key];

                subnetPrivateKeys.forEach((key: string) => {
                    subnetIds.push(this.resourceSettings.subnet.idArray[key]);
                });
            }
        });

        return new DbSubnetGroup(
            this.scope,
            subnetGrpName,
            {
                name: subnetGrpName,
                subnetIds: subnetIds,
                tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: subnetGrpName}),
            },
        );
    }
}