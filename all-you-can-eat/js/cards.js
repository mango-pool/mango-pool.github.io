// 66 張料理卡與洲別配色
// 由 tools/extract-cards.js 從 CardsDataScript.cs 自動生成，請勿手改
//
// 與原版的差異：原版抽牌用 Random.Range(0, count-1)，Unity 的整數版不含上界，
// 導致每疊牌的最後一張幾乎抽不到。網頁版改為均勻隨機（見 rules.js 的 drawCard）。
const CARDS = [
  {
    "meal": "breakfast",
    "country": "Australia",
    "score": 1,
    "tokens": [
      "grain",
      "grain"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Belgium",
    "score": 2,
    "tokens": [
      "grain",
      "oil"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Bolivia",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Bulgaria",
    "score": 3,
    "tokens": [
      "veg",
      "grain",
      "grain"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Canada",
    "score": 6,
    "tokens": [
      "apple",
      "grain",
      "meat",
      "milk"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Estonia",
    "score": 2,
    "tokens": [
      "veg",
      "meat"
    ]
  },
  {
    "meal": "breakfast",
    "country": "France",
    "score": 1,
    "tokens": [
      "grain",
      "grain"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Holland",
    "score": 1,
    "tokens": [
      "milk",
      "milk"
    ]
  },
  {
    "meal": "breakfast",
    "country": "India",
    "score": 3,
    "tokens": [
      "veg",
      "grain",
      "grain"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Ireland",
    "score": 6,
    "tokens": [
      "veg",
      "grain",
      "meat",
      "oil"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Korea",
    "score": 1,
    "tokens": [
      "veg",
      "veg"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Latvia",
    "score": 1,
    "tokens": [
      "milk",
      "milk"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Marshall Islands",
    "score": 1,
    "tokens": [
      "apple",
      "apple"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Mexico",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Morocco",
    "score": 5,
    "tokens": [
      "apple",
      "veg",
      "veg",
      "grain"
    ]
  },
  {
    "meal": "breakfast",
    "country": "New Zealand",
    "score": 1,
    "tokens": [
      "apple",
      "apple"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Nicaragua",
    "score": 1,
    "tokens": [
      "grain",
      "grain"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Palau",
    "score": 3,
    "tokens": [
      "meat",
      "meat",
      "oil"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Paraguay",
    "score": 8,
    "tokens": [
      "veg",
      "grain",
      "meat",
      "milk",
      "oil"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Philippines",
    "score": 1,
    "tokens": [
      "meat",
      "meat"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Romania",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Spain",
    "score": 3,
    "tokens": [
      "grain",
      "meat"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Uganda",
    "score": 1,
    "tokens": [
      "apple",
      "apple"
    ]
  },
  {
    "meal": "breakfast",
    "country": "United Arab Emirates",
    "score": 6,
    "tokens": [
      "grain",
      "meat",
      "milk",
      "oil"
    ]
  },
  {
    "meal": "breakfast",
    "country": "United Kingdom",
    "score": 6,
    "tokens": [
      "veg",
      "grain",
      "meat",
      "oil"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Uruguay",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "breakfast",
    "country": "Zimbabwe",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Brazil",
    "score": 4,
    "tokens": [
      "grain",
      "grain",
      "meat",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Brunei",
    "score": 1,
    "tokens": [
      "grain",
      "grain"
    ]
  },
  {
    "meal": "lunch",
    "country": "Chile",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Cuba",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Greece",
    "score": 5,
    "tokens": [
      "veg",
      "veg",
      "milk",
      "oil"
    ]
  },
  {
    "meal": "lunch",
    "country": "Iceland",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Indonesia",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Isle of Man",
    "score": 1,
    "tokens": [
      "meat",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Italy",
    "score": 5,
    "tokens": [
      "veg",
      "grain",
      "milk",
      "milk"
    ]
  },
  {
    "meal": "lunch",
    "country": "Japan",
    "score": 2,
    "tokens": [
      "grain",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Nepal",
    "score": 3,
    "tokens": [
      "veg",
      "veg",
      "grain"
    ]
  },
  {
    "meal": "lunch",
    "country": "Norway",
    "score": 4,
    "tokens": [
      "veg",
      "veg",
      "meat",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Panama",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Singapore",
    "score": 4,
    "tokens": [
      "meat",
      "meat",
      "oil"
    ]
  },
  {
    "meal": "lunch",
    "country": "South Africa",
    "score": 5,
    "tokens": [
      "veg",
      "meat",
      "milk",
      "milk"
    ]
  },
  {
    "meal": "lunch",
    "country": "Sweden",
    "score": 5,
    "tokens": [
      "grain",
      "grain",
      "meat",
      "milk"
    ]
  },
  {
    "meal": "lunch",
    "country": "Taiwan",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Thailand",
    "score": 2,
    "tokens": [
      "veg",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Uzbekistan",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Vietnam",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "lunch",
    "country": "Yemen",
    "score": 4,
    "tokens": [
      "veg",
      "grain",
      "meat"
    ]
  },
  {
    "meal": "dinner",
    "country": "Colombia",
    "score": 7,
    "tokens": [
      "apple",
      "grain",
      "meat",
      "meat",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Cook Island",
    "score": 6,
    "tokens": [
      "apple",
      "veg",
      "meat",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Croatia",
    "score": 6,
    "tokens": [
      "grain",
      "meat",
      "milk",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Denmark",
    "score": 8,
    "tokens": [
      "veg",
      "grain",
      "meat",
      "milk",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Egypt",
    "score": 5,
    "tokens": [
      "veg",
      "veg",
      "grain",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Finland",
    "score": 5,
    "tokens": [
      "apple",
      "grain",
      "meat",
      "meat"
    ]
  },
  {
    "meal": "dinner",
    "country": "Germany",
    "score": 5,
    "tokens": [
      "veg",
      "grain",
      "meat",
      "meat"
    ]
  },
  {
    "meal": "dinner",
    "country": "Hungary",
    "score": 7,
    "tokens": [
      "veg",
      "grain",
      "meat",
      "meat",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Kenya",
    "score": 5,
    "tokens": [
      "veg",
      "grain",
      "grain",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Lithuania",
    "score": 7,
    "tokens": [
      "grain",
      "grain",
      "meat",
      "milk",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Macedonia",
    "score": 5,
    "tokens": [
      "veg",
      "grain",
      "grain",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Malaysia",
    "score": 6,
    "tokens": [
      "veg",
      "grain",
      "meat",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Peru",
    "score": 7,
    "tokens": [
      "apple",
      "veg",
      "grain",
      "meat",
      "meat"
    ]
  },
  {
    "meal": "dinner",
    "country": "Poland",
    "score": 6,
    "tokens": [
      "veg",
      "grain",
      "meat",
      "milk"
    ]
  },
  {
    "meal": "dinner",
    "country": "Russia",
    "score": 6,
    "tokens": [
      "veg",
      "grain",
      "meat",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Saudi Arabia",
    "score": 7,
    "tokens": [
      "grain",
      "meat",
      "milk",
      "milk",
      "oil"
    ]
  },
  {
    "meal": "dinner",
    "country": "Switzerland",
    "score": 6,
    "tokens": [
      "veg",
      "grain",
      "milk",
      "milk"
    ]
  },
  {
    "meal": "dinner",
    "country": "United States",
    "score": 6,
    "tokens": [
      "veg",
      "grain",
      "meat",
      "milk"
    ]
  }
];

const CONTINENT = {
  "Australia": "oceania",
  "Belgium": "eu",
  "Bolivia": "america",
  "Bulgaria": "eu",
  "Canada": "america",
  "Estonia": "eu",
  "France": "eu",
  "Holland": "eu",
  "India": "asia",
  "Ireland": "eu",
  "Korea": "asia",
  "Latvia": "eu",
  "Marshall Islands": "oceania",
  "Mexico": "america",
  "Morocco": "africa",
  "New Zealand": "oceania",
  "Nicaragua": "america",
  "Palau": "oceania",
  "Paraguay": "america",
  "Philippines": "asia",
  "Romania": "eu",
  "Spain": "eu",
  "Uganda": "africa",
  "United Arab Emirates": "asia",
  "United Kingdom": "eu",
  "Uruguay": "america",
  "Zimbabwe": "africa",
  "Brazil": "america",
  "Brunei": "asia",
  "Chile": "america",
  "Cuba": "america",
  "Greece": "eu",
  "Iceland": "eu",
  "Indonesia": "asia",
  "Isle of Man": "eu",
  "Italy": "eu",
  "Japan": "asia",
  "Nepal": "asia",
  "Norway": "eu",
  "Panama": "america",
  "Singapore": "asia",
  "South Africa": "africa",
  "Sweden": "eu",
  "Taiwan": "asia",
  "Thailand": "asia",
  "Uzbekistan": "asia",
  "Vietnam": "asia",
  "Yemen": "asia",
  "Colombia": "america",
  "Cook Island": "oceania",
  "Croatia": "eu",
  "Denmark": "eu",
  "Egypt": "africa",
  "Finland": "eu",
  "Germany": "eu",
  "Hungary": "eu",
  "Kenya": "africa",
  "Lithuania": "eu",
  "Macedonia": "eu",
  "Malaysia": "asia",
  "Peru": "america",
  "Poland": "eu",
  "Russia": "eu",
  "Saudi Arabia": "asia",
  "Switzerland": "eu",
  "United States": "america"
};

const CONTINENT_COLOR = {
  "asia": "#9a8731",
  "africa": "#2f2f2f",
  "eu": "#1e426f",
  "america": "#cb1c3d",
  "oceania": "#396743"
};

if (typeof module !== 'undefined') module.exports = { CARDS, CONTINENT, CONTINENT_COLOR };
