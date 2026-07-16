import { dummyUser, dummyFoodLogs, dummyActivityLogs } from "../assets/assets";

const getDB = () => {
  const dbStr = localStorage.getItem("fitness_db");

  if (!dbStr) {
    const initialDB = {
      user: null,
      foodLogs: [],
      activityLogs: [],
    };

    return initialDB;
  }

  return JSON.parse(dbStr);
};

const saveDB = (db) => {
  localStorage.setItem("fitness_db", JSON.stringify(db));
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApi = {
  auth: {
    login: async (credentials) => {
      await delay(500);

      let db = getDB();

      if (!db.user) {
        db.user = {
          ...dummyUser,
          email: credentials.identifier || credentials.email,
          username: (credentials.identifier || credentials.email).split("@")[0],
        };

        db.foodLogs = [...dummyFoodLogs];
        db.activityLogs = [...dummyActivityLogs];

        saveDB(db);
      }

      return {
        data: {
          user: db.user,
          jwt: "mock_jwt_token_" + Date.now(),
        },
      };
    },

    register: async (credentials) => {
      await delay(500);

      const db = getDB();

      db.user = {
        id: "user_" + Date.now(),
        username: credentials.username,
        email: credentials.email,
        age: 0,
        weight: 0,
        height: 0,
        goal: "maintain",
        dailyCalorieIntake: 2000,
        dailyCalorieBurn: 400,
        createdAt: new Date().toISOString(),
      };

      db.foodLogs = [];
      db.activityLogs = [];

      saveDB(db);

      return {
        data: {
          user: db.user,
          jwt: "mock_jwt_token_" + Date.now(),
        },
      };
    },
  },

  user: {
    me: async () => {
      await delay(300);

      const db = getDB();

      return {
        data: db.user || dummyUser,
      };
    },

    update: async (_id, updates) => {
      await delay(300);

      const db = getDB();

      if (db.user) {
        db.user = {
          ...db.user,
          ...updates,
        };

        saveDB(db);
      }

      return {
        data: db.user,
      };
    },
  },

  foodLogs: {
    list: async () => {
      await delay(300);

      const db = getDB();

      return {
        data: db.foodLogs,
      };
    },

    create: async (payload) => {
      await delay(300);

      const db = getDB();

      const newEntry = {
        id: Date.now(),
        documentId: "doc_food_" + Date.now(),
        name: payload.name,
        calories: payload.calories,
        mealType: payload.mealType,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      };

      db.foodLogs.push(newEntry);

      saveDB(db);

      return {
        data: newEntry,
      };
    },

    update: async (documentId, updates) => {
      await delay(300);

      const db = getDB();

      db.foodLogs = db.foodLogs.map((food) =>
        food.documentId === documentId ? { ...food, ...updates } : food,
      );

      saveDB(db);

      const updatedEntry = db.foodLogs.find(
        (food) => food.documentId === documentId,
      );

      return {
        data: updatedEntry,
      };
    },

    delete: async (documentId) => {
      await delay(300);

      const db = getDB();

      db.foodLogs = db.foodLogs.filter(
        (food) => food.documentId !== documentId,
      );

      saveDB(db);

      return {
        data: {
          id: documentId,
        },
      };
    },
  },

  activityLogs: {
    list: async () => {
      await delay(300);

      const db = getDB();

      return {
        data: db.activityLogs,
      };
    },

    create: async (payload) => {
      await delay(300);

      const db = getDB();

      const newEntry = {
        id: Date.now(),
        documentId: "doc_act_" + Date.now(),
        name: payload.name,
        duration: payload.duration,
        calories: payload.calories,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      };

      db.activityLogs.push(newEntry);

      saveDB(db);

      return {
        data: newEntry,
      };
    },

    update: async (documentId, updates) => {
      await delay(300);

      const db = getDB();
      let updatedEntry = null;

      db.activityLogs = db.activityLogs.map((entry) => {
        if (entry.documentId === documentId) {
          updatedEntry = {
            ...entry,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          return updatedEntry;
        }
        return entry;
      });

      saveDB(db);

      return {
        data: updatedEntry,
      };
    },

    delete: async (documentId) => {
      await delay(300);

      const db = getDB();

      db.activityLogs = db.activityLogs.filter(
        (activity) => activity.documentId !== documentId,
      );

      saveDB(db);

      return {
        data: {
          id: documentId,
        },
      };
    },
  },

  imageAnalysis: {
    analyze: async (_formData) => {
      await delay(1500);

      const foods = [
        { name: "Apple", calories: 95 },
        { name: "Banana", calories: 105 },
        { name: "Avocado Toast", calories: 250 },
        { name: "Pizza Slice", calories: 300 },
      ];

      const randomFood = foods[Math.floor(Math.random() * foods.length)];

      return {
        data: {
          result: randomFood,
        },
      };
    },
  },
};

export default mockApi;
