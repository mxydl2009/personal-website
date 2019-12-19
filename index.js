// 引入express框架
var express = require('express');
var getWeibo = require('./lib/getWeibo');
// 实例化一个express应用
var app = express();

var handlebars = require('express-handlebars').create({
	defaultLayout: 'main',
	helpers: {
		// section: function (name, options) {
		// 	if (!this._sections) this._sections = {};
		// 	this._sections[name] = options.fn(this);
		// 	return null;
		// },
		// static: function (name) {
		// 	return require('./lib/static.js').map(name);
		// }
	}
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 8016);

app.use(express.static('public'));

// 首页
app.get('/', function (req, res) {
	getWeibo('2.00vLlrkCsgRXCBd89b2f9c8dhzsUNC', 3, function (result) { 
		var formattedWeibo = [];
		result.forEach(function (item, index) {
			item.created_at = new Date(item.created_at).toDateString();
			item.text = item.text.replace(/\s{2,}/g, ' '); // 去掉文本中多余的空格
			if (item.retweeted_status) {
				item.retweeted_status.text = item.retweeted_status.text.replace(/\s{2,}/g, ' ');
				var linkIndex = item.retweeted_status.text.indexOf('http');
				if (linkIndex > -1) {
					item.link = item.retweeted_status.text.slice(linkIndex).replace(/^http:\/\/t.cn\//g, 'http:\/\/123.125.106.196\/');
					item.link = encodeURI(item.link).replace('%20%E2%80%8B', '');
					item.retweeted_status.text = item.retweeted_status.text.slice(0, linkIndex).trim();
				}
			}
			formattedWeibo.push(item);
		})
		res.render('home', {weibos: formattedWeibo});
	});
    
})

// profile简历
app.get('/profile', function (req, res) {
    res.render('profile');
})

// hobby兴趣爱好
app.get('/hobby', function (req, res) {
    res.render('hobby');
})

// 先设计普通的404页面，后面再更新
app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
})
// 定制500页面，后面再更新
app.use(function (req, res) {
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
})
 
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + ';');
})