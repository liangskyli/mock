// 自定义mock数据入口，文件不可删除。
import type { ICustomData } from 'packageName';
import { ActivityData } from './template-data';

const CustomData: ICustomData = {
  // 自定义mock数据示例
  // ActivityData 对应活动接口数据
  ...ActivityData,
};
export default CustomData;

