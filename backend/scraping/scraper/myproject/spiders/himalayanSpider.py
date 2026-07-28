import re
from datetime import datetime, timedelta, timezone

import scrapy

from myproject.items import MyprojectItem


class HimalayanspiderSpider(scrapy.Spider):
    name = "himalayanSpider"
    allowed_domains = ["thehimalayantimes.com"]
    start_urls = ["https://thehimalayantimes.com/morearticles/Kathmandu?pgno=1"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.page = 1

    def parse(self, response):
        nepal_tz = timezone(timedelta(hours=5, minutes=45))
        cutoff = datetime.now(nepal_tz) - timedelta(days=365)

        articles = response.css("div.post_list article.animate-box")
        for article in articles:
            inArticleUrl = article.css("h3 a ::attr(href)").get()
            yield response.follow(
                inArticleUrl,
                callback=self.parseArticle,
                cb_kwargs={"cutoff": cutoff},
            )

        self.page += 1
        next_page = (
            f"https://thehimalayantimes.com/morearticles/Kathmandu?pgno={self.page}"
        )
        yield response.follow(next_page, callback=self.parse)

    def parseArticle(self, response, cutoff):
        nepal_tz = timezone(timedelta(hours=5, minutes=45))

        raw_date = response.css("div.article_date::text").get()
        if not raw_date:
            return

        cleaned = raw_date.replace("Published:", "").strip()
        try:
            published_at_naive = datetime.strptime(cleaned, "%I:%M %p %b %d, %Y")
        except ValueError:
            self.logger.warning(f"Could not parse date: {cleaned!r} at {response.url}")
            return

        published_at = published_at_naive.replace(tzinfo=nepal_tz)

        if published_at < cutoff:
            self.logger.info(f"Reached cutoff date, stopping: {published_at}")
            return

        paragraphs = response.css(".dropcap p ::text").getall()
        if not paragraphs:
            return

        paragraph1 = paragraphs[1].strip()
        full_body = re.sub(
            r"\s+", " ", " ".join([p.strip() for p in paragraphs])
        ).strip()

        scraped_at = (
            datetime.now(nepal_tz).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
        )

        article_item = MyprojectItem()
        article_item["url"] = response.url
        article_item["title"] = response.css("h1::text").get().strip()
        article_item["paragraph1"] = paragraph1
        article_item["body"] = full_body
        article_item["published_at"] = published_at.strftime("%Y-%m-%d")
        article_item["scraped_at"] = scraped_at
        article_item["source"] = "himalayan_times"

        yield article_item


# json{
#   "url": "...",
#   "title": "...",
#   "paragraph1": "...",
#   "body": "...",
#   "published_at": "2025-06-16T08:30:00+05:45",
#   "scraped_at": "2025-06-16T10:00:00+05:45",
#   "source": "republica"
# }
