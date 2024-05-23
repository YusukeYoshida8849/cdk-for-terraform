import {Construct} from "constructs";
import {ValSettings} from "../settings/valSettings";
import {S3Backend} from "cdktf";

/**
 * @description プロバイダーのステートを設定する
 */
export class ProviderStateStack {
    // CDKTFの設定情報
    private readonly scope: Construct;

    // CDKTFの環境情報
    private readonly valSettings: ValSettings;

    /**
     * @description コンストラクタ
     * @param scope
     * @param valSettings
     */
    constructor(scope: Construct, valSettings: ValSettings) {
        this.scope = scope;
        this.valSettings = valSettings;
    }

    /**
     * @description プロバイダーのステートを作成する
     */
    public createProviderStateStack(): S3Backend {
        // .tfstateをS3にUploadするための設定
        return new S3Backend(this.scope, {
            bucket: 'sample-tf-cdk-state-bucket',
            key: 'sample-tf-cdk.tfstate',
            region: this.valSettings.region,
        });
    }
}