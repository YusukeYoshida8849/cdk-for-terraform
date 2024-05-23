import {Construct} from "constructs";
import {ValSettings} from "../settings/valSettings";
import {ResourceSettings} from "../settings/resourceSettings";

/**
 * @description ベーススタック
 * @argument scope Construct
 * @argument valSettings { [key: string]: any } CDKTFの設定情報
 * @argument resourceSettings CDKTFのリソース設定情報
 */
export class BaseStack {

    /**
     * @description CDKTFの設定情報
     * @protected
     * @readonly
     */
    protected readonly scope: Construct;

    /**
     * @description CDKTFの環境情報
     * @protected
     * @readonly
     */
    protected readonly valSettings: ValSettings;

    /**
     * @description CDKTFのリソース設定情報
     * @protected
     */
    protected resourceSettings: ResourceSettings;


    /**
     * @description CDKTFのリソース設定情報
     * @protected
     */
    protected baseResourcesId: string;

    constructor(scope: Construct,
                valSettings: ValSettings,
                resourceSettings: ResourceSettings,
                resourceName: string,
                id: string = "") {

        this.scope = scope;
        this.valSettings = valSettings;
        this.resourceSettings = resourceSettings;

        const wId = (id === "" ? this.valSettings.id : id);
        this.baseResourcesId = `${wId}-${resourceName}`;
    }

    /**
     * @description リソースを作成する
     * @returns void
     */
    public createResources(): void {
        this.setResourceSettings(this.doCreate());
    }

    /**
     * @description リソースを作成する
     * @returns void
     */
    // @ts-ignore
    protected doCreate(): any {
    };

    /**
     * @description リソースの設定情報を設定する
     * @param resource
     * @param addInfoMap
     */
    // @ts-ignore
    protected setResourceSettings(resource: any, addInfoMap: any = ""): any {
    };
}