import {ValSettings} from "../settings/valSettings";

/**
 * @class CommonTagsUtils
 * @description 共通タグユーティリティ
 */
export class CommonTagsUtils {

    /**
     * @description 共通タグを取得する
     * @param valSettings { [key: string]: any } CDKTFの設定情報
     * @param addTags { [key: string]: string } 追加するタグ情報
     * @returns { [key: string]: string }
     */
    static getCommonTags(valSettings: ValSettings,
                         addTags: {[key:string]:string} = {}): { [key: string]: string } {

        const commonTags = {
            Environment: valSettings.environment,
            Project: valSettings.project,
            Owner: valSettings.owner,
            ManagedBy: "cdktf"
        }

        return Object.assign(commonTags, addTags);
    }
}