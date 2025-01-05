# Xoul Chat

![Xoul English Meetup](./public/Xoul_banner_image.jpeg)

Xoul Chat is an interactive English tutoring application developed for the Xoul English Meetup in Korea. Built with modern web technologies, it provides a robust platform for practicing English through dynamic, context-aware discussions. The app serves as a supplementary tool for meetup participants to practice English conversations between weekly gatherings.

## About Xoul Meetup

Xoul English Meetup is a weekly gathering in Korea where participants come together to practice and improve their English skills. The meetup:
- Meets every Saturday for 2 hours
- Focuses on natural conversation practice
- Requires advanced English proficiency (IELTS 7.0 or higher)
- Creates a supportive environment for English practice

Join our meetup: [Xoul English Meetup](https://somoim.co.kr/5a36993a-fd4f-11ed-8743-0af85eab1c8b1)

## Technical Overview

### Core Technologies
- **Frontend Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom theming and dark mode support
- **AI Integration**: Groq AI API with LLaMA 3.3 70B model
- **Speech Processing**: 
  - Voice input with MediaRecorder API
  - Text-to-Speech using Unreal Speech API
  - Speech-to-Text using Whisper API
- **State Management**: 
  - React Context API for global state management
    - Manages theme preferences (dark/light mode)
    - Handles user session state
    - Avoids prop drilling in deep component trees
- **Performance Optimization**: 
  - Dynamic Imports (Lazy Loading)
    - Components and modules are loaded only when needed
    - Uses Next.js's built-in `dynamic()` function
    - Reduces initial bundle size and improves page load time
  - Automatic Code Splitting
    - Next.js automatically splits code by pages and routes
    - Each page becomes its own JavaScript bundle
    - Users only download code for the page they're viewing
  - Vercel Speed Insights integration

### Key Technical Features

#### Real-time Audio Processing
- Implements browser's MediaRecorder API for voice capture
- Custom audio processing pipeline for speech-to-text conversion
- Efficient audio streaming with chunked data handling

#### Responsive UI/UX
- Mobile-first design approach
- Dynamic textarea resizing
- Automatic scroll management for chat flow
- Smooth transitions and animations
- Accessible UI components with ARIA support

#### AI Conversation System
- Context-aware conversation management
- Structured prompt engineering
- Real-time response streaming
- Custom feedback parsing and formatting

#### Performance Features
- Optimized asset loading
- Efficient state updates
- Debounced user inputs
- Memory-efficient message handling

## How to use

1. Select a session from the dropdown menu.
2. Choose a specific question to start the conversation.
3. Type your responses in the chat input and press 'Send' or hit Enter.
4. The AI tutor will provide feedback and continue the conversation.

## About

Xoul Chat is developed by Dongwon at [Xoul](https://somoim.co.kr/5a36993a-fd4f-11ed-8743-0af85eab1c8b1).