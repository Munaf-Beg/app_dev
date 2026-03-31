import * as SQLite from 'expo-sqlite';

export interface FestEvents {
  id: number;
  name: string;
  category: 'Music' | 'Tech' | 'Dance' | 'Misc' | 'Analytics';
  day: number;
  time: string;
  venue: string;
  registrations: number;
}

export const events: FestEvents[]= [
  { id: 1, name: "Rocktaves", category: "Music", day: 1, time: "22:00", venue: "Main Auditorium", registrations: 1212 },
  { id: 2, name: "Code Relay", category: "Tech", day: 2, time: "10:00", venue: "NAB Audi", registrations: 345 },
  { id: 3, name: "RoboWars", category: "Tech", day: 0, time: "18:30", venue: "Rotunda", registrations: 850 },
  { id: 4, name: "Street Dance", category: "Dance", day: 1, time: "17:00", venue: "Clock Tower", registrations: 620 },
  { id: 5, name: "Paper Presentation", category: "Misc", day: 2, time: "09:30", venue: "NAB 6156", registrations: 115 },
  { id: 6, name: "Hackathon", category: "Tech", day: 3, time: "09:00", venue: "IPC 6114", registrations: 480 },
  { id: 7, name: "Gambling Mathematics", category: "Misc", day: 1, time: "14:00", venue: "NAB 6109", registrations: 290 },
  { id: 8, name: "Product Case Competition 3.0", category: "Analytics", day: 2, time: "11:00", venue: "NAB 6109", registrations: 410 },
  { id: 9, name: "Drone Racing", category: "Tech", day: 1, time: "15:30", venue: "GymG", registrations: 530 },
  { id: 10, name: "Standup Comedy", category: "Misc", day: 3, time: "20:00", venue: "Main Auditorium", registrations: 1450 },
  { id: 11, name: "Treasure Hunt", category: "Misc", day: 2, time: "16:00", venue: "Whole Campus", registrations: 920 },
  { id: 12, name: "Debate Tournament", category: "Misc", day: 1, time: "10:00", venue: "NAB 6109", registrations: 160 },
  { id: 13, name: "AI Pitch Deck", category: "Tech", day: 2, time: "14:30", venue: "NAB 6109", registrations: 240 },
  { id: 14, name: "Folk Dance Fest", category: "Dance", day: 1, time: "19:00", venue: "Rotunda", registrations: 780 },
  { id: 15, name: "Gaming Expo", category: "Tech", day: 2, time: "10:00", venue: "Rotunda", registrations: 1100 },
  { id: 16, name: "DJ night", category: "Music", day: 3, time: "22:30", venue: "South Park", registrations: 2500 },
  { id: 17, name: "Product Design Competition", category: "Analytics", day: 1, time: "11:30", venue: "NAB 6163", registrations: 310 },
  { id: 18, name: "Case Study Competition", category: "Analytics", day: 1, time: "09:00", venue: "NAB 6164", registrations: 380 },
  { id: 19, name: "Finance Modelling Competition", category: "Analytics", day: 2, time: "13:00", venue: "NAB 6164", registrations: 210 },
  { id: 20, name: "Solve for Pilani", category: "Analytics", day: 1, time: "16:30", venue: "GymG", registrations: 650 },
];

const database="fest_event.db"

export const Database = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(database);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        category TEXT,
        day INTEGER,
        time TEXT,
        venue TEXT,
        registrations INTEGER
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS saved_events (
        event_id INTEGER PRIMARY KEY NOT NULL
      );
    `);

    const result = await db.getFirstAsync<{count: number}>('SELECT COUNT(*) as count FROM events;');
    const count = result?.count ?? 0;

    if (count === 0) {
      for (const event of events) {
        await db.runAsync(
          `INSERT INTO events (id, name, category, day, time, venue, registrations) VALUES (?, ?, ?, ?, ?, ?, ?);`,
          ...[event.id, event.name, event.category, event.day, event.time, event.venue, event.registrations]
        );
      }
    }
  } catch (error) {
    console.error("Database error:", error);
  }
};

export const getEventsFromDB = async () => {
    try{
        const db = await SQLite.openDatabaseAsync(database);
        return await db.getAllAsync<FestEvents>('SELECT * FROM events;');
    }
    catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
    }
};

export const getEventsTotal = async () => {
    try{
        const db =await SQLite.openDatabaseAsync(database);
        const result = await db.getFirstAsync<{total:number}>(
            'SELECT COUNT(*) as total FROM events;'
        )
        return result?.total ?? 0;
    }
    catch (error) {
        console.error("Failed to fetch total count:", error);
        return 0;
    }
};

export const getSavedEvents = async () => {
    try{
        const db=await SQLite.openDatabaseAsync(database);
        const result = await db.getAllAsync<{event_id: number}>('SELECT event_id FROM saved_events;')
        return result.map(row => row.event_id);
    }
    catch (error) {
        console.error("Failed to fetch saved events:", error);
        return [];
    }
};

export const toggleSavedEvents = async (eventId: number, isCurrentlySaved:boolean)=> {
    try{
        const db = await SQLite.openDatabaseAsync(database);
        if (isCurrentlySaved) {
            await db.runAsync('DELETE FROM saved_events WHERE event_id = ?;', eventId);
        } else {
            await db.runAsync('INSERT OR IGNORE INTO saved_events (event_id) VALUES (?);', eventId);
        }
    } catch (error) {
        console.error("Failed to toggle saved event:", error);
    }
}