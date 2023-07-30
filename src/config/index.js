/***
 * 导入配置
 */
import { RequestHttpDev, RequestHttpPro } from './host';

console.log('env: ', process.env.NODE_ENV);
const url = window.location.origin;
// const isDev = process.env.NODE_ENV == 'development';
const isDev = true;
const baseUrl = isDev ? RequestHttpDev : RequestHttpPro;

export default {
	// 是否测试环境
	isDev: isDev,
	// 打印请求日志
	isPrintLog: isDev,
	// 请求url
	api: {
		sectionDetail: baseUrl + '/api/fairyland/section_detail',
		register: baseUrl + '/phantom/sections/register_record',
		record: baseUrl + '/phantom/sections/scan_record',
	},
	baseUrl,
	fileHost: baseUrl + '/img',
	ossHost: 'https://roboland-deliv.ubtrobot.com/',
	urlOrigin: url,
	contectNum:'13612927554'
};
