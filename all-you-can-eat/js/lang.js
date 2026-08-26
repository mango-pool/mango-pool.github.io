// 四語字典：介面字串、國名、菜名、bonus 文案
// 由 tools/extract-lang.js 從 LangScript.cs 自動生成，請勿手改
const LANGS = ["en","ch","ru","ma"];

const LANG = {
  "ui": {
    "AllYouCanEat": {
      "ru": "All You Can Eat",
      "en": "All You Can Eat",
      "ma": "All You Can Eat",
      "ch": "All You Can Eat"
    },
    "annotation": {
      "ru": "《Всё, что ты можешь съесть》 - это серьезная игра, целью которой является обучение людей здоровому питанию. Давайте отправимся в гастрономическое путешествие по всему миру и съедим все, что сможете, оставаясь при этом здоровыми.",
      "en": "All You Can Eat is a serious game with the vision of educating people about healthy diets. Let’s set off on a journey of cuisine around the world, and eat all you can while still being healthy.",
      "ma": "<Makan Sebanyak Mungkin> adalah sebuah permainan sirius yang mempunyai visi untuk mendidik orang awam mengenai pemakanan yang sihat. Jom kita mulakan sebuah perjalanan masakan ke seluruh dunia dan makan sebanyak mungkin tanpa menjejaskan kesihatan.",
      "ch": "《誰是大胃王？》是一款教導均衡飲食的教育遊戲。開始我們的世界美食之旅，同時也要吃得健健康康喔！"
    },
    "lang": {
      "ru": "Русский",
      "en": "English",
      "ma": "Bahasa Melayu",
      "ch": "中文"
    },
    "taiwan": {
      "ru": "Тайвань",
      "en": "Taiwan",
      "ma": "Taiwan",
      "ch": "台灣"
    },
    "brunei": {
      "ru": "Бруней",
      "en": "Brunei",
      "ma": "Brunei",
      "ch": "汶萊"
    },
    "russia": {
      "ru": "Россия",
      "en": "Russia",
      "ma": "Rusia",
      "ch": "俄羅斯"
    },
    "whichPlace": {
      "ru": "Какое место вы хотите посетить?",
      "en": "Which place do you like to visit?",
      "ma": "Tempat mana yang awda ingin kunjungi?",
      "ch": "你想去哪裡呢？"
    },
    "player": {
      "ru": "Игрок",
      "en": "Player",
      "ma": "Pemain",
      "ch": "玩家"
    },
    "startGame": {
      "ru": "Начать игру",
      "en": "Start Game",
      "ma": "Mulakan Permainan",
      "ch": "開始遊戲"
    },
    "name": {
      "ru": "Имя",
      "en": "Name",
      "ma": "Nama",
      "ch": "名稱"
    },
    "eat": {
      "ru": "Съесть",
      "en": "Eat",
      "ma": "Makan",
      "ch": "吃"
    },
    "digest": {
      "ru": "Переварить",
      "en": "Digest",
      "ma": "Hadam",
      "ch": "消化"
    },
    "balance": {
      "ru": "Баланс",
      "en": "Balance",
      "ma": "Mengimbang",
      "ch": "平衡"
    },
    "next": {
      "ru": "Следующий",
      "en": "Next player",
      "ma": "Pemain seterusnya",
      "ch": "下一玩家"
    },
    "choose": {
      "ru": "Выберите действие",
      "en": "Choose Your Action",
      "ma": "Pemain seterusnya",
      "ch": "選擇你的行動"
    },
    "results": {
      "ru": "Итоги игры",
      "en": "Game Result",
      "ma": "Keputusan Permainan",
      "ch": "最後分數"
    },
    "cuisine": {
      "ru": "Блюда",
      "en": "Cuisine",
      "ma": "Masakan",
      "ch": "美食"
    },
    "undig": {
      "ru": "Не переварено",
      "en": "Undigested",
      "ma": "Tidak dihadam",
      "ch": "未消化"
    },
    "score": {
      "ru": "Баллы",
      "en": "Score",
      "ma": "Skor",
      "ch": "分數"
    },
    "newgame": {
      "ru": "Новая игра",
      "en": "New Game",
      "ma": "Permainan baru",
      "ch": "新遊戲"
    },
    "alert": {
      "ru": "Вы не совершили действий. Вы уверены, что хотите пропустить свой ход?",
      "en": "You have not made your move, are you sure that you want to skip this turn?",
      "ma": "Awda belum membuat pergerakan awda, adakah awda pasti awda mahu melangkau giliran tersebut?",
      "ch": "你還沒有做任何動作，確定要跳過這回合嗎？"
    },
    "yes": {
      "ru": "Да",
      "en": "Yes",
      "ma": "Ya",
      "ch": "是"
    },
    "no": {
      "ru": "Нет",
      "en": "No",
      "ma": "Tidak",
      "ch": "否"
    },
    "alertHome": {
      "ru": "Вы хотите завершить текущую игру?",
      "en": "Are you sure you don't want to finish this game first?",
      "ma": "Adakah awda pasti awda tidak mahu menghabiskan permainan ini dahulu?",
      "ch": "確定要結束這場遊戲嗎？"
    },
    "enterName": {
      "ru": "Введите имя, чтобы добавить игрока:",
      "en": "Enter a name to add a player:",
      "ma": "Isikan nama untuk menambah pemain",
      "ch": "輸入名稱以新增玩家："
    },
    "min": {
      "ru": "Должно быть минимум два игрока!",
      "en": "Minimum of two players needed!",
      "ma": "Mesti ada sekurang-kurangnya dua pemain untuk mula!",
      "ch": "最少需要兩名玩家！"
    },
    "final": {
      "ru": "Последний раунд!",
      "en": "Final Round!",
      "ma": "Pusingan terakhir!",
      "ch": "最後回合"
    },
    "gameover": {
      "ru": "Скоро конец игры!",
      "en": "Game is ending soon!",
      "ma": "Permainan ini akan tamat tidak lama lagi.",
      "ch": "這場遊戲進入尾聲了！"
    },
    "yesRematch": {
      "ru": "Да, хочу матч-реванш",
      "en": "Yes, I want a rematch",
      "ma": "Ya, saya ingin berlawan semula",
      "ch": "是的，我想再玩一次。"
    },
    "yesNew": {
      "ru": "Да, хочу новую игру",
      "en": "Yes, I want a new game",
      "ma": "Ya, saya mahu permainan baru",
      "ch": "是的，我想重新開始遊戲。"
    },
    "rematch": {
      "ru": "Матч-реванш",
      "en": "Rematch",
      "ma": "Perlawanan Semula",
      "ch": "再玩一次"
    },
    "how": {
      "ru": "КАК ИГРАТЬ",
      "en": "HOW TO PLAY",
      "ma": "CARA BERMAI",
      "ch": "遊戲玩法"
    },
    "close": {
      "ru": "Закрыть правила",
      "en": "Close Rules",
      "ma": "Tutup Peraturan",
      "ch": "關閉規則說明"
    }
  },
  "country": {
    "Japan": {
      "ru": "Япония",
      "en": "Japan",
      "ma": "Japan",
      "ch": "日本"
    },
    "Indonesia": {
      "ru": "Индонезия",
      "en": "Indonesia",
      "ma": "Indonesia",
      "ch": "印尼"
    },
    "India": {
      "ru": "Индия",
      "en": "India",
      "ma": "India",
      "ch": "印度"
    },
    "Vietnam": {
      "ru": "Вьетнам",
      "en": "Vietnam",
      "ma": "Vietnam",
      "ch": "越南"
    },
    "Thailand": {
      "ru": "Таиланд",
      "en": "Thailand",
      "ma": "Thailand",
      "ch": "泰國"
    },
    "Nepal": {
      "ru": "Непал",
      "en": "Nepal",
      "ma": "Nepal",
      "ch": "尼泊爾"
    },
    "Uzbekistan": {
      "ru": "Узбекистан",
      "en": "Uzbekistan",
      "ma": "Uzbekistan",
      "ch": "烏茲別克"
    },
    "Taiwan": {
      "ru": "Тайвань",
      "en": "Taiwan",
      "ma": "Taiwan",
      "ch": "臺灣"
    },
    "Saudi Arabia": {
      "ru": "Саудовская Аравия",
      "en": "Saudi Arabia",
      "ma": "Saudi Arabia",
      "ch": "沙烏地阿拉伯"
    },
    "Malaysia": {
      "ru": "Малайзия",
      "en": "Malaysia",
      "ma": "Malaysia",
      "ch": "馬來西亞"
    },
    "Singapore": {
      "ru": "Сингапур",
      "en": "Singapore",
      "ma": "Singapore",
      "ch": "新加坡"
    },
    "Korea": {
      "ru": "Корея",
      "en": "Korea",
      "ma": "Korea",
      "ch": "韓國"
    },
    "Yemen": {
      "ru": "Йемен",
      "en": "Yemen",
      "ma": "Yemen",
      "ch": "葉門"
    },
    "United Arab Emirates": {
      "ru": "ОАЭ",
      "en": "United Arab Emirates",
      "ma": "United Arab Emirates",
      "ch": "阿拉伯聯合大公國"
    },
    "Philippines": {
      "ru": "Филиппины",
      "en": "Philippines",
      "ma": "Philippines",
      "ch": "菲律賓"
    },
    "Brunei": {
      "ru": "Бруней",
      "en": "Brunei",
      "ma": "Brunei",
      "ch": "汶萊"
    },
    "Poland": {
      "ru": "Польша",
      "en": "Poland",
      "ma": "Poland",
      "ch": "波蘭"
    },
    "Switzerland": {
      "ru": "Швейцария",
      "en": "Switzerland",
      "ma": "Switzerland",
      "ch": "瑞士"
    },
    "Latvia": {
      "ru": "Латвия",
      "en": "Latvia",
      "ma": "Latvia",
      "ch": "拉脫維亞"
    },
    "Greece": {
      "ru": "Греция",
      "en": "Greece",
      "ma": "Greece",
      "ch": "希臘"
    },
    "Hungary": {
      "ru": "Венгрия",
      "en": "Hungary",
      "ma": "Hungary",
      "ch": "匈牙利"
    },
    "Holland": {
      "ru": "Голландия",
      "en": "Holland",
      "ma": "Holland",
      "ch": "荷蘭"
    },
    "France": {
      "ru": "Франция",
      "en": "France",
      "ma": "France",
      "ch": "法國"
    },
    "United Kingdom": {
      "ru": "Великобритания",
      "en": "United Kingdom",
      "ma": "United Kingdom",
      "ch": "英國"
    },
    "Russia": {
      "ru": "Россия",
      "en": "Russia",
      "ma": "Russia",
      "ch": "俄羅斯"
    },
    "Italy": {
      "ru": "Италия",
      "en": "Italy",
      "ma": "Italy",
      "ch": "義大利"
    },
    "Ireland": {
      "ru": "Ирландия",
      "en": "Ireland",
      "ma": "Ireland",
      "ch": "愛爾蘭"
    },
    "Germany": {
      "ru": "Германия",
      "en": "Germany",
      "ma": "Germany",
      "ch": "德國"
    },
    "Iceland": {
      "ru": "Исландия",
      "en": "Iceland",
      "ma": "Iceland",
      "ch": "冰島"
    },
    "Norway": {
      "ru": "Норвегия",
      "en": "Norway",
      "ma": "Norway",
      "ch": "挪威"
    },
    "Finland": {
      "ru": "Финляндия",
      "en": "Finland",
      "ma": "Finland",
      "ch": "芬蘭"
    },
    "Sweden": {
      "ru": "Швеция",
      "en": "Sweden",
      "ma": "Sweden",
      "ch": "瑞典"
    },
    "Denmark": {
      "ru": "Дания",
      "en": "Denmark",
      "ma": "Denmark",
      "ch": "丹麥"
    },
    "Spain": {
      "ru": "Испания",
      "en": "Spain",
      "ma": "Spain",
      "ch": "西班牙"
    },
    "Belgium": {
      "ru": "Бельгия",
      "en": "Belgium",
      "ma": "Belgium",
      "ch": "比利時"
    },
    "Lithuania": {
      "ru": "Литва",
      "en": "Lithuania",
      "ma": "Lithuania",
      "ch": "立陶宛"
    },
    "Croatia": {
      "ru": "Хорватия",
      "en": "Croatia",
      "ma": "Croatia",
      "ch": "克羅埃西亞"
    },
    "Romania": {
      "ru": "Румыния",
      "en": "Romania",
      "ma": "Romania",
      "ch": "羅馬尼亞"
    },
    "Estonia": {
      "ru": "Эстония",
      "en": "Estonia",
      "ma": "Estonia",
      "ch": "愛沙尼雅"
    },
    "Macedonia": {
      "ru": "Македония",
      "en": "Macedonia",
      "ma": "Macedonia",
      "ch": "馬其頓"
    },
    "Bulgaria": {
      "ru": "Болгария",
      "en": "Bulgaria",
      "ma": "Bulgaria",
      "ch": "保加利亞"
    },
    "Isle of Man": {
      "ru": "Остров Мэн",
      "en": "Isle of Man",
      "ma": "Isle of Man",
      "ch": "曼島"
    },
    "Zimbabwe": {
      "ru": "Зимбабве",
      "en": "Zimbabwe",
      "ma": "Zimbabwe",
      "ch": "辛巴威"
    },
    "South Africa": {
      "ru": "ЮАР",
      "en": "South Africa",
      "ma": "South Africa",
      "ch": "南非"
    },
    "Uganda": {
      "ru": "Уганда",
      "en": "Uganda",
      "ma": "Uganda",
      "ch": "烏干達"
    },
    "Morocco": {
      "ru": "Марокко",
      "en": "Morocco",
      "ma": "Morocco",
      "ch": "摩洛哥"
    },
    "Kenya": {
      "ru": "Кения",
      "en": "Kenya",
      "ma": "Kenya",
      "ch": "肯亞"
    },
    "Egypt": {
      "ru": "Египет",
      "en": "Egypt",
      "ma": "Egypt",
      "ch": "埃及"
    },
    "Mexico": {
      "ru": "Мексика",
      "en": "Mexico",
      "ma": "Mexico",
      "ch": "墨西哥"
    },
    "Canada": {
      "ru": "Канада",
      "en": "Canada",
      "ma": "Canada",
      "ch": "加拿大"
    },
    "Brazil": {
      "ru": "Бразилия",
      "en": "Brazil",
      "ma": "Brazil",
      "ch": "巴西"
    },
    "United States": {
      "ru": "США",
      "en": "United States",
      "ma": "United States",
      "ch": "美國"
    },
    "Peru": {
      "ru": "Перу",
      "en": "Peru",
      "ma": "Peru",
      "ch": "秘魯"
    },
    "Bolivia": {
      "ru": "Боливия",
      "en": "Bolivia",
      "ma": "Bolivia",
      "ch": "玻利維亞"
    },
    "Chile": {
      "ru": "Чили",
      "en": "Chile",
      "ma": "Chile",
      "ch": "智利"
    },
    "Cuba": {
      "ru": "Куба",
      "en": "Cuba",
      "ma": "Cuba",
      "ch": "古巴"
    },
    "Colombia": {
      "ru": "Колумбия",
      "en": "Colombia",
      "ma": "Colombia",
      "ch": "哥倫比亞"
    },
    "Panama": {
      "ru": "Панама",
      "en": "Panama",
      "ma": "Panama",
      "ch": "巴拿馬"
    },
    "Uruguay": {
      "ru": "Уругвай",
      "en": "Uruguay",
      "ma": "Uruguay",
      "ch": "烏拉圭"
    },
    "Nicaragua": {
      "ru": "Никарагуа",
      "en": "Nicaragua",
      "ma": "Nicaragua",
      "ch": "尼加拉瓜"
    },
    "Paraguay": {
      "ru": "Парагвай",
      "en": "Paraguay",
      "ma": "Paraguay",
      "ch": "巴拉圭"
    },
    "Australia": {
      "ru": "Австралия",
      "en": "Australia",
      "ma": "Australia",
      "ch": "澳大利亞"
    },
    "New Zealand": {
      "ru": "Новая Зеландия",
      "en": "New Zealand",
      "ma": "New Zealand",
      "ch": "紐西蘭"
    },
    "Marshall Islands": {
      "ru": "Маршалловы острова",
      "en": "Marshall Islands",
      "ma": "Marshall Islands",
      "ch": "馬紹爾群島"
    },
    "Palau": {
      "ru": "Палау",
      "en": "Palau",
      "ma": "Palau",
      "ch": "帛琉"
    },
    "Cook Island": {
      "ru": "Острова Кука",
      "en": "Cook Island",
      "ma": "Cook Island",
      "ch": "庫克群島"
    }
  },
  "meal": {
    "Japan": {
      "ru": "Суши",
      "en": "Sushi",
      "ma": "Sushi",
      "ch": "壽司"
    },
    "Indonesia": {
      "ru": "Сото\n(куриный суп)",
      "en": "Soto",
      "ma": "Soto",
      "ch": "雞湯拌飯"
    },
    "India": {
      "ru": "Кичари\n(рис с машем\nи специями)",
      "en": "Khichdi",
      "ma": "Kuah Dal",
      "ch": "綜合蔬食燕麥粥"
    },
    "Vietnam": {
      "ru": "Фо\n(суп с лапшой)",
      "en": "Phở",
      "ma": "Pho",
      "ch": "越南河粉"
    },
    "Thailand": {
      "ru": "Том Ям",
      "en": "Tom Yum",
      "ma": "Tom Yum",
      "ch": "冬蔭功"
    },
    "Nepal": {
      "ru": "Гундрук (суп из ферментированных овощей)",
      "en": "Gundruk Soup (Fermented Vegetable Soup)",
      "ma": "Sup sayur yang diperap",
      "ch": "發酵蔬菜湯"
    },
    "Uzbekistan": {
      "ru": "Плов",
      "en": "Plov (Pilau)",
      "ma": "Pilau",
      "ch": "抓飯"
    },
    "Taiwan": {
      "ru": "Говяжий суп\nс лапшой",
      "en": "Beef noodle soup",
      "ma": "Mee sup daging",
      "ch": "牛肉麵"
    },
    "Saudi Arabia": {
      "ru": "Салиг\n(саудовское ризотто)",
      "en": "Saleeg (Risotto)",
      "ma": "Risotto",
      "ch": "奶油燴飯"
    },
    "Malaysia": {
      "ru": "Наси-лемак\n(рис в кокосовом молоке с соусом)",
      "en": "Nasi Lemak",
      "ma": "Nasi Lemak",
      "ch": "椰漿飯"
    },
    "Singapore": {
      "ru": "Чили-краб",
      "en": "Chilli Crab",
      "ma": "Ketam Masak Cili",
      "ch": "辣椒螃蟹"
    },
    "Korea": {
      "ru": "Кимчи",
      "en": "Kimchi",
      "ma": "Kimchi",
      "ch": "泡菜"
    },
    "Yemen": {
      "ru": "Салтах\n(суп с тушёным мясом)",
      "en": "Saltah (Brown Meat Stew)",
      "ma": "Stew daging",
      "ch": "沙塔 (燉肉)"
    },
    "United Arab Emirates": {
      "ru": "Хариса\n(мясная каша)",
      "en": "Harees (Meat Porridge)",
      "ma": "Bubur daging",
      "ch": "哈日思 (麥粥)"
    },
    "Philippines": {
      "ru": "Адобо (тушёная\nсвинина с уксусом и соевым соусом)",
      "en": "Adobo",
      "ma": "Adobo",
      "ch": "醬燒"
    },
    "Brunei": {
      "ru": "Амбуят\n(блюдо из сердцевины пальмы)",
      "en": "Ambuyat",
      "ma": "Ambuyat",
      "ch": "西米糕"
    },
    "Poland": {
      "ru": "Пероги (вареники)",
      "en": "Pierogi(Dumpling)",
      "ma": "Dumpling",
      "ch": "餃子"
    },
    "Switzerland": {
      "ru": "Фондю",
      "en": "Fondue",
      "ma": "Fondue",
      "ch": "起司鍋"
    },
    "Latvia": {
      "ru": "Сыр Яни\n(кисломолочный сыр)",
      "en": "Jāņi cheese (Sour Milk Cheese)",
      "ma": "Keju Susu Masam",
      "ch": "酸奶起司"
    },
    "Greece": {
      "ru": "Греческий салат",
      "en": "Greek Salad",
      "ma": "Salad Greek",
      "ch": "希臘沙拉"
    },
    "Hungary": {
      "ru": "Гуляш",
      "en": "Goulash",
      "ma": "Stew Daging",
      "ch": "燉牛肉"
    },
    "Holland": {
      "ru": "Сыр Гауда",
      "en": "Gouda cheese",
      "ma": "Keju Gouda",
      "ch": "高達起司"
    },
    "France": {
      "ru": "Багет",
      "en": "Baguette",
      "ma": "Baguette",
      "ch": "長棍麵包"
    },
    "United Kingdom": {
      "ru": "Полный английский завтрак",
      "en": "Full English Breakfast",
      "ma": "Sarapan Ingerris",
      "ch": "英式早餐"
    },
    "Russia": {
      "ru": "Пирожки",
      "en": "Pirozhki (Stuffed Buns)",
      "ma": "Roti Sumbat",
      "ch": "皮羅什基 (油炸包)"
    },
    "Italy": {
      "ru": "Пицца",
      "en": "Pizza",
      "ma": "Pizza",
      "ch": "披薩"
    },
    "Ireland": {
      "ru": "Брэкфаст ролл\n(ирландский сэндвич)",
      "en": "Breakfast Roll",
      "ma": "Roti Gulung untuk Sarapan",
      "ch": "早餐麵包卷"
    },
    "Germany": {
      "ru": "Айсбайн\n(свиная рулька)",
      "en": "Eisbein (Pork Hock)",
      "ma": "Babi Hock",
      "ch": "德國豬腳"
    },
    "Iceland": {
      "ru": "Кьотсупа\n(исландский говяжий суп)",
      "en": "Kjötsupa (Icelandic Lamb Soup)",
      "ma": "Soup Kaming Iceland",
      "ch": "羊肉湯"
    },
    "Norway": {
      "ru": "Форикол\n(баранина в капусте)",
      "en": "Fårikål (Mutton in Cabbage)",
      "ma": "Kambing dengan Kubis",
      "ch": "白菜羊肉"
    },
    "Finland": {
      "ru": "Тушёная оленина",
      "en": "Sautéed reindeer",
      "ma": "Rusa masak tumis",
      "ch": "波羅的海鯡魚"
    },
    "Sweden": {
      "ru": "Фрикадельки",
      "en": "Meatballs",
      "ma": "Bebola daging",
      "ch": "肉丸"
    },
    "Denmark": {
      "ru": "Стегт-флэск\n(свиная грудинка с соусом из петрушки)",
      "en": "Stegt flæsk (Pork Belly with Parsley Sauce)",
      "ma": "Perut Babi dengan Sos Parsli",
      "ch": "香芹醬配煎豬肉"
    },
    "Spain": {
      "ru": "Испанский омлет",
      "en": "Spanish Omelette",
      "ma": "Telur dadar",
      "ch": "西班牙烘蛋"
    },
    "Belgium": {
      "ru": "Картошка фри",
      "en": "Fries",
      "ma": "Ubi Kentang",
      "ch": "薯條"
    },
    "Lithuania": {
      "ru": "Цеппелины\n(картофельные клёцки)",
      "en": "Cepelinai (Potato Dumplings)",
      "ma": "Dumpling Ubi",
      "ch": "馬鈴薯餃子"
    },
    "Croatia": {
      "ru": "Загорские штрукли\n(мучное блюдо\nс начинкой)",
      "en": "Zagorski Štrukli (Dough with Filling)",
      "ma": "Roti berinti",
      "ch": "糕點"
    },
    "Romania": {
      "ru": "Голубцы",
      "en": "Cabbage Rolls",
      "ma": "Kubis begulung",
      "ch": "高麗菜卷"
    },
    "Estonia": {
      "ru": "Вериворст\n(кровяная колбаса)",
      "en": "Verivorst (Blood Sausage)",
      "ma": "Sosej darah",
      "ch": "血腸"
    },
    "Macedonia": {
      "ru": "Тавче гравче\n(жареные бобы)",
      "en": "Tavče gravče (Baked Beans)",
      "ma": "Kacang panggang",
      "ch": "塔維斯格拉維斯(焗豆)"
    },
    "Bulgaria": {
      "ru": "Боб чорба\n(фасолевый суп)",
      "en": "Bob Chorba (Bean Soup)",
      "ma": "Sup kacang",
      "ch": "豆子湯"
    },
    "Isle of Man": {
      "ru": "Королевские гребешки",
      "en": "Queenies (Queen Scallops)",
      "ma": "Kerang",
      "ch": "女王扇貝"
    },
    "Zimbabwe": {
      "ru": "Садза\n(кукурузная каша)",
      "en": "Sadza (Porridge)",
      "ma": "Bubur",
      "ch": "玉米粥"
    },
    "South Africa": {
      "ru": "Боботи\n(мясная запеканка\nс карри)",
      "en": "Bobotie (Curried Minced Meat)",
      "ma": "Daging kari bercincang",
      "ch": "咖哩肉末"
    },
    "Uganda": {
      "ru": "Бананы",
      "en": "Matoke (Plantains)",
      "ma": "Pisang Raja",
      "ch": "大蕉"
    },
    "Morocco": {
      "ru": "Марокканский салат\nиз кускуса",
      "en": "Moroccan Couscous Salad",
      "ma": "Salad Kus Kus",
      "ch": "摩洛哥小米沙拉"
    },
    "Kenya": {
      "ru": "Гитери\n(тушёные фасоль\nс кукурузой)",
      "en": "Githeri (Corn and Beans Stew)",
      "ma": "Jagung dan Kacang Stew",
      "ch": "燉玉米與豆子"
    },
    "Egypt": {
      "ru": "Млухия\n(листья джутовой мальвы)",
      "en": "Mulukhiyah (Leaves of Corchorus Olitorius)",
      "ma": "Daun Jut",
      "ch": "黃麻燉湯"
    },
    "Mexico": {
      "ru": "Тако",
      "en": "Taco",
      "ma": "Taco",
      "ch": "墨西哥夾餅"
    },
    "Canada": {
      "ru": "Тарт с маслом",
      "en": "Butter Tart",
      "ma": "Tart mentega",
      "ch": "奶油塔"
    },
    "Brazil": {
      "ru": "Фейжоада\n(мясо с фасолью\nи маниокой)",
      "en": "Feijoada (Stew)",
      "ma": "Stew Brazil",
      "ch": "燉菜"
    },
    "United States": {
      "ru": "Гамбургер",
      "en": "Hamburger",
      "ma": "Hamburger",
      "ch": "漢堡"
    },
    "Peru": {
      "ru": "Севиче (сырая рыба)",
      "en": "Ceviche (Raw Fish)",
      "ma": "Ikan Mentah Ceviche",
      "ch": "檸汁醃魚生"
    },
    "Bolivia": {
      "ru": "Сальтенья (пирожки)",
      "en": "Salteña (Pastries)",
      "ma": "Pastri",
      "ch": "派餅"
    },
    "Chile": {
      "ru": "Касуэла (рагу)",
      "en": "Cazuela (Stews)",
      "ma": "Stew Chile",
      "ch": "卡茲維拉湯"
    },
    "Cuba": {
      "ru": "Ропа вьеха\n(тушёное мясо)",
      "en": "Ropa Vieja (Meat stew)",
      "ma": "Stew Daging",
      "ch": "破布牛肉"
    },
    "Colombia": {
      "ru": "Бандеха пайса\n(сытная тарелка)",
      "en": "Bandeja Paisa (Paisa Platter)",
      "ma": "Hidangan Paisa",
      "ch": "總匯餐盤"
    },
    "Panama": {
      "ru": "Санкочо\n(куриный суп)",
      "en": "Sancocho (Chicken Stew)",
      "ma": "Stew ayam",
      "ch": "燉雞湯"
    },
    "Uruguay": {
      "ru": "Чивито (сэндвич)",
      "en": "Chivito (Sandwich)",
      "ma": "Sandwic",
      "ch": "三明治"
    },
    "Nicaragua": {
      "ru": "Галло пинто\n(рис с фасолью)",
      "en": "Gallo pinto (Rice and Beans)",
      "ma": "Nasi dan Kacang",
      "ch": "紅豆炒飯"
    },
    "Paraguay": {
      "ru": "Парагвайский суп\n(сухой суп)",
      "en": "Sopa Paraguaya (Paraguayan Soup)",
      "ma": "Sup Paraguay",
      "ch": "巴拉圭湯 (玉米鹹糕)"
    },
    "Australia": {
      "ru": "Веджимайт на тосте (паста из остатков пивного сусла)",
      "en": "Vegemite on Toast",
      "ma": "Roti Bakar dengan Vegemite",
      "ch": "維吉麥土司"
    },
    "New Zealand": {
      "ru": "Киви",
      "en": "Kiwi",
      "ma": "Kiwi",
      "ch": "奇異果"
    },
    "Marshall Islands": {
      "ru": "Плоды хлебного дерева",
      "en": "Breadfruit",
      "ma": "Nangka",
      "ch": "麵包果"
    },
    "Palau": {
      "ru": "Суп\nиз летучих мышей",
      "en": "Fruit Bat Soup",
      "ma": "Sup Kelawar",
      "ch": "水果蝙蝠湯"
    },
    "Cook Island": {
      "ru": "Ика мата (сырая рыба)",
      "en": "Ika Mata (Raw Fish)",
      "ma": "Ikan Mentah",
      "ch": "椰漿生魚沙拉"
    }
  },
  "bonus": {
    "gastro": {
      "title": {
        "ru": "Лекарство для желудка",
        "en": "Gastrointestinal medicine",
        "ma": "Ubat Gastrik",
        "ch": "胃腸藥"
      },
      "desc": {
        "ru": "Уберите жетоны, которые вам не нужны (одноразовая).",
        "en": "Remove the tokens that you don't need (One-time).",
        "ma": "Buang token yang tidak diperlukan (Sekali guna/pakai).",
        "ch": "移除任意餐盤上的籌碼(一次性)。"
      }
    },
    "appetite": {
      "title": {
        "ru": "Хороший аппетит",
        "en": "Good appetite",
        "ma": "Selera yang bagus",
        "ch": "胃口大開"
      },
      "desc": {
        "ru": "Берите 1 дополнительную карту блюда на своём ходу (многоразовая).",
        "en": "Pick 1 additional cuisine card when it is your turn (Permanent).",
        "ma": "Pilih 1 kad kuisine tambahan setelah giliran anda sampai (Sepanjang permainan).",
        "ch": "在你的回合可以額外挑選一張美食卡(持續性)。"
      }
    },
    "irregular": {
      "title": {
        "ru": "Нерегулярное питание",
        "en": "Irregular eating",
        "ma": "Pemakanan yang tidak teratur",
        "ch": "不規律飲食"
      },
      "desc": {
        "ru": "Выбирайте 3 карты блюд, игнорируя правило завтрак-обед-ужин (многоразовая).",
        "en": "Select 3 cuisine cards, ignoring the breakfast-lunch-dinner rule (Permanent).",
        "ma": "Pilih 3 Kad Kuisine, mengabaikan peraturan Sarapan Pagi sehingga Makan malam (Sepanjang permainan).",
        "ch": "無視早餐-中餐-晚餐的順序限制，任意挑選三張美食卡(持續性)。"
      }
    },
    "nutrition": {
      "title": {
        "ru": "Заряд питательной ценности",
        "en": "Nutrition boost",
        "ma": "Peningkatan nutrisi",
        "ch": "營養滿分"
      },
      "desc": {
        "ru": "Возьмите до 5 жетонов на свой выбор (одноразовая).",
        "en": "Collect up to 5 tokens of your choice (One-time).",
        "ma": "Kumpulkan sehingga 5 token bedasarkan pilihan anda (Sekali guna/pakai).",
        "ch": "任意挑選最多五個籌碼(一次性)。"
      }
    },
    "more": {
      "title": {
        "ru": "Ещё раз!",
        "en": "One more!",
        "ma": "Sekali Lagi!",
        "ch": "再來一碗"
      },
      "desc": {
        "ru": "Дополнительный ход (одноразовая).",
        "en": "You get another turn (One-time).",
        "ma": "Anda dapat satu giliran lagi (Sekali guna/pakai).",
        "ch": "在獲得一次行動的回合(一次性)。"
      }
    },
    "power": {
      "title": {
        "ru": "Сила вегана",
        "en": "Power of vegan",
        "ma": "Kekuatan vegan",
        "ch": "素食力量"
      },
      "desc": {
        "ru": "Получите 3 жетона с овощами и 2 с фруктами (одноразовая).",
        "en": "Collect 3 vegetable tokens and 2 fruit tokens (One-time).",
        "ma": "Kumpulkan sehingga 3 token sayur dan 2 token buah (Sekali guna/pakai).",
        "ch": "獲得三個蔬菜籌碼及兩個水果籌碼(一次性)。"
      }
    }
  }
};

if (typeof module !== 'undefined') module.exports = { LANG, LANGS };
