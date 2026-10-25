/* =====================================================================
   LISTENING STORIES (GAMES-11)
   One short story or dialogue per topic of TOPICS, written for primary
   school, with its multiple-choice questions. Each text has 8 sentences;
   younger grades hear the first ones (GRADE_LEVELS.listeningSentences),
   so the questions are ordered by "line", the sentence that answers them.
   The correct option always appears in that sentence.
   ===================================================================== */

const LISTENING_STORIES = {
    environment: {
        title: "The Class Garden",
        kind: "story",
        lines: [
            { text: "Ana and her class planted a garden behind their school." },
            { text: "They planted tomatoes, carrots and sunflowers in the spring." },
            { text: "Every morning, Ana watered the plants with a green can." },
            { text: "One day, she saw small holes in the leaves." },
            { text: "Her teacher said that hungry caterpillars were eating them." },
            { text: "The class moved the caterpillars to a tree near the fence." },
            { text: "In June, the sunflowers were taller than the students." },
            { text: "Ana felt proud because the garden helped the bees too." }
        ],
        questions: [
            { text: "Where did the class plant the garden?", options: ["In a park", "Behind their school", "At Ana's house"], answer: 1, line: 0 },
            { text: "What did they plant?", options: ["Apples and pears", "Roses and trees", "Tomatoes, carrots and sunflowers"], answer: 2, line: 1 },
            { text: "What color was Ana's watering can?", options: ["Green", "Red", "Blue"], answer: 0, line: 2 },
            { text: "What did Ana see in the leaves?", options: ["Flowers", "Small holes", "Water"], answer: 1, line: 3 },
            { text: "Who was eating the leaves?", options: ["Birds", "Rabbits", "Hungry caterpillars"], answer: 2, line: 4 },
            { text: "Where did the class move the caterpillars?", options: ["To a tree near the fence", "To the classroom", "To a box"], answer: 0, line: 5 },
            { text: "How did Ana feel at the end?", options: ["Sad", "Proud", "Tired"], answer: 1, line: 7 }
        ]
    },

    jobs: {
        title: "What Do You Want to Be?",
        kind: "dialogue",
        lines: [
            { speaker: "Leo", text: "Mia, what do you want to be when you grow up?" },
            { speaker: "Mia", text: "I want to be a vet because I love animals." },
            { speaker: "Leo", text: "That's cool! My aunt is a vet, and she works at a farm." },
            { speaker: "Mia", text: "What about you, Leo? What job do you like?" },
            { speaker: "Leo", text: "I want to be a pilot and fly big planes." },
            { speaker: "Mia", text: "Pilots travel to many countries, right?" },
            { speaker: "Leo", text: "Yes! I want to visit Japan and Brazil." },
            { speaker: "Mia", text: "Then you can fly me to Brazil to help the animals there!" }
        ],
        questions: [
            { text: "What does Leo ask Mia?", options: ["Her favorite food", "What she wants to be", "Where she lives"], answer: 1, line: 0 },
            { text: "What job does Mia want?", options: ["A vet", "A teacher", "A pilot"], answer: 0, line: 1 },
            { text: "Where does Leo's aunt work?", options: ["At a hospital", "At a school", "At a farm"], answer: 2, line: 2 },
            { text: "What does Mia ask Leo?", options: ["What job he likes", "Where he lives", "How old he is"], answer: 0, line: 3 },
            { text: "What job does Leo want?", options: ["A doctor", "A pilot", "A chef"], answer: 1, line: 4 },
            { text: "Which countries does Leo want to visit?", options: ["Japan and Brazil", "Spain and Italy", "Canada and Peru"], answer: 0, line: 6 },
            { text: "Why does Mia want to go to Brazil?", options: ["To swim", "To eat", "To help the animals"], answer: 2, line: 7 }
        ]
    },

    animals: {
        title: "Max the Lost Puppy",
        kind: "story",
        lines: [
            { text: "Tom found a little brown puppy in the rain." },
            { text: "The puppy was wet, cold and very hungry." },
            { text: "Tom took him home and gave him some warm milk." },
            { text: "The puppy had a blue collar with the name Max on it." },
            { text: "Tom and his mom made posters and put them on the street." },
            { text: "Two days later, a girl called them on the phone." },
            { text: "She said that Max was her puppy and she missed him a lot." },
            { text: "When Max saw the girl, he jumped and wagged his tail." }
        ],
        questions: [
            { text: "What did Tom find in the rain?", options: ["A kitten", "A little brown puppy", "A bird"], answer: 1, line: 0 },
            { text: "How was the puppy?", options: ["Happy and dry", "Big and strong", "Wet, cold and very hungry"], answer: 2, line: 1 },
            { text: "What did Tom give the puppy?", options: ["Warm milk", "A bone", "Water"], answer: 0, line: 2 },
            { text: "What was the puppy's name?", options: ["Rex", "Max", "Tom"], answer: 1, line: 3 },
            { text: "What did Tom and his mom make?", options: ["A cake", "A bed", "Posters"], answer: 2, line: 4 },
            { text: "When did the girl call?", options: ["Two days later", "The next week", "That night"], answer: 0, line: 5 },
            { text: "What did Max do when he saw the girl?", options: ["He slept", "He jumped and wagged his tail", "He ran away"], answer: 1, line: 7 }
        ]
    },

    health: {
        title: "Sara's Healthy Week",
        kind: "story",
        lines: [
            { text: "Sara wanted to feel strong for the school race." },
            { text: "Every morning, she ate oatmeal with bananas for breakfast." },
            { text: "She drank a lot of water and only a little juice." },
            { text: "After school, she rode her bike for thirty minutes." },
            { text: "She went to bed at nine o'clock every night." },
            { text: "On Friday, she washed her hands before lunch, like always." },
            { text: "On the day of the race, Sara felt full of energy." },
            { text: "She finished in second place and smiled at her parents." }
        ],
        questions: [
            { text: "Why did Sara want to feel strong?", options: ["For a trip", "For the school race", "For a party"], answer: 1, line: 0 },
            { text: "What did Sara eat for breakfast?", options: ["Oatmeal with bananas", "Pancakes", "Eggs and toast"], answer: 0, line: 1 },
            { text: "What did she drink a lot of?", options: ["Milk", "Soda", "Water"], answer: 2, line: 2 },
            { text: "What did she do after school?", options: ["She rode her bike", "She watched TV", "She played chess"], answer: 0, line: 3 },
            { text: "What time did she go to bed?", options: ["At eight o'clock", "At nine o'clock", "At ten o'clock"], answer: 1, line: 4 },
            { text: "How did Sara feel on the day of the race?", options: ["Sick", "Sleepy", "Full of energy"], answer: 2, line: 6 },
            { text: "In what place did Sara finish?", options: ["First place", "Second place", "Last place"], answer: 1, line: 7 }
        ]
    },

    food: {
        title: "Making Pancakes",
        kind: "dialogue",
        lines: [
            { speaker: "Dad", text: "Good morning, Lucy! Do you want to make pancakes with me?" },
            { speaker: "Lucy", text: "Yes, please! What do we need?" },
            { speaker: "Dad", text: "We need flour, two eggs, milk and a little sugar." },
            { speaker: "Lucy", text: "Can I mix everything in the big bowl?" },
            { speaker: "Dad", text: "Sure, but mix it slowly so it doesn't spill." },
            { speaker: "Lucy", text: "The pan is very hot, so you can cook them, Dad." },
            { speaker: "Dad", text: "Good idea. Do you want honey or strawberries on top?" },
            { speaker: "Lucy", text: "Strawberries, please! They are my favorite fruit." }
        ],
        questions: [
            { text: "What do Dad and Lucy want to make?", options: ["Cookies", "Pancakes", "Sandwiches"], answer: 1, line: 0 },
            { text: "What does Lucy say?", options: ["No, thank you", "I'm tired", "Yes, please"], answer: 2, line: 1 },
            { text: "How many eggs do they need?", options: ["Two eggs", "Three eggs", "One egg"], answer: 0, line: 2 },
            { text: "Where does Lucy want to mix everything?", options: ["In a cup", "In the big bowl", "In the pan"], answer: 1, line: 3 },
            { text: "How does Dad say to mix it?", options: ["Fast", "Slowly", "With a fork"], answer: 1, line: 4 },
            { text: "Why does Dad cook the pancakes?", options: ["The pan is very hot", "Lucy is busy", "Lucy is sleeping"], answer: 0, line: 5 },
            { text: "What does Lucy want on top?", options: ["Honey", "Chocolate", "Strawberries"], answer: 2, line: 7 }
        ]
    },

    sports: {
        title: "The Big Soccer Game",
        kind: "dialogue",
        lines: [
            { speaker: "Coach", text: "Team, today we play against the Blue Tigers." },
            { speaker: "Pablo", text: "Coach, I'm nervous. They won every game this year." },
            { speaker: "Coach", text: "Don't worry, Pablo. You practiced very hard every Tuesday." },
            { speaker: "Pablo", text: "OK. Where do you want me to play?" },
            { speaker: "Coach", text: "You are the goalkeeper today, so watch the ball." },
            { speaker: "Pablo", text: "I stopped the ball three times! Did we win?" },
            { speaker: "Coach", text: "Yes, we won two to one. You were fantastic." },
            { speaker: "Pablo", text: "Let's celebrate with ice cream after the game!" }
        ],
        questions: [
            { text: "Who does the team play against today?", options: ["The Red Lions", "The Blue Tigers", "The Green Bears"], answer: 1, line: 0 },
            { text: "How does Pablo feel at the beginning?", options: ["Nervous", "Happy", "Angry"], answer: 0, line: 1 },
            { text: "When did Pablo practice?", options: ["Every Friday", "Every weekend", "Every Tuesday"], answer: 2, line: 2 },
            { text: "What does Pablo ask the coach?", options: ["Where to play", "What time it is", "Where the ball is"], answer: 0, line: 3 },
            { text: "What position does Pablo play today?", options: ["Forward", "Goalkeeper", "Defender"], answer: 1, line: 4 },
            { text: "How many times did Pablo stop the ball?", options: ["Two times", "Five times", "Three times"], answer: 2, line: 5 },
            { text: "What was the final score?", options: ["Two to one", "Three to zero", "Four to three"], answer: 0, line: 6 }
        ]
    },

    science: {
        title: "The Volcano Experiment",
        kind: "story",
        lines: [
            { text: "Diego wanted to make a volcano for the science fair." },
            { text: "He built a small mountain with clay and painted it brown." },
            { text: "Inside the volcano, he put a cup with baking soda." },
            { text: "Then he added red food coloring to make it look like lava." },
            { text: "His sister poured vinegar into the cup very carefully." },
            { text: "The red foam came out of the volcano and everybody laughed." },
            { text: "Diego explained that the soda and the vinegar make a gas." },
            { text: "The judges gave him a blue ribbon for his experiment." }
        ],
        questions: [
            { text: "Why did Diego make a volcano?", options: ["For his birthday", "For the science fair", "For his sister"], answer: 1, line: 0 },
            { text: "What did he use to build the mountain?", options: ["Paper", "Sand", "Clay"], answer: 2, line: 1 },
            { text: "What did he put inside the volcano?", options: ["A cup with baking soda", "A bottle of water", "A candle"], answer: 0, line: 2 },
            { text: "Why did he add red food coloring?", options: ["To make it smell good", "To make it look like lava", "To make it hot"], answer: 1, line: 3 },
            { text: "Who poured the vinegar?", options: ["His teacher", "His dad", "His sister"], answer: 2, line: 4 },
            { text: "What came out of the volcano?", options: ["Red foam", "Smoke", "Water"], answer: 0, line: 5 },
            { text: "What did the judges give Diego?", options: ["A gold medal", "A blue ribbon", "A book"], answer: 1, line: 7 }
        ]
    },

    space: {
        title: "A Trip to the Moon",
        kind: "story",
        lines: [
            { text: "Astronaut Kim is flying to the Moon in a big rocket." },
            { text: "The trip takes three days, and she sleeps in a small bed." },
            { text: "In space, everything floats, even her toothbrush." },
            { text: "When she lands, she sees gray rocks and deep craters." },
            { text: "Kim jumps very high because the Moon has weak gravity." },
            { text: "She looks up and sees the Earth, blue and beautiful." },
            { text: "She collects some rocks to study back home." },
            { text: "Before she leaves, she puts a small flag on the ground." }
        ],
        questions: [
            { text: "Where is Kim flying?", options: ["To Mars", "To the Moon", "To the Sun"], answer: 1, line: 0 },
            { text: "How long does the trip take?", options: ["Three days", "One week", "Two hours"], answer: 0, line: 1 },
            { text: "What floats in space?", options: ["Only the rocket", "Nothing", "Everything, even her toothbrush"], answer: 2, line: 2 },
            { text: "What does Kim see when she lands?", options: ["Trees and rivers", "Gray rocks and deep craters", "Houses"], answer: 1, line: 3 },
            { text: "Why does Kim jump very high?", options: ["The Moon has weak gravity", "She has special shoes", "She is happy"], answer: 0, line: 4 },
            { text: "What does Kim see when she looks up?", options: ["The Sun", "The stars", "The Earth"], answer: 2, line: 5 },
            { text: "What does Kim put on the ground?", options: ["A small flag", "A sign", "A plant"], answer: 0, line: 7 }
        ]
    },

    weather: {
        title: "The Rainy Picnic",
        kind: "story",
        lines: [
            { text: "On Saturday, the Garcia family went to the park for a picnic." },
            { text: "The sky was sunny, and the air was warm." },
            { text: "They ate sandwiches and watermelon under a big tree." },
            { text: "Suddenly, dark clouds covered the sun." },
            { text: "Then it started to rain, and the wind was very strong." },
            { text: "The family ran to the car with the blanket over their heads." },
            { text: "After twenty minutes, the rain stopped." },
            { text: "They saw a beautiful rainbow over the park." }
        ],
        questions: [
            { text: "When did the family go to the park?", options: ["On Sunday", "On Saturday", "On Friday"], answer: 1, line: 0 },
            { text: "How was the weather at first?", options: ["Rainy and cold", "Snowy", "Sunny and warm"], answer: 2, line: 1 },
            { text: "What did they eat?", options: ["Sandwiches and watermelon", "Pizza and apples", "Tacos and oranges"], answer: 0, line: 2 },
            { text: "What covered the sun?", options: ["Birds", "Dark clouds", "Smoke"], answer: 1, line: 3 },
            { text: "How was the wind?", options: ["Very strong", "Very weak", "Hot"], answer: 0, line: 4 },
            { text: "When did the rain stop?", options: ["After two hours", "The next day", "After twenty minutes"], answer: 2, line: 6 },
            { text: "What did they see over the park?", options: ["A plane", "A rainbow", "The Moon"], answer: 1, line: 7 }
        ]
    },

    feelings: {
        title: "A Bad Day",
        kind: "dialogue",
        lines: [
            { speaker: "Emma", text: "Hi, Noah. You look sad. What's wrong?" },
            { speaker: "Noah", text: "I lost my favorite pencil case this morning." },
            { speaker: "Emma", text: "Oh no! What color is it?" },
            { speaker: "Noah", text: "It's yellow, and it has a lion on it." },
            { speaker: "Emma", text: "I saw a yellow pencil case in the library!" },
            { speaker: "Noah", text: "Really? Let's go and look right now." },
            { speaker: "Emma", text: "Here it is, on the table next to the window." },
            { speaker: "Noah", text: "Thank you, Emma! Now I feel happy again." }
        ],
        questions: [
            { text: "How does Noah look at the beginning?", options: ["Sad", "Angry", "Excited"], answer: 0, line: 0 },
            { text: "What did Noah lose?", options: ["His backpack", "His favorite pencil case", "His book"], answer: 1, line: 1 },
            { text: "What does Emma ask?", options: ["Where Noah lives", "What time it is", "What color it is"], answer: 2, line: 2 },
            { text: "What is on the pencil case?", options: ["A tiger", "A lion", "A star"], answer: 1, line: 3 },
            { text: "Where did Emma see a pencil case?", options: ["In the library", "In the gym", "In the bathroom"], answer: 0, line: 4 },
            { text: "Where is the pencil case?", options: ["Under a chair", "In a box", "On the table next to the window"], answer: 2, line: 6 },
            { text: "How does Noah feel at the end?", options: ["Tired", "Happy", "Worried"], answer: 1, line: 7 }
        ]
    },

    school: {
        title: "The New Student",
        kind: "dialogue",
        lines: [
            { speaker: "Teacher", text: "Class, this is Hana. She is our new student." },
            { speaker: "Hana", text: "Hello, everyone. I'm from Korea, and I'm ten years old." },
            { speaker: "Teacher", text: "Hana, you can sit next to Carlos, near the board." },
            { speaker: "Carlos", text: "Hi, Hana! Do you like math?" },
            { speaker: "Hana", text: "Yes, math is my favorite subject, and I also like art." },
            { speaker: "Carlos", text: "At recess, we play basketball. Do you want to play?" },
            { speaker: "Hana", text: "Sure! In Korea, I played on a basketball team." },
            { speaker: "Carlos", text: "Great! Welcome to our school, Hana." }
        ],
        questions: [
            { text: "Who is Hana?", options: ["A doctor", "A new student", "Carlos's sister"], answer: 1, line: 0 },
            { text: "Where is Hana from?", options: ["Korea", "Japan", "China"], answer: 0, line: 1 },
            { text: "Where does Hana sit?", options: ["Near the door", "Near the window", "Next to Carlos, near the board"], answer: 2, line: 2 },
            { text: "What does Carlos ask Hana?", options: ["If she likes math", "If she has a dog", "Where she lives"], answer: 0, line: 3 },
            { text: "What is Hana's favorite subject?", options: ["Science", "Math", "English"], answer: 1, line: 4 },
            { text: "What do they play at recess?", options: ["Soccer", "Tag", "Basketball"], answer: 2, line: 5 },
            { text: "What did Hana do in Korea?", options: ["She played on a basketball team", "She sang in a choir", "She swam"], answer: 0, line: 6 }
        ]
    },

    arts: {
        title: "The School Concert",
        kind: "story",
        lines: [
            { text: "Every year, Valeria's school has a concert in December." },
            { text: "This year, Valeria wants to play the violin." },
            { text: "She practices for one hour every afternoon." },
            { text: "Her brother paints a big poster with music notes." },
            { text: "On the night of the concert, the hall is full of families." },
            { text: "Valeria is nervous, but she takes a deep breath." },
            { text: "She plays a beautiful song, and nobody makes a sound." },
            { text: "At the end, everybody claps and her grandma cries with joy." }
        ],
        questions: [
            { text: "When is the school concert?", options: ["In December", "In May", "In July"], answer: 0, line: 0 },
            { text: "What instrument does Valeria want to play?", options: ["The piano", "The violin", "The guitar"], answer: 1, line: 1 },
            { text: "How long does she practice every afternoon?", options: ["Ten minutes", "Two hours", "One hour"], answer: 2, line: 2 },
            { text: "What does her brother paint?", options: ["A big poster with music notes", "A picture of a cat", "The wall"], answer: 0, line: 3 },
            { text: "Who is in the hall?", options: ["Only teachers", "Families", "Nobody"], answer: 1, line: 4 },
            { text: "What does Valeria do when she is nervous?", options: ["She cries", "She runs away", "She takes a deep breath"], answer: 2, line: 5 },
            { text: "What does her grandma do at the end?", options: ["She sleeps", "She cries with joy", "She sings"], answer: 1, line: 7 }
        ]
    },

    technology: {
        title: "Robot Rob",
        kind: "story",
        lines: [
            { text: "Mateo and his friends built a robot in the computer club." },
            { text: "They called the robot Rob, and it had four wheels." },
            { text: "Rob had a small camera on its head to see the way." },
            { text: "The children wrote a program on a laptop to move it." },
            { text: "First, Rob moved forward and turned left." },
            { text: "Then it picked up a ball and put it in a basket." },
            { text: "One time, Rob hit the wall, and everybody laughed." },
            { text: "Mateo fixed the program, and Rob won the robot contest." }
        ],
        questions: [
            { text: "Where did Mateo and his friends build the robot?", options: ["At home", "In the computer club", "At the park"], answer: 1, line: 0 },
            { text: "How many wheels did Rob have?", options: ["Four wheels", "Two wheels", "Six wheels"], answer: 0, line: 1 },
            { text: "What did Rob have on its head?", options: ["A light", "A hat", "A small camera"], answer: 2, line: 2 },
            { text: "What did the children use to write the program?", options: ["A phone", "A laptop", "A notebook"], answer: 1, line: 3 },
            { text: "Which way did Rob turn first?", options: ["Left", "Right", "Back"], answer: 0, line: 4 },
            { text: "Where did Rob put the ball?", options: ["On the table", "In a box", "In a basket"], answer: 2, line: 5 },
            { text: "What did Rob win?", options: ["A soccer game", "The robot contest", "A prize for art"], answer: 1, line: 7 }
        ]
    },

    travel: {
        title: "At the Airport",
        kind: "dialogue",
        lines: [
            { speaker: "Mom", text: "Hurry, Ben! Our plane to Cancun leaves at ten o'clock." },
            { speaker: "Ben", text: "I'm coming, Mom! I have my backpack and my passport." },
            { speaker: "Mom", text: "Great. First, we need to check our big suitcase." },
            { speaker: "Ben", text: "Can I sit next to the window on the plane?" },
            { speaker: "Mom", text: "Yes, you can. Your seat is number twelve A." },
            { speaker: "Ben", text: "How long is the flight?" },
            { speaker: "Mom", text: "It's two hours, so you can read your comic book." },
            { speaker: "Ben", text: "I can't wait to swim in the sea and build sandcastles!" }
        ],
        questions: [
            { text: "Where are Ben and his mom going?", options: ["To Cancun", "To Mexico City", "To Madrid"], answer: 0, line: 0 },
            { text: "What does Ben have?", options: ["His camera and his hat", "His backpack and his passport", "His ball"], answer: 1, line: 1 },
            { text: "What do they need to do first?", options: ["Eat breakfast", "Buy tickets", "Check their big suitcase"], answer: 2, line: 2 },
            { text: "Where does Ben want to sit?", options: ["Next to the window", "Next to the door", "In the back"], answer: 0, line: 3 },
            { text: "What is Ben's seat number?", options: ["Ten B", "Twelve A", "Two C"], answer: 1, line: 4 },
            { text: "How long is the flight?", options: ["Five hours", "One hour", "Two hours"], answer: 2, line: 6 },
            { text: "What does Ben want to build?", options: ["A robot", "Sandcastles", "A kite"], answer: 1, line: 7 }
        ]
    },

    home: {
        title: "Cleaning Day",
        kind: "dialogue",
        lines: [
            { speaker: "Grandpa", text: "Today is Sunday, so it's cleaning day in our house." },
            { speaker: "Julia", text: "Oh no, Grandpa! Can I clean my bedroom first?" },
            { speaker: "Grandpa", text: "Yes. Please make your bed and put your toys in the box." },
            { speaker: "Julia", text: "Done! Now I can help you in the kitchen." },
            { speaker: "Grandpa", text: "Thank you. You can wash the dishes, and I can sweep the floor." },
            { speaker: "Julia", text: "Our house looks so clean now!" },
            { speaker: "Grandpa", text: "You worked very hard. Let's make lemonade." },
            { speaker: "Julia", text: "Yes! And then we can play cards in the living room." }
        ],
        questions: [
            { text: "What day is it?", options: ["Saturday", "Sunday", "Monday"], answer: 1, line: 0 },
            { text: "What does Julia want to clean first?", options: ["Her bedroom", "The garden", "The car"], answer: 0, line: 1 },
            { text: "Where does Julia put her toys?", options: ["Under the bed", "On a shelf", "In the box"], answer: 2, line: 2 },
            { text: "Where does Julia help next?", options: ["In the kitchen", "In the garage", "In the bathroom"], answer: 0, line: 3 },
            { text: "What does Grandpa do?", options: ["He cooks", "He sweeps the floor", "He washes the car"], answer: 1, line: 4 },
            { text: "What do they make after cleaning?", options: ["Cookies", "Tea", "Lemonade"], answer: 2, line: 6 },
            { text: "What do they play in the living room?", options: ["Cards", "Video games", "Chess"], answer: 0, line: 7 }
        ]
    },

    ocean: {
        title: "The Sea Turtle",
        kind: "story",
        lines: [
            { text: "Every summer, Isabel visits her uncle near the beach." },
            { text: "One night, they saw a big sea turtle on the sand." },
            { text: "The turtle was digging a hole to lay her eggs." },
            { text: "Her uncle said that they must stay quiet and far away." },
            { text: "Two months later, the baby turtles came out of the sand." },
            { text: "The babies were very small and walked to the water." },
            { text: "Isabel used a red light, because bright lights confuse the babies." },
            { text: "She hopes the baby turtles come back to the same beach one day." }
        ],
        questions: [
            { text: "Who does Isabel visit every summer?", options: ["Her grandma", "Her uncle", "Her best friend"], answer: 1, line: 0 },
            { text: "What did they see on the sand?", options: ["A big sea turtle", "A crab", "A dolphin"], answer: 0, line: 1 },
            { text: "What was the turtle doing?", options: ["Sleeping", "Eating", "Digging a hole to lay her eggs"], answer: 2, line: 2 },
            { text: "What did her uncle say?", options: ["Take a photo", "Stay quiet and far away", "Touch the turtle"], answer: 1, line: 3 },
            { text: "When did the baby turtles come out?", options: ["Two months later", "The next day", "One year later"], answer: 0, line: 4 },
            { text: "Where did the baby turtles walk?", options: ["To the trees", "To the house", "To the water"], answer: 2, line: 5 },
            { text: "What color light did Isabel use?", options: ["White", "Red", "Green"], answer: 1, line: 6 }
        ]
    },

    recycling: {
        title: "The Recycling Team",
        kind: "dialogue",
        lines: [
            { speaker: "Ms. Lopez", text: "Students, this week we are the recycling team of the school." },
            { speaker: "Andres", text: "What do we need to do, Ms. Lopez?" },
            { speaker: "Ms. Lopez", text: "We have three bins: blue for paper, yellow for plastic and green for glass." },
            { speaker: "Andres", text: "This empty bottle is plastic, so it goes in the yellow bin." },
            { speaker: "Ms. Lopez", text: "Correct! And old newspapers go in the blue bin." },
            { speaker: "Andres", text: "Can we use the boxes to make something new?" },
            { speaker: "Ms. Lopez", text: "Yes, on Friday we can make toy cars with them." },
            { speaker: "Andres", text: "Recycling is fun, and it helps our planet!" }
        ],
        questions: [
            { text: "What is the class this week?", options: ["The art team", "The recycling team", "The soccer team"], answer: 1, line: 0 },
            { text: "What does Andres ask?", options: ["What they need to do", "Where the bins are", "What time it is"], answer: 0, line: 1 },
            { text: "What color is the bin for glass?", options: ["Red", "Orange", "Green"], answer: 2, line: 2 },
            { text: "Where does the plastic bottle go?", options: ["In the yellow bin", "In the green bin", "In the trash"], answer: 0, line: 3 },
            { text: "Where do old newspapers go?", options: ["In the green bin", "In the blue bin", "In the yellow bin"], answer: 1, line: 4 },
            { text: "What can they make on Friday?", options: ["Paper planes", "Masks", "Toy cars"], answer: 2, line: 6 },
            { text: "What does Andres say about recycling?", options: ["It is boring", "It helps our planet", "It is hard"], answer: 1, line: 7 }
        ]
    },

    community: {
        title: "Helping at the Food Bank",
        kind: "story",
        lines: [
            { text: "On Saturday morning, Camila went to the food bank with her dad." },
            { text: "The food bank gives food to families who need help." },
            { text: "Camila put rice, beans and cans of soup into bags." },
            { text: "Her dad carried the heavy boxes to the truck." },
            { text: "An old man thanked Camila and gave her a big smile." },
            { text: "At lunch, the volunteers ate tacos together." },
            { text: "Camila made a new friend named Rosa." },
            { text: "She wants to come back next month and bring her cousins." }
        ],
        questions: [
            { text: "Where did Camila go on Saturday morning?", options: ["To the zoo", "To the food bank", "To the market"], answer: 1, line: 0 },
            { text: "What does the food bank do?", options: ["It gives food to families who need help", "It sells toys", "It cleans parks"], answer: 0, line: 1 },
            { text: "What did Camila put into bags?", options: ["Toys and books", "Clothes", "Rice, beans and cans of soup"], answer: 2, line: 2 },
            { text: "What did her dad carry?", options: ["The heavy boxes", "A chair", "The bags of rice"], answer: 0, line: 3 },
            { text: "Who thanked Camila?", options: ["A little girl", "An old man", "Her teacher"], answer: 1, line: 4 },
            { text: "What did the volunteers eat at lunch?", options: ["Pizza", "Sandwiches", "Tacos"], answer: 2, line: 5 },
            { text: "What was the name of Camila's new friend?", options: ["Rosa", "Lucia", "Maria"], answer: 0, line: 6 }
        ]
    }
};
