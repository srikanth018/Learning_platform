import PyPDF2
import pyttsx3

def extract_text(filename):
    """
    Function to extract text from pdf at given filename
    """
    pdfFileObj = open(filename, "rb")
    pdfReader = PyPDF2.PdfReader(pdfFileObj)

    mytext = ""

    for pageNum in range(len(pdfReader.pages)):
        pageObj = pdfReader.pages[pageNum]
        mytext += pageObj.extract_text()

    pdfFileObj.close()

    return mytext


def speak_text(text):
    """
    Function to invoke TTS engine to speak the pdf text
    """
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)
    engine.setProperty('voice', 'english+m7')  # Modify if needed, 'en+m7' is not a valid voice id
    engine.say(text)
    engine.runAndWait()


if __name__ == "__main__":
    text = extract_text("quotes.pdf")
    speak_text(text)
