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
  Emergency: [
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
  Hotel: [
    { phrase: 'I have a reservation', translation: 'माझं आरक्षण आहे', transliteration: 'Majha aarakhshan aahe' },
    { phrase: 'Do you have a room available?', translation: 'तुमच्याकडे खोली उपलब्ध आहे का?', transliteration: 'Tumchyakade kholi uplabdh aahe ka?' },
    { phrase: 'What is the room rate?', translation: 'खोलीचा दर काय आहे?', transliteration: 'Kholicha dar kay aahe?' },
    { phrase: 'I need a single room', translation: 'मला सिंगल खोली हवी आहे', transliteration: 'Mala single kholi havi aahe' },
    { phrase: 'Is breakfast included?', translation: 'ब्रेकफास्ट समाविष्ट आहे का?', transliteration: 'Breakfast samavisht aahe ka?' },
    { phrase: 'Can I get room service?', translation: 'मला रूम सर्विस मिळू शकते का?', transliteration: 'Mala room service milu shakte ka?' },
    { phrase: 'Where is the reception?', translation: 'रिसेप्शन कुठे आहे?', transliteration: 'Reception kuthe aahe?' },
    { phrase: 'I need extra towels', translation: 'मला अतिरिक्त टॉवेल्स हवेत', transliteration: 'Mala atirikta towels havet' },
    { phrase: 'Can I check out late?', translation: 'मी उशिरा चेक आउट करू शकतो का?', transliteration: 'Mi ushira check out karu shakto ka?' },
    { phrase: 'The key is not working', translation: 'की काम करत नाही', transliteration: 'Key kaam kart nahi' },
  ],
  Restaurant: [
    { phrase: 'Can I see the menu?', translation: 'मला मेनू दाखवू शकता का?', transliteration: 'Mala menu dakhavu shakta ka?' },
    { phrase: 'What are today’s specials?', translation: 'आजच्या खास डिशेस काय आहेत?', transliteration: 'Aajchya khaas dishes kay aahet?' },
    { phrase: 'I am vegetarian', translation: 'मी शाकाहारी आहे', transliteration: 'Mi shakahaari aahe' },
    { phrase: 'Do you have vegan options?', translation: 'तुमच्याकडे व्हेगन पर्याय आहेत का?', transliteration: 'Tumchyakade vegan paryay aahet ka?' },
    { phrase: 'I need water', translation: 'माझ्या पाण्याची आवश्यकता आहे', transliteration: 'Majhya paanyachi avashyakta aahe' },
    { phrase: 'Can you recommend a dish?', translation: 'तुम्ही एखादं डिश सुचवू शकता का?', transliteration: 'Tumhi ekhad dish suchavu shakta ka?' },
    { phrase: 'Is this spicy?', translation: 'हे तिखट आहे का?', transliteration: 'He tikhat aahe ka?' },
    { phrase: 'I need the bill, please', translation: 'मला बिल हवं आहे, कृपया', transliteration: 'Mala bill hav aahe, krupaya' },
    { phrase: 'Can I pay by card?', translation: 'मी कार्डने पैसे देऊ शकतो का?', transliteration: 'Mi cardne paise deu shakto ka?' },
    { phrase: 'Thank you for the service', translation: 'सेवेसाठी धन्यवाद', transliteration: 'Sevesathi dhanyavad' },
  ],
  Shopping: [
    { phrase: 'How much does this cost?', translation: 'याची किंमत किती आहे?', transliteration: 'Yachi kimat kiti aahe?' },
    { phrase: 'Can you give me a discount?', translation: 'तुम्ही मला डिस्काउंट देऊ शकता का?', transliteration: 'Tumhi mala discount deu shakto ka?' },
    { phrase: 'I am just looking', translation: 'मी फक्त पाहतोय', transliteration: 'Mi fakta pahtoy' },
    { phrase: 'What are your opening hours?', translation: 'तुमचे उघडण्याचे तास काय आहेत?', transliteration: 'Tumche ughdnyache taas kay aahet?' },
    { phrase: 'Do you accept cards?', translation: 'तुम्ही कार्ड स्वीकारता का?', transliteration: 'Tumhi card sweekarta ka?' },
    { phrase: 'I need a receipt', translation: 'मला पावती हवी आहे', transliteration: 'Mala pavati havi aahe' },
    { phrase: 'Where can I find clothes?', translation: 'मला कपडे कुठे सापडतील?', transliteration: 'Mala kapde kuthe sapadtil?' },
    { phrase: 'Do you have this in another size?', translation: 'हे दुसऱ्या साइजमध्ये आहे का?', transliteration: 'He dusrya size madhe aahe ka?' },
    { phrase: 'Can I return this item?', translation: 'मी हा आयटम परत करू शकतो का?', transliteration: 'Mi ha item parat karu shakto ka?' },
    { phrase: 'This is too expensive', translation: 'हे खूप महाग आहे', transliteration: 'He khup mahag aahe' },
  ],
  Sightseeing: [
    { phrase: 'Where is the nearest tourist spot?', translation: 'सर्वात जवळचं पर्यटन स्थळ कुठे आहे?', transliteration: 'Sarvat jawalcha paryatan sthala kuthe aahe?' },
    { phrase: 'What is the entry fee?', translation: 'प्रवेश शुल्क किती आहे?', transliteration: 'Pravesh shulk kiti aahe?' },
    { phrase: 'Are there guided tours available?', translation: 'गाईडेड टूर्स उपलब्ध आहेत का?', transliteration: 'Guided tours uplabdh aahet ka?' },
    { phrase: 'What are the visiting hours?', translation: 'भेट देण्याचे तास काय आहेत?', transliteration: 'Bhet denyache taas kay aahet?' },
    { phrase: 'Can I take photos here?', translation: 'इथे फोटो काढता येतील का?', transliteration: 'Ithe photo kadhta yetil ka?' },
    { phrase: 'Where can I buy tickets?', translation: 'तिकीट कुठे विकत घेता येईल?', transliteration: 'Tikit kuthe vikta gheta yeil?' },
    { phrase: 'Is this place wheelchair accessible?', translation: 'हे ठिकाण व्हीलचेअरसाठी उपयुक्त आहे का?', transliteration: 'He thikaan wheelchair sathi upyukt aahe ka?' },
    { phrase: 'What is the best time to visit?', translation: 'भेट देण्यासाठी सर्वोत्तम वेळ कोणती आहे?', transliteration: 'Bhet denyasathi sarvottam vel konti aahe?' },
    { phrase: 'Is there a souvenir shop here?', translation: 'इथे स्मरणिका दुकान आहे का?', transliteration: 'Ithe smaranika dukaan aahe ka?' },
    { phrase: 'Where is the parking lot?', translation: 'पार्किंग लॉट कुठे आहे?', transliteration: 'Parking lot kuthe aahe?' },
  ],
  Health: [
    { phrase: 'I feel sick', translation: 'माझं तब्येत बरी नाही', transliteration: 'Majha tabyet bari nahi' },
    { phrase: 'I have a fever', translation: 'माझं ताप आहे', transliteration: 'Majha taap aahe' },
    { phrase: 'I need medicine', translation: 'मला औषधं हवी आहेत', transliteration: 'Mala aushadh havi aahet' },
    { phrase: 'Where is the nearest hospital?', translation: 'सर्वात जवळचं हॉस्पिटल कुठे आहे?', transliteration: 'Sarvat jawalcha hospital kuthe aahe?' },
    { phrase: 'I need a doctor', translation: 'माझ्या डॉक्टरची आवश्यकता आहे', transliteration: 'Majhya doctorchi avashyakta aahe' },
    { phrase: 'Do you have first aid?', translation: 'तुमच्याकडे फर्स्ट एड आहे का?', transliteration: 'Tumchyakade first aid aahe ka?' },
    { phrase: 'I need a prescription', translation: 'मला प्रिस्क्रिप्शन हवं आहे', transliteration: 'Mala prescription hava aahe' },
    { phrase: 'Where is the pharmacy?', translation: 'फार्मसी कुठे आहे?', transliteration: 'Pharmacy kuthe aahe?' },
    { phrase: 'Can I get a health checkup?', translation: 'मी हेल्थ चेकअप करू शकतो का?', transliteration: 'Mi health checkup karu shakto ka?' },
    { phrase: 'I need an ambulance', translation: 'मला ॲम्ब्युलन्स हवी आहे', transliteration: 'Mala ambulance havi aahe' },
  ],
};

export default phrases;
