/***
 * 导入配置
 */
import { RequestHttpDev, RequestHttpPro } from './host';

console.log('env: ', import.meta.env.MODE);
const url = window.location.origin;
const isDev = import.meta.env.MODE === 'development';
// const isDev = false;
const baseUrl = isDev ? RequestHttpDev : RequestHttpPro;

export default {
	// 是否测试环境
	isDev: isDev,
	// 打印请求日志
	isPrintLog: isDev,
	// 请求url
	api: {
		login: baseUrl + '/api/auth/login', //用户登录
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
