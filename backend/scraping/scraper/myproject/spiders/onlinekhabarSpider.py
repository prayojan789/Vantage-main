import re
from datetime import datetime, timedelta, timezone

import scrapy
from myproject.items import MyprojectItem


class OnlinekhabarspiderSpider(scrapy.Spider):
    name = "onlinekhabarSpider"
    allowed_domains = ["english.onlinekhabar.com"]
    start_urls = ["https://english.onlinekhabar.com/category/political"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cutoff_reached = False

    def parse(self, response):
        if self.cutoff_reached:
            return

        nepal_tz = timezone(timedelta(hours=5, minutes=45))
        cutoff = datetime.now(nepal_tz) - timedelta(days=320)

        articles = response.css(".ok-details-content-left .ok-news-post")
        for article in articles:
            inArticleUrl = article.css(".ok-post-contents a ::attr(href)").get()
            yield response.follow(
                inArticleUrl,
                callback=self.parseArticles,
                cb_kwargs={"cutoff": cutoff},
            )

        next_page = response.css(".nav-links a.next::attr(href)").get()
        if next_page:
            yield response.follow(next_page, callback=self.parse)

    def parseArticles(self, response, cutoff):
        nepal_tz = timezone(timedelta(hours=5, minutes=45))

        date_str = response.css(".ok-author span.ok-post-date::text").get()
        if not date_str:
            self.logger.warning(f"[NO DATE] {response.url}")
            return

        try:
            date_obj = datetime.strptime(date_str.strip(), "%A, %B %d, %Y")
        except ValueError as e:
            self.logger.warning(f"[BAD DATE '{date_str}'] {response.url} - {e}")
            return

        published_at = date_obj.replace(tzinfo=nepal_tz)

        if published_at < cutoff:
            self.logger.info(f"[CUTOFF] {published_at} < {cutoff}, stopping")
            self.cutoff_reached = True
            return

        raw_title = response.css(".ok-post-header h1::text").get()
        clean_title = raw_title.strip() if raw_title else ""

        raw_body = response.css(".post-content-wrap p::text").getall()
        raw_body = [p.strip() for p in raw_body if p.strip()]

        if raw_body and len(raw_body[0]) < 60 and re.match(r"^[A-Za-z]+,?\s+\w+\.?\s+\d+", raw_body[0]):
            raw_body = raw_body[1:]

        if not raw_body:
            self.logger.warning(f"[EMPTY BODY] {response.url}")
            return

        self.logger.info(f"[OK] {response.url}")
        # ... rest unchanged
        paragraph1 = raw_body[0]
        text = " ".join(raw_body)
        clean_body = re.sub(r"\s+", " ", text).strip()

        scraped_at = (
            datetime.now(nepal_tz).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
        )

        article_item = MyprojectItem()
        article_item["url"] = response.url
        article_item["title"] = clean_title
        article_item["paragraph1"] = paragraph1
        article_item["body"] = clean_body
        article_item["published_at"] = date_obj.strftime("%Y-%m-%d")
        article_item["scraped_at"] = scraped_at
        article_item["source"] = "onlinekhabar"

        yield article_item


    # json{
    #   "url": "...",
    #   "title": "...",
    #   "body": "...",
    #   "published_at": "2025-06-16T08:30:00+05:45",
    #   "scraped_at": "2025-06-16T10:00:00+05:45",
    #   "source": "republica"
    # }
