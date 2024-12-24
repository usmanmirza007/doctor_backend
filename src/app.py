import PyPDF2
import sys
import os

def encrypt_pdf(input_pdf_path, output_pdf_path, password):
    try:
        # Log file paths and password
        print("Input PDF Path:", input_pdf_path)
        print("Output PDF Path:", output_pdf_path)
        print("Password:", password)

        # Ensure input file exists
        if not os.path.exists(input_pdf_path):
            print(f"Error: Input file '{input_pdf_path}' does not exist.")
            sys.exit(2)

        with open(input_pdf_path, 'rb') as input_file:
            pdf_reader = PyPDF2.PdfReader(input_file)
            pdf_writer = PyPDF2.PdfWriter()

            # Check if the PDF is encrypted
            if pdf_reader.is_encrypted:
                print("The input PDF is already encrypted. Attempting decryption...")
                pdf_reader.decrypt("")  # Use an empty string if there's no password

            # Add pages to the writer
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                pdf_writer.add_page(page)

            # Encrypt the PDF
            pdf_writer.encrypt(user_password=password, owner_pwd=None, use_128bit=True)

            # Write the output
            with open(output_pdf_path, 'wb') as output_file:
                pdf_writer.write(output_file)

            print('PDF encrypted successfully')
            sys.exit(0)

    except Exception as e:
        print(f'An error occurred: {e}')
        sys.exit(2)
def hello():
    print('hello')

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python app.py <input_pdf_path> <output_pdf_path> <password>")
        # sys.exit(2)

    input_pdf_path = sys.argv[1]
    output_pdf_path = sys.argv[2]
    password = sys.argv[3]
    print("sys fofofo:", sys.argv)
    # print("Output PDF Path 1:", output_pdf_path)
    # print("Password 1:", password)
    encrypt_pdf(input_pdf_path, output_pdf_path, password)
    # hello()



