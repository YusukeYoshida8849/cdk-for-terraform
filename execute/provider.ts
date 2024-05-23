import {Construct} from "constructs";
import {ValSettings} from "../settings/valSettings";
import {AwsProvider} from "@cdktf/provider-aws/lib/provider";

/**
 * @description プロバイダーを設定する
 */
export class ProviderStack {
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
     * @description プロバイダーを作成する
     * @param id
     * @param region
     */
    public createProvider(id: string = "aws",
                          region: string = this.valSettings.region): AwsProvider {

        // 1. プロバイダーを設定する
        return new AwsProvider(this.scope, id,
            {
                region: region,
            });
    }
}