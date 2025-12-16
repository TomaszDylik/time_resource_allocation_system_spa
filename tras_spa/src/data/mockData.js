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
        startTime: new Date().setHours(14, 0, 0, 0) + 86400000, // tomorrow 14:00
        endTime: new Date().setHours(15, 0, 0, 0) + 86400000, // tomorrow 15:00
        status: 'pending' 
    },
    {
        id: 2,
        userId: 2,
        resourceId: 2,
        startTime: new Date().setHours(10, 0, 0, 0) + 172800000, // day after tomorrow
        endTime: new Date().setHours(10, 30, 0, 0) + 172800000,
        status: 'approved'
    },
    {
        id: 3,
        userId: 2,
        resourceId: 1,
        startTime: new Date().setHours(16, 0, 0, 0) + 259200000, // in 3 days
        endTime: new Date().setHours(17, 0, 0, 0) + 259200000,
        status: 'rejected'
    },
    {
        id: 4,
        userId: 2,
        resourceId: 3,
        startTime: new Date().setHours(9, 0, 0, 0) - 86400000, // yesterday
        endTime: new Date().setHours(10, 30, 0, 0) - 86400000,
        status: 'completed' // ended yesterday
    },
    {
        id: 5,
        userId: 2,
        resourceId: 2,
        startTime: new Date().setHours(15, 0, 0, 0) - 86400000, // yesterday
        endTime: new Date().setHours(15, 30, 0, 0) - 86400000,
        status: 'completed'
    }]
};