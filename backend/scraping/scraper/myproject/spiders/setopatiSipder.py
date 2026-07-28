import re
from datetime import datetime, timedelta, timezone

import scrapy
from myproject.items import MyprojectItem


class SetopatisipderSpider(scrapy.Spider):
    name = "setopatiSipder"
    allowed_domains = ["en.setopati.com"]
    start_urls = ["https://en.setopati.com/political"]

    def parse(self, response):
        nepal_tz = timezone(timedelta(hours=5, minutes=45))
        cutoff = datetime.now(nepal_tz) - timedelta(days=200)

        articles = response.css(".news-cat-list> .items")
        for article in articles:
            inArticleURL = article.css(".items a ::attr(href)").get()
            yield response.follow(
                inArticleURL, callback=self.parseArticle, cb_kwargs={"cutoff": cutoff}
            )

        # Select all links with class 'nextpostslink'
        # Then filter for the one that specifically contains 'Next'
        next_page = response.css('a.nextpostslink:contains("Next")::attr(href)').get()

        if next_page:
            yield response.follow(next_page, callback=self.parse)

    def parseArticle(self, response, cutoff):

        # Get all text nodes from all elements inside .editor-box
        # This includes text inside <p>, <strong>, <em>, <li>, etc.
        # parts = response.css('.editor-box *::text').getall()

        # # Join with space and clean up whitespace
        # text = ' '.join(part.strip() for part in parts if part.strip())
        # clean_body = re.sub(r'\s+', ' ', text).strip()

        # raw_date = response.css('.pub-date::text').get()
        # raw = raw_date.split('Date: ')[1]

        # nepal_tz = timezone(timedelta(hours=5, minutes=45))
        # scraped_at = datetime.now(nepal_tz).replace(microsecond=0).strftime('%Y-%m-%d %H:%M:%S')

        def clean_text(text):
            if not text:
                return text
            # remove control characters except normal whitespace
            return re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)

        nepal_tz = timezone(timedelta(hours=5, minutes=45))

        raw_date = response.css(".pub-date::text").get()
        raw = raw_date.split("Date: ")[1]
        published_at_naive = datetime.strptime(raw, "%Y-%m-%d %H:%M:%S")
        published_at = published_at_naive.replace(tzinfo=nepal_tz)

        if published_at < cutoff:
            self.logger.info(f"Readched cutoff date, stopping: {published_at}")
            return

        article_item = MyprojectItem()
        raw_body = response.css(".editor-box p::text").getall()
        text = " ".join(raw_body)
        clean_body = re.sub(r"\s+", " ", text).strip()

        paragraph1 = response.css(".editor-box p::text").get()

        scraped_at = (
            datetime.now(nepal_tz).replace(microsecond=0).strftime("%Y-%m-%d %H:%M")
        )

        article_item["url"] = response.url
        article_item["title"] = response.css(".news-big-title::text").get()
        article_item["paragraph1"] = paragraph1.strip()
        article_item["body"] = clean_body
        article_item["published_at"] = published_at.strftime("%Y-%m-%d")
        article_item["scraped_at"] = scraped_at
        article_item["source"] = "setopati"

        yield article_item
