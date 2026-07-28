# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class MyprojectItem(scrapy.Item):
    url = scrapy.Field()
    title = scrapy.Field()
    paragraph1 = scrapy.Field()
    body = scrapy.Field()
    published_at = scrapy.Field()
    scraped_at = scrapy.Field()
    source = scrapy.Field()


# json{
#   "url": "...",
#   "title": "...",
#   "paragraph1": "...",
#   "body": "...",
#   "published_at": "2025-06-16T08:30:00+05:45",
#   "scraped_at": "2025-06-16T10:00:00+05:45",
#   "source": "republica"
# }
