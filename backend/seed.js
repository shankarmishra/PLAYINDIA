const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Define User Schema (simplified)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: { type: String, default: 'player' },
  coins: { type: Number, default: 0 },
  topDays: { type: Number, default: 0 },
  age: Number,
  gender: String,
  sport: String,
  skillLevel: String,
  favoriteGames: [String],
  achievements: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Define Tournament Schema
const tournamentSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  date: Date,
  sportType: String,
  skillLevel: String,
  prize: String,
  banner: String,
  maxTeams: Number,
  registeredTeams: Number,
  status: { type: String, default: 'upcoming' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  leaderboard: [{
    player: String,
    rank: Number,
    score: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

const Tournament = mongoose.models.Tournament || mongoose.model('Tournament', tournamentSchema);

// Sample Data
const sampleUsers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@playindia.com',
    password: 'password123',
    phone: '+91 9876543210',
    role: 'player',
    coins: 1500,
    topDays: 15,
    age: 25,
    gender: 'Male',
    sport: 'Cricket',
    skillLevel: 'Advanced',
    favoriteGames: ['Cricket', 'Football'],
    achievements: ['Tournament Champion 2025', 'Top Scorer']
  },
  {
    name: 'Priya Sharma',
    email: 'priya@playindia.com',
    password: 'password123',
    phone: '+91 9876543211',
    role: 'player',
    coins: 1350,
    topDays: 8,
    age: 23,
    gender: 'Female',
    sport: 'Badminton',
    skillLevel: 'Intermediate',
    favoriteGames: ['Badminton', 'Tennis'],
    achievements: ['Regional Champion']
  },
  {
    name: 'Amit Patel',
    email: 'amit@playindia.com',
    password: 'password123',
    phone: '+91 9876543212',
    role: 'player',
    coins: 1200,
    topDays: 5,
    age: 28,
    gender: 'Male',
    sport: 'Football',
    skillLevel: 'Advanced',
    favoriteGames: ['Football', 'Hockey'],
    achievements: ['Best Defender 2025']
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha@playindia.com',
    password: 'password123',
    phone: '+91 9876543213',
    role: 'player',
    coins: 1100,
    topDays: 3,
    age: 22,
    gender: 'Female',
    sport: 'Tennis',
    skillLevel: 'Intermediate',
    favoriteGames: ['Tennis', 'Badminton'],
    achievements: ['State Level Winner']
  },
  {
    name: 'Vikram Singh',
    email: 'vikram@playindia.com',
    password: 'password123',
    phone: '+91 9876543214',
    role: 'player',
    coins: 980,
    topDays: 2,
    age: 26,
    gender: 'Male',
    sport: 'Basketball',
    skillLevel: 'Beginner',
    favoriteGames: ['Basketball', 'Volleyball'],
    achievements: ['Rising Star']
  },
  {
    name: 'Test User',
    email: 'test@playindia.com',
    password: 'password123',
    phone: '+91 9999999999',
    role: 'player',
    coins: 650,
    topDays: 0,
    age: 24,
    gender: 'Male',
    sport: 'Cricket',
    skillLevel: 'Intermediate',
    favoriteGames: ['Cricket', 'Football', 'Badminton'],
    achievements: ['First Tournament Win', 'Top 10 Player']
  }
];

const sampleTournaments = [
  {
    title: 'Mumbai Cricket Championship 2026',
    description: 'Annual cricket tournament featuring the best teams from Mumbai. Join us for an exciting season of competitive cricket!',
    location: 'Mumbai, Maharashtra',
    date: new Date('2026-03-15'),
    sportType: 'Cricket',
    skillLevel: 'Intermediate',
    prize: '₹50,000',
    maxTeams: 16,
    registeredTeams: 8,
    status: 'upcoming',
    leaderboard: []
  },
  {
    title: 'Delhi Football League',
    description: 'Professional football league bringing together top talents from across Delhi NCR.',
    location: 'Delhi',
    date: new Date('2026-04-20'),
    sportType: 'Football',
    skillLevel: 'Advanced',
    prize: '₹1,00,000',
    maxTeams: 20,
    registeredTeams: 12,
    status: 'upcoming',
    leaderboard: []
  },
  {
    title: 'Bangalore Badminton Open',
    description: 'Open badminton tournament welcoming players of all levels. Singles and doubles categories available.',
    location: 'Bangalore, Karnataka',
    date: new Date('2026-05-10'),
    sportType: 'Badminton',
    skillLevel: 'Beginner',
    prize: '₹25,000',
    maxTeams: 32,
    registeredTeams: 18,
    status: 'upcoming',
    leaderboard: []
  },
  {
    title: 'Kolkata Tennis Masters',
    description: 'Premier tennis tournament with professional courts and experienced referees.',
    location: 'Kolkata, West Bengal',
    date: new Date('2026-06-05'),
    sportType: 'Tennis',
    skillLevel: 'Advanced',
    prize: '₹75,000',
    maxTeams: 24,
    registeredTeams: 15,
    status: 'upcoming',
    leaderboard: []
  },
  {
    title: 'Chennai Basketball Invitational',
    description: 'Invitational basketball tournament for college and club teams.',
    location: 'Chennai, Tamil Nadu',
    date: new Date('2026-07-12'),
    sportType: 'Basketball',
    skillLevel: 'Intermediate',
    prize: '₹40,000',
    maxTeams: 12,
    registeredTeams: 7,
    status: 'upcoming',
    leaderboard: []
  },
  {
    title: 'Hyderabad Volleyball Championship',
    description: 'Championship level volleyball competition with experienced teams.',
    location: 'Hyderabad, Telangana',
    date: new Date('2026-08-18'),
    sportType: 'Volleyball',
    skillLevel: 'Advanced',
    prize: '₹60,000',
    maxTeams: 16,
    registeredTeams: 10,
    status: 'upcoming',
    leaderboard: []
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Tournament.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Hash passwords and create users
    console.log('👥 Creating users...');
    const usersToInsert = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );
    
    const createdUsers = await User.insertMany(usersToInsert);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Display user credentials
    console.log('\n📝 User Credentials:');
    sampleUsers.forEach(user => {
      console.log(`   Email: ${user.email} | Password: password123`);
    });

    // Create tournaments and assign organizers
    console.log('\n🏆 Creating tournaments...');
    const tournamentsToInsert = sampleTournaments.map((tournament, index) => ({
      ...tournament,
      organizer: createdUsers[index % createdUsers.length]._id
    }));
    
    const createdTournaments = await Tournament.insertMany(tournamentsToInsert);
    console.log(`✅ Created ${createdTournaments.length} tournaments\n`);

    // Display summary
    console.log('📊 Database Seeding Summary:');
    console.log(`   ✅ Users: ${createdUsers.length}`);
    console.log(`   ✅ Tournaments: ${createdTournaments.length}`);
    console.log(`   ✅ Total Documents: ${createdUsers.length + createdTournaments.length}`);
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n💡 Test Login Credentials:');
    console.log('   Email: test@playindia.com');
    console.log('   Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
