export const INITIAL_DATA = {

users: [
    {
        id: 1,
        name: 'Admin',
        email: 'admin@spa.pl',
        role: 'admin',
        password: 'password'
    },
    {
        id: 2,
        name: 'Jan Kowalski',
        email: 'jan@spa.pl',
        role: 'user',
        password: 'password'
    }],

resources: [
    {
        id: 1,
        name: 'Strzyżenie',
        duration: 60,
    },
    {
        id: 2,
        name: 'Broda',
        duration: 30,
    },
    {
        id: 3,
        name: 'Strzyżenie + Broda',
        duration: 90,
    },
    {
        id: 4,
        name: 'Koloryzacja brody',
        duration: 30,
    }],

reservations: [
    {
        id: 1,
        userId: 2,
        resourceId: 1,
        startTime: new Date().setHours(14, 0, 0, 0) + 86400000, // jutro 14:00
        endTime: new Date().setHours(15, 0, 0, 0) + 86400000,   // jutro 15:00
        status: 'pending' 
    },
    {
        id: 2,
        userId: 2,
        resourceId: 2,
        startTime: new Date().setHours(10, 0, 0, 0) + 172800000, // pojutrze 10:00
        endTime: new Date().setHours(10, 30, 0, 0) + 172800000,
        status: 'approved'
    },
    {
        id: 3,
        userId: 2,
        resourceId: 1,
        startTime: new Date().setHours(16, 0, 0, 0) + 259200000, // za 3 dni 16:00
        endTime: new Date().setHours(17, 0, 0, 0) + 259200000,
        status: 'rejected'
    }]
};