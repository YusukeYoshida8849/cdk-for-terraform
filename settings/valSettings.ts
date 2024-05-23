/**
 * @description CDKTFの設定情報を保持する
 */
export class ValSettings {

    /**
     * @description id
     * @type string
     */
    public readonly id: string;

    /**
     * @description environment
     * @type string
     */
    public readonly environment: string;

    /**
     * @description プロジェクト名
     * @type string
     */
    public readonly project: string;

    /**
     * @description プロジェクトオーナー
     * @type string
     */
    public readonly owner: string;

    /**
     * @description リージョン（ベース）
     * @type string
     */
    public readonly region: string;

    /**
     * @description CIDR ipv4 10.0.0.0/16
     * @type string
     */
    public readonly cidrIpv4: string;


    /**
     * @description CIDR ipv4 0.0.0.0/0
     * @type string
     */
    public readonly cidrIpv4PublicAll: string;

    /**
     * @description for_nat
     * @type string
     */
    public readonly natgatewayEipKey: string;

    /**
     * @description availabilityZone
     * @type string
     */
    public readonly availabilityZone: { [key: string]: { [key: string]: string } };

    /**
     * @description CIDR ipv6 public
     * @type string
     */
    public readonly cidrIpv6Public: string;
    /**
     * @description CIDR ipv6 private
     * @type string
     */
    public readonly cidrIpv6Private: string;

    /**
     * @description for ssh server セキュリティグループ名
     * @type string
     */
    public readonly sgSshKey: string;

    /**
     * @description for rds セキュリティグループ名
     * @type string
     */
    public readonly sgRdsKey: string;

    /**
     * @description 許可IP
     * @type string
     */
    public readonly allowMyIp: string;

    /**
     * @description ssh ec2 key name
     * @type string
     */
    public readonly sshEc2KeyName: string;

    /**
     * @description CDKTFの設定情報を保持する
     * @argument id string
     * @param envStackConfig { [key: string]: any } 環境設定情報
     */
    constructor(id: string, envStackConfig: { [p: string]: any }) {

        // id
        this.id = id;

        // プロジェクト名
        this.environment = envStackConfig.environment;

        // プロジェクト名
        this.project = "sample";

        // プロジェクトオーナー
        this.owner = "sample";

        // リージョン（ベース）
        this.region = "ap-northeast-1";

        // CIDR ipv4
        this.cidrIpv4 = '10.0.0.0/16';

        // CIDR ipv4 0.0.0.0/0
        this.cidrIpv4PublicAll = '0.0.0.0/0';

        // CIDR ipv6 public
        this.cidrIpv6Public = '::/0';

        // CIDR ipv6 private
        this.cidrIpv6Private = '64:ff9b::/96';

        // Availability Zone
        this.availabilityZone = {
            "primary": {
                "zone": "ap-northeast-1a",
                "suffix": "a"
            },
            "secondary": {
                "zone": "ap-northeast-1c",
                "suffix": "c"
            }
        };

        // for_nat
        this.natgatewayEipKey = "natgw";

        // for ssh server セキュリティグループ名
        this.sgSshKey = "forSshSg";

        // for rds セキュリティグループ名
        this.sgRdsKey = "forRdsSg";

        // 許可IP
        this.allowMyIp = "xxx.xxx.xxx.xxx/32";

        // ssh ec2 key name
        this.sshEc2KeyName = "sample_develop";
    }
}