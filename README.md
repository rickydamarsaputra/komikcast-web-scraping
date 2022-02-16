# komikcast-web-scraping

nodejs web scraping using cheerio

info source: [https://komikcast.com](https://komikcast.com)

## API Reference

#### Get all manga

```http
  GET /api/v1/manga
```

| Parameter | Type     | Description                                                |
| :-------- | :------- | :--------------------------------------------------------- |
| `s`       | `string` | **Optional**. Keyword for search specific manga            |
| `page`    | `number` | **Optional**. For pagination pages, default value is **1** |

#### Get single manga by slug

```http
  GET /api/v1/manga/{slug}
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `slug`    | `string` | **Required**. for get detail manga |

#### Get manga chapter image by chapter slug

```http
  GET /api/v1/manga/chapter/{chapter_slug}
```

| Parameter      | Type     | Description                                                                           |
| :------------- | :------- | :------------------------------------------------------------------------------------ |
| `chapter_slug` | `string` | **Required**. for get all image manga, get from slug in single manga part of chapters |
