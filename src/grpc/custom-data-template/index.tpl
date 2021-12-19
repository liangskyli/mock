// 自定义mock数据入口，文件不可删除。
import type { ICustomData } from 'packageName';
import { ActivityServiceData } from './template-data';

const CustomData: ICustomData = {
  // 自定义mock数据示例
  // key 对应proto文件夹下，服务文件里的path属性
  // ActivityServiceData 对应proto文件夹下，服务文件里的implementationData属性
  'serverName1.activity_package.ActivityService': ActivityServiceData,
};
export default CustomData;
