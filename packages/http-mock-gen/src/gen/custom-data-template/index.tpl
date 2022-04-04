// 自定义mock数据入口，文件不可删除。
import type { ICustomData } from 'packageName';
import { BuildingData } from './template-data';

const CustomData: ICustomData = {
  // 自定义mock数据示例
  // BuildingData 对应接口数据
  ...BuildingData,
};
export default CustomData;

