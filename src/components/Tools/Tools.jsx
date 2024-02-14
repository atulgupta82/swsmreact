import React, {useEffect, useRef, useState} from 'react'
import './tools.css'
import googleTranslate from '../../assets/images/googleTranslate.png';
import b_keyboard from '../../assets/images/b_keyboard.png';
import magnifier from '../../assets/images/magnifier.png';
import text_to_speech from '../../assets/images/text_to_speech.png';
import SidebarProfile from '../SidebarProfile/SidebarProfile';
import {IoArrowBackSharp} from 'react-icons/io5';
import { goback } from '../../helper/Utils';
import {useNavigate} from "react-router-dom";

const Tools = () => {
    /*const navigate = useNavigate();
    const isMounted = useRef(true);
    const [scriptAdded, setScriptAdded] = useState(false);

    useEffect(() => {
        // Function to initialize Google Translate script
        const initGoogleTranslateScript = () => {
            if (!scriptAdded) {
                const existingScript = document.getElementById('google-translate-script');
                if (!existingScript) {
                    const script = document.createElement('script');
                    script.id = 'google-translate-script';
                    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                    script.async = true;
                    script.onload = () => {
                        // Initialize the Google Translate element
                        window.googleTranslateElementInit = () => {
                            new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
                        };
                    };

                    // Append the script to the body
                    document.body.appendChild(script);

                    // Update state to indicate that the script has been added
                    setScriptAdded(true);
                }
            }
        };

        // Initialize Google Translate script on component mount
        initGoogleTranslateScript();

        // Cleanup the script when the component unmounts
        return () => {
            if (isMounted.current) {
                const existingScript = document.getElementById('google-translate-script');
                if (existingScript) {
                    existingScript.parentNode.removeChild(existingScript);
                }
            }
        };
    }, [navigate, scriptAdded]);

    useEffect(() => {
        // Set isMounted to false when the component is unmounted
        return () => {
            isMounted.current = false;
        };
    }, []);*/
    /*useEffect(() => {
        // Check if the SpeechSynthesis API is available
        if ('speechSynthesis' in window) {
            const synthesis = window.speechSynthesis;
            const voices = synthesis.getVoices();

            // Example function to speak a given text
            const speakText = (text) => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.voice = voices[0]; // Use the first available voice
                synthesis.speak(utterance);
            };

            // Example usage
            const handleTextToSpeechClick = () => {
                const textToSpeak = 'Hello, this is a sample text for text-to-speech.';
                speakText(textToSpeak);
            };

            // Attach the event listener to the text-to-speech icon
            const textToSpeechIconElement = document.getElementById('text_to_speech_icon');
            if (textToSpeechIconElement) {
                textToSpeechIconElement.addEventListener('click', handleTextToSpeechClick);
            }
        }
    }, []);*/


    return (
    <div className='tools'>
        <div className='tools_wrapper'>
            <div className='eachTool'>
                <div className='eachToolIcon goback' onClick={goback}>
                    <IoArrowBackSharp/>
                </div>
            </div>
            <div className='eachTool' id="google_translate_element">
                <div className='eachToolIcon'>
                    <img src={googleTranslate} alt="googleTranslate" />
                </div>
                <div className='eachToolText'><span>Google Translate</span></div>
            </div>
            <div className='eachTool'>
                <div className='eachToolIcon' id="text_to_speech_icon">
                    <img src={text_to_speech} alt="googleTranslate" />
                </div>
                <div className='eachToolText'><span>Text Speech</span></div>
            </div>
            <div className='eachTool'>
                <div className='eachToolIcon'>
                    <img src={magnifier} alt="googleTranslate" />
                </div>
                <div className='eachToolText'><span>Magnifier</span></div>
            </div>
            <div className='eachTool'>
                <div className='eachToolIcon'>
                    <img src={b_keyboard} alt="googleTranslate" />
                </div>
                <div className='eachToolText'><span>Braille Keyboard</span></div>
            </div>
        </div>
        <SidebarProfile/>
    </div>
  )
}

export default Tools
