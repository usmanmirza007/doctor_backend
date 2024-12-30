import PyPDF2
import sys
import os

def decrypt_pdf(input_pdf_path, output_pdf_path, password):
    try:
        # Ensure the input file exists
        if not os.path.exists(input_pdf_path):
            print(f"Error: Input file '{input_pdf_path}' does not exist.")
            sys.exit(2)

        with open(input_pdf_path, 'rb') as input_file:
            # Create a PDF Reader object
            pdf_reader = PyPDF2.PdfReader(input_file)

            # Check if the PDF is encrypted
            if not pdf_reader.is_encrypted:
                print("The input PDF is not encrypted.")
                sys.exit(0)

            # Try to decrypt the PDF
            if not pdf_reader.decrypt(password):
                print("Error: Incorrect password or unable to decrypt the PDF.")
                sys.exit(2)

            # Create a PDF Writer object
            pdf_writer = PyPDF2.PdfWriter()

            # Copy all pages to the writer
            for page_num in range(len(pdf_reader.pages)):
                pdf_writer.add_page(pdf_reader.pages[page_num])

            # Write the decrypted PDF to output
            with open(output_pdf_path, 'wb') as output_file:
                pdf_writer.write(output_file)

            print('PDF decrypted successfully!')
            sys.exit(0)

    except Exception as e:
        print(f'An error occurred: {e}')
        sys.exit(2)


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python decrypt_app.py <input_pdf_path> <output_pdf_path> <password>")
        sys.exit(2)

    input_pdf_path = sys.argv[1]
    output_pdf_path = sys.argv[2]
    password = sys.argv[3]

    decrypt_pdf(input_pdf_path, output_pdf_path, password)
