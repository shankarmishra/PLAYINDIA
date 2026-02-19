const axios = require('axios');

async function testRegister() {
    const payload = {
        name: "Test User " + Date.now(),
        email: "test_" + Date.now() + "@example.com",
        password: "Password@123",
        mobile: "9" + Math.floor(100000000 + Math.random() * 900000000), // Random 10 digit number starting with 9
        role: "user",
        additionalData: {
            age: 25,
            city: "Mumbai",
            favoriteGames: ["Cricket", "Football"],
            gender: "Male",
            bio: "I love sports!",
            experience: "Intermediate"
        }
    };

    console.log('Sending Registration Payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', payload);
        console.log('Registration Success!');
        console.log('Status Code:', response.status);
        console.log('Response Body:', JSON.stringify(response.data.user, null, 2));

        if (response.data.user.preferences && response.data.user.preferences.age === 25) {
            console.log('SUCCESS: Age field verified in response!');
        } else {
            console.log('FAILURE: Age field missing or incorrect in response.');
        }
    } catch (error) {
        console.error('Registration Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error Message:', error.response.data.message || error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testRegister();
