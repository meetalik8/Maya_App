// Define the type for a single phrase item
export type Phrase = {
  phrase: string;
  translation: string;
  transliteration: string;
};

// Define the type for the phrases object
export type Phrases = {
  [key: string]: Phrase[]; // The keys are strings (e.g., "Greetings", "Survival", etc.)
};

export const phrases: Phrases = {
  Greetings: [
    { phrase: 'Hello', translation: 'नमस्कार', transliteration: 'Namaskar' },
    { phrase: 'Good morning', translation: 'सुप्रभात', transliteration: 'Suprabhat' },
    { phrase: 'Good evening', translation: 'शुभ संध्याकाळ', transliteration: 'Shubh sandhyakal' },
    { phrase: 'How are you?', translation: 'तुम्ही कसे आहात?', transliteration: 'Tumhi kase aahat?' },
    { phrase: 'What’s your name?', translation: 'तुमचं नाव काय आहे?', transliteration: 'Tumcha naav kay aahe?' },
    { phrase: 'Nice to meet you', translation: 'तुमचं भेटून आनंद झाला', transliteration: 'Tumcha bhetun anand zala' },
    { phrase: 'How do you do?', translation: 'कसें करता?', transliteration: 'Kase kartat?' },
    { phrase: 'Good night', translation: 'शुभ रात्री', transliteration: 'Shubh raatri' },
    { phrase: 'See you later', translation: 'नंतर भेटू', transliteration: 'Nantar bhetu' },
    { phrase: 'Take care', translation: 'काळजी घ्या', transliteration: 'Kalji ghya' },
  ],
  Survival: [
    { phrase: 'Help!', translation: 'मदत!', transliteration: 'Madat!' },
    { phrase: 'Call the police!', translation: 'पोलीसांना कॉल करा!', transliteration: 'Polisanna call kara!' },
    { phrase: 'I’m lost', translation: 'मी हरवले आहे', transliteration: 'Mi haravale aahe' },
    { phrase: 'I need a doctor', translation: 'माझ्या डॉक्टरची आवश्यकता आहे', transliteration: 'Majhya doctorchi avashyakta aahe' },
    { phrase: 'I don’t understand', translation: 'माझ्या समजत नाही', transliteration: 'Majha samajat nahi' },
    { phrase: 'Can you help me?', translation: 'तुम्ही माझी मदत करू शकता का?', transliteration: 'Tumhi maazhi madat karu shakta ka?' },
    { phrase: 'I am hungry', translation: 'मला भूक लागली आहे', transliteration: 'Mala bhook lagli aahe' },
    { phrase: 'Where is the bathroom?', translation: 'बाथरूम कुठे आहे?', transliteration: 'Bathroom kuthe aahe?' },
    { phrase: 'I need water', translation: 'माझ्या पाण्याची आवश्यकता आहे', transliteration: 'Majhya paanyachi avashyakta aahe' },
    { phrase: 'Can you speak English?', translation: 'तुम्ही इंग्रजी बोलू शकता का?', transliteration: 'Tumhi English bolu shakta ka?' },
  ],
  Travel: [
    { phrase: 'Where is the station?', translation: 'स्टेशन कुठे आहे?', transliteration: 'Station kuthe aahe?' },
    { phrase: 'How far is the airport?', translation: 'विमानतळ किती दूर आहे?', transliteration: 'Vimantala kiti door aahe?' },
    { phrase: 'I need a taxi', translation: 'मला टॅक्सी हवी आहे', transliteration: 'Mala taxi havi aahe' },
    { phrase: 'What time does the train leave?', translation: 'रेल्वे गाडी किती वाजता निघेल?', transliteration: 'Railway gadi kiti vajta nighel?' },
    { phrase: 'Is there a bus to the city?', translation: 'शहरात बस आहे का?', transliteration: 'Shahrat bus aahe ka?' },
    { phrase: 'How much is a ticket to the museum?', translation: 'संग्रहालयाचे तिकीट किती आहे?', transliteration: 'Sangrahalayache tikit kiti aahe?' },
    { phrase: 'Where can I buy a SIM card?', translation: 'मी SIM कार्ड कुठे विकत घेऊ शकतो?', transliteration: 'Mi SIM card kuthe vikta gheu shakte?' },
    { phrase: 'How do I get to the hotel?', translation: 'हॉटेलकडे कसे जाऊ?', transliteration: 'Hotelkade kase jau?' },
    { phrase: 'What is the best way to get to the market?', translation: 'बाजारात पोहोचण्यासाठी सर्वोत्तम मार्ग कोणता आहे?', transliteration: 'Bajarat pohchanyasathi sarvottam marg konta aahe?' },
    { phrase: 'Can you recommend a good restaurant?', translation: 'तुम्ही चांगल्या रेस्टॉरंटची शिफारस करू शकता का?', transliteration: 'Tumhi changlya restaurant chi shifaras karu shakta ka?' },
  ],
};

export default phrases;
