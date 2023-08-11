import { User } from './db-types/User';
import { createDatabaseConnection } from './dbConnect';  // Update the path accordingly


export async function populateSampleData(connection: any) {
    const userRepository = connection.getRepository(User);

    // Sample user data
    const sampleUsers: User[] = [
        {
            user_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe123',
            gender: 'Male',
            age: 25,
            preference: 'News',
            subscription: 'Premium',
            sign_up_date: Date.now(),
            last_active: Date.now(),
            photo_ids: ['photo1', 'photo2'],
            likes: [1, 2, 3],  // Using numeric IDs
            share_location: true,
            geolocation: '40.7128,-74.0060', // Sample coordinates for New York City
            bio: 'Hello, I am John!'
        },
        {
            user_id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            username: 'janesmith456',
            gender: 'Female',
            age: 30,
            preference: 'Sports',
            subscription: 'Basic',
            sign_up_date: Date.now(),
            last_active: Date.now(),
            photo_ids: ['photo3', 'photo4'],
            likes: [1, 2, 3],  // Using numeric IDs
            share_location: false,
            geolocation: '34.0522,-118.2437', // Sample coordinates for Los Angeles
            bio: 'Hi there, I am Jane!'
        }
        // Add more sample users as required
    ];

    for (const user of sampleUsers) {
        await userRepository.save(user);
    }

    console.log('Sample data populated successfully!');
}

// Call the function when you want to populate the data
// Ensure you've established the connection before calling this function.
// Example:
// await populateSampleData(connection);


async function main() {
    const connection = await createDatabaseConnection();
    await populateSampleData(connection);
    console.log("Sample data has been populated successfully!");

    // Close the connection once done
    await connection.close();
    console.log("Database connection closed.");
}

main();