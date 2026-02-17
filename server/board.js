// Данные игрового поля Монополии
const BOARD_DATA = [
  // 0 - СТАРТ
  {
    id: 0,
    name: "СТАРТ",
    type: "start",
    description: "Получите 200$ при прохождении"
  },
  // 1
  {
    id: 1,
    name: "Житная ул.",
    type: "property",
    color: "brown",
    price: 60,
    rent: [2, 10, 30, 90, 160, 250],
    houseCost: 50,
    mortgage: 30
  },
  // 2
  {
    id: 2,
    name: "Казна",
    type: "chest",
    description: "Общественная казна"
  },
  // 3
  {
    id: 3,
    name: "Нагатинская ул.",
    type: "property",
    color: "brown",
    price: 60,
    rent: [4, 20, 60, 180, 320, 450],
    houseCost: 50,
    mortgage: 30
  },
  // 4
  {
    id: 4,
    name: "Подоходный налог",
    type: "tax",
    amount: 200,
    description: "Заплатите 200$"
  },
  // 5
  {
    id: 5,
    name: "Рижская ж/д",
    type: "railroad",
    price: 200,
    rent: [25, 50, 100, 200],
    mortgage: 100
  },
  // 6
  {
    id: 6,
    name: "Варшавское ш.",
    type: "property",
    color: "lightblue",
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    mortgage: 50
  },
  // 7
  {
    id: 7,
    name: "Шанс",
    type: "chance",
    description: "Карточка шанса"
  },
  // 8
  {
    id: 8,
    name: "Огарёва ул.",
    type: "property",
    color: "lightblue",
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    mortgage: 50
  },
  // 9
  {
    id: 9,
    name: "Первая Парковая ул.",
    type: "property",
    color: "lightblue",
    price: 120,
    rent: [8, 40, 100, 300, 450, 600],
    houseCost: 50,
    mortgage: 60
  },
  // 10 - Тюрьма / Посещение
  {
    id: 10,
    name: "Тюрьма",
    type: "jail",
    description: "Просто посещение"
  },
  // 11
  {
    id: 11,
    name: "Полянка ул.",
    type: "property",
    color: "pink",
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgage: 70
  },
  // 12
  {
    id: 12,
    name: "Электростанция",
    type: "utility",
    price: 150,
    mortgage: 75
  },
  // 13
  {
    id: 13,
    name: "Сретенка ул.",
    type: "property",
    color: "pink",
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgage: 70
  },
  // 14
  {
    id: 14,
    name: "Ростовская наб.",
    type: "property",
    color: "pink",
    price: 160,
    rent: [12, 60, 180, 500, 700, 900],
    houseCost: 100,
    mortgage: 80
  },
  // 15
  {
    id: 15,
    name: "Курская ж/д",
    type: "railroad",
    price: 200,
    rent: [25, 50, 100, 200],
    mortgage: 100
  },
  // 16
  {
    id: 16,
    name: "Рязанский пр.",
    type: "property",
    color: "orange",
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    mortgage: 90
  },
  // 17
  {
    id: 17,
    name: "Казна",
    type: "chest",
    description: "Общественная казна"
  },
  // 18
  {
    id: 18,
    name: "Гоголевский б-р",
    type: "property",
    color: "orange",
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    mortgage: 90
  },
  // 19
  {
    id: 19,
    name: "Новинский б-р",
    type: "property",
    color: "orange",
    price: 200,
    rent: [16, 80, 220, 600, 800, 1000],
    houseCost: 100,
    mortgage: 100
  },
  // 20 - Бесплатная парковка
  {
    id: 20,
    name: "Бесплатная парковка",
    type: "parking",
    description: "Отдыхайте"
  },
  // 21
  {
    id: 21,
    name: "Б. Ордынка ул.",
    type: "property",
    color: "red",
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    mortgage: 110
  },
  // 22
  {
    id: 22,
    name: "Шанс",
    type: "chance",
    description: "Карточка шанса"
  },
  // 23
  {
    id: 23,
    name: "Стромынка ул.",
    type: "property",
    color: "red",
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    mortgage: 110
  },
  // 24
  {
    id: 24,
    name: "Краснопрудная ул.",
    type: "property",
    color: "red",
    price: 240,
    rent: [20, 100, 300, 750, 925, 1100],
    houseCost: 150,
    mortgage: 120
  },
  // 25
  {
    id: 25,
    name: "Казанская ж/д",
    type: "railroad",
    price: 200,
    rent: [25, 50, 100, 200],
    mortgage: 100
  },
  // 26
  {
    id: 26,
    name: "Пр. Вернадского",
    type: "property",
    color: "yellow",
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    mortgage: 130
  },
  // 27
  {
    id: 27,
    name: "Ленинский пр.",
    type: "property",
    color: "yellow",
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    mortgage: 130
  },
  // 28
  {
    id: 28,
    name: "Водопровод",
    type: "utility",
    price: 150,
    mortgage: 75
  },
  // 29
  {
    id: 29,
    name: "Профсоюзная ул.",
    type: "property",
    color: "yellow",
    price: 280,
    rent: [24, 120, 360, 850, 1025, 1200],
    houseCost: 150,
    mortgage: 140
  },
  // 30 - Идите в тюрьму
  {
    id: 30,
    name: "Идите в тюрьму",
    type: "gotojail",
    description: "Отправляйтесь в тюрьму!"
  },
  // 31
  {
    id: 31,
    name: "Ул. Петровка",
    type: "property",
    color: "green",
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgage: 150
  },
  // 32
  {
    id: 32,
    name: "Ул. Пушкинская",
    type: "property",
    color: "green",
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgage: 150
  },
  // 33
  {
    id: 33,
    name: "Казна",
    type: "chest",
    description: "Общественная казна"
  },
  // 34
  {
    id: 34,
    name: "Ул. Маросейка",
    type: "property",
    color: "green",
    price: 320,
    rent: [28, 150, 450, 1000, 1200, 1400],
    houseCost: 200,
    mortgage: 160
  },
  // 35
  {
    id: 35,
    name: "Ленинградская ж/д",
    type: "railroad",
    price: 200,
    rent: [25, 50, 100, 200],
    mortgage: 100
  },
  // 36
  {
    id: 36,
    name: "Шанс",
    type: "chance",
    description: "Карточка шанса"
  },
  // 37
  {
    id: 37,
    name: "Ул. Арбат",
    type: "property",
    color: "darkblue",
    price: 350,
    rent: [35, 175, 500, 1100, 1300, 1500],
    houseCost: 200,
    mortgage: 175
  },
  // 38
  {
    id: 38,
    name: "Сверхналог",
    type: "tax",
    amount: 100,
    description: "Заплатите 100$"
  },
  // 39
  {
    id: 39,
    name: "Ул. Тверская",
    type: "property",
    color: "darkblue",
    price: 400,
    rent: [50, 200, 600, 1400, 1700, 2000],
    houseCost: 200,
    mortgage: 200
  }
];

// Карточки "Шанс"
const CHANCE_CARDS = [
  { text: "Отправляйтесь на СТАРТ. Получите 200$", action: "goto", value: 0 },
  { text: "Идите в тюрьму!", action: "gotojail" },
  { text: "Банк выплачивает вам дивиденды 50$", action: "receive", value: 50 },
  { text: "Штраф за превышение скорости 15$", action: "pay", value: 15 },
  { text: "Пройдите до Курской ж/д", action: "goto", value: 15 },
  { text: "Вы выиграли в конкурсе! Получите 150$", action: "receive", value: 150 },
  { text: "Оплатите ремонт дороги 40$", action: "pay", value: 40 },
  { text: "Переместитесь на 3 клетки назад", action: "back", value: 3 },
  { text: "Пройдите до Ул. Петровка", action: "goto", value: 31 },
  { text: "Вас оштрафовали на 100$", action: "pay", value: 100 }
];

// Карточки "Казна"
const CHEST_CARDS = [
  { text: "Ошибка банка в вашу пользу. Получите 200$", action: "receive", value: 200 },
  { text: "Оплата услуг врача 50$", action: "pay", value: 50 },
  { text: "Возврат подоходного налога 20$", action: "receive", value: 20 },
  { text: "День рождения! Получите 10$ от каждого игрока", action: "birthday", value: 10 },
  { text: "Страховой взнос 50$", action: "pay", value: 50 },
  { text: "Идите в тюрьму!", action: "gotojail" },
  { text: "Получите наследство 100$", action: "receive", value: 100 },
  { text: "Продажа акций - получите 50$", action: "receive", value: 50 },
  { text: "Оплата больничного счёта 100$", action: "pay", value: 100 },
  { text: "Отправляйтесь на СТАРТ", action: "goto", value: 0 }
];

// Группы свойств по цвету
const PROPERTY_GROUPS = {
  brown: [1, 3],
  lightblue: [6, 8, 9],
  pink: [11, 13, 14],
  orange: [16, 18, 19],
  red: [21, 23, 24],
  yellow: [26, 27, 29],
  green: [31, 32, 34],
  darkblue: [37, 39],
  railroad: [5, 15, 25, 35],
  utility: [12, 28]
};

module.exports = { BOARD_DATA, CHANCE_CARDS, CHEST_CARDS, PROPERTY_GROUPS };
