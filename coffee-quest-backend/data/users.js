// data/users.js

const users = [
  {
    id: "u1",
    name: "Aarav",
    segment: "Urban Millennial Professional",
    city: "Bengaluru",
    preferences: {
      roast: "medium-dark",
      favDrinks: ["cold brew", "espresso"],
      sweetness: "low",
      rewardPreference: "discount",
      brewMethods: ["aeropress", "espresso machine"]
    },
    behavior: {
      avgMonthlyOrders: 3,
      lastOrderDaysAgo: 5,
      typicalCartValue: 1200
    },
    loyalty: {
      level: 3,
      points: 1450,
      streakDays: 4
    }
  },
  {
    id: "u2",
    name: "Isha",
    segment: "Health-Conscious Student",
    city: "Pune",
    preferences: {
      roast: "light",
      favDrinks: ["oat milk latte", "pour-over"],
      sweetness: "medium",
      rewardPreference: "exclusive-content",
      brewMethods: ["pour-over", "french press"]
    },
    behavior: {
      avgMonthlyOrders: 2,
      lastOrderDaysAgo: 10,
      typicalCartValue: 700
    },
    loyalty: {
      level: 2,
      points: 620,
      streakDays: 2
    }
  },
  {
    id: "u3",
    name: "Vikram",
    segment: "Coffee Connoisseur",
    city: "Mumbai",
    preferences: {
      roast: "single-origin light",
      favDrinks: ["manual brew", "filter coffee"],
      sweetness: "low",
      rewardPreference: "early-access",
      brewMethods: ["v60", "south-indian-filter"]
    },
    behavior: {
      avgMonthlyOrders: 5,
      lastOrderDaysAgo: 2,
      typicalCartValue: 1800
    },
    loyalty: {
      level: 5,
      points: 3200,
      streakDays: 9
    }
  }
];

module.exports = { users };
