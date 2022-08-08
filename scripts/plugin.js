const { join } = require("path");
const moment = require("moment");

// 使 `hexo new` 生成的文件保存至相应的年份子文件夹中
// @see hexo/lib/plugins/filter/new_post_path.js
hexo.extend.filter.register(
	"new_post_path",
	(data) => {
		const year = moment(data.date || Date.now()).format("YYYY");
		data.path = join(year, data.slug);
		return data;
	},
	1
); // 设置为高优先级
