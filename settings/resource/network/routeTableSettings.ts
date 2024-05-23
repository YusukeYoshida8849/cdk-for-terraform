/**
 * @description Route tableリソース設定情報を保持する
 */
export class RouteTableSettings {

    /**
     * @description routetable.array {name:id}：ex.{public-a: routeTableId}
     */
    public idArray: { [key: string]: string } = {};
}