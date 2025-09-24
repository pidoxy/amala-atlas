// File: /scripts/sources.js

export const sources = [
  {
    name: 'Houstonia Mag (Houston, USA)',
    url: 'https://www.houstoniamag.com/eat-and-drink/2022/11/nigerian-food-houston-restaurants',
    scraperConfig: {
      container: 'article', 
      nameSelector: 'h2',
      addressSelector: 'blockquote',
    }
  },
  {
    name: 'The African Dream (Maryland, USA)',
    url: 'https://theafricandream.net/top-8-nigerian-restaurants-in-maryland-usa/',
    scraperConfig: {
      container: '.tdb-block-inner',
      nameSelector: 'h3',
      addressSelector: 'p',
    }
  },
  {
    name: 'Tastes of Nigeria (Toronto, CA)',
    url: 'https://www.tastesofnigeria.com/nigerian-restaurants-in-toronto/',
    scraperConfig: {
      container: '.post-content',
      nameSelector: 'h3',
      addressSelector: 'p',
    }
  },
  {
    name: 'Secret Atlanta (Atlanta, USA)',
    url: 'https://secretatlanta.co/nigerian-restaurants-atlanta/',
    scraperConfig: {
        container: 'article',
        nameSelector: 'h2',
        addressSelector: 'p'
    }
  },
  // =========== Europe ===========
  {
    name: 'Afrobuy (London, UK)',
    url: 'https://www.afrobuy.co.uk/blogs/news/top-5-nigerian-restaurants-in-london-for-amala-lovers',
    scraperConfig: {
      container: 'article.article-template',
      nameSelector: 'h3',
      addressSelector: 'p',
    }
  },
  {
    name: 'Nigerian Food in London',
    url: 'https://www.londonsfirstnigerian.co.uk/post/top-5-amala-spots-in-london',
    scraperConfig: {
      container: '.blog-post-content-wrapper',
      nameSelector: 'h3',
      addressSelector: 'p',
    }
  },
  // =========== Asia ===========
  {
    name: 'IdrisBello.com (Tokyo, Japan)',
    url: 'https://idrisbello.com/amala-in-japan/',
    cacheFile: 'idrisbello.html', // This one is tricky, so a cache is good
    scraperConfig: {
      container: '.entry-content', 
      nameSelector: 'p strong', // Name is inside a <strong> tag within a <p>
      addressSelector: 'p',
    }
  },
  {
    name: 'WillGiveYouRecipes (London)',
    url: 'https://willgiveyourecipes.com/best-nigerian-amala-spots-in-london/',
    scraperConfig: {
      container: '.entry-content',
      nameSelector: 'h3',
      addressSelector: 'p',
    }
  },
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