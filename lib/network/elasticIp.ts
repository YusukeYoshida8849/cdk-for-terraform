import {BaseStack} from "../BaseStack";
import {CommonTagsUtils} from "../../utils/CommonTagsUtils";
import {Eip} from "@cdktf/provider-aws/lib/eip";

/**
 * @description ElasticIpを作成する
 */
export class ElasticIpStack extends BaseStack {

    private domain: string = "vpc";
    private addKey: string = "";

    /**
     * @description ElasticIpを作成する
     * @param addId
     * @param domain string ElasticIpのドメイン
     * @returns void
     */
    public createResourcesEip(addId: string, domain: string = ""): void {

        if (domain !== "") {
            this.domain = domain;
        }

        this.addKey = addId;

        this.baseResourcesId = `${this.baseResourcesId}-${this.addKey}-eip`;
        this.setResourceSettings(this.doCreate(), {"keyname": addId});
    }

    /**
     * @description ElasticIpリソースを作成する
     * @private
     * @returns Eip
     */
    protected doCreate(): Eip {
        return new Eip(this.scope, this.baseResourcesId, {
            domain: this.domain,
            tags: CommonTagsUtils.getCommonTags(this.valSettings, {Name: this.baseResourcesId})
        });
    }

    /**
     * @description EIPの設定情報を設定する
     * @param eip Eip
     * @param addInfoMap
     * @private
     */
    protected setResourceSettings(eip: Eip, addInfoMap: { [key: string]: any }): void {

        this.resourceSettings.eip.idArray[addInfoMap["keyName"]] = eip.id;
    }
}