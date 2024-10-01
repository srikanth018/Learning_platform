'''
Sample python script to demonstrate text extraction from PDF
'''
from PyPDF2 import PdfReader

pdfFileObj = open("quotes.pdf", "rb")

pdfReader = PdfReader(pdfFileObj)

mytext = ""

for pageNum in range(len(pdfReader.pages)):
    pageObj = pdfReader.pages[pageNum]
    mytext += pageObj.extract_text()

pdfFileObj.close()

print(mytext)
