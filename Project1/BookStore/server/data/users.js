// const bcrypt = require('bcryptjs'); 
// Actually I didn't install bcryptjs in the plan. I'll just store plain text for now as per my controller logic, 
// or I should install bcryptjs. The user controller I wrote earlier did a direct comparison.
// "if (user && (user.password === password))"
// So plain text is fine for this stage.

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123456', // Plain text as per current controller
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        isAdmin: false,
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: '123456',
        isAdmin: false,
    },
];

module.exports = users;
