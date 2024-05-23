import {Construct} from "constructs";
import {App, TerraformStack} from "cdktf";
import {ValSettings} from "./settings/valSettings";
import {ProviderStack} from "./execute/provider";
import {ProviderStateStack} from "./execute/providerState";
import {ResourceStack} from "./execute/resourceStack";

/**
 * @description CDKTFでVPCを作成する
 * @argument scope Construct
 * @argument id string
 * @argument envStackConfig { [key: string]: any } 環境設定情報
 */
export class CreateStack extends TerraformStack {

    private readonly valSettings: ValSettings;

    constructor(scope: Construct, id: string, envStackConfig: { [key: string]: any }) {
        super(scope, id);

        this.valSettings = new ValSettings(id, envStackConfig);

        // 1. プロバイダーを設定する
        new ProviderStack(this, this.valSettings).createProvider();

        // 2. .tfstateをS3にUploadするための設定
        new ProviderStateStack(this, this.valSettings).createProviderStateStack();

        // 3. リソーススタックを作成する
        new ResourceStack(this, this.valSettings).createResources();
    }
}

const app = new App();
new CreateStack(app, "sample-dev", {
    environment: "dev"
});
new CreateStack(app, "sample-stg", {
    environment: "stg"
});
new CreateStack(app, "sample-prd", {
    environment: "prod"
});
app.synth();
