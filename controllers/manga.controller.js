const axios = require('axios');
const cheerio = require('cheerio');

module.exports.getAllManga = async (req, res) => {
	const page = req.query.page || 1;
	const keyword = req.query.s;
	const url = req.protocol + '://' + req.get('host') + req.baseUrl;
	// let response;

	axios
		.get(`https://komikcast.com/daftar-komik/page/${page}/?sortby=update&type=manga`)
		.then((response) => {
			return res.json({ data: response.data });
		})
		.catch((err) => console.log(err.message));

	// try {
	// 	if (keyword) {
	// 		response = await axios.get(`https://komikcast.com/page/${page}/?s=${keyword}`);
	// 	} else {
	// 		response = await axios.get(`https://komikcast.com/daftar-komik/page/${page}/?sortby=update&type=manga`);
	// 	}
	// } catch (error) {
	// 	return res.json({ message: `something went wrong: ${error.message.toLowerCase()}` });
	// }

	// return res.json({
	// 	res: response.data.toString(),
	// });
	// const $ = cheerio.load(response.data);
	// const mangaList = [];
	// const mangaCount = $('.list-update_items-wrapper .list-update_item').length;

	// $('.list-update_items-wrapper .list-update_item').each((i, el) => {
	// 	const mangaTitle = $(el).find('.list-update_item-info .title').text();
	// 	const mangaThumbnail = $(el).find('.list-update_item-image img').attr('src');
	// 	const mangaSlug = $(el).find('a').attr('href').split('/')[4];
	// 	const mangaRating = $(el).find('.list-update_item-info .rating .numscore').text();

	// 	mangaList.push({
	// 		title: mangaTitle,
	// 		thumbnail: mangaThumbnail,
	// 		slug: mangaSlug,
	// 		rating: mangaRating,
	// 		detail_url: `${url}/${mangaSlug}`,
	// 	});
	// });

	// return res.json({
	// 	info: {
	// 		author: 'https://github.com/rickydamarsaputra',
	// 		source: 'https://komikcast.com',
	// 	},
	// 	next_page: keyword ? (mangaCount == 60 ? `${url}?s=${keyword}&page=${parseInt(page) + 1}` : null) : `${url}?page=${parseInt(page) + 1}`,
	// 	prev_page: page == 1 ? null : keyword ? `${url}?s=${keyword}&page=${parseInt(page) - 1}` : `${url}?page=${parseInt(page) - 1}`,
	// 	data: mangaList,
	// });
};

module.exports.getMangaBySlug = async (req, res) => {
	const { slug } = req.params;
	const url = req.protocol + '://' + req.get('host') + req.baseUrl;

	const { data } = await axios.get(`https://komikcast.com/manga/${slug}`);
	const $ = cheerio.load(data);

	const mangaTitle = $('.komik_info-content .komik_info-content-body .komik_info-content-body-title').text();
	const mangaThumbnail = $('.komik_info-content .komik_info-content-thumbnail img').attr('src');
	const mangaReleasedAt = $('.komik_info-content-meta .komik_info-content-info-release').text().split(':\n')[1].trim();
	const mangaMeta = {};
	const mangaGenre = [];
	const mangaSynopsis = $('.komik_info-description .komik_info-description-sinopsis p').text();
	const mangaChapters = [];

	$('.komik_info-content-meta span').each((i, el) => {
		const metaKey = $(el).text().split(':')[0].trim().toLowerCase().split(' ').join('_');
		const metaVal = $(el).text().split(':')[1].trim().toLowerCase();

		mangaMeta[metaKey] = metaVal;
	});

	$('.komik_info-content-genre .genre-item').each((i, el) => {
		mangaGenre.push($(el).text());
	});

	$('.komik_info-chapters-wrapper li').each((i, el) => {
		const chapterNumber = $(el).find('a').text().replace('Chapter ', '');
		const chapterSlug = $(el).find('a').attr('href').split('/')[4];
		const chapterRelease = $(el).find('.chapter-link-time').text().trim();

		mangaChapters.push({
			chapter: chapterNumber,
			slug: chapterSlug,
			release: chapterRelease,
			detail_url: `${url}/chapter/${chapterSlug}`,
		});
	});

	res.json({
		info: {
			author: 'https://github.com/rickydamarsaputra',
			source: 'https://komikcast.com',
		},
		data: {
			title: mangaTitle,
			thumbnail: mangaThumbnail,
			meta_info: mangaMeta,
			genre: mangaGenre,
			synopsis: mangaSynopsis,
			chapters: mangaChapters,
		},
	});
};

module.exports.getMangaChapterBySlug = async (req, res) => {
	const { slug } = req.params;
	const { data } = await axios.get(`https://komikcast.com/chapter/${slug}`);
	const $ = cheerio.load(data);

	const chapterImages = [];

	$('.main-reading-area img').each((i, el) => {
		const imageUrl = $(el).attr('src');

		chapterImages.push(imageUrl);
	});

	res.json({
		info: {
			author: 'https://github.com/rickydamarsaputra',
			source: 'https://komikcast.com',
		},
		data: chapterImages,
	});
};
