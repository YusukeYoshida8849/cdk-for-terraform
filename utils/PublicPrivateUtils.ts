/**
 * @class PublicPrivateUtils
 * @description パブリック・プライベートの文字列を取得するユーティリティクラス
 */
export class PublicPrivateUtils {


    /**
     * @description getPublicPrivate
     * @argument availabilityZone { [key: string]: string }
     * @argument publicFlg boolean
     * @returns string ex. public-a、private-a
     */
    static getPublicPrivate(availabilityZone: { [key: string]: string }, publicFlg: boolean): string {
        return publicFlg ? `public-${availabilityZone["suffix"]}` : `private-${availabilityZone["suffix"]}`;
    }

    /**
     * @description getAllPublicPrivate
     * @argument availabilityZone { [key: string]: { [key: string]: string } }
     * @returns { [key: string]: any[] }
     */
    static getAllPublicPrivate(
        availabilityZone: { [key: string]: { [key: string]: string } }): { [key: string]: any[] } {

        let publicList: any[] = [];
        let privateList: any[] = [];

        Object.keys(availabilityZone).forEach((key: string) => {
            const availability: { [key: string]: string } = availabilityZone[key];

            publicList.push(this.getPublicPrivate(availability, true))
            privateList.push(this.getPublicPrivate(availability, false));
        });

        return {
            'public': publicList,
            'private': privateList
        }
    }

    /**
     * @description getPrimaryPublicSubnetId
     * @argument primaryFlg boolean
     * @argument availabilityZone { [key: string]: string }
     * @returns string
     */
    static getPrimaryPublicSubnetId(primaryFlg: boolean, availabilityZone: { [key: string]: string }) {
        return primaryFlg ? `public-${availabilityZone["suffix"]}` : '';
    }
}