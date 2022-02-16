const router = require('express').Router();

const mangaController = require('../controllers/manga.controller');

router.get('/', (req, res) => mangaController.getAllManga(req, res));
router.get('/:slug', (req, res) => mangaController.getMangaBySlug(req, res));
router.get('/chapter/:slug', (req, res) => mangaController.getMangaChapterBySlug(req, res));

module.exports = router;
