import PyPDF2
import sys

def encrypt_pdf(input_pdf_path, output_pdf_path, password):
    try:
        print("Input PDF Path:", input_pdf_path)
        print("Output PDF Path:", output_pdf_path)
        print("Password:", password)

        with open(input_pdf_path, 'rb') as input_file:
            pdf_reader = PyPDF2.PdfReader(input_file)
            pdf_writer = PyPDF2.PdfWriter()

            # Check if the PDF is encrypted
            if pdf_reader.is_encrypted:
                print("The input PDF is already encrypted. Decrypting it first...")
                pdf_reader.decrypt("")  # Use an empty string if there's no password

            # Add pages to the writer
            for page_num in range(len(pdf_reader.pages) ):
                page = pdf_reader.pages[page_num]
                pdf_writer.add_page(page)
            
            # Encrypt the PDF
            pdf_writer.encrypt(user_password=password, owner_pwd=None, use_128bit=True)

            # Write the output
            with open(output_pdf_path, 'wb') as output_file:
                pdf_writer.write(output_file)

            print('PDF encrypted successfully')

    except Exception as e:
        print('An error occurred:', str(e))  # Print the actual error

if __name__ == "__main__":
    # input_pdf_path = 'src/sample.pdf'
    # output_pdf_path = 'src/result.pdf'
    # password = 'qwerty'
    input_pdf_path = sys.argv[1]
    output_pdf_path = sys.argv[2]
    password = sys.argv[3]
    # print(password)
    encrypt_pdf(input_pdf_path, output_pdf_path, password)
