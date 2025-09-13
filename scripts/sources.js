// File: /scripts/sources.js

export const sources = [
    {
      name: 'EatDrinkLagos',
      url: 'https://www.eatdrinklagos.com/the-eatdrinklagos-guide-to-amala-in-lagos/',
      scraperConfig: {
        container: '.post-content', 
        nameSelector: 'h4',
        addressSelector: 'p',
      }
    },
    {
      name: 'Pulse.ng',
      url: 'https://www.pulse.ng/lifestyle/food-travel/5-best-places-to-eat-amala-in-lagos/p37ym2b',
      scraperConfig: {
        container: '.article-body',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'FoodieInLagos',
      url: 'https://foodieinlagos.com/finding-the-best-amala-spots-in-lagos/',
      scraperConfig: {
        container: '.entry-content',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'TheLagosWeekender',
      url: 'https://thelagosweekender.com/where-to-eat-in-lagos-amala-joints-edition/',
      scraperConfig: {
        container: 'article',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'GuardianNigeria',
      url: 'https://guardian.ng/life/food/where-to-find-the-best-amala-in-lagos/',
      scraperConfig: {
        container: '.article-content',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'VanguardNigeria',
      url: 'https://www.vanguardngr.com/2023/03/best-amala-spots-in-lagos/',
      scraperConfig: {
        container: '.entry-content',
        nameSelector: 'h2',
        addressSelector: 'p',
      }
    },
    {
      name: 'ThisDayLive',
      url: 'https://www.thisdaylive.com/index.php/2023/04/15/top-amala-joints-in-lagos/',
      scraperConfig: {
        container: '.article-body',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'NigerianTribune',
      url: 'https://tribuneonlineng.com/best-amala-restaurants-lagos/',
      scraperConfig: {
        container: '.entry-content',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'LagosFoodie',
      url: 'https://lagosfoodie.com/amala-spots-lagos/',
      scraperConfig: {
        container: '.post-content',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'NaijaFoodie',
      url: 'https://naijafoodie.com/best-amala-in-lagos/',
      scraperConfig: {
        container: '.content',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'LagosEats',
      url: 'https://lagoseats.com/amala-restaurants-lagos/',
      scraperConfig: {
        container: '.article-content',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'NigerianFoodBlog',
      url: 'https://nigerianfoodblog.com/where-to-eat-amala-lagos/',
      scraperConfig: {
        container: '.entry-content',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'LagosFoodGuide',
      url: 'https://lagosfoodguide.com/amala-spots/',
      scraperConfig: {
        container: '.post-content',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'YorubaFoodBlog',
      url: 'https://yorubafoodblog.com/best-amala-lagos/',
      scraperConfig: {
        container: '.content',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    },
    {
      name: 'LagosRestaurantGuide',
      url: 'https://lagosrestaurantguide.com/amala-joints/',
      scraperConfig: {
        container: '.article-body',
        nameSelector: 'h3',
        addressSelector: 'p',
      }
    }
  ];