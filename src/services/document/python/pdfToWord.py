import PyPDF2
from pdf2docx import Converter
import sys
import os

def pdf_to_word(input_pdf_path, output_word_path):
    try:
        # Check if the input PDF exists
        if not os.path.exists(input_pdf_path):
            print(f"Error: Input PDF file '{input_pdf_path}' does not exist.")
            sys.exit(2)

        # Get the total number of pages in the PDF using PyPDF2
        with open(input_pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            total_pages = len(pdf_reader.pages)
        
        # Create a converter object 
        cv = Converter(input_pdf_path)
        print(f"total {total_pages}")
        # Convert all pages (use total_pages for end)
        cv.convert(output_word_path, start=0, end=total_pages)

        print(f"PDF successfully converted to Word: {output_word_path}")
        sys.exit(0)

    except Exception as e:
        print(f"An error occurred during conversion: {e}")
        sys.exit(2)

if __name__ == "__main__":
    input_pdf_path = 'src/public/uploads/cardio.pdf'
    output_word_path = 'src/public/uploads/test.docx'
    pdf_to_word(input_pdf_path, output_word_path)

