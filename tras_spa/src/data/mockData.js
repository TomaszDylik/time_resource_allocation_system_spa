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
    }],

reservations: [
    {
        id: 1,
        userId: 2,
        resourceId: 1,
        startTime: new Date().setHours(10, 0, 0, 0)+86400000, // tmrw at 10:00 AM
        endTime: new Date().setHours(11, 0, 0, 0)+86400000,   // tmwr at 11:00 AM
    }]
};