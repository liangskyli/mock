// 自定义mock数据入口，文件不可删除。
import type { ICustomsData } from '@liangskyli/http-mock-gen';
import { TemplateData } from './template-data';

const CustomData: ICustomsData = {
  // 自定义mock数据示例
  // TemplateData 对应接口数据
  ...TemplateData,
};
export default CustomData;
