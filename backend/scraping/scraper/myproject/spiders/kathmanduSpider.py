# import scrapy
# from datetime import datetime
# import json
# from parsel import Selector

# class KathmanduspiderSpider(scrapy.Spider):
#     name = "kathmanduSpider"
#     allowed_domains = ["kathmandupost.com"]
#     start_urls = ["https://kathmandupost.com/politics"]

#     def parse(self, response):
#         # check if response is JSON (the ?html=1 paginated response)
#         if response.url.startswith('https://kathmandupost.com/politics?'):
#             data = json.loads(response.text)
#             html = data['news_list_html']
#             sel = Selector(text=html)
#             articles = sel.css('.article-image')
#         else:
#             # normal full page
#             articles = response.css('div#news-list .article-image')

#         urls = [a.css('a::attr(href)').get() for a in articles]
#         for url in urls:
#             yield response.follow(url, callback=self.parseArticle)

#         yield response.follow(
#             urls[-1],
#             callback=self.getNextPage,
#             dont_filter=True
#         )


#     def getNextPage(self, response):
#         print(f"************* getNextPage called for: {response.url}")
#         raw_date = response.css('.updated-time ::text').getall()
#         #['Published at : June 21, 2026 ', 'Updated at : June 21, 2026 19:16 ', 'Kathmandu ']

#         exact_date = raw_date[1] if len(raw_date) > 1 else None
#         # Updated at : June 21, 2026 19:16

#         if exact_date:
#             date_time = exact_date.split('at :')[1].strip()
#             # Updated at : June 21, 2026 19:16
#             parts = date_time.rsplit(' ', 1)
#             date = parts[0].strip(',') # 'June 21, 2026'
#             time = parts[1]

#             raw = f"{date} {time}"  # 'June 21, 2026 19:16'
#             published_at = datetime.strptime(raw, '%B %d, %Y %H:%M').strftime('%Y-%m-%d %H:%M:%S')


#             print(f"**** Next URL: https://kathmandupost.com/politics?html=1&pub={published_at}")
#             next_url = f'https://kathmandupost.com/politics?html=1&pub={published_at}'
#             yield scrapy.Request(
#                 next_url,
#                 callback=self.parse,
#                 headers={
#                     'Referer': 'https://kathmandupost.com/politics',
#                     'X-Requested-With': 'XMLHttpRequest'
#                 }
#             )


#     def parseArticle(self, response):

#         # raw_date = response.css('.updated-time ::text').getall()

#         # exact_date = raw_date[1] if len(raw_date) > 1 else None
#         # # date_time = exact_date.split('at :')[1:3]
#         # # date = date_time.rsplit(',', 1)[0]+','+date_time.rsplit(',',1)[1].split()[0]

#         # if exact_date:
#         #     date_time = exact_date.split('at :')[1].strip()
#         #     parts = date_time.rsplit(' ', 1)
#         #     date = parts[0].strip(',') # 'June 21, 2026'
#         #     time = parts[1]            # '19:16'
#         yield{
#                 'url': response.url,
#                 'title': response.css('h1::text').get(),
#                 # 'body': response.css('section.story-section p::text').getall(),
#                 # 'date': date,
#                 # 'time': time
#             }


import json
import re
from datetime import datetime, timedelta, timezone

import scrapy
from myproject.items import MyprojectItem
from parsel import Selector


class KathmanduspiderSpider(scrapy.Spider):
    name = "kathmanduSpider"
    allowed_domains = ["kathmandupost.com"]
    start_urls = ["https://kathmandupost.com/politics"]

    def parse(self, response):
        nepal_tz = timezone(timedelta(hours=5, minutes=45))
        cutoff = datetime.now(nepal_tz) - timedelta(days=200)

        if response.url.startswith("https://kathmandupost.com/politics?"):
            data = json.loads(response.text)
            html = data["news_list_html"]
            sel = Selector(text=html)
            articles = sel.css(".article-image")
        else:
            articles = response.css("div#news-list .article-image")

        urls = [a.css("a::attr(href)").get() for a in articles]
        for url in urls:
            yield response.follow(
                url, callback=self.parseArticle, cb_kwargs={"cutoff": cutoff}
            )

        yield response.follow(urls[-1], callback=self.getNextPage, dont_filter=True)

    def getNextPage(self, response):
        raw_date = response.css(".updated-time ::text").getall()
        exact_date = raw_date[1] if len(raw_date) > 1 else None

        if exact_date:
            date_time = exact_date.split("at :")[1].strip()
            parts = date_time.rsplit(" ", 1)
            date = parts[0].strip(",")
            time = parts[1]
            raw = f"{date} {time}"
            published_at = datetime.strptime(raw, "%B %d, %Y %H:%M").strftime(
                "%Y-%m-%d %H:%M:%S"
            )

            next_url = f"https://kathmandupost.com/politics?html=1&pub={published_at}"
            yield scrapy.Request(
                next_url,
                callback=self.parse,
                headers={
                    "Referer": "https://kathmandupost.com/politics",
                    "X-Requested-With": "XMLHttpRequest",
                },
            )

    def parseArticle(self, response, cutoff):
        nepal_tz = timezone(timedelta(hours=5, minutes=45))

        raw_date = response.css(".updated-time ::text").getall()
        exact_date = raw_date[1] if len(raw_date) > 1 else None

        if not exact_date:
            return

        date_time = exact_date.split("at :")[1].strip()
        parts = date_time.rsplit(" ", 1)
        date = parts[0].strip(",")
        time = parts[1]
        raw = f"{date} {time}"
        published_at_naive = datetime.strptime(raw, "%B %d, %Y %H:%M")
        published_at = published_at_naive.replace(tzinfo=nepal_tz)

        if published_at < cutoff:
            self.logger.info(f"Reached cutoff date, stopping: {published_at}")
            return

        scraped_at = (
            datetime.now(nepal_tz).replace(microsecond=0).strftime("%Y-%m-%d %H:%M:%S")
        )

        article_item = MyprojectItem()

        raw_body = response.css("section.story-section p::text").getall()
        text = " ".join(raw_body)
        clean_body = re.sub(r"\s+", " ", text).strip()

        paragraph1 = response.css("section.story-section p::text").get()

        article_item["url"] = response.url
        article_item["title"] = response.css("h1::text").get()
        article_item["paragraph1"] = paragraph1.strip()
        article_item["body"] = clean_body
        article_item["published_at"] = published_at.strftime("%Y-%m-%d")
        article_item["scraped_at"] = scraped_at
        article_item["source"] = "kathmandu_post"

        yield article_item

        # yield {
        #     "url": response.url,
        #     "title": response.css("h1::text").get(),
        #     "body": clean_body,
        #     "published_at": published_at.strftime("%Y-%m-%d"),
        #     "scraped_at": scraped_at,
        #     "source": "kathmandu_post",
        # }
