import sys
import PyPDF2
import pyttsx3
import threading
import io

# Initialize global variables
mytext = ""
engine = pyttsx3.init()
is_playing = False

def extract_text(pdf_data):
    '''To extract text from the PDF file buffer'''
    global mytext
    pdfReader = PyPDF2.PdfReader(io.BytesIO(pdf_data))
    mytext = ""
    for pageNum in range(len(pdfReader.pages)):
        pageObj = pdfReader.pages[pageNum]
        text = pageObj.extract_text()
        if text:  # Only append if text is not None
            mytext += text

def speak_text(rate, voice):
    '''Function to invoke TTS engine to speak the PDF text in a separate thread'''
    global is_playing
    is_playing = True
    engine.setProperty('rate', rate)  # Set the speech rate

    # Set voice based on input
    all_voices = engine.getProperty('voices')
    engine.setProperty('voice', all_voices[0].id if voice == 'male' else all_voices[1].id)

    engine.say(mytext)
    engine.runAndWait()
    is_playing = False

if __name__ == "__main__":
    rate = int(sys.argv[1])  # Get speech rate from command line
    voice = sys.argv[2]  # Get voice type from command line
    # Read PDF data from stdin as binary
    pdf_data = sys.stdin.buffer.read()  # Read PDF data from stdin
    extract_text(pdf_data)  # Directly pass the binary data
    speak_text(rate, voice)
